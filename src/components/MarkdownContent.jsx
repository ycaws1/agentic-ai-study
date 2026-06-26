// Lightweight markdown renderer — handles bold, code, tables, lists
export default function MarkdownContent({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;
  let keyCounter = 0;

  const nextKey = () => `mc-${keyCounter++}`;

  const parseLine = (line) => {
    const parts = [];
    let remaining = line;
    let partKey = 0;

    while (remaining.length > 0) {
      // Bold **text**
      const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
      // Inline code `code`
      const codeMatch = remaining.match(/^(.*?)`([^`]+)`(.*)/s);

      if (boldMatch && (!codeMatch || boldMatch[1].length <= codeMatch[1].length)) {
        if (boldMatch[1]) parts.push(<span key={partKey++}>{boldMatch[1]}</span>);
        parts.push(<strong key={partKey++} style={{ color: 'var(--cyan)', fontWeight: 600 }}>{boldMatch[2]}</strong>);
        remaining = boldMatch[3];
      } else if (codeMatch) {
        if (codeMatch[1]) parts.push(<span key={partKey++}>{codeMatch[1]}</span>);
        parts.push(
          <code key={partKey++} style={{
            fontFamily: 'var(--font-mono)',
            background: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.2)',
            borderRadius: 3,
            padding: '1px 5px',
            fontSize: '0.85em',
            color: 'var(--cyan)',
          }}>{codeMatch[2]}</code>
        );
        remaining = codeMatch[3];
      } else {
        parts.push(<span key={partKey++}>{remaining}</span>);
        remaining = '';
      }
    }
    return parts;
  };

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={nextKey()} style={{
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(6,182,212,0.15)',
          borderRadius: 6,
          padding: '10px 14px',
          overflowX: 'auto',
          margin: '8px 0',
          fontSize: '0.8em',
          lineHeight: 1.5,
          color: '#90c4d8',
          whiteSpace: 'pre',
        }}>{codeLines.join('\n')}</pre>
      );
      i++;
      continue;
    }

    // Table row
    if (line.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const filteredRows = tableLines.filter(r => !r.match(/^\|[-| :]+\|$/));
      const rows = filteredRows.map(r =>
        r.split('|').slice(1, -1).map(cell => cell.trim())
      );
      if (rows.length > 0) {
        elements.push(
          <div key={nextKey()} style={{ overflowX: 'auto', margin: '8px 0' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.82em' }}>
              <thead>
                <tr>{rows[0].map((cell, ci) => (
                  <th key={ci} style={{
                    background: 'rgba(6,182,212,0.1)',
                    color: 'var(--cyan)',
                    padding: '6px 10px',
                    textAlign: 'left',
                    border: '1px solid rgba(6,182,212,0.2)',
                    fontWeight: 600,
                  }}>{parseLine(cell)}</th>
                ))}</tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{
                        padding: '6px 10px',
                        border: '1px solid rgba(6,182,212,0.1)',
                        color: 'var(--text-muted)',
                        verticalAlign: 'top',
                      }}>{parseLine(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        const m = lines[i].match(/^\d+\.\s+(.*)/);
        listItems.push(m[1]);
        i++;
      }
      elements.push(
        <ol key={nextKey()} style={{ paddingLeft: 20, margin: '6px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
          {listItems.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 4, lineHeight: 1.6 }}>{parseLine(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list
    if (line.match(/^[•\-\*]\s+/) || line.match(/^✓|^✗/)) {
      const listItems = [];
      while (i < lines.length && (lines[i].match(/^[•\-\*]\s+/) || lines[i].match(/^✓|^✗/))) {
        listItems.push(lines[i].replace(/^[•\-\*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={nextKey()} style={{ paddingLeft: 18, margin: '6px 0', color: 'var(--text-muted)', listStyle: 'none', fontFamily: 'var(--font-body)' }}>
          {listItems.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 4, display: 'flex', gap: 8, alignItems: 'flex-start', lineHeight: 1.6 }}>
              <span style={{ color: 'var(--cyan)', flexShrink: 0, marginTop: 2, fontFamily: 'var(--font-mono)' }}>›</span>
              <span>{parseLine(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={nextKey()} style={{ height: 6 }} />);
      i++;
      continue;
    }

    // Heading-like (all caps or starts with #)
    if (line.startsWith('# ')) {
      elements.push(
        <h3 key={nextKey()} style={{ color: 'var(--cyan)', fontSize: '0.95em', fontWeight: 700, marginBottom: 4, marginTop: 8 }}>
          {line.slice(2)}
        </h3>
      );
      i++;
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={nextKey()} style={{ color: 'var(--text-muted)', marginBottom: 4, lineHeight: 1.7, fontFamily: 'var(--font-body)', fontSize: '0.97em' }}>
        {parseLine(line)}
      </p>
    );
    i++;
  }

  return <div>{elements}</div>;
}
