const base = (props) => ({
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...props,
})

const make = (Component) =>
  function Icon({ size = 24, className = '', ...rest }) {
    const svgProps = base({ width: size, height: size })
    return (
      <svg {...svgProps} {...rest} className={className}>
        <Component />
      </svg>
    )
  }

const LeafIcon = make(() => (
  <>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </>
))

const UploadIcon = make(() => (
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M12 16V8" />
    <path d="m8 12 4-4 4 4" />
  </>
))

const CloudUploadIcon = make(() => (
  <>
    <path d="M16 16a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.6 1.5A4 4 0 0 0 7 16h9Z" />
    <path d="M12 13v5" />
    <path d="m9.5 15.5 2.5-2.5 2.5 2.5" />
  </>
))

const MicroscopeIcon = make(() => (
  <>
    <path d="M6 18h8" />
    <path d="M3 22h18" />
    <path d="M14 22a7 7 0 1 0 0-14h-1" />
    <path d="M9 14h2" />
    <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
    <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
  </>
))

const ScanIcon = make(() => (
  <>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </>
))

const CheckCircleIcon = make(() => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 5-5" />
  </>
))

const BookIcon = make(() => (
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </>
))

const BookOpenIcon = make(() => (
  <>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </>
))

const SproutIcon = make(() => (
  <>
    <path d="M7 20h10" />
    <path d="M12 20v-7" />
    <path d="M12 13c0-3 2.5-5 6-5 0 3-2.5 5-6 5Z" />
    <path d="M12 10c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z" />
  </>
))

const ShieldIcon = make(() => (
  <>
    <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </>
))

const SearchIcon = make(() => (
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </>
))

const GlobeIcon = make(() => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
  </>
))

const MenuIcon = make(() => (
  <>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </>
))

const CloseIcon = make(() => (
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>
))

const ArrowRight = make(() => (
  <>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </>
))

const ArrowLeft = make(() => (
  <>
    <path d="M19 12H5" />
    <path d="m11 18-6-6 6-6" />
  </>
))

const ChevronDown = make(() => (
  <>
    <path d="m6 9 6 6 6-6" />
  </>
))

const TractorIcon = make(() => (
  <>
    <path d="M3 17v-4a2 2 0 0 1 2-2h11l3-4v8" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
    <path d="M3 20h18" />
    <path d="M9 7h2" />
  </>
))

const GraduationIcon = make(() => (
  <>
    <path d="M22 10 12 5 2 10l10 5 10-5Z" />
    <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    <path d="M22 10v6" />
  </>
))

const FlaskIcon = make(() => (
  <>
    <path d="M10 2v6L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 8V2" />
    <path d="M8 2h8" />
    <path d="M7 15h10" />
  </>
))

const CameraIcon = make(() => (
  <>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
    <circle cx="12" cy="13" r="3" />
  </>
))

const UsersIcon = make(() => (
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
))

const AlertIcon = make(() => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </>
))

const ChartIcon = make(() => (
  <>
    <path d="M3 3v18h18" />
    <path d="m7 15 3-4 3 2 5-7" />
  </>
))

const CpuIcon = make(() => (
  <>
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 2v3" />
    <path d="M15 2v3" />
    <path d="M9 19v3" />
    <path d="M15 19v3" />
    <path d="M2 9h3" />
    <path d="M2 15h3" />
    <path d="M19 9h3" />
    <path d="M19 15h3" />
  </>
))

const HeartIcon = make(() => (
  <>
    <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3.4 1-4.5 2.5C10.9 4 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
  </>
))

const LoginIcon = make(() => (
  <>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
  </>
))

const LogoutIcon = make(() => (
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </>
))

const GridIcon = make(() => (
  <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </>
))

const ImageIcon = make(() => (
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
  </>
))

const LockIcon = make(() => (
  <>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>
))

const BrainIcon = make(() => (
  <>
    <path d="M9.5 3a3 3 0 0 0-3 3 3 3 0 0 0-1.5 5.6A3 3 0 0 0 6.5 17a3 3 0 0 0 3 3V3Z" />
    <path d="M14.5 3a3 3 0 0 1 3 3 3 3 0 0 1 1.5 5.6A3 3 0 0 1 17.5 17a3 3 0 0 1-3 3V3Z" />
    <path d="M12 3v18" />
  </>
))

const ActivityIcon = make(() => (
  <>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </>
))

const DatabaseIcon = make(() => (
  <>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
    <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </>
))

const SettingsIcon = make(() => (
  <>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H1a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 2.6 7a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H7a1.7 1.7 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V7a1.7 1.7 0 0 0 1.5 1H23a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </>
))

const InfoIcon = make(() => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </>
))

const LayersIcon = make(() => (
  <>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 17 9 5 9-5" />
  </>
))

const RefreshIcon = make(() => (
  <>
    <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
    <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M3 21v-5h5" />
  </>
))

const CodeIcon = make(() => (
  <>
    <path d="m16 18 6-6-6-6" />
    <path d="m8 6-6 6 6 6" />
  </>
))

const CloudIcon = make(() => (
  <>
    <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.2 11.2 3.9 3.9 0 0 0 7 19h10.5Z" />
  </>
))

const HistoryIcon = make(() => (
  <>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v4h4" />
    <path d="M12 7.5V12l3 2" />
  </>
))

const UserIcon = make(() => (
  <>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </>
))

export {
  LeafIcon,
  UploadIcon,
  CloudUploadIcon,
  MicroscopeIcon,
  ScanIcon,
  CheckCircleIcon,
  BookIcon,
  BookOpenIcon,
  SproutIcon,
  ShieldIcon,
  SearchIcon,
  GlobeIcon,
  MenuIcon,
  CloseIcon,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  TractorIcon,
  GraduationIcon,
  FlaskIcon,
  CameraIcon,
  UsersIcon,
  AlertIcon,
  ChartIcon,
  CpuIcon,
  HeartIcon,
  LoginIcon,
  LogoutIcon,
  GridIcon,
  ImageIcon,
  LockIcon,
  BrainIcon,
  ActivityIcon,
  DatabaseIcon,
  SettingsIcon,
  InfoIcon,
  LayersIcon,
  RefreshIcon,
  CodeIcon,
  CloudIcon,
  HistoryIcon,
  UserIcon,
}
