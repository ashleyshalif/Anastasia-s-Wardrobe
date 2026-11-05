"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export function DepartmentDirectory() {
  const categoriesStrip = [
    { name: "Women's Edit", href: "/category/women", badge: "Core" },
    { name: "Teens 13–17", href: "/category/teens-13-17", badge: "Autumn" },
    { name: "Girls 2–12", href: "/category/girls-2-12", badge: "Smocked" },
    { name: "Fine Jewellery", href: "/category/jewellery", badge: "18k Vermeil" },
    { name: "Bags & Pouches", href: "/category/accessories-and-bags", badge: "Velvet & Nappa" },
    { name: "Night Market", href: "/category/the-edits", badge: "Occasion" },
    { name: "Merino Knitwear", href: "/category/women?dept=knitwear", badge: "Handmade" },
  ];

  const departments = [
    {
      title: "Women",
      tagline: "READY-TO-WEAR & COUTURE",
      subtitle: "Thoughtfully cut silhouettes for work, home, and celebration.",
      href: "/category/women",
      image: "/images/women.png",
      count: "8 Pieces",
    },
    {
      title: "Teens",
      tagline: "AGES 13–17",
      subtitle: "Finding personal style with easy shapes and brushed textures.",
      href: "/category/teens-13-17",
      image: "/images/teens.png",
      count: "4 Pieces",
    },
    {
      title: "Girls",
      tagline: "AGES 2–12",
      subtitle: "Soft organic cottons, artisan smocking, and room to grow.",
      href: "/category/girls-2-12",
      image: "/images/girls.png",
      count: "4 Pieces",
    },
    {
      title: "Fine Jewellery",
      tagline: "18K GOLD & BAROQUE PEARL",
      subtitle: "Organic freshwater drops, ribbed cuffs, and brushed signets.",
      href: "/category/jewellery",
      image: "/images/petal-drop-earrings.jpg",
      count: "4 Pieces",
    },
    {
      title: "Evening Bags & Gifts",
      tagline: "SILK VELVET & LEATHER",
      subtitle: "Wine velvet drawstring pouches, crossbodies, and cashmere wraps.",
      href: "/category/accessories-and-bags",
      image: "/images/keepsake-velvet-pouch.jpg",
      count: "4 Pieces",
    },
    {
      title: "The Night Market",
      tagline: "COUTURE OCCASION EDIT",
      subtitle: "Velvet slips, silk satin blouses, and tailored tuxedo jackets.",
      href: "/category/the-edits",
      image: "/images/editorial-everyday.png",
      count: "6 Pieces",
    },
  ];

  return (
    <section className="w-full bg-[#FAF8F5] border-t border-[#D8CFC6] py-14 sm:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* 1. Nykaa Fashion LUXE Quick Navigation Strip */}
        <div className="mb-12">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {categoriesStrip.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="shrink-0 px-4 py-2 bg-[#FFFDFA] hover:bg-[#713A48] text-[#302B28] hover:text-[#FAF8F5] border border-[#D8CFC6] hover:border-[#713A48] rounded-full text-[12px] font-medium tracking-wide flex items-center gap-2 transition-all duration-200 shadow-2xs group"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] font-mono text-[#8C827A] group-hover:text-white/80 border-l border-[#D8CFC6] group-hover:border-white/30 pl-2">
                  {cat.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 2. Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#D8CFC6]">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#713A48] uppercase block mb-2 font-mono">
              Atelier Directory · Department Curation
            </span>
            <h2 className="font-editorial text-[32px] sm:text-[44px] text-[#2C2623] leading-tight">
              Find your corner of the wardrobe
            </h2>
          </div>
          <p className="text-[14px] text-[#69615B] max-w-md">
            Six distinct ateliers, each curated with purpose. No mass production. Just garments chosen to endure.
          </p>
        </div>

        {/* 3. Nykaa Luxe / Urbanic Style 6-Card Department Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {departments.map((dept) => (
            <Link
              key={dept.title}
              href={dept.href}
              className="group flex flex-col bg-[#FFFDFA] border border-[#D8CFC6] hover:border-[#713A48] transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-md"
            >
              {/* Image Frame with Zoom */}
              <div className="relative w-full aspect-[4/3] bg-[#EAE4D9] overflow-hidden">
                <Image
                  src={dept.image}
                  alt={dept.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                />
                <div className="absolute top-3 left-3 bg-[#FFFDFA]/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-mono font-medium tracking-wider uppercase text-[#713A48] border border-[#D8CFC6]">
                  {dept.tagline}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#2C2623]/80 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-mono text-[#FAF8F5]">
                  {dept.count}
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-editorial text-[22px] sm:text-[24px] text-[#2C2623] group-hover:text-[#713A48] transition-colors flex items-center justify-between">
                    <span>{dept.title}</span>
                    <ArrowRight className="w-4 h-4 text-[#713A48] transition-transform duration-300 group-hover:translate-x-1" />
                  </h3>
                  <p className="text-[13px] text-[#69615B] leading-relaxed mt-1">
                    {dept.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-[11px] font-medium tracking-wider uppercase text-[#713A48]">
                  <span>Explore Department</span>
                  <span className="font-mono text-[#8C827A]">View All →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
