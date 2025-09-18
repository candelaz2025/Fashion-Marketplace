import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { useLanguage } from './LanguageContext';
import { UserIcon } from './icons/UserIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import { PinterestIcon } from './icons/PinterestIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';
import { StarIcon } from './icons/StarIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import type { ShippingInfo } from '../types';

const countries = ['Thailand', 'United States', 'United Kingdom', 'Japan', 'Singapore'];
const thaiProvinces = [
    'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท',
    'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง', 'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม',
    'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์',
    'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พะเยา', 'พังงา', 'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์',
    'แพร่', 'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง',
    'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ',
    'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย',
    'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี'
];

export const ProfilePage: React.FC = () => {
    const { user, updateUserProfile, addPoints } = useUser();
    const { t } = useLanguage();

    const [name, setName] = useState(user?.name || '');
    const [shirtSize, setShirtSize] = useState(user?.shirtSize || '');
    const [pantsSize, setPantsSize] = useState(user?.pantsSize || '');
    const [shoeSize, setShoeSize] = useState(user?.shoeSize || '');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
    const [instagramHandle, setInstagramHandle] = useState(user?.instagramHandle || '');
    const [tiktokHandle, setTiktokHandle] = useState(user?.tiktokHandle || '');
    const [pinterestHandle, setPinterestHandle] = useState(user?.pinterestHandle || '');
    const [youtubeChannel, setYoutubeChannel] = useState(user?.youtubeChannel || '');
    const [isConnecting, setIsConnecting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [shippingAddress, setShippingAddress] = useState<ShippingInfo>(
        user?.shippingAddress || {
            name: user?.name || '', email: user?.email || '', address: '', province: '', country: 'Thailand', postalCode: '', phone: '', carrier: 'flash'
        }
    );

    useEffect(() => {
        if (user) {
            setName(user.name);
            setShirtSize(user.shirtSize || '');
            setPantsSize(user.pantsSize || '');
            setShoeSize(user.shoeSize || '');
            setAvatarPreview(user.avatarUrl || null);
            setInstagramHandle(user.instagramHandle || '');
            setTiktokHandle(user.tiktokHandle || '');
            setPinterestHandle(user.pinterestHandle || '');
            setYoutubeChannel(user.youtubeChannel || '');
            setShippingAddress(user.shippingAddress || {
                name: user.name, email: user.email, address: '', province: '', country: 'Thailand', postalCode: '', phone: '', carrier: 'flash'
            });
        }
    }, [user]);

    if (!user) {
        return <div className="text-center p-8">{t('error_generic')}</div>;
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                setAvatarPreview(result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => {
            const newState = {...prev, [name]: value};
            // If country is changed, reset province
            if (name === 'country') {
                newState.province = '';
            }
            return newState;
        });
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserProfile({ 
            name, 
            shippingAddress, 
            shirtSize, 
            pantsSize,
            shoeSize,
            avatarUrl: avatarPreview ?? undefined
            ,
            instagramHandle,
            tiktokHandle,
            pinterestHandle,
            youtubeChannel,
        });
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };
    
    const handleFacebookConnect = () => {
        if (!user.facebookConnected && !isConnecting) {
            setIsConnecting(true);
            // Simulate API call to Facebook
            setTimeout(() => {
                updateUserProfile({ facebookConnected: true });
                addPoints(50); // Add 50 bonus points
                alert(t('profile_facebook_success'));
                setIsConnecting(false);
            }, 1500); // 1.5 second delay
        }
    };
    
    const clothingSizeOptions = ['', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
    const shoeSizeOptions = ['', ...Array.from({ length: 12 }, (_, i) => (36 + i).toString())]; // Sizes 36 to 47

    const socialFields = [
        {
            id: 'instagram',
            label: t('profile_social_instagram'),
            value: instagramHandle,
            onChange: setInstagramHandle,
            placeholder: '@styleswap',
            icon: <InstagramIcon />,
        },
        {
            id: 'tiktok',
            label: t('profile_social_tiktok'),
            value: tiktokHandle,
            onChange: setTiktokHandle,
            placeholder: '@styleswap',
            icon: <TikTokIcon />,
        },
        {
            id: 'pinterest',
            label: t('profile_social_pinterest'),
            value: pinterestHandle,
            onChange: setPinterestHandle,
            placeholder: 'https://www.pinterest.com/yourboard',
            icon: <PinterestIcon />,
        },
        {
            id: 'youtube',
            label: t('profile_social_youtube'),
            value: youtubeChannel,
            onChange: setYoutubeChannel,
            placeholder: 'https://youtube.com/@channel',
            icon: <YoutubeIcon />,
        },
    ];

    const renderSocialStatus = (value: string) => (
        <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${value ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
            {value ? t('profile_social_status_connected') : t('profile_social_status_disconnected')}
        </span>
    );

    return (
        <div className="container mx-auto max-w-4xl p-4 sm:p-8">
            <div 
                className={`fixed top-24 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 transition-all duration-300 ease-in-out
                ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
            >
                <div className="w-5 h-5"><CheckCircleIcon /></div>
                <span>{t('profile_save_success')}</span>
            </div>
             <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-[#004D40] tracking-tight">{t('profile_page_title')}</h1>
            </div>
            <form onSubmit={handleSaveChanges}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Panel: Avatar & Info */}
                    <div className="md:col-span-1 flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border-2 border-orange-200">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon />
                                )}
                            </div>
                            <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-[#FF8C69] text-white p-2 rounded-full cursor-pointer hover:bg-[#ff7a55] transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        </div>
                        <h2 className="text-2xl font-bold text-[#004D40]">{user.name}</h2>
                        <p className="text-gray-500">{user.email}</p>
                        <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 font-semibold px-4 py-1 rounded-full">
                            <StarIcon />
                            <span>{user.points.toLocaleString()} {t('order_history_points_title')}</span>
                        </div>
                         <div className="w-full mt-6">
                            <button type="button" onClick={handleFacebookConnect} disabled={user.facebookConnected || isConnecting} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isConnecting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>{t('profile_connecting_facebook')}</span>
                                    </>
                                ) : (
                                    <>
                                        <FacebookIcon />
                                        {user.facebookConnected ? t('profile_facebook_connected') : t('profile_connect_facebook')}
                                    </>
                                )}
                            </button>
                            {!user.facebookConnected && !isConnecting && <p className="text-xs text-center mt-2 text-gray-500">{t('profile_get_points')}</p>}
                        </div>
                        <div className="w-full mt-6 bg-white border border-orange-100 rounded-2xl p-4 text-left">
                            <h3 className="text-lg font-semibold text-[#004D40]">{t('profile_social_title')}</h3>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t('profile_social_subtitle')}</p>
                            <div className="mt-4 space-y-4">
                                {socialFields.map(field => (
                                    <label key={field.id} className="block">
                                        <span className="flex items-center gap-2 text-sm font-medium text-[#004D40]">
                                            <span className="text-[#FF8C69]">{field.icon}</span>
                                            {field.label}
                                            {renderSocialStatus(field.value)}
                                        </span>
                                        <input
                                            type="text"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            placeholder={t('profile_social_placeholder')}
                                            className="mt-2 block w-full rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:ring-[#FF8C69] focus:border-[#FF8C69]"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Right Panel: Details Form */}
                    <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-orange-100">
                        <h3 className="text-xl font-semibold text-[#004D40] mb-4">{t('profile_edit_info')}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#004D40]">
                                    {t('admin_table_name')}
                                </label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-lg px-4 py-2 bg-gray-100 border-gray-300 focus:ring-[#FF8C69] focus:border-[#FF8C69]"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-[#004D40]">
                                    {t('admin_table_email')}
                                </label>
                                <input type="email" value={user.email} disabled className="mt-1 block w-full rounded-lg px-4 py-2 bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"/>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t mt-6">
                                <div>
                                    <label htmlFor="shirtSize" className="block text-sm font-medium text-[#004D40]">ขนาดเสื้อ</label>
                                    <select id="shirtSize" value={shirtSize} onChange={e => setShirtSize(e.target.value)} className="mt-1 block w-full rounded-lg px-4 py-2 bg-gray-100 border-gray-300 focus:ring-[#FF8C69] focus:border-[#FF8C69]">
                                        {clothingSizeOptions.map(size => <option key={size} value={size}>{size || 'ไม่ได้ระบุ'}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="pantsSize" className="block text-sm font-medium text-[#004D40]">ขนาดกางเกง</label>
                                    <select id="pantsSize" value={pantsSize} onChange={e => setPantsSize(e.target.value)} className="mt-1 block w-full rounded-lg px-4 py-2 bg-gray-100 border-gray-300 focus:ring-[#FF8C69] focus:border-[#FF8C69]">
                                       {clothingSizeOptions.map(size => <option key={size} value={size}>{size || 'ไม่ได้ระบุ'}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="shoeSize" className="block text-sm font-medium text-[#004D40]">ขนาดรองเท้า</label>
                                    <select id="shoeSize" value={shoeSize} onChange={e => setShoeSize(e.target.value)} className="mt-1 block w-full rounded-lg px-4 py-2 bg-gray-100 border-gray-300 focus:ring-[#FF8C69] focus:border-[#FF8C69]">
                                       {shoeSizeOptions.map(size => <option key={size} value={size}>{size || 'ไม่ได้ระบุ'}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-[#004D40] pt-4 border-t mt-6">{t('profile_address')}</h3>
                            <div>
                                <label className="block text-sm font-medium text-[#004D40]">ที่อยู่</label>
                                <input type="text" name="address" value={shippingAddress.address} onChange={handleAddressChange} className="mt-1 block w-full rounded-lg px-4 py-2 bg-gray-100 border-gray-300 focus:ring-[#FF8C69] focus:border-[#FF8C69]"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#004D40]">ประเทศ</label>
                                    <select name="country" value={shippingAddress.country} onChange={handleAddressChange} className="mt-1 block w-full rounded-lg px-4 py-2 bg-gray-100 border-gray-300 focus:ring-[#FF8C69] focus:border-[#FF8C69]">
                                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#004D40]">จังหวัด</label>
                                    {shippingAddress.country === 'Thailand' ? (
                                        <select name="province" value={shippingAddress.province} onChange={handleAddressChange} className="mt-1 block w-full rounded-lg px-4 py-2 bg-gray-100 border-gray-300 focus:ring-[#FF8C69] focus:border-[#FF8C69]">
                                            <option value="">-- เลือกจังหวัด --</option>
                                            {thaiProvinces.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" name="province" value={shippingAddress.province} placeholder="State / Region" onChange={handleAddressChange} className="mt-1 block w-full rounded-lg px-4 py-2 bg-gray-100 border-gray-300 focus:ring-[#FF8C69] focus:border-[#FF8C69]"/>
                                    )}
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#004D40]">รหัสไปรษณีย์</label>
                                    <input type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleAddressChange} className="mt-1 block w-full rounded-lg px-4 py-2 bg-gray-100 border-gray-300 focus:ring-[#FF8C69] focus:border-[#FF8C69]"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#004D40]">เบอร์โทรศัพท์</label>
                                    <input type="tel" name="phone" value={shippingAddress.phone} onChange={handleAddressChange} className="mt-1 block w-full rounded-lg px-4 py-2 bg-gray-100 border-gray-300 focus:ring-[#FF8C69] focus:border-[#FF8C69]"/>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button type="submit" className="bg-[#FF8C69] text-white font-bold py-2 px-6 rounded-full hover:bg-[#ff7a55] transition">
                                    {t('profile_save_changes')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};