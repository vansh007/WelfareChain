/** WelfareChain brand mark — shield + chain link + marigold (SDD §7.1) */
export default function Logo({ size = 40, className = "" }) {
  return (
    <svg
      className={"wc-logo " + className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wc-shield" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1b2440" />
          <stop offset="1" stopColor="#2d3a5f" />
        </linearGradient>
        <linearGradient id="wc-gold" x1="14" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0b429" />
          <stop offset="1" stopColor="#e8a019" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#wc-shield)" />
      <path
        d="M24 8L34 12.5V21.5C34 28.2 30.1 33.4 24 36.5C17.9 33.4 14 28.2 14 21.5V12.5L24 8Z"
        stroke="url(#wc-gold)"
        strokeWidth="2.2"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="22" r="3.2" fill="#e8a019" opacity="0.9" />
      <path
        d="M18.5 24.5C18.5 24.5 20.5 27 24 27C27.5 27 29.5 24.5 29.5 24.5"
        stroke="#e8a019"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 32.5H20M28 32.5H32"
        stroke="#9fb0d6"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
