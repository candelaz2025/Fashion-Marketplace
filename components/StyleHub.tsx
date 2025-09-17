import React, { useState, useRef, useEffect } from 'react';
import type { Product, Message } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { SendIcon } from './icons/SendIcon';
import { getAIStyleChatResponse } from '../services/geminiService';
import type { Content } from '@google/genai';
import { useLanguage } from './LanguageContext';

interface StyleHubProps {
  allProducts: Product[];
  onProductClick: (product: Product) => void;
}

export const StyleHub: React.FC<StyleHubProps> = ({ allProducts, onProductClick }) => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Set initial welcome message based on language
  useEffect(() => {
    setMessages([
        { id: '1', text: t('style_hub_welcome'), sender: 'ai' }
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
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
        const response = await getAIStyleChatResponse(chatHistory, input, allProducts, language);
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
            text: t('error_generic'),
            sender: 'ai',
        };
        setMessages(prev => [...prev.filter(m => !m.isTyping), errorMessage]);
        console.error("Style Hub Chat error:", error);
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
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <div className="w-full max-w-3xl h-[80vh] bg-white rounded-2xl shadow-2xl border border-orange-200 flex flex-col">
        <header className="p-4 bg-orange-50 border-b border-orange-200 flex items-center gap-3">
            <div className="text-[#FF8C69]"><SparklesIcon /></div>
            <h1 className="font-bold text-lg text-[#004D40]">{t('style_hub_title')}</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${message.sender === 'user' ? 'bg-[#FF8C69] text-white rounded-br-none' : 'bg-orange-100 text-[#004D40] rounded-bl-none'}`}>
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
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {message.products.map(p => {
                        const hasSale = typeof p.salePrice === 'number';
                        return (
                          <div key={p.id} className="cursor-pointer group bg-white p-1 rounded-lg border border-orange-200" onClick={() => onProductClick(p)}>
                              <img src={p.imageUrls[0]} alt={p.name} className="rounded-md w-full h-24 object-cover" />
                              <p className="text-xs truncate mt-1 text-gray-800 group-hover:underline">{p.name}</p>
                              {hasSale ? (
                                <div className="flex items-baseline gap-1">
                                    <p className="text-xs font-semibold text-red-500">{p.salePrice?.toLocaleString()} {t('thb')}</p>
                                    <del className="text-[10px] text-gray-400">{p.price.toLocaleString()} {t('thb')}</del>
                                </div>
                              ) : (
                                <p className="text-xs font-semibold text-[#FF8C69]">{p.price.toLocaleString()} {t('thb')}</p>
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

        <footer className="p-4 border-t border-orange-200">
            <div className="flex items-center gap-2">
            <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('style_hub_placeholder')}
                className="flex-grow px-4 py-2 bg-[#374151] text-white placeholder-gray-400 border border-[#FF8C69] rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF8C69] resize-none max-h-28 overflow-y-auto"
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-[#FF8C69] rounded-full p-3 text-white disabled:bg-[#ffac94] self-end">
                <SendIcon />
            </button>
            </div>
        </footer>
      </div>
    </div>
  );
};
