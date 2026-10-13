export default function FlowDiagram() {
  return (
    <>
      <svg
        className="flow fl rv"
        viewBox="0 0 900 150"
        style={{ marginTop: '30px' }}
      >
        <path
          d="M90 75H450M450 75H810"
          stroke="var(--acc)"
          strokeWidth="2"
          fill="none"
        />
        <g
          fontFamily="var(--font-bricolage), Bricolage Grotesque"
          fontWeight="700"
          fontSize="20"
          fill="var(--fg)"
          textAnchor="middle"
        >
          <g>
            <circle
              cx="90"
              cy="75"
              r="40"
              fill="var(--bg)"
              stroke="var(--fg)"
              strokeWidth="2"
            />
            <text x="90" y="81">
              Kirim
            </text>
          </g>
          <g>
            <circle
              cx="450"
              cy="75"
              r="40"
              fill="var(--bg)"
              stroke="var(--fg)"
              strokeWidth="2"
            />
            <text x="450" y="81">
              Solve
            </text>
          </g>
          <g>
            <circle cx="810" cy="75" r="40" fill="var(--acc)" />
            <text x="810" y="81" fill="#fff">
              Token
            </text>
          </g>
        </g>
        <g
          className="mono"
          fontSize="12"
          fill="var(--mut)"
          textAnchor="middle"
        >
          <text x="90" y="140">
            POST /api/turnstile
          </text>
          <text x="450" y="140">
            ~1.2 dtk
          </text>
          <text x="810" y="140">
            {'{ success: true, token }'}
          </text>
        </g>
      </svg>

      <svg
        className="flow fm rv"
        viewBox="0 0 300 420"
        style={{ marginTop: '30px' }}
      >
        <path
          d="M70 100V160M70 240V300"
          stroke="var(--acc)"
          strokeWidth="2"
          fill="none"
        />
        <g
          fontFamily="var(--font-bricolage), Bricolage Grotesque"
          fontWeight="700"
          fontSize="18"
          fill="var(--fg)"
          textAnchor="middle"
        >
          <circle
            cx="70"
            cy="60"
            r="40"
            fill="var(--bg)"
            stroke="var(--fg)"
            strokeWidth="2"
          />
          <text x="70" y="66">
            Kirim
          </text>
          <circle
            cx="70"
            cy="200"
            r="40"
            fill="var(--bg)"
            stroke="var(--fg)"
            strokeWidth="2"
          />
          <text x="70" y="206">
            Solve
          </text>
          <circle cx="70" cy="340" r="40" fill="var(--acc)" />
          <text x="70" y="346" fill="#fff">
            Token
          </text>
        </g>
        <g className="mono" fontSize="13" fill="var(--mut)">
          <text x="128" y="65">
            POST /api/turnstile
          </text>
          <text x="128" y="205">
            ~1.2 dtk
          </text>
          <text x="128" y="345">
            {'{ token }'}
          </text>
        </g>
      </svg>
    </>
  );
}
