"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";
import { useStore } from "@/lib/store";

interface GiftShelfProps {
  products: Product[];
}

export function GiftShelf({ products }: GiftShelfProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const giftItems = products.filter(
    (p) => p.category === "gifts" || p.price <= 3500
  ).slice(0, 2);

  return (
    <section className="w-full bg-[#F8F5EF] py-14 lg:py-20 border-b border-[#D8CFC6]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        {/* Section Header (Figma #28:103 / #28:247) */}
        <div className="mb-10 lg:mb-12">
          <span className="text-[11px] font-medium tracking-[0.18em] text-[#713A48] uppercase">
            WRAP A LITTLE THOUGHT
          </span>
          <h2 className="font-editorial text-[32px] sm:text-[38px] lg:text-[44px] text-[#302B28] leading-[1.2] mt-1 mb-2">
            The gift shelf
          </h2>
          <p className="text-[15px] text-[#69615B]">
            Under ₹3,500, easy to treasure. Add a handwritten gift note at the bag.
          </p>
        </div>

        {/* 2 Gift Items Grid (Figma #28:104 / #28:248) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mb-10 max-w-[900px]">
          {giftItems.map((product) => {
            const inWishlist = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="flex flex-col bg-[#FFFDFA] border border-[#D8CFC6] group relative"
              >
                <div className="relative w-full h-[340px] bg-[#EAE4D9] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 420px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Wishlist Heart */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 w-10 h-10 bg-[#FFFDFA]/90 backdrop-blur-xs flex items-center justify-center border border-[#D8CFC6] text-[#713A48] hover:bg-[#FFFDFA] transition-all cursor-pointer z-10"
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${inWishlist ? "fill-[#713A48] text-[#713A48]" : "text-[#713A48]"
                        }`}
                    />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <p className="text-[13px] text-[#69615B] mb-1">
                      {product.department}
                    </p>
                    <h3 className="font-editorial text-[20px] text-[#302B28] leading-[1.3]">
                      <Link href={`/product/${product.slug}`} className="hover:text-[#713A48] transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#D8CFC6] flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[16px] text-[#302B28]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[13px] text-[#69615B] line-through ml-2">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                      {product.saleNote && (
                        <span className="text-[12px] text-[#713A48] block mt-0.5">
                          {product.saleNote}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(product, product.sizes[0])}
                      className="text-[13px] font-medium text-[#713A48] hover:text-[#582B37] cursor-pointer"
                    >
                      Quick add +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary Button CTA (Figma #29:245) */}
        <div>
          <Link href="/category/gifts" className="btn-secondary text-[14px]">
            Find a thoughtful gift
          </Link>
        </div>
      </div>
    </section>
  );
}
