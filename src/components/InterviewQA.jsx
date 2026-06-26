import { useState } from 'react';
import { interviews } from '../data/interviews';
import MarkdownContent from './MarkdownContent';

const categoryColors = {
  'System Design': '#06b6d4',
  'Concepts & Depth': '#a78bfa',
  'Behavioral / Leadership': '#f59e0b',
  'Technical Deep Dives': '#10b981',
};

export default function InterviewQA() {
  const [openItems, setOpenItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggle = (key) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filtered = selectedCategory
    ? interviews.filter(s => s.category === selectedCategory)
    : interviews;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 40px' }}>
      {/* Header */}
      <div style={{ padding: '32px 0 24px', borderBottom: '1px solid rgba(6,182,212,0.15)', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 6 }}>
          Interview Q&A
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>
          {interviews.reduce((acc, s) => acc + s.questions.length, 0)} questions across {interviews.length} categories. Click to reveal answers.
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        <button
          onClick={() => setSelectedCategory(null)}
          style={filterStyle(null, selectedCategory, 'var(--cyan)')}
        >
          All
        </button>
        {interviews.map(s => (
          <button
            key={s.category}
            onClick={() => setSelectedCategory(s.category === selectedCategory ? null : s.category)}
            style={filterStyle(s.category, selectedCategory, categoryColors[s.category] || 'var(--cyan)')}
          >
            {s.category}
          </button>
        ))}
      </div>

      {/* Q&A Sections */}
      {filtered.map(section => {
        const color = categoryColors[section.category] || 'var(--cyan)';
        return (
          <div key={section.category} style={{ marginBottom: 32 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
            }}>
              <div style={{
                width: 3,
                height: 18,
                background: color,
                borderRadius: 2,
              }} />
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95em',
                fontWeight: 800,
                color: color,
                letterSpacing: '0.05em',
              }}>
                {section.category.toUpperCase()}
              </h2>
              <span style={{
                fontSize: '0.72em',
                color: 'var(--text-dim)',
                background: 'var(--bg-card)',
                border: '1px solid rgba(6,182,212,0.12)',
                borderRadius: 10,
                padding: '2px 8px',
              }}>
                {section.questions.length} questions
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.questions.map((qa, qi) => {
                const key = `${section.category}-${qi}`;
                const isOpen = !!openItems[key];
                return (
                  <div key={qi} style={{
                    background: 'var(--bg-card)',
                    border: `1px solid ${isOpen ? `${color}30` : 'rgba(6,182,212,0.1)'}`,
                    borderRadius: 10,
                    overflow: 'hidden',
                    transition: 'border-color 0.15s',
                  }}>
                    {/* Question Header */}
                    <button
                      onClick={() => toggle(key)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        textAlign: 'left',
                        background: isOpen ? `${color}08` : 'transparent',
                        borderBottom: isOpen ? `1px solid ${color}20` : 'none',
                        transition: 'background 0.15s',
                      }}
                    >
                      <span style={{
                        flexShrink: 0,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: isOpen ? color : 'var(--bg-hover)',
                        color: isOpen ? '#000' : 'var(--text-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7em',
                        fontWeight: 700,
                        marginTop: 1,
                        transition: 'all 0.15s',
                      }}>
                        {isOpen ? '▲' : qi + 1}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.9em',
                        fontWeight: 700,
                        color: isOpen ? 'var(--text)' : 'var(--text-muted)',
                        lineHeight: 1.5,
                        flex: 1,
                      }}>
                        {qa.q}
                      </span>
                    </button>

                    {/* Answer Body */}
                    {isOpen && (
                      <div style={{
                        padding: '18px 20px 18px 56px',
                      }}>
                        <div style={{
                          fontSize: '0.72em',
                          color: color,
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          marginBottom: 10,
                        }}>
                          ANSWER
                        </div>
                        <div style={{ fontSize: '0.86em' }}>
                          <MarkdownContent text={qa.a} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function filterStyle(val, selected, color) {
  const isActive = val === null ? selected === null : selected === val;
  return {
    padding: '6px 14px',
    background: isActive ? color : 'var(--bg-card)',
    border: `1px solid ${isActive ? color : 'rgba(6,182,212,0.2)'}`,
    borderRadius: 20,
    color: isActive ? '#000' : 'var(--text-muted)',
    fontSize: '0.78em',
    fontFamily: 'var(--font-mono)',
    fontWeight: isActive ? 700 : 400,
    cursor: 'pointer',
    transition: 'all 0.15s',
  };
}
