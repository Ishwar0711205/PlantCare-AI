"""
PlantCare AI — model loading compatibility helpers.

The five `.keras` models were saved with Keras 3.13.2, but this machine runs
Keras 3.12.4 (Python 3.10). This module bridges the two versions:

1. `Dense` layers in the saved configs carry a `quantization_config` key that
   Keras 3.12.4 does not understand (added in 3.13). It is stripped on load.

2. `ResNet50.keras` embeds a custom `res_net_preprocess` layer saved under the
   registered name `PlantDisease>ResNetPreprocess`. A compatible implementation
   that mirrors `keras.applications.resnet50.preprocess_input` is re-registered
   so the model can be deserialized.

3. `VGG16.keras` embeds `Lambda(preprocess_input)` saved with `module:
   'builtins'`. It is resolved by passing a matching `custom_objects` entry to
   `load_model`.

All transfer-learning models perform their own preprocessing inside the graph
(`Rescaling` / `Normalization` / `ResNetPreprocess` / `Lambda`), so the serving
layer only resizes to 224x224 and feeds raw RGB in the range [0, 255]. The
custom CNN expects a 128x128 image normalized to [0, 1] via ``/255``.
"""

from pathlib import Path

import tensorflow as tf
import keras
from keras import layers

# ── Fix 1: strip Keras 3.13 quantization_config from Dense during load ──────
_ORIG_DENSE_INIT = layers.Dense.__init__


def _dense_init_compat(self, *args, **kwargs):
    kwargs.pop("quantization_config", None)
    _ORIG_DENSE_INIT(self, *args, **kwargs)


layers.Dense.__init__ = _dense_init_compat
if tf.keras.layers.Dense is not layers.Dense:
    tf.keras.layers.Dense.__init__ = _dense_init_compat

# ── Fix 2: ResNet50 custom preprocessing layer ───────────────────────────────
@keras.saving.register_keras_serializable(package="PlantDisease")
class ResNetPreprocess(layers.Layer):
    """Mirrors keras.applications.resnet50.preprocess_input (BGR + mean)."""

    def call(self, x):
        x = x[..., ::-1]
        mean = tf.constant([103.939, 116.779, 123.68], dtype=x.dtype)
        return x - mean

# ── Fix 3: VGG16 Lambda('preprocess_input') under module 'builtins' ──────────
VGG16_CUSTOM_OBJECTS = {
    "preprocess_input": keras.applications.vgg16.preprocess_input
}


def load_model(weight_path: Path) -> tf.keras.Model:
    """Load a saved .keras model, applying any compatibility fixes it needs."""
    path = str(weight_path)
    if Path(weight_path).name.startswith("VGG16"):
        return tf.keras.models.load_model(path, custom_objects=VGG16_CUSTOM_OBJECTS)
    return tf.keras.models.load_model(path)