import React, { useMemo, useState } from 'react';
import type { Product } from '../types';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { PinterestIcon } from './icons/PinterestIcon';
import { WhatsappIcon } from './icons/WhatsappIcon';
import { CopyIcon } from './icons/CopyIcon';
import { ShareIcon } from './icons/ShareIcon';
import { useLanguage } from './LanguageContext';

interface SocialShareButtonsProps {
    product: Product;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ product }) => {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    const { shareUrl, shareText, shareImage } = useMemo(() => {
        if (typeof window === 'undefined') {
            const fallbackUrl = `https://styleswap.market/product/${product.id}`;
            return {
                shareUrl: fallbackUrl,
                shareText: `${product.name} — ${product.description}`,
                shareImage: product.imageUrls[0],
            };
        }
        const params = new URLSearchParams(window.location.search);
        params.set('product', product.id.toString());
        const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        return {
            shareUrl: url,
            shareText: `${product.name} — ${product.description}`,
            shareImage: product.imageUrls[0],
        };
    }, [product]);

    const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    const handleCopyLink = async () => {
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else if (typeof window !== 'undefined') {
                // Fallback prompt for older browsers
                window.prompt('Copy this link', shareUrl);
            }
        } catch (error) {
            console.error('Failed to copy share link', error);
        }
    };

    const handleNativeShare = async () => {
        if (!canNativeShare) {
            handleCopyLink();
            return;
        }
        try {
            await navigator.share({
                title: product.name,
                text: shareText,
                url: shareUrl,
            });
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                console.error('Native share failed', err);
            }
        }
    };

    const shareLinks = [
        {
            name: t('product_share_facebook'),
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            icon: <FacebookIcon />,
        },
        {
            name: t('product_share_twitter'),
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
            icon: <TwitterIcon />,
        },
        {
            name: t('product_share_pinterest'),
            href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}&media=${encodeURIComponent(shareImage)}`,
            icon: <PinterestIcon />,
        },
        {
            name: t('product_share_whatsapp'),
            href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
            icon: <WhatsappIcon />,
        },
    ];

    return (
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-[#004D40] uppercase tracking-wide">
                        {t('product_share_title')}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {t('product_share_subtitle')}
                    </p>
                </div>
                {canNativeShare && (
                    <button
                        onClick={handleNativeShare}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF8C69] text-white text-sm font-semibold shadow-sm hover:bg-[#ff7a55] transition"
                    >
                        <ShareIcon />
                        {t('product_share_native')}
                    </button>
                )}
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {shareLinks.map(link => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-orange-100 text-[#004D40] hover:border-[#FF8C69] hover:text-[#FF8C69] transition"
                    >
                        <span className="text-[#FF8C69]">{link.icon}</span>
                        <span className="text-sm font-medium">{link.name}</span>
                    </a>
                ))}
            </div>
            <button
                onClick={handleCopyLink}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#004D40] text-[#004D40] font-semibold text-sm hover:bg-teal-50 transition"
            >
                <CopyIcon />
                {copied ? t('product_share_copied') : t('product_share_copy_link')}
            </button>
        </div>
    );
};
