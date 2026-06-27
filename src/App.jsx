import { useState } from 'react';
import StudyTopics from './components/StudyTopics';
import Flashcards from './components/Flashcards';
import InterviewQA from './components/InterviewQA';
import './index.css';

const NAV_ITEMS = [
  { id: 'topics', label: 'Study', icon: '📖', desc: 'Topics' },
  { id: 'flashcards', label: 'Quiz', icon: '⚡', desc: 'Flashcards' },
  { id: 'interview', label: 'Interview', icon: '🎯', desc: 'Q&A' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('topics');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Nav */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(5, 10, 18, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(6,182,212,0.12)',
      }}>
        <div style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              border: '1.5px solid var(--cyan)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8em',
            }}>⬡</div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.95em',
                letterSpacing: '0.02em',
                color: 'var(--text)',
                lineHeight: 1,
              }}>
                AGENT<span style={{ color: 'var(--cyan)' }}>PREP</span>
              </div>
              <div style={{ fontSize: '0.6em', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
                INTERVIEW STUDY
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', gap: 4 }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  background: activeTab === item.id ? 'rgba(6,182,212,0.12)' : 'transparent',
                  border: `1px solid ${activeTab === item.id ? 'rgba(6,182,212,0.4)' : 'transparent'}`,
                  color: activeTab === item.id ? 'var(--cyan)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.85em',
                  fontWeight: activeTab === item.id ? 700 : 500,
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Banner — only on study tab */}
      {activeTab === 'topics' && <HeroBanner />}

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'topics' && <StudyTopics />}
        {activeTab === 'flashcards' && <Flashcards />}
        {activeTab === 'interview' && <InterviewQA />}
      </main>

      {/* Resources Panel */}
      <ResourcesPanel />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(6,182,212,0.08)',
        padding: '16px',
        textAlign: 'center',
        fontSize: '0.75em',
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-body)',
      }}>
        Agentic AI Interview Prep · Enterprise Architecture · Multi-Agent · RAG · Fine-tuning · Context Engineering · AI Safety
      </footer>
    </div>
  );
}

const RESOURCES = [
  {
    title: "Building the 7 Layers of a Production-Grade Agentic AI System",
    author: "Fareed Khan",
    url: "https://freedium-mirror.cfd/https://levelup.gitconnected.com/building-the-7-layers-of-a-production-grade-agentic-ai-system-37ee5d941f1c",
    tags: ["LangGraph", "Production", "FastAPI", "Prometheus", "Streaming"],
    desc: "Modular codebase, data persistence, security, service layer, LangGraph agents, API gateway, observability, evals, and stress testing — end to end.",
  },
];

function ResourcesPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderTop: '1px solid rgba(6,182,212,0.1)',
      background: 'rgba(6,182,212,0.02)',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.78em',
            fontWeight: 700,
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--cyan)' }}>📚</span>
            STUDY RESOURCES
            <span style={{
              background: 'rgba(6,182,212,0.15)',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: 10,
              padding: '1px 7px',
              fontSize: '0.85em',
              color: 'var(--cyan)',
            }}>{RESOURCES.length}</span>
          </span>
          <span style={{ fontSize: '0.9em', color: 'var(--cyan)' }}>{open ? '▲' : '▼'}</span>
        </button>

        {open && (
          <div style={{ paddingBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RESOURCES.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  padding: '14px 18px',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(6,182,212,0.15)',
                  borderRadius: 10,
                  textDecoration: 'none',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.15)'}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.9em',
                      color: 'var(--cyan)',
                      marginBottom: 4,
                      lineHeight: 1.4,
                    }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: '0.78em', color: 'var(--text-dim)', marginBottom: 8 }}>
                      by {r.author}
                    </div>
                    <div style={{ fontSize: '0.8em', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {r.desc}
                    </div>
                  </div>
                  <span style={{ fontSize: '1.1em', flexShrink: 0, marginTop: 2 }}>↗</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                  {r.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '2px 8px',
                      background: 'rgba(6,182,212,0.08)',
                      border: '1px solid rgba(6,182,212,0.2)',
                      borderRadius: 6,
                      fontSize: '0.68em',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}>{tag}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HeroBanner() {
  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(6,182,212,0.04) 0%, transparent 100%)',
      borderBottom: '1px solid rgba(6,182,212,0.1)',
      padding: '32px 16px 28px',
      marginBottom: 0,
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{
              fontSize: '0.72em',
              color: 'var(--cyan)',
              letterSpacing: '0.18em',
              fontWeight: 600,
              marginBottom: 8,
            }}>
              INTERVIEW PREPARATION SYSTEM
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 10,
              color: 'var(--text)',
            }}>
              Agentic AI &<br />
              <span style={{ color: 'var(--cyan)' }}>Multi-Agent</span> Systems
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95em', fontFamily: 'var(--font-body)', maxWidth: 440, lineHeight: 1.6 }}>
              Enterprise-level architecture, design tradeoffs, and patterns you need for your interview. 
              Study topics, quiz yourself with flashcards, and review Q&A.
            </p>
          </div>
          <div style={{ display: 'none' }}>{/* topic pills removed */}
          </div>
        </div>
      </div>
    </div>
  );
}
