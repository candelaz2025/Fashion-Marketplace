
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductGrid } from './components/ProductGrid';
import { CategoryFilter } from './components/CategoryFilter';
import { AIStylist } from './components/AIStylist';
import { StyleIdeaModal } from './components/StyleIdeaModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartModal } from './components/CartModal';
import { LoginModal } from './components/LoginModal';
import { FloatingAIChat } from './components/FloatingAIChat';
import { StyleHub } from './components/StyleHub';
import { TrackingPage } from './components/TrackingPage';
import { AdminPage } from './components/AdminPage';
import { OrderHistoryPage } from './components/OrderHistoryPage';
import { ProfilePage } from './components/ProfilePage';
import { WishlistPage } from './components/WishlistPage';
import { CheckoutModal } from './components/CheckoutModal';
import { UserProvider } from './components/UserContext';
import { CartProvider } from './components/CartContext';
import { OrderProvider } from './components/OrderContext';
import { AllUsersProvider } from './components/AllUsersContext';
import { LanguageProvider } from './components/LanguageContext';
import { useUser } from './components/UserContext';
import { getStyleIdeas } from './services/geminiService';
import { useLanguage } from './components/LanguageContext';
import { SellerProfilePage } from './components/SellerProfilePage';
import { MicrophoneIcon } from './components/icons/MicrophoneIcon';

import type { Product, StyleIdea, Seller, Review } from './types';

// FIX: Add interface for SpeechRecognition to resolve TypeScript error.
interface SpeechRecognition {
    continuous: boolean;
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    onstart: () => void;
    // Using `any` for event as the full type definition is complex and not required here.
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

const mockProducts: Product[] = [
    { id: 101, name: 'Vintage Denim Jacket', description: 'Classic 90s denim jacket, perfectly worn in.', price: 1200, category: 'Jackets', imageUrls: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/2229503/pexels-photo-2229503.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'RetroFinds', sellerId: 1, stock: 1, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 102, name: 'Floral Maxi Dress', description: 'Light and airy floral maxi dress, perfect for summer.', price: 850, salePrice: 650, category: 'Dresses', imageUrls: ['https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'BohoChic', sellerId: 2, stock: 1, sizes: ['S', 'M', 'L'] },
    { id: 103, name: 'Striped Linen Shirt', description: 'A timeless striped linen shirt for any casual occasion.', price: 600, category: 'Tops', imageUrls: ['https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'CasualCorner', sellerId: 3, stock: 1, sizes: ['M', 'L', 'XL'] },
    { id: 104, name: 'High-Waisted Trousers', description: 'Elegant high-waisted trousers in a neutral beige.', price: 900, category: 'Pants', imageUrls: ['https://images.pexels.com/photos/5439473/pexels-photo-5439473.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'ModernMuse', sellerId: 4, stock: 1, sizes: ['S', 'M', 'L'] },
    { id: 105, name: 'Leather Ankle Boots', description: 'Stylish and durable leather ankle boots.', price: 1800, category: 'Shoes', imageUrls: ['https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'SoleMates', sellerId: 5, stock: 1, sizes: ['38', '39', '40', '41'] },
    { id: 106, name: 'Graphic Tee', description: 'A cool band t-shirt from a 2005 tour.', price: 450, salePrice: 300, category: 'Tops', imageUrls: ['https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'RetroFinds', sellerId: 1, stock: 1, sizes: ['S', 'M', 'L'] },
    { id: 107, name: 'Pleated Midi Skirt', description: 'A beautiful pleated midi skirt in a shimmering fabric.', price: 750, category: 'Skirts', imageUrls: ['https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'ModernMuse', sellerId: 4, stock: 1, sizes: ['S', 'M'] },
    { id: 108, name: 'Knit Cardigan', description: 'Cozy oversized knit cardigan, perfect for chilly evenings.', price: 1100, category: 'Jackets', imageUrls: ['https://images.pexels.com/photos/3762883/pexels-photo-3762883.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'BohoChic', sellerId: 2, stock: 1, sizes: ['One Size'] },
    { id: 109, name: 'Honda Wave 110i (มือสอง)', description: 'รถมอเตอร์ไซค์ยอดนิยม ประหยัดน้ำมัน เหมาะกับการขับขี่ในเมือง สภาพดี เพิ่งเช็คระยะ', price: 25000, category: 'มอเตอร์ไซค์', imageUrls: ['https://images.pexels.com/photos/1715193/pexels-photo-1715193.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'CasualCorner', sellerId: 3, stock: 1 },
    { id: 110, name: 'Yamaha Grand Filano Hybrid', description: 'สกู๊ตเตอร์ไฮบริดดีไซน์ทันสมัย เลขไมล์น้อย เจ้าของเดียว', price: 48000, category: 'มอเตอร์ไซค์', imageUrls: ['https://images.pexels.com/photos/2360569/pexels-photo-2360569.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'ModernMuse', sellerId: 4, stock: 1 },
    { id: 111, name: 'GPX Drone 150', description: 'ดีไซน์สปอร์ต ดุดัน มีรอยขีดข่วนเล็กน้อยตามการใช้งาน แต่เครื่องยนต์สมบูรณ์', price: 55000, salePrice: 52000, category: 'มอเตอร์ไซค์', imageUrls: ['https://images.pexels.com/photos/2526105/pexels-photo-2526105.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'RetroFinds', sellerId: 1, stock: 1 },
    { id: 112, name: 'Kawasaki Z400 (มือสอง)', description: 'Naked bike ทรงพลัง เหมาะทั้งขับในเมืองและออกทริป ดูแลอย่างดี พร้อมท่อแต่ง', price: 150000, category: 'มอเตอร์ไซค์', imageUrls: ['https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'SoleMates', sellerId: 5, stock: 1 },
    { id: 113, name: 'Vespa Primavera 150', description: 'สกู๊ตเตอร์สไตล์อิตาลี สีขาวคลาสสิก ไอเท็มอมตะสำหรับผู้ขับขี่มีสไตล์', price: 95000, category: 'มอเตอร์ไซค์', imageUrls: ['https://images.pexels.com/photos/3263777/pexels-photo-3263777.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'BohoChic', sellerId: 2, stock: 1 },
    { id: 114, name: 'Honda Scoopy i (รุ่นเก่า)', description: 'รถป๊อปยอดนิยม ขับง่าย เหมาะสำหรับจ่ายตลาดหรือขับใกล้ๆ ใช้งานได้ปกติ มีร่องรอยตามกาลเวลา', price: 12000, category: 'มอเตอร์ไซค์', imageUrls: ['https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'RetroFinds', sellerId: 1, stock: 1 },
    { id: 115, name: 'Ducati Monster 821', description: 'Big bike สุดเท่จากอิตาลี สภาพนางฟ้า ไม่เคยล้ม ไม่เคยชน วิ่งน้อย ของแต่งครบ', price: 350000, category: 'มอเตอร์ไซค์', imageUrls: ['https://images.pexels.com/photos/2897641/pexels-photo-2897641.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'ModernMuse', sellerId: 4, stock: 1 },
    { id: 116, name: 'Classic Canvas Sneakers', description: 'Comfortable and timeless canvas sneakers for everyday wear.', price: 950, category: 'Shoes', imageUrls: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'CasualCorner', sellerId: 3, stock: 1, sizes: ['37', '38', '39', '40', '41', '42'] },
    { id: 117, name: 'Leather Sandals', description: 'Minimalist leather sandals for a chic summer look.', price: 700, salePrice: 550, category: 'Shoes', imageUrls: ['https://images.pexels.com/photos/1620769/pexels-photo-1620769.jpeg?auto=compress&cs=tinysrgb&w=600'], sellerName: 'BohoChic', sellerId: 2, stock: 1, sizes: ['36', '37', '38', '39'] },
];

const initialSellers: Seller[] = [
    { id: 1, name: 'RetroFinds', avatarUrl: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', rating: 4.5, reviewCount: 120, bio: 'Curating the best vintage and retro pieces from the 80s and 90s. Every item has a story!', joinedDate: '2023-03-15T00:00:00.000Z', reviews: [{ id: 1, reviewerName: 'Alice', rating: 5, comment: 'Amazing jacket, just as described! Fast shipping.', date: '2024-07-10T00:00:00.000Z' }] },
    { id: 2, name: 'BohoChic', avatarUrl: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', rating: 4.8, reviewCount: 250, bio: 'Flowy, free-spirited fashion for the modern bohemian. High-quality, sustainable choices.', joinedDate: '2022-11-01T00:00:00.000Z', reviews: [] },
    { id: 3, name: 'CasualCorner', avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', rating: 4.6, reviewCount: 88, bio: 'Your new favorite everyday essentials. Comfortable, stylish, and built to last.', joinedDate: '2023-08-20T00:00:00.000Z', reviews: [] },
    { id: 4, name: 'ModernMuse', avatarUrl: 'https://images.pexels.com/photos/3754293/pexels-photo-3754293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', rating: 4.9, reviewCount: 150, bio: 'Chic, minimalist, and modern pieces for the sophisticated wardrobe.', joinedDate: '2023-01-10T00:00:00.000Z', reviews: [] },
    { id: 5, name: 'SoleMates', avatarUrl: 'https://images.pexels.com/photos/1537671/pexels-photo-1537671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', rating: 4.7, reviewCount: 190, bio: 'The best second-hand footwear, from sneakers to stilettos.', joinedDate: '2022-09-05T00:00:00.000Z', reviews: [] },
];

const App: React.FC = () => (
    <LanguageProvider>
        <AllUsersProvider>
            <UserProvider>
                <CartProvider>
                    <OrderProvider>
                        <MainApp />
                    </OrderProvider>
                </CartProvider>
            </UserProvider>
        </AllUsersProvider>
    </LanguageProvider>
);

const MainApp: React.FC = () => {
    const [products] = useState<Product[]>(mockProducts);
    const [sellers, setSellers] = useState<Seller[]>(initialSellers);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('category_for_you');
    
    const [activePage, setActivePage] = useState('marketplace');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);

    const [styleIdea, setStyleIdea] = useState<StyleIdea | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isAIStylistLoading, setIsAIStylistLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    
    const { user, toggleWishlist } = useUser();
    const { language, t } = useLanguage();
    const likedProducts = products.filter(p => user?.wishlist.includes(p.id));

    useEffect(() => {
        const uniqueCategories = ['category_for_you', ...Array.from(new Set(products.map(p => p.category)))];
        setCategories(uniqueCategories);
    }, [products]);

    useEffect(() => {
        let tempProducts = [...products];

        // Filter by category
        if (selectedCategory === 'category_for_you') {
            tempProducts = [...products].sort(() => 0.5 - Math.random());
        } else {
            tempProducts = products.filter(p => p.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm.trim() !== '') {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            tempProducts = tempProducts.filter(p =>
                p.name.toLowerCase().includes(lowercasedSearchTerm) ||
                p.description.toLowerCase().includes(lowercasedSearchTerm) ||
                p.category.toLowerCase().includes(lowercasedSearchTerm) ||
                p.sellerName.toLowerCase().includes(lowercasedSearchTerm)
            );
        }

        setFilteredProducts(tempProducts);
    }, [selectedCategory, products, searchTerm]);

    const handleGetStyleIdeas = async () => {
        if (!likedProducts.length) return;
        setIsAIStylistLoading(true);
        try {
            const idea = await getStyleIdeas(likedProducts, products, language);
            setStyleIdea(idea);
        } catch (error) {
            console.error("Failed to get style ideas:", error);
        } finally {
            setIsAIStylistLoading(false);
        }
    };
    
    const handleNavigateToSeller = (sellerId: number) => {
        setSelectedSellerId(sellerId);
        setActivePage('sellerProfile');
        setSelectedProduct(null); // Close product modal if open
    };
    
    const handleAddReview = (sellerId: number, review: Omit<Review, 'id'>) => {
        setSellers(currentSellers =>
            currentSellers.map(seller => {
                if (seller.id === sellerId) {
                    const newReview = { ...review, id: Date.now() };
                    const updatedReviews = [newReview, ...seller.reviews];
                    const newAverageRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
                    return {
                        ...seller,
                        reviews: updatedReviews,
                        rating: parseFloat(newAverageRating.toFixed(1)),
                        reviewCount: updatedReviews.length,
                    };
                }
                return seller;
            })
        );
    };

    const handleVoiceSearch = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Sorry, your browser doesn't support voice search.");
            return;
        }

        if (!recognitionRef.current) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = language === 'th' ? 'th-TH' : (language === 'zh' ? 'cmn-Hans-CN' : 'en-US');
            recognitionRef.current.interimResults = false;
            recognitionRef.current.maxAlternatives = 1;

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onresult = (event) => setSearchTerm(event.results[0][0].transcript);
            recognitionRef.current.onerror = (event) => console.error('Voice recognition error:', event.error);
            recognitionRef.current.onend = () => setIsListening(false);
        }
        
        const recognition = recognitionRef.current;
        
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };
    
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language === 'th' ? 'th-TH' : (language === 'zh' ? 'cmn-Hans-CN' : 'en-US');
        }
    }, [language]);


    const renderPage = () => {
        switch(activePage) {
            case 'stylehub':
                return <StyleHub allProducts={products} onProductClick={setSelectedProduct} />;
            case 'tracking':
                return <TrackingPage />;
            case 'admin':
                return <AdminPage />;
            case 'history':
                return <OrderHistoryPage onNavigate={setActivePage} />;
            case 'profile':
                return <ProfilePage />;
            case 'wishlist':
                return <WishlistPage allProducts={products} onProductClick={setSelectedProduct} onSellerClick={handleNavigateToSeller} />;
            case 'sellerProfile': {
                const seller = sellers.find(s => s.id === selectedSellerId);
                if (!seller) return <div>Seller not found!</div>;
                const sellerProducts = products.filter(p => p.sellerId === selectedSellerId);
                return <SellerProfilePage seller={seller} products={sellerProducts} onProductClick={setSelectedProduct} onAddReview={handleAddReview} onNavigateToSeller={handleNavigateToSeller} />;
            }
            case 'marketplace':
            default:
                return (
                    <>
                        <AIStylist 
                            onGetStyleIdeas={handleGetStyleIdeas} 
                            isLoading={isAIStylistLoading}
                            hasLikedItems={likedProducts.length > 0}
                        />

                        <div className="relative max-w-2xl mx-auto mb-8">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('search_placeholder')}
                                className="w-full pl-5 pr-16 py-4 bg-white text-lg text-gray-800 border-2 border-orange-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C69]"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <button
                                    onClick={handleVoiceSearch}
                                    className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-gray-500 hover:bg-gray-100'}`}
                                    title="Search with voice"
                                >
                                    <MicrophoneIcon />
                                </button>
                            </div>
                        </div>

                        <CategoryFilter 
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                        <ProductGrid
                            products={filteredProducts}
                            onProductClick={setSelectedProduct}
                            wishlist={user?.wishlist || []}
                            onToggleWishlist={toggleWishlist}
                            onSellerClick={handleNavigateToSeller}
                        />
                    </>
                );
        }
    }
    
    const handleNavigation = (page: string) => {
        setActivePage(page);
        setSelectedProduct(null);
        setStyleIdea(null);
        setIsCartOpen(false);
        setIsUserModalOpen(false);
        setIsCheckoutOpen(false);
        setSelectedSellerId(null);
    }
    
    const handleCheckoutSuccess = () => {
        setIsCheckoutOpen(false);
        setActivePage('history');
    }

    return (
        <div className="bg-[#FFF8F5] min-h-screen font-sans">
            <Header 
                onCartClick={() => setIsCartOpen(true)}
                onUserClick={() => setIsUserModalOpen(true)}
                onNavigate={handleNavigation}
            />
            <main className="container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            <Footer />
            <FloatingAIChat allProducts={products} onProductClick={setSelectedProduct} />
            
            {styleIdea && (
                <StyleIdeaModal 
                    idea={styleIdea} 
                    onClose={() => setStyleIdea(null)}
                    onProductClick={(p) => { setStyleIdea(null); setSelectedProduct(p); }}
                    wishlist={user?.wishlist || []}
                    onToggleWishlist={toggleWishlist}
                    onSellerClick={handleNavigateToSeller}
                />
            )}
            {selectedProduct && (
                <ProductDetailModal 
                    product={selectedProduct}
                    allProducts={products}
                    onClose={() => setSelectedProduct(null)} 
                    onProductClick={(p) => setSelectedProduct(p)}
                    onSellerClick={handleNavigateToSeller}
                />
            )}
            {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} onLoginRequest={() => { setIsCartOpen(false); setIsUserModalOpen(true); }} onCheckoutRequest={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />}
            {isUserModalOpen && <LoginModal onClose={() => setIsUserModalOpen(false)} />}
            {isCheckoutOpen && <CheckoutModal onClose={() => setIsCheckoutOpen(false)} onPurchaseSuccess={handleCheckoutSuccess} />}
        </div>
    );
};

export default App;