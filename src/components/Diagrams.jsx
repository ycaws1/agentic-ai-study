// SVG Architecture Diagrams — one per key topic

const CYAN = '#06b6d4';
const PURPLE = '#a78bfa';
const AMBER = '#f59e0b';
const GREEN = '#10b981';
const RED = '#ef4444';
const PINK = '#ec4899';
const ORANGE = '#f97316';
const TEAL = '#22d3ee';
const BG_CARD = '#0d1826';
const BORDER = 'rgba(6,182,212,0.25)';
const TEXT = '#e2eaf3';
const TEXT_MUT = '#7a9ab5';

const boxStyle = {
  rx: 6,
  fill: '#0a1220',
  stroke: BORDER,
  strokeWidth: 1,
};

function Arrow({ x1, y1, x2, y2, color = CYAN, dashed = false }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  const headLen = 8;
  const ex = x2 - ux * headLen;
  const ey = y2 - uy * headLen;
  return (
    <g>
      <line
        x1={x1} y1={y1} x2={ex} y2={ey}
        stroke={color} strokeWidth={1.5}
        strokeDasharray={dashed ? '5,4' : undefined}
        opacity={0.7}
      />
      <polygon
        points={`${x2},${y2} ${ex - uy * 4},${ey + ux * 4} ${ex + uy * 4},${ey - ux * 4}`}
        fill={color} opacity={0.8}
      />
    </g>
  );
}

function Box({ x, y, w, h, color = CYAN, label, sublabel, emoji }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={`${color}15`} stroke={`${color}50`} strokeWidth={1.5} />
      {emoji && <text x={x + w / 2} y={y + (sublabel ? h / 2 - 8 : h / 2 + 5)} textAnchor="middle" fontSize={18}>{emoji}</text>}
      <text x={x + w / 2} y={y + (emoji ? h / 2 + 14 : (sublabel ? h / 2 + 2 : h / 2 + 5))} textAnchor="middle" fill={color} fontSize={12} fontWeight={700} fontFamily="Syne, sans-serif">{label}</text>
      {sublabel && <text x={x + w / 2} y={y + h / 2 + 18} textAnchor="middle" fill={TEXT_MUT} fontSize={9} fontFamily="Outfit, sans-serif">{sublabel}</text>}
    </g>
  );
}

function Label({ x, y, text, color = TEXT_MUT, size = 9, anchor = 'middle', bold = false }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontFamily={bold ? 'Syne, sans-serif' : 'Outfit, sans-serif'} fontWeight={bold ? 700 : 400}>{text}</text>
  );
}

// ─── 1. ReAct Loop ────────────────────────────────────────────────────────────
export function ReActDiagram() {
  const cx = 200, cy = 140, r = 90;
  const nodes = [
    { angle: -90, label: 'THOUGHT', sub: 'Reason what to do', color: AMBER, emoji: '🧠' },
    { angle: 30, label: 'ACT', sub: 'Call a tool', color: CYAN, emoji: '⚡' },
    { angle: 150, label: 'OBSERVE', sub: 'Process result', color: GREEN, emoji: '👁️' },
  ];
  const pts = nodes.map(n => ({
    x: cx + r * Math.cos((n.angle * Math.PI) / 180),
    y: cy + r * Math.sin((n.angle * Math.PI) / 180),
    ...n,
  }));
  const bw = 88, bh = 56;

  return (
    <svg viewBox="0 0 400 290" style={{ width: '100%', maxWidth: 400 }}>
      {/* Orbit ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${CYAN}15`} strokeWidth={1} strokeDasharray="4,4" />

      {/* Curved arrows between nodes */}
      {pts.map((from, i) => {
        const to = pts[(i + 1) % 3];
        const mx = (from.x + to.x) / 2 + (cy - (from.y + to.y) / 2) * 0.3;
        const my = (from.y + to.y) / 2 + ((from.x + to.x) / 2 - cx) * 0.3;
        const id = `arr${i}`;
        return (
          <g key={i}>
            <defs>
              <marker id={id} markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={from.color} opacity={0.8} />
              </marker>
            </defs>
            <path
              d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
              fill="none" stroke={from.color} strokeWidth={1.5} opacity={0.6}
              markerEnd={`url(#${id})`}
            />
          </g>
        );
      })}

      {/* Nodes */}
      {pts.map((p, i) => (
        <g key={i}>
          <rect x={p.x - bw / 2} y={p.y - bh / 2} width={bw} height={bh} rx={8}
            fill={`${p.color}18`} stroke={`${p.color}60`} strokeWidth={1.5} />
          <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={18}>{p.emoji}</text>
          <text x={p.x} y={p.y + 8} textAnchor="middle" fill={p.color} fontSize={11} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{p.label}</text>
          <text x={p.x} y={p.y + 20} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">{p.sub}</text>
        </g>
      ))}

      {/* Center */}
      <circle cx={cx} cy={cy} r={20} fill={`${CYAN}15`} stroke={`${CYAN}40`} strokeWidth={1} />
      <text x={cx} y={cy + 4} textAnchor="middle" fill={CYAN} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">LOOP</text>

      {/* Right side — stop conditions */}
      <rect x={310} y={60} width={80} height={140} rx={8} fill={`${RED}10`} stroke={`${RED}30`} strokeWidth={1} />
      <text x={350} y={82} textAnchor="middle" fill={RED} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">STOP WHEN</text>
      {['Max iter', 'Token limit', 'finish()', 'Timeout', 'No progress'].map((s, i) => (
        <text key={i} x={350} y={100 + i * 18} textAnchor="middle" fill={TEXT_MUT} fontSize={8.5} fontFamily="Plus Jakarta Sans,sans-serif">· {s}</text>
      ))}

      {/* Arrow from loop to stop */}
      <Arrow x1={270} y1={140} x2={308} y2={140} color={RED} dashed />

      {/* Bottom label */}
      <text x={200} y={272} textAnchor="middle" fill={TEXT_MUT} fontSize={9} fontFamily="Plus Jakarta Sans,sans-serif">
        ReAct: Reasoning + Acting interleaved in a loop
      </text>
    </svg>
  );
}

// ─── 2. Orchestrator-Worker ───────────────────────────────────────────────────
export function OrchestratorDiagram() {
  const workers = [
    { label: 'Research', color: CYAN, emoji: '🔍' },
    { label: 'Coder', color: PURPLE, emoji: '💻' },
    { label: 'Writer', color: AMBER, emoji: '✍️' },
    { label: 'Critic', color: RED, emoji: '🔍' },
  ];
  const oy = 70, oh = 52, ow = 120;
  const wx = [30, 130, 250, 330], wy = 190, ww = 80, wh = 52;

  return (
    <svg viewBox="0 0 430 310" style={{ width: '100%', maxWidth: 430 }}>
      {/* User */}
      <rect x={170} y={8} width={80} height={36} rx={6} fill={`${GREEN}18`} stroke={`${GREEN}50`} strokeWidth={1.5} />
      <text x={210} y={30} textAnchor="middle" fill={GREEN} fontSize={11} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">👤 USER</text>

      {/* Arrow user → orchestrator */}
      <Arrow x1={210} y1={44} x2={210} y2={68} color={GREEN} />

      {/* Orchestrator */}
      <rect x={150} y={oy} width={ow} height={oh} rx={10} fill={`${CYAN}18`} stroke={`${CYAN}60`} strokeWidth={2} />
      <text x={210} y={oy + 20} textAnchor="middle" fontSize={18}>🧩</text>
      <text x={210} y={oy + 36} textAnchor="middle" fill={CYAN} fontSize={11} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">ORCHESTRATOR</text>

      {/* Shared state */}
      <rect x={340} y={oy + 4} width={80} height={44} rx={6} fill={`${PURPLE}12`} stroke={`${PURPLE}30`} strokeWidth={1} />
      <text x={380} y={oy + 18} textAnchor="middle" fill={PURPLE} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">📋 STATE</text>
      <text x={380} y={oy + 30} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">Task DAG</text>
      <text x={380} y={oy + 41} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">Results</text>
      <Arrow x1={272} y1={oy + 20} x2={338} y2={oy + 20} color={PURPLE} dashed />

      {/* Lines from orchestrator to workers */}
      {workers.map((w, i) => {
        const tx = wx[i] + ww / 2;
        return (
          <g key={i}>
            <line x1={210} y1={oy + oh} x2={tx} y2={wy} stroke={`${w.color}50`} strokeWidth={1.5} strokeDasharray="4,3" />
            <polygon points={`${tx},${wy} ${tx - 4},${wy - 8} ${tx + 4},${wy - 8}`} fill={w.color} opacity={0.7} />
          </g>
        );
      })}

      {/* Worker boxes */}
      {workers.map((w, i) => (
        <g key={i}>
          <rect x={wx[i]} y={wy} width={ww} height={wh} rx={8}
            fill={`${w.color}15`} stroke={`${w.color}50`} strokeWidth={1.5} />
          <text x={wx[i] + ww / 2} y={wy + 20} textAnchor="middle" fontSize={16}>{w.emoji}</text>
          <text x={wx[i] + ww / 2} y={wy + 36} textAnchor="middle" fill={w.color} fontSize={10} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{w.label}</text>
        </g>
      ))}

      {/* Worker tools */}
      {workers.map((w, i) => {
        const tx = wx[i] + ww / 2;
        return (
          <g key={i}>
            <Arrow x1={tx} y1={wy + wh} x2={tx} y2={265} color={w.color} dashed />
            <rect x={wx[i] - 2} y={266} width={ww + 4} height={22} rx={4} fill="#0a1220" stroke={`${w.color}25`} strokeWidth={1} />
            <text x={tx} y={280} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">tools / APIs</text>
          </g>
        );
      })}

      <text x={215} y={302} textAnchor="middle" fill={TEXT_MUT} fontSize={9} fontFamily="Plus Jakarta Sans,sans-serif">
        Orchestrator decomposes tasks → dispatches to specialist workers in parallel
      </text>
    </svg>
  );
}

// ─── 3. A2A Protocol ─────────────────────────────────────────────────────────
export function A2ADiagram() {
  return (
    <svg viewBox="0 0 460 310" style={{ width: '100%', maxWidth: 460 }}>
      {/* Org A */}
      <rect x={8} y={20} width={185} height={200} rx={10} fill={`${TEAL}06`} stroke={`${TEAL}20`} strokeWidth={1} strokeDasharray="5,3" />
      <text x={100} y={38} textAnchor="middle" fill={TEAL} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1">ORG A</text>

      {/* Org A: Orchestrator */}
      <rect x={24} y={46} width={152} height={52} rx={8} fill={`${TEAL}18`} stroke={`${TEAL}50`} strokeWidth={1.5} />
      <text x={100} y={66} textAnchor="middle" fontSize={16}>🧩</text>
      <text x={100} y={82} textAnchor="middle" fill={TEAL} fontSize={11} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Orchestrator Agent</text>
      <text x={100} y={93} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">A2A Client</text>

      {/* Org A: Agent Card lookup */}
      <rect x={24} y={115} width={152} height={40} rx={6} fill={`${GREEN}10`} stroke={`${GREEN}30`} strokeWidth={1} />
      <text x={100} y={130} textAnchor="middle" fill={GREEN} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">📋 Agent Registry</text>
      <text x={100} y={143} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">Discover agent cards</text>

      {/* Arrow orch → registry */}
      <Arrow x1={100} y1={98} x2={100} y2={113} color={GREEN} />

      {/* MCP tools for Org A */}
      <rect x={24} y={172} width={152} height={36} rx={6} fill={`${PURPLE}10`} stroke={`${PURPLE}25`} strokeWidth={1} />
      <text x={100} y={187} textAnchor="middle" fill={PURPLE} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">🔌 MCP Tools</text>
      <text x={100} y={199} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">search · db · calendar</text>
      <Arrow x1={100} y1={155} x2={100} y2={170} color={PURPLE} />

      {/* A2A bidirectional arrow in middle */}
      <rect x={200} y={90} width={60} height={70} rx={8} fill={`${AMBER}10`} stroke={`${AMBER}30`} strokeWidth={1} />
      <text x={230} y={115} textAnchor="middle" fill={AMBER} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">A2A</text>
      <text x={230} y={127} textAnchor="middle" fill={AMBER} fontSize={16}>⇄</text>
      <text x={230} y={148} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">HTTP/SSE</text>
      <text x={230} y={157} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">OAuth 2.0</text>

      {/* Arrows org A → A2A → org B */}
      <Arrow x1={176} y1={125} x2={198} y2={125} color={AMBER} />
      <Arrow x1={262} y1={125} x2={268} y2={125} color={AMBER} />

      {/* Org B */}
      <rect x={268} y={20} width={185} height={200} rx={10} fill={`${PINK}06`} stroke={`${PINK}20`} strokeWidth={1} strokeDasharray="5,3" />
      <text x={355} y={38} textAnchor="middle" fill={PINK} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1">ORG B</text>

      {/* Org B: Specialist Agent */}
      <rect x={284} y={46} width={152} height={52} rx={8} fill={`${PINK}18`} stroke={`${PINK}50`} strokeWidth={1.5} />
      <text x={360} y={66} textAnchor="middle" fontSize={16}>🤖</text>
      <text x={360} y={82} textAnchor="middle" fill={PINK} fontSize={11} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Specialist Agent</text>
      <text x={360} y={93} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">A2A Server · Agent Card</text>

      {/* Task lifecycle */}
      <rect x={284} y={110} width={152} height={100} rx={6} fill={`${PINK}08`} stroke={`${PINK}20`} strokeWidth={1} />
      <text x={360} y={126} textAnchor="middle" fill={PINK} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">TASK LIFECYCLE</text>
      {['submitted', '→ working', '→ input-required?', '→ completed', '→ artifact'].map((s, i) => (
        <text key={i} x={360} y={140 + i * 14} textAnchor="middle" fill={i === 3 ? GREEN : TEXT_MUT} fontSize={8.5} fontFamily="Plus Jakarta Sans,sans-serif">{s}</text>
      ))}
      <Arrow x1={360} y1={98} x2={360} y2={108} color={PINK} />

      {/* Bottom legend */}
      <rect x={30} y={234} width={400} height={56} rx={8} fill="none" />
      {[
        { color: TEAL, label: 'A2A Client — initiates tasks' },
        { color: PINK, label: 'A2A Server — executes tasks' },
        { color: AMBER, label: 'A2A Protocol — HTTP/SSE transport' },
        { color: PURPLE, label: 'MCP — tools within each agent' },
      ].map((item, i) => (
        <g key={i}>
          <circle cx={i < 2 ? 36 + i * 200 : 36 + (i - 2) * 200} cy={i < 2 ? 248 : 266} r={4} fill={item.color} opacity={0.8} />
          <text x={i < 2 ? 46 + i * 200 : 46 + (i - 2) * 200} y={i < 2 ? 252 : 270} fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">{item.label}</text>
        </g>
      ))}

      <text x={230} y={292} textAnchor="middle" fill={TEXT_MUT} fontSize={9} fontFamily="Plus Jakarta Sans,sans-serif">
        A2A enables cross-org agent delegation with full autonomy and standard auth
      </text>
    </svg>
  );
}

// ─── 4. MCP Architecture ─────────────────────────────────────────────────────
export function MCPDiagram() {
  return (
    <svg viewBox="0 0 440 290" style={{ width: '100%', maxWidth: 440 }}>
      {/* Host */}
      <rect x={10} y={20} width={130} height={200} rx={10} fill={`${CYAN}06`} stroke={`${CYAN}20`} strokeWidth={1} strokeDasharray="5,3" />
      <text x={75} y={38} textAnchor="middle" fill={CYAN} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1">MCP HOST</text>
      <text x={75} y={50} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">(Cursor, Claude Desktop)</text>

      <rect x={22} y={58} width={106} height={40} rx={6} fill={`${CYAN}15`} stroke={`${CYAN}40`} strokeWidth={1} />
      <text x={75} y={76} textAnchor="middle" fill={CYAN} fontSize={10} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">🤖 LLM</text>
      <text x={75} y={90} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">Makes decisions</text>

      <rect x={22} y={110} width={106} height={40} rx={6} fill={`${PURPLE}12`} stroke={`${PURPLE}30`} strokeWidth={1} />
      <text x={75} y={128} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">📡 MCP Client</text>
      <text x={75} y={141} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">Manages connections</text>

      <rect x={22} y={162} width={106} height={40} rx={6} fill={`${AMBER}12`} stroke={`${AMBER}30`} strokeWidth={1} />
      <text x={75} y={180} textAnchor="middle" fill={AMBER} fontSize={10} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">🧠 Context</text>
      <text x={75} y={193} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">Tools + Resources</text>

      {/* Transport label */}
      <rect x={154} y={80} width={52} height={100} rx={6} fill="none" />
      <text x={180} y={120} textAnchor="middle" fill={AMBER} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">stdio</text>
      <text x={180} y={132} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">or</text>
      <text x={180} y={144} textAnchor="middle" fill={AMBER} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">HTTP</text>
      <text x={180} y={156} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">+SSE</text>

      <Arrow x1={128} y1={130} x2={152} y2={130} color={AMBER} />
      <Arrow x1={208} y1={130} x2={212} y2={130} color={AMBER} />

      {/* MCP Servers column */}
      {[
        { label: 'File System', sub: 'read/write files', color: GREEN, emoji: '📁', primitives: ['Resources', 'Tools'] },
        { label: 'Web Search', sub: 'search + fetch', color: CYAN, emoji: '🌐', primitives: ['Tools'] },
        { label: 'Database', sub: 'query + write', color: PURPLE, emoji: '🗄️', primitives: ['Resources', 'Tools'] },
        { label: 'Calendar', sub: 'schedule events', color: PINK, emoji: '📅', primitives: ['Prompts', 'Tools', 'Sampling'] },
      ].map((s, i) => (
        <g key={i}>
          <rect x={214} y={20 + i * 62} width={130} height={52} rx={8}
            fill={`${s.color}12`} stroke={`${s.color}40`} strokeWidth={1.5} />
          <text x={220} y={20 + i * 62 + 22} textAnchor="start" fontSize={16}>{s.emoji}</text>
          <text x={242} y={20 + i * 62 + 20} textAnchor="start" fill={s.color} fontSize={10} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{s.label}</text>
          <text x={242} y={20 + i * 62 + 32} textAnchor="start" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">{s.sub}</text>
          <text x={216} y={20 + i * 62 + 46} textAnchor="start" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">{s.primitives.join(' · ')}</text>
        </g>
      ))}

      {/* Primitives legend */}
      <rect x={354} y={20} width={82} height={130} rx={8} fill={`${CYAN}06`} stroke={`${CYAN}15`} strokeWidth={1} />
      <text x={395} y={36} textAnchor="middle" fill={CYAN} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">PRIMITIVES</text>
      {[
        { label: '⚡ Tools', desc: 'Callable functions' },
        { label: '📦 Resources', desc: 'Read-only data' },
        { label: '💬 Prompts', desc: 'Reusable templates' },
        { label: '🔄 Sampling', desc: 'Server → LLM calls' },
      ].map((p, i) => (
        <g key={i}>
          <text x={362} y={52 + i * 26} fill={TEXT} fontSize={9} fontFamily="Plus Jakarta Sans,sans-serif" fontWeight={600}>{p.label}</text>
          <text x={362} y={63 + i * 26} fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">{p.desc}</text>
        </g>
      ))}

      <text x={220} y={276} textAnchor="middle" fill={TEXT_MUT} fontSize={9} fontFamily="Plus Jakarta Sans,sans-serif">
        N models + M tools → N+M integrations (vs N×M without MCP)
      </text>
    </svg>
  );
}

// ─── 5. Eval Pyramid ─────────────────────────────────────────────────────────
export function EvalDiagram() {
  const layers = [
    { label: 'Human Evals', sub: 'Ground truth · expensive · slow', color: AMBER, y: 30, w: 100 },
    { label: 'E2E Evals', sub: 'Full task · catches real failures', color: ORANGE, y: 80, w: 180 },
    { label: 'Integration Evals', sub: 'Multi-step pipelines', color: CYAN, y: 130, w: 260 },
    { label: 'Unit Evals', sub: 'Single step · fast · cheap', color: GREEN, y: 180, w: 340 },
  ];
  const cx = 210;

  return (
    <svg viewBox="0 0 420 270" style={{ width: '100%', maxWidth: 420 }}>
      {/* Pyramid layers */}
      {layers.map((l, i) => (
        <g key={i}>
          <rect x={cx - l.w / 2} y={l.y} width={l.w} height={44} rx={6}
            fill={`${l.color}15`} stroke={`${l.color}50`} strokeWidth={1.5} />
          <text x={cx} y={l.y + 20} textAnchor="middle" fill={l.color} fontSize={11} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{l.label}</text>
          <text x={cx} y={l.y + 35} textAnchor="middle" fill={TEXT_MUT} fontSize={8.5} fontFamily="Plus Jakarta Sans,sans-serif">{l.sub}</text>
        </g>
      ))}

      {/* Left axis labels */}
      <text x={20} y={52} fill={AMBER} fontSize={8.5} fontFamily="Plus Jakarta Sans,sans-serif" fontWeight={600}>↑ Quality</text>
      <text x={20} y={64} fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">Ground truth</text>
      <text x={20} y={202} fill={GREEN} fontSize={8.5} fontFamily="Plus Jakarta Sans,sans-serif" fontWeight={600}>↓ Speed</text>
      <text x={20} y={214} fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">Scalable</text>

      {/* Right side: eval metrics */}
      <rect x={365} y={24} width={50} height={206} rx={6} fill={`${PURPLE}08`} stroke={`${PURPLE}20`} strokeWidth={1} />
      <text x={390} y={40} textAnchor="middle" fill={PURPLE} fontSize={8} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">METRICS</text>
      {['Task\nRate', 'Step\nCount', 'Tool\nAcc.', 'Halluc.\nRate', 'Cost\n/Task', 'Safety'].map((m, i) => (
        <text key={i} x={390} y={58 + i * 28} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">{m}</text>
      ))}

      {/* LLM-as-judge note */}
      <rect x={30} y={240} width={175} height={24} rx={6} fill={`${RED}10`} stroke={`${RED}25`} strokeWidth={1} />
      <text x={117} y={254} textAnchor="middle" fill={RED} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif" fontWeight={600}>⚠ LLM-as-Judge: watch for position/verbosity bias</text>

      <text x={225} y={254} fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">Golden dataset = your test suite</text>
    </svg>
  );
}

// ─── 6. Harness Architecture ──────────────────────────────────────────────────
export function HarnessDiagram() {
  const components = [
    { label: 'Prompt Builder', color: AMBER, x: 30, y: 60, emoji: '🏗️' },
    { label: 'LLM Call', color: CYAN, x: 170, y: 60, emoji: '🤖' },
    { label: 'Output Parser', color: GREEN, x: 310, y: 60, emoji: '🔍' },
    { label: 'Tool Registry', color: PURPLE, x: 310, y: 150, emoji: '🔧' },
    { label: 'Tool Executor', color: ORANGE, x: 170, y: 150, emoji: '⚡' },
    { label: 'State/Context', color: RED, x: 30, y: 150, emoji: '💾' },
  ];
  const bw = 110, bh = 52;

  return (
    <svg viewBox="0 0 460 290" style={{ width: '100%', maxWidth: 460 }}>
      {/* Outer harness border */}
      <rect x={10} y={30} width={430} height={210} rx={12} fill="none" stroke={`${CYAN}20`} strokeWidth={1} strokeDasharray="6,4" />
      <text x={225} y={22} textAnchor="middle" fill={CYAN} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1.5">AGENT HARNESS</text>

      {/* Component boxes */}
      {components.map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width={bw} height={bh} rx={8}
            fill={`${c.color}12`} stroke={`${c.color}45`} strokeWidth={1.5} />
          <text x={c.x + bw / 2} y={c.y + 20} textAnchor="middle" fontSize={16}>{c.emoji}</text>
          <text x={c.x + bw / 2} y={c.y + 38} textAnchor="middle" fill={c.color} fontSize={9.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{c.label}</text>
        </g>
      ))}

      {/* Top row arrows: builder → llm → parser */}
      <Arrow x1={140} y1={86} x2={168} y2={86} color={AMBER} />
      <Arrow x1={280} y1={86} x2={308} y2={86} color={CYAN} />

      {/* Parser → Tool Registry */}
      <Arrow x1={365} y1={112} x2={365} y2={148} color={GREEN} />

      {/* Tool Registry → Tool Executor */}
      <Arrow x1={308} y1={176} x2={282} y2={176} color={PURPLE} />

      {/* Tool Executor → State */}
      <Arrow x1={168} y1={176} x2={142} y2={176} color={ORANGE} />

      {/* State → Prompt Builder (loop back) */}
      <Arrow x1={85} y1={148} x2={85} y2={114} color={RED} />

      {/* Guardrails overlay */}
      <rect x={14} y={218} width={200} height={30} rx={6} fill={`${RED}10`} stroke={`${RED}25`} strokeWidth={1} />
      <text x={114} y={230} textAnchor="middle" fill={RED} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">🛡️ Guardrails (pre + post)</text>
      <text x={114} y={241} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">PII filter · safety · schema validation</text>

      {/* Observability */}
      <rect x={226} y={218} width={214} height={30} rx={6} fill={`${PURPLE}10`} stroke={`${PURPLE}25`} strokeWidth={1} />
      <text x={333} y={230} textAnchor="middle" fill={PURPLE} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">📊 Observability hooks</text>
      <text x={333} y={241} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">on_step · on_tool_call · on_error</text>

      <text x={225} y={278} textAnchor="middle" fill={TEXT_MUT} fontSize={9} fontFamily="Plus Jakarta Sans,sans-serif">
        Harness = the OS that runs your agent. LLM = the CPU.
      </text>
    </svg>
  );
}

// ─── 7. Loop Engineering — 6 Parts ───────────────────────────────────────────
export function LoopDiagram() {
  const parts = [
    { label: '1 · Heartbeat', sub: 'cron / Routine / event', color: AMBER, emoji: '⏰', x: 10, y: 14 },
    { label: '2 · Worktree', sub: 'isolation per agent', color: CYAN, emoji: '🌿', x: 160, y: 14 },
    { label: '3 · Skill', sub: 'no run starts "day one"', color: GREEN, emoji: '📖', x: 310, y: 14 },
    { label: '4 · Sub-agents', sub: 'maker–checker split', color: PURPLE, emoji: '🤖', x: 10, y: 110 },
    { label: '5 · Connector', sub: 'MCP — act, not just suggest', color: PINK, emoji: '🔌', x: 160, y: 110 },
    { label: '6 · Spine ⚠', sub: 'state that survives runs', color: RED, emoji: '💾', x: 310, y: 110 },
  ];
  const bw = 130, bh = 80;

  return (
    <svg viewBox="0 0 460 310" style={{ width: '100%', maxWidth: 460 }}>
      <text x={230} y={12} textAnchor="middle" fill={CYAN} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1.5">THE 6 PARTS OF A LOOP</text>

      {parts.map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={p.y + 8} width={bw} height={bh} rx={8}
            fill={`${p.color}14`} stroke={p.color === RED ? `${RED}70` : `${p.color}45`} strokeWidth={p.color === RED ? 2 : 1.5} />
          <text x={p.x + bw / 2} y={p.y + 36} textAnchor="middle" fontSize={18}>{p.emoji}</text>
          <text x={p.x + bw / 2} y={p.y + 57} textAnchor="middle" fill={p.color} fontSize={9.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{p.label}</text>
          <text x={p.x + bw / 2} y={p.y + 70} textAnchor="middle" fill={TEXT_MUT} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif">{p.sub}</text>
          {p.color === RED && (
            <text x={p.x + bw / 2} y={p.y + 83} textAnchor="middle" fill={RED} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">beginners skip this one</text>
          )}
        </g>
      ))}

      {/* Heartbeat types */}
      <rect x={10} y={206} width={440} height={92} rx={8} fill={`${AMBER}06`} stroke={`${AMBER}20`} strokeWidth={1} />
      <text x={230} y={220} textAnchor="middle" fill={AMBER} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1">HEARTBEAT TYPES — in order of autonomy</text>
      {[
        { label: '1 In-Session', sub: '/loop · while true', color: GREEN, x: 30 },
        { label: '2 Run-Until-Done', sub: '/goal · capped shell loop', color: CYAN, x: 140 },
        { label: '3 Scheduled', sub: 'cron · Routines · CI', color: AMBER, x: 260 },
        { label: '4 Event-Driven', sub: 'PR open · webhook · msg', color: PINK, x: 360 },
      ].map((h, i) => (
        <g key={i}>
          <circle cx={h.x + 40} cy={240} r={16} fill={`${h.color}18`} stroke={`${h.color}50`} strokeWidth={1.5} />
          <text x={h.x + 40} y={244} textAnchor="middle" fill={h.color} fontSize={8} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{i + 1}</text>
          <text x={h.x + 40} y={264} textAnchor="middle" fill={h.color} fontSize={8} fontWeight={700} fontFamily="Plus Jakarta Sans,sans-serif">{h.label}</text>
          <text x={h.x + 40} y={274} textAnchor="middle" fill={TEXT_MUT} fontSize={7} fontFamily="Plus Jakarta Sans,sans-serif">{h.sub}</text>
          {i < 3 && <Arrow x1={h.x + 56} y1={240} x2={h.x + 76} y2={240} color={TEXT_MUT} />}
        </g>
      ))}

      <text x={230} y={292} textAnchor="middle" fill={RED} fontSize={8.5} fontFamily="Plus Jakarta Sans,sans-serif" fontWeight={600}>
        ⚠ Always set a ceiling (max tries/spend) — a loop with no ceiling can bankrupt you
      </text>
    </svg>
  );
}

// ─── 8. Guardrails ───────────────────────────────────────────────────────────
const ROSE2 = '#f43f5e';
export function GuardrailsDiagram() {
  return (
    <svg viewBox="0 0 460 310" style={{ width: '100%', maxWidth: 460 }}>
      <text x={230} y={13} textAnchor="middle" fill={ROSE2} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1.5">INPUT → LLM → OUTPUT GUARDRAIL STACK</text>

      {/* Flow: User → Input Guards → LLM → Output Guards → Action */}
      {/* User */}
      <rect x={10} y={24} width={70} height={40} rx={8} fill={`${GREEN}15`} stroke={`${GREEN}45`} strokeWidth={1.5} />
      <text x={45} y={42} textAnchor="middle" fontSize={14}>👤</text>
      <text x={45} y={58} textAnchor="middle" fill={GREEN} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">User / Tool</text>

      <Arrow x1={82} y1={44} x2={98} y2={44} color={ROSE2} />

      {/* Input guardrails box */}
      <rect x={100} y={18} width={110} height={190} rx={10} fill={`${ROSE2}10`} stroke={`${ROSE2}40`} strokeWidth={2} />
      <text x={155} y={34} textAnchor="middle" fill={ROSE2} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="0.5">INPUT GUARDS</text>
      {[
        { label: 'Injection Detect', color: RED, emoji: '💉' },
        { label: 'PII Redaction', color: AMBER, emoji: '🔏' },
        { label: 'Content Safety', color: ORANGE, emoji: '🚫' },
        { label: 'Topic Scoping', color: CYAN, emoji: '🎯' },
        { label: 'Schema Validate', color: GREEN, emoji: '✅' },
        { label: 'Rate Limit', color: PURPLE, emoji: '⏱️' },
      ].map((g, i) => (
        <g key={i}>
          <rect x={108} y={42 + i * 28} width={94} height={22} rx={4}
            fill={`${g.color}14`} stroke={`${g.color}35`} strokeWidth={1} />
          <text x={116} y={57 + i * 28} fontSize={11}>{g.emoji}</text>
          <text x={130} y={57 + i * 28} fill={g.color} fontSize={8} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{g.label}</text>
        </g>
      ))}

      {/* Block/Pass decision */}
      <rect x={108} y={214} width={94} height={22} rx={4} fill={`${RED}14`} stroke={`${RED}35`} strokeWidth={1} />
      <text x={155} y={229} textAnchor="middle" fill={RED} fontSize={8} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">⛔ Block or Route</text>

      <Arrow x1={212} y1={44} x2={228} y2={44} color={CYAN} />

      {/* LLM */}
      <rect x={230} y={24} width={60} height={66} rx={8} fill={`${CYAN}15`} stroke={`${CYAN}45`} strokeWidth={2} />
      <text x={260} y={52} textAnchor="middle" fontSize={18}>🤖</text>
      <text x={260} y={68} textAnchor="middle" fill={CYAN} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">LLM Call</text>
      <text x={260} y={80} textAnchor="middle" fill={TEXT_MUT} fontSize={7} fontFamily="Plus Jakarta Sans,sans-serif">trusted zone</text>

      <Arrow x1={292} y1={57} x2={308} y2={57} color={CYAN} />

      {/* Output guardrails box */}
      <rect x={310} y={18} width={140} height={190} rx={10} fill={`${AMBER}08`} stroke={`${AMBER}35`} strokeWidth={2} />
      <text x={380} y={34} textAnchor="middle" fill={AMBER} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="0.5">OUTPUT GUARDS</text>
      {[
        { label: 'PII Leak Detect', color: AMBER, emoji: '🔍' },
        { label: 'Hallucination Check', color: RED, emoji: '🧐' },
        { label: 'Schema / Format', color: GREEN, emoji: '📋' },
        { label: 'Toxicity Filter', color: ORANGE, emoji: '🚫' },
        { label: 'Tool Call Validate', color: PURPLE, emoji: '⚡' },
        { label: 'Confidentiality', color: CYAN, emoji: '🔒' },
      ].map((g, i) => (
        <g key={i}>
          <rect x={318} y={42 + i * 28} width={124} height={22} rx={4}
            fill={`${g.color}14`} stroke={`${g.color}35`} strokeWidth={1} />
          <text x={326} y={57 + i * 28} fontSize={11}>{g.emoji}</text>
          <text x={342} y={57 + i * 28} fill={g.color} fontSize={8} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{g.label}</text>
        </g>
      ))}
      <rect x={318} y={214} width={124} height={22} rx={4} fill={`${GREEN}14`} stroke={`${GREEN}35`} strokeWidth={1} />
      <text x={380} y={229} textAnchor="middle" fill={GREEN} fontSize={8} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">✓ Safe → User / Execute</text>

      {/* Trust tiers */}
      <rect x={10} y={248} width={440} height={56} rx={8} fill={`${PURPLE}06`} stroke={`${PURPLE}18`} strokeWidth={1} />
      <text x={230} y={262} textAnchor="middle" fill={PURPLE} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1">INPUT TRUST TIERS</text>
      {[
        { label: 'User input', sub: 'Full stack', color: ROSE2 },
        { label: 'Internal API', sub: 'Reduced checks', color: AMBER },
        { label: 'Trusted tools', sub: 'Schema only', color: GREEN },
        { label: 'External web', sub: 'Max paranoia', color: RED },
      ].map((t, i) => (
        <g key={i}>
          <circle cx={26 + i * 106} cy={281} r={3} fill={t.color} opacity={0.9} />
          <text x={33 + i * 106} y={285} fill={t.color} fontSize={8} fontFamily="Bricolage Grotesque,sans-serif" fontWeight={700}>{t.label}</text>
          <text x={33 + i * 106} y={296} fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">{t.sub}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── 9. RAG Pipeline ─────────────────────────────────────────────────────────
const ROSE = '#fb7185';
export function RAGDiagram() {
  return (
    <svg viewBox="0 0 460 320" style={{ width: '100%', maxWidth: 460 }}>
      {/* ── Indexing pipeline (top) ── */}
      <text x={230} y={13} textAnchor="middle" fill={ROSE} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1.5">RAG PIPELINE</text>

      <rect x={8} y={18} width={444} height={8} rx={4} fill={`${AMBER}15`} />
      <text x={16} y={26} fill={AMBER} fontSize={7} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">INDEXING (offline)</text>

      {/* Indexing steps */}
      {[
        { label: 'Load', sub: 'PDF/HTML/DB', emoji: '📥', color: AMBER },
        { label: 'Clean', sub: 'normalize', emoji: '🧹', color: AMBER },
        { label: 'Chunk', sub: '128–512t', emoji: '✂️', color: ORANGE },
        { label: 'Embed', sub: 'text→vector', emoji: '🔢', color: ROSE },
        { label: 'Index', sub: 'vector DB + meta', emoji: '🗄️', color: PURPLE },
      ].map((s, i) => (
        <g key={i}>
          <rect x={10 + i * 88} y={30} width={80} height={50} rx={6}
            fill={`${s.color}14`} stroke={`${s.color}45`} strokeWidth={1.5} />
          <text x={50 + i * 88} y={50} textAnchor="middle" fontSize={16}>{s.emoji}</text>
          <text x={50 + i * 88} y={63} textAnchor="middle" fill={s.color} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{s.label}</text>
          <text x={50 + i * 88} y={74} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">{s.sub}</text>
          {i < 4 && <Arrow x1={91 + i * 88} y1={55} x2={108 + i * 88} y2={55} color={s.color} />}
        </g>
      ))}

      {/* ── Retrieval pipeline (middle) ── */}
      <rect x={8} y={92} width={444} height={8} rx={4} fill={`${CYAN}15`} />
      <text x={16} y={100} fill={CYAN} fontSize={7} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">RETRIEVAL (online — every query)</text>

      {/* Query box */}
      <rect x={10} y={104} width={80} height={50} rx={6} fill={`${GREEN}14`} stroke={`${GREEN}45`} strokeWidth={1.5} />
      <text x={50} y={124} textAnchor="middle" fontSize={15}>💬</text>
      <text x={50} y={137} textAnchor="middle" fill={GREEN} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Query</text>
      <text x={50} y={148} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">+ rewrite</text>

      {/* Dual retrieval */}
      <Arrow x1={91} y1={129} x2={108} y2={118} color={CYAN} />
      <Arrow x1={91} y1={129} x2={108} y2={150} color={CYAN} />

      <rect x={110} y={104} width={80} height={30} rx={5} fill={`${CYAN}14`} stroke={`${CYAN}40`} strokeWidth={1.5} />
      <text x={150} y={117} textAnchor="middle" fill={CYAN} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Dense Search</text>
      <text x={150} y={128} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">bi-encoder vectors</text>

      <rect x={110} y={140} width={80} height={30} rx={5} fill={`${PURPLE}14`} stroke={`${PURPLE}40`} strokeWidth={1.5} />
      <text x={150} y={153} textAnchor="middle" fill={PURPLE} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Sparse Search</text>
      <text x={150} y={164} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">BM25 keywords</text>

      {/* Fusion */}
      <Arrow x1={191} y1={119} x2={208} y2={130} color={CYAN} />
      <Arrow x1={191} y1={155} x2={208} y2={144} color={PURPLE} />

      <rect x={210} y={112} width={72} height={50} rx={6} fill={`${AMBER}14`} stroke={`${AMBER}45`} strokeWidth={1.5} />
      <text x={246} y={130} textAnchor="middle" fill={AMBER} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Hybrid</text>
      <text x={246} y={141} textAnchor="middle" fill={AMBER} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Fusion</text>
      <text x={246} y={155} textAnchor="middle" fill={TEXT_MUT} fontSize={7} fontFamily="Plus Jakarta Sans,sans-serif">RRF top-20</text>
      <Arrow x1={283} y1={137} x2={298} y2={137} color={AMBER} />

      {/* Rerank */}
      <rect x={300} y={112} width={72} height={50} rx={6} fill={`${ROSE}14`} stroke={`${ROSE}45`} strokeWidth={1.5} />
      <text x={336} y={132} textAnchor="middle" fill={ROSE} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Rerank</text>
      <text x={336} y={143} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">cross-encoder</text>
      <text x={336} y={154} textAnchor="middle" fill={TEXT_MUT} fontSize={7} fontFamily="Plus Jakarta Sans,sans-serif">top-20 → top-5</text>
      <Arrow x1={373} y1={137} x2={388} y2={137} color={ROSE} />

      {/* Top-k chunks */}
      <rect x={390} y={112} width={62} height={50} rx={6} fill={`${GREEN}14`} stroke={`${GREEN}45`} strokeWidth={1.5} />
      <text x={421} y={132} textAnchor="middle" fill={GREEN} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Top-k</text>
      <text x={421} y={143} textAnchor="middle" fill={GREEN} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Chunks</text>
      <text x={421} y={154} textAnchor="middle" fill={TEXT_MUT} fontSize={7} fontFamily="Plus Jakarta Sans,sans-serif">+ metadata</text>

      {/* ── Generation (bottom) ── */}
      <rect x={8} y={176} width={444} height={8} rx={4} fill={`${GREEN}15`} />
      <text x={16} y={184} fill={GREEN} fontSize={7} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">GENERATION</text>

      {/* Prompt assembly */}
      <rect x={10} y={188} width={130} height={56} rx={6} fill={`${CYAN}12`} stroke={`${CYAN}35`} strokeWidth={1.5} />
      <text x={75} y={203} textAnchor="middle" fill={CYAN} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Prompt Assembly</text>
      {['System + grounding rules', '[Doc 1] chunk text...', '[Doc 2] chunk text...', 'User query'].map((l, i) => (
        <text key={i} x={18} y={215 + i * 10} fill={TEXT_MUT} fontSize={7} fontFamily="Plus Jakarta Sans,sans-serif">{l}</text>
      ))}
      <Arrow x1={421} y1={163} x2={421} y2={178} color={GREEN} />
      <line x1={421} y1={178} x2={75} y2={178} stroke={GREEN} strokeWidth={1.2} opacity={0.5} />
      <Arrow x1={75} y1={178} x2={75} y2={186} color={GREEN} />
      <Arrow x1={142} y1={216} x2={158} y2={216} color={CYAN} />

      {/* LLM */}
      <rect x={160} y={188} width={80} height={56} rx={6} fill={`${ROSE}14`} stroke={`${ROSE}45`} strokeWidth={1.5} />
      <text x={200} y={214} textAnchor="middle" fontSize={18}>🤖</text>
      <text x={200} y={228} textAnchor="middle" fill={ROSE} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">LLM</text>
      <text x={200} y={239} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">grounded generation</text>
      <Arrow x1={241} y1={216} x2={256} y2={216} color={ROSE} />

      {/* Verify */}
      <rect x={258} y={188} width={80} height={56} rx={6} fill={`${AMBER}12`} stroke={`${AMBER}35`} strokeWidth={1.5} />
      <text x={298} y={210} textAnchor="middle" fill={AMBER} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Verify</text>
      <text x={298} y={222} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">faithfulness check</text>
      <text x={298} y={232} textAnchor="middle" fill={TEXT_MUT} fontSize={7} fontFamily="Plus Jakarta Sans,sans-serif">claim vs. source</text>
      <Arrow x1={339} y1={216} x2={354} y2={216} color={AMBER} />

      {/* Answer */}
      <rect x={356} y={188} width={96} height={56} rx={6} fill={`${GREEN}14`} stroke={`${GREEN}45`} strokeWidth={1.5} />
      <text x={404} y={210} textAnchor="middle" fill={GREEN} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Answer</text>
      <text x={404} y={222} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">+ citations [Doc N]</text>

      {/* Eval metrics bottom bar */}
      <rect x={8} y={256} width={444} height={56} rx={8} fill={`${ROSE}06`} stroke={`${ROSE}20`} strokeWidth={1} />
      <text x={230} y={270} textAnchor="middle" fill={ROSE} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1">RAG EVAL METRICS (Ragas)</text>
      {[
        { label: 'Faithfulness', sub: 'answer ↔ context', color: CYAN },
        { label: 'Answer Relevancy', sub: 'answer ↔ query', color: GREEN },
        { label: 'Context Precision', sub: 'relevant chunks / all', color: AMBER },
        { label: 'Context Recall', sub: 'found / needed', color: ROSE },
      ].map((m, i) => (
        <g key={i}>
          <circle cx={24 + i * 110} cy={287} r={3} fill={m.color} opacity={0.9} />
          <text x={30 + i * 110} y={291} fill={m.color} fontSize={8} fontFamily="Bricolage Grotesque,sans-serif" fontWeight={700}>{m.label}</text>
          <text x={30 + i * 110} y={302} fill={TEXT_MUT} fontSize={7} fontFamily="Plus Jakarta Sans,sans-serif">{m.sub}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── 9. Observability ────────────────────────────────────────────────────────
export function ObservabilityDiagram() {
  const SKY = '#0ea5e9';
  return (
    <svg viewBox="0 0 460 310" style={{ width: '100%', maxWidth: 460 }}>
      <text x={230} y={13} textAnchor="middle" fill={SKY} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1.5">AGENT OBSERVABILITY STACK</text>

      {/* Agent run box */}
      <rect x={10} y={20} width={160} height={170} rx={10} fill={`${CYAN}06`} stroke={`${CYAN}20`} strokeWidth={1} strokeDasharray="5,3" />
      <text x={90} y={36} textAnchor="middle" fill={CYAN} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1">AGENT RUN</text>
      {[
        { label: 'LLM Call', color: CYAN, emoji: '🤖', y: 44 },
        { label: 'Tool Call', color: GREEN, emoji: '⚡', y: 90 },
        { label: 'Sub-agent', color: PURPLE, emoji: '🕹️', y: 136 },
      ].map((s, i) => (
        <g key={i}>
          <rect x={18} y={s.y} width={142} height={38} rx={6} fill={`${s.color}14`} stroke={`${s.color}40`} strokeWidth={1} />
          <text x={26} y={s.y + 15} fontSize={13}>{s.emoji}</text>
          <text x={46} y={s.y + 13} fill={s.color} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{s.label}</text>
          <text x={46} y={s.y + 24} fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">tokens · latency · cost · result</text>
          <text x={46} y={s.y + 33} fill={TEXT_MUT} fontSize={7} fontFamily="Plus Jakarta Sans,sans-serif">span_id · parent_id · run_id</text>
        </g>
      ))}

      {/* Arrow to OTel collector */}
      <Arrow x1={172} y1={105} x2={196} y2={105} color={SKY} />
      <text x={182} y={100} textAnchor="middle" fill={SKY} fontSize={7} fontFamily="Plus Jakarta Sans,sans-serif">emit</text>

      {/* OTel / Collector */}
      <rect x={198} y={60} width={88} height={90} rx={8} fill={`${AMBER}12`} stroke={`${AMBER}40`} strokeWidth={1.5} />
      <text x={242} y={78} textAnchor="middle" fill={AMBER} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">OTel</text>
      <text x={242} y={90} textAnchor="middle" fill={AMBER} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">Collector</text>
      <text x={242} y={104} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">ingest</text>
      <text x={242} y={114} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">sample</text>
      <text x={242} y={124} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">route</text>
      <text x={242} y={134} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">enrich</text>
      <text x={242} y={144} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">redact PII</text>

      {/* Three pillars */}
      <Arrow x1={288} y1={88} x2={312} y2={68} color={AMBER} />
      <Arrow x1={288} y1={105} x2={312} y2={105} color={AMBER} />
      <Arrow x1={288} y1={122} x2={312} y2={142} color={AMBER} />

      {[
        { label: 'TRACES', sub: 'Full causal chain\nper run', color: CYAN, y: 44 },
        { label: 'METRICS', sub: 'Completion rate\nlatency P95\ncost/task', color: GREEN, y: 88 },
        { label: 'LOGS', sub: 'Structured JSON\nevery event', color: PURPLE, y: 128 },
      ].map((p, i) => (
        <g key={i}>
          <rect x={314} y={p.y} width={132} height={36} rx={6} fill={`${p.color}14`} stroke={`${p.color}40`} strokeWidth={1.5} />
          <text x={322} y={p.y + 14} fill={p.color} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{p.label}</text>
          {p.sub.split('\n').map((line, li) => (
            <text key={li} x={322} y={p.y + 24 + li * 9} fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">{line}</text>
          ))}
        </g>
      ))}

      {/* Alert engine */}
      <rect x={198} y={168} width={248} height={36} rx={6} fill={`${RED}12`} stroke={`${RED}40`} strokeWidth={1.5} />
      <text x={210} y={183} fill={RED} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">⚠ Alert Engine</text>
      <text x={210} y={196} fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">P1: completion drop &gt;20% · P2: latency&gt;SLA · P3: cost spike</text>
      <Arrow x1={380} y1={162} x2={380} y2={166} color={RED} />

      {/* Dashboard */}
      <rect x={10} y={206} width={436} height={48} rx={8} fill={`${SKY}08`} stroke={`${SKY}20`} strokeWidth={1} />
      <text x={228} y={220} textAnchor="middle" fill={SKY} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1">OBSERVABILITY DASHBOARD</text>
      {[
        { label: 'Task Rate', color: GREEN },
        { label: 'P95 Latency', color: CYAN },
        { label: 'Cost/Task', color: AMBER },
        { label: 'Safety Triggers', color: RED },
        { label: 'Tool Errors', color: ORANGE },
        { label: 'Judge Score', color: PURPLE },
      ].map((m, i) => (
        <g key={i}>
          <circle cx={32 + i * 68} cy={238} r={3} fill={m.color} opacity={0.9} />
          <text x={38 + i * 68} y={241} fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">{m.label}</text>
        </g>
      ))}

      {/* Eval feedback loop */}
      <rect x={10} y={264} width={436} height={36} rx={8} fill={`${PURPLE}08`} stroke={`${PURPLE}20`} strokeWidth={1} />
      <text x={228} y={278} textAnchor="middle" fill={PURPLE} fontSize={8.5} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">EVAL FEEDBACK LOOP</text>
      <text x={228} y={291} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">
        Sample prod traces → async LLM-as-judge → score → alert if below threshold → add failures to golden dataset
      </text>
    </svg>
  );
}

// ─── 9. Memory & State ───────────────────────────────────────────────────────
export function MemoryDiagram() {
  const memTypes = [
    { label: '1 · In-Context', sub: 'Working memory', detail: '8K–200K tokens · instant · wiped on session end', color: CYAN, x: 10, y: 30 },
    { label: '2 · External / Semantic', sub: 'Long-term knowledge', detail: 'Vector DB · unlimited · 50-200ms retrieval', color: PURPLE, x: 10, y: 110 },
    { label: '3 · Episodic', sub: 'Past experiences', detail: 'Action log · what worked, what failed', color: AMBER, x: 10, y: 190 },
    { label: '4 · Procedural', sub: 'How to do things', detail: 'SKILL.md · AGENTS.md · static between runs', color: GREEN, x: 10, y: 270 },
  ];
  const bw = 175, bh = 68;

  return (
    <svg viewBox="0 0 460 360" style={{ width: '100%', maxWidth: 460 }}>
      <text x={230} y={14} textAnchor="middle" fill={CYAN} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1.5">4 TYPES OF AGENT MEMORY</text>

      {memTypes.map((m, i) => (
        <g key={i}>
          <rect x={m.x} y={m.y} width={bw} height={bh} rx={8}
            fill={`${m.color}12`} stroke={`${m.color}45`} strokeWidth={1.5} />
          <text x={m.x + 10} y={m.y + 20} fill={m.color} fontSize={10} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif">{m.label}</text>
          <text x={m.x + 10} y={m.y + 34} fill={TEXT} fontSize={8.5} fontFamily="Plus Jakarta Sans,sans-serif" fontWeight={600}>{m.sub}</text>
          <text x={m.x + 10} y={m.y + 48} fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">{m.detail}</text>
          {/* Speed/duration bar */}
          <rect x={m.x + 10} y={m.y + 56} width={bw - 20} height={4} rx={2} fill={`${m.color}20`} />
          <rect x={m.x + 10} y={m.y + 56} width={(bw - 20) * (1 - i * 0.18)} height={4} rx={2} fill={`${m.color}80`} />
          <text x={m.x + bw - 12} y={m.y + 60} fill={TEXT_MUT} fontSize={6.5} fontFamily="Plus Jakarta Sans,sans-serif" textAnchor="end">{['fastest', 'fast', 'medium', 'static'][i]}</text>
        </g>
      ))}

      {/* Right side — agent context window */}
      <rect x={210} y={28} width={240} height={175} rx={10} fill={`${CYAN}06`} stroke={`${CYAN}20`} strokeWidth={1} strokeDasharray="5,3" />
      <text x={330} y={44} textAnchor="middle" fill={CYAN} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1">CONTEXT WINDOW</text>
      <text x={330} y={54} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">(what the LLM sees right now)</text>

      {[
        { label: 'System Prompt', h: 20, color: GREEN, note: 'procedural' },
        { label: 'Retrieved Memory', h: 28, color: PURPLE, note: 'external → injected' },
        { label: 'Episodic Summary', h: 20, color: AMBER, note: 'compressed history' },
        { label: 'Current Task + Tools', h: 22, color: CYAN, note: 'in-context' },
        { label: 'Tool Results', h: 22, color: PINK, note: 'in-context' },
      ].reduce((acc, block, i) => {
        const y = acc.y;
        acc.elements.push(
          <g key={i}>
            <rect x={218} y={y} width={225} height={block.h} rx={4}
              fill={`${block.color}18`} stroke={`${block.color}35`} strokeWidth={1} />
            <text x={226} y={y + block.h / 2 + 4} fill={block.color} fontSize={8.5} fontFamily="Bricolage Grotesque,sans-serif" fontWeight={700}>{block.label}</text>
            <text x={434} y={y + block.h / 2 + 4} fill={TEXT_MUT} fontSize={7} fontFamily="Plus Jakarta Sans,sans-serif" textAnchor="end">{block.note}</text>
          </g>
        );
        acc.y += block.h + 3;
        return acc;
      }, { y: 60, elements: [] }).elements}

      {/* Retrieval flow */}
      <rect x={210} y={218} width={240} height={110} rx={10} fill={`${PURPLE}06`} stroke={`${PURPLE}20`} strokeWidth={1} />
      <text x={330} y={234} textAnchor="middle" fill={PURPLE} fontSize={9} fontWeight={700} fontFamily="Bricolage Grotesque,sans-serif" letterSpacing="1">RAG RETRIEVAL LOOP</text>
      {[
        'Query built from current task',
        '→ Hybrid search (dense + sparse)',
        '→ Reranker scores (query, chunk)',
        '→ Top-k injected into context',
      ].map((s, i) => (
        <text key={i} x={220} y={250 + i * 18} fill={i === 0 ? TEXT : TEXT_MUT} fontSize={8.5} fontFamily="Plus Jakarta Sans,sans-serif" fontWeight={i === 0 ? 600 : 400}>{s}</text>
      ))}
      <text x={330} y={322} textAnchor="middle" fill={TEXT_MUT} fontSize={7.5} fontFamily="Plus Jakarta Sans,sans-serif">Hybrid search + reranker beats either alone</text>

      {/* Arrows from memory types into context */}
      <Arrow x1={187} y1={64} x2={216} y2={74} color={GREEN} dashed />
      <Arrow x1={187} y1={144} x2={216} y2={100} color={PURPLE} dashed />
      <Arrow x1={187} y1={224} x2={216} y2={118} color={AMBER} dashed />

      {/* State across runs arrow */}
      <rect x={10} y={344} width={440} height={12} rx={4} fill={`${RED}10`} stroke={`${RED}25`} strokeWidth={1} />
      <text x={230} y={354} textAnchor="middle" fill={RED} fontSize={8} fontFamily="Plus Jakarta Sans,sans-serif" fontWeight={600}>
        ⚠ The model forgets between runs — external store + spine (progress.md) is the only solution
      </text>
    </svg>
  );
}

// Map topic id → diagram component
export function DeepAgentsDiagram() {
  const purple = '#7c3aed';
  const purpleLight = '#a78bfa';
  const cyan = '#06b6d4';
  const green = '#10b981';
  const orange = '#f97316';
  const red = '#ef4444';
  const bg = '#0f172a';
  const card = '#1e293b';
  const border = '#334155';
  const text = '#e2e8f0';
  const muted = '#94a3b8';

  const phases = [
    { label: 'PLAN', color: purple, x: 60, desc: 'Decompose goal into sub-questions' },
    { label: 'SEARCH', color: cyan, x: 180, desc: 'Fan-out across 50-200 sources' },
    { label: 'READ', color: green, x: 300, desc: 'Score relevance, offload low-signal' },
    { label: 'REFLECT', color: orange, x: 420, desc: 'Gaps? Contradictions? Confident?' },
    { label: 'ITERATE', color: red, x: 540, desc: 'Re-query or stop (budget/novelty)' },
    { label: 'SYNTHESIZE', color: purpleLight, x: 660, desc: 'Cited report delivered' },
  ];

  return (
    <svg viewBox="0 0 780 310" style={{ width: '100%', maxWidth: 780, display: 'block' }}>
      <rect width="780" height="310" fill={bg} rx="12" />

      {/* Title */}
      <text x="390" y="28" textAnchor="middle" fill={text} fontSize="13" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">Deep Agent Core Loop</text>

      {/* Phase boxes */}
      {phases.map((p, i) => (
        <g key={p.label}>
          <rect x={p.x} y="48" width="110" height="56" rx="8" fill={`${p.color}22`} stroke={p.color} strokeWidth="1.5" />
          <text x={p.x + 55} y="74" textAnchor="middle" fill={p.color} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">{p.label}</text>
          <text x={p.x + 55} y="91" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">{p.desc}</text>
          {i < phases.length - 1 && (
            <path d={`M ${p.x + 112} 76 L ${p.x + 122} 76`} stroke={border} strokeWidth="1.5" markerEnd="url(#arr)" />
          )}
        </g>
      ))}

      {/* Arrow marker */}
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={border} />
        </marker>
        <marker id="arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={red} />
        </marker>
      </defs>

      {/* Iterate back arrow */}
      <path d="M 652 104 Q 652 120 390 120 Q 180 120 180 104" stroke={red} strokeWidth="1.5" fill="none" strokeDasharray="4,3" markerEnd="url(#arr2)" />
      <text x="390" y="136" textAnchor="middle" fill={red} fontSize="8.5" fontFamily="Plus Jakarta Sans,sans-serif">← Re-iterate if gaps remain</text>

      {/* Context management box */}
      <rect x="40" y="155" width="320" height="130" rx="8" fill={card} stroke={border} strokeWidth="1" />
      <text x="200" y="174" textAnchor="middle" fill={purpleLight} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">Context Budget Management</text>
      {[
        ['Relevance scoring', 'Keep top 10-20% of retrieved content'],
        ['Virtual filesystem', 'Offload raw content; read selectively'],
        ['Progressive summary', 'Compress earlier turns into research log'],
        ['Sub-agent isolation', 'Each thread has isolated context window'],
        ['Prefix caching', '50-70% cache hit → huge cost savings'],
      ].map(([k, v], i) => (
        <g key={k}>
          <text x="56" y={192 + i * 18} fill={green} fontSize="8.5" fontWeight="600" fontFamily="Plus Jakarta Sans,sans-serif">{k}</text>
          <text x="180" y={192 + i * 18} fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">{v}</text>
        </g>
      ))}

      {/* Cost comparison box */}
      <rect x="400" y="155" width="340" height="130" rx="8" fill={card} stroke={border} strokeWidth="1" />
      <text x="570" y="174" textAnchor="middle" fill={cyan} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">Deep Research Tiers (Google)</text>
      {[
        ['', 'Base', 'Max'],
        ['Queries', '~80', '~160'],
        ['Tokens', '~250K', '~900K'],
        ['Runtime', '<20 min', '40-60 min'],
        ['Cost/task', '$1-3', '$3-7'],
        ['Best for', 'Interactive, scale', 'Overnight, 100+ sources'],
      ].map(([k, v1, v2], i) => (
        <g key={i}>
          <text x="416" y={192 + i * 15.5} fill={i === 0 ? muted : text} fontSize="8" fontWeight={i === 0 ? '600' : '400'} fontFamily="Plus Jakarta Sans,sans-serif">{k}</text>
          <text x="534" y={192 + i * 15.5} fill={i === 0 ? cyan : muted} fontSize="8" fontWeight={i === 0 ? '700' : '400'} textAnchor="middle" fontFamily="Plus Jakarta Sans,sans-serif">{v1}</text>
          <text x="638" y={192 + i * 15.5} fill={i === 0 ? purpleLight : muted} fontSize="8" fontWeight={i === 0 ? '700' : '400'} textAnchor="middle" fontFamily="Plus Jakarta Sans,sans-serif">{v2}</text>
        </g>
      ))}

      {/* Bottom label */}
      <text x="390" y="300" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">Open-source: LangChain Deep Agents (langchain-ai/deepagents) — Managed: Google Deep Research API</text>
    </svg>
  );
}

export function HybridSearchDiagram() {
  const blue = '#0ea5e9';
  const amber = '#f59e0b';
  const green = '#10b981';
  const purple = '#8b5cf6';
  const bg = '#0f172a';
  const card = '#1e293b';
  const border = '#334155';
  const text = '#e2e8f0';
  const muted = '#94a3b8';

  return (
    <svg viewBox="0 0 780 310" style={{ width: '100%', maxWidth: 780, display: 'block' }}>
      <rect width="780" height="310" fill={bg} rx="12" />
      <defs>
        <marker id="hsarr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#334155" />
        </marker>
      </defs>
      <text x="390" y="26" textAnchor="middle" fill={text} fontSize="13" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">Hybrid Search + Reranking Pipeline</text>

      {/* Query box */}
      <rect x="310" y="38" width="160" height="36" rx="8" fill={`${blue}20`} stroke={blue} strokeWidth="1.5" />
      <text x="390" y="61" textAnchor="middle" fill={blue} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">User Query</text>

      {/* Fork arrows */}
      <path d="M390 74 L390 92 L200 92 L200 108" stroke={border} strokeWidth="1.5" fill="none" markerEnd="url(#hsarr)" />
      <path d="M390 74 L390 92 L580 92 L580 108" stroke={border} strokeWidth="1.5" fill="none" markerEnd="url(#hsarr)" />
      <text x="390" y="90" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">parallel</text>

      {/* BM25 box */}
      <rect x="100" y="108" width="200" height="70" rx="8" fill={`${amber}18`} stroke={amber} strokeWidth="1.5" />
      <text x="200" y="128" textAnchor="middle" fill={amber} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">BM25 Sparse Index</text>
      <text x="200" y="144" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">Exact-match · TF-IDF · lexical</text>
      <text x="200" y="158" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">k1=1.2, b=0.75</text>
      <text x="200" y="172" textAnchor="middle" fill={amber} fontSize="8" fontWeight="600" fontFamily="Plus Jakarta Sans,sans-serif">→ top-100 candidates (~15ms)</text>

      {/* Dense box */}
      <rect x="480" y="108" width="200" height="70" rx="8" fill={`${blue}18`} stroke={blue} strokeWidth="1.5" />
      <text x="580" y="128" textAnchor="middle" fill={blue} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">Dense Vector Index</text>
      <text x="580" y="144" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">Semantic · embedding similarity</text>
      <text x="580" y="158" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">ANN search (HNSW)</text>
      <text x="580" y="172" textAnchor="middle" fill={blue} fontSize="8" fontWeight="600" fontFamily="Plus Jakarta Sans,sans-serif">→ top-100 candidates (~18ms)</text>

      {/* RRF box */}
      <path d="M200 178 L200 200 L390 200 L390 210" stroke={border} strokeWidth="1.5" fill="none" markerEnd="url(#hsarr)" />
      <path d="M580 178 L580 200 L390 200" stroke={border} strokeWidth="1.5" fill="none" />
      <rect x="270" y="210" width="240" height="50" rx="8" fill={`${green}18`} stroke={green} strokeWidth="1.5" />
      <text x="390" y="230" textAnchor="middle" fill={green} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">RRF Fusion  (k=60)</text>
      <text x="390" y="246" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">score(d) = Σ weight_i / (k + rank_i(d))</text>
      <text x="390" y="257" textAnchor="middle" fill={green} fontSize="8" fontWeight="600" fontFamily="Plus Jakarta Sans,sans-serif">→ merged top-100 list (~24ms total)</text>

      {/* Reranker */}
      <path d="M390 260 L390 272" stroke={border} strokeWidth="1.5" markerEnd="url(#hsarr)" />
      <rect x="270" y="272" width="240" height="28" rx="8" fill={`${purple}18`} stroke={purple} strokeWidth="1.5" />
      <text x="390" y="286" textAnchor="middle" fill={purple} fontSize="9" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">Cross-encoder Reranker  (top-50 → top-5)</text>
      <text x="390" y="298" textAnchor="middle" fill={muted} fontSize="7.5" fontFamily="Plus Jakarta Sans,sans-serif">Cohere Rerank 230ms · FlashRank 76ms · sees query+doc jointly</text>
    </svg>
  );
}

export function LLMCachingDiagram() {
  const amber = '#f59e0b';
  const green = '#10b981';
  const cyan = '#06b6d4';
  const purple = '#8b5cf6';
  const red = '#ef4444';
  const bg = '#0f172a';
  const card = '#1e293b';
  const border = '#334155';
  const text = '#e2e8f0';
  const muted = '#94a3b8';

  const layers = [
    { label: 'Layer 1', name: 'Exact-match Cache', color: green, y: 50, desc: '~0ms · bypasses model · Redis', save: '100% cost on hit' },
    { label: 'Layer 2', name: 'Semantic Cache', color: cyan, y: 115, desc: '5-20ms · embed + cosine similarity', save: '30-80% cost reduction' },
    { label: 'Layer 3', name: 'Prompt/Prefix Cache', color: amber, y: 180, desc: 'Provider-level KV tensor reuse', save: '50-90% input tokens' },
    { label: 'Layer 4', name: 'KV Cache (within-request)', color: purple, y: 245, desc: 'Inference engine · automatic · always on', save: 'O(n²) → O(n) decode' },
  ];

  return (
    <svg viewBox="0 0 780 320" style={{ width: '100%', maxWidth: 780, display: 'block' }}>
      <rect width="780" height="320" fill={bg} rx="12" />
      <text x="390" y="28" textAnchor="middle" fill={text} fontSize="13" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">LLM Caching — 4 Complementary Layers</text>

      {layers.map((l) => (
        <g key={l.label}>
          <rect x="30" y={l.y} width="520" height="50" rx="8" fill={`${l.color}18`} stroke={l.color} strokeWidth="1.5" />
          <text x="50" y={l.y + 18} fill={l.color} fontSize="9" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">{l.label}</text>
          <text x="120" y={l.y + 18} fill={text} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">{l.name}</text>
          <text x="50" y={l.y + 36} fill={muted} fontSize="8.5" fontFamily="Plus Jakarta Sans,sans-serif">{l.desc}</text>
          <rect x="560" y={l.y + 10} width="190" height="30" rx="6" fill={`${l.color}14`} />
          <text x="655" y={l.y + 30} textAnchor="middle" fill={l.color} fontSize="8.5" fontWeight="600" fontFamily="Plus Jakarta Sans,sans-serif">{l.save}</text>
        </g>
      ))}

      {/* Down arrows */}
      {[100, 165, 230].map(y => (
        <path key={y} d={`M 280 ${y} L 280 ${y + 12}`} stroke={border} strokeWidth="1.5" markerEnd="url(#darr)" />
      ))}
      <defs>
        <marker id="darr" markerWidth="6" markerHeight="6" refX="3" refY="5" orient="auto">
          <path d="M0,0 L3,6 L6,0" fill="none" stroke="#334155" strokeWidth="1.5" />
        </marker>
      </defs>

      <text x="290" y="108" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">miss</text>
      <text x="290" y="173" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">miss</text>
      <text x="290" y="238" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">always active</text>

      {/* Prompt structure box */}
      <rect x="30" y="305" width="730" height="0" rx="0" />
      <text x="390" y="308" textAnchor="middle" fill={muted} fontSize="8.5" fontFamily="Plus Jakarta Sans,sans-serif">
        Prompt order: [System prompt] → [Tools] → [RAG docs] → [cache_control] → [User message (dynamic)]
      </text>
    </svg>
  );
}

export function TransformersDiagram() {
  const purple = '#8b5cf6';
  const cyan = '#06b6d4';
  const green = '#10b981';
  const amber = '#f59e0b';
  const pink = '#ec4899';
  const bg = '#0f172a';
  const card = '#1e293b';
  const border = '#334155';
  const text = '#e2e8f0';
  const muted = '#94a3b8';

  return (
    <svg viewBox="0 0 780 580" style={{ width: '100%', maxWidth: 780, display: 'block' }}>
      <defs>
        <marker id="tarr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#475569" />
        </marker>
        <marker id="tarr-c" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#06b6d4" />
        </marker>
        <marker id="tarr-p" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#8b5cf6" />
        </marker>
        <marker id="tarr-g" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#10b981" />
        </marker>
      </defs>
      <rect width="780" height="580" fill={bg} rx="12" />

      {/* ── PANEL A: Transformer Layer ── */}
      <text x="16" y="22" fill={cyan} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif" letterSpacing="1">A  TRANSFORMER LAYER STRUCTURE</text>

      {/* Input token stream */}
      {['t₁','t₂','t₃','…','tₙ'].map((t, i) => (
        <g key={t}>
          <rect x={36 + i * 46} y="34" width="36" height="22" rx="5" fill={`${cyan}22`} stroke={cyan} strokeWidth="1" />
          <text x={54 + i * 46} y="49" textAnchor="middle" fill={cyan} fontSize="9" fontFamily="Plus Jakarta Sans,sans-serif">{t}</text>
        </g>
      ))}
      <text x="290" y="45" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">Input tokens (embeddings + positional)</text>

      {/* Down arrows to LayerNorm 1 */}
      {[54, 100, 146, 192, 238].map(x => (
        <path key={x} d={`M${x} 56 L${x} 68`} stroke={border} strokeWidth="1" markerEnd="url(#tarr)" />
      ))}

      {/* LayerNorm 1 */}
      <rect x="20" y="68" width="270" height="20" rx="5" fill={`${amber}22`} stroke={amber} strokeWidth="1" />
      <text x="155" y="82" textAnchor="middle" fill={amber} fontSize="9" fontWeight="600" fontFamily="Plus Jakarta Sans,sans-serif">Layer Norm</text>

      {/* Down to MHA */}
      <path d="M155 88 L155 100" stroke={border} strokeWidth="1" markerEnd="url(#tarr)" />

      {/* Multi-Head Attention */}
      <rect x="20" y="100" width="270" height="50" rx="5" fill={`${cyan}18`} stroke={cyan} strokeWidth="1.5" />
      <text x="155" y="120" textAnchor="middle" fill={cyan} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">Multi-Head Attention</text>
      <text x="60" y="138" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">Q</text>
      <text x="145" y="138" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">K</text>
      <text x="230" y="138" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">V</text>
      {[62, 147, 232].map((x, i) => (
        <g key={i}>
          <rect x={x - 12} y="141" width="24" height="14" rx="3" fill={`${[cyan,green,pink][i]}30`} stroke={[cyan,green,pink][i]} strokeWidth="1" />
          <text x={x} y="152" textAnchor="middle" fill={[cyan,green,pink][i]} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">{['Q','K','V'][i]}</text>
        </g>
      ))}

      {/* Residual + down */}
      <path d="M155 155 L155 168" stroke={border} strokeWidth="1" markerEnd="url(#tarr)" />
      <text x="162" y="165" fill={muted} fontSize="7.5" fontFamily="Plus Jakarta Sans,sans-serif">+ residual</text>

      {/* LayerNorm 2 */}
      <rect x="20" y="168" width="270" height="20" rx="5" fill={`${amber}22`} stroke={amber} strokeWidth="1" />
      <text x="155" y="182" textAnchor="middle" fill={amber} fontSize="9" fontWeight="600" fontFamily="Plus Jakarta Sans,sans-serif">Layer Norm</text>

      <path d="M155 188 L155 200" stroke={border} strokeWidth="1" markerEnd="url(#tarr)" />

      {/* FFN / MLP */}
      <rect x="20" y="200" width="270" height="32" rx="5" fill={`${purple}18`} stroke={purple} strokeWidth="1.5" />
      <text x="155" y="216" textAnchor="middle" fill={purple} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">Feed-Forward / MLP</text>
      <text x="155" y="228" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">W₂ · GELU(W₁ · x)  — 4× wider than d_model</text>

      <path d="M155 232 L155 244" stroke={border} strokeWidth="1" markerEnd="url(#tarr)" />
      <text x="162" y="242" fill={muted} fontSize="7.5" fontFamily="Plus Jakarta Sans,sans-serif">+ residual</text>

      <rect x="20" y="244" width="270" height="20" rx="5" fill={`${green}22`} stroke={green} strokeWidth="1" />
      <text x="155" y="258" textAnchor="middle" fill={green} fontSize="9" fontWeight="600" fontFamily="Plus Jakarta Sans,sans-serif">Output (richer token representations)</text>

      <text x="155" y="278" textAnchor="middle" fill={muted} fontSize="7.5" fontFamily="Plus Jakarta Sans,sans-serif">× 24–96 identical layers stacked</text>

      {/* ── PANEL B: Q/K/V Attention ── */}
      <text x="330" y="22" fill={pink} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif" letterSpacing="1">B  ATTENTION: Q · K → SCORES → WEIGHT V</text>

      {/* Token row */}
      {['the','cat','sat','on'].map((t, i) => (
        <g key={t}>
          <rect x={330 + i * 110} y="34" width="90" height="22" rx="5" fill={`${muted}18`} stroke={border} strokeWidth="1" />
          <text x={375 + i * 110} y="49" textAnchor="middle" fill={text} fontSize="9" fontFamily="Plus Jakarta Sans,sans-serif">{t}</text>
        </g>
      ))}

      {/* Current query token highlight */}
      <rect x="770" y="34" width="0" height="0" />
      <text x="545" y="70" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">Query token: "sat" is asking "what am I related to?"</text>

      {/* Attention score heatmap */}
      {['the','cat','sat','on'].map((tok, i) => {
        const scores = [0.05, 0.65, 1.0, 0.3];
        const score = scores[i];
        const opacity = 0.15 + score * 0.7;
        return (
          <g key={tok}>
            <rect x={330 + i * 110} y="78" width="90" height="36" rx="5" fill={cyan} opacity={opacity} />
            <text x={375 + i * 110} y="94" textAnchor="middle" fill={text} fontSize="9" fontFamily="Plus Jakarta Sans,sans-serif">{tok}</text>
            <text x={375 + i * 110} y="107" textAnchor="middle" fill={cyan} fontSize="9" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">{score.toFixed(2)}</text>
          </g>
        );
      })}
      <text x="545" y="130" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">Attention scores: softmax(Q·Kᵀ / √d_k)</text>

      {/* V weighted sum arrow */}
      <path d="M545 134 L545 148" stroke={cyan} strokeWidth="1.5" markerEnd="url(#tarr-c)" />

      <rect x="380" y="148" width="330" height="28" rx="6" fill={`${green}20`} stroke={green} strokeWidth="1.5" />
      <text x="545" y="162" textAnchor="middle" fill={green} fontSize="9" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">output = Σ score(i) × V(i)  — weighted mix of Values</text>
      <text x="545" y="174" textAnchor="middle" fill={muted} fontSize="7.5" fontFamily="Plus Jakarta Sans,sans-serif">"sat" now carries context from "the" (5%), "cat" (65%), itself (100%), "on" (30%)</text>

      <text x="545" y="195" textAnchor="middle" fill={muted} fontSize="7.5" fontFamily="Plus Jakarta Sans,sans-serif">🔑 K and V cached after first compute  ·  Q computed fresh for every new token</text>

      {/* ── PANEL C: KV Cache growth ── */}
      <text x="16" y="302" fill={amber} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif" letterSpacing="1">C  KV CACHE GROWTH DURING DECODE</text>

      {/* Step labels */}
      {['Prefill\n(prompt)', 'Decode\nstep 1', 'Decode\nstep 2', 'Decode\nstep 3'].map((label, si) => {
        const x = 16 + si * 190;
        const toks = [
          ['You','are','helpful'],
          ['You','are','helpful','The'],
          ['You','are','helpful','The','answer'],
          ['You','are','helpful','The','answer','is'],
        ][si];
        return (
          <g key={si}>
            <text x={x + 80} y="320" textAnchor="middle" fill={si === 0 ? cyan : amber} fontSize="8.5" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">{label.split('\n')[0]}</text>
            <text x={x + 80} y="330" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">{label.split('\n')[1]}</text>
            {toks.map((tok, ti) => (
              <g key={ti}>
                <rect x={x + ti * 28} y="336" width="26" height="18" rx="3"
                  fill={ti >= 3 ? `${amber}30` : `${cyan}20`}
                  stroke={ti >= 3 ? amber : cyan} strokeWidth={ti >= 3 ? 1.5 : 1} />
                <text x={x + ti * 28 + 13} y="349" textAnchor="middle" fill={ti >= 3 ? amber : muted} fontSize="6.5" fontFamily="Plus Jakarta Sans,sans-serif">{tok}</text>
              </g>
            ))}
            <text x={x + 80} y="370" textAnchor="middle" fill={muted} fontSize="7.5" fontFamily="Plus Jakarta Sans,sans-serif">KV cache: {toks.length} entries</text>
            {si < 3 && <path d={`M${x + 170} 350 L${x + 180} 350`} stroke={border} strokeWidth="1.5" markerEnd="url(#tarr)" />}
          </g>
        );
      })}
      <text x="390" y="390" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">Each decode step loads ALL cached K,V from GPU memory → memory-bandwidth-bound</text>

      {/* ── PANEL D: Prefill vs Decode comparison ── */}
      <text x="16" y="412" fill={green} fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif" letterSpacing="1">D  PREFILL vs DECODE — BOTTLENECKS &amp; METRICS</text>

      {/* Prefill col */}
      <rect x="16" y="422" width="370" height="140" rx="8" fill={`${cyan}0e`} stroke={cyan} strokeWidth="1.5" />
      <text x="201" y="440" textAnchor="middle" fill={cyan} fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">PREFILL</text>
      {[
        ['Processing', 'All N tokens in ONE parallel pass'],
        ['Attention', '[N × N] causal matrix'],
        ['Bottleneck', 'Compute-bound (GPU FLOPs)'],
        ['Output', 'First token · KV cache populated'],
        ['Metric', 'TTFT — Time To First Token'],
        ['Optimize with', 'FlashAttention · Prompt prefix cache'],
      ].map(([k, v], i) => (
        <g key={k}>
          <text x="32" y={457 + i * 17} fill={cyan} fontSize="8.5" fontWeight="600" fontFamily="Plus Jakarta Sans,sans-serif">{k}</text>
          <text x="130" y={457 + i * 17} fill={text} fontSize="8.5" fontFamily="Plus Jakarta Sans,sans-serif">{v}</text>
        </g>
      ))}

      {/* Arrow */}
      <path d="M392 492 L398 492" stroke={border} strokeWidth="2" markerEnd="url(#tarr)" />

      {/* Decode col */}
      <rect x="404" y="422" width="370" height="140" rx="8" fill={`${purple}0e`} stroke={purple} strokeWidth="1.5" />
      <text x="589" y="440" textAnchor="middle" fill={purple} fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">DECODE</text>
      {[
        ['Processing', 'ONE token per step (autoregressive)'],
        ['Attention', '[1 × seq_len] vector per step'],
        ['Bottleneck', 'Memory-bandwidth (loading KV cache)'],
        ['Output', 'One new token per iteration'],
        ['Metric', 'TPS — Tokens Per Second'],
        ['Optimize with', 'GQA · Speculative decoding · PagedAttention'],
      ].map(([k, v], i) => (
        <g key={k}>
          <text x="420" y={457 + i * 17} fill={purple} fontSize="8.5" fontWeight="600" fontFamily="Plus Jakarta Sans,sans-serif">{k}</text>
          <text x="520" y={457 + i * 17} fill={text} fontSize="8.5" fontFamily="Plus Jakarta Sans,sans-serif">{v}</text>
        </g>
      ))}

      <text x="390" y="572" textAnchor="middle" fill={muted} fontSize="8" fontFamily="Plus Jakarta Sans,sans-serif">O(n²) prefill cost · O(n) decode cost with KV cache vs O(n²) without</text>
    </svg>
  );
}

export const TOPIC_DIAGRAMS = {
  'guardrails': GuardrailsDiagram,
  'rag': RAGDiagram,
  'observability': ObservabilityDiagram,
  'memory-state': MemoryDiagram,
  'react': ReActDiagram,
  'enterprise-architecture': OrchestratorDiagram,
  'a2a': A2ADiagram,
  'mcp': MCPDiagram,
  'evals': EvalDiagram,
  'harness': HarnessDiagram,
  'loop-engineering': LoopDiagram,
  'deep-agents': DeepAgentsDiagram,
  'llm-caching': LLMCachingDiagram,
  'llm-internals': TransformersDiagram,
  'hybrid-search': HybridSearchDiagram,
};
