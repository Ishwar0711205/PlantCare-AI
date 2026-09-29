import json
import numpy as np
from PIL import Image
import tensorflow as tf
from fastapi import HTTPException
from pathlib import Path
from .. import model_utils

ROOT = Path(__file__).parent.parent.parent
MODEL_DIR = ROOT / "models"

with open(ROOT / "frontend" / "public" / "class_names.json", encoding="utf-8") as f:
    CLASSES: list = json.load(f)

MODEL_PATHS = {}
for name in ["CNN", "EfficientNetB0", "ResNet50", "MobileNetV2", "VGG16"]:
    p = MODEL_DIR / f"{name}.keras"
    if not p.exists():
        p = MODEL_DIR / name / f"{name}.keras"
    if p.exists():
        MODEL_PATHS[name] = p

_cache = {}

def get_model(name: str) -> tf.keras.Model:
    if name not in MODEL_PATHS:
        raise HTTPException(404, f"Model '{name}' not found.")
    if name not in _cache:
        print(f"[PlantCare] Loading {name}...")
        _cache[name] = model_utils.load_model(MODEL_PATHS[name])
        print(f"[PlantCare] {name} ready")
    return _cache[name]

def preprocess(img: Image.Image, model_name: str, model: tf.keras.Model) -> np.ndarray:
    _, h, w, _ = model.input_shape
    rgb = img.convert("RGB").resize((w, h), Image.LANCZOS)
    arr = np.array(rgb, dtype=np.float32)
    if model_name == "CNN":
        arr = arr / 255.0
    return np.expand_dims(arr, 0)
