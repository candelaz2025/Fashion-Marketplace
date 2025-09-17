import React, { useState } from 'react';

interface StarRatingProps {
  rating?: number;
  totalStars?: number;
  interactive?: boolean;
  value?: number;
  onRate?: (rating: number) => void;
}

const Star: React.FC<{ filled: boolean; half: boolean; onMouseEnter?: () => void; onClick?: () => void }> = ({ filled, half, onMouseEnter, onClick }) => (
    <svg
        className={`w-5 h-5 ${onClick ? 'cursor-pointer' : ''} ${filled || half ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        onMouseEnter={onMouseEnter}
        onClick={onClick}
    >
        {half ? (
            <>
                <defs><clipPath id="half-star-clip"><rect x="0" y="0" width="10" height="20" /></clipPath></defs>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                <path className="text-gray-300" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipPath="url(#half-star-clip)" style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}/>
            </>
        ) : (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        )}
    </svg>
);


export const StarRating: React.FC<StarRatingProps> = ({ rating = 0, totalStars = 5, interactive = false, value = 0, onRate }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseEnter = (index: number) => {
        if (interactive) {
            setHoverRating(index);
        }
    };

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };

    const handleClick = (index: number) => {
        if (interactive && onRate) {
            onRate(index);
        }
    };
    
    const displayRating = interactive ? hoverRating || value : rating;

    return (
        <div className="flex items-center" onMouseLeave={handleMouseLeave}>
            {[...Array(totalStars)].map((_, i) => {
                const starValue = i + 1;
                return (
                    <Star
                        key={i}
                        filled={starValue <= displayRating}
                        half={!interactive && starValue - 0.5 === rating}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onClick={() => handleClick(starValue)}
                    />
                );
            })}
        </div>
    );
};
