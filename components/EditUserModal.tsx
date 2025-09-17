import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { XIcon } from './icons/XIcon';
import { UserIcon } from './icons/UserIcon';

interface EditUserModalProps {
    user: User;
    onClose: () => void;
    onSave: (user: User) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const [points, setPoints] = useState(user.points.toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedPoints = parseInt(points, 10);
        if (isNaN(parsedPoints)) {
            alert("กรุณากรอกคะแนนเป็นตัวเลข");
            return;
        }
        onSave({
            ...user,
            name,
            points: parsedPoints,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="text-[#004D40]"><UserIcon /></div>
                        <h2 className="text-2xl font-bold text-[#004D40]">แก้ไขข้อมูลผู้ใช้</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><XIcon /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">อีเมล (ไม่สามารถแก้ไขได้)</label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อผู้ใช้</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="points" className="block text-sm font-medium text-gray-700">คะแนนสะสม</label>
                        <input
                            type="number"
                            id="points"
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full hover:bg-gray-300 transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="bg-[#FF8C69] text-white font-bold py-2 px-4 rounded-full hover:bg-[#ff7a55] transition-colors"
                        >
                            บันทึกการเปลี่ยนแปลง
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};