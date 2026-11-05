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
import { FestiveDiwaliPrivilege } from "@/components/festive/FestiveDiwaliPrivilege";

export const metadata = {
  title: "Ryna's Wardrobe | Thoughtfully Chosen Ready-to-Wear & Atelier Couture",
  description:
    "Thoughtfully chosen styles for every age, every day and every occasion. Curated clothing for Girls 2–12, Teens 13–17, and Women.",
};

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="w-full flex flex-col bg-[#FAF8F5] relative">
      {/* Festive Diwali Privilege Modal */}
      <FestiveDiwaliPrivilege />

      {/* 1. Seasonal Hero Invitation */}
      <SeasonalInvitation />

      {/* 2. Department Directory & Quick Luxe Nav Strip */}
      <DepartmentDirectory />

      {/* 3. New Arrivals Edit */}
      <NewArrivals products={products} />

      {/* 4. Knitwear Story Editorial */}
      <KnitwearStory />

      {/* 5. Category Index */}
      <CategoryIndex />

      {/* 6. Curated Gift Selection */}
      <GiftShelf products={products} />

      {/* 7. Heritage & Craft Story */}
      <AtelierStory />

      {/* 8. Wardrobe Letters */}
      <WardrobeLetters />
    </div>
  );
}
