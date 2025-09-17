import React, { useState } from 'react';
import { useOrders } from './OrderContext';
import { useUser } from './UserContext';
import { useLanguage } from './LanguageContext';
import { ReceiptIcon } from './icons/ReceiptIcon';
import { StarIcon } from './icons/StarIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import type { Order } from '../types';

interface OrderHistoryPageProps {
    onNavigate: (page: string) => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ onNavigate }) => {
    const { user } = useUser();
    const { orders } = useOrders();
    const { t, language } = useLanguage();
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const toggleOrderExpansion = (orderId: string) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    const handleCopy = (orderId: string) => {
        navigator.clipboard.writeText(orderId).then(() => {
            setCopiedId(orderId);
            setTimeout(() => {
                setCopiedId(null);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-gray-700">กรุณาเข้าสู่ระบบ</h1>
                <p className="text-gray-500">เพื่อดูประวัติการสั่งซื้อของคุณ</p>
            </div>
        )
    }

    const OrderCard = ({ order }: { order: Order }) => (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
            <div className="p-4 cursor-pointer hover:bg-orange-50/50 transition" onClick={() => toggleOrderExpansion(order.id)}>
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                        <p className="font-semibold text-[#004D40]">{t('order_card_order_number')}</p>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500 font-mono">{order.id}</p>
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleCopy(order.id); }} 
                                className="p-1 rounded-md hover:bg-orange-100 transition-colors"
                                title={copiedId === order.id ? t('order_history_copied') : t('order_history_copy')}
                            >
                                {copiedId === order.id ? <CheckIcon /> : <CopyIcon />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-[#004D40]">{t('order_card_order_date')}</p>
                        <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString(language === 'en' ? 'en-GB' : 'th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-[#004D40]">{t('order_card_total')}</p>
                        <p className="text-lg font-bold text-[#FF8C69]">{order.totalAmount.toLocaleString()} {t('thb')}</p>
                    </div>
                    <div className="text-gray-400 transition-transform" style={{ transform: expandedOrderId === order.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            {expandedOrderId === order.id && (
                <div className="p-4 border-t border-orange-200 bg-orange-50/30">
                    <h4 className="font-semibold mb-2">รายการสินค้า</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                        {order.items.map((item, index) => {
                            const priceToUse = item.salePrice ?? item.price;
                            return (
                                <li key={item.cartItemId || `${item.id}-${index}`}>{item.name} {item.selectedSize && `(ขนาด: ${item.selectedSize})`} (x{item.quantity}) - {(priceToUse * item.quantity).toLocaleString()} {t('thb')}</li>
                            )
                        })}
                    </ul>
                     <h4 className="font-semibold mb-2">ข้อมูลการจัดส่ง</h4>
                    <div className="text-sm text-gray-700">
                        <p><strong>ชื่อ:</strong> {order.shippingInfo.name}</p>
                        <p><strong>ที่อยู่:</strong> {`${order.shippingInfo.address}, ${order.shippingInfo.province}, ${order.shippingInfo.postalCode}`}</p>
                        <p><strong>ขนส่ง:</strong> {order.shippingInfo.carrier === 'flash' ? 'Flash Express' : 'Thailand Post - EMS'}</p>
                    </div>
                </div>
            )}
        </div>
    );
    
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-12">
                <div className="inline-flex justify-center text-[#FF8C69] mb-4 bg-orange-100 p-3 rounded-full">
                    <ReceiptIcon />
                </div>
                <h1 className="text-4xl font-extrabold text-[#004D40] tracking-tight">{t('order_history_title')}</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    {t('order_history_subtitle')}
                </p>
            </div>
            
            <div className="mb-8 p-6 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-2xl shadow-lg text-center">
                <h2 className="text-xl font-bold text-white">{t('order_history_points_title')}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="text-white"><StarIcon/></div>
                    <p className="text-4xl font-extrabold text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>
                        {user.points.toLocaleString()}
                    </p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                    <div className="text-gray-300 w-24 h-24 mx-auto mb-4">
                        <ShoppingCartIcon />
                    </div>
                    <p className="text-xl text-gray-600 font-semibold">{t('order_history_no_orders')}</p>
                    <p className="text-gray-400 mt-2 mb-6">{t('order_history_no_orders_subtitle')}</p>
                    <button
                        onClick={() => onNavigate('marketplace')}
                        className="bg-[#FF8C69] text-white font-bold py-3 px-8 rounded-full hover:bg-[#ff7a55] transition-transform hover:scale-105"
                    >
                        {t('order_history_shop_now')}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};