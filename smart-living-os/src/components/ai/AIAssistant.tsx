import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../ui/index';
import { Button } from '../ui/index';
import { chatWithAssistant } from '../../services/ai';
import { useAuth } from '../../context/AuthContext';
import type { AIMessage } from '../../types';

export function AIAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your JK Smart Living assistant. I can help you control your smart home, find building amenities, manage visitors, and more. What can I do for you?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, open, minimized]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: AIMessage = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await chatWithAssistant(
        [...messages, userMsg],
        user?.name || 'Resident',
        user?.unit || 'N/A'
      );
      setMessages(prev => [...prev, {
        id: `m-${Date.now()}-r`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: `m-err`,
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please try again in a moment.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Where is the gym?',
    'Show me my energy usage',
    'How do I create a scene?',
    'Where can I park?',
  ];

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-transform hover:scale-105"
            aria-label="Open AI Assistant"
          >
            <Bot size={22} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              'fixed bottom-6 right-6 z-50 w-80 rounded-2xl shadow-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border flex flex-col overflow-hidden',
              minimized ? 'h-14' : 'h-[480px]'
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 shrink-0">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">JK AI Assistant</p>
                <p className="text-xs text-white/70">Smart Living · John Keells</p>
              </div>
              <button onClick={() => setMinimized(m => !m)} className="text-white/80 hover:text-white">
                {minimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
              </button>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                <X size={15} />
              </button>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                    >
                      {msg.role === 'assistant' && (
                        <div className="h-7 w-7 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                          <Bot size={14} className="text-primary-600 dark:text-primary-400" />
                        </div>
                      )}
                      <div className={cn(
                        'max-w-[75%] rounded-2xl px-3 py-2 text-sm',
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white rounded-tr-sm'
                          : 'bg-gray-100 dark:bg-dark-border text-gray-800 dark:text-gray-200 rounded-tl-sm'
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="h-7 w-7 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-2 shrink-0">
                        <Bot size={14} className="text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="bg-gray-100 dark:bg-dark-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Suggestions */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                    {suggestions.map(s => (
                      <button
                        key={s}
                        onClick={() => { setInput(s); }}
                        className="text-xs px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 hover:bg-primary-100 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="flex items-center gap-2 p-3 border-t border-gray-100 dark:border-dark-border">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder="Ask me anything..."
                    className="flex-1 text-sm bg-gray-100 dark:bg-dark-border rounded-xl px-3 py-2 outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                  />
                  <Button
                    size="sm"
                    onClick={send}
                    disabled={!input.trim() || loading}
                    className="h-8 w-8 p-0 rounded-xl"
                  >
                    <Send size={14} />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
