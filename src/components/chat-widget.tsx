'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatCircle, X, PaperPlaneRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; parts: { text: string }[] }[]>([
    { role: 'model', parts: [{ text: "Hi there! I'm an AI assistant trained on Hafizh's portfolio. What would you like to know about his experience or projects?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const sendMessage = async (retryCount = 0) => {
    if (!input.trim() && retryCount === 0) return;
    const currentInput = input;
    
    if (retryCount === 0) {
      setMessages(p => [...p, { role: 'user', parts: [{ text: currentInput }] }]);
      setInput('');
    }
    
    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = { 
        messages: [...messages, { role: 'user', parts: [{ text: currentInput }] }] 
      };
      
      if (sessionToken) {
        payload.sessionToken = sessionToken;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401 && data.code === 'SESSION_EXPIRED' && retryCount === 0) {
        setSessionToken(undefined);
        setMessages(p => [...p, { role: 'model', parts: [{ text: 'Session expired. Retrying...' }] }]);
        setTimeout(() => sendMessage(1), 3000); 
        return;
      }

      if (!res.ok) {
        setMessages(p => [...p, { role: 'model', parts: [{ text: data.error || 'An error occurred. Please try again.' }] }]);
        return;
      }

      if (data.sessionToken) setSessionToken(data.sessionToken);
      setMessages(p => [...p, { role: 'model', parts: [{ text: data.message }] }]);

    } catch {
      setMessages(p => [...p, { role: 'model', parts: [{ text: 'Network error. Please try again.' }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="chat-toggle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button 
              className="rounded-full w-14 h-14 shadow-lg" 
              onClick={() => setIsOpen(true)}
              aria-label="Open portfolio AI assistant"
            >
              <ChatCircle weight="fill" size={24} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-heading"
            initial={{ opacity: 0, y: 20, scale: 0.9, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-4 right-4 w-[350px] max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100dvh-32px)] flex flex-col shadow-xl border border-border rounded-xl z-50 bg-background overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b bg-muted/30">
              <h2 id="chat-heading" className="text-sm font-semibold text-foreground">Chat with AI</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close chat assistant">
                <X weight="bold" size={20} />
              </Button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4" ref={scrollRef} aria-live="polite">
              <AnimatePresence mode="popLayout">
                {messages.map((m, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10, scale: 0.95, originX: m.role === 'user' ? 1 : 0 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm ${
                      m.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-sm shadow-sm' 
                        : 'bg-muted border border-border rounded-bl-sm shadow-sm'
                    }`}>
                      {m.parts[0].text}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted border border-border rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm shadow-sm flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="size-1.5 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="size-1.5 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t bg-background">
              <form 
                className="flex gap-2 relative" 
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              >
                <Input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder="Type a message..." 
                  disabled={isLoading}
                  className="pr-10 rounded-full bg-muted/50 border-border"
                  aria-label="Message input"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-1 top-1 bottom-1 h-auto w-8 rounded-full"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                >
                  <PaperPlaneRight weight="fill" size={14} />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

