import { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage.jsx';

const SUGGESTIONS = ['💊 Diagnosis info', '🩺 Test results', '🥗 Diet tips'];

export default function ChatMessages({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      {messages.length === 0 && (
        <div style={styles.empty}>
          <h3 style={{ fontSize: 16 }}>How can I help?</h3>
          <div style={styles.suggestionBox}>
            {SUGGESTIONS.map(s => <span key={s} style={styles.chip}>{s}</span>)}
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg.content} sender={msg.role} isLoading={msg.isLoading} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

const styles = {
  container:     { flex: 1, overflowY: 'auto', padding: '16px' },
  empty:         { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20%' },
  suggestionBox: { display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 12 },
  chip:          { padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, fontSize: 12, color: '#64748b' }
};