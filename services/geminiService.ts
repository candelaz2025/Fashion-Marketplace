import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Content } from '@google/genai';
import type { Product, StyleIdea, ChatResponse } from '../types';

// Read API key from Vite env. Must be prefixed with VITE_ to be exposed to the client.
const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY as string | undefined;
if (!apiKey) {
    throw new Error("Missing VITE_GOOGLE_GENAI_API_KEY. Add it to your .env.local file.");
}

const ai = new GoogleGenAI({ apiKey });

const languageMap: { [key: string]: string } = {
    th: 'Thai',
    en: 'English',
    zh: 'Chinese',
};

// Helper function to format product details for prompts
const formatProductForPrompt = (p: Product) => {
    let priceInfo = `${p.price} THB`;
    if (p.salePrice) {
        priceInfo = `Original: ${p.price} THB, Sale: ${p.salePrice} THB`;
    }
    return `ID ${p.id}: ${p.name} (Category: ${p.category}, Seller: ${p.sellerName}, Price: ${priceInfo})`;
};


// Helper function to convert ArrayBuffer to base64 for browser environment
function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Helper to avoid CORS errors by proxying remote image URLs through a CORS-enabled image proxy
// This lets the browser fetch and read the image bytes to convert to base64.
const toCorsProxiedUrl = (originalUrl: string) => {
    // Using images.weserv.nl as a simple CORS image proxy
    // Docs: https://images.weserv.nl/
    // We force JPEG output to match expected mimeType where possible.
    return `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&output=jpg`;
};

// Helper function to fetch an image and convert it to a generative part
const urlToGenerativePart = async (url: string, mimeType: string) => {
    try {
        const proxied = toCorsProxiedUrl(url);
        const response = await fetch(proxied);
        if (!response.ok) {
            throw new Error(`Fetch failed (${response.status} ${response.statusText})`);
        }
        const buffer = await response.arrayBuffer();
        const base64 = arrayBufferToBase64(buffer);
        return {
            inlineData: {
                data: base64,
                mimeType,
            },
        };
    } catch (err: any) {
        console.error("Image fetch/convert failed:", err);
        throw new Error("ไม่สามารถดึงรูปภาพสินค้าจากแหล่งที่มาได้ (CORS). โปรดลองใหม่หรือใช้รูปจากแหล่งอื่น");
    }
};

export const getStyleIdeas = async (likedProducts: Product[], allProducts: Product[], language: string): Promise<StyleIdea> => {
    const targetLanguage = languageMap[language] || 'Thai';
    const likedProductList = likedProducts.map(p => `- ${p.name} (ID: ${p.id}) by ${p.sellerName}`).join('\n');
    const fullProductCatalog = allProducts.map(formatProductForPrompt).join('\n');

    const prompt = `A user on a second-hand fashion store has liked these items:\n${likedProductList}\n\nHere is the full product catalog:\n${fullProductCatalog}\n\nBased on the user's liked items, generate one creative style idea.
    1. Create a catchy title for the style in ${targetLanguage}.
    2. Write a short, inspiring description of the style in ${targetLanguage}.
    3. From the full catalog, select 3 to 5 product IDs that perfectly complete this look. The selected products MUST come from the provided catalog. Do not invent products. Return only their numeric IDs.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: `A catchy title for the style idea in ${targetLanguage}.` },
                    description: { type: Type.STRING, description: `A detailed description of the style in ${targetLanguage}.` },
                    suggestedProductIds: {
                        type: Type.ARRAY,
                        description: "An array of 3 to 5 numeric product IDs from the catalog.",
                        items: { type: Type.INTEGER }
                    }
                },
                required: ["title", "description", "suggestedProductIds"]
            },
        },
    });

    const jsonResponse = JSON.parse(response.text);

    const ideaProducts: Product[] = (jsonResponse.suggestedProductIds || [])
      .map((id: number) => allProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined); // Filter out any undefined results if an ID doesn't match

    return {
        title: jsonResponse.title,
        description: jsonResponse.description,
        products: ideaProducts,
    };
};

export const getOutfitForProduct = async (product: Product, allProducts: Product[], language: string): Promise<StyleIdea> => {
    const targetLanguage = languageMap[language] || 'Thai';
    const availableProducts = allProducts.filter(p => p.id !== product.id);
    const productCatalog = availableProducts.map(formatProductForPrompt).join('\n');

    const prompt = `You are an expert AI fashion stylist for 'StyleSwap', a second-hand clothing marketplace.
A user is interested in this item:
- ${formatProductForPrompt(product)}
- Description: ${product.description}

Your task is to create a complete and stylish outfit that features this item.
1. Give the outfit a creative and catchy name in ${targetLanguage}.
2. Write a short, engaging description for the outfit in ${targetLanguage}, explaining why the pieces work well together.
3. Select 2 to 4 additional items from the following catalog to complete the outfit. The original item is already part of the outfit, so don't select it again.
4. Return ONLY the numeric IDs of the additional items you selected.

Here is the product catalog you can choose from:
${productCatalog}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: `A catchy title for the style idea in ${targetLanguage}.` },
                    description: { type: Type.STRING, description: `A detailed description of the style in ${targetLanguage}.` },
                    suggestedProductIds: {
                        type: Type.ARRAY,
                        description: "An array of 2 to 4 numeric product IDs from the catalog.",
                        items: { type: Type.INTEGER }
                    }
                },
                required: ["title", "description", "suggestedProductIds"]
            },
        },
    });

    const jsonResponse = JSON.parse(response.text);

    const suggestedProducts: Product[] = (jsonResponse.suggestedProductIds || [])
      .map((id: number) => allProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);

    const finalProducts = [product, ...suggestedProducts];

    return {
        title: jsonResponse.title,
        description: jsonResponse.description,
        products: finalProducts,
    };
};


export const getAIChatResponse = async (history: Content[], message: string, allProducts: Product[], language: string): Promise<ChatResponse> => {
    const targetLanguage = languageMap[language] || 'Thai';
    const productCatalog = allProducts.map(formatProductForPrompt).join('\n');

    const systemInstructions: { [key: string]: string } = {
        th: `คุณคือผู้ช่วยช้อปปิ้ง AI ที่เป็นมิตรและช่วยเหลือดีสำหรับ 'StyleSwap' ซึ่งเป็นตลาดแฟชั่นมือสองออนไลน์
เป้าหมายของคุณคือช่วยให้ผู้ใช้ค้นพบสินค้าที่พวกเขาชื่นชอบ คุณสามารถแนะนำสินค้าที่กำลังลดราคาหรือสินค้าจากผู้ขายที่น่าสนใจได้
คุณสามารถเข้าถึงแคตตาล็อกสินค้าต่อไปนี้ได้ เมื่อผู้ใช้ขอคำแนะนำ คุณต้องเลือกสินค้าที่เกี่ยวข้องจากรายการนี้เท่านั้น
ห้ามสร้างสินค้าขึ้นมาเอง ใช้รหัสสินค้าจากรายการที่ให้มาเท่านั้น

การตอบกลับของคุณควรเป็นบทสนทนาและเป็นประโยชน์
เมื่อคุณแนะนำสินค้า คุณต้องใส่รหัสสินค้าในรูปแบบพิเศษที่ส่วนท้ายสุดของคำตอบ: [PRODUCTS: id1, id2, id3, ...]
ตัวอย่าง: "ฉันเจอตัวเลือกดีๆ มาให้ค่ะ! แจ็คเก็ตยีนส์ตัวนี้กำลังลดราคาอยู่พอดีเลย [PRODUCTS: 101, 105]"
หากไม่มีสินค้าที่ตรงกัน ให้บอกอย่างสุภาพและไม่ต้องใส่แท็ก [PRODUCTS: ...]

คุณต้องตอบเป็นภาษาไทยเท่านั้น

นี่คือแคตตาล็อกสินค้า:
${productCatalog}`,
        en: `You are a friendly and helpful AI shopping assistant for 'StyleSwap', an online marketplace for second-hand fashion.
Your goal is to help users find products they love. You can highlight items that are on sale or from interesting sellers.
You have access to the following product catalog. When a user asks for a recommendation, you MUST select relevant products from this list.
DO NOT invent products. Only use product IDs from the list provided.

Your responses should be conversational and helpful.
When you recommend products, you MUST include their IDs in a special format at the very end of your response: [PRODUCTS: id1, id2, id3, ...].
For example: "I found a few great options for you! This denim jacket is currently on sale. [PRODUCTS: 101, 105]"
If no products match, just say so politely and do not include the [PRODUCTS: ...] tag.

You MUST respond in English only.

Here is the product catalog:
${productCatalog}`,
        zh: `您是“StyleSwap”（一个在线二手时装市场）的友好且乐于助人的人工智能购物助手。
您的目标是帮助用户找到他们喜爱的产品。您可以重点推荐正在促销的商品或来自有趣卖家的商品。
您可以访问以下产品目录。当用户请求推荐时，您必须从此列表中选择相关产品。
请勿虚构产品。仅使用提供的列表中的产品ID。

您的回复应具有对话性且有帮助。
当您推荐产品时，您必须在回复的末尾以特殊格式包含其ID：[PRODUCTS: id1, id2, id3, ...]。
例如：“我为您找到了一些不错的选择！这件牛仔夹克目前正在打折。[PRODUCTS: 101, 105]”
如果没有匹配的产品，请礼貌地说明，不要包含 [PRODUCTS: ...] 标签。

您必须仅用中文回答。

这是产品目录：
${productCatalog}`,
    };
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        config: {
            systemInstruction: systemInstructions[language] || systemInstructions['th'],
        },
    });
    
    let text = response.text;
    const recommendedProducts: Product[] = [];
    
    const productMatch = text.match(/\[PRODUCTS: ([\d, ]+)\]/);
    if (productMatch && productMatch[1]) {
        const ids = productMatch[1].split(',').map(id => parseInt(id.trim(), 10));
        ids.forEach(id => {
            const product = allProducts.find(p => p.id === id);
            if (product) {
                recommendedProducts.push(product);
            }
        });
        // Remove the tag from the final text for display.
        text = text.replace(/\[PRODUCTS: ([\d, ]+)\]/, '').trim();
    }

    return {
        text: text,
        products: recommendedProducts,
    };
};

export const getAIStyleChatResponse = async (history: Content[], message: string, allProducts: Product[], language: string): Promise<ChatResponse> => {
    const targetLanguage = languageMap[language] || 'Thai';
    const productCatalog = allProducts.map(formatProductForPrompt).join('\n');

    const systemInstructions: { [key: string]: string } = {
        th: `คุณคือ AI Stylist อัจฉริยะและมีความคิดสร้างสรรค์สำหรับ 'StyleSwap' เป้าหมายของคุณคือการเป็นเพื่อนคู่คิดด้านแฟชั่นให้กับผู้ใช้
คุณต้องพูดคุยอย่างเป็นกันเอง ถามคำถามเพื่อทำความเข้าใจสไตล์, ความชอบ, และโอกาสที่ผู้ใช้จะไป เพื่อช่วยพวกเขาสร้างลุคที่สมบูรณ์แบบ
เมื่อคุณมั่นใจในคำแนะนำแล้ว ให้แนะนำสินค้าที่เกี่ยวข้องจากแคตตาล็อกเท่านั้น ห้ามสร้างสินค้าขึ้นมาเอง
เมื่อแนะนำสินค้า ให้ใส่รหัสสินค้าในรูปแบบพิเศษที่ท้ายสุดของคำตอบ: [PRODUCTS: id1, id2, ...]
คุณต้องตอบเป็นภาษาไทยเท่านั้น

แคตตาล็อกสินค้า:
${productCatalog}`,
        en: `You are an elite and creative AI Fashion Stylist for 'StyleSwap'. Your goal is to be the user's ultimate fashion confidante.
Be conversational, ask clarifying questions to understand their style, preferences, and the occasion they're dressing for to help them build the perfect look.
When you are confident in your recommendation, suggest relevant products ONLY from the catalog. DO NOT invent products.
When you recommend products, include their IDs in the special format at the very end: [PRODUCTS: id1, id2, ...].
You MUST respond in English only.

Product catalog:
${productCatalog}`,
        zh: `您是“StyleSwap”的顶尖创意AI时尚造型师。您的目标是成为用户最终的时尚知己。
进行对话，提出澄清问题，以了解他们的风格、偏好以及他们着装的场合，帮助他们打造完美的造型。
当您对推荐有信心时，仅从目录中推荐相关产品。请勿虚构产品。
当您推荐产品时，请在末尾以特殊格式包含其ID：[PRODUCTS: id1, id2, ...]。
您必须仅用中文回答。

产品目录：
${productCatalog}`,
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        config: {
            systemInstruction: systemInstructions[language] || systemInstructions['th'],
        },
    });
    
    let text = response.text;
    const recommendedProducts: Product[] = [];
    
    const productMatch = text.match(/\[PRODUCTS: ([\d, ]+)\]/);
    if (productMatch && productMatch[1]) {
        const ids = productMatch[1].split(',').map(id => parseInt(id.trim(), 10));
        ids.forEach(id => {
            const product = allProducts.find(p => p.id === id);
            if (product) {
                recommendedProducts.push(product);
            }
        });
        text = text.replace(/\[PRODUCTS: ([\d, ]+)\]/, '').trim();
    }

    return {
        text: text,
        products: recommendedProducts,
    };
};

export const generateVirtualTryOnImage = async (userImageBase64: string, productImageUrl: string, productName: string): Promise<string> => {
    const userImagePart = {
        inlineData: {
            mimeType: 'image/jpeg', // Assuming user uploads jpeg, could be made more robust
            data: userImageBase64,
        },
    };

    const productImagePart = await urlToGenerativePart(productImageUrl, 'image/jpeg');

    const prompt = `This is a virtual try-on task. The first image is the user. The second image is a clothing item: "${productName}". Please realistically place the clothing item from the second image onto the person in the first image. The background of the first image should be preserved as much as possible. The final image should look natural.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                userImagePart,
                productImagePart,
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("AI did not return an image.");
};
