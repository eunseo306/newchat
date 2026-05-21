import React, { useState } from 'react';
import { sendMessage } from '../api/chat';

// Types for request and response
interface ChatRequest {
  message: string;
}

interface ChatResponse {
  reply: string;
}

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = `User: ${input}`;
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const response: ChatResponse = await sendMessage({ message: input });
      setMessages((prev) => [...prev, `Bot: ${response.reply}`]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, 'Bot: 오류가 발생했습니다.']);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="chatbot-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="chat-window" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', minHeight: '300px', background: '#fafafa' }}>
        {messages.map((msg, idx) => (
          <p key={idx} style={{ margin: '0.5rem 0' }}>{msg}</p>
        ))}
        {loading && <p>… 응답을 생성 중 …</p>}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="주제와 난이도를 입력해주세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem', borderRadius: '4px', background: '#2563eb', color: '#fff', border: 'none' }}>
          전송
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
