export function ChatMessage({ message, sender, isLoading }) {
  const isUser = sender === 'user';

  return (
    <div style={{ ...styles.wrapper, flexDirection: isUser ? 'row-reverse' : 'row' }}>
      <div style={{ ...styles.avatar, background: isUser ? '#7c3aed' : '#0ea5e9' }}>
        {isUser ? '👤' : '🤖'}
      </div>

      <div style={{ ...styles.bubble, ...(isUser ? styles.userBubble : styles.botBubble) }}>
        {isLoading ? "..." : <p style={styles.text}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', gap: 8, marginBottom: 12, alignItems: 'flex-end', padding: '0 4px' },
  avatar:  { width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white', flexShrink: 0 },
  bubble:  { maxWidth: '85%', padding: '10px 14px', borderRadius: 16, fontSize: 14, lineHeight: 1.5 },
  botBubble:  { background: '#f1f5f9', color: '#1e293b', borderBottomLeftRadius: 2 },
  userBubble: { background: '#0ea5e9', color: 'white', borderBottomRightRadius: 2 },
  text: { margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }
};