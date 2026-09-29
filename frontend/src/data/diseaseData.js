import { useEffect, useState } from 'react'

let cache = null
let inflight = null

async function loadAll() {
  if (cache) return cache
  if (!inflight) {
    inflight = Promise.all([
      fetch('/class_names.json').then((r) => r.json()),
      fetch('/plant_info.json').then((r) => r.json()),
      fetch('/model_results.json').then((r) => r.json()),
    ]).then(([classes, info, results]) => {
      cache = { classes, info, results }
      return cache
    })
  }
  return inflight
}

export function useData() {
  const [data, setData] = useState(cache)
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    loadAll()
      .then((d) => {
        if (mounted) {
          setData(d)
          setLoading(false)
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e)
          setLoading(false)
        }
      })
    return () => {
      mounted = false
    }
  }, [])

  return { data, loading, error }
}

export function isHealthyKey(key) {
  return key.split('___')[1] === 'healthy'
}

export function plantNameFromKey(key) {
  return key.split('___')[0].replace(/_/g, ' ').replace('( including sour)', '(including sour)')
}

export function conditionFromKey(key) {
  const parts = key.split('___')
  if (parts.length < 2) return key
  return parts[1].replace(/_/g, ' ').trim()
}

export function cleanSpeciesName(key) {
  return key
    .split('___')[0]
    .replace(/\(/g, ' (')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}