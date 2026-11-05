"use client";

import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-[#FFFDFA] border border-[#D8CFC6] overflow-hidden animate-pulse">
      {/* Image Skeleton with Shimmer */}
      <div className="relative w-full h-[360px] bg-[#EAE4D9] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F8F5EF]/60 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
      </div>

      {/* Details Skeleton */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          {/* Subtitle / Department */}
          <div className="h-3 w-24 bg-[#EAE4D9] rounded-xs" />
          {/* Title */}
          <div className="h-5 w-4/5 bg-[#EAE4D9] rounded-xs" />
          <div className="h-4 w-3/5 bg-[#EAE4D9] rounded-xs" />
        </div>

        {/* Pricing and Action Button */}
        <div className="pt-3 border-t border-[#EAE4D9] flex items-center justify-between">
          <div className="h-4 w-16 bg-[#EAE4D9] rounded-xs" />
          <div className="h-4 w-20 bg-[#EAE4D9] rounded-xs" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
