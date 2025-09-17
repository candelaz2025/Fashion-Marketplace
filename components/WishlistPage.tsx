import React from 'react';
import { useUser } from './UserContext';
import { useLanguage } from './LanguageContext';
import type { Product } from '../types';
import { ProductGrid } from './ProductGrid';
import { HeartIcon } from './icons/HeartIcon';

interface WishlistPageProps {
    allProducts: Product[];
    onProductClick: (product: Product) => void;
    onSellerClick: (sellerId: number) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ allProducts, onProductClick, onSellerClick }) => {
    const { user, toggleWishlist } = useUser();
    const { t } = useLanguage();

    const wishlistProducts = allProducts.filter(p => user?.wishlist?.includes(p.id));

    if (!user) {
         return <div className="text-center p-8">{t('error_generic')}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                 <div className="inline-flex justify-center text-red-500 mb-4 bg-red-100 p-3 rounded-full">
                    <HeartIcon filled />
                </div>
                <h1 className="text-4xl font-extrabold text-[#004D40] tracking-tight">{t('wishlist_page_title')}</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    {t('wishlist_page_subtitle')}
                </p>
            </div>
            
            {wishlistProducts.length > 0 ? (
                <ProductGrid 
                    products={wishlistProducts} 
                    onProductClick={onProductClick}
                    wishlist={user.wishlist || []}
                    onToggleWishlist={toggleWishlist}
                    onSellerClick={onSellerClick}
                />
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                    <div className="text-gray-300 w-24 h-24 mx-auto mb-4">
                         <HeartIcon />
                    </div>
                    <p className="text-xl text-gray-600 font-semibold">{t('wishlist_empty_title')}</p>
                    <p className="text-gray-400 mt-2">{t('wishlist_empty_subtitle')}</p>
                </div>
            )}
        </div>
    );
};
