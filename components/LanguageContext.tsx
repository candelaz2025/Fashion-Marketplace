import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

const translations = {
    en: {
        app_title_part1: 'STYLE',
        app_title_part2: 'SWAP',
        nav_marketplace: 'Marketplace',
        nav_style_hub: 'AI Stylist Chat',
        nav_tracking: 'Track Order',
        nav_admin: 'Admin Panel',
        header_dropdown_profile: 'My Profile',
        header_dropdown_wishlist: 'Wishlist',
        header_dropdown_orders: 'Order History',
        member_hub_logout: 'Logout',
        sale_badge: 'SALE',
        seller_label: 'Seller',
        thb: 'THB',
        product_grid_not_found: 'No products found.',
        category_for_you: 'For You',
        style_hub_welcome: 'Hello! I am your AI Stylist. How can I help you create the perfect look today?',
        style_hub_title: 'AI Stylist Chat',
        style_hub_placeholder: 'Describe your style or ask for ideas...',
        error_generic: 'An error occurred. Please try again later.',
        order_history_title: 'Order History',
        order_history_subtitle: 'Here you can see all your past orders.',
        order_history_points_title: 'Points',
        order_history_no_orders: 'You have no orders yet.',
        order_history_no_orders_subtitle: 'Start shopping to see your orders here!',
        order_history_shop_now: 'Shop Now',
        order_card_order_number: 'Order No.',
        order_card_order_date: 'Date',
        order_card_total: 'Total',
        order_history_copy: 'Copy',
        order_history_copied: 'Copied!',
        profile_page_title: 'My Profile',
        profile_save_success: 'Profile saved successfully!',
        profile_facebook_success: 'Connected to Facebook! You earned 50 points!',
        profile_connecting_facebook: 'Connecting...',
        profile_facebook_connected: 'Connected to Facebook',
        profile_connect_facebook: 'Connect with Facebook',
        profile_get_points: 'Connect and get 50 bonus points!',
        profile_edit_info: 'Edit Information',
        profile_address: 'Default Shipping Address',
        profile_save_changes: 'Save',
        admin_table_name: 'Name',
        admin_table_email: 'Email',
        wishlist_page_title: 'My Wishlist',
        wishlist_page_subtitle: 'Your favorite items are saved here.',
        wishlist_empty_title: 'Your wishlist is empty',
        wishlist_empty_subtitle: 'Add items you love to your wishlist by clicking the heart icon!',
        seller_profile_title: "Seller's Profile",
        seller_sales_history: 'Sales History',
        seller_reviews: 'Reviews from Buyers',
        seller_member_since: 'Member since',
        seller_leave_review: 'Leave a Review',
        seller_your_rating: 'Your Rating:',
        seller_your_comment: 'Share your experience...',
        seller_submit_review: 'Submit Review',
        seller_no_reviews: 'No reviews yet. Be the first to leave one!',
        search_placeholder: 'Search for items, brands, or sellers...'
    },
    th: {
        app_title_part1: 'STYLE',
        app_title_part2: 'SWAP',
        nav_marketplace: 'มาร์เก็ตเพลส',
        nav_style_hub: 'AI Stylist Chat ผู้ช่วยอัจฉริยะ',
        nav_tracking: 'ติดตามพัสดุ',
        nav_admin: 'แผงควบคุมแอดมิน',
        header_dropdown_profile: 'โปรไฟล์ของฉัน',
        header_dropdown_wishlist: 'รายการโปรด',
        header_dropdown_orders: 'ประวัติการสั่งซื้อ',
        member_hub_logout: 'ออกจากระบบ',
        sale_badge: 'ลดราคา',
        seller_label: 'ผู้ขาย',
        thb: 'บาท',
        product_grid_not_found: 'ไม่พบสินค้า',
        category_for_you: 'สำหรับคุณ',
        style_hub_welcome: 'สวัสดีค่ะ! ฉันคือ AI Stylist คู่ใจของคุณ วันนี้อยากให้ช่วยสร้างลุคแบบไหนดีคะ?',
        style_hub_title: 'AI Stylist Chat ผู้ช่วยอัจฉริยะ',
        style_hub_placeholder: 'อธิบายสไตล์ของคุณ หรือถามหาไอเดียได้เลย...',
        error_generic: 'เกิดข้อผิดพลาด โปรดลองอีกครั้งในภายหลัง',
        order_history_title: 'ประวัติการสั่งซื้อ',
        order_history_subtitle: 'คุณสามารถดูรายการสั่งซื้อทั้งหมดของคุณได้ที่นี่',
        order_history_points_title: 'คะแนน',
        order_history_no_orders: 'คุณยังไม่มีรายการสั่งซื้อ',
        order_history_no_orders_subtitle: 'เริ่มช้อปปิ้งเพื่อดูประวัติการสั่งซื้อของคุณที่นี่!',
        order_history_shop_now: 'เลือกซื้อสินค้าเลย',
        order_card_order_number: 'หมายเลขคำสั่งซื้อ',
        order_card_order_date: 'วันที่',
        order_card_total: 'ยอดรวม',
        order_history_copy: 'คัดลอก',
        order_history_copied: 'คัดลอกแล้ว!',
        profile_page_title: 'โปรไฟล์ของฉัน',
        profile_save_success: 'บันทึกโปรไฟล์สำเร็จ!',
        profile_facebook_success: 'เชื่อมต่อกับ Facebook สำเร็จ! คุณได้รับ 50 คะแนน!',
        profile_connecting_facebook: 'กำลังเชื่อมต่อ...',
        profile_facebook_connected: 'เชื่อมต่อกับ Facebook แล้ว',
        profile_connect_facebook: 'เชื่อมต่อกับ Facebook',
        profile_get_points: 'เชื่อมต่อเพื่อรับ 50 คะแนนโบนัส!',
        profile_edit_info: 'แก้ไขข้อมูล',
        profile_address: 'ที่อยู่สำหรับจัดส่งเริ่มต้น',
        profile_save_changes: 'บันทึก',
        admin_table_name: 'ชื่อ',
        admin_table_email: 'อีเมล',
        wishlist_page_title: 'รายการโปรดของฉัน',
        wishlist_page_subtitle: 'สินค้าที่คุณชื่นชอบถูกบันทึกไว้ที่นี่',
        wishlist_empty_title: 'รายการโปรดของคุณว่างเปล่า',
        wishlist_empty_subtitle: 'เพิ่มสินค้าที่คุณชอบเข้ารายการโปรดโดยการกดที่ไอคอนรูปหัวใจ!',
        seller_profile_title: 'โปรไฟล์ผู้ขาย',
        seller_sales_history: 'ประวัติการขาย',
        seller_reviews: 'รีวิวจากผู้ซื้อ',
        seller_member_since: 'เป็นสมาชิกตั้งแต่',
        seller_leave_review: 'เขียนรีวิว',
        seller_your_rating: 'คะแนนของคุณ:',
        seller_your_comment: 'แบ่งปันประสบการณ์ของคุณ...',
        seller_submit_review: 'ส่งรีวิว',
        seller_no_reviews: 'ยังไม่มีรีวิว เป็นคนแรกที่รีวิวเลย!',
        search_placeholder: 'ค้นหาสินค้า, แบรนด์, หรือผู้ขาย...'
    },
    zh: {
        app_title_part1: '风格',
        app_title_part2: '交换',
        nav_marketplace: '市场',
        nav_style_hub: 'AI 造型师聊天',
        nav_tracking: '追踪订单',
        nav_admin: '管理面板',
        header_dropdown_profile: '我的个人资料',
        header_dropdown_wishlist: '愿望清单',
        header_dropdown_orders: '订单历史',
        member_hub_logout: '登出',
        sale_badge: '促销',
        seller_label: '卖家',
        thb: '泰铢',
        product_grid_not_found: '未找到产品。',
        category_for_you: '为你推荐',
        style_hub_welcome: '您好！我是您的AI造型师。今天我能如何帮您打造完美造型？',
        style_hub_title: 'AI 造型师聊天',
        style_hub_placeholder: '描述您的风格或寻求想法...',
        error_generic: '发生错误。请稍后再试。',
        order_history_title: '订单历史',
        order_history_subtitle: '您可以在这里查看您过去的所有订单。',
        order_history_points_title: '积分',
        order_history_no_orders: '您还没有订单。',
        order_history_no_orders_subtitle: '开始购物以在此处查看您的订单！',
        order_history_shop_now: '立即购物',
        order_card_order_number: '订单号',
        order_card_order_date: '日期',
        order_card_total: '总计',
        order_history_copy: '复制',
        order_history_copied: '已复制!',
        profile_page_title: '我的个人资料',
        profile_save_success: '个人资料保存成功！',
        profile_facebook_success: '已连接到 Facebook！您获得了 50 积分！',
        profile_connecting_facebook: '连接中...',
        profile_facebook_connected: '已连接到 Facebook',
        profile_connect_facebook: '使用 Facebook 连接',
        profile_get_points: '连接并获得 50 奖励积分！',
        profile_edit_info: '编辑信息',
        profile_address: '默认送货地址',
        profile_save_changes: '保存',
        admin_table_name: '姓名',
        admin_table_email: '电子邮件',
        wishlist_page_title: '我的愿望清单',
        wishlist_page_subtitle: '您最喜欢的商品都保存在这里。',
        wishlist_empty_title: '您的愿-望清单是空的',
        wishlist_empty_subtitle: '通过点击心形图标将您喜爱的商品添加到您的愿望清单！',
        seller_profile_title: '卖家资料',
        seller_sales_history: '销售历史',
        seller_reviews: '买家评论',
        seller_member_since: '会员始于',
        seller_leave_review: '发表评论',
        seller_your_rating: '您的评分：',
        seller_your_comment: '分享您的经验...',
        seller_submit_review: '提交评论',
        seller_no_reviews: '暂无评论。快来成为第一个评论的人吧！',
        search_placeholder: '搜索商品、品牌或卖家...'
    }
};

type Language = 'en' | 'th' | 'zh';
type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('th');

  const t = useCallback((key: TranslationKey): string => {
    const langDict = translations[language] || translations['en'];
    return langDict[key] || translations['en'][key];
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
