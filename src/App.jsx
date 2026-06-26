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

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(6,182,212,0.08)',
        padding: '16px',
        textAlign: 'center',
        fontSize: '0.75em',
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-body)',
      }}>
        Agentic AI Interview Prep · Enterprise Architecture · Multi-Agent · ReAct · MCP · Evals
      </footer>
    </div>
  );
}

function HeroBanner() {
  const topics = [
    { label: 'Enterprise Architecture', color: '#06b6d4' },
    { label: 'Multi-Agent Systems', color: '#a78bfa' },
    { label: 'ReAct Pattern', color: '#f59e0b' },
    { label: 'Harness Engineering', color: '#10b981' },
    { label: 'Evals', color: '#ef4444' },
    { label: 'Loop Engineering', color: '#f97316' },
    { label: 'MCP', color: '#8b5cf6' },
    { label: 'Agent Skills', color: '#ec4899' },
    { label: 'A2A Protocol', color: '#22d3ee' },
    { label: 'Memory & State', color: '#34d399' },
    { label: 'Observability', color: '#0ea5e9' },
    { label: 'RAG', color: '#fb7185' },
    { label: 'Guardrails', color: '#f43f5e' },
    { label: 'Deep Agents', color: '#7c3aed' },
    { label: 'LLM Caching', color: '#f59e0b' },
    { label: 'Transformers & LLMs', color: '#8b5cf6' },
    { label: 'Hybrid Search & Reranking', color: '#0ea5e9' },
  ];

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
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            maxWidth: 320,
            alignContent: 'flex-start',
          }}>
            {topics.map(t => (
              <span key={t.label} style={{
                padding: '4px 10px',
                background: `${t.color}12`,
                border: `1px solid ${t.color}30`,
                borderRadius: 20,
                fontSize: '0.7em',
                color: t.color,
                fontWeight: 600,
              }}>{t.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
