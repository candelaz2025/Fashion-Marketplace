import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';
import { useLanguage } from './LanguageContext';
import { useUser } from './UserContext';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  wishlist: number[];
  onToggleWishlist: (productId: number) => void;
  onSellerClick: (sellerId: number) => void;
}

const getClothingType = (category: string): 'top' | 'bottom' | 'shoes' | 'other' => {
    const tops = ['Jackets', 'Tops', 'Dresses'];
    const bottoms = ['Pants', 'Skirts'];
    const shoes = ['Shoes'];
    if (tops.includes(category)) return 'top';
    if (bottoms.includes(category)) return 'bottom';
    if (shoes.includes(category)) return 'shoes';
    return 'other';
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick, wishlist, onToggleWishlist, onSellerClick }) => {
  const { t } = useLanguage();
  const { user } = useUser();
  
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500">{t('product_grid_not_found')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => {
        let isSizeMatch = false;
        if (user && product.sizes && product.sizes.length > 0) {
          const clothingType = getClothingType(product.category);
          if (clothingType === 'top' && user.shirtSize && user.shirtSize !== '') {
            isSizeMatch = product.sizes.includes(user.shirtSize);
          } else if (clothingType === 'bottom' && user.pantsSize && user.pantsSize !== '') {
            isSizeMatch = product.sizes.includes(user.pantsSize);
          } else if (clothingType === 'shoes' && user.shoeSize && user.shoeSize !== '') {
            isSizeMatch = product.sizes.includes(user.shoeSize);
          }
        }
        
        return (
          <ProductCard 
            key={product.id} 
            product={product} 
            onProductClick={onProductClick}
            isLiked={wishlist.includes(product.id)}
            onToggleLike={onToggleWishlist}
            onSellerClick={onSellerClick}
            isSizeMatch={isSizeMatch}
          />
        );
      })}
    </div>
  );
};