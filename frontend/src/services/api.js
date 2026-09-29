// PlantCare AI service layer.
// The React frontend talks to a separate inference backend through this module.
// When VITE_USE_MOCK is 'true' a clean mock simulates the same response shape
// so the UI can be previewed without a running backend.
// Default: real API mode (backend.py running on localhost:8000)

const API_BASE = import.meta.env.VITE_API_BASE || ''
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// When API_BASE is empty the frontend goes through Vite's own proxy and all
// backend routes are namespaced under /api so static assets (e.g.
// /healthy_images/*) are never confused with API routes.
const api = (path) => (API_BASE ? `${API_BASE}${path}` : `/api${path}`)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const MOCK_CLASSES = [
  { key: 'Tomato___Early_blight', confidence: 0.946 },
  { key: 'Tomato___healthy', confidence: 0.972 },
  { key: 'Potato___Early_blight', confidence: 0.913 },
  { key: 'Tomato___Late_blight', confidence: 0.884 },
  { key: 'Apple___Apple_scab', confidence: 0.931 },
  { key: 'Corn_(maize)___Common_rust_', confidence: 0.955 },
  { key: 'Grape___Black_rot', confidence: 0.876 },
  { key: 'Squash___Powdery_mildew', confidence: 0.901 },
  { key: 'Tomato___Leaf_Mold', confidence: 0.907 },
  { key: 'Strawberry___Leaf_scorch', confidence: 0.918 },
  { key: 'Apple___Black_rot', confidence: 0.642 },
  { key: 'Potato___healthy', confidence: 0.959 },
]

async function mockPredict(imageFile, model) {
  await delay(1400 + Math.random() * 900)
  const seed = imageFile.name + imageFile.size
  const pick = MOCK_CLASSES[hashString(seed) % MOCK_CLASSES.length]
  return {
    class: pick.key,
    confidence: pick.confidence,
    model: model || 'EfficientNetB0',
  }
}


// --- API Fetch Wrapper with Auth ---
function getAuthHeaders(isFormData = false) {
  const headers = {}
  if (!isFormData) headers['Content-Type'] = 'application/json'
  try {
    const user = JSON.parse(localStorage.getItem('plantcare_user'))
    if (user && user.token) {
      headers['Authorization'] = `Bearer ${user.token}`
    }
  } catch (e) {}
  return headers
}

export async function predict(imageFile, model) {
  if (USE_MOCK) return mockPredict(imageFile, model)

  const form = new FormData()
  form.append('image', imageFile)
  form.append('model', model)

  const res = await fetch(api('/predict'), { 
    method: 'POST', 
    headers: getAuthHeaders(true),
    body: form 
  })
  if (!res.ok) throw new Error(`Prediction failed with status ${res.status}`)
  return res.json()
}

export const predictDisease = predict

// --- Auth (Backend integration) ---

export async function login(email, password) {
  const res = await fetch(api('/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('invalid_credentials')
  return res.json()
}

export async function signup(name, email, password) {
  const res = await fetch(api('/signup'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) throw new Error('account_exists')
  return res.json()
}

export const loginUser = login
export const signupUser = signup

// --- History API ---
export async function savePrediction(entry) {
  if (USE_MOCK) return
  const res = await fetch(api('/history'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(entry),
  })
  if (!res.ok) console.error('Failed to save history')
}

export async function getHistoryApi() {
  if (USE_MOCK) return []
  const res = await fetch(api('/history'), {
    headers: getAuthHeaders(),
  })
  if (!res.ok) return []
  return res.json()
}

export async function deleteHistoryApi(id) {
  if (USE_MOCK) return
  await fetch(api(`/history/${id}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
}