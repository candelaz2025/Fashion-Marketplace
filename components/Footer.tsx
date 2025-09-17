import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-orange-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-[#004D40] mb-4 text-lg">
                STYLE<span className="text-[#FF8C69]">SWAP</span>
            </h3>
            <p className="text-gray-600 text-sm">ตลาดแฟชั่นมือสองสำหรับคนรุ่นใหม่</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#004D40] mb-4">ช่วยเหลือ</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#FF8C69]">คำถามที่พบบ่อย</a></li>
              <li><a href="#" className="hover:text-[#FF8C69]">ติดต่อเรา</a></li>
              <li><a href="#" className="hover:text-[#FF8C69]">การจัดส่ง</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#004D40] mb-4">เกี่ยวกับเรา</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#FF8C69]">เรื่องราวของเรา</a></li>
              <li><a href="#" className="hover:text-[#FF8C69]">ร่วมงานกับเรา</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#004D40] mb-4">ติดตามเรา</h3>
            <div className="flex space-x-4">
              {/* Placeholder for social icons */}
              <a href="#" className="text-gray-500 hover:text-[#FF8C69]">FB</a>
              <a href="#" className="text-gray-500 hover:text-[#FF8C69]">IG</a>
              <a href="#" className="text-gray-500 hover:text-[#FF8C69]">TW</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-orange-100 pt-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Second-Chance Style. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};