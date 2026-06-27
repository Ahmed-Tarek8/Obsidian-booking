"use client";

export function ObsidianSchedulingCore() {
  return (
    <div className="scheduling-core-wrapper">
      <div className="core-float">
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Outer orbit ring */}
          <circle
            cx="160"
            cy="160"
            r="148"
            stroke="rgba(212,175,55,0.08)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          {/* Middle orbit ring */}
          <circle
            cx="160"
            cy="160"
            r="120"
            stroke="rgba(212,175,55,0.06)"
            strokeWidth="1"
            strokeDasharray="2 12"
          />
          {/* Inner orbit ring */}
          <circle
            cx="160"
            cy="160"
            r="88"
            stroke="rgba(212,175,55,0.04)"
            strokeWidth="1"
          />

          {/* Outer glass panel — octagonal prism */}
          <polygon
            points="160,28 232,52 268,120 268,200 232,268 160,292 88,268 52,200 52,120 88,52"
            fill="rgba(10,10,10,0.85)"
            stroke="rgba(212,175,55,0.18)"
            strokeWidth="1"
          />

          {/* Inner glass panel — smaller octagon */}
          <polygon
            points="160,52 212,72 240,128 240,192 212,248 160,268 108,248 80,192 80,128 108,72"
            fill="rgba(14,14,14,0.9)"
            stroke="rgba(212,175,55,0.1)"
            strokeWidth="1"
          />

          {/* Core calendar grid — horizontal lines */}
          <line x1="100" y1="130" x2="220" y2="130" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5" />
          <line x1="100" y1="148" x2="220" y2="148" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5" />
          <line x1="100" y1="166" x2="220" y2="166" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5" />
          <line x1="100" y1="184" x2="220" y2="184" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5" />
          <line x1="100" y1="202" x2="220" y2="202" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5" />

          {/* Core calendar grid — vertical lines */}
          <line x1="124" y1="118" x2="124" y2="214" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5" />
          <line x1="148" y1="118" x2="148" y2="214" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5" />
          <line x1="160" y1="118" x2="160" y2="214" stroke="rgba(212,175,55,0.2)" strokeWidth="0.75" />
          <line x1="172" y1="118" x2="172" y2="214" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5" />
          <line x1="196" y1="118" x2="196" y2="214" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5" />

          {/* Time slot bars — filled (booked) */}
          <rect x="126" y="130" width="20" height="6" rx="2" fill="rgba(212,175,55,0.25)" />
          <rect x="174" y="148" width="20" height="6" rx="2" fill="rgba(212,175,55,0.25)" />
          <rect x="150" y="166" width="20" height="6" rx="2" fill="rgba(212,175,55,0.25)" />
          <rect x="198" y="184" width="20" height="6" rx="2" fill="rgba(212,175,55,0.25)" />

          {/* Time slot bars — highlighted (selected/active) */}
          <rect x="150" y="130" width="20" height="6" rx="2" fill="rgba(212,175,55,0.6)" />
          <rect x="126" y="184" width="20" height="6" rx="2" fill="rgba(212,175,55,0.45)" />

          {/* Central booking reference indicator */}
          <rect x="140" y="145" width="40" height="40" rx="4" fill="rgba(212,175,55,0.06)" stroke="rgba(212,175,55,0.2)" strokeWidth="1" />
          <text x="160" y="161" textAnchor="middle" fill="rgba(212,175,55,0.7)" fontSize="8" fontFamily="monospace" fontWeight="bold">0833</text>
          <text x="160" y="174" textAnchor="middle" fill="rgba(212,175,55,0.35)" fontSize="6" fontFamily="monospace">PENDING</text>

          {/* Orbiting signal dots */}
          <circle cx="160" cy="12" r="3" fill="rgba(212,175,55,0.5)">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 160 160"
              to="360 160 160"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="160" cy="12" r="1.5" fill="rgba(212,175,55,0.8)">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 160 160"
              to="360 160 160"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="308" cy="160" r="2.5" fill="rgba(212,175,55,0.4)">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="90 160 160"
              to="450 160 160"
              dur="28s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="160" cy="308" r="2" fill="rgba(212,175,55,0.35)">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="180 160 160"
              to="540 160 160"
              dur="24s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="12" cy="160" r="2" fill="rgba(212,175,55,0.3)">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="270 160 160"
              to="630 160 160"
              dur="32s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Gold rim highlights — top */}
          <line x1="160" y1="28" x2="200" y2="40" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="160" y1="28" x2="120" y2="40" stroke="rgba(212,175,55,0.25)" strokeWidth="1" strokeLinecap="round" />

          {/* Gold rim highlights — right */}
          <line x1="268" y1="120" x2="280" y2="145" stroke="rgba(212,175,55,0.3)" strokeWidth="1" strokeLinecap="round" />

          {/* Gold rim highlights — bottom */}
          <line x1="160" y1="292" x2="185" y2="278" stroke="rgba(212,175,55,0.2)" strokeWidth="1" strokeLinecap="round" />
          <line x1="160" y1="292" x2="135" y2="278" stroke="rgba(212,175,55,0.15)" strokeWidth="1" strokeLinecap="round" />

          {/* Inner shimmer lines */}
          <line x1="140" y1="80" x2="155" y2="80" stroke="rgba(212,175,55,0.06)" strokeWidth="1" strokeLinecap="round" />
          <line x1="165" y1="80" x2="180" y2="80" stroke="rgba(212,175,55,0.04)" strokeWidth="1" strokeLinecap="round" />
          <line x1="140" y1="240" x2="155" y2="240" stroke="rgba(212,175,55,0.04)" strokeWidth="1" strokeLinecap="round" />
          <line x1="165" y1="240" x2="180" y2="240" stroke="rgba(212,175,55,0.06)" strokeWidth="1" strokeLinecap="round" />

          {/* Corner accent dots */}
          <circle cx="160" cy="28" r="1.5" fill="rgba(212,175,55,0.5)" />
          <circle cx="268" cy="160" r="1.5" fill="rgba(212,175,55,0.35)" />
          <circle cx="160" cy="292" r="1.5" fill="rgba(212,175,55,0.35)" />
          <circle cx="52" cy="160" r="1.5" fill="rgba(212,175,55,0.35)" />
        </svg>
      </div>
    </div>
  );
}