import React, { useState } from 'react';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { XIcon } from './icons/XIcon';
import { ChatInterface } from './ChatInterface';
import type { Product } from '../types';

interface FloatingAIChatProps {
    allProducts: Product[];
    onProductClick: (product: Product) => void;
}

export const FloatingAIChat: React.FC<FloatingAIChatProps> = ({ allProducts, onProductClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-[#FF8C69] text-white rounded-full p-4 shadow-lg hover:bg-[#ff7a55] transition-transform hover:scale-110"
                    aria-label={isOpen ? 'Close AI Chat' : 'Open AI Chat'}
                >
                    {isOpen ? <XIcon /> : <ChatBubbleIcon />}
                </button>
            </div>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-orange-200 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
               {isOpen && <ChatInterface allProducts={allProducts} onProductClick={(p) => {
                    onProductClick(p);
                    setIsOpen(false);
               }} />}
            </div>
        </>
    );
};
