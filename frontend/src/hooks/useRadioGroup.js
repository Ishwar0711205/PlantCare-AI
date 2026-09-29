import { useCallback, useRef } from 'react'

/**
 * WAI-ARIA radio-group keyboard behaviour for the model cards.
 *
 * A group of radios is a single tab stop: the checked card holds tabIndex 0 and
 * the rest hold -1, so Tab moves past the whole group instead of through every
 * card. Arrow keys move focus *and* selection together, and Home / End jump to
 * the first / last enabled option.
 *
 * `isDisabled` is called for every option on each render and is expected to be a
 * cheap predicate, so callers can pass an inline arrow function.
 */
export default function useRadioGroup(options, selected, onSelect, isDisabled = () => false) {
  const nodes = useRef({})

  const enabled = options.filter((id) => !isDisabled(id))
  // If the checked id is missing or disabled, fall back to the first enabled
  // option so the group always keeps exactly one tab stop.
  const tabStop = enabled.includes(selected) ? selected : enabled[0]

  const setNode = useCallback((id, el) => {
    nodes.current[id] = el
  }, [])

  function focus(id) {
    nodes.current[id]?.focus()
  }

  function moveTo(id) {
    if (!id) return
    onSelect(id)
    focus(id)
  }

  function step(fromId, delta) {
    if (!enabled.length) return
    const i = enabled.indexOf(fromId)
    // A disabled or unselected origin has no meaningful index, so start from the
    // tab stop instead of computing an offset from -1.
    const from = i === -1 ? enabled.indexOf(tabStop) : i
    moveTo(enabled[(from + delta + enabled.length) % enabled.length])
  }

  function onKeyDown(event, id) {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        step(id, 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        step(id, -1)
        break
      case 'Home':
        event.preventDefault()
        moveTo(enabled[0])
        break
      case 'End':
        event.preventDefault()
        moveTo(enabled[enabled.length - 1])
        break
      default:
        break
    }
  }

  return {
    /** Spread onto a card as `ref={setNode.bind(null, id)}` — see ModelCard. */
    setNode,
    tabIndexFor: (id) => (id === tabStop ? 0 : -1),
    onKeyDown,
  }
}
