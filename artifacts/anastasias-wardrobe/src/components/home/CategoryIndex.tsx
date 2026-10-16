import React from "react";
import Link from "next/link";
import Image from "next/image";
import { isCategoryEnabled } from "@/config/catalog";

const routes = [
  {
    id: "dresses",
    title: "Dresses",
    subtitle: "Gatherings, gardens & ordinary Tuesdays",
    href: "/category/women?sub=dresses",
    image: "/images/editorial-garden.png",
    enabled: true,
  },
  {
    id: "clothing",
    title: "Everyday clothing",
    subtitle: "Tops, trousers, skirts & easy layers",
    href: "/category/women",
    image: "/images/editorial-everyday.png",
    enabled: true,
  },
  {
    id: "footwear",
    title: "Footwear",
    subtitle: "Mary Janes, boots & little steps",
    href: "/category/footwear",
    image: "/images/kids.png",
    enabled: isCategoryEnabled("footwear"),
  },
  {
    id: "accessories-bags",
    title: "Bags & accessories",
    subtitle: "The things you carry along",
    href: "/category/accessories-and-bags",
    image: "/images/women.png",
    enabled: isCategoryEnabled("accessories-bags"), // false — hidden automatically
  },
];

export function CategoryIndex() {
  const enabledRoutes = routes.filter((r) => r.enabled);

  return (
    <section className="w-full bg-[#F8F5EF] py-14 lg:py-20 border-b border-[#D8CFC6]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        {/* Section Heading (Figma #28:81 / #28:225) */}
        <div className="mb-10 lg:mb-14">
          <h2 className="font-editorial text-[32px] sm:text-[38px] lg:text-[44px] text-[#302B28] leading-[1.2]">
            The wardrobe, from head to toe
          </h2>
        </div>

        {/* Category Routes Grid — editorial photo cards (Figma #28:82 / #28:226) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {enabledRoutes.map((route) => (
            <Link
              key={route.id}
              href={route.href}
              className="group relative block overflow-hidden border border-[#D8CFC6] hover:border-[#713A48] transition-colors"
              style={{ minHeight: "340px" }}
            >
              {/* Background editorial photograph */}
              <div className="absolute inset-0">
                <Image
                  src={route.image}
                  alt={route.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center top",
                    transition: "transform 0.5s ease",
                  }}
                  className="group-hover:scale-105"
                />
                {/* Dark gradient overlay so text is readable */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(48,43,40,0.78) 0%, rgba(48,43,40,0.28) 55%, rgba(48,43,40,0.04) 100%)",
                  }}
                />
              </div>

              {/* Text overlay — anchored to bottom */}
              <div
                className="relative flex flex-col justify-end"
                style={{ minHeight: "340px", padding: "28px 24px" }}
              >
                <h3
                  className="font-editorial text-[#FFFDFA] leading-tight flex items-end justify-between"
                  style={{ fontSize: "24px" }}
                >
                  <span>{route.title}</span>
                  <span
                    className="text-[20px] transition-transform group-hover:translate-x-1.5 inline-block"
                    style={{ marginLeft: "8px" }}
                  >
                    →
                  </span>
                </h3>
                <p
                  className="text-[13px] leading-[1.45] mt-2"
                  style={{ color: "rgba(255,253,250,0.78)" }}
                >
                  {route.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
