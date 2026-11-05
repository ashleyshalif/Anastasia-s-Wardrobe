"use client";



import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";

import Link from "next/link";

import Image from "next/image";

import { useRouter } from "next/navigation";

import {

  Heart, ChevronDown, ChevronUp, Check, Truck, RefreshCw,

  ChevronLeft, ChevronRight, ZoomIn,

} from "lucide-react";

import { MOCK_PRODUCTS } from "@/lib/products";

import { isCategoryEnabled } from "@/config/catalog";

import { useStore } from "@/lib/store";

import { SizeGuideModal } from "@/components/catalog/SizeGuideModal";

import { Product, ProductVariant, ProductImage } from "@/types/product";

import { Atelier360Viewer } from "@/components/interactive/Atelier360Viewer";
import { getProduct360Angles, getProduct360Video } from "@/config/orbitData";

import { RotateCcw } from "lucide-react";

import { getProductBySlug, getProducts } from "@/lib/products";

import { getComplementaryProducts } from "@/lib/recommendations";



interface ProductDetailViewProps {

  slug: string;

  initialProduct?: Product | null;

}



// ─── Gallery helpers ───────────────────────────────────────────────────────────



/** Returns images for the selected color variant, or all images if no color match */

function getVariantImages(product: Product, color: string): ProductImage[] {

  if (product.variants && product.variants.length > 0) {

    const match = product.variants.find(

      (v) => v.color.toLowerCase() === color.toLowerCase()

    );

    if (match) return match.images;

  }

  // Flat images fallback

  if (product.images && product.images.length > 0) {

    const colored = product.images.filter(

      (img) => img.color && img.color.toLowerCase() === color.toLowerCase()

    );

    if (colored.length > 0) return colored;

    const neutral = product.images.filter((img) => !img.color || img.color === "");

    if (neutral.length > 0) return neutral;

    return product.images;

  }

  // Legacy: build from image + galleryImages strings

  const imgs: ProductImage[] = [];

  if (product.image) {

    imgs.push({ id: 0, url: product.image, thumbnailUrl: product.image, angle: "front", alt: product.name, position: 0, isPrimary: true });

  }

  (product.galleryImages ?? []).forEach((url, i) => {

    imgs.push({ id: `g_${i}`, url, thumbnailUrl: url, angle: "detail", alt: `${product.name} view ${i + 2}`, position: i + 1, isPrimary: false });

  });

  return imgs;

}



/** Does the selected color have any images? */

function colorHasImages(product: Product, color: string): boolean {

  if (product.variants && product.variants.length > 0) {

    const match = product.variants.find(

      (v) => v.color.toLowerCase() === color.toLowerCase()

    );

    if (match) return match.hasImages;

  }

  if (product.images && product.images.length > 0) {

    return product.images.some(

      (img) => !img.color || img.color.toLowerCase() === color.toLowerCase()

    );

  }

  return !!product.image;

}



/** Pick a fallback primary image for when a color has no images */

function getPrimaryFallback(product: Product): string {

  if (product.variants) {

    const withImages = product.variants.find((v) => v.hasImages && v.images.length > 0);

    if (withImages) return withImages.images[0].url;

  }

  return product.image || "/images/cardigan.png";

}



// ─── Main Component ───────────────────────────────────────────────────────────



export function ProductDetailView({ slug, initialProduct }: ProductDetailViewProps) {

  const router = useRouter();

  const { addToCart, toggleWishlist, isInWishlist } = useStore();



  const [product, setProduct] = useState<Product | null>(

    initialProduct !== undefined

      ? initialProduct

      : MOCK_PRODUCTS.find((p) => p.slug === slug) || null

  );



  useEffect(() => {

    if (initialProduct !== undefined) {

      setProduct(initialProduct);

    } else {

      getProductBySlug(slug).then((prod) => {

        if (prod) setProduct(prod);

      });

    }

  }, [slug, initialProduct]);



  const [selectedSize, setSelectedSize] = useState<string>("");

  const [selectedColor, setSelectedColor] = useState<string>("");

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [isZoomed, setIsZoomed] = useState(false);

  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"fabric" | "fit" | "delivery">("fabric");

  const [addedAnimation, setAddedAnimation] = useState(false);

  const [is360Mode, setIs360Mode] = useState(false);
  const product360Angles = useMemo(() => {
    return product ? getProduct360Angles(product.slug, product.id, product) : null;
  }, [product?.slug, product?.id]);
  const product360Video = useMemo(() => {
    return product ? getProduct360Video(product.slug, product.id) : null;
  }, [product?.slug, product?.id]);
  const has360Orbit = Boolean((product360Angles && product360Angles.length >= 3) || product360Video);

  const mainImageRef = useRef<HTMLDivElement>(null);

  const touchStartX = useRef<number>(0);



  const isEnabled = product ? isCategoryEnabled(product.category) : false;



  // Color selection handler with URL sync

  const handleColorChange = useCallback((colorName: string) => {

    setSelectedColor(colorName);

    if (typeof window !== "undefined") {

      const url = new URL(window.location.href);

      const slug = colorName.toLowerCase().trim().replace(/[\s_]+/g, "-");

      url.searchParams.set("color", slug);

      window.history.replaceState({}, "", url.toString());

    }

  }, []);



  // Initialize selected color and size once product loads

  useEffect(() => {

    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {

      setSelectedSize(product.sizes[0]);

    }

    if (!selectedColor) {

      // Check URL query param first (?color=...)

      let colorFromUrl = "";

      if (typeof window !== "undefined") {

        const urlParams = new URLSearchParams(window.location.search);

        const colParam = urlParams.get("color");

        if (colParam) {

          const matched = product.availableColors?.find(

            (c) =>

              c.name.toLowerCase() === colParam.toLowerCase() ||

              c.name.toLowerCase().replace(/[\s_]+/g, "-") === colParam.toLowerCase()

          );

          if (matched) colorFromUrl = matched.name;

        }

      }



      if (colorFromUrl) {

        setSelectedColor(colorFromUrl);

      } else {

        // Prefer first color that actually has images

        const firstWithImages = product.variants?.find((v) => v.hasImages)?.color

          ?? product.availableColors?.[0]?.name

          ?? product.color

          ?? "";

        setSelectedColor(firstWithImages);

      }

    }

  }, [product, selectedSize, selectedColor]);



  // Reset gallery index when color changes

  useEffect(() => {

    setActiveImageIndex(0);

  }, [selectedColor]);



  if (!product || !isEnabled) {

    return (

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "80px 48px", textAlign: "center" }}>

        <h1 style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "36px", marginBottom: "16px" }}>

          Piece Not Found

        </h1>

        <p style={{ color: "#69615B", marginBottom: "32px" }}>

          This garment is either retired or belongs to a collection not yet launched.

        </p>

        <Link href="/" className="btn-primary">Return to wardrobe</Link>

      </div>

    );

  }



  const inWishlist = isInWishlist(product.id);



  // Gallery images for the current color

  const galleryImages = getVariantImages(product, selectedColor);

  const currentHasImages = colorHasImages(product, selectedColor);

  const activeImage = galleryImages[activeImageIndex] ?? null;

  const displayImageUrl = currentHasImages && activeImage

    ? activeImage.url

    : getPrimaryFallback(product);



  const handlePrevImage = () =>

    setActiveImageIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);

  const handleNextImage = () =>

    setActiveImageIndex((i) => (i + 1) % galleryImages.length);



  // Touch swipe for mobile

  const handleTouchStart = (e: React.TouchEvent) => {

    touchStartX.current = e.touches[0].clientX;

  };

  const handleTouchEnd = (e: React.TouchEvent) => {

    const delta = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(delta) > 40) {

      if (delta > 0) handleNextImage(); else handlePrevImage();

    }

  };



  // Zoom lens on desktop

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {

    if (!mainImageRef.current) return;

    const rect = mainImageRef.current.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;

    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPos({ x, y });

  }, []);



  const handleAddToCart = () => {

    // Capture the variant image at the moment of adding

    const variantImg = currentHasImages && activeImage ? activeImage.url : product.image;

    const productWithVariantImage = { ...product, image: variantImg ?? product.image };

    addToCart(productWithVariantImage, selectedSize || product.sizes[0], selectedColor);

    setAddedAnimation(true);

    setTimeout(() => setAddedAnimation(false), 2000);

  };



  const handleBuyNow = () => {

    const variantImg = currentHasImages && activeImage ? activeImage.url : product.image;

    const productWithVariantImage = { ...product, image: variantImg ?? product.image };

    addToCart(productWithVariantImage, selectedSize || product.sizes[0], selectedColor);

    router.push("/checkout");

  };



  // Complementary pieces for "Wear it with" (curated by Rule-Based Outfit Compatibility Engine)

  const [complementaryProducts, setComplementaryProducts] = useState<Product[]>(() =>

    product ? getComplementaryProducts(product, MOCK_PRODUCTS, 3) : []

  );



  useEffect(() => {

    if (!product) return;

    getProducts().then((all) => {

      const catalog = all && all.length > 0 ? all : MOCK_PRODUCTS;

      setComplementaryProducts(getComplementaryProducts(product, catalog, 3));

    });

  }, [product]);



  return (

    <div style={{ width: "100%", backgroundColor: "#F8F5EF", minHeight: "100vh" }}>

      <div

        style={{ maxWidth: "1440px", margin: "0 auto", padding: "36px 48px 80px" }}

        className="aw-pdp-container"

      >

        {/* Breadcrumb */}

        <nav style={{ marginBottom: "24px", fontSize: "13px", color: "#69615B", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 8px" }}>

          <Link href="/" style={{ color: "inherit", textDecoration: "none" }} className="hover:underline">Home</Link>

          <span>/</span>

          <Link href={`/category/${product.category}`} style={{ color: "inherit", textDecoration: "none" }} className="hover:underline">

            {product.department.split("·")[0].trim()}

          </Link>

          <span>/</span>

          <span style={{ color: "#302B28", fontWeight: 500 }}>{product.name}</span>

        </nav>



        {/* Main PDP Layout */}

        <div className="aw-pdp-layout">



          {/* ── Left: Gallery ─────────────────────────────────────── */}

          <div className="aw-pdp-media">



            {/* Gallery vs 360 Orbit Mode Switcher - Product-Accurate */}
            <div className="flex items-center justify-between mb-4 w-full">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIs360Mode(false)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                    !is360Mode
                      ? "bg-[#713A48] text-white shadow-xs"
                      : "bg-[#FFFDFA] text-[#69615B] border border-[#D8CFC6] hover:text-[#302B28]"
                  }`}
                >
                  📷 Studio Gallery ({galleryImages.length})
                </button>
                {has360Orbit && (
                  <button
                    type="button"
                    onClick={() => setIs360Mode(true)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      is360Mode
                        ? "bg-[#713A48] text-white shadow-xs"
                        : "bg-[#FFFDFA] text-[#713A48] border border-[#713A48]/50 hover:bg-[#FAF5EE]"
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>360° Studio Orbit {product360Video ? "(Turntable)" : `(${product360Angles?.length || 0} Views)`}</span>
                  </button>
                )}
              </div>
              <span className="text-[11px] text-[#69615B] font-mono hidden sm:inline">
                {is360Mode ? "Drag left-right to spin product" : "Hover image for interactive high-res zoom loupe"}
              </span>
            </div>

            {has360Orbit && is360Mode ? (
              <div className="mb-6 w-full">
                <Atelier360Viewer
                  productName={product.name}
                  price={product.price}
                  category={product.department}
                  angles={product360Angles ?? undefined}
                  videoUrl={product360Video ?? undefined}
                  showBuyBar={false}
                />
              </div>

            ) : (

              <>

            {/* Desktop: thumbnail strip + main image */}

            <div className="aw-gallery-desktop">



              {/* Thumbnail strip */}

              {galleryImages.length > 1 && (

                <div className="aw-thumb-strip">

                  {galleryImages.map((img, idx) => (

                    <button

                      key={img.id}

                      type="button"

                      aria-label={`View ${img.alt || img.angle}`}

                      onClick={() => setActiveImageIndex(idx)}

                      style={{

                        width: "68px",

                        height: "88px",

                        position: "relative",

                        flexShrink: 0,

                        border: idx === activeImageIndex ? "2px solid #713A48" : "1px solid #D8CFC6",

                        overflow: "hidden",

                        cursor: "pointer",

                        backgroundColor: "#EAE4D9",

                        padding: 0,

                        transition: "border-color 0.2s ease",

                      }}

                    >

                      <Image

                        src={img.thumbnailUrl || img.url}

                        alt={img.alt || product.name}

                        fill

                        sizes="68px"

                        style={{ objectFit: "cover" }}

                      />

                    </button>

                  ))}

                </div>

              )}



              {/* Main image with Nykaa-Style Side-by-Side Zoom Window */}
              <div className="relative flex-1" style={{ height: "640px" }}>
                <div
                  ref={mainImageRef}
                  className="aw-pdp-main-image"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#EAE4D9",
                    border: "1px solid #D8CFC6",
                    overflow: "hidden",
                    cursor: isZoomed ? "crosshair" : "zoom-in",
                  }}
                  onMouseEnter={() => currentHasImages && setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {currentHasImages ? (
                    <>
                      <Image
                        src={displayImageUrl}
                        alt={activeImage?.alt || product.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 680px"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                      {/* Translucent Loupe Overlay on Main Image */}
                      {isZoomed && (
                        <div
                          className="hidden lg:block pointer-events-none"
                          style={{
                            position: "absolute",
                            width: "150px",
                            height: "150px",
                            left: `calc(${zoomPos.x}% - 75px)`,
                            top: `calc(${zoomPos.y}% - 75px)`,
                            border: "1.5px solid #713A48",
                            backgroundColor: "rgba(255, 255, 255, 0.32)",
                            boxShadow: "0 0 0 1px rgba(0,0,0,0.12), inset 0 0 10px rgba(113, 58, 72, 0.15)",
                            backdropFilter: "blur(0.5px)",
                            zIndex: 20,
                          }}
                        />
                      )}
                    </>
                  ) : (

                  /* "Photo coming soon" placeholder */

                  <div style={{

                    position: "absolute", inset: 0,

                    display: "flex", flexDirection: "column",

                    alignItems: "center", justifyContent: "center",

                    backgroundColor: "#F2EDE7",

                    gap: "16px",

                  }}>

                    <div style={{

                      width: "72px", height: "72px", borderRadius: "50%",

                      backgroundColor: "#EAE4D9",

                      display: "flex", alignItems: "center", justifyContent: "center",

                    }}>

                      <ZoomIn style={{ width: "28px", height: "28px", color: "#A89F91" }} />

                    </div>

                    <p style={{ fontSize: "14px", color: "#69615B", textAlign: "center", maxWidth: "200px", lineHeight: 1.5 }}>

                      Photography for <strong>{selectedColor}</strong> coming soon

                    </p>

                    <p style={{ fontSize: "12px", color: "#A89F91" }}>Showing primary product image</p>

                    <Image

                      src={getPrimaryFallback(product)}

                      alt={product.name}

                      fill

                      sizes="680px"

                      style={{ objectFit: "cover", opacity: 0.35 }}

                    />

                  </div>

                )}



                {/* Badge */}

                {product.badge && (

                  <span style={{

                    position: "absolute", top: "16px", left: "16px",

                    backgroundColor: "rgba(255,253,250,0.9)", color: "#713A48",

                    fontSize: "11px", fontWeight: 500, padding: "4px 10px",

                    letterSpacing: "0.1em", textTransform: "uppercase",

                    border: "1px solid #D8CFC6",

                  }}>{product.badge}</span>

                )}



                {/* Prev/Next arrows (visible when multiple images) */}

                {galleryImages.length > 1 && (

                  <>

                    <button

                      type="button"

                      onClick={handlePrevImage}

                      aria-label="Previous photo"

                      style={{

                        position: "absolute", left: "12px", top: "50%",

                        transform: "translateY(-50%)",

                        width: "36px", height: "36px",

                        backgroundColor: "rgba(255,253,250,0.88)",

                        border: "1px solid #D8CFC6",

                        display: "flex", alignItems: "center", justifyContent: "center",

                        cursor: "pointer", zIndex: 10,

                        transition: "background-color 0.2s ease",

                      }}

                    >

                      <ChevronLeft style={{ width: "18px", height: "18px", color: "#302B28" }} />

                    </button>

                    <button

                      type="button"

                      onClick={handleNextImage}

                      aria-label="Next photo"

                      style={{

                        position: "absolute", right: "12px", top: "50%",

                        transform: "translateY(-50%)",

                        width: "36px", height: "36px",

                        backgroundColor: "rgba(255,253,250,0.88)",

                        border: "1px solid #D8CFC6",

                        display: "flex", alignItems: "center", justifyContent: "center",

                        cursor: "pointer", zIndex: 10,

                        transition: "background-color 0.2s ease",

                      }}

                    >

                      <ChevronRight style={{ width: "18px", height: "18px", color: "#302B28" }} />

                    </button>

                  </>

                )}

              </div>

              {/* Dedicated Nykaa-Style Side-by-Side Magnification Preview Window */}
              {isZoomed && currentHasImages && (
                <div
                  className="hidden lg:block pointer-events-none"
                  style={{
                    position: "absolute",
                    left: "calc(100% + 20px)",
                    top: 0,
                    width: "560px",
                    height: "640px",
                    backgroundColor: "#FFFDFA",
                    border: "1.5px solid #D8CFC6",
                    boxShadow: "0 25px 50px -12px rgba(48, 43, 40, 0.28)",
                    overflow: "hidden",
                    zIndex: 90,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${displayImageUrl})`,
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundSize: "320% 320%",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "14px",
                      right: "14px",
                      padding: "5px 12px",
                      backgroundColor: "rgba(48, 43, 40, 0.82)",
                      color: "#FAF8F5",
                      fontSize: "10px",
                      fontFamily: "monospace",
                      letterSpacing: "0.08em",
                      borderRadius: "3px",
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      textTransform: "uppercase",
                    }}
                  >
                    3.2× High-Definition Loupe
                  </div>
                </div>
              )}
              </div>

            </div>



            {/* Mobile: swipeable full-width carousel with navigation */}

            <div

              className="aw-gallery-mobile"

              onTouchStart={handleTouchStart}

              onTouchEnd={handleTouchEnd}

            >

              <div style={{

                position: "relative",

                width: "100%",

                aspectRatio: "3 / 4",

                maxHeight: "560px",

                backgroundColor: "#EAE4D9",

                borderRadius: "8px",

                border: "1px solid #D8CFC6",

                overflow: "hidden",

                margin: "0 auto",

              }}>

                {currentHasImages ? (

                  <Image

                    src={displayImageUrl}

                    alt={activeImage?.alt || product.name}

                    fill

                    priority

                    sizes="(max-width: 1023px) 100vw, 680px"

                    style={{ objectFit: "cover" }}

                  />

                ) : (

                  <div style={{

                    position: "absolute", inset: 0,

                    display: "flex", flexDirection: "column",

                    alignItems: "center", justifyContent: "center", gap: "12px",

                    backgroundColor: "#F2EDE7",

                  }}>

                    <p style={{ fontSize: "13px", color: "#69615B", textAlign: "center" }}>

                      Photography for <strong>{selectedColor}</strong> coming soon

                    </p>

                    <Image src={getPrimaryFallback(product)} alt={product.name} fill sizes="100vw" style={{ objectFit: "cover", opacity: 0.35 }} />

                  </div>

                )}

                {product.badge && (

                  <span style={{

                    position: "absolute", top: "12px", left: "12px",

                    backgroundColor: "rgba(255,253,250,0.92)", color: "#713A48",

                    fontSize: "10px", fontWeight: 600, padding: "4px 8px",

                    textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid #D8CFC6",

                    borderRadius: "2px",

                  }}>{product.badge}</span>

                )}



                {/* Mobile tap prev/next buttons */}

                {galleryImages.length > 1 && (

                  <>

                    <button

                      type="button"

                      onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}

                      aria-label="Previous photo"

                      style={{

                        position: "absolute", left: "10px", top: "50%",

                        transform: "translateY(-50%)",

                        width: "36px", height: "36px",

                        backgroundColor: "rgba(255,253,250,0.9)",

                        borderRadius: "50%",

                        border: "1px solid #D8CFC6",

                        display: "flex", alignItems: "center", justifyContent: "center",

                        cursor: "pointer", zIndex: 5,

                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",

                      }}

                    >

                      <ChevronLeft style={{ width: "18px", height: "18px", color: "#302B28" }} />

                    </button>

                    <button

                      type="button"

                      onClick={(e) => { e.stopPropagation(); handleNextImage(); }}

                      aria-label="Next photo"

                      style={{

                        position: "absolute", right: "10px", top: "50%",

                        transform: "translateY(-50%)",

                        width: "36px", height: "36px",

                        backgroundColor: "rgba(255,253,250,0.9)",

                        borderRadius: "50%",

                        border: "1px solid #D8CFC6",

                        display: "flex", alignItems: "center", justifyContent: "center",

                        cursor: "pointer", zIndex: 5,

                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",

                      }}

                    >

                      <ChevronRight style={{ width: "18px", height: "18px", color: "#302B28" }} />

                    </button>

                  </>

                )}

              </div>



              {/* Pagination dots */}

              {galleryImages.length > 1 && (

                <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "12px" }}>

                  {galleryImages.map((_, idx) => (

                    <button

                      key={idx}

                      type="button"

                      aria-label={`Go to photo ${idx + 1}`}

                      onClick={() => setActiveImageIndex(idx)}

                      style={{

                        width: idx === activeImageIndex ? "22px" : "8px",

                        height: "8px",

                        borderRadius: "4px",

                        backgroundColor: idx === activeImageIndex ? "#713A48" : "#D8CFC6",

                        border: "none",

                        padding: 0,

                        cursor: "pointer",

                        transition: "all 0.25s ease",

                      }}

                    />

                  ))}

                </div>

              )}

            </div>



            {/* Photo counter caption */}

            {galleryImages.length > 0 && (

              <p style={{ fontSize: "12px", color: "#69615B", marginTop: "10px", textAlign: "center", width: "100%" }}>

                {activeImageIndex + 1} / {galleryImages.length} · {activeImage?.angle ? `${activeImage.angle.charAt(0).toUpperCase()}${activeImage.angle.slice(1)} view` : "Product photo"}

              </p>

            )}

              </>

            )}

          </div>



          {/* ── Right: Product Info & Actions ─────────────────────── */}

          <div className="aw-pdp-details">



            {/* Eyebrow */}

            <span style={{

              fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em",

              color: "#713A48", textTransform: "uppercase", display: "block", marginBottom: "8px",

            }}>

              {product.badge ? product.badge : "THE EDITORIAL COLLECTION"}

            </span>



            {/* Title */}

            <h1 style={{

              fontFamily: "var(--font-lora), Georgia, serif", fontSize: "clamp(26px, 5vw, 40px)",

              color: "#302B28", margin: "0 0 12px", lineHeight: 1.15,

            }}>

              {product.name}

            </h1>



            {/* Price */}

            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "24px" }}>

              <span style={{ fontSize: "24px", fontWeight: 500, color: "#302B28" }}>

                ₹{product.price.toLocaleString("en-IN")}

              </span>

              {product.originalPrice && (

                <span style={{ fontSize: "16px", color: "#69615B", textDecoration: "line-through" }}>

                  ₹{product.originalPrice.toLocaleString("en-IN")}

                </span>

              )}

              {product.saleNote && (

                <span style={{ fontSize: "13px", color: "#713A48", fontWeight: 500 }}>

                  {product.saleNote}

                </span>

              )}

            </div>



            {/* Description */}

            <p style={{ fontSize: "15px", color: "#302B28", lineHeight: 1.6, marginBottom: "32px" }}>

              {product.description}

            </p>



            {/* Colour Choice */}

            {product.availableColors && product.availableColors.length > 0 && (

              <div style={{ marginBottom: "28px" }}>

                <span style={{ fontSize: "13px", color: "#69615B", display: "block", marginBottom: "10px" }}>

                  Colour: <strong style={{ color: "#302B28" }}>{selectedColor}</strong>

                  {!currentHasImages && (

                    <span style={{

                      marginLeft: "10px", fontSize: "11px", color: "#856404",

                      backgroundColor: "#FFF3CD", padding: "2px 8px",

                      borderRadius: "4px", border: "1px solid #FFEEBA",

                    }}>

                      ⚠ Photo coming soon

                    </span>

                  )}

                </span>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>

                  {product.availableColors.map((col) => {

                    const isSelected = selectedColor === col.name;

                    // Check if this color has images

                    const hasImg = colorHasImages(product, col.name);

                    return (

                      <button

                        key={col.name}

                        type="button"

                        onClick={() => handleColorChange(col.name)}

                        title={`${col.name}${!hasImg ? " (photo coming soon)" : ""}`}

                        style={{

                          width: "36px", height: "36px",

                          borderRadius: "50%",

                          backgroundColor: col.hex,

                          border: isSelected ? "2px solid #713A48" : "1px solid #D8CFC6",

                          outline: isSelected ? "2px solid #FFFDFA" : "none",

                          cursor: "pointer",

                          transition: "transform 0.2s ease",

                          transform: isSelected ? "scale(1.1)" : "scale(1)",

                          opacity: hasImg ? 1 : 0.65,

                        }}

                        aria-label={`Select colour ${col.name}`}

                      />

                    );

                  })}

                </div>

              </div>

            )}



            {/* Size Selection */}

            {product.sizes && product.sizes.length > 0 && (

              <div style={{ marginBottom: "32px" }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>

                  <span style={{ fontSize: "13px", color: "#69615B" }}>

                    Select Size: <strong style={{ color: "#302B28" }}>{selectedSize}</strong>

                  </span>

                  <button

                    type="button"

                    onClick={() => setSizeGuideOpen(true)}

                    style={{ fontSize: "12px", color: "#713A48", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}

                  >

                    Size guide &amp; fit notes

                  </button>

                </div>



                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>

                  {product.sizes.map((sz) => {

                    const isSelected = selectedSize === sz;

                    return (

                      <button

                        key={sz}

                        type="button"

                        onClick={() => setSelectedSize(sz)}

                        style={{

                          minWidth: "52px", height: "44px", padding: "0 14px",

                          display: "flex", alignItems: "center", justifyContent: "center",

                          fontSize: "13px", fontWeight: 500,

                          backgroundColor: isSelected ? "#302B28" : "#FFFDFA",

                          color: isSelected ? "#FFFDFA" : "#302B28",

                          border: `1px solid ${isSelected ? "#302B28" : "#D8CFC6"}`,

                          cursor: "pointer",

                          transition: "all 0.2s ease",

                        }}

                      >

                        {sz}

                      </button>

                    );

                  })}

                </div>

              </div>

            )}



            {/* Purchase Action Buttons */}

            <div style={{ display: "flex", gap: "12px", marginBottom: "36px" }}>

              <button

                type="button"

                onClick={handleAddToCart}

                className="btn-primary"

                style={{

                  flex: 1, padding: "16px", textAlign: "center",

                  fontSize: "14px", fontWeight: 500,

                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",

                }}

              >

                {addedAnimation ? (

                  <><Check style={{ width: "18px", height: "18px" }} /><span>Added to bag ✓</span></>

                ) : (

                  <span>Add to bag · ₹{product.price.toLocaleString("en-IN")}</span>

                )}

              </button>



              <button

                type="button"

                onClick={handleBuyNow}

                style={{

                  flex: 1,

                  padding: "16px",

                  textAlign: "center",

                  fontSize: "14px",

                  fontWeight: 600,

                  backgroundColor: "#FAF5EE",

                  color: "#713A48",

                  border: "1.5px solid #713A48",

                  cursor: "pointer",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  gap: "6px",

                  transition: "all 0.2s ease",

                }}

                className="aw-btn-buynow"

              >

                <span>Buy now ➔</span>

              </button>



              <button

                type="button"

                onClick={() => toggleWishlist(product.id)}

                style={{

                  width: "52px", height: "52px",

                  border: "1px solid #D8CFC6", backgroundColor: "#FFFDFA",

                  display: "flex", alignItems: "center", justifyContent: "center",

                  cursor: "pointer", transition: "border-color 0.2s ease",

                  flexShrink: 0,

                }}

                aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}

              >

                <Heart style={{ width: "20px", height: "20px", color: "#713A48", fill: inWishlist ? "#713A48" : "none" }} />

              </button>

            </div>



            {/* Accordion Panels */}

            <div style={{ borderTop: "1px solid #D8CFC6", borderBottom: "1px solid #D8CFC6" }}>



              {/* Tab: Fabric & Care */}

              <div style={{ borderBottom: "1px solid #D8CFC6" }}>

                <button

                  type="button"

                  onClick={() => setActiveTab(activeTab === "fabric" ? (null as any) : "fabric")}

                  style={{

                    width: "100%", padding: "16px 0",

                    display: "flex", alignItems: "center", justifyContent: "space-between",

                    fontSize: "14px", fontWeight: 500, color: "#302B28",

                    background: "none", border: "none", cursor: "pointer",

                  }}

                >

                  <span>Fabric &amp; garment care</span>

                  {activeTab === "fabric" ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}

                </button>

                {activeTab === "fabric" && (

                  <div style={{ paddingBottom: "16px", fontSize: "13px", color: "#69615B", lineHeight: 1.6 }}>

                    <p style={{ margin: "0 0 8px" }}><strong>Material:</strong> {product.materialComposition || product.fabric || "Merino wool and natural horn buttons"}</p>

                    {product.occasion && (

                      <p style={{ margin: "0 0 8px" }}><strong>Styling Occasion:</strong> {product.occasion}</p>

                    )}

                    <p style={{ margin: "0 0 8px" }}><strong>Care instructions:</strong> {product.care || "Cool hand wash gently or specialist dry clean."}</p>

                    {product.details && (

                      <ul style={{ paddingLeft: "20px", margin: 0 }}>

                        {product.details.map((dt, i) => <li key={i}>{dt}</li>)}

                      </ul>

                    )}

                  </div>

                )}

              </div>



              {/* Tab: Fit */}

              <div style={{ borderBottom: "1px solid #D8CFC6" }}>

                <button

                  type="button"

                  onClick={() => setActiveTab(activeTab === "fit" ? (null as any) : "fit")}

                  style={{

                    width: "100%", padding: "16px 0",

                    display: "flex", alignItems: "center", justifyContent: "space-between",

                    fontSize: "14px", fontWeight: 500, color: "#302B28",

                    background: "none", border: "none", cursor: "pointer",

                  }}

                >

                  <span>Fit &amp; sizing notes</span>

                  {activeTab === "fit" ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}

                </button>

                {activeTab === "fit" && (

                  <div style={{ paddingBottom: "16px", fontSize: "13px", color: "#69615B", lineHeight: 1.6 }}>

                    {product.fit && (

                      <p style={{ margin: "0 0 8px" }}><strong>Silhouette:</strong> {product.fit.charAt(0).toUpperCase() + product.fit.slice(1)}</p>

                    )}

                    <p style={{ margin: "0 0 8px" }}>Cut for everyday ease with subtle drop shoulders. If you prefer a snugger silhouette, consider taking one size down.</p>

                    <p style={{ margin: 0 }}>Model wears size S. Length from shoulder to hem: 58cm.</p>

                  </div>

                )}

              </div>



              {/* Tab: Delivery */}

              <div>

                <button

                  type="button"

                  onClick={() => setActiveTab(activeTab === "delivery" ? (null as any) : "delivery")}

                  style={{

                    width: "100%", padding: "16px 0",

                    display: "flex", alignItems: "center", justifyContent: "space-between",

                    fontSize: "14px", fontWeight: 500, color: "#302B28",

                    background: "none", border: "none", cursor: "pointer",

                  }}

                >

                  <span>Complimentary delivery &amp; returns</span>

                  {activeTab === "delivery" ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}

                </button>

                {activeTab === "delivery" && (

                  <div style={{ paddingBottom: "16px", fontSize: "13px", color: "#69615B", lineHeight: 1.6 }}>

                    <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "8px" }}>

                      <Truck style={{ width: "16px", height: "16px", color: "#713A48", flexShrink: 0, marginTop: "2px" }} />

                      <span>Standard delivery: 2–4 working days (complimentary on all orders over ₹4,999).</span>

                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>

                      <RefreshCw style={{ width: "16px", height: "16px", color: "#713A48", flexShrink: 0, marginTop: "2px" }} />

                      <span>Free 30-day doorstep returns with prepaid return courier pickup.</span>

                    </div>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>



        {/* "Wear it with" */}

        <section style={{ marginTop: "100px", borderTop: "1px solid #D8CFC6", paddingTop: "60px" }}>

          <h2 style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "36px", color: "#302B28", marginBottom: "36px" }}>

            Wear it with

          </h2>

          <div className="aw-wear-grid">

            {complementaryProducts.map((comp) => (

              <div key={comp.id} style={{ display: "flex", flexDirection: "column", backgroundColor: "#FFFDFA", border: "1px solid #D8CFC6" }}>

                <div style={{ position: "relative", width: "100%", height: "320px", overflow: "hidden" }} className="aw-card-img-wrap">

                  <Image

                    src={comp.image}

                    alt={comp.name}

                    fill

                    sizes="(max-width: 768px) 100vw, 380px"

                    style={{ objectFit: "cover", transition: "opacity 0.5s ease, transform 0.5s ease" }}

                    className="aw-card-primary-img"

                  />

                  {comp.secondaryImage && (

                    <Image

                      src={comp.secondaryImage}

                      alt={`${comp.name} alternate view`}

                      fill

                      sizes="(max-width: 768px) 100vw, 380px"

                      style={{ objectFit: "cover", transition: "opacity 0.5s ease", opacity: 0 }}

                      className="aw-card-secondary-img"

                    />

                  )}

                </div>

                <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>

                  <p style={{ fontSize: "12px", color: "#69615B", margin: 0 }}>{comp.department}</p>

                  <h3 style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "18px", color: "#302B28", margin: 0 }}>

                    <Link href={`/product/${comp.slug}`} style={{ color: "inherit", textDecoration: "none" }}>{comp.name}</Link>

                  </h3>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>

                    <span style={{ fontWeight: 500, fontSize: "15px" }}>₹{comp.price.toLocaleString("en-IN")}</span>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                      <button

                        type="button"

                        onClick={() => addToCart(comp, comp.sizes[0])}

                        style={{ fontSize: "12px", color: "#713A48", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: "2px 0" }}

                      >

                        Quick add +

                      </button>

                      <span style={{ color: "#D8CFC6" }}>·</span>

                      <button

                        type="button"

                        onClick={() => {

                          addToCart(comp, comp.sizes[0]);

                          router.push("/checkout");

                        }}

                        style={{

                          fontSize: "11px",

                          fontWeight: 600,

                          color: "#713A48",

                          backgroundColor: "#FAF5EE",

                          border: "1px solid #713A48",

                          borderRadius: "2px",

                          padding: "2px 7px",

                          cursor: "pointer",

                        }}

                      >

                        Buy now

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>

      </div>



      {/* Size Guide & Fit Recommendation Modal */}

      <SizeGuideModal

        isOpen={sizeGuideOpen}

        onClose={() => setSizeGuideOpen(false)}

        department={product.department}

        onSelectSize={(sz) => setSelectedSize(sz)}

        currentSize={selectedSize}

        availableSizes={product.sizes}

      />



      {/* Scoped CSS */}

      <style>{`

        .aw-gallery-desktop {

          display: flex;

          gap: 12px;

          align-items: flex-start;

        }

        .aw-thumb-strip {

          display: flex;

          flex-direction: column;

          gap: 8px;

          flex-shrink: 0;

        }

        .aw-gallery-mobile {

          display: none;

        }

        .aw-pdp-layout {

          display: flex;

          gap: 64px;

          align-items: flex-start;

          width: 100%;

        }

        .aw-pdp-media {

          flex: 1;

          max-width: 720px;

          width: 100%;

          min-width: 0;

        }

        .aw-pdp-details {

          flex: 1;

          max-width: 560px;

          width: 100%;

          min-width: 0;

        }

        .aw-wear-grid {

          display: grid;

          grid-template-columns: repeat(3, minmax(0, 1fr));

          gap: 28px;

        }

        @media (max-width: 1023px) {

          .aw-pdp-container {

            padding: 20px 16px 60px !important;

          }

          .aw-pdp-layout {

            flex-direction: column !important;

            gap: 28px !important;

            align-items: stretch !important;

            width: 100% !important;

          }

          .aw-pdp-media, .aw-pdp-details {

            max-width: 100% !important;

            width: 100% !important;

          }

          .aw-gallery-desktop {

            display: none !important;

          }

          .aw-gallery-mobile {

            display: block !important;

            width: 100% !important;

          }

          .aw-wear-grid {

            grid-template-columns: 1fr;

            gap: 24px;

          }

        }

      `}</style>

    </div>

  );

}

