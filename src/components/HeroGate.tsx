export default function HeroGate() {
  return (
    <svg
      className="gate"
      viewBox="0 0 520 340"
      aria-label="Animasi gerbang turnstile: token tantangan masuk dan token valid keluar"
    >
      <path d="M0 170H200M320 170H520" stroke="var(--line)" strokeWidth="2" />
      <circle
        className="pulse"
        cx="260"
        cy="170"
        r="70"
        fill="none"
        stroke="var(--acc)"
        strokeWidth="2"
      />
      <circle
        cx="260"
        cy="170"
        r="92"
        fill="none"
        stroke="var(--line)"
        strokeWidth="2"
        strokeDasharray="3 9"
      />
      <g className="arm">
        <g stroke="var(--fg)" strokeWidth="9" strokeLinecap="round">
          <path d="M260 170V96M260 170l64 37M260 170l-64 37" />
        </g>
        <circle cx="260" cy="170" r="13" fill="var(--acc)" />
      </g>
      <g fill="var(--mut)">
        <circle r="7">
          <animateMotion dur="4s" repeatCount="indefinite" path="M0 170H205" />
        </circle>
        <circle r="7">
          <animateMotion
            dur="4s"
            begin="1.3s"
            repeatCount="indefinite"
            path="M0 170H205"
          />
        </circle>
        <circle r="7">
          <animateMotion
            dur="4s"
            begin="2.6s"
            repeatCount="indefinite"
            path="M0 170H205"
          />
        </circle>
      </g>
      <g fill="var(--ok)">
        <circle r="8">
          <animateMotion
            dur="4s"
            begin=".9s"
            repeatCount="indefinite"
            path="M315 170H520"
          />
        </circle>
        <circle r="8">
          <animateMotion
            dur="4s"
            begin="2.2s"
            repeatCount="indefinite"
            path="M315 170H520"
          />
        </circle>
        <circle r="8">
          <animateMotion
            dur="4s"
            begin="3.5s"
            repeatCount="indefinite"
            path="M315 170H520"
          />
        </circle>
      </g>
      <text x="14" y="300" className="mono" fontSize="16" fill="var(--mut)">
        challenge
      </text>
      <text x="440" y="300" className="mono" fontSize="16" fill="var(--ok)">
        0.token
      </text>
    </svg>
  );
}
