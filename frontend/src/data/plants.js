export const healthyPlants = [
  { key: 'Apple', names: { en: 'Apple', hi: 'सेब', mr: 'सफरचंद' }, image: '/healthy_images/Apple_healthy.png' },
  { key: 'Blueberry', names: { en: 'Blueberry', hi: 'ब्लूबेरी', mr: 'ब्लूबेरी' }, image: '/healthy_images/Blueberry_healthy.png' },
  { key: 'Cherry (including sour)', names: { en: 'Cherry', hi: 'चेरी', mr: 'चेरी' }, image: '/healthy_images/Cherry_including_sour_healthy.png' },
  { key: 'Corn (maize)', names: { en: 'Corn (Maize)', hi: 'मक्का', mr: 'मका' }, image: '/healthy_images/Corn_maize_healthy.png' },
  { key: 'Grape', names: { en: 'Grape', hi: 'अंगूर', mr: 'द्राक्ष' }, image: '/healthy_images/Grape_healthy.png' },
  { key: 'Orange', names: { en: 'Orange', hi: 'संतरा', mr: 'संत्री' }, image: '/healthy_images/Orange_healthy.png' },
  { key: 'Peach', names: { en: 'Peach', hi: 'आड़ू', mr: 'आडू' }, image: '/healthy_images/Peach_healthy.png' },
  { key: 'Pepper, bell', names: { en: 'Bell Pepper', hi: 'शिमला मिर्च', mr: 'ढोबळी मिरची' }, image: '/healthy_images/Pepper_bell_healthy.png' },
  { key: 'Potato', names: { en: 'Potato', hi: 'आलू', mr: 'बटाटा' }, image: '/healthy_images/Potato_healthy.png' },
  { key: 'Raspberry', names: { en: 'Raspberry', hi: 'रास्पबेरी', mr: 'रास्पबेरी' }, image: '/healthy_images/Raspberry_healthy.png' },
  { key: 'Soybean', names: { en: 'Soybean', hi: 'सोयाबीन', mr: 'सोयाबीन' }, image: '/healthy_images/Soybean_healthy.png' },
  { key: 'Squash', names: { en: 'Squash', hi: 'स्क्वैश', mr: 'स्क्वॅश' }, image: '/healthy_images/Squash_healthy.png' },
  { key: 'Strawberry', names: { en: 'Strawberry', hi: 'स्ट्रॉबेरी', mr: 'स्ट्रॉबेरी' }, image: '/healthy_images/Strawberry_healthy.png' },
  { key: 'Tomato', names: { en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो' }, image: '/healthy_images/Tomato_healthy.png' },
]

const toKey = (str) => String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '')

const IMAGE_BY_KEY = Object.fromEntries(healthyPlants.map((p) => [toKey(p.key), p.image]))

export function healthyImageFor(plantOrClassKey) {
  const name = String(plantOrClassKey || '').split('___')[0].replace(/_/g, ' ')
  const match = healthyPlants.find((p) => toKey(p.key) === toKey(name)) || healthyPlants.find((p) => toKey(p.key) === toKey(plantOrClassKey))
  if (match) return match.image
  return IMAGE_BY_KEY[toKey(name)] || null
}

export const YOUR_PLANTS = ['Apple', 'Blueberry', 'Cherry', 'Corn', 'Grape', 'Orange', 'Peach', 'Pepper', 'Potato', 'Raspberry', 'Soybean', 'Squash', 'Strawberry', 'Tomato']