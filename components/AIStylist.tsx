
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface AIStylistProps {
  onGetStyleIdeas: () => void;
  isLoading: boolean;
  hasLikedItems: boolean;
}

export const AIStylist: React.FC<AIStylistProps> = ({ onGetStyleIdeas, isLoading, hasLikedItems }) => {
  return (
    <div className="text-center my-12 p-8 bg-gradient-to-r from-[#FF8C69] to-[#FF6B6B] rounded-2xl shadow-lg">
      <div className="flex justify-center text-white mb-4">
        <SparklesIcon />
      </div>
      <h2 className="text-3xl font-bold text-white mb-3">ไม่แน่ใจว่าจะแต่งตัวสไตล์ไหนดี?</h2>
      <p className="text-white/90 mb-6 max-w-xl mx-auto">
        ให้ AI Stylist ของเราช่วยสิ! แค่กด "ถูกใจ" สินค้าที่คุณชอบ แล้ว AI จะแนะนำสไตล์การแต่งตัวพร้อมไอเท็มที่เข้ากันให้เลย
      </p>
      <button
        onClick={onGetStyleIdeas}
        disabled={isLoading || !hasLikedItems}
        className="bg-white text-[#FF6B6B] font-bold py-3 px-8 rounded-full shadow-md hover:bg-orange-50 transition-transform hover:scale-105 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#FF6B6B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            กำลังคิด...
          </div>
        ) : 'แนะนำสไตล์สำหรับฉัน!'}
      </button>
      {!hasLikedItems && !isLoading && (
        <p className="text-white/80 text-sm mt-4">
          (กรุณากด "ถูกใจ" สินค้าอย่างน้อย 1 ชิ้น)
        </p>
      )}
    </div>
  );
};
