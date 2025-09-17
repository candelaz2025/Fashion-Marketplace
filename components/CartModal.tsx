import React from 'react';
import { useCart } from './CartContext';
import { useUser } from './UserContext';
import { XIcon } from './icons/XIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';

interface CartModalProps {
  onClose: () => void;
  onLoginRequest: () => void;
  onCheckoutRequest: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ onClose, onLoginRequest, onCheckoutRequest }) => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { user } = useUser();

  const handleCheckout = () => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อค่ะ");
      onLoginRequest();
      return;
    }
    if (cartItems.length > 0) {
      onCheckoutRequest();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 flex justify-between items-center border-b border-orange-200">
          <h2 className="text-xl font-bold text-[#004D40] flex items-center gap-2">
            <ShoppingCartIcon /> ตะกร้าสินค้า
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <XIcon />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-xl">ตะกร้าของคุณว่างเปล่า</p>
              <p>ลองเพิ่มสินค้าที่น่าสนใจดูสิ!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => {
                const priceToUse = item.salePrice ?? item.price;
                const hasSale = typeof item.salePrice === 'number';
                return (
                  <div key={item.cartItemId} className="flex items-center gap-4 p-2 border-b border-orange-100">
                    <img src={item.imageUrls[0]} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-grow">
                      <p className="font-semibold text-[#004D40]">{item.name}</p>
                      {item.selectedSize && <p className="text-sm text-gray-500">ขนาด: {item.selectedSize}</p>}
                      {hasSale ? (
                          <div className="flex items-baseline gap-2 text-sm">
                            <p className="text-red-600 font-semibold">{item.salePrice?.toLocaleString()} THB</p>
                            <del className="text-gray-400">{item.price.toLocaleString()} THB</del>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">{item.price.toLocaleString()} THB</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2">
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="text-gray-500 hover:text-red-500 p-1"><MinusIcon /></button>
                      <span className="font-semibold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="text-gray-500 hover:text-green-500 p-1"><PlusIcon /></button>
                    </div>
                    <p className="font-bold w-24 text-right text-[#FF8C69]">{(priceToUse * item.quantity).toLocaleString()} THB</p>
                    <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-400 hover:text-red-600 p-1">
                      <TrashIcon />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </main>

        {cartItems.length > 0 && (
          <footer className="p-6 border-t border-orange-200 bg-orange-50/50">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold text-gray-700">ยอดรวมทั้งหมด:</p>
              <p className="text-2xl font-bold text-[#004D40]">{totalPrice.toLocaleString()} THB</p>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#FF8C69] text-white font-bold py-3 px-6 rounded-full hover:bg-[#ff7a55] transition-transform hover:scale-105"
            >
              {user ? 'ดำเนินการสั่งซื้อ' : 'เข้าสู่ระบบเพื่อสั่งซื้อ'}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};