export function ChatMessage({ message, sender, isLoading }) {
  const isUser = sender === 'user';

  return (
    <div style={{ ...styles.wrapper, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
        <div style={styles.botAvatar}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2a2 2 0 012 2v1h3a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h3V4a2 2 0 012-2z" stroke="white" strokeWidth="1.8"/>
            <circle cx="9" cy="12" r="1.5" fill="white"/>
            <circle cx="15" cy="12" r="1.5" fill="white"/>
            <path d="M9 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      <div style={{
        ...styles.bubble,
        ...(isUser ? styles.userBubble : styles.botBubble),
      }}>
        {isLoading ? (
          <div style={styles.loadingDots}>
            <span style={{ ...styles.dot, animationDelay: '0ms' }} />
            <span style={{ ...styles.dot, animationDelay: '160ms' }} />
            <span style={{ ...styles.dot, animationDelay: '320ms' }} />
          </div>
        ) : (
          <p style={styles.text}>{message}</p>
        )}
      </div>

      {isUser && (
        <div style={styles.userAvatar}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper:    { display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 16, animation: 'fadeUp 0.3s ease both' },
  botAvatar:  { width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  userAvatar: { width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble:     { maxWidth: '72%', padding: '12px 16px', borderRadius: 18, fontSize: 14, lineHeight: 1.6, wordBreak: 'break-word' },
  botBubble:  { background: 'white', border: '1px solid var(--border)', color: 'var(--text)', borderBottomLeftRadius: 4 },
  userBubble: { background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', color: 'white', borderBottomRightRadius: 4 },
  text:       { margin: 0, whiteSpace: 'pre-wrap' },
  loadingDots:{ display: 'flex', gap: 4, padding: '4px 0', alignItems: 'center' },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#94a3b8',
    display: 'inline-block',
    animation: 'bounce 1.2s ease infinite',
  },
};

// Inject dot bounce animation
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
  }
`;
if (!document.head.querySelector('[data-chat-style]')) {
  styleTag.setAttribute('data-chat-style', '1');
  document.head.appendChild(styleTag);
}
