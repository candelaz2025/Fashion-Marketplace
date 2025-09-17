import type { Content } from '@google/genai';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  imageUrls: string[];
  sellerName: string;
  sellerId: number;
  stock: number;
  sizes?: string[];
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  selectedSize?: string;
}

export interface ShippingInfo {
    name: string;
    email: string;
    address: string;
    province: string;
    country: string;
    postalCode: string;
    phone: string;
    carrier: string;
}

export interface User {
  name: string;
  email: string;
  points: number;
  role: 'admin' | 'customer';
  registeredAt: string;
  wishlist: number[];
  avatarUrl?: string;
  shippingAddress?: ShippingInfo;
  facebookConnected: boolean;
  shirtSize?: string;
  pantsSize?: string;
  shoeSize?: string;
}

export interface StyleIdea {
  title: string;
  description: string;
  products: Product[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  products?: Product[];
  isTyping?: boolean;
}

export interface ChatResponse {
    text: string;
    products: Product[];
}

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    totalAmount: number;
    shippingInfo: ShippingInfo;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export type GeminiChatHistory = Content[];

export interface Review {
    id: number;
    reviewerName: string;
    reviewerAvatarUrl?: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Seller {
    id: number;
    name: string;
    avatarUrl: string;
    rating: number;
    reviewCount: number;
    bio: string;
    joinedDate: string;
    reviews: Review[];
}