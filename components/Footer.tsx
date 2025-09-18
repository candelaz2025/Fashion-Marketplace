import React from 'react';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import { PinterestIcon } from './icons/PinterestIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';

export const Footer: React.FC = () => {
  const socials = [
    { name: 'Facebook', href: 'https://www.facebook.com/StyleSwapMarket', icon: <FacebookIcon /> },
    { name: 'Instagram', href: 'https://www.instagram.com/styleswap.market', icon: <InstagramIcon /> },
    { name: 'X (Twitter)', href: 'https://twitter.com/styleswap_ai', icon: <TwitterIcon /> },
    { name: 'TikTok', href: 'https://www.tiktok.com/@styleswap', icon: <TikTokIcon /> },
    { name: 'Pinterest', href: 'https://www.pinterest.com/styleswap', icon: <PinterestIcon /> },
    { name: 'YouTube', href: 'https://www.youtube.com/@styleswapofficial', icon: <YoutubeIcon /> },
  ];

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
            <div className="flex flex-wrap gap-3">
              {socials.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`StyleSwap on ${social.name}`}
                  className="text-gray-500 hover:text-[#FF8C69] transition-colors"
                >
                  <span className="sr-only">{social.name}</span>
                  <div className="p-2 bg-orange-50 rounded-full border border-orange-100 hover:bg-[#FF8C69] hover:text-white transition-colors">
                    {social.icon}
                  </div>
                </a>
              ))}
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