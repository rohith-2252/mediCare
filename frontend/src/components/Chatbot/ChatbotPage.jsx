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

  // Load history on mount
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
      const errorMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: err.message || 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev.filter(m => m.id !== 'loading'), errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Clear all chat history?')) return;
    await api.delete('/chat/history').catch(() => {});
    setMessages([]);
  };

  return (
    <div style={styles.page}>
      {/* Chat header */}
      <div style={styles.chatHeader}>
        <div style={styles.botInfo}>
          <div style={styles.botAvatar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a2 2 0 012 2v1h3a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h3V4a2 2 0 012-2z" stroke="white" strokeWidth="1.8"/>
              <circle cx="9" cy="12" r="1.5" fill="white"/>
              <circle cx="15" cy="12" r="1.5" fill="white"/>
              <path d="M9 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h2 style={styles.botName}>MedBot</h2>
            <div style={styles.onlineStatus}>
              <div style={styles.onlineDot} /> AI Health Assistant · Powered by Gemini
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {messages.length > 0 && (
            <button className="btn btn-outline" onClick={clearHistory} style={{ fontSize: 12, padding: '6px 14px' }}>
              🗑 Clear
            </button>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#0369a1" strokeWidth="2"/>
          <path d="M12 8v4M12 16h.01" stroke="#0369a1" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        MedBot provides general health information. Always consult your doctor for medical decisions.
      </div>

      {/* Messages */}
      {fetching ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner spinner-dark" style={{ width: 28, height: 28 }} />
        </div>
      ) : (
        <ChatMessages messages={messages} />
      )}

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}

const styles = {
  page:        { display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--header-h) - 56px)', background: 'white', borderRadius: 18, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' },
  chatHeader:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'white' },
  botInfo:     { display: 'flex', alignItems: 'center', gap: 12 },
  botAvatar:   { width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' },
  botName:     { fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 2 },
  onlineStatus:{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' },
  onlineDot:   { width: 7, height: 7, borderRadius: '50%', background: '#10b981', animation: 'pulse-ring 2s ease infinite' },
  disclaimer:  { display: 'flex', alignItems: 'center', gap: 6, background: '#eff6ff', padding: '8px 20px', fontSize: 12, color: '#0369a1', borderBottom: '1px solid #bfdbfe' },
};
