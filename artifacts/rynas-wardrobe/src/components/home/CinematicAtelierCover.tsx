"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, Sparkles, ArrowDown, ChevronDown } from "lucide-react";

export function CinematicAtelierCover() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const scrollToStorefront = () => {
    const el = document.getElementById("atelier-showcase");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-[88vh] sm:h-[94vh] max-h-[960px] bg-[#161311] overflow-hidden flex items-center justify-center border-b border-[#302B28] select-none">
      {/* Background Cinematic Runway Video */}
      <video
        ref={videoRef}
        src="/videos/10_products_runway_walking_reel.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 scale-102 transition-transform duration-1000 ease-out"
      />

      {/* Luxury Vignette & Moody Gradient Overlays */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center,_var(--tw-gradient-stops)] from-transparent via-[#161311]/60 to-[#161311]/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-transparent to-[#161311]/80" />

      {/* Gold & Champagne Hairline Frame (Inspired by Luxury Inspo) */}
      <div className="absolute inset-4 sm:inset-8 lg:inset-12 border border-[#C2A684]/30 pointer-events-none rounded-lg" />
      <div className="absolute inset-5 sm:inset-9 lg:inset-13 border border-[#C2A684]/15 pointer-events-none rounded-md" />

      {/* Main Center Editorial Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Atelier Crest & Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#302B28]/70 border border-[#C2A684]/40 text-[#EAE4D9] text-[11px] uppercase tracking-[0.22em] font-medium backdrop-blur-md mb-6 shadow-lg animate-in fade-in duration-700">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>Haute Couture Atelier · Festive Edition 2026</span>
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
        </div>

        {/* Master Brand Headline */}
        <h1
          className="font-editorial text-4xl sm:text-6xl lg:text-7xl text-[#FAF8F5] font-light tracking-wide leading-[1.08] mb-5 text-balance drop-shadow-md"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Anastasia&apos;s Wardrobe
        </h1>

        {/* Couture Subtitle */}
        <p className="text-[14px] sm:text-[17px] text-[#D8CFC6] max-w-2xl font-light leading-relaxed mb-8 tracking-wide">
          Curated Virgin Wool Silhouettes, Pure Silk Slips &amp; Hand-Finished 18K Fine Baroque Jewellery. Thoughtfully cut for celebration and everyday elegance.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={scrollToStorefront}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#FAF8F5] hover:bg-[#D4AF37] text-[#161311] hover:text-[#161311] font-medium text-[13px] tracking-[0.16em] uppercase rounded-full shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 hover:scale-102 cursor-pointer group"
          >
            <span>▶ Enter The Atelier</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#161311] transition-transform group-hover:translate-y-0.5" />
          </button>

          <Link
            href="/category/the-edits"
            className="w-full sm:w-auto px-7 py-3.5 bg-black/40 hover:bg-[#302B28]/80 text-[#FAF8F5] border border-[#C2A684]/50 hover:border-[#D4AF37] font-medium text-[13px] tracking-[0.16em] uppercase rounded-full backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>The Night Market Edit</span>
          </Link>
        </div>
      </div>

      {/* Floating Media Controls (Bottom Left & Right) */}
      <div className="absolute bottom-6 left-6 sm:left-14 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={togglePlay}
          className="p-2 rounded-full bg-[#302B28]/80 hover:bg-[#302B28] border border-[#C2A684]/30 text-[#FAF8F5] text-xs backdrop-blur-md transition-all cursor-pointer"
          title={isPlaying ? "Pause Runway Reel" : "Play Runway Reel"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          className="p-2 rounded-full bg-[#302B28]/80 hover:bg-[#302B28] border border-[#C2A684]/30 text-[#FAF8F5] text-xs backdrop-blur-md transition-all cursor-pointer"
          title={isMuted ? "Unmute Reel" : "Mute Reel"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        <span className="hidden sm:inline text-[11px] text-[#C2A684] font-mono tracking-wider pl-1">
          10 Products Runway Walk Reel
        </span>
      </div>

      {/* Scroll Down Indicator */}
      <button
        type="button"
        onClick={scrollToStorefront}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[#C2A684] hover:text-[#FAF8F5] transition-colors cursor-pointer group"
      >
        <span className="text-[10px] uppercase font-mono tracking-[0.2em]">Scroll to Discover</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#C2A684]" />
      </button>
    </section>
  );
}

