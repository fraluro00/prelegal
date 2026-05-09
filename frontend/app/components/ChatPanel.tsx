'use client';

import { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  fields: Record<string, unknown>;
  onFieldsChange: (fields: Record<string, unknown>) => void;
  documentType: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ChatPanel({ fields, onFieldsChange, documentType }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldsRef = useRef(fields);
  const prevLoadingRef = useRef(false);
  fieldsRef.current = fields;

  async function sendToAI(msgs: Message[]) {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: msgs,
          fields: fieldsRef.current,
          document_type: documentType,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const updated = { ...fieldsRef.current };
      for (const key of Object.keys(data.fields)) {
        const val = data.fields[key];
        if (val !== null && val !== undefined) {
          updated[key] = val;
        }
      }
      onFieldsChange(updated);

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please check that the backend is running and try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    sendToAI([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevLoadingRef.current && !loading) {
      inputRef.current?.focus();
    }
    prevLoadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    await sendToAI(next);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-gray-400">
              <span className="inline-flex gap-1">
                <span className="animate-bounce [animation-delay:0ms]">.</span>
                <span className="animate-bounce [animation-delay:150ms]">.</span>
                <span className="animate-bounce [animation-delay:300ms]">.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-200 p-3 flex gap-2">
        <input
          ref={inputRef}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-40 transition-colors"
          style={{ backgroundColor: '#753991' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
