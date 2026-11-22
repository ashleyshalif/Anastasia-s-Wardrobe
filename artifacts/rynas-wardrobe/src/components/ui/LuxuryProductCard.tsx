"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Check } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/config/currency";
import { useStore } from "@/lib/store";

interface LuxuryProductCardProps {
  product: Product;
  featured?: boolean;
}

function LuxuryProductCardInternal({ product, featured = false }: LuxuryProductCardProps) {
  const router = useRouter();
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(product.color || "Oatmeal");
  const [showSizes, setShowSizes] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "M");
  const [isAdded, setIsAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const activeImage = hoveredImage || product.image || "/images/cardigan.png";

  const handleQuickAdd = (size: string) => {
    setSelectedSize(size);
    addToCart(product, size, selectedColor, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setShowSizes(false);
    }, 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, selectedSize, selectedColor, 1);
    router.push("/checkout");
  };

  return (
    <div className="group relative flex flex-col bg-[#FFFDFA] border border-[#E6E0D8] hover:border-[#713A48]/50 transition-all duration-300">
      {/* Top Image Showcase */}
      <div className="relative w-full aspect-[3/4] bg-[#F5F2EB] overflow-hidden">
        <Link href={`/product/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
            priority={featured}
          />
        </Link>

        {/* Top Left Editorial Tag */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="px-2.5 py-0.5 bg-[#FFFDFA]/95 backdrop-blur-xs text-[#713A48] text-[10px] font-medium tracking-[0.16em] uppercase border border-[#E6E0D8]">
              {product.badge}
            </span>
          </div>
        )}

        {/* Top Right Wishlist Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs border border-[#E6E0D8] flex items-center justify-center text-[#713A48] opacity-80 hover:opacity-100 transition-all cursor-pointer"
          aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              inWishlist ? "fill-[#713A48] text-[#713A48]" : "text-[#713A48]"
            }`}
          />
        </button>

        {/* Quick Size Drawer Overlay */}
        {showSizes && (
          <div className="absolute inset-x-0 bottom-0 z-20 bg-[#FFFDFA]/98 backdrop-blur-xs p-3.5 border-t border-[#E6E0D8] animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#713A48] uppercase tracking-wider mb-2">
              <span>Select Size</span>
              <button
                type="button"
                onClick={() => setShowSizes(false)}
                className="text-[#69615B] hover:text-[#302B28] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-center gap-2">
              {(product.sizes || ["XS", "S", "M", "L", "XL"]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleQuickAdd(sz)}
                  className="w-8 h-8 border border-[#D8CFC6] bg-white hover:border-[#713A48] hover:bg-[#FAF8F5] text-[#302B28] font-medium text-[11px] flex items-center justify-center transition-colors cursor-pointer"
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Details & Actions */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="text-[11px] tracking-wider uppercase text-[#8C827A] mb-1">
            {product.department} {product.fabric ? `· ${product.fabric}` : ""}
          </div>

          <h3 className="font-editorial text-[17px] sm:text-[18px] text-[#2C2623] leading-snug line-clamp-1 group-hover:text-[#713A48] transition-colors">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>

          <p className="text-[12px] text-[#69615B] line-clamp-1 mt-0.5">
            {product.color}
          </p>
        </div>

        {/* Color Swatches */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            {product.variants.slice(0, 4).map((variant, idx) => (
              <button
                key={idx}
                type="button"
                onMouseEnter={() => {
                  setSelectedColor(variant.color);
                  if (variant.images?.[0]?.url) {
                    setHoveredImage(variant.images[0].url);
                  }
                }}
                onMouseLeave={() => setHoveredImage(null)}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColor === variant.color
                    ? "border-[#713A48] scale-110 ring-1 ring-[#713A48]/60"
                    : "border-[#D8CFC6] opacity-80 hover:opacity-100"
                }`}
                style={{
                  backgroundColor:
                    variant.color.toLowerCase().includes("wine") || variant.color.toLowerCase().includes("burgundy")
                      ? "#713A48"
                      : variant.color.toLowerCase().includes("oat") || variant.color.toLowerCase().includes("cream")
                      ? "#EAE4D9"
                      : variant.color.toLowerCase().includes("black") || variant.color.toLowerCase().includes("midnight")
                      ? "#2C2623"
                      : "#C8B8A6",
                }}
                title={variant.color}
              />
            ))}
          </div>
        )}

        {/* Price & Actions */}
        <div className="pt-2.5 border-t border-[#F0EAE1] flex items-center justify-between gap-2">
          <div>
            <span className="font-mono text-[15px] sm:text-[16px] font-semibold text-[#2C2623]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-[12px] text-[#8C827A] line-through ml-1.5">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowSizes(true)}
              className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#713A48] text-[#713A48] hover:text-[#FAF8F5] border border-[#713A48]/30 hover:border-[#713A48] text-[11px] font-medium tracking-wider uppercase transition-colors cursor-pointer"
            >
              {isAdded ? (
                <span className="flex items-center gap-1 text-emerald-800">
                  <Check className="w-3 h-3" /> Added
                </span>
              ) : (
                "+ Quick Add"
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="px-3 py-1.5 bg-[#713A48] hover:bg-[#582B37] text-[#FAF8F5] text-[11px] font-medium tracking-wider uppercase transition-colors cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const LuxuryProductCard = React.memo(
  LuxuryProductCardInternal,
  (prevProps, nextProps) => {
    return (
      prevProps.featured === nextProps.featured &&
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.product.inStock === nextProps.product.inStock &&
      prevProps.product.image === nextProps.product.image &&
      prevProps.product.name === nextProps.product.name
    );
  }
);
