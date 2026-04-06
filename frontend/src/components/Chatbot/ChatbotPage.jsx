import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import ChatMessages from './ChatMessages.jsx';
import { ChatInput } from './ChatInput.jsx';
import api from '../../utils/api.js';

export default function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get('/chat/history')
      .then(res => {
        const hist = (res.data.history || []).map(h => ({
          id: crypto.randomUUID(),
          role: h.role,
          content: h.content,
        }));
        setMessages(hist);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const sendMessage = async (text) => {
    const userMsg = { id: crypto.randomUUID(), role: 'user', content: text };
    const loadingMsg = { id: 'loading', role: 'assistant', content: '', isLoading: true };
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setLoading(true);

    try {
      const res = await api.post('/chat/message', { message: text });
      const botMsg = { id: crypto.randomUUID(), role: 'assistant', content: res.data.reply };
      setMessages(prev => [...prev.filter(m => m.id !== 'loading'), botMsg]);
    } catch (err) {
      const errorMsg = { id: crypto.randomUUID(), role: 'assistant', content: 'Error: Please try again.' };
      setMessages(prev => [...prev.filter(m => m.id !== 'loading'), errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Clear chat history?')) return;
    await api.delete('/chat/history').catch(() => {});
    setMessages([]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatHeader}>
        <div style={styles.botInfo}>
          <div style={styles.botAvatar}>🤖</div>
          <div>
            <h2 style={styles.botName}>MedBot</h2>
            <div style={styles.onlineStatus}>
              <div style={styles.onlineDot} /> AI Assistant
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearHistory} style={styles.clearBtn}>🗑</button>
        )}
      </div>

      <div style={styles.disclaimer}>
        ⚠️ MedBot provides info, not medical advice.
      </div>

      <div style={styles.messagesArea}>
        {fetching ? <div style={styles.center}><div className="spinner" /></div> : <ChatMessages messages={messages} />}
      </div>

      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}

const styles = {
  page:         { display: 'flex', flexDirection: 'column', height: '80vh', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', margin: '0 auto', maxWidth: '100%' },
  chatHeader:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #eee' },
  botInfo:      { display: 'flex', alignItems: 'center', gap: 10 },
  botAvatar:    { width: 36, height: 36, borderRadius: '50%', background: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
  botName:      { fontSize: 15, fontWeight: 700, margin: 0 },
  onlineStatus: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b' },
  onlineDot:    { width: 6, height: 6, borderRadius: '50%', background: '#10b981' },
  clearBtn:     { background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 },
  disclaimer:   { background: '#f0f9ff', padding: '6px 16px', fontSize: 11, color: '#0369a1', textAlign: 'center' },
  messagesArea: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  center:       { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }
};