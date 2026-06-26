import { useState } from 'react';
import { topics } from '../data/topics';
import MarkdownContent from './MarkdownContent';
import { TOPIC_DIAGRAMS } from './Diagrams';

const styles = {
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 16px 40px',
  },
  pageHeader: {
    padding: '32px 0 24px',
    borderBottom: '1px solid rgba(6,182,212,0.15)',
    marginBottom: 24,
  },
  pageTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
    fontWeight: 800,
    color: 'var(--text)',
    marginBottom: 6,
  },
  pageSubtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.85em',
  },
  topicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 12,
    marginBottom: 32,
  },
  topicPill: (color, isSelected) => ({
    padding: '12px 16px',
    background: isSelected ? `${color}18` : 'var(--bg-card)',
    border: `1px solid ${isSelected ? color : 'rgba(6,182,212,0.12)'}`,
    borderRadius: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    transition: 'all 0.15s',
  }),
  topicPillIcon: {
    fontSize: '1.3em',
    flexShrink: 0,
  },
  topicPillText: {
    textAlign: 'left',
  },
  topicPillTitle: (color, isSelected) => ({
    fontFamily: 'var(--font-display)',
    fontSize: '0.88em',
    fontWeight: 700,
    color: isSelected ? color : 'var(--text)',
    lineHeight: 1.2,
    marginBottom: 2,
  }),
  topicPillSub: {
    fontSize: '0.78em',
    fontFamily: 'var(--font-body)',
    color: 'var(--text-dim)',
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  topicDetail: {
    background: 'var(--bg-card)',
    border: '1px solid rgba(6,182,212,0.15)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  topicDetailHeader: (color) => ({
    padding: '20px 24px',
    borderBottom: `1px solid ${color}30`,
    background: `${color}08`,
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  }),
  topicDetailIcon: {
    fontSize: '2em',
  },
  topicDetailTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
    fontWeight: 800,
    color: 'var(--text)',
    marginBottom: 4,
  },
  topicDetailSub: {
    color: 'var(--text-muted)',
    fontSize: '0.88em',
    fontFamily: 'var(--font-body)',
  },
  sections: {
    padding: '0 24px 24px',
  },
  sectionItem: {
    borderBottom: '1px solid rgba(6,182,212,0.08)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    cursor: 'pointer',
    userSelect: 'none',
  },
  sectionTitle: (isOpen) => ({
    fontFamily: 'var(--font-display)',
    fontSize: '0.95em',
    fontWeight: 700,
    color: isOpen ? 'var(--cyan)' : 'var(--text)',
    transition: 'color 0.15s',
  }),
  sectionChevron: (isOpen) => ({
    color: 'var(--text-dim)',
    fontSize: '1em',
    transition: 'transform 0.2s',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
    flexShrink: 0,
  }),
  sectionBody: {
    paddingBottom: 16,
    fontSize: '0.93em',
    fontFamily: 'var(--font-body)',
  },
};

export default function StudyTopics() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [openSections, setOpenSections] = useState({ 0: true });

  const toggleSection = (idx) => {
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const selectTopic = (t) => {
    setSelectedTopic(t);
    setOpenSections({ 0: true });
  };

  const allOpen = selectedTopic
    ? selectedTopic.sections.every((_, idx) => !!openSections[idx])
    : false;

  const toggleAll = () => {
    if (!selectedTopic) return;
    if (allOpen) {
      setOpenSections({});
    } else {
      const all = {};
      selectedTopic.sections.forEach((_, idx) => { all[idx] = true; });
      setOpenSections(all);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <div style={styles.pageTitle}>Study Topics</div>
        <div style={styles.pageSubtitle}>
          Click a topic to explore. Each section is expandable.
        </div>
      </div>

      <div style={styles.topicGrid}>
        {topics.map(t => {
          const isSelected = selectedTopic?.id === t.id;
          return (
            <button
              key={t.id}
              onClick={() => selectTopic(t)}
              style={styles.topicPill(t.color, isSelected)}
            >
              <span style={styles.topicPillIcon}>{t.icon}</span>
              <div style={styles.topicPillText}>
                <div style={styles.topicPillTitle(t.color, isSelected)}>{t.title}</div>
                <div style={styles.topicPillSub}>{t.summary}</div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedTopic && (
        <div style={styles.topicDetail}>
          <div style={styles.topicDetailHeader(selectedTopic.color)}>
            <span style={styles.topicDetailIcon}>{selectedTopic.icon}</span>
            <div>
              <div style={styles.topicDetailTitle}>{selectedTopic.title}</div>
              <div style={styles.topicDetailSub}>{selectedTopic.summary}</div>
            </div>
          </div>

          {/* Architecture Diagram */}
          {TOPIC_DIAGRAMS[selectedTopic.id] && (() => {
            const Diagram = TOPIC_DIAGRAMS[selectedTopic.id];
            return (
              <div style={{
                borderBottom: `1px solid ${selectedTopic.color}20`,
                background: `${selectedTopic.color}04`,
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}>
                <div style={{
                  fontSize: '0.68em',
                  fontFamily: 'var(--font-mono)',
                  color: selectedTopic.color,
                  letterSpacing: '0.15em',
                  fontWeight: 700,
                  alignSelf: 'flex-start',
                }}>
                  ARCHITECTURE DIAGRAM
                </div>
                <Diagram />
              </div>
            );
          })()}

          <div style={styles.sections}>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingTop: 16,
              paddingBottom: 4,
            }}>
              <button
                onClick={toggleAll}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'transparent',
                  border: `1px solid ${selectedTopic.color}40`,
                  borderRadius: 6,
                  padding: '4px 12px',
                  color: selectedTopic.color,
                  fontSize: '0.75em',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${selectedTopic.color}14`}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '0.9em' }}>{allOpen ? '▴' : '▾'}</span>
                {allOpen ? 'Collapse all' : 'Expand all'}
              </button>
            </div>

            {selectedTopic.sections.map((section, idx) => {
              const isOpen = !!openSections[idx];
              return (
                <div key={idx} style={styles.sectionItem}>
                  <div
                    style={styles.sectionHeader}
                    onClick={() => toggleSection(idx)}
                  >
                    <span style={styles.sectionTitle(isOpen)}>
                      {String(idx + 1).padStart(2, '0')} / {section.title}
                    </span>
                    <span style={styles.sectionChevron(isOpen)}>▾</span>
                  </div>
                  {isOpen && (
                    <div style={styles.sectionBody}>
                      <MarkdownContent text={section.content} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
