path = 'artifacts/rynas-wardrobe/src/components/catalog/ProductDetailView.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = '''                      <ChevronRight style={{ width: "18px", height: "18px", color: "#302B28" }} />

                    </button>

                  </>

                )}

              </div>

            </div>'''

replacement = '''                      <ChevronRight style={{ width: "18px", height: "18px", color: "#302B28" }} />

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

            </div>'''

text_norm = text.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in text_norm:
    text_norm = text_norm.replace(target_norm, replacement_norm, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print("Inserted Side-by-Side Preview Window successfully!")
else:
    print("WARNING: target not found")

