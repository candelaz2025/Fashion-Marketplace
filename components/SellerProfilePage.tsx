import React, { useState } from 'react';
import type { Seller, Product, Review } from '../types';
import { ProductGrid } from './ProductGrid';
import { StarRating } from './StarRating';
import { useUser } from './UserContext';
import { useLanguage } from './LanguageContext';

interface SellerProfilePageProps {
  seller: Seller;
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddReview: (sellerId: number, review: Omit<Review, 'id'>) => void;
  onNavigateToSeller: (sellerId: number) => void; // Add this for consistency if needed
}

export const SellerProfilePage: React.FC<SellerProfilePageProps> = ({ seller, products, onProductClick, onAddReview, onNavigateToSeller }) => {
  const { user, toggleWishlist } = useUser();
  const { t, language } = useLanguage();
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || !newComment.trim() || !user) {
        alert("Please provide a rating and a comment.");
        return;
    }
    const review: Omit<Review, 'id'> = {
        reviewerName: user.name,
        reviewerAvatarUrl: user.avatarUrl,
        rating: newRating,
        comment: newComment.trim(),
        date: new Date().toISOString(),
    };
    onAddReview(seller.id, review);
    setNewRating(0);
    setNewComment('');
  };


  return (
    <div className="container mx-auto px-4 py-8">
      {/* --- Seller Header --- */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 bg-white p-8 rounded-2xl shadow-lg border border-orange-200">
        <img src={seller.avatarUrl} alt={seller.name} className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md" />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-[#004D40]">{seller.name}</h1>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
            <StarRating rating={seller.rating} />
            <span className="text-gray-600">({seller.reviewCount} reviews)</span>
          </div>
          <p className="mt-4 text-gray-700 max-w-2xl">{seller.bio}</p>
          <p className="mt-2 text-sm text-gray-500">Member since {new Date(seller.joinedDate).toLocaleDateString(language === 'en' ? 'en-US' : 'th-TH', { year: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      {/* --- Sales History --- */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-[#004D40] mb-6">Sales History</h2>
        <ProductGrid
          products={products}
          onProductClick={onProductClick}
          wishlist={user?.wishlist || []}
          onToggleWishlist={toggleWishlist}
          onSellerClick={onNavigateToSeller}
        />
      </div>

      {/* --- Reviews Section --- */}
      <div>
        <h2 className="text-3xl font-bold text-[#004D40] mb-6">Reviews from Buyers</h2>
        <div className="space-y-6">
            {/* --- Review Form --- */}
            {user && (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
                    <h3 className="font-semibold text-lg mb-3">Leave a Review</h3>
                    <form onSubmit={handleReviewSubmit}>
                        <div className="mb-3">
                            <p className="text-sm font-medium mb-1">Your Rating:</p>
                            <StarRating interactive value={newRating} onRate={setNewRating} />
                        </div>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your experience with this seller..."
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C69] focus:border-transparent"
                        />
                        <button type="submit" className="mt-3 bg-[#FF8C69] text-white font-bold py-2 px-5 rounded-full hover:bg-[#ff7a55] transition disabled:bg-gray-300" disabled={!newRating || !newComment.trim()}>
                            Submit Review
                        </button>
                    </form>
                </div>
            )}
            
            {/* --- Reviews List --- */}
            {seller.reviews.length > 0 ? (
                 seller.reviews.map(review => (
                    <div key={review.id} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
                        <img src={review.reviewerAvatarUrl || `https://i.pravatar.cc/150?u=${review.reviewerName}`} alt={review.reviewerName} className="w-12 h-12 rounded-full object-cover"/>
                        <div>
                            <div className="flex items-center gap-3">
                                <p className="font-semibold">{review.reviewerName}</p>
                                <StarRating rating={review.rating} />
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{new Date(review.date).toLocaleDateString()}</p>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to leave one!</p>
            )}
        </div>
      </div>
    </div>
  );
};
