import useInView from '../hooks/useInView'

export default function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const { ref, inView } = useInView()
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}