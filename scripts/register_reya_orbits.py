path = 'artifacts/rynas-wardrobe/src/config/orbitData.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Add new entries into PRODUCT_ORBIT_REGISTRY
new_registry_entries = '''  // 9. Aurelia Ribbed Gold Bangle
  "aurelia-ribbed-gold-bangle": [
    { degree: 0, label: "0° Studio Front", sublabel: "18k brushed gold ribbed contour", image: "/images/products/aurelia-ribbed-gold-bangle/front.jpg" },
    { degree: 45, label: "45° Three-Quarter", sublabel: "Sculptural cuff taper & interior curve", image: "/images/products/aurelia-ribbed-gold-bangle/three-quarter.jpg" },
    { degree: 90, label: "90° Profile Silhouette", sublabel: "Architectural wrist profile & bezel depth", image: "/images/products/aurelia-ribbed-gold-bangle/side.jpg" },
    { degree: 180, label: "180° Rear Clasp", sublabel: "Seamless hinge & safety clasp mechanism", image: "/images/products/aurelia-ribbed-gold-bangle/back.jpg" },
    { degree: 270, label: "270° Gold Texture", sublabel: "Hand-finished satin vermeil luster", image: "/images/products/aurelia-ribbed-gold-bangle/detail.jpg" },
    { degree: 360, label: "360° Dynamic Orbit", sublabel: "Balanced luster in ambient daylight", image: "/images/products/aurelia-ribbed-gold-bangle/walking.jpg" },
  ],

  // 10. Luna Baroque Pearl Choker
  "luna-baroque-pearl-choker": [
    { degree: 0, label: "0° Studio Front", sublabel: "Natural freshwater baroque pearl centerpiece", image: "/images/products/luna-baroque-pearl-choker/front.jpg" },
    { degree: 45, label: "45° Three-Quarter", sublabel: "Delicate 14k gold chain drape & pearl drop", image: "/images/products/luna-baroque-pearl-choker/three-quarter.jpg" },
    { degree: 90, label: "90° Profile Silhouette", sublabel: "Organic luster contour & clavicle alignment", image: "/images/products/luna-baroque-pearl-choker/side.jpg" },
    { degree: 180, label: "180° Rear Fastening", sublabel: "Adjustable chain extender & engraved tag", image: "/images/products/luna-baroque-pearl-choker/back.jpg" },
    { degree: 270, label: "270° Nacre Texture", sublabel: "Deep iridescent orient & fine surface details", image: "/images/products/luna-baroque-pearl-choker/detail.jpg" },
    { degree: 360, label: "360° Studio Drape", sublabel: "Effortless styling in natural illumination", image: "/images/products/luna-baroque-pearl-choker/walking.jpg" },
  ],

  // 11. Pavé Dome Statement Ring
  "pave-dome-statement-ring": [
    { degree: 0, label: "0° Studio Front", sublabel: "Pavé-set brilliance & rounded dome contour", image: "/images/products/pave-dome-statement-ring/front.jpg" },
    { degree: 45, label: "45° Three-Quarter", sublabel: "Sculpted band arch & side prong alignment", image: "/images/products/pave-dome-statement-ring/three-quarter.jpg" },
    { degree: 90, label: "90° Profile Silhouette", sublabel: "Substantial dome height & tapered shank", image: "/images/products/pave-dome-statement-ring/side.jpg" },
    { degree: 180, label: "180° Rear Shank", sublabel: "Solid comfort-fit under-gallery", image: "/images/products/pave-dome-statement-ring/back.jpg" },
    { degree: 270, label: "270° Pavé Detail", sublabel: "Micro-pavé stone setting under magnification", image: "/images/products/pave-dome-statement-ring/detail.jpg" },
    { degree: 360, label: "360° Complete Orbit", sublabel: "Hand-polished vermeil reflective finish", image: "/images/products/pave-dome-statement-ring/walking.jpg" },
  ],

  // 12. Celeste Structured Leather Crossbody
  "celeste-structured-leather-crossbody": [
    { degree: 0, label: "0° Studio Front", sublabel: "Clean architectural flap & brushed lock hardware", image: "/images/products/celeste-structured-leather-crossbody/front.jpg" },
    { degree: 45, label: "45° Three-Quarter", sublabel: "Accordion gusset & structured edge paint", image: "/images/products/celeste-structured-leather-crossbody/three-quarter.jpg" },
    { degree: 90, label: "90° Profile Silhouette", sublabel: "Side gusset depth & strap anchor rings", image: "/images/products/celeste-structured-leather-crossbody/side.jpg" },
    { degree: 180, label: "180° Rear Panel", sublabel: "Full-width exterior slip pocket & clean grain", image: "/images/products/celeste-structured-leather-crossbody/back.jpg" },
    { degree: 270, label: "270° Leather Grain", sublabel: "Semi-aniline Italian calfskin texture", image: "/images/products/celeste-structured-leather-crossbody/detail.jpg" },
    { degree: 360, label: "360° On-Figure Movement", sublabel: "Crossbody strap proportion in natural motion", image: "/images/products/celeste-structured-leather-crossbody/walking.jpg" },
  ],

  // 13. Cloud Knit Cashmere Scarf
  "cloud-knit-scarf": [
    { degree: 0, label: "0° Studio Front", sublabel: "Whisper-light ribbed knit & fringeless rolled hem", image: "/images/products/cloud-knit-scarf/front.jpg" },
    { degree: 45, label: "45° Three-Quarter", sublabel: "Generous wrap volume & airy drape", image: "/images/products/cloud-knit-scarf/three-quarter.jpg" },
    { degree: 90, label: "90° Profile Silhouette", sublabel: "Shoulder cascade & fluid fiber movement", image: "/images/products/cloud-knit-scarf/side.jpg" },
    { degree: 180, label: "180° Rear Drape", sublabel: "Full shawl back coverage & ribbed edge", image: "/images/products/cloud-knit-scarf/back.jpg" },
    { degree: 270, label: "270° Cashmere Fiber", sublabel: "Grade-A Mongolian cashmere fiber loft", image: "/images/products/cloud-knit-scarf/detail.jpg" },
    { degree: 360, label: "360° Runway Stride", sublabel: "Featherweight movement in natural light", image: "/images/products/cloud-knit-scarf/walking.jpg" },
  ],

  // 14. Astrid Cable-Knit Sweater
  "astrid-cable-knit-sweater": [
    { degree: 0, label: "0° Studio Front", sublabel: "Heritage honeycomb cable & crew neckline", image: "/images/products/astrid-cable-knit-sweater/front.jpg" },
    { degree: 45, label: "45° Three-Quarter", sublabel: "Drop shoulder ease & ribbed cuff taper", image: "/images/products/astrid-cable-knit-sweater/three-quarter.jpg" },
    { degree: 90, label: "90° Profile Silhouette", sublabel: "Sleeve cable alignment & body drape", image: "/images/products/astrid-cable-knit-sweater/side.jpg" },
    { degree: 180, label: "180° Rear Back", sublabel: "Continuous cable pattern across upper back", image: "/images/products/astrid-cable-knit-sweater/back.jpg" },
    { degree: 270, label: "270° Wool Texture", sublabel: "100% fine merino yarn definition", image: "/images/products/astrid-cable-knit-sweater/detail.jpg" },
    { degree: 360, label: "360° Studio Movement", sublabel: "Cozy relaxed proportion in studio light", image: "/images/products/astrid-cable-knit-sweater/walking.jpg" },
  ],

  // 15. Freya Pleated Merino Skirt
  "freya-pleated-merino-skirt": [
    { degree: 0, label: "0° Studio Front", sublabel: "Knife-pleated midi silhouette & flat waistband", image: "/images/products/freya-pleated-merino-skirt/front.jpg" },
    { degree: 45, label: "45° Three-Quarter", sublabel: "Fluid flare & rhythmic pleat opening", image: "/images/products/freya-pleated-merino-skirt/three-quarter.jpg" },
    { degree: 90, label: "90° Profile Silhouette", sublabel: "Clean A-line drop & floor-distance balance", image: "/images/products/freya-pleated-merino-skirt/side.jpg" },
    { degree: 180, label: "180° Rear Back", sublabel: "Concealed invisible zip & crisp pleat press", image: "/images/products/freya-pleated-merino-skirt/back.jpg" },
    { degree: 270, label: "270° Pleat Crease", sublabel: "Permanent heat-set pleat edge close-up", image: "/images/products/freya-pleated-merino-skirt/detail.jpg" },
    { degree: 360, label: "360° Stride Motion", sublabel: "Dynamic fluid swing in motion", image: "/images/products/freya-pleated-merino-skirt/walking.jpg" },
  ],

  // 16. Night Market Silk Satin Blouse
  "night-market-silk-blouse": [
    { degree: 0, label: "0° Studio Front", sublabel: "Liquid mulberry silk satin & mother-of-pearl buttons", image: "/images/products/night-market-silk-blouse/front.jpg" },
    { degree: 45, label: "45° Three-Quarter", sublabel: "Pointed collar drape & gathered cuff volume", image: "/images/products/night-market-silk-blouse/three-quarter.jpg" },
    { degree: 90, label: "90° Profile Silhouette", sublabel: "Curved hemline & French-seamed side split", image: "/images/products/night-market-silk-blouse/side.jpg" },
    { degree: 180, label: "180° Rear Yoke", sublabel: "Double-layered silk yoke & inverted center pleat", image: "/images/products/night-market-silk-blouse/back.jpg" },
    { degree: 270, label: "270° Silk Satin Sheen", sublabel: "22mm heavy momme silk weave under studio light", image: "/images/products/night-market-silk-blouse/detail.jpg" },
    { degree: 360, label: "360° Evening Movement", sublabel: "Luminous drape and fluid motion", image: "/images/products/night-market-silk-blouse/walking.jpg" },
  ],

  // 17. Elodie Corduroy Co-ord
  "elodie-corduroy-co-ord": [
    { degree: 0, label: "0° Studio Front", sublabel: "Fine-wale corduroy cropped overshirt & wide culotte", image: "/images/products/elodie-corduroy-co-ord/front.jpg" },
    { degree: 45, label: "45° Three-Quarter", sublabel: "Boxy silhouette & horn button accents", image: "/images/products/elodie-corduroy-co-ord/three-quarter.jpg" },
    { degree: 90, label: "90° Profile Silhouette", sublabel: "Straight leg drop & clean sleeve cuff line", image: "/images/products/elodie-corduroy-co-ord/side.jpg" },
    { degree: 180, label: "180° Rear Back", sublabel: "Clean back rise & structured shoulder yoke", image: "/images/products/elodie-corduroy-co-ord/back.jpg" },
    { degree: 270, label: "270° Corduroy Texture", sublabel: "Velvety 16-wale cotton rib close-up", image: "/images/products/elodie-corduroy-co-ord/detail.jpg" },
    { degree: 360, label: "360° Studio Stride", sublabel: "Warm autumnal two-piece in natural stride", image: "/images/products/elodie-corduroy-co-ord/walking.jpg" },
  ],
};'''

text = text.replace('  // 8. Cashmere Crewneck Jumper\n  "cashmere-crewneck-jumper": [\n    {\n      degree: 0,\n      label: "0° Studio Front",\n      sublabel: "Relaxed drop-shoulder & fine rib crewneck",\n      image: "/images/cashmere-crewneck-jumper.jpg",\n    },\n    {\n      degree: 90,\n      label: "90° Editorial Silhouette",\n      sublabel: "Fluid drape on model in natural light",\n      image: "/images/cashmere-jumper-model.jpg",\n    },\n    {\n      degree: 180,\n      label: "180° Apricot Colorway",\n      sublabel: "Alternative warm apricot tone perspective",\n      image: "/images/cashmere-jumper-apricot.jpg",\n    },\n  ],\n};',
'  // 8. Cashmere Crewneck Jumper\n  "cashmere-crewneck-jumper": [\n    {\n      degree: 0,\n      label: "0° Studio Front",\n      sublabel: "Relaxed drop-shoulder & fine rib crewneck",\n      image: "/images/cashmere-crewneck-jumper.jpg",\n    },\n    {\n      degree: 90,\n      label: "90° Editorial Silhouette",\n      sublabel: "Fluid drape on model in natural light",\n      image: "/images/cashmere-jumper-model.jpg",\n    },\n    {\n      degree: 180,\n      label: "180° Apricot Colorway",\n      sublabel: "Alternative warm apricot tone perspective",\n      image: "/images/cashmere-jumper-apricot.jpg",\n    },\n  ],\n' + new_registry_entries)

# Also update PRODUCT_ORBIT_VIDEOS to register video orbits for all new products
new_videos = '''export const PRODUCT_ORBIT_VIDEOS: Record<string, string> = {
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

old_videos_pattern = '''export const PRODUCT_ORBIT_VIDEOS: Record<string, string> = {
  "midnight-velvet-slip-dress": "/videos/midnight_velvet_slip_dress_360_orbit.mp4",
  "prod-midnight-velvet-dress": "/videos/midnight_velvet_slip_dress_360_orbit.mp4",
};'''

text = text.replace(old_videos_pattern, new_videos)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated orbitData.ts with new 6-angle studio frames and 360 videos!")

