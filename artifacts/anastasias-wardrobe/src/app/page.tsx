import React from "react";
import { getProducts } from "@/lib/products";
import { SeasonalInvitation } from "@/components/home/SeasonalInvitation";
import { DepartmentDirectory } from "@/components/home/DepartmentDirectory";
import { NewArrivals } from "@/components/home/NewArrivals";
import { KnitwearStory } from "@/components/home/KnitwearStory";
import { CategoryIndex } from "@/components/home/CategoryIndex";
import { GiftShelf } from "@/components/home/GiftShelf";
import { AtelierStory } from "@/components/home/AtelierStory";
import { WardrobeLetters } from "@/components/home/WardrobeLetters";

export const metadata = {
  title: "Anastasia's Wardrobe | Thoughtfully Chosen Styles",
  description:
    "Thoughtfully chosen styles for every age, every day and every occasion. Curated clothing for Girls 2–12, Teens 13–17, and Women.",
};

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="w-full flex flex-col bg-[#F8F5EF]">
      {/* 1. Seasonal Invitation (Figma #28:27 / #28:170) */}
      <SeasonalInvitation />

      {/* 2. Department Directory (Figma #28:36 / #28:179) */}
      <DepartmentDirectory />

      {/* 3. New Arrivals (Figma #28:48 / #28:191) */}
      <NewArrivals products={products} />

      {/* 4. Knitwear Story (Figma #28:71 / #28:215) */}
      <KnitwearStory />

      {/* 5. Category Index (Figma #28:80 / #28:224) */}
      <CategoryIndex />

      {/* 6. Gift Shelf (Figma #28:102 / #28:246) */}
      <GiftShelf products={products} />

      {/* 7. Atelier Story (Figma #28:117 / #28:261) */}
      <AtelierStory />

      {/* 8. Wardrobe Letters Newsletter (Figma #28:124 / #28:268) */}
      <WardrobeLetters />
    </div>
  );
}
