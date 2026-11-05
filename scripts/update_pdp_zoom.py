path = 'artifacts/rynas-wardrobe/src/components/catalog/ProductDetailView.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update import
text = text.replace(
    'import { getProduct360Angles } from "@/config/orbitData";',
    'import { getProduct360Angles, getProduct360Video } from "@/config/orbitData";'
)

# 2. Update hooks
old_orbit_hook = '''  const product360Angles = useMemo(() => {
    return product ? getProduct360Angles(product.slug, product.id) : null;
  }, [product?.slug, product?.id]);
  const has360Orbit = Boolean(product360Angles && product360Angles.length >= 3);'''

new_orbit_hook = '''  const product360Angles = useMemo(() => {
    return product ? getProduct360Angles(product.slug, product.id) : null;
  }, [product?.slug, product?.id]);
  const product360Video = useMemo(() => {
    return product ? getProduct360Video(product.slug, product.id) : null;
  }, [product?.slug, product?.id]);
  const has360Orbit = Boolean((product360Angles && product360Angles.length >= 3) || product360Video);'''

text = text.replace(old_orbit_hook, new_orbit_hook)

# 3. Update 360 button label
old_360_btn = '<span>360° Studio Orbit ({product360Angles!.length} Views)</span>'
new_360_btn = '<span>360° Studio Orbit {product360Video ? "(Turntable)" : `(${product360Angles?.length || 0} Views)`}</span>'
text = text.replace(old_360_btn, new_360_btn)

# 4. Update Atelier360Viewer call
old_viewer_call = '''                <Atelier360Viewer
                  productName={product.name}
                  price={product.price}
                  category={product.department}
                  angles={product360Angles!}
                  showBuyBar={false}
                />'''

new_viewer_call = '''                <Atelier360Viewer
                  productName={product.name}
                  price={product.price}
                  category={product.department}
                  angles={product360Angles ?? undefined}
                  videoUrl={product360Video ?? undefined}
                  showBuyBar={false}
                />'''
text = text.replace(old_viewer_call, new_viewer_call)

# 5. Update main image zoom to side-by-side zoom window
old_main_img_block = '''              {/* Main image with zoom */}

              <div

                ref={mainImageRef}

                className="aw-pdp-main-image"

                style={{

                  position: "relative",

                  flex: 1,

                  height: "640px",

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

                  <Image

                    src={displayImageUrl}

                    alt={activeImage?.alt || product.name}

                    fill

                    priority

                    sizes="(max-width: 1024px) 100vw, 680px"

                    style={{

                      objectFit: "cover",

                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,

                      transform: isZoomed ? "scale(2.2)" : "scale(1)",

                      transition: isZoomed ? "none" : "transform 0.3s ease",

                    }}

                  />

                ) : ('''

new_main_img_block = '''              {/* Main image with Nykaa-Style Side-by-Side Zoom Window */}
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
                  ) : ('''

# Normalize and replace
text_norm = text.replace('\r\n', '\n')
old_norm = old_main_img_block.replace('\r\n', '\n')
new_norm = new_main_img_block.replace('\r\n', '\n')

if old_norm in text_norm:
    text_norm = text_norm.replace(old_norm, new_norm)
    # Also find closing </div> of mainImageRef to add the side preview window and close the wrapper
    # Let's locate the placeholder block closing
    print("Found old main img block, updating...")
else:
    print("WARNING: Could not find exact old main img block")

with open(path, 'w', encoding='utf-8') as f:
    f.write(text_norm)
print("Updated ProductDetailView.tsx stage 1")

