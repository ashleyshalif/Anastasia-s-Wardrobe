import React from "react";
import Link from "next/link";
import Image from "next/image";

export function KnitwearStory() {
  return (
    <section className="w-full bg-[#EAE4D9] py-14 lg:py-20 border-t border-b border-[#D8CFC6]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Photography Image (Figma #28:72 / #28:216) */}
          <div className="w-full lg:w-1/2 relative h-[360px] sm:h-[460px] lg:h-[580px] overflow-hidden bg-[#D8CFC6] border border-[#D8CFC6]">
            <Image
              src="/images/cardigan.png"
              alt="The Soft Hours - knitwear collection"
              fill
              sizes="(max-width: 1024px) 100vw, 650px"
              className="object-cover object-center"
            />
          </div>

          {/* Knitwear Story Copy (Figma #28:73 / #28:217) */}
          <div className="w-full lg:w-1/2 flex flex-col items-start space-y-6">
            <span className="text-[11px] font-medium tracking-[0.18em] text-[#713A48] uppercase">
              THE SOFT HOURS
            </span>

            <h2 className="font-editorial text-[36px] sm:text-[44px] lg:text-[52px] text-[#302B28] leading-[1.2]">
              For windows open,
              <br />
              <span className="italic">and sleeves pulled long.</span>
            </h2>

            <p className="text-[15px] text-[#302B28] leading-[1.6] max-w-[480px]">
              Cardigans, cosy sweaters and winter layers for the in-between days. Begin with a knit you’ll reach for without thinking.
            </p>

            <div className="pt-2">
              <Link
                href="/category/women?sub=knitwear"
                className="btn-secondary bg-[#F8F5EF]"
              >
                Explore sweaters & winter wear
              </Link>
            </div>

            <p className="text-[13px] text-[#69615B]">
              A note on layering · Pair oat with rosewood.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
