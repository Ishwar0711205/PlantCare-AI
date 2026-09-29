/**
 * Verified project facts.
 *
 * Everything in this file is read from the project's own training artefacts:
 *  - `model_results.json`                    verified validation metrics (/public)
 *  - `models/<name>/training_log.csv`        batch size, epochs, learning rate
 *  - `models/<name>/model_metadata.json`     training configuration
 *
 * No value here is estimated. Metrics that were never reported stay absent so
 * the UI can render them as "N/R" instead of inventing a number.
 */

export const PROJECT = {
  title: 'Plant Disease Classification Using Deep Learning',
  shortTitle: 'PlantCare AI',
  department: 'Department of Information Technology',
  institute: 'Vidyalankar Institute of Technology',
  academicYear: '2026–27',
  guide: 'Dr. Sushopti Gawade',
  team: ['Vinay Yadav', 'Akash Misale', 'Jay Jangam', 'Ishwar Garje'],
}

/** Order used by the validation-accuracy comparison chart. */
export const MODEL_ORDER = ['CNN', 'VGG16', 'MobileNetV2', 'ResNet50', 'EfficientNetB0']

/**
 * Architecture facts only. These descriptions deliberately make no claim about
 * which model is best — that judgement belongs to the reported metrics.
 *
 * `accent` paints the bars and swatches, so it is free to be a bright, saturated
 * hue. `accentInk` is the same hue darkened to clear WCAG AA (>= 4.5:1) on the
 * white card, and is what accuracy numbers are printed in.
 */
export const MODEL_META = {
  CNN: {
    type: 'custom',
    input: '128 × 128',
    accent: '#0d7d4e',
    accentInk: '#0d7d4e',
    summary: 'Convolutional network designed and trained from scratch on PlantVillage leaf images.',
    detail:
      'A custom CNN baseline: convolution and pooling layers followed by dense classification, trained from randomly initialised weights at 128 × 128 resolution.',
  },
  ResNet50: {
    type: 'transfer',
    input: '224 × 224',
    accent: '#0891b2',
    accentInk: '#0e7490',
    summary: '50-layer residual network with skip connections, fine-tuned from ImageNet weights.',
    detail:
      'Residual blocks learn very deep features without vanishing gradients. The ImageNet backbone is adapted to 224 × 224 leaf inputs and fine-tuned on the 38 classes.',
  },
  EfficientNetB0: {
    type: 'transfer',
    input: '224 × 224',
    accent: '#189c61',
    accentInk: '#046c4e',
    summary: 'Compound-scaled network balancing depth, width and resolution, fine-tuned from ImageNet.',
    detail:
      'EfficientNet scales depth, width and input resolution together. The B0 variant keeps a small parameter count while transferring ImageNet features to leaf classification.',
  },
  MobileNetV2: {
    type: 'transfer',
    input: '224 × 224',
    accent: '#22d3ee',
    accentInk: '#0e7490',
    summary: 'Lightweight network built from inverted residual blocks for efficient inference.',
    detail:
      'MobileNetV2 uses inverted residuals and linear bottlenecks to stay cheap to run, which makes the architecture practical for mobile and low-power deployment.',
  },
  VGG16: {
    type: 'transfer',
    input: '224 × 224',
    accent: '#36b97b',
    accentInk: '#046c4e',
    summary: '16-layer VGG network of stacked 3 × 3 convolutions, fine-tuned from ImageNet weights.',
    detail:
      'VGG16 replaces large kernels with stacks of 3 × 3 convolutions. The full convolutional stack is fine-tuned on PlantVillage images at 224 × 224.',
  },
}

/** Values confirmed by the training logs and model metadata JSON files. */
export const TECH_CONFIG = [
  { key: 'language', value: 'Python 3', icon: 'code' },
  { key: 'framework', value: 'TensorFlow / Keras', icon: 'layers' },
  { key: 'environment', value: 'Google Colab', icon: 'cloud' },
  { key: 'optimizer', value: 'Adam', icon: 'activity' },
  { key: 'loss', value: 'Categorical Cross-Entropy', icon: 'chart' },
  { key: 'batchSize', value: '32', icon: 'grid' },
  { key: 'maxEpochs', value: '10', icon: 'refresh' },
  { key: 'transferLr', value: '0.0001', icon: 'sliders' },
  { key: 'classes', value: '38', icon: 'database' },
]

/** Research pipeline, in execution order. */
export const METHOD_STEPS = [
  'dataset',
  'organize',
  'split',
  'preprocess',
  'augment',
  'models',
  'classify',
  'evaluate',
  'interface',
]

/** Input resolution per architecture — the backend resizes to the model's own shape. */
export const MODEL_INPUT = {
  CNN: '128 × 128',
  ResNet50: '224 × 224',
  EfficientNetB0: '224 × 224',
  MobileNetV2: '224 × 224',
  VGG16: '224 × 224',
}

export const DATASET = {
  name: 'PlantVillage',
  classes: 38,
  totalImages: 162916,
  trainImages: 130318,
  valImages: 32598,
  split: '80 / 20',
}

export function formatImages(n) {
  return Number(n).toLocaleString('en-US')
}

/** Percentage of a metric, or the "not reported" marker when it is null. */
export function pct(value, notReported = 'N/R') {
  if (value === null || value === undefined) return notReported
  return `${Number(value).toFixed(2)}%`
}
