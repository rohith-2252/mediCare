import { useState } from 'react';

export function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    if (e.key === 'Escape') setText('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputWrap}>
        <textarea
          style={styles.input}
          placeholder="Ask MedBot about your health…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          disabled={disabled}
        />
        <button
          style={{ ...styles.sendBtn, ...((!text.trim() || disabled) ? styles.sendBtnDisabled : {}) }}
          onClick={send}
          disabled={!text.trim() || disabled}
          title="Send (Enter)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <p style={styles.hint}>Press <kbd style={styles.kbd}>Enter</kbd> to send · <kbd style={styles.kbd}>Shift+Enter</kbd> for new line</p>
    </div>
  );
}

const styles = {
  container: { padding: '12px 20px 16px', borderTop: '1px solid var(--border)', background: 'white' },
  inputWrap: { display: 'flex', gap: 10, alignItems: 'flex-end' },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontFamily: 'var(--font)',
    fontSize: 14,
    color: 'var(--text)',
    background: 'var(--surface2)',
    border: '1.5px solid var(--border)',
    borderRadius: 14,
    outline: 'none',
    resize: 'none',
    maxHeight: 120,
    lineHeight: 1.5,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  sendBtn:        { width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0, boxShadow: '0 4px 12px rgba(14,165,233,0.35)' },
  sendBtnDisabled:{ opacity: 0.4, cursor: 'not-allowed', boxShadow: 'none' },
  hint:           { fontSize: 11, color: 'var(--text-light)', marginTop: 6, textAlign: 'center' },
  kbd:            { background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, padding: '1px 5px', fontSize: 10, fontFamily: 'var(--mono)' },
};
