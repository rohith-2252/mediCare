import { useState } from 'react';

export function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputWrap}>
        <textarea
          style={styles.input}
          placeholder="Ask something..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
          rows={1}
          disabled={disabled}
        />
        <button 
          style={{ ...styles.sendBtn, opacity: (!text.trim() || disabled) ? 0.5 : 1 }} 
          onClick={send} 
          disabled={!text.trim() || disabled}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '12px', borderTop: '1px solid #eee', background: 'white' },
  inputWrap: { display: 'flex', gap: 8, alignItems: 'center' },
  input: { flex: 1, padding: '10px 14px', fontSize: 14, border: '1px solid #ddd', borderRadius: 20, outline: 'none', resize: 'none', maxHeight: 80 },
  sendBtn: { width: 40, height: 40, borderRadius: '50%', background: '#0ea5e9', color: 'white', border: 'none', cursor: 'pointer', fontSize: 16 }
};