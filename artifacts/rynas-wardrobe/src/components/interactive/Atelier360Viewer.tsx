"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  RotateCcw,
  Play,
  Pause,
  Compass,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Film,
} from "lucide-react";
import { formatPrice } from "@/config/currency";
import { useStore } from "@/lib/store";

export interface OrbitAngle {
  degree: number;
  label: string;
  sublabel: string;
  image: string;
}

export interface Atelier360ViewerProps {
  productName: string;
  price?: number;
  category?: string;
  angles?: OrbitAngle[];
  videoUrl?: string;
  initialAngle?: number;
  onAddToCart?: () => void;
  showBuyBar?: boolean;
}

export function Atelier360Viewer({
  productName = "Atelier Collection Piece",
  price = 8990,
  category = "Women's Atelier Collection",
  angles,
  videoUrl,
  initialAngle = 0,
  onAddToCart,
  showBuyBar = true,
}: Atelier360ViewerProps) {
  const [videoError, setVideoError] = useState(false);
  // If videoUrl is provided and valid, run in high-res video 360 turntable mode
  const isVideoMode = !!videoUrl && !videoError;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [videoProgress, setVideoProgress] = useState(0); // 0 to 1

  const startXRef = useRef<number>(0);
  const startIndexRef = useRef<number>(0);
  const startProgressRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeAngles = angles && angles.length > 0 ? angles : [];
  const currentAngle = activeAngles[currentIndex] || activeAngles[0] || {
    degree: 0,
    label: "360° Studio Turntable",
    sublabel: "Interactive 360 degree orbit",
    image: "",
  };

  // Video time update listener
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideoMode) return;

    const onTimeUpdate = () => {
      if (video.duration) {
        setVideoProgress(video.currentTime / video.duration);
      }
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [isVideoMode]);

  // Video auto-play toggle
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideoMode) return;

    if (isAutoPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isAutoPlaying, isVideoMode]);

  // Preload all angle images for instantaneous, 0ms rotation
  useEffect(() => {
    activeAngles.forEach((a) => {
      if (a.image && typeof window !== "undefined") {
        const img = new window.Image();
        img.src = a.image;
      }
    });
  }, [activeAngles]);

  // Photo Auto-orbit loop (smooth 450ms per perspective)
  useEffect(() => {
    if (isVideoMode || !isAutoPlaying || activeAngles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAngles.length);
    }, 450);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isVideoMode, activeAngles.length]);

  // Pointer down (mouse / touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    startXRef.current = e.clientX;

    if (isVideoMode && videoRef.current) {
      videoRef.current.pause();
      startProgressRef.current = videoProgress;
    } else {
      startIndexRef.current = currentIndex;
    }
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {}
  };

  // Pointer move (continuous smooth scrubbing)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - startXRef.current;

      if (isVideoMode && videoRef.current && videoRef.current.duration) {
        const containerW = containerRef.current?.offsetWidth || 600;
        const progressDelta = -deltaX / containerW;
        let newProgress = (startProgressRef.current + progressDelta) % 1;
        if (newProgress < 0) newProgress += 1;
        videoRef.current.currentTime = newProgress * videoRef.current.duration;
        setVideoProgress(newProgress);
      } else if (activeAngles.length > 0) {
        const stepSensitivity = 22; // 22px of horizontal drag moves to next angle
        const steps = Math.trunc(deltaX / stepSensitivity);
        if (steps !== 0) {
          setCurrentIndex((prev) => {
            let next = (prev - steps) % activeAngles.length;
            if (next < 0) next += activeAngles.length;
            return next;
          });
          startXRef.current = e.clientX;
        }
      }
    } else if (isZoomed && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    if (isVideoMode && videoRef.current && videoRef.current.duration) {
      let nextTime = videoRef.current.currentTime - 0.75;
      if (nextTime < 0) nextTime += videoRef.current.duration;
      videoRef.current.currentTime = nextTime;
    } else if (activeAngles.length > 0) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activeAngles.length - 1));
    }
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    if (isVideoMode && videoRef.current && videoRef.current.duration) {
      let nextTime = videoRef.current.currentTime + 0.75;
      if (nextTime > videoRef.current.duration) nextTime -= videoRef.current.duration;
      videoRef.current.currentTime = nextTime;
    } else if (activeAngles.length > 0) {
      setCurrentIndex((prev) => (prev < activeAngles.length - 1 ? prev + 1 : 0));
    }
  };

  // Jump to specific angle in video mode
  const jumpToVideoAngle = (fraction: number) => {
    setIsAutoPlaying(false);
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = fraction * videoRef.current.duration;
    }
  };

  const currentDegree = isVideoMode
    ? Math.round(videoProgress * 360)
    : currentAngle.degree;

  return (
    <div className="w-full bg-[#FFFDFA] border border-[#D8CFC6] rounded-xl shadow-lg overflow-hidden flex flex-col select-none">
      {/* Top Header Bar */}
      <div className="px-5 py-3.5 bg-[#FAF8F5] border-b border-[#D8CFC6] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#713A48] text-white flex items-center justify-center font-serif text-xs font-bold shadow-xs">
            360°
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-[16px] text-[#302B28] font-medium leading-tight">
                {isVideoMode ? "High-Def Turntable Orbit" : "Interactive Atelier Orbit"}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#713A48] bg-[#FAF0F2] border border-[#713A48]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                {isVideoMode && <Film className="w-2.5 h-2.5" />}
                <span>Drag to Spin</span>
              </span>
            </div>
            <p className="text-[11px] text-[#69615B] font-mono">
              {currentDegree}° · {isVideoMode ? "Continuous Studio 360° Rotation" : currentAngle.label}
            </p>
          </div>
        </div>

        {/* Orbit Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide uppercase transition-colors cursor-pointer border ${
              isAutoPlaying
                ? "bg-[#713A48] text-white border-[#713A48]"
                : "bg-[#FFFDFA] text-[#302B28] border-[#D8CFC6] hover:border-[#713A48]"
            }`}
            title={isAutoPlaying ? "Pause 360° Auto-spin" : "Play 360° Auto-spin"}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Spin</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Auto Spin</span>
              </>
            )}
          </button>

          {!isVideoMode && (
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className={`p-1.5 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                isZoomed
                  ? "bg-[#713A48] text-white border-[#713A48]"
                  : "bg-[#FFFDFA] text-[#302B28] border-[#D8CFC6] hover:border-[#713A48]"
              }`}
              title={isZoomed ? "Exit Fabric Loupe" : "Zoom Fabric Texture"}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Main 360° Canvas Area with Drag Gesture */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "none" }}
        className={`relative w-full h-[420px] sm:h-[480px] bg-[#FAF8F5] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing ${
          isDragging ? "cursor-grabbing" : ""
        }`}
      >
        {isVideoMode ? (
          /* High-Definition 360 Video Orbit Player */
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted
            playsInline
            autoPlay
            onError={() => setVideoError(true)}
            className="w-full h-full object-contain pointer-events-none"
          />
        ) : (
          /* High-Resolution Multi-Angle Photo Orbit */
          <div
            className="relative w-full h-full bg-[#F2EDE7]"
            style={
              isZoomed
                ? {
                    transform: "scale(2.2)",
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transition: isDragging ? "none" : "transform-origin 0.1s ease-out",
                  }
                : { transition: "transform 0.2s ease-out" }
            }
          >
            {currentAngle.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={currentAngle.image}
                alt={`${productName} - ${currentAngle.label}`}
                className="w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
              />
            )}
          </div>
        )}

        {/* Previous / Next Arrow Overlays */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#D8CFC6] flex items-center justify-center text-[#302B28] shadow-md hover:scale-105 transition-all cursor-pointer z-10"
          aria-label="Rotate left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#D8CFC6] flex items-center justify-center text-[#302B28] shadow-md hover:scale-105 transition-all cursor-pointer z-10"
          aria-label="Rotate right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Floating Perspective Badge */}
        <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/20 text-[11px] font-medium flex items-center gap-2 shadow-lg">
          <Compass className="w-3.5 h-3.5 text-white/80" />
          <span>{currentDegree}° Turntable Perspective</span>
        </div>

        {/* Subtitle Description Pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md text-[#302B28] px-4 py-1.5 rounded-full border border-[#D8CFC6] text-[11px] font-medium text-center shadow-lg whitespace-nowrap max-w-[90%] truncate">
          {isVideoMode ? "Drag left-right to inspect continuous 360° drape & silhouette" : currentAngle.sublabel}
        </div>
      </div>

      {/* Interactive Angle Scrubber Slider */}
      <div className="p-4 bg-[#FAF8F5] border-t border-[#D8CFC6]">
        <div className="flex items-center justify-between text-[11px] text-[#69615B] mb-2 font-mono">
          <span>0° Studio Front</span>
          <span className="font-bold text-[#713A48]">
            {currentDegree}° Active Perspective
          </span>
          <span>360° Complete Orbit</span>
        </div>

        {/* Visual Angle Thumbnails Strip */}
        {isVideoMode ? (
          <div className="grid grid-cols-5 gap-2">
            {[
              { degree: 0, label: "0° Front", fraction: 0 },
              { degree: 90, label: "90° Profile", fraction: 0.25 },
              { degree: 180, label: "180° Rear Back", fraction: 0.5 },
              { degree: 270, label: "270° Velvet Drape", fraction: 0.75 },
              { degree: 360, label: "360° Orbit", fraction: 0.99 },
            ].map((pt) => (
              <button
                key={pt.degree}
                type="button"
                onClick={() => jumpToVideoAngle(pt.fraction)}
                className={`py-2 px-1 rounded-md border text-center transition-all cursor-pointer ${
                  Math.abs(videoProgress - pt.fraction) < 0.12
                    ? "bg-[#713A48] text-white border-[#713A48] shadow-xs"
                    : "bg-[#FFFDFA] text-[#302B28] border-[#D8CFC6] hover:border-[#713A48]"
                }`}
              >
                <div className="text-[11px] font-semibold">{pt.label}</div>
                <div className="text-[9px] opacity-75 font-mono">{pt.degree}°</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-2">
            {activeAngles.map((angle, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`relative h-14 rounded-md overflow-hidden border-2 transition-all cursor-pointer bg-[#EAE4D9] ${
                  currentIndex === idx
                    ? "border-[#713A48] shadow-md scale-102"
                    : "border-[#D8CFC6] opacity-65 hover:opacity-100"
                }`}
                title={angle.label}
              >
                {angle.image && (
                  <Image
                    src={angle.image}
                    alt={angle.label}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-mono text-center py-0.5">
                  {angle.degree}°
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Buy / Add to Bag Action Bar */}
      {showBuyBar && (
        <div className="p-4 bg-[#FFFDFA] border-t border-[#D8CFC6] flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[12px] uppercase font-semibold text-[#713A48] tracking-wider">
              {category}
            </div>
            <h3 className="font-editorial text-[18px] text-[#302B28] font-medium">
              {productName}
            </h3>
            <span className="font-mono text-[16px] font-bold text-[#302B28]">
              {formatPrice(price)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onAddToCart && (
              <button
                type="button"
                onClick={onAddToCart}
                className="px-5 py-2.5 bg-[#713A48] hover:bg-[#582D38] text-white text-xs font-semibold tracking-wider uppercase rounded-md shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Atelier360Modal({
  isOpen,
  onClose,
  productName,
  price,
  category,
  angles,
  videoUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price?: number;
  category?: string;
  angles?: OrbitAngle[];
  videoUrl?: string;
}) {
  const { addToCart } = useStore();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99998] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/50 hover:bg-black text-white transition-colors cursor-pointer"
          title="Close 360 modal"
        >
          <X className="w-5 h-5" />
        </button>

        <Atelier360Viewer
          productName={productName}
          price={price}
          category={category}
          angles={angles}
          videoUrl={videoUrl}
          onAddToCart={() => {
            onClose();
          }}
        />
      </div>
    </div>
  );
}
