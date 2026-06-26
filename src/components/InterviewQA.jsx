import { useState } from 'react';
import { interviews } from '../data/interviews';
import MarkdownContent from './MarkdownContent';

// Normalize both data formats into a flat list of { category, question, answer, sections, difficulty }
function normalizeInterviews(data) {
  const flat = [];
  data.forEach(item => {
    if (item.questions) {
      // Old format: { category, questions: [{q, a}] }
      item.questions.forEach(qa => {
        flat.push({
          category: item.category,
          question: qa.q,
          answer: qa.a,
          sections: null,
          difficulty: null,
        });
      });
    } else if (item.question) {
      // New format: { id, category, question, difficulty, sections: [{title, content}] }
      flat.push({
        category: item.category,
        question: item.question,
        answer: null,
        sections: item.sections || null,
        difficulty: item.difficulty || null,
      });
    }
  });
  return flat;
}

const allItems = normalizeInterviews(interviews);
const allCategories = [...new Set(allItems.map(i => i.category))];

const CATEGORY_COLORS = [
  '#06b6d4', '#a78bfa', '#f59e0b', '#10b981', '#ef4444',
  '#f97316', '#8b5cf6', '#ec4899', '#22d3ee', '#34d399',
  '#0ea5e9', '#fb7185', '#f43f5e', '#7c3aed', '#dc2626',
];

function getCategoryColor(category) {
  const idx = allCategories.indexOf(category);
  return CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
}

const DIFFICULTY_COLOR = {
  easy: '#10b981',
  medium: '#f59e0b',
  hard: '#ef4444',
};

export default function InterviewQA() {
  const [openItems, setOpenItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggle = (key) => setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));

  const filtered = selectedCategory
    ? allItems.filter(i => i.category === selectedCategory)
    : allItems;

  const groupedByCategory = allCategories
    .filter(cat => !selectedCategory || cat === selectedCategory)
    .map(cat => ({
      category: cat,
      color: getCategoryColor(cat),
      items: filtered.filter(i => i.category === cat),
    }))
    .filter(g => g.items.length > 0);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 40px' }}>
      {/* Header */}
      <div style={{ padding: '32px 0 24px', borderBottom: '1px solid rgba(6,182,212,0.15)', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 6 }}>
          Interview Q&amp;A
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>
          {allItems.length} questions across {allCategories.length} categories. Click to reveal answers.
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        <button
          onClick={() => setSelectedCategory(null)}
          style={filterStyle(!selectedCategory, 'var(--cyan)')}
        >
          All
        </button>
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            style={filterStyle(selectedCategory === cat, getCategoryColor(cat))}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Q&A by category */}
      {groupedByCategory.map(group => (
        <div key={group.category} style={{ marginBottom: 36 }}>
          {/* Category heading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 3, height: 18, background: group.color, borderRadius: 2 }} />
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.95em',
              fontWeight: 800,
              color: group.color,
              letterSpacing: '0.05em',
            }}>
              {group.category.toUpperCase()}
            </h2>
            <span style={{
              fontSize: '0.72em',
              color: 'var(--text-dim)',
              background: 'var(--bg-card)',
              border: '1px solid rgba(6,182,212,0.12)',
              borderRadius: 10,
              padding: '2px 8px',
            }}>
              {group.items.length} {group.items.length === 1 ? 'question' : 'questions'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {group.items.map((item, qi) => {
              const key = `${group.category}-${qi}`;
              const isOpen = !!openItems[key];
              const color = group.color;
              return (
                <div key={qi} style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${isOpen ? `${color}30` : 'rgba(6,182,212,0.1)'}`,
                  borderRadius: 10,
                  overflow: 'hidden',
                  transition: 'border-color 0.15s',
                }}>
                  {/* Question header */}
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
                    <span style={{ flex: 1 }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.9em',
                        fontWeight: 700,
                        color: isOpen ? 'var(--text)' : 'var(--text-muted)',
                        lineHeight: 1.5,
                        display: 'block',
                      }}>
                        {item.question}
                      </span>
                      {item.difficulty && (
                        <span style={{
                          display: 'inline-block',
                          marginTop: 4,
                          fontSize: '0.68em',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          color: DIFFICULTY_COLOR[item.difficulty] || 'var(--text-dim)',
                          background: `${DIFFICULTY_COLOR[item.difficulty] || '#888'}15`,
                          border: `1px solid ${DIFFICULTY_COLOR[item.difficulty] || '#888'}30`,
                          borderRadius: 6,
                          padding: '1px 7px',
                        }}>
                          {item.difficulty.toUpperCase()}
                        </span>
                      )}
                    </span>
                  </button>

                  {/* Answer body */}
                  {isOpen && (
                    <div style={{ padding: '18px 20px 20px 56px' }}>
                      {item.sections ? (
                        // New format: render sections
                        item.sections.map((sec, si) => (
                          <div key={si} style={{ marginBottom: si < item.sections.length - 1 ? 20 : 0 }}>
                            {sec.title && (
                              <div style={{
                                fontSize: '0.72em',
                                color: color,
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                marginBottom: 8,
                                textTransform: 'uppercase',
                              }}>
                                {sec.title}
                              </div>
                            )}
                            <div style={{ fontSize: '0.86em' }}>
                              <MarkdownContent text={sec.content} />
                            </div>
                            {si < item.sections.length - 1 && (
                              <div style={{ marginTop: 16, borderTop: `1px solid ${color}15` }} />
                            )}
                          </div>
                        ))
                      ) : (
                        // Old format: plain answer
                        <>
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
                            <MarkdownContent text={item.answer} />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function filterStyle(isActive, color) {
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
