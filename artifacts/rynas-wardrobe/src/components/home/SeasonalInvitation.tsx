"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export function SeasonalInvitation() {
  return (
    <section
      style={{
        width: "100%",
        backgroundColor: "#F8F5EF",
        paddingTop: "64px",
        paddingBottom: "64px",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          paddingLeft: "48px",
          paddingRight: "48px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "56px",
        }}
        className="aw-hero-inner"
      >
        {/* Editorial Introduction */}
        <div
          style={{
            width: "440px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "24px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "#713A48",
              textTransform: "uppercase",
              fontFamily: "var(--font-inter)",
            }}
          >
            THE AUTUMN WARDROBE / NO. 01
          </span>

          <h1
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              fontSize: "54px",
              color: "#302B28",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Ordinary days.
            <br />
            <em>Favourite things.</em>
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "#302B28",
              lineHeight: 1.55,
              maxWidth: "400px",
              margin: 0,
            }}
          >
            A soft knit for the school run. A dress for the long lunch. Pieces to make a day feel like yours.
          </p>

          <Link href="/category/women" className="btn-primary">
            Step into the autumn edit
          </Link>

          <p style={{ fontSize: "13px", color: "#69615B", margin: 0 }}>
            For girls, teens &amp; women. Chosen with care.
          </p>
        </div>

        {/* Photography Image */}
        <div
          style={{
            flex: 1,
            position: "relative",
            height: "600px",
            overflow: "hidden",
            backgroundColor: "#EAE4D9",
            border: "1px solid #D8CFC6",
          }}
        >
          <Image
            src="/images/hero.png"
            alt="The Autumn Wardrobe Editorial – Autumn collection"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </div>

      {/* Mobile styles injected via a style tag */}
      <style>{`
        @media (max-width: 1023px) {
          .aw-hero-inner {
            flex-direction: column !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
            gap: 32px !important;
          }
          .aw-hero-inner > div:first-child {
            width: 100% !important;
          }
          .aw-hero-inner > div:last-child {
            height: 380px !important;
          }
        }
      `}</style>
    </section>
  );
}
