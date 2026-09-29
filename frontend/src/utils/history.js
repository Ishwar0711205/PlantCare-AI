const HISTORY_KEY = 'plantcare_history'

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []
  } catch {
    return []
  }
}

export function addToHistory(entry) {
  const list = getHistory()
  list.unshift(entry)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 30)))
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

export function removeHistoryEntry(index) {
  const list = getHistory()
  list.splice(index, 1)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
}

export function thumbnailFor(file, maxSide = 160) {
  if (!file || !/^image\//.test(file.type)) return Promise.resolve(null)
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.72))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}

export function normalizeKey(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

export function matchInfoKey(className, infoMap) {
  const direct = infoMap[className]
  if (direct) return className
  const norm = normalizeKey(className)
  const found = Object.keys(infoMap).find((k) => normalizeKey(k) === norm)
  return found || null
}