import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons/SendIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { getAIChatResponse } from '../services/geminiService';
import type { Product, Message } from '../types';
import type { Content } from '@google/genai';
import { useLanguage } from './LanguageContext';

interface ChatInterfaceProps {
  allProducts: Product[];
  onProductClick: (product: Product) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ allProducts, onProductClick }) => {
  const [messages, setMessages] = useState<Message[]>([
      { id: '1', text: "สวัสดีค่ะ! ฉันคือผู้ช่วย AI ของคุณ มีอะไรให้ช่วยไหมคะ? ลองถามเกี่ยวกับสไตล์เสื้อผ้า หรือสินค้าที่อยากได้ดูสิคะ", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { language, t } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(scrollToBottom, [messages]);
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage, { id: 'typing', text: '', sender: 'ai', isTyping: true }]);
    setInput('');
    setIsLoading(true);

    const chatHistory: Content[] = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
    }));

    try {
        const response = await getAIChatResponse(chatHistory, input, allProducts, language);
        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: response.text,
            sender: 'ai',
            products: response.products
        };
        setMessages(prev => [...prev.filter(m => !m.isTyping), aiMessage]);
    } catch (error) {
        const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "ขออภัยค่ะ เกิดข้อผิดพลาดบางอย่าง โปรดลองอีกครั้งในภายหลัง",
            sender: 'ai',
        };
        setMessages(prev => [...prev.filter(m => !m.isTyping), errorMessage]);
        console.error("Chat error:", error);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <header className="p-4 bg-orange-50 border-b border-orange-200 flex items-center gap-3">
        <div className="text-[#FF8C69]"><SparklesIcon /></div>
        <h2 className="font-bold text-lg text-[#004D40]">AI Shopping Assistant</h2>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.sender === 'user' ? 'bg-[#FF8C69] text-white rounded-br-none' : 'bg-orange-100 text-[#004D40] rounded-bl-none'}`}>
              {message.isTyping ? (
                 <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-pulse"></span>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.text}</p>
              )}
               {message.products && message.products.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {message.products.map(p => {
                    const hasSale = typeof p.salePrice === 'number';
                    return (
                        <div key={p.id} className="cursor-pointer group" onClick={() => onProductClick(p)}>
                          <img src={p.imageUrls[0]} alt={p.name} className="rounded-lg w-full h-20 object-cover" />
                          <p className="text-xs truncate mt-1 text-black group-hover:underline">{p.name}</p>
                           {hasSale ? (
                              <div className="flex items-baseline gap-1">
                                  <p className="text-xs font-semibold text-red-500">{p.salePrice?.toLocaleString()} {t('thb')}</p>
                                  <del className="text-[10px] text-gray-400">{p.price.toLocaleString()} {t('thb')}</del>
                              </div>
                            ) : (
                              <p className="text-xs font-semibold text-gray-800">{p.price.toLocaleString()} {t('thb')}</p>
                            )}
                        </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
         <div ref={messagesEndRef} />
      </main>
      <footer className="p-3 border-t border-orange-200 bg-white">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="พิมพ์ข้อความของคุณ..."
            className="flex-grow px-4 py-3 bg-[#374151] text-white placeholder-gray-400 border border-[#FF8C69] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF8C69] resize-none max-h-32 overflow-y-auto"
          />
          <button onClick={handleSend} disabled={isLoading} className="bg-[#FF8C69] rounded-full p-3 text-white disabled:bg-[#ffac94] shrink-0">
            <SendIcon />
          </button>
        </div>
      </footer>
    </div>
  );
};
