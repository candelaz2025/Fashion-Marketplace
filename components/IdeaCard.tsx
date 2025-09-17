import React from 'react';
import type { Product, StyleIdea } from '../types';
import { ProductCard } from './ProductCard';

interface IdeaCardProps {
  idea: StyleIdea;
  onProductClick: (product: Product) => void;
  wishlist: number[];
  onToggleLike: (productId: number) => void;
  onSellerClick: (sellerId: number) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onProductClick, wishlist, onToggleLike, onSellerClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-200 p-6">
      <h3 className="text-2xl font-bold text-[#004D40] mb-2">{idea.title}</h3>
      <p className="text-gray-600 mb-6">{idea.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {idea.products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
            isLiked={wishlist.includes(product.id)}
            onToggleLike={onToggleLike}
            onSellerClick={onSellerClick}
          />
        ))}
      </div>
    </div>
  );
};
