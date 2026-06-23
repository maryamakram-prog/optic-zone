'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LiveChat() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: 'Hi there! 👋 Welcome to Optic Zone. Are you looking for anything specific today, or just browsing?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User Message
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: userText, time }
    ]);
    setInput('');

    // 2. Show Typing Indicator
    setIsTyping(true);

    // 3. Generate Simulated Reply
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';
      const lower = userText.toLowerCase();

      if (lower.includes('ship') || lower.includes('delivery')) {
        replyText = 'We offer free standard shipping on all orders over $99! Typical delivery takes 3-5 business days. Expedited options are available at checkout.';
      } else if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange')) {
        replyText = 'We offer a 14-day hassle-free return and exchange policy! If you are not satisfied with your frames, you can return them in original condition for a full refund.';
      } else if (lower.includes('try') || lower.includes('virtual') || lower.includes('camera')) {
        replyText = 'You can virtually try on any frame! Go to our "Virtual Try-On" page from the menu, allow camera access or upload a photo, and preview how they fit.';
      } else if (lower.includes('prescription') || lower.includes('lens') || lower.includes('lenses')) {
        replyText = 'Yes! We support single vision, progressive, and reading prescriptions. You can upload your prescription details during checkout or email them to support@opticzone.com.';
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        replyText = 'Hello! How can I help you find the perfect frames today?';
      } else {
        replyText = "Thanks for your inquiry! I'm checking that details for you. Feel free to browse our catalogs, or let me know if you have specific sizing questions.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-white shadow-xl shadow-accent/30 flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-all duration-300 ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
        aria-label="Open Live Chat"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat Panel */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[350px] bg-white rounded-2xl shadow-2xl shadow-black/10 border border-mid-gray/20 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-accent-dark p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative">
              <span className="text-xl">👩‍💼</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-accent-dark rounded-full"></div>
            </div>
            <div>
              <div className="font-semibold text-sm">Sarah — Style Expert</div>
              <div className="text-xs text-white/70">Typically replies in minutes</div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 h-[300px] p-4 bg-light-gray/20 overflow-y-auto flex flex-col gap-4">
          <div className="text-xs text-center text-dark-gray/50 my-1">Live Chat Support</div>
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'agent' && (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-sm">👩‍💼</span>
                </div>
              )}
              <div 
                className={`p-3 rounded-2xl shadow-sm text-sm max-w-[75%] border border-mid-gray/10 ${
                  msg.sender === 'user' 
                    ? 'bg-accent text-white rounded-tr-none' 
                    : 'bg-white text-charcoal rounded-tl-none'
                }`}
              >
                <div>{msg.text}</div>
                <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-dark-gray/50'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <span className="text-sm">👩‍💼</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-charcoal max-w-[85%] border border-mid-gray/10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-dark-gray/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-dark-gray/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-dark-gray/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-mid-gray/20">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..." 
              className="w-full pl-4 pr-12 py-3 bg-light-gray/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-charcoal"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-accent hover:bg-accent/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
