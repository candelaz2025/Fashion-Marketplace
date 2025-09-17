import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useUser } from './UserContext';
import { useOrders } from './OrderContext';
import type { Order, ShippingInfo, CartItem } from '../types';
import { XIcon } from './icons/XIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { DownloadIcon } from './icons/DownloadIcon';

// --- Props Interfaces for Step Components ---
interface ShippingStepProps {
  shippingInfo: ShippingInfo;
  setShippingInfo: React.Dispatch<React.SetStateAction<ShippingInfo>>;
  onSubmit: (e: React.FormEvent) => void;
}

interface ReviewAndPaymentStepProps {
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  cartItems: CartItem[];
  totalPrice: number;
  shippingInfo: ShippingInfo;
  shippingFee: number;
  grandTotal: number;
  paymentMethod: 'card' | 'qr';
  setPaymentMethod: React.Dispatch<React.SetStateAction<'card' | 'qr'>>;
}

interface ConfirmationStepProps {
  trackingNumber: string;
  orderDate: string;
  cartItems: CartItem[];
  totalPrice: number;
  shippingFee: number;
  grandTotal: number;
  shippingInfo: ShippingInfo;
  onDownload: () => void;
  onSuccess: () => void;
}

// --- Component Styles (defined once) ---
const formInputStyle = "mt-1 block w-full rounded-lg px-4 py-3 bg-[#374151] text-white placeholder-gray-400 border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF8C69] focus:border-transparent transition";
const formLabelStyle = "block text-sm font-medium text-[#004D40]";

// --- Data for Dropdowns ---
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


// --- Step 1: Shipping Address Component ---
const ShippingStep: React.FC<ShippingStepProps> = ({ shippingInfo, setShippingInfo, onSubmit }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-[#004D40] mb-4">ที่อยู่ในการจัดส่ง</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={formLabelStyle}>ชื่อ-นามสกุล</label>
          <input type="text" value={shippingInfo.name} onChange={e => setShippingInfo(prev => ({...prev, name: e.target.value}))} className={formInputStyle} required />
        </div>
        <div>
          <label className={formLabelStyle}>อีเมล</label>
          <input type="email" value={shippingInfo.email} onChange={e => setShippingInfo(prev => ({...prev, email: e.target.value}))} className={formInputStyle} required />
        </div>
      </div>
      <div>
        <label className={formLabelStyle}>ที่อยู่</label>
        <input type="text" value={shippingInfo.address} onChange={e => setShippingInfo(prev => ({...prev, address: e.target.value}))} className={formInputStyle} placeholder="บ้านเลขที่, ถนน, ตำบล/แขวง" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={formLabelStyle}>ประเทศ</label>
            <select value={shippingInfo.country} onChange={e => setShippingInfo(prev => ({...prev, country: e.target.value, province: ''}))} className={formInputStyle} required>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={formLabelStyle}>จังหวัด/รัฐ</label>
            {shippingInfo.country === 'Thailand' ? (
                 <select value={shippingInfo.province} onChange={e => setShippingInfo(prev => ({...prev, province: e.target.value}))} className={formInputStyle} required>
                    <option value="">-- เลือกจังหวัด --</option>
                    {thaiProvinces.map(p => <option key={p} value={p}>{p}</option>)}
                 </select>
            ) : (
                <input type="text" value={shippingInfo.province} placeholder="State / Province / Region" onChange={e => setShippingInfo(prev => ({...prev, province: e.target.value}))} className={formInputStyle} required />
            )}
          </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={formLabelStyle}>รหัสไปรษณีย์</label>
            <input type="text" value={shippingInfo.postalCode} onChange={e => setShippingInfo(prev => ({...prev, postalCode: e.target.value}))} className={formInputStyle} required />
          </div>
          <div>
            <label className={formLabelStyle}>เบอร์โทรศัพท์</label>
            <input type="tel" value={shippingInfo.phone} onChange={e => setShippingInfo(prev => ({...prev, phone: e.target.value}))} className={formInputStyle} required />
          </div>
      </div>
       <div>
        <h4 className="text-lg font-medium text-[#004D40] mb-2">บริษัทขนส่ง</h4>
        <div className="space-y-2">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50 bg-white">
                <input type="radio" name="carrier" value="flash" checked={shippingInfo.carrier === 'flash'} onChange={e => setShippingInfo(prev => ({...prev, carrier: e.target.value}))} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                <div className="ml-3 text-sm flex-grow">
                    <p className="font-medium text-gray-900">Flash Express</p>
                    <p className="text-gray-500">ค่าส่ง 40 THB (1-3 วัน)</p>
                </div>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50 bg-white">
                <input type="radio" name="carrier" value="ems" checked={shippingInfo.carrier === 'ems'} onChange={e => setShippingInfo(prev => ({...prev, carrier: e.target.value}))} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                <div className="ml-3 text-sm flex-grow">
                    <p className="font-medium text-gray-900">Thailand Post - EMS</p>
                    <p className="text-gray-500">ค่าส่ง 50 THB (2-4 วัน)</p>
                </div>
            </label>
        </div>
      </div>
      <button type="submit" className="w-full mt-6 bg-[#FF8C69] text-white font-bold py-3 px-6 rounded-full hover:bg-[#ff7a55] transition">ตรวจสอบและชำระเงิน</button>
    </form>
);

// --- Step 2: Review & Payment Component ---
const ReviewAndPaymentStep: React.FC<ReviewAndPaymentStepProps> = ({ onSubmit, onBack, cartItems, totalPrice, shippingInfo, shippingFee, grandTotal, paymentMethod, setPaymentMethod }) => (
    <form onSubmit={onSubmit}>
        <h3 className="text-xl font-semibold text-[#004D40] mb-4">ตรวจสอบและชำระเงิน</h3>
        <div className="border rounded-lg p-4 mb-4 space-y-2 bg-orange-50/50">
            <h4 className="font-semibold text-lg">สรุปรายการ</h4>
            {cartItems.map(item => {
                const priceToUse = item.salePrice ?? item.price;
                return (
                    <div key={item.cartItemId} className="flex justify-between items-center text-sm">
                        <p>{item.name} {item.selectedSize && `(${item.selectedSize})`} x {item.quantity}</p>
                        <p>{(priceToUse * item.quantity).toLocaleString()} THB</p>
                    </div>
                )
            })}
            <div className="flex justify-between items-center text-sm border-t pt-2 mt-2">
                <p>ค่าสินค้า</p>
                <p>{totalPrice.toLocaleString()} THB</p>
            </div>
            <div className="flex justify-between items-center text-sm">
                <p>ค่าจัดส่ง ({shippingInfo.carrier === 'flash' ? 'Flash Express' : 'EMS'})</p>
                <p>{shippingFee.toLocaleString()} THB</p>
            </div>
             <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2 text-[#004D40]">
                <p>ยอดรวมทั้งสิ้น</p>
                <p>{grandTotal.toLocaleString()} THB</p>
            </div>
        </div>
        <div className="border rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-lg mb-2">จัดส่งไปที่</h4>
            <p className="text-sm"><strong>ชื่อ:</strong> {shippingInfo.name} ({shippingInfo.email})</p>
            <p className="text-sm"><strong>ที่อยู่:</strong> {`${shippingInfo.address}, ${shippingInfo.province}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>
            <p className="text-sm"><strong>โทรศัพท์:</strong> {shippingInfo.phone}</p>
        </div>
        <h4 className="text-lg font-medium text-[#004D40] mb-2">เลือกช่องทางการชำระเงิน</h4>
        <div className="flex gap-2 mb-4 p-1 bg-gray-200 rounded-lg">
            <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 p-2 rounded-md text-sm font-medium transition-colors ${paymentMethod === 'card' ? 'bg-white text-[#004D40] shadow' : 'bg-transparent text-gray-600'}`}>
                <div className="flex items-center justify-center gap-2"><CreditCardIcon/> บัตรเครดิต/เดบิต</div>
            </button>
            <button type="button" onClick={() => setPaymentMethod('qr')} className={`flex-1 p-2 rounded-md text-sm font-medium transition-colors ${paymentMethod === 'qr' ? 'bg-white text-[#004D40] shadow' : 'bg-transparent text-gray-600'}`}>
                <div className="flex items-center justify-center gap-2"><QrCodeIcon/> QR Code</div>
            </button>
        </div>
        {paymentMethod === 'card' && (
            <div className="space-y-4 p-4 border rounded-lg">
                <div>
                    <label className={formLabelStyle}>หมายเลขบัตร</label>
                    <input type="text" className={formInputStyle} placeholder="0000 0000 0000 0000" />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={formLabelStyle}>วันหมดอายุ (MM/YY)</label>
                        <input type="text" className={formInputStyle} placeholder="MM/YY" />
                    </div>
                     <div>
                        <label className={formLabelStyle}>CVV</label>
                        <input type="text" className={formInputStyle} placeholder="123" />
                    </div>
                </div>
            </div>
        )}
        {paymentMethod === 'qr' && (
             <div className="p-4 border rounded-lg text-center">
                <p className="mb-2">สแกน QR Code เพื่อชำระเงิน</p>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=styleswap-payment-total-${grandTotal}`} alt="QR Code" className="mx-auto rounded-lg" />
                <p className="mt-2 text-sm text-gray-600">ยอดชำระ: {grandTotal.toLocaleString()} THB</p>
            </div>
        )}
        <button type="submit" className="w-full mt-6 bg-[#FF8C69] text-white font-bold py-3 px-6 rounded-full hover:bg-[#ff7a55] transition">ยืนยันการสั่งซื้อ</button>
        <button type="button" onClick={onBack} className="w-full mt-2 text-sm text-gray-600 hover:text-black">กลับไปแก้ไขที่อยู่</button>
    </form>
);

// --- Step 3: Confirmation Component ---
const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ trackingNumber, cartItems, totalPrice, shippingFee, grandTotal, shippingInfo, onDownload, onSuccess }) => (
    <div className="text-center p-8">
        <div className="printable-area">
            <div className="text-green-500 w-16 h-16 mx-auto mb-4 no-print">
                <CheckCircleIcon />
            </div>
            <h3 className="text-2xl font-bold text-[#004D40]">ขอบคุณสำหรับการสั่งซื้อ!</h3>
            <p className="text-gray-600 mt-2">เราได้รับคำสั่งซื้อของคุณแล้ว และจะรีบดำเนินการจัดส่งให้เร็วที่สุด</p>
            <div className="text-center bg-gray-100 p-3 rounded-lg mt-4 border">
                <p className="text-sm">หมายเลขติดตามพัสดุของคุณคือ</p>
                <p className="font-bold text-lg text-teal-600 tracking-wider">{trackingNumber}</p>
            </div>
            <div className="text-left bg-orange-50 p-4 rounded-lg mt-6 border border-orange-200">
                <h4 className="font-semibold mb-2 text-lg">สรุปคำสั่งซื้อ</h4>
                {cartItems.map(item => {
                    const priceToUse = item.salePrice ?? item.price;
                    return (
                        <div key={item.cartItemId} className="flex justify-between items-center text-sm border-b py-1">
                            <p>{item.name} {item.selectedSize && `(${item.selectedSize})`} x {item.quantity}</p>
                            <p>{(priceToUse * item.quantity).toLocaleString()} THB</p>
                        </div>
                    )
                })}
                <div className="flex justify-between items-center text-sm pt-2 mt-1">
                    <p>ค่าสินค้า</p>
                    <p>{totalPrice.toLocaleString()} THB</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <p>ค่าจัดส่ง</p>
                    <p>{shippingFee.toLocaleString()} THB</p>
                </div>
                <div className="flex justify-between items-center text-base font-bold border-t pt-2 mt-2">
                    <p>ยอดรวม</p>
                    <p>{grandTotal.toLocaleString()} THB</p>
                </div>
            </div>
            <div className="text-left bg-orange-50 p-4 rounded-lg mt-4 border border-orange-200">
                <h4 className="font-semibold mb-2">ข้อมูลการจัดส่ง</h4>
                <p className="text-sm"><strong>ชื่อ:</strong> {shippingInfo.name}</p>
                <p className="text-sm"><strong>อีเมล:</strong> {shippingInfo.email}</p>
                <p className="text-sm"><strong>ที่อยู่:</strong> {`${shippingInfo.address}, ${shippingInfo.province}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>
                <p className="text-sm"><strong>โทรศัพท์:</strong> {shippingInfo.phone}</p>
                <p className="text-sm"><strong>ขนส่ง:</strong> {shippingInfo.carrier === 'flash' ? 'Flash Express' : 'Thailand Post - EMS'}</p>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-8 no-print">
             <button onClick={onDownload} className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-teal-700 text-teal-700 font-bold py-3 px-4 rounded-full hover:bg-teal-50 transition-all">
                <DownloadIcon />
                ดาวน์โหลดใบเสร็จ
            </button>
            <button onClick={onSuccess} className="flex-1 bg-[#FF8C69] text-white font-bold py-3 px-6 rounded-full hover:bg-[#ff7a55] transition">
                กลับไปหน้าหลัก
            </button>
        </div>
    </div>
);

// --- Main Checkout Modal Component ---
interface CheckoutModalProps {
  onClose: () => void;
  onPurchaseSuccess: () => void;
}
type Step = 'shipping' | 'review_payment' | 'confirmation';

interface ConfirmedPurchase {
    order: Order;
    subtotal: number;
    shippingFee: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onPurchaseSuccess }) => {
  const [step, setStep] = useState<Step>('shipping');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    email: '',
    address: '',
    province: '',
    country: 'Thailand',
    postalCode: '',
    phone: '',
    carrier: 'flash',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qr'>('card');
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, addPoints } = useUser();
  const { addOrder } = useOrders();
  const [confirmedPurchase, setConfirmedPurchase] = useState<ConfirmedPurchase | null>(null);

  useEffect(() => {
    if(user) {
        setShippingInfo(prev => ({
            ...prev,
            name: user.name,
            email: user.email,
            // Only pre-fill if empty to avoid overriding user input
            address: prev.address || user.shippingAddress?.address || '',
            province: prev.province || user.shippingAddress?.province || '',
            country: prev.country || user.shippingAddress?.country || 'Thailand',
            postalCode: prev.postalCode || user.shippingAddress?.postalCode || '',
            phone: prev.phone || user.shippingAddress?.phone || '',
            carrier: prev.carrier || user.shippingAddress?.carrier || 'flash',
        }));
    }
  }, [user]);
  
  const shippingFee = shippingInfo.carrier === 'flash' ? 40 : 50;
  const grandTotal = totalPrice + shippingFee;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isFormValid = Object.values(shippingInfo).every(field => typeof field === 'string' && field.trim() !== '');
    if (isFormValid) {
      setStep('review_payment');
    } else {
      alert('กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบถ้วน');
    }
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, you would process the payment here
      const newOrder: Order = {
          id: `TH${Date.now()}`,
          date: new Date().toISOString(),
          items: cartItems,
          totalAmount: grandTotal,
          shippingInfo: shippingInfo,
          status: 'Processing'
      };
      addOrder(newOrder);

      const pointsEarned = Math.floor(grandTotal / 10); // 1 point per 10 THB
      addPoints(pointsEarned);

      // Store all details needed for confirmation page *before* clearing cart
      setConfirmedPurchase({
          order: newOrder,
          subtotal: totalPrice,
          shippingFee: shippingFee
      });

      clearCart();

      setStep('confirmation');
  };

  const handleFinalSuccess = () => {
    onPurchaseSuccess();
    alert('ขอบคุณสำหรับการสั่งซื้อ!\n(นี่เป็นเพียงการจำลอง ระบบยังไม่รองรับการชำระเงินจริง)');
  }
  
  const handleDownloadReceipt = () => {
    if (!confirmedPurchase) return;
    
    const { order, subtotal, shippingFee } = confirmedPurchase;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Configuration ---
    const width = 800;
    const padding = 40;
    const contentWidth = width - padding * 2;
    let y = padding;

    // --- Helper function to wrap text ---
    const wrapText = (text: string, x: number, startY: number, maxWidth: number, lineHeight: number, font: string): number => {
      ctx.font = font;
      const words = text.split(' ');
      let line = '';
      let currentY = startY;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, currentY);
          currentY += lineHeight;
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
      return currentY + lineHeight;
    };
    
    // --- Pre-calculate height by simulating the drawing ---
    const calculateHeight = () => {
        let tempY = padding;
        tempY += 40; // Title
        tempY += 30; // Subtitle
        tempY += 40; // Spacer
        tempY += 30; // Section header
        tempY += order.items.length * 28; // Items
        tempY += 40; // Line
        tempY += 28 * 3; // Totals
        tempY += 40; // Spacer
        tempY += 30; // Section header
        tempY += 28 * 5; // Shipping info (with potential wrapping)
        tempY += padding; // Bottom padding
        return tempY;
    }

    // --- Drawing ---
    canvas.width = width;
    canvas.height = calculateHeight() + 100; // Add extra space for wrapping
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    
    // Header
    y += 20;
    ctx.font = 'bold 32px Kanit';
    ctx.fillText('ใบเสร็จรับเงิน / Receipt', width / 2, y);
    y += 40;
    ctx.font = '18px Kanit';
    ctx.fillText(`หมายเลขคำสั่งซื้อ: ${order.id}`, width / 2, y);
    y += 25;
    ctx.fillText(`วันที่: ${new Date(order.date).toLocaleDateString('th-TH')}`, width / 2, y);
    y += 40;
    
    // Items
    ctx.textAlign = 'left';
    ctx.font = 'bold 20px Kanit';
    ctx.fillText('รายการสินค้า', padding, y);
    y += 35;
    
    ctx.font = '16px Kanit';
    order.items.forEach(item => {
        const priceToUse = item.salePrice ?? item.price;
        ctx.textAlign = 'left';
        ctx.fillText(`${item.name} ${item.selectedSize ? `(${item.selectedSize})` : ''} x ${item.quantity}`, padding, y);
        ctx.textAlign = 'right';
        ctx.fillText(`${(priceToUse * item.quantity).toLocaleString()} THB`, width - padding, y);
        y += 28;
    });

    // Line separator
    y += 10;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.strokeStyle = '#cccccc';
    ctx.stroke();
    y += 30;

    // Totals
    ctx.font = '16px Kanit';
    ctx.textAlign = 'left';
    ctx.fillText('ค่าสินค้า', padding, y);
    ctx.textAlign = 'right';
    ctx.fillText(`${subtotal.toLocaleString()} THB`, width - padding, y);
    y += 28;
    ctx.textAlign = 'left';
    ctx.fillText('ค่าจัดส่ง', padding, y);
    ctx.textAlign = 'right';
    ctx.fillText(`${shippingFee.toLocaleString()} THB`, width - padding, y);
    y += 28;
    ctx.font = 'bold 20px Kanit';
    ctx.textAlign = 'left';
    ctx.fillText('ยอดรวมทั้งสิ้น', padding, y);
    ctx.textAlign = 'right';
    ctx.fillText(`${order.totalAmount.toLocaleString()} THB`, width - padding, y);
    y += 40;

    // Shipping Info
    ctx.textAlign = 'left';
    ctx.font = 'bold 20px Kanit';
    ctx.fillText('ข้อมูลการจัดส่ง', padding, y);
    y += 35;

    ctx.font = '16px Kanit';
    ctx.fillText(`ชื่อ: ${order.shippingInfo.name}`, padding, y);
    y += 28;
    y = wrapText(`ที่อยู่: ${order.shippingInfo.address}, ${order.shippingInfo.province}, ${order.shippingInfo.postalCode}, ${order.shippingInfo.country}`, padding, y, contentWidth, 24, '16px Kanit');
    y += 4;
    ctx.fillText(`เบอร์โทรศัพท์: ${order.shippingInfo.phone}`, padding, y);
    y += 28;
    ctx.fillText(`ขนส่ง: ${order.shippingInfo.carrier === 'flash' ? 'Flash Express' : 'Thailand Post - EMS'}`, padding, y);
    y += 28;

    // --- Crop and Download ---
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = width;
    finalCanvas.height = y;
    const finalCtx = finalCanvas.getContext('2d');
    if (finalCtx) {
        finalCtx.drawImage(canvas, 0, 0);
        const link = document.createElement('a');
        link.href = finalCanvas.toDataURL('image/png');
        link.download = `receipt-${order.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const renderContent = () => {
    switch(step) {
      case 'shipping':
        return <ShippingStep shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} onSubmit={handleShippingSubmit} />;
      case 'review_payment':
        return <ReviewAndPaymentStep
                    onSubmit={handlePaymentSubmit}
                    onBack={() => setStep('shipping')}
                    cartItems={cartItems}
                    totalPrice={totalPrice}
                    shippingInfo={shippingInfo}
                    shippingFee={shippingFee}
                    grandTotal={grandTotal}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                />;
      case 'confirmation':
        if (!confirmedPurchase) return null;
        return <ConfirmationStep
                    trackingNumber={confirmedPurchase.order.id}
                    orderDate={confirmedPurchase.order.date}
                    cartItems={confirmedPurchase.order.items}
                    totalPrice={confirmedPurchase.subtotal}
                    shippingFee={confirmedPurchase.shippingFee}
                    grandTotal={confirmedPurchase.order.totalAmount}
                    shippingInfo={confirmedPurchase.order.shippingInfo}
                    onDownload={handleDownloadReceipt}
                    onSuccess={handleFinalSuccess}
                />;
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 flex justify-between items-center border-b border-orange-200 no-print">
          <h2 className="text-xl font-bold text-[#004D40]">
            {step === 'shipping' && 'ข้อมูลการจัดส่ง'}
            {step === 'review_payment' && 'ตรวจสอบและชำระเงิน'}
            {step === 'confirmation' && 'ยืนยันคำสั่งซื้อ'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <XIcon />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-orange-50/30">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};