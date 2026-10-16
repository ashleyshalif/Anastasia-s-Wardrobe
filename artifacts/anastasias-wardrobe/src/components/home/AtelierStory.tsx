import React from "react";
import Link from "next/link";
import Image from "next/image";

export function AtelierStory() {
  return (
    <section className="w-full bg-[#EAE4D9] py-14 lg:py-20 border-b border-[#D8CFC6]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Photography Image (Figma #28:118 / #28:262) */}
          <div className="w-full lg:w-1/2 relative h-[360px] sm:h-[440px] lg:h-[480px] overflow-hidden bg-[#D8CFC6] border border-[#D8CFC6]">
            <Image
              src="/images/boutique.png"
              alt="Anastasia's Atelier - Hand-selected fabrics and garments"
              fill
              sizes="(max-width: 1024px) 100vw, 650px"
              className="object-cover object-center"
            />
          </div>

          {/* Story Copy (Figma #28:119 / #28:263) */}
          <div className="w-full lg:w-1/2 flex flex-col items-start space-y-6">
            <span className="text-[11px] font-medium tracking-[0.18em] text-[#713A48] uppercase">
              A NOTE FROM ANASTASIA
            </span>

            <h2 className="font-editorial text-[36px] sm:text-[40px] lg:text-[46px] text-[#302B28] leading-[1.2]">
              A small edit.
              <br />
              <span className="italic">A very personal wardrobe.</span>
            </h2>

            <p className="text-[15px] text-[#302B28] leading-[1.65] max-w-[480px]">
              We think a wardrobe can be small and full of possibility. Our edit brings together wearable shapes, tactile fabrics and those unexpected little finds that feel like you.
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="text-[14px] font-medium text-[#713A48] hover:underline flex items-center gap-1.5"
              >
                <span>Read our wardrobe philosophy</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
