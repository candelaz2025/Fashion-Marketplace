import React from 'react';
import type { Product } from '../types';
import { HeartIcon } from './icons/HeartIcon';
import { useUser } from './UserContext';
import { useLanguage } from './LanguageContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  isLiked: boolean;
  onToggleLike: (productId: number) => void;
  onSellerClick: (sellerId: number) => void;
  isSizeMatch?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, isLiked, onToggleLike, onSellerClick, isSizeMatch }) => {
  const { user } = useUser();
  const { t } = useLanguage();

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(product.id);
  };
  
  const handleSellerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSellerClick(product.sellerId);
  };

  const hasSale = typeof product.salePrice === 'number';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-orange-200 flex flex-col">
      <div className="relative">
        <img 
          src={product.imageUrls[0]} 
          alt={product.name} 
          className="w-full h-64 object-cover cursor-pointer"
          onClick={() => onProductClick(product)}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {hasSale && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{t('sale_badge')}</div>
          )}
          {isSizeMatch && (
            <div title="ขนาดตรงกับที่คุณบันทึกไว้" className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              ✓ My Size
            </div>
          )}
        </div>
        
        {user && (
          <button 
            onClick={handleToggleLike}
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:text-red-500 transition-colors"
            aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <HeartIcon filled={isLiked} />
          </button>
        )}
      </div>
      <div className="p-4 cursor-pointer flex-grow flex flex-col" onClick={() => onProductClick(product)} >
        <button onClick={handleSellerClick} className="text-left text-xs text-gray-500 truncate hover:underline">{t('seller_label')}: {product.sellerName}</button>
        <h3 className="font-semibold text-gray-800 truncate group-hover:text-[#FF8C69] transition-colors mt-1">{product.name}</h3>
        <div className="mt-2 flex-grow flex items-end">
          {hasSale ? (
              <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-red-600">{product.salePrice?.toLocaleString()} {t('thb')}</p>
                  <del className="text-sm text-gray-400">{product.price.toLocaleString()} {t('thb')}</del>
              </div>
          ) : (
              <p className="text-lg font-bold text-[#004D40]">{product.price.toLocaleString()} {t('thb')}</p>
          )}
        </div>
      </div>
    </div>
  );
};