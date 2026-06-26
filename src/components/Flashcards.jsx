import { useState, useCallback, useEffect } from 'react';
import { flashcards, categories } from '../data/flashcards';

const difficultyColor = {
  easy: '#10b981',
  medium: '#f59e0b',
  hard: '#ef4444',
};

const difficultyLabel = {
  easy: 'EASY',
  medium: 'MED',
  hard: 'HARD',
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deck, setDeck] = useState(() => shuffle(flashcards));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [reviewing, setReviewing] = useState(new Set());
  const [completed, setCompleted] = useState(false);
  const [animating, setAnimating] = useState(false);

  const filteredDeck = selectedCategory === 'All'
    ? deck
    : deck.filter(c => c.category === selectedCategory);

  const card = filteredDeck[currentIndex];
  const total = filteredDeck.length;
  const progress = total > 0 ? ((currentIndex) / total) * 100 : 0;

  const resetDeck = useCallback(() => {
    const base = selectedCategory === 'All' ? flashcards : flashcards.filter(c => c.category === selectedCategory);
    setDeck(shuffle(base));
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnown(new Set());
    setReviewing(new Set());
    setCompleted(false);
  }, [selectedCategory]);

  useEffect(() => {
    resetDeck();
  }, [selectedCategory]);

  const nextCard = useCallback((grade) => {
    if (animating) return;
    setAnimating(true);

    if (grade === 'know') {
      setKnown(prev => new Set(prev).add(card.id));
    } else {
      setReviewing(prev => new Set(prev).add(card.id));
    }

    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex >= filteredDeck.length - 1) {
        setCompleted(true);
      } else {
        setCurrentIndex(i => i + 1);
      }
      setAnimating(false);
    }, 220);
  }, [animating, card, currentIndex, filteredDeck.length]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsFlipped(f => !f);
    } else if (e.key === 'ArrowRight' && isFlipped) {
      nextCard('know');
    } else if (e.key === 'ArrowLeft' && isFlipped) {
      nextCard('review');
    }
  }, [isFlipped, nextCard]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px 40px' }}>
      {/* Header */}
      <div style={{ padding: '32px 0 24px', borderBottom: '1px solid rgba(6,182,212,0.15)', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 6 }}>
          Flashcard Quiz
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>
          Space/Enter to flip · ← Not sure · → Got it
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {['All', ...categories].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 14px',
              background: selectedCategory === cat ? 'var(--cyan)' : 'var(--bg-card)',
              border: `1px solid ${selectedCategory === cat ? 'var(--cyan)' : 'rgba(6,182,212,0.2)'}`,
              borderRadius: 20,
              color: selectedCategory === cat ? '#000' : 'var(--text-muted)',
              fontSize: '0.78em',
              fontFamily: 'var(--font-mono)',
              fontWeight: selectedCategory === cat ? 600 : 400,
              transition: 'all 0.15s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginBottom: 20,
        fontSize: '0.78em',
        color: 'var(--text-dim)',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <span style={{ color: 'var(--text-muted)' }}>{currentIndex + 1} / {total}</span>
        <span style={{ color: difficultyColor.easy }}>✓ {known.size} known</span>
        <span style={{ color: difficultyColor.medium }}>↩ {reviewing.size} reviewing</span>
        <div style={{ flex: 1, minWidth: 120, height: 3, background: 'var(--bg-hover)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--cyan)', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      </div>

      {completed ? (
        <CompletionScreen known={known} reviewing={reviewing} total={total} onReset={resetDeck} />
      ) : card ? (
        <>
          {/* Card */}
          <div
            onClick={() => !animating && setIsFlipped(f => !f)}
            style={{
              position: 'relative',
              cursor: 'pointer',
              perspective: '1200px',
              marginBottom: 20,
              minHeight: 320,
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              minHeight: 320,
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              {/* Front */}
              <CardFace
                isBack={false}
                card={card}
                isFlipped={isFlipped}
              />
              {/* Back */}
              <CardFace
                isBack={true}
                card={card}
                isFlipped={isFlipped}
              />
            </div>
          </div>

          {/* Controls */}
          {isFlipped ? (
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => nextCard('review')}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 8,
                  color: '#ef4444',
                  fontSize: '0.9em',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  transition: 'all 0.15s',
                }}
              >
                ← Still Learning
              </button>
              <button
                onClick={() => nextCard('know')}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 8,
                  color: '#10b981',
                  fontSize: '0.9em',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  transition: 'all 0.15s',
                }}
              >
                Got It →
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsFlipped(true)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(6,182,212,0.08)',
                border: '1px solid rgba(6,182,212,0.3)',
                borderRadius: 8,
                color: 'var(--cyan)',
                fontSize: '0.9em',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
              }}
            >
              Reveal Answer  (Space)
            </button>
          )}
        </>
      ) : null}
    </div>
  );
}

function CardFace({ isBack, card }) {
  const diffColor = difficultyColor[card.difficulty];

  const faceStyle = {
    position: isBack ? 'absolute' : 'relative',
    top: 0,
    left: 0,
    width: '100%',
    minHeight: 320,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: isBack ? 'rotateY(180deg)' : 'rotateY(0)',
    background: 'var(--bg-card)',
    border: `1px solid ${isBack ? 'rgba(16,185,129,0.25)' : 'rgba(6,182,212,0.2)'}`,
    borderRadius: 12,
    padding: '28px 28px',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={faceStyle}>
      {/* Top labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{
          fontSize: '0.7em',
          color: 'var(--text-dim)',
          padding: '3px 8px',
          border: '1px solid rgba(6,182,212,0.15)',
          borderRadius: 4,
          fontWeight: 600,
        }}>
          {card.category.toUpperCase()}
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            fontSize: '0.68em',
            color: diffColor,
            border: `1px solid ${diffColor}50`,
            padding: '2px 8px',
            borderRadius: 4,
            fontWeight: 700,
          }}>
            {difficultyLabel[card.difficulty]}
          </span>
          {isBack && (
            <span style={{ fontSize: '0.75em', color: '#10b981', fontWeight: 600 }}>ANSWER</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {!isBack ? (
          <>
            <div style={{
              fontSize: '0.7em',
              color: 'var(--cyan)',
              letterSpacing: '0.12em',
              marginBottom: 14,
              fontWeight: 600,
            }}>QUESTION</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.5,
            }}>
              {card.question}
            </div>
            <div style={{ marginTop: 20, fontSize: '0.73em', color: 'var(--text-dim)' }}>
              Click or press Space to reveal
            </div>
          </>
        ) : (
          <>
            <div style={{
              fontSize: '0.7em',
              color: '#10b981',
              letterSpacing: '0.12em',
              marginBottom: 14,
              fontWeight: 600,
            }}>ANSWER</div>
            <AnswerContent text={card.answer} />
          </>
        )}
      </div>
    </div>
  );
}

function AnswerContent({ text }) {
  const lines = text.split('\n');
  return (
    <div style={{ fontSize: '0.85em', lineHeight: 1.7 }}>
      {lines.map((line, i) => {
        if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;

        // Numbered point
        const numMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <span style={{ color: 'var(--cyan)', fontWeight: 700, flexShrink: 0, minWidth: 18 }}>{numMatch[1]}.</span>
              <span style={{ color: 'var(--text-muted)' }} dangerouslySetInnerHTML={{ __html: formatInline(numMatch[2]) }} />
            </div>
          );
        }

        // Bullet
        if (line.match(/^[•\-]\s+/)) {
          const content = line.replace(/^[•\-]\s+/, '');
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
              <span style={{ color: 'var(--cyan)', flexShrink: 0 }}>›</span>
              <span style={{ color: 'var(--text-muted)' }} dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
            </div>
          );
        }

        return (
          <p key={i} style={{ color: 'var(--text-muted)', marginBottom: 3 }}
            dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        );
      })}
    </div>
  );
}

function formatInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--cyan);font-weight:600">$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.2);border-radius:3px;padding:1px 5px;font-size:0.9em;color:var(--cyan)">$1</code>');
}

function CompletionScreen({ known, reviewing, total, onReset }) {
  const score = Math.round((known.size / total) * 100);
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid rgba(6,182,212,0.2)',
      borderRadius: 12,
      padding: '40px 32px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '3em', marginBottom: 16 }}>
        {score >= 80 ? '🎯' : score >= 60 ? '📈' : '📚'}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--cyan)', marginBottom: 4 }}>
        {score}%
      </div>
      <div style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9em' }}>
        {known.size} of {total} cards mastered
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 28, fontSize: '0.85em' }}>
        <span style={{ color: '#10b981' }}>✓ {known.size} known</span>
        <span style={{ color: '#f59e0b' }}>↩ {reviewing.size} to review</span>
      </div>
      <button
        onClick={onReset}
        style={{
          padding: '12px 32px',
          background: 'var(--cyan)',
          border: 'none',
          borderRadius: 8,
          color: '#000',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '0.9em',
          cursor: 'pointer',
        }}
      >
        Shuffle & Restart
      </button>
    </div>
  );
}
