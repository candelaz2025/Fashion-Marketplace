import React, { useState, useRef, useEffect } from 'react';
import type { Product } from '../types';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { generateVirtualTryOnImage } from '../services/geminiService';
import { DownloadIcon } from './icons/DownloadIcon';
import { ShareIcon } from './icons/ShareIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface AIFittingRoomModalProps {
  product: Product;
  onClose: () => void;
  onGoBackToProduct: () => void;
}

export const AIFittingRoomModal: React.FC<AIFittingRoomModalProps> = ({ product, onClose, onGoBackToProduct }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
          setUserImage(reader.result as string);
          setGeneratedImage(null);
          setError(null);
      };
      reader.onerror = (error) => {
          console.error("Error reading file:", error);
          setError("Could not read uploaded file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!userImage) {
      setError("กรุณาอัปโหลดรูปภาพของคุณก่อนค่ะ");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const userImageBase64 = userImage.split(',')[1];
      if (!userImageBase64) {
          throw new Error("Invalid base64 image data");
      }
      const resultBase64 = await generateVirtualTryOnImage(userImageBase64, product.imageUrls[0], product.name);
      setGeneratedImage(`data:image/png;base64,${resultBase64}`);
    } catch (err) {
      console.error(err);
      setError("ขออภัยค่ะ ไม่สามารถสร้างรูปภาพได้ในขณะนี้ โปรดลองอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
      if (!generatedImage) return;
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `styleswap-try-on-${product.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!generatedImage) return;

    try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], `styleswap-try-on-${product.id}.png`, { type: blob.type });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'My StyleSwap Virtual Try-On!',
                text: `Check out this look I created with ${product.name} from StyleSwap!`,
            });
        } else {
            alert("Sharing files is not supported on your browser. You can download the image and share it manually.");
        }
    } catch (err) {
        console.error("Error sharing image:", err);
        // Don't show an error alert if the user cancels the share dialog
        if ((err as Error).name !== 'AbortError') {
            alert("Could not share the image. Please try downloading it instead.");
        }
    }
  };


  const InputPanel = () => (
    <div className="flex flex-col gap-4 h-full">
      <div>
          <h3 className="font-semibold text-lg text-[#004D40] mb-2">1. อัปโหลดรูปภาพของคุณ</h3>
          <div className="w-full h-64 border-2 border-dashed border-orange-300 rounded-lg flex items-center justify-center text-center p-0 bg-orange-50 relative overflow-hidden">
             {userImage ? (
                  <img src={userImage} alt="User" className="max-h-full max-w-full object-contain rounded-md" />
              ) : (
                  <p className="text-gray-500 p-4">แสดงตัวอย่างรูปภาพที่นี่</p>
              )}
          </div>
           <div className="flex gap-2 mt-2">
                <label className="w-full cursor-pointer text-center bg-white border border-[#004D40] text-[#004D40] text-sm font-semibold py-2 px-4 rounded-full hover:bg-teal-50 transition">
                    อัปโหลดไฟล์
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
           </div>
      </div>
      <div className="mt-4">
          <h3 className="font-semibold text-lg text-[#004D40] mb-2">2. สินค้าที่จะลอง</h3>
          <div className="flex items-center gap-4 p-2 border border-orange-200 rounded-lg bg-white">
              <img src={product.imageUrls[0]} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
              <div>
                  <p className="font-semibold text-[#004D40]">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
              </div>
          </div>
      </div>
       <button
          onClick={handleGenerate}
          disabled={isLoading || !userImage}
          className="w-full mt-auto bg-[#FF8C69] text-white font-bold py-3 px-6 rounded-full hover:bg-[#ff7a55] transition-transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? 'กำลังสร้างภาพ...' : 'เริ่มสร้างภาพด้วย AI'}
        </button>
    </div>
  );

  const ResultPanel = () => (
    <div className="flex flex-col h-full">
       <h3 className="font-semibold text-lg text-[#004D40] mb-2">3. ผลลัพธ์</h3>
       <div className="w-full flex-grow border-2 border-orange-200 rounded-lg flex items-center justify-center text-center p-4 bg-gray-50 min-h-[300px]">
          {isLoading && (
              <div className="flex flex-col items-center text-gray-600">
                  <svg className="animate-spin h-8 w-8 text-[#FF8C69] mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p>AI กำลังวาดภาพให้คุณ...</p>
                  <p className="text-sm text-gray-500">อาจใช้เวลาสักครู่นะคะ</p>
              </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && generatedImage && (
              <img src={generatedImage} alt="Generated result" className="max-h-full max-w-full object-contain rounded-md" />
          )}
          {!isLoading && !generatedImage && !error && (
              <p className="text-gray-500">ผลลัพธ์จะแสดงที่นี่</p>
          )}
       </div>
        {generatedImage && !isLoading && (
            <div className="w-full mt-4 flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-teal-700 text-teal-700 font-bold py-3 px-4 rounded-full hover:bg-teal-50 transition-all"
                >
                    <DownloadIcon />
                    บันทึกรูปภาพ
                </button>
                {navigator.share && (
                    <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-2 bg-teal-700 text-white font-bold py-3 px-4 rounded-full hover:bg-teal-800 transition-all"
                    >
                        <ShareIcon />
                        แชร์ให้เพื่อน
                    </button>
                )}
            </div>
        )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <header className="p-4 flex justify-between items-center border-b border-orange-200">
            <div className="flex items-center gap-4">
                <button onClick={onGoBackToProduct} title="Back to product" className="text-gray-500 hover:text-gray-800">
                    <ArrowLeftIcon />
                </button>
                <h2 className="text-xl font-bold text-[#004D40] flex items-center gap-2">
                    <SparklesIcon /> AI Fitting Room
                </h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XIcon /></button>
        </header>

        <div className="flex-grow p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputPanel />
          <ResultPanel />
        </div>
      </div>
    </div>
  );
};