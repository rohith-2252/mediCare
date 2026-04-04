import { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage.jsx';

export default function ChatMessages({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      {messages.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.botIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a2 2 0 012 2v1h3a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h3V4a2 2 0 012-2z" stroke="white" strokeWidth="1.8"/>
              <circle cx="9" cy="12" r="1.5" fill="white"/>
              <circle cx="15" cy="12" r="1.5" fill="white"/>
              <path d="M9 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 style={styles.emptyTitle}>MedBot is ready to help</h3>
          <p style={styles.emptyText}>Ask me anything about your health, conditions, symptoms, or test results.</p>
          <div style={styles.suggestions}>
            {SUGGESTIONS.map(s => (
              <div key={s} style={styles.suggestionChip}>{s}</div>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg.content}
          sender={msg.role}
          isLoading={msg.isLoading}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

const SUGGESTIONS = [
  '💊 What does my diagnosis mean?',
  '🩺 Explain my test results',
  '🥗 What foods should I eat?',
  '😴 Tips to manage my condition',
];

const styles = {
  container:    { flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column' },
  emptyState:   { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' },
  botIcon:      { width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 8px 24px rgba(14,165,233,0.3)' },
  emptyTitle:   { fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 },
  emptyText:    { fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 300, lineHeight: 1.6, marginBottom: 24 },
  suggestions:  { display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 380 },
  suggestionChip: { background: 'white', border: '1px solid var(--border)', borderRadius: 99, padding: '7px 14px', fontSize: 13, color: 'var(--text-muted)', cursor: 'default' },
};
