import React from "react";

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, className = "" }) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Original Seal Emblem: Crown + Circular Seal + Bold Stylized ₹2 */}
      <svg
        viewBox="0 0 88 96"
        className={compact ? "w-10 h-11 shrink-0" : "w-12 h-13 shrink-0"}
        aria-hidden="true"
      >
        {/* Small Crown */}
        <path
          d="M27 20 L31 9 L39 16 L44 6 L49 16 L57 9 L61 20 Z"
          fill="#B68D40"
          stroke="#111111"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="31" cy="8" r="2" fill="#781C24" />
        <circle cx="44" cy="5" r="2.2" fill="#781C24" />
        <circle cx="57" cy="8" r="2" fill="#781C24" />
        <rect x="27" y="20" width="34" height="4" rx="1" fill="#781C24" stroke="#111111" strokeWidth="1.4" />

        {/* Circular Certification Seal */}
        <circle
          cx="44"
          cy="56"
          r="32"
          fill="#781C24"
          stroke="#111111"
          strokeWidth="2.5"
        />
        <circle
          cx="44"
          cy="56"
          r="27"
          fill="none"
          stroke="#B68D40"
          strokeWidth="1.8"
          strokeDasharray="3 2.5"
        />
        <circle
          cx="44"
          cy="56"
          r="22"
          fill="#F5ECD7"
          stroke="#B68D40"
          strokeWidth="1.6"
        />

        {/* Bold Stylized ₹2 */}
        <text
          x="44"
          y="64"
          textAnchor="middle"
          fill="#111111"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="-1"
        >
          ₹2
        </text>
        {/* Subtle royal underline accent */}
        <path
          d="M31 69 Q44 73 57 69"
          fill="none"
          stroke="#781C24"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Custom Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-display font-black tracking-tight text-[#111111] ${
              compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
            }`}
          >
            2 KA INSAAN
          </span>
        </div>
        <span className="font-mono-code text-[10px] uppercase tracking-[0.22em] text-[#781C24] font-bold mt-1">
          Aukaat Authority • Est. Today
        </span>
      </div>
    </div>
  );
};

export const GoldCertificationSeal: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => {
  // Generate scalloped sunburst points
  const points: string[] = [];
  const totalTeeth = 24;
  const cx = 60;
  const cy = 60;
  for (let i = 0; i < totalTeeth * 2; i++) {
    const angle = (i * Math.PI) / totalTeeth;
    const r = i % 2 === 0 ? 55 : 49;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* Ribbon tails */}
      <path d="M40 94 L32 117 L45 110 L53 118 L56 96 Z" fill="#781C24" stroke="#111111" strokeWidth="1.5" />
      <path d="M80 94 L88 117 L75 110 L67 118 L64 96 Z" fill="#781C24" stroke="#111111" strokeWidth="1.5" />

      {/* Scalloped Gold Seal */}
      <polygon
        points={points.join(" ")}
        fill="#B68D40"
        stroke="#111111"
        strokeWidth="1.8"
      />
      <circle cx="60" cy="60" r="42" fill="#F5ECD7" stroke="#781C24" strokeWidth="2" />
      <circle
        cx="60"
        cy="60"
        r="37"
        fill="none"
        stroke="#B68D40"
        strokeWidth="1.5"
        strokeDasharray="2.5 2.5"
      />
      <circle cx="60" cy="60" r="25" fill="#781C24" />

      {/* Crown inside seal */}
      <path
        d="M50 30 L52 24 L57 28 L60 22 L63 28 L68 24 L70 30 Z"
        fill="#B68D40"
      />

      <text
        x="60"
        y="65"
        textAnchor="middle"
        fill="#F5ECD7"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="900"
        fontSize="19"
      >
        ₹2
      </text>
      <text
        x="60"
        y="76"
        textAnchor="middle"
        fill="#B68D40"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="700"
        fontSize="6.5"
        letterSpacing="1.2"
      >
        CERTIFIED
      </text>
    </svg>
  );
};

export const ChiefSignatureSVG: React.FC<{ className?: string }> = ({ className = "w-36 h-11" }) => (
  <svg viewBox="0 0 180 56" className={className} aria-hidden="true">
    <path
      d="M14 38 C22 14, 34 10, 32 32 C30 46, 46 20, 56 26 C62 30, 54 44, 68 32 C78 24, 86 16, 90 29 C93 38, 106 20, 118 28 C126 34, 134 24, 146 27 C156 29, 165 22, 170 24"
      fill="none"
      stroke="#111111"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 44 Q92 38 158 43"
      fill="none"
      stroke="#781C24"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
