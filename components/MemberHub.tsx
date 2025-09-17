import React from 'react';
import { useUser } from './UserContext';
import { XIcon } from './icons/XIcon';
import { UserIcon } from './icons/UserIcon';
import { StarIcon } from './icons/StarIcon';
import { ReceiptIcon } from './icons/ReceiptIcon';

interface MemberHubProps {
  onClose: () => void;
  onLogout: () => void;
  onNavigateToHistory: () => void;
}

export const MemberHub: React.FC<MemberHubProps> = ({ onClose, onLogout, onNavigateToHistory }) => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#004D40] flex items-center gap-2">
            <UserIcon />
            โปรไฟล์ของฉัน
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <XIcon />
          </button>
        </div>
        <div className="text-center py-6 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-lg text-gray-600">สวัสดีค่ะ, คุณ</p>
            <p className="text-3xl font-bold text-[#FF8C69] mt-1">{user.name}</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 font-semibold px-4 py-1 rounded-full">
                <StarIcon />
                <span>{user.points.toLocaleString()} คะแนน</span>
            </div>
        </div>
        <div className="mt-6 space-y-3">
            <button
              onClick={onNavigateToHistory}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-teal-700 text-teal-700 font-bold py-3 px-6 rounded-full hover:bg-teal-50 transition"
            >
              <ReceiptIcon />
              ประวัติการสั่งซื้อ
            </button>
            <button
              onClick={onLogout}
              className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-300 transition"
            >
              ออกจากระบบ
            </button>
        </div>
      </div>
    </div>
  );
};