import React, { useState, useEffect } from 'react';
import type { Product, StyleIdea } from '../types';
import { useCart } from './CartContext';
import { useUser } from './UserContext';
import { useLanguage } from './LanguageContext';
import { XIcon } from './icons/XIcon';
import { HeartIcon } from './icons/HeartIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { IdeaCard } from './IdeaCard';
import { getOutfitForProduct } from '../services/geminiService';
import { AIFittingRoomModal } from './AIFittingRoomModal';

interface ProductDetailModalProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
  onProductClick: (product: Product) => void;
  onSellerClick: (sellerId: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, allProducts, onClose, onProductClick, onSellerClick }) => {
  const [selectedImage, setSelectedImage] = useState(product.imageUrls[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user, toggleWishlist } = useUser();
  const { t, language } = useLanguage();
  const [isLoadingOutfit, setIsLoadingOutfit] = useState(false);
  const [outfitIdea, setOutfitIdea] = useState<StyleIdea | null>(null);
  const [showFittingRoom, setShowFittingRoom] = useState(false);

  const isLiked = user?.wishlist.includes(product.id) || false;
  
  useEffect(() => {
    setSelectedImage(product.imageUrls[0]);
    setSelectedSize(null);
    setSizeError(null);
  }, [product]);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setSizeError('กรุณาเลือกไซส์');
        return;
    }
    setSizeError(null);
    addToCart(product, selectedSize || undefined);
    onClose(); 
  };
  
  const handleToggleLike = (e: React.MouseEvent) => {
      e.stopPropagation();
      if(user) {
          toggleWishlist(product.id);
      }
  };
  
  const handleSellerClick = () => {
    onClose();
    onSellerClick(product.sellerId);
  };

  const handleGetOutfit = async () => {
    setIsLoadingOutfit(true);
    setOutfitIdea(null);
    try {
      const idea = await getOutfitForProduct(product, allProducts, language);
      setOutfitIdea(idea);
    } catch (error) {
      console.error("Failed to get outfit idea:", error);
      alert("Sorry, we couldn't generate an outfit idea at this time.");
    } finally {
      setIsLoadingOutfit(false);
    }
  };
  
  if (showFittingRoom) {
      return (
          <AIFittingRoomModal 
              product={product} 
              onClose={onClose}
              onGoBackToProduct={() => setShowFittingRoom(false)}
          />
      );
  }

  const hasSale = typeof product.salePrice === 'number';
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-orange-200">
          <h2 className="text-lg font-bold text-[#004D40] truncate">{product.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <XIcon />
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <img src={selectedImage} alt={product.name} className="w-full h-96 object-cover rounded-lg shadow-md mb-4" />
              <div className="flex gap-2">
                {product.imageUrls.map(url => (
                  <img 
                    key={url}
                    src={url} 
                    alt="thumbnail" 
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${selectedImage === url ? 'border-[#FF8C69]' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(url)}
                  />
                ))}
              </div>
            </div>
            
            {/* Product Details */}
            <div>
              <button onClick={handleSellerClick} className="text-left text-sm text-gray-500 hover:underline">{t('seller_label')}: {product.sellerName}</button>
              <h1 className="text-3xl font-bold text-[#004D40] mt-1">{product.name}</h1>
              <div className="mt-4 flex items-baseline gap-3">
                 {hasSale ? (
                    <>
                      <p className="text-3xl font-bold text-red-600">{product.salePrice?.toLocaleString()} {t('thb')}</p>
                      <del className="text-xl text-gray-400">{product.price.toLocaleString()} {t('thb')}</del>
                      <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-600 rounded-full">{t('sale_badge')}</span>
                    </>
                  ) : (
                    <p className="text-3xl font-bold text-[#004D40]">{product.price.toLocaleString()} {t('thb')}</p>
                  )}
              </div>
              <p className="mt-4 text-gray-700 whitespace-pre-wrap">{product.description}</p>
              
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">ขนาด: <span className="font-bold">{selectedSize || ''}</span></h3>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map(size => (
                            <button
                                key={size}
                                onClick={() => {
                                    setSelectedSize(size);
                                    setSizeError(null);
                                }}
                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                    selectedSize === size
                                        ? 'bg-[#004D40] text-white border-[#004D40]'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    {sizeError && <p className="text-red-500 text-sm mt-2">{sizeError}</p>}
                </div>
              )}

              <div className="mt-6 flex items-center gap-4">
                <button onClick={handleAddToCart} className="flex-1 bg-[#FF8C69] text-white font-bold py-3 px-6 rounded-full hover:bg-[#ff7a55] transition">
                  เพิ่มลงตะกร้า
                </button>
                {user && (
                  <button onClick={handleToggleLike} className={`p-3 rounded-full transition-colors ${isLiked ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-red-50'}`}>
                    <HeartIcon filled={isLiked} />
                  </button>
                )}
              </div>

              <div className="mt-8 border-t pt-6">
                  <h3 className="font-semibold text-lg text-[#004D40] flex items-center gap-2 mb-3"><SparklesIcon/> AI Stylist</h3>
                  <p className="text-sm text-gray-600 mb-4">อยากได้ไอเดียแต่งตัวกับชิ้นนี้ไหม? ให้ AI ช่วยแนะนำสิ!</p>
                  <button onClick={handleGetOutfit} disabled={isLoadingOutfit} className="w-full text-sm bg-white border-2 border-teal-700 text-teal-700 font-bold py-2 px-4 rounded-full hover:bg-teal-50 transition disabled:bg-gray-200">
                    {isLoadingOutfit ? 'กำลังคิด...' : 'แนะนำสไตล์การแต่งตัว'}
                  </button>
                   <button onClick={() => setShowFittingRoom(true)} className="w-full mt-2 text-sm bg-teal-700 text-white font-bold py-2 px-4 rounded-full hover:bg-teal-800 transition">
                      ลองใส่ด้วย AI Fitting Room
                  </button>
              </div>

            </div>
          </div>
          {outfitIdea && (
            <div className="mt-12">
              <IdeaCard 
                idea={outfitIdea}
                onProductClick={onProductClick}
                wishlist={user?.wishlist || []}
                onToggleLike={toggleWishlist}
                onSellerClick={onSellerClick}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};