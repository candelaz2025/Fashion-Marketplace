import React from 'react';
import type { Product, StyleIdea } from '../types';
import { ProductCard } from './ProductCard';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface StyleIdeaModalProps {
  idea: StyleIdea;
  onClose: () => void;
  onProductClick: (product: Product) => void;
  wishlist: number[];
  onToggleWishlist: (productId: number) => void;
  onSellerClick: (sellerId: number) => void;
}

export const StyleIdeaModal: React.FC<StyleIdeaModalProps> = ({ idea, onClose, onProductClick, wishlist, onToggleWishlist, onSellerClick }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-orange-200">
          <h2 className="text-xl font-bold text-[#004D40] flex items-center gap-2">
            <SparklesIcon /> AI Style Suggestion
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <XIcon />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-extrabold text-[#004D40]">{idea.title}</h3>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">{idea.description}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {idea.products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
                isLiked={wishlist.includes(product.id)}
                onToggleLike={onToggleWishlist}
                onSellerClick={onSellerClick}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
