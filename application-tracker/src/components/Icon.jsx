export default function Icon({ name }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (name === 'calendar') {
    return (
      <svg {...common}>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
        <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
      </svg>
    )
  }

  if (name === 'check') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M8.5 12.2 11 14.7 15.7 9.5" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}
