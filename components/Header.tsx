import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { UserIcon } from './icons/UserIcon';
import { useCart } from './CartContext';
import { useUser } from './UserContext';
import { useLanguage } from './LanguageContext';
import { ReceiptIcon } from './icons/ReceiptIcon';
import { HeartIcon } from './icons/HeartIcon';

interface HeaderProps {
    onCartClick: () => void;
    onUserClick: () => void;
    onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartClick, onUserClick, onNavigate }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { itemCount } = useCart();
    const { user, logout } = useUser();
    const { language, setLanguage, t } = useLanguage();
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUserInteraction = () => {
        if (user) {
            setIsProfileOpen(prev => !prev);
        } else {
            onUserClick();
        }
    };
    
    const handleLogout = () => {
        setIsProfileOpen(false);
        logout();
        onNavigate('marketplace');
    };

    const handleDropdownNavigate = (page: string) => {
        setIsProfileOpen(false);
        onNavigate(page);
    };

    return (
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm border-b border-orange-100">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div onClick={() => onNavigate('marketplace')} className="cursor-pointer">
                    <h1 className="text-2xl font-bold text-[#004D40]">
                        {t('app_title_part1')}<span className="text-[#FF8C69]">{t('app_title_part2')}</span>
                    </h1>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <button onClick={() => onNavigate('marketplace')} className="text-gray-600 hover:text-[#FF8C69] font-medium">{t('nav_marketplace')}</button>
                    <button onClick={() => onNavigate('stylehub')} className="text-gray-600 hover:text-[#FF8C69] font-medium">{t('nav_style_hub')}</button>
                    <button onClick={() => onNavigate('tracking')} className="text-gray-600 hover:text-[#FF8C69] font-medium">{t('nav_tracking')}</button>
                    {user?.role === 'admin' && (
                        <button onClick={() => onNavigate('admin')} className="text-red-500 hover:text-red-700 font-medium">{t('nav_admin')}</button>
                    )}
                </nav>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'th' | 'en' | 'zh')}
                            className="text-sm font-medium text-gray-600 bg-transparent border-none rounded-md py-1 pl-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#FF8C69] appearance-none cursor-pointer"
                        >
                            <option value="th">TH 🇹🇭</option>
                            <option value="en">EN 🇬🇧</option>
                            <option value="zh">ZH 🇨🇳</option>
                        </select>
                    </div>
                    
                    <div className="relative" ref={profileRef}>
                        <button onClick={handleUserInteraction} className="text-gray-600 hover:text-[#FF8C69]">
                            {user?.avatarUrl ? <img src={user.avatarUrl} alt="User" className="h-8 w-8 rounded-full object-cover"/> : <UserIcon />}
                        </button>
                        {isProfileOpen && user && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-orange-100 overflow-hidden">
                                <div className="p-4 border-b border-orange-100">
                                    <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <div className="py-2">
                                    <button onClick={() => handleDropdownNavigate('profile')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF8C69] flex items-center gap-3"><UserIcon /> {t('header_dropdown_profile')}</button>
                                    <button onClick={() => handleDropdownNavigate('wishlist')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF8C69] flex items-center gap-3"><HeartIcon /> {t('header_dropdown_wishlist')}</button>
                                    <button onClick={() => handleDropdownNavigate('history')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF8C69] flex items-center gap-3"><ReceiptIcon /> {t('header_dropdown_orders')}</button>
                                </div>
                                <div className="p-2 border-t border-orange-100">
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">{t('member_hub_logout')}</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={onCartClick} className="relative text-gray-600 hover:text-[#FF8C69]">
                        <ShoppingCartIcon />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#FF6B6B] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};