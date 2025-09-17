import React, { useState } from 'react';
import { TruckIcon } from './icons/TruckIcon';
import { SearchIcon } from './icons/SearchIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface TrackingStatus {
    status: string;
    date: string;
    location: string;
    isCompleted: boolean;
}

const mockTrackingData: { [key: string]: TrackingStatus[] } = {
    "default": [
        { status: "ยืนยันคำสั่งซื้อแล้ว", date: "18 ก.ค. 2024, 14:30 น.", location: "กรุงเทพมหานคร", isCompleted: true },
        { status: "พัสดุเข้าระบบขนส่ง", date: "18 ก.ค. 2024, 18:00 น.", location: "ศูนย์คัดแยกสินค้า, กรุงเทพฯ", isCompleted: true },
        { status: "พัสดุอยู่ระหว่างการขนส่ง", date: "19 ก.ค. 2024, 08:00 น.", location: "อยู่ระหว่างเดินทางไปที่จังหวัดปลายทาง", isCompleted: false },
        { status: "พัสดุถึงศูนย์คัดแยกปลายทาง", date: "", location: "", isCompleted: false },
        { status: "พนักงานกำลังนำส่งพัสดุ", date: "", location: "", isCompleted: false },
        { status: "นำจ่ายสำเร็จ", date: "", location: "", isCompleted: false },
    ]
}

export const TrackingPage: React.FC = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [trackingResult, setTrackingResult] = useState<TrackingStatus[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const handleTrackOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingNumber.trim()) {
            setError("กรุณากรอกหมายเลขพัสดุ");
            return;
        }
        setIsLoading(true);
        setTrackingResult(null);
        setError(null);
        
        // Simulate API call
        setTimeout(() => {
            // In a real app, you would fetch data based on the trackingNumber
            if (trackingNumber.toUpperCase().startsWith('TH')) {
                setTrackingResult(mockTrackingData.default);
            } else {
                setError("ไม่พบข้อมูลพัสดุหมายเลขนี้");
            }
            setIsLoading(false);
        }, 1500);
    }
    
    const StatusTimeline = ({ statuses }: { statuses: TrackingStatus[] }) => (
        <div className="mt-8">
            <ol className="relative border-l-2 border-orange-200">
                {statuses.map((item, index) => (
                    <li key={index} className="mb-10 ml-6">
                        <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white ${item.isCompleted ? 'bg-teal-500' : 'bg-gray-300'}`}>
                           {item.isCompleted ? <div className="w-5 h-5 text-white"><CheckCircleIcon /></div> : <div className="w-3 h-3 bg-white rounded-full"></div>}
                        </span>
                        <div className={`${item.isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                            <h3 className="flex items-center mb-1 text-lg font-semibold">{item.status}</h3>
                            {item.isCompleted && (
                                <>
                                    <time className="block mb-2 text-sm font-normal leading-none text-gray-500">{item.date}</time>
                                    <p className="text-base font-normal text-gray-600">{item.location}</p>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <div className="flex justify-center text-[#FF8C69] mb-4">
                    <TruckIcon />
                </div>
                <h1 className="text-4xl font-extrabold text-[#004D40] tracking-tight">ติดตามพัสดุ</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    กรอกหมายเลขพัสดุของคุณเพื่อตรวจสอบสถานะการจัดส่งล่าสุด
                </p>
            </div>
            
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-orange-200">
                <form onSubmit={handleTrackOrder} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={trackingNumber}
                        onChange={e => setTrackingNumber(e.target.value)}
                        placeholder="กรอกหมายเลขพัสดุที่นี่"
                        className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C69] focus:border-transparent transition"
                    />
                    <button type="submit" disabled={isLoading} className="bg-[#FF8C69] text-white p-3 rounded-lg hover:bg-[#ff7a55] transition disabled:bg-opacity-50 flex items-center justify-center shrink-0">
                         {isLoading ? (
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : <SearchIcon />}
                    </button>
                </form>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                
                {trackingResult && (
                    <StatusTimeline statuses={trackingResult} />
                )}
            </div>
        </div>
    );
};
