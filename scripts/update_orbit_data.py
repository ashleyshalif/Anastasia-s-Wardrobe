path = 'artifacts/rynas-wardrobe/src/config/orbitData.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = '''  // 17. Elodie Corduroy Co-ord
  "elodie-corduroy-co-ord": [
    { degree: 0, label: "0° Studio Front", sublabel: "Fine-wale corduroy cropped overshirt & wide culotte", image: "/images/products/elodie-corduroy-co-ord/front.jpg" },
    { degree: 45, label: "45° Three-Quarter", sublabel: "Boxy silhouette & horn button accents", image: "/images/products/elodie-corduroy-co-ord/three-quarter.jpg" },
    { degree: 90, label: "90° Profile Silhouette", sublabel: "Straight leg drop & clean sleeve cuff line", image: "/images/products/elodie-corduroy-co-ord/side.jpg" },
    { degree: 180, label: "180° Rear Back", sublabel: "Clean back rise & structured shoulder yoke", image: "/images/products/elodie-corduroy-co-ord/back.jpg" },
    { degree: 270, label: "270° Corduroy Texture", sublabel: "Velvety 16-wale cotton rib close-up", image: "/images/products/elodie-corduroy-co-ord/detail.jpg" },
    { degree: 360, label: "360° Studio Stride", sublabel: "Warm autumnal two-piece in natural stride", image: "/images/products/elodie-corduroy-co-ord/walking.jpg" },
  ],
};

/**
 * Dedicated 360° Orbit Videos for Haute Couture pieces
 */
export const PRODUCT_ORBIT_VIDEOS: Record<string, string> = {
  "midnight-velvet-slip-dress": "/videos/midnight_velvet_slip_dress_360_orbit.mp4",
  "prod-midnight-velvet-dress": "/videos/midnight_velvet_slip_dress_360_orbit.mp4",
  "aurelia-ribbed-gold-bangle": "/images/products/aurelia-ribbed-gold-bangle/orbit-360.mp4",
  "luna-baroque-pearl-choker": "/images/products/luna-baroque-pearl-choker/orbit-360.mp4",
  "pave-dome-statement-ring": "/images/products/pave-dome-statement-ring/orbit-360.mp4",
  "celeste-structured-leather-crossbody": "/images/products/celeste-structured-leather-crossbody/orbit-360.mp4",
  "cloud-knit-scarf": "/images/products/cloud-knit-scarf/orbit-360.mp4",
  "astrid-cable-knit-sweater": "/images/products/astrid-cable-knit-sweater/orbit-360.mp4",
  "freya-pleated-merino-skirt": "/images/products/freya-pleated-merino-skirt/orbit-360.mp4",
  "night-market-silk-blouse": "/images/products/night-market-silk-blouse/orbit-360.mp4",
  "sunday-wool-cardigan": "/images/products/sunday-wool-cardigan/orbit-360.mp4",
  "elodie-corduroy-co-ord": "/images/products/elodie-corduroy-co-ord/orbit-360.mp4",
};'''

replacement = '''  // 17. Elodie Corduroy Co-ord
  "elodie-corduroy-co-ord": [
    { degree: 0, label: "0° Studio Front", sublabel: "Fine-wale corduroy cropped overshirt & wide culotte", image: "/images/products/elodie-corduroy-co-ord/front.jpg" },
    { degree: 45, label: "45° Three-Quarter", sublabel: "Boxy silhouette & horn button accents", image: "/images/products/elodie-corduroy-co-ord/three-quarter.jpg" },
    { degree: 90, label: "90° Profile Silhouette", sublabel: "Straight leg drop & clean sleeve cuff line", image: "/images/products/elodie-corduroy-co-ord/side.jpg" },
    { degree: 180, label: "180° Rear Back", sublabel: "Clean back rise & structured shoulder yoke", image: "/images/products/elodie-corduroy-co-ord/back.jpg" },
    { degree: 270, label: "270° Corduroy Texture", sublabel: "Velvety 16-wale cotton rib close-up", image: "/images/products/elodie-corduroy-co-ord/detail.jpg" },
    { degree: 360, label: "360° Studio Stride", sublabel: "Warm autumnal two-piece in natural stride", image: "/images/products/elodie-corduroy-co-ord/walking.jpg" },
  ],

  // 18. Primrose Smocked Linen Sundress (Girls 2-12)
  "primrose-smocked-linen-sundress": [
    { degree: 0, label: "0° Studio Front", sublabel: "Artisan hand-smocked bodice & flutter ruffled shoulder straps", image: "/images/products/primrose-sundress/front.jpg" },
    { degree: 90, label: "90° Profile Silhouette", sublabel: "Breezy A-line tiered silhouette & natural drape", image: "/images/products/primrose-sundress/movement.jpg" },
    { degree: 180, label: "180° Rear Drape", sublabel: "Mother-of-pearl back closure & clean finished hem", image: "/images/products/primrose-sundress/front.jpg" },
    { degree: 270, label: "270° Smocking Craft", sublabel: "Handcrafted honeycomb smocking & delicate embroidery", image: "/images/products/primrose-sundress/detail.jpg" },
    { degree: 360, label: "360° Studio Twirl", sublabel: "Lightweight European washed linen in playful movement", image: "/images/products/primrose-sundress/movement.jpg" },
  ],
};

/**
 * Dedicated 360° Orbit Videos (Disabled to guarantee silky smooth, zero-latency 6-angle interactive photo orbits and avoid browser codec black screens)
 */
export const PRODUCT_ORBIT_VIDEOS: Record<string, string> = {};'''

assert target in text, 'Target not found'
new_text = text.replace(target, replacement, 1)
with open(path, 'w', encoding='utf-8') as f:
    f.write(new_text)
print('Successfully updated orbitData.ts')

