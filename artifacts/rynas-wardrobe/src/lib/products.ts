import { Product } from "@/types/product";
import { isCategoryEnabled } from "@/config/catalog";

/**
 * OFFLINE FALLBACK DATA — only served when the Django backend is unreachable.
 * All products are managed in Django Admin. This array is kept as a safety net
 * so the site is never completely empty.
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    "id": "prod-aurelia-gold-bangle",
    "slug": "aurelia-ribbed-gold-bangle",
    "name": "Aurelia Ribbed Gold Bangle",
    "category": "jewellery",
    "department": "Jewellery · 18k Gold Plated",
    "price": 3490,
    "originalPrice": 4200,
    "saleNote": "Save ₹710",
    "currency": "INR",
    "color": "Gold",
    "colorHex": "#D4AF37",
    "sizes": ["One Size"],
    "image": "/images/products/aurelia-ribbed-gold-bangle/front.jpg",
    "secondaryImage": "/images/products/aurelia-ribbed-gold-bangle/three-quarter.jpg",
    "galleryImages": [
      "/images/products/aurelia-ribbed-gold-bangle/front.jpg",
      "/images/products/aurelia-ribbed-gold-bangle/three-quarter.jpg",
      "/images/products/aurelia-ribbed-gold-bangle/side.jpg",
      "/images/products/aurelia-ribbed-gold-bangle/detail.jpg",
      "/images/products/aurelia-ribbed-gold-bangle/back.jpg",
      "/images/products/aurelia-ribbed-gold-bangle/walking.jpg"
    ],
    "description": "Sculptural ribbed bangle hand-cast in recycled brass with heavy 18k gold vermeil finish.",
    "details": ["Hinged clasp closure", "Hypoallergenic & nickel-free", "Interior engraved hallmark"],
    "fabric": "18k Gold Vermeil on Recycled Brass",
    "care": "Wipe with a soft polishing cloth. Avoid moisture and perfume.",
    "badge": "ATELIER",
    "inStock": true
  },
  {
    "id": "prod-luna-pearl-choker",
    "slug": "luna-baroque-pearl-choker",
    "name": "Luna Baroque Pearl Choker",
    "category": "jewellery",
    "department": "Jewellery · Freshwater Pearl",
    "price": 4290,
    "originalPrice": 5190,
    "saleNote": "Save ₹900",
    "currency": "INR",
    "color": "Pearl / Gold",
    "colorHex": "#F4EFEA",
    "sizes": ["One Size (16-18 inches adjustable)"],
    "image": "/images/products/luna-baroque-pearl-choker/front.jpg",
    "secondaryImage": "/images/products/luna-baroque-pearl-choker/three-quarter.jpg",
    "galleryImages": [
      "/images/products/luna-baroque-pearl-choker/front.jpg",
      "/images/products/luna-baroque-pearl-choker/three-quarter.jpg",
      "/images/products/luna-baroque-pearl-choker/side.jpg",
      "/images/products/luna-baroque-pearl-choker/detail.jpg",
      "/images/products/luna-baroque-pearl-choker/back.jpg",
      "/images/products/luna-baroque-pearl-choker/walking.jpg"
    ],
    "description": "Individually knotted hand-selected organic baroque freshwater pearls with 18k gold toggle clasp.",
    "details": ["18k gold plated toggle clasp", "Individual silk knotting", "Organic irregular pearls, each unique"],
    "fabric": "Cultured Freshwater Baroque Pearls",
    "care": "Store flat in velvet pouch. Clean with damp silk cloth.",
    "badge": "SIGNATURE",
    "inStock": true
  },
  {
    "id": "prod-pave-dome-ring",
    "slug": "pave-dome-statement-ring",
    "name": "Pavé Dome Statement Ring",
    "category": "jewellery",
    "department": "Jewellery · Brushed Gold",
    "price": 2190,
    "currency": "INR",
    "color": "Gold",
    "colorHex": "#D4AF37",
    "sizes": ["Small (US 6)", "Medium (US 7)", "Large (US 8)"],
    "image": "/images/products/pave-dome-statement-ring/front.jpg",
    "secondaryImage": "/images/products/pave-dome-statement-ring/three-quarter.jpg",
    "galleryImages": [
      "/images/products/pave-dome-statement-ring/front.jpg",
      "/images/products/pave-dome-statement-ring/three-quarter.jpg",
      "/images/products/pave-dome-statement-ring/side.jpg",
      "/images/products/pave-dome-statement-ring/detail.jpg",
      "/images/products/pave-dome-statement-ring/back.jpg",
      "/images/products/pave-dome-statement-ring/walking.jpg"
    ],
    "description": "Smooth sculptural croissant dome ring with brushed satin finish and comfort-fit interior curve.",
    "details": ["Solid cast weight", "Smooth comfort-fit inner shank", "Tarnish-resistant coating"],
    "fabric": "18k Brushed Gold Plated",
    "care": "Wipe clean with jewelry cloth.",
    "badge": "CLASSIC",
    "inStock": true
  },
  {
    "id": "prod-celeste-crossbody",
    "slug": "celeste-structured-leather-crossbody",
    "name": "Celeste Structured Leather Crossbody",
    "category": "gifts",
    "department": "Accessories · Italian Nappa",
    "price": 6890,
    "originalPrice": 8490,
    "saleNote": "Save ₹1,600",
    "currency": "INR",
    "color": "Espresso",
    "colorHex": "#302B28",
    "sizes": ["One Size"],
    "image": "/images/products/celeste-structured-leather-crossbody/front.jpg",
    "description": "Box silhouette crafted from supple full-grain leather with magnetic front flap and tonal leather strap.",
    "details": ["Magnetic foldover flap", "Internal card slip pocket", "Adjustable shoulder strap"],
    "fabric": "100% Full-Grain Calfskin Leather",
    "care": "Condition periodically with natural leather cream.",
    "badge": "NEW",
    "inStock": true
  },
  {
    "id": "prod-astrid-sweater",
    "slug": "astrid-cable-knit-sweater",
    "name": "Astrid Cable-Knit Sweater",
    "category": "teens",
    "department": "Teens · 13–17",
    "price": 4290,
    "originalPrice": 5290,
    "saleNote": "Save ₹1,000",
    "currency": "INR",
    "color": "Oat Cream",
    "colorHex": "#F4EFEA",
    "sizes": ["XS", "S", "M", "L"],
    "image": "/images/products/astrid-cable-knit-sweater/front.jpg",
    "description": "Chunky traditional cable-knit sweater with relaxed drop shoulders and cozy crew neckline.",
    "details": ["Classic heritage cable stitch", "Ribbed collar, cuffs, and hem", "Relaxed slouchy drape"],
    "fabric": "100% Pure Lambswool",
    "care": "Hand wash gently in cold water.",
    "badge": "BESTSELLER",
    "inStock": true
  },
  {
    "id": "prod-freya-skirt",
    "slug": "freya-pleated-merino-skirt",
    "name": "Freya Pleated Merino Skirt",
    "category": "teens",
    "department": "Teens · 13–17",
    "price": 3490,
    "currency": "INR",
    "color": "Midnight Navy",
    "colorHex": "#1E2530",
    "sizes": ["XS", "S", "M", "L"],
    "image": "/images/products/freya-pleated-merino-skirt/front.jpg",
    "description": "Permanent-pleat A-line skirt woven from fine merino wool blend with concealed side zip.",
    "details": ["Sharp permanent box pleats", "Concealed invisible side zipper", "Above-the-knee tailored length"],
    "fabric": "55% Merino Wool, 45% Organic Cotton",
    "care": "Dry clean or hand wash cold.",
    "badge": "CLASSIC",
    "inStock": true
  },
  {
    "id": "prod-primrose-dress",
    "slug": "primrose-smocked-linen-sundress",
    "name": "Primrose Smocked Linen Sundress",
    "category": "girls",
    "department": "Girls · 2–12",
    "price": 2790,
    "originalPrice": 3490,
    "saleNote": "Save ₹700",
    "currency": "INR",
    "color": "Dusty Rose",
    "colorHex": "#D8A4A9",
    "sizes": ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"],
    "image": "/images/products/primrose-sundress/front.jpg",
    "secondaryImage": "/images/products/primrose-sundress/detail.jpg",
    "galleryImages": [
      "/images/products/primrose-sundress/front.jpg",
      "/images/products/primrose-sundress/detail.jpg",
      "/images/products/primrose-sundress/movement.jpg"
    ],
    "description": "Artisan hand-smocked bodice with delicate ruffled shoulder straps and full tiered skirt.",
    "details": ["Elasticated hand-smocked chest", "Mother-of-pearl back button closure", "Pre-washed for cloud-like softness"],
    "fabric": "100% European Washed Linen",
    "care": "Gentle machine wash cold.",
    "badge": "SUMMER EDIT",
    "inStock": true
  },
  {
    "id": "prod-clementine-cardigan",
    "slug": "clementine-merino-knit-cardigan",
    "name": "Clementine Merino Knit Cardigan",
    "category": "girls",
    "department": "Girls · 2–12",
    "price": 3190,
    "currency": "INR",
    "color": "Buttercream",
    "colorHex": "#FAF3E0",
    "sizes": ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"],
    "image": "/images/cardigan-model.jpg",
    "description": "Sweet pointelle-knit cardigan with scalloped edges and carved natural wood buttons.",
    "details": ["Delicate floral pointelle stitch", "Scalloped edge collar and cuffs", "Natural wood button closure"],
    "fabric": "100% Extra-Fine Merino Wool",
    "care": "Gentle hand wash cold.",
    "badge": "HERITAGE",
    "inStock": true
  },

  {
    "id": "prod-cashmere-jumper",
    "slug": "cashmere-crewneck-jumper",
    "name": "Cashmere Crewneck Jumper",
    "category": "women",
    "department": "Women",
    "price": 7490,
    "originalPrice": 8990,
    "saleNote": "Sale \u00b7 Save \u20b91,500",
    "currency": "INR",
    "color": "Brown",
    "colorHex": "#6E473B",
    "availableColors": [
      {
        "name": "Brown",
        "hex": "#6E473B"
      },
      {
        "name": "Apricot",
        "hex": "#E7C9A9"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "image": "/images/cashmere-crewneck-jumper.jpg",
    "secondaryImage": "/images/cardigan-detail.jpg",
    "galleryImages": [
      "/images/cashmere-jumper-model.jpg"
    ],
    "description": "A luxurious cashmere-blend crewneck jumper with a relaxed drop-shoulder silhouette, fine ribbing, and an extraordinarily soft hand-feel.",
    "details": [
      "70% Cashmere, 30% Merino Wool",
      "Classic crew neckline",
      "Subtle ribbed cuffs and hem",
      "Relaxed drop-shoulder silhouette"
    ],
    "fabric": "70% Cashmere, 30% Merino Wool",
    "care": "Hand wash gently in cold water with mild wool detergent. Lay flat to dry.",
    "badge": "NEW-IN",
    "inStock": true
  },
  {
    "id": "prod-sunday-cardigan",
    "slug": "sunday-wool-cardigan",
    "name": "Sunday wool cardigan",
    "category": "women",
    "department": "Women",
    "price": 4890,
    "currency": "INR",
    "color": "Oat",
    "colorHex": "#D9CDB8",
    "availableColors": [
      {
        "name": "Oat",
        "hex": "#D9CDB8"
      },
      {
        "name": "Rosewood",
        "hex": "#713A48"
      },
      {
        "name": "Sage",
        "hex": "#5C6A53"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "image": "/images/products/sunday-wool-cardigan/front.jpg",
    "secondaryImage": "/images/products/sunday-wool-cardigan/side.jpg",
    "galleryImages": [
      "/images/cardigan-model.jpg",
      "/images/cardigan-detail.jpg"
    ],
    "description": "Spun from heavyweight merino wool with horn buttons and a relaxed, drop-shoulder silhouette.",
    "details": [
      "100% extra-fine merino wool",
      "Natural horn button fastening",
      "Subtle ribbed cuffs and hem",
      "Designed for a relaxed fit; take your usual size"
    ],
    "fabric": "100% Merino Wool",
    "care": "Hand wash cold or dry clean gently.",
    "badge": "SOFT COTTON",
    "inStock": true,
    "originalPrice": 5990,
    "saleNote": "Sale \u00b7 Save \u20b91,100"
  },
  {
    "id": "prod-garden-dress",
    "slug": "garden-cotton-dress",
    "name": "Garden cotton dress",
    "category": "girls",
    "department": "Girls \u00b7 2\u201312",
    "price": 3290,
    "currency": "INR",
    "color": "Rosewood",
    "colorHex": "#713A48",
    "availableColors": [
      {
        "name": "Rosewood",
        "hex": "#713A48"
      },
      {
        "name": "Oat",
        "hex": "#E8DFC5"
      }
    ],
    "sizes": [
      "2-3 Y",
      "4-5 Y",
      "6-7 Y",
      "8-9 Y",
      "10-12 Y"
    ],
    "image": "/images/dress.png",
    "secondaryImage": "/images/garden-dress-model.jpg",
    "galleryImages": [
      "/images/garden-dress-model.jpg",
      "/images/garden-dress-side.jpg",
      "/images/garden-dress-back.jpg",
      "/images/garden-dress-detail.jpg",
      "/images/garden-dress-garden.jpg"
    ],
    "description": "Cut from airy washed poplin with delicate smocking, hand-stitched details and soft gathered sleeves.",
    "details": [
      "100% organic cotton poplin",
      "Hand-finished smocking at bodice",
      "Concealed mother-of-pearl buttons at back"
    ],
    "fabric": "100% Organic Cotton",
    "care": "Machine wash delicate at 30\u00b0C.",
    "badge": "BESTSELLER",
    "inStock": true
  },
  {
    "id": "prod-amelie-wrap-dress",
    "slug": "amelie-wrap-midi-dress",
    "name": "Amelie wrap midi dress",
    "category": "women",
    "department": "Women",
    "price": 5890,
    "currency": "INR",
    "color": "Burgundy",
    "colorHex": "#5E2533",
    "availableColors": [
      {
        "name": "Burgundy",
        "hex": "#5E2533"
      },
      {
        "name": "Forest",
        "hex": "#354637"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "/images/wrap-dress.png",
    "secondaryImage": "/images/wrap-dress-model.jpg",
    "galleryImages": [
      "/images/wrap-dress-model.jpg"
    ],
    "description": "An elegant wrap dress cut in draped modal-linen with flutter sleeves and an adjustable waist sash.",
    "details": [
      "70% Lenzing Modal, 30% Belgian Linen",
      "Graceful midi hemline",
      "Inner stay button for secure closure"
    ],
    "fabric": "Modal Linen Blend",
    "care": "Cool hand wash or gentle cycle.",
    "badge": "NEW COLOUR",
    "inStock": true,
    "originalPrice": 6990,
    "saleNote": "Sale \u00b7 Save \u20b91,100"
  },
  {
    "id": "prod-daisy-co-ord",
    "slug": "daisy-cotton-co-ord",
    "name": "Daisy cotton co-ord",
    "category": "girls",
    "department": "Girls \u00b7 2\u20136",
    "price": 3490,
    "currency": "INR",
    "color": "Buttercream Floral",
    "colorHex": "#F2E8D5",
    "availableColors": [
      {
        "name": "Buttercream Floral",
        "hex": "#F2E8D5"
      },
      {
        "name": "Sage Floral",
        "hex": "#D8E0D2"
      }
    ],
    "sizes": [
      "2-3 Y",
      "4-5 Y",
      "5-6 Y"
    ],
    "image": "/images/coord.png",
    "secondaryImage": "/images/coord-model.jpg",
    "galleryImages": [
      "/images/coord-model.jpg"
    ],
    "description": "Lightweight summer two-piece with scalloped collar and elasticated bloomer shorts.",
    "details": [
      "100% printed lawn cotton",
      "Scalloped Peter Pan collar",
      "Soft elastic waistband"
    ],
    "fabric": "100% Lawn Cotton",
    "care": "Machine wash at 30\u00b0C.",
    "badge": "JUST IN",
    "inStock": true
  },
  {
    "id": "prod-willow-coat",
    "slug": "willow-wool-coat",
    "name": "Willow wool coat",
    "category": "teens",
    "department": "Teens \u00b7 13\u201317",
    "price": 9990,
    "currency": "INR",
    "color": "Chestnut",
    "colorHex": "#8B4513",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "image": "/images/willow-coat-model.jpg",
    "secondaryImage": "/images/willow-coat-model.jpg",
    "galleryImages": [
      "/images/willow-coat-model.jpg"
    ],
    "description": "Tailored in boiled wool with a double-breasted closure and roomy welt pockets.",
    "details": [
      "100% boiled wool",
      "Satin twill lining",
      "Horn buttons"
    ],
    "fabric": "100% Boiled Wool",
    "care": "Dry clean only.",
    "badge": "WINTER EDIT",
    "inStock": true,
    "originalPrice": 12990,
    "saleNote": "Sale \u00b7 Save \u20b93,000"
  },
  {
    "id": "prod-cloud-scarf",
    "slug": "cloud-knit-scarf",
    "name": "Cloud knit scarf",
    "category": "gifts",
    "department": "Gifts \u00b7 Accessories",
    "price": 2490,
    "currency": "INR",
    "color": "Mulberry",
    "colorHex": "#5C2434",
    "sizes": [
      "One Size"
    ],
    "image": "/images/products/cloud-knit-scarf/front.jpg",
    "secondaryImage": "/images/products/cloud-knit-scarf/side.jpg",
    "galleryImages": [
      "/images/cloud-knit-scarf.jpg",
      "/images/scarf-model.jpg"
    ],
    "description": "Fluffy ribbed scarf in an alpaca-wool blend with fringed ends.",
    "details": [
      "60% Alpaca, 40% Merino Wool",
      "Super-soft brushed finish"
    ],
    "fabric": "Alpaca Merino Blend",
    "care": "Hand wash cold.",
    "badge": "GIFT IDEA",
    "inStock": true
  },
  {
    "id": "prod-velvet-pouch",
    "slug": "keepsake-velvet-pouch",
    "name": "Keepsake velvet pouch",
    "category": "gifts",
    "department": "Gifts \u00b7 Wine",
    "price": 1490,
    "originalPrice": 1990,
    "saleNote": "Sale \u00b7 save \u20b9500",
    "currency": "INR",
    "color": "Wine",
    "colorHex": "#713A48",
    "sizes": [
      "One Size"
    ],
    "image": "/images/keepsake-velvet-pouch.jpg",
    "description": "Quilted silk-velvet pouch with gold cord tassel drawstring, ideal for treasured small items.",
    "details": [
      "Silk-rayon velvet",
      "Braided metallic cord drawstring",
      "Satin lined"
    ],
    "fabric": "Silk-Rayon Velvet",
    "care": "Spot clean only.",
    "badge": "SALE",
    "inStock": true,
    "galleryImages": [
      "/images/keepsake-velvet-pouch.jpg"
    ]
  },
  {
    "id": "prod-camille-tailored-blazer",
    "slug": "camille-tailored-blazer",
    "name": "Camille Tailored Blazer",
    "category": "women",
    "department": "Women",
    "price": 6990,
    "originalPrice": 8490,
    "saleNote": "Sale \u00b7 Save \u20b91,500",
    "currency": "INR",
    "color": "Taupe",
    "colorHex": "#A49483",
    "availableColors": [
      {
        "name": "Taupe",
        "hex": "#A49483"
      },
      {
        "name": "Black",
        "hex": "#1F1E1D"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "image": "/images/products/camille-blazer/front.jpg",
    "secondaryImage": "/images/products/camille-blazer/walking.jpg",
    "galleryImages": [
      "/images/products/camille-blazer/front.jpg",
      "/images/products/camille-blazer/back.jpg",
      "/images/products/camille-blazer/side.jpg",
      "/images/products/camille-blazer/three-quarter.jpg",
      "/images/products/camille-blazer/detail.jpg",
      "/images/products/camille-blazer/walking.jpg"
    ],
    "images": [
      {
        "id": "cb_1",
        "url": "/images/products/camille-blazer/front.jpg",
        "thumbnailUrl": "/images/products/camille-blazer/front.jpg",
        "angle": "front",
        "alt": "Camille Tailored Blazer - Front View",
        "position": 0,
        "isPrimary": true
      },
      {
        "id": "cb_2",
        "url": "/images/products/camille-blazer/back.jpg",
        "thumbnailUrl": "/images/products/camille-blazer/back.jpg",
        "angle": "back",
        "alt": "Camille Tailored Blazer - Back View",
        "position": 1,
        "isPrimary": false
      },
      {
        "id": "cb_3",
        "url": "/images/products/camille-blazer/side.jpg",
        "thumbnailUrl": "/images/products/camille-blazer/side.jpg",
        "angle": "side",
        "alt": "Camille Tailored Blazer - Side Profile",
        "position": 2,
        "isPrimary": false
      },
      {
        "id": "cb_4",
        "url": "/images/products/camille-blazer/three-quarter.jpg",
        "thumbnailUrl": "/images/products/camille-blazer/three-quarter.jpg",
        "angle": "three-quarter",
        "alt": "Camille Tailored Blazer - Three-Quarter Angle",
        "position": 3,
        "isPrimary": false
      },
      {
        "id": "cb_5",
        "url": "/images/products/camille-blazer/detail.jpg",
        "thumbnailUrl": "/images/products/camille-blazer/detail.jpg",
        "angle": "detail",
        "alt": "Camille Tailored Blazer - Fabric & Horn Button Detail",
        "position": 4,
        "isPrimary": false
      },
      {
        "id": "cb_6",
        "url": "/images/products/camille-blazer/walking.jpg",
        "thumbnailUrl": "/images/products/camille-blazer/walking.jpg",
        "angle": "lifestyle",
        "alt": "Camille Tailored Blazer - Styled Walking Movement",
        "position": 5,
        "isPrimary": false
      }
    ],
    "description": "A refined oversized blazer in soft taupe suiting canvas with architectural shoulders, notched lapels, and horn-effect buttons. Designed with a borrowed-from-the-boys silhouette that falls gracefully over slip dresses or tailored denim.",
    "details": [
      "60% Wool, 40% Viscose structured suiting canvas",
      "Tailored lightly padded shoulders for structured silhouette",
      "Single horn-effect button closure with deep notched lapel",
      "Two welt flap pockets and back walking vent",
      "Full silky satin twill lining",
      "Cut for a contemporary relaxed oversized fit"
    ],
    "fabric": "Wool-Viscose Canvas Suiting",
    "care": "Dry clean only. Gentle steam when needed.",
    "badge": "NEW-IN",
    "inStock": true
  },
  {
    "id": "prod-elodie-corduroy-coord",
    "slug": "elodie-corduroy-co-ord",
    "name": "Elodie Corduroy Co-ord",
    "category": "women",
    "department": "Women",
    "price": 5990,
    "originalPrice": 5490,
    "saleNote": "Sale \u00b7 Save \u20b91,300",
    "currency": "INR",
    "color": "Espresso Brown",
    "colorHex": "#4D3528",
    "availableColors": [
      {
        "name": "Espresso Brown",
        "hex": "#4D3528"
      },
      {
        "name": "Forest",
        "hex": "#2C4A35"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "image": "/images/products/elodie-corduroy-co-ord/front.jpg",
    "secondaryImage": "/images/products/elodie-corduroy-co-ord/side.jpg",
    "galleryImages": [
      "/images/products/elodie-coord/front.jpg",
      "/images/products/elodie-coord/back.jpg",
      "/images/products/elodie-coord/side.jpg",
      "/images/products/elodie-coord/three-quarter.jpg",
      "/images/products/elodie-coord/detail.jpg",
      "/images/products/elodie-coord/walking.jpg"
    ],
    "images": [
      {
        "id": "ec_1",
        "url": "/images/products/elodie-coord/front.jpg",
        "thumbnailUrl": "/images/products/elodie-coord/front.jpg",
        "angle": "front",
        "alt": "Elodie Corduroy Co-ord - Front View",
        "position": 0,
        "isPrimary": true
      },
      {
        "id": "ec_2",
        "url": "/images/products/elodie-coord/back.jpg",
        "thumbnailUrl": "/images/products/elodie-coord/back.jpg",
        "angle": "back",
        "alt": "Elodie Corduroy Co-ord - Back Silhouette",
        "position": 1,
        "isPrimary": false
      },
      {
        "id": "ec_3",
        "url": "/images/products/elodie-coord/side.jpg",
        "thumbnailUrl": "/images/products/elodie-coord/side.jpg",
        "angle": "side",
        "alt": "Elodie Corduroy Co-ord - Side Profile",
        "position": 2,
        "isPrimary": false
      },
      {
        "id": "ec_4",
        "url": "/images/products/elodie-coord/three-quarter.jpg",
        "thumbnailUrl": "/images/products/elodie-coord/three-quarter.jpg",
        "angle": "three-quarter",
        "alt": "Elodie Corduroy Co-ord - Three-Quarter Angle",
        "position": 3,
        "isPrimary": false
      },
      {
        "id": "ec_5",
        "url": "/images/products/elodie-coord/detail.jpg",
        "thumbnailUrl": "/images/products/elodie-coord/detail.jpg",
        "angle": "detail",
        "alt": "Elodie Corduroy Co-ord - Corduroy Texture & Horn Buttons",
        "position": 4,
        "isPrimary": false
      },
      {
        "id": "ec_6",
        "url": "/images/products/elodie-coord/walking.jpg",
        "thumbnailUrl": "/images/products/elodie-coord/walking.jpg",
        "angle": "lifestyle",
        "alt": "Elodie Corduroy Co-ord - Walking View",
        "position": 5,
        "isPrimary": false
      }
    ],
    "description": "An autumnal two-piece set in tactile rich espresso corduroy. Comprises an effortless overshirt jacket with horn buttons and matching straight-leg trousers with an elasticated comfort waist. Wear together as a coordinated statement or mix as separates.",
    "details": [
      "100% GOTS organic cotton fine-wale corduroy",
      "Overshirt: chest patch pocket and tortoiseshell-look horn buttons",
      "Trousers: clean front waistband with comfortable elastic back",
      "Garment washed for a soft, lived-in feel from day one",
      "Sold as a complete two-piece co-ord set"
    ],
    "fabric": "100% Organic Cotton Corduroy",
    "care": "Machine wash 30\u00b0C delicate. Hang dry in shade.",
    "badge": "JUST IN",
    "inStock": true
  },
  {
    "id": "prod-margot-straight-jeans",
    "slug": "margot-straight-leg-jeans",
    "name": "Margot Straight-Leg Jeans",
    "category": "women",
    "department": "Women",
    "price": 3990,
    "originalPrice": 3490,
    "saleNote": "Sale \u00b7 Save \u20b9700",
    "currency": "INR",
    "color": "Vintage Mid Blue",
    "colorHex": "#5B7FA6",
    "availableColors": [
      {
        "name": "Vintage Mid Blue",
        "hex": "#5B7FA6"
      },
      {
        "name": "Washed Black",
        "hex": "#2B2B2B"
      }
    ],
    "sizes": [
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32"
    ],
    "image": "/images/products/margot-jeans/front.jpg",
    "secondaryImage": "/images/products/margot-jeans/walking.jpg",
    "galleryImages": [
      "/images/products/margot-jeans/front.jpg",
      "/images/products/margot-jeans/back.jpg",
      "/images/products/margot-jeans/side.jpg",
      "/images/products/margot-jeans/three-quarter.jpg",
      "/images/products/margot-jeans/detail.jpg",
      "/images/products/margot-jeans/walking.jpg"
    ],
    "images": [
      {
        "id": "mj_1",
        "url": "/images/products/margot-jeans/front.jpg",
        "thumbnailUrl": "/images/products/margot-jeans/front.jpg",
        "angle": "front",
        "alt": "Margot Straight-Leg Jeans - Front View",
        "position": 0,
        "isPrimary": true
      },
      {
        "id": "mj_2",
        "url": "/images/products/margot-jeans/back.jpg",
        "thumbnailUrl": "/images/products/margot-jeans/back.jpg",
        "angle": "back",
        "alt": "Margot Straight-Leg Jeans - Back Silhouette",
        "position": 1,
        "isPrimary": false
      },
      {
        "id": "mj_3",
        "url": "/images/products/margot-jeans/side.jpg",
        "thumbnailUrl": "/images/products/margot-jeans/side.jpg",
        "angle": "side",
        "alt": "Margot Straight-Leg Jeans - Side Profile",
        "position": 2,
        "isPrimary": false
      },
      {
        "id": "mj_4",
        "url": "/images/products/margot-jeans/three-quarter.jpg",
        "thumbnailUrl": "/images/products/margot-jeans/three-quarter.jpg",
        "angle": "three-quarter",
        "alt": "Margot Straight-Leg Jeans - Three-Quarter View",
        "position": 3,
        "isPrimary": false
      },
      {
        "id": "mj_5",
        "url": "/images/products/margot-jeans/detail.jpg",
        "thumbnailUrl": "/images/products/margot-jeans/detail.jpg",
        "angle": "detail",
        "alt": "Margot Straight-Leg Jeans - Waistband & Coin Pocket Detail",
        "position": 4,
        "isPrimary": false
      },
      {
        "id": "mj_6",
        "url": "/images/products/margot-jeans/walking.jpg",
        "thumbnailUrl": "/images/products/margot-jeans/walking.jpg",
        "angle": "lifestyle",
        "alt": "Margot Straight-Leg Jeans - Walking View",
        "position": 5,
        "isPrimary": false
      }
    ],
    "description": "The timeless Parisian straight jean. Sits high on the natural waist and falls cleanly into a flattering straight leg. Woven from 13oz ring-spun organic denim that softens beautifully with wear while maintaining its authentic vintage structure.",
    "details": [
      "100% Ring-Spun Organic Cotton 13oz denim",
      "High-rise contour waistband with silver metal button",
      "Timeless straight silhouette from hip to hem",
      "Authentic five-pocket styling with reinforced copper rivets",
      "Authentic stone wash with natural fading"
    ],
    "fabric": "100% Organic Ring-Spun Cotton Denim",
    "care": "Machine wash cold inside out. Hang dry to preserve wash depth.",
    "badge": "BESTSELLER",
    "inStock": true
  },
  {
    "id": "prod-lucie-wide-leg-trousers",
    "slug": "lucie-wide-leg-trousers",
    "name": "Lucie Wide-Leg Trousers",
    "category": "women",
    "department": "Women",
    "price": 4490,
    "originalPrice": 3990,
    "saleNote": "Sale \u00b7 Save \u20b9800",
    "currency": "INR",
    "color": "Charcoal Melange",
    "colorHex": "#4D4F53",
    "availableColors": [
      {
        "name": "Charcoal Melange",
        "hex": "#4D4F53"
      },
      {
        "name": "Ecru",
        "hex": "#EAE5DB"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "image": "/images/products/lucie-trousers/front.jpg",
    "secondaryImage": "/images/products/lucie-trousers/walking.jpg",
    "galleryImages": [
      "/images/products/lucie-trousers/front.jpg",
      "/images/products/lucie-trousers/back.jpg",
      "/images/products/lucie-trousers/side.jpg",
      "/images/products/lucie-trousers/three-quarter.jpg",
      "/images/products/lucie-trousers/detail.jpg",
      "/images/products/lucie-trousers/walking.jpg"
    ],
    "images": [
      {
        "id": "lt_1",
        "url": "/images/products/lucie-trousers/front.jpg",
        "thumbnailUrl": "/images/products/lucie-trousers/front.jpg",
        "angle": "front",
        "alt": "Lucie Wide-Leg Trousers - Front View",
        "position": 0,
        "isPrimary": true
      },
      {
        "id": "lt_2",
        "url": "/images/products/lucie-trousers/back.jpg",
        "thumbnailUrl": "/images/products/lucie-trousers/back.jpg",
        "angle": "back",
        "alt": "Lucie Wide-Leg Trousers - Back Silhouette",
        "position": 1,
        "isPrimary": false
      },
      {
        "id": "lt_3",
        "url": "/images/products/lucie-trousers/side.jpg",
        "thumbnailUrl": "/images/products/lucie-trousers/side.jpg",
        "angle": "side",
        "alt": "Lucie Wide-Leg Trousers - Side Profile",
        "position": 2,
        "isPrimary": false
      },
      {
        "id": "lt_4",
        "url": "/images/products/lucie-trousers/three-quarter.jpg",
        "thumbnailUrl": "/images/products/lucie-trousers/three-quarter.jpg",
        "angle": "three-quarter",
        "alt": "Lucie Wide-Leg Trousers - Three-Quarter View",
        "position": 3,
        "isPrimary": false
      },
      {
        "id": "lt_5",
        "url": "/images/products/lucie-trousers/detail.jpg",
        "thumbnailUrl": "/images/products/lucie-trousers/detail.jpg",
        "angle": "detail",
        "alt": "Lucie Wide-Leg Trousers - Pinch Pleat & Pocket Detail",
        "position": 4,
        "isPrimary": false
      },
      {
        "id": "lt_6",
        "url": "/images/products/lucie-trousers/walking.jpg",
        "thumbnailUrl": "/images/products/lucie-trousers/walking.jpg",
        "angle": "lifestyle",
        "alt": "Lucie Wide-Leg Trousers - Flowing Walking Motion",
        "position": 5,
        "isPrimary": false
      }
    ],
    "description": "Pinch-pleated wide-leg trousers tailored with an elongated, fluid drape in charcoal wool-lyocell melange. Styled with a crisp high-rise waistband, deep forward pleats, and clean slant pockets for effortless movement.",
    "details": [
      "55% Worsted Wool, 45% Tencel Lyocell for fluid crease-resistance",
      "Clean tailored high-rise waist with concealed slide fastener",
      "Double forward pleats that cascade into a wide palazzo silhouette",
      "Functional side slant pockets and rear jetted welt pockets",
      "Generous hem allowance for custom length adjustment"
    ],
    "fabric": "Worsted Wool & Lyocell Suiting",
    "care": "Dry clean gently. Cool iron or steam.",
    "badge": "TIMELESS",
    "inStock": true
  },
  {
    "id": "prod-ines-oxford-shirt",
    "slug": "ines-oxford-cotton-shirt",
    "name": "Ines Oxford Cotton Shirt",
    "category": "women",
    "department": "Women",
    "price": 3490,
    "originalPrice": 4290,
    "saleNote": "Sale \u00b7 Save \u20b9800",
    "currency": "INR",
    "color": "Sky Blue",
    "colorHex": "#A4C4DC",
    "availableColors": [
      {
        "name": "Sky Blue",
        "hex": "#A4C4DC"
      },
      {
        "name": "Crisp White",
        "hex": "#FAFAFA"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "/images/products/ines-shirt/front.jpg",
    "secondaryImage": "/images/products/ines-shirt/walking.jpg",
    "galleryImages": [
      "/images/products/ines-shirt/front.jpg",
      "/images/products/ines-shirt/back.jpg",
      "/images/products/ines-shirt/side.jpg",
      "/images/products/ines-shirt/three-quarter.jpg",
      "/images/products/ines-shirt/detail.jpg",
      "/images/products/ines-shirt/walking.jpg"
    ],
    "images": [
      {
        "id": "is_1",
        "url": "/images/products/ines-shirt/front.jpg",
        "thumbnailUrl": "/images/products/ines-shirt/front.jpg",
        "angle": "front",
        "alt": "Ines Oxford Cotton Shirt - Front View",
        "position": 0,
        "isPrimary": true
      },
      {
        "id": "is_2",
        "url": "/images/products/ines-shirt/back.jpg",
        "thumbnailUrl": "/images/products/ines-shirt/back.jpg",
        "angle": "back",
        "alt": "Ines Oxford Cotton Shirt - Back Box Pleat",
        "position": 1,
        "isPrimary": false
      },
      {
        "id": "is_3",
        "url": "/images/products/ines-shirt/side.jpg",
        "thumbnailUrl": "/images/products/ines-shirt/side.jpg",
        "angle": "side",
        "alt": "Ines Oxford Cotton Shirt - Side Profile",
        "position": 2,
        "isPrimary": false
      },
      {
        "id": "is_4",
        "url": "/images/products/ines-shirt/three-quarter.jpg",
        "thumbnailUrl": "/images/products/ines-shirt/three-quarter.jpg",
        "angle": "three-quarter",
        "alt": "Ines Oxford Cotton Shirt - Three-Quarter Angle",
        "position": 3,
        "isPrimary": false
      },
      {
        "id": "is_5",
        "url": "/images/products/ines-shirt/detail.jpg",
        "thumbnailUrl": "/images/products/ines-shirt/detail.jpg",
        "angle": "detail",
        "alt": "Ines Oxford Cotton Shirt - Collar & Mother of Pearl Button Detail",
        "position": 4,
        "isPrimary": false
      },
      {
        "id": "is_6",
        "url": "/images/products/ines-shirt/walking.jpg",
        "thumbnailUrl": "/images/products/ines-shirt/walking.jpg",
        "angle": "lifestyle",
        "alt": "Ines Oxford Cotton Shirt - Relaxed Walking Pose",
        "position": 5,
        "isPrimary": false
      }
    ],
    "description": "An oversized button-down shirt woven from Portuguese organic Oxford cotton. Features genuine mother-of-pearl cross-stitched buttons, a soft pointed collar, single chest patch pocket, and a graceful curved shirttail hem.",
    "details": [
      "100% Portuguese Long-Staple GOTS Organic Cotton Oxford",
      "Generous relaxed boyfriend silhouette with dropped shoulder seams",
      "Natural mother-of-pearl buttons with cross-stitching",
      "Chest patch pocket and back box pleat with locker loop",
      "Curved high-low hem for versatile styling tuck or untuck"
    ],
    "fabric": "100% Portuguese Organic Oxford Cotton",
    "care": "Machine wash warm 40\u00b0C. Hang dry or tumble low.",
    "badge": "SIGNATURE",
    "inStock": true
  },
  {
    "id": "prod-petal-earrings",
    "slug": "petal-drop-earrings",
    "name": "Petal drop earrings",
    "category": "archived",
    "department": "Jewellery \u00b7 Brushed gold",
    "price": 2890,
    "currency": "INR",
    "color": "Brushed gold",
    "colorHex": "#C9A765",
    "sizes": [
      "One Size"
    ],
    "image": "/images/petal-drop-earrings.jpg",
    "description": "Cast in recycled brass with 18k brushed gold vermeil and freshwater pearl droplets.",
    "details": [
      "18k gold vermeil over recycled brass",
      "Hypoallergenic sterling silver posts",
      "Natural baroque freshwater pearl"
    ],
    "fabric": "18k Gold Vermeil",
    "care": "Keep away from perfumes and water.",
    "inStock": true,
    "galleryImages": [
      "/images/petal-drop-earrings.jpg"
    ]
  },
{
    "id": "prod-midnight-velvet-dress",
    "slug": "midnight-velvet-slip-dress",
    "name": "Midnight Velvet Slip Dress",
    "category": "the-edits",
    "department": "The Night Market",
    "price": 7990,
    "originalPrice": 9490,
    "saleNote": "The Night Market \u00b7 Save \u20b91,500",
    "currency": "INR",
    "color": "Noir",
    "colorHex": "#1C1B1F",
    "availableColors": [
      {
        "name": "Noir",
        "hex": "#1C1B1F"
      },
      {
        "name": "Deep Plum",
        "hex": "#4A2038"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "image": "/images/wrap-dress-model.jpg",
    "secondaryImage": "/images/wrap-dress.png",
    "galleryImages": [
      "/images/wrap-dress-model.jpg"
    ],
    "description": "Cut on the bias from liquid silk-velvet with delicate straps and a fluid silhouette designed for late night gatherings and illuminated city evenings.",
    "details": [
      "Silk-viscose velvet blend with liquid drape",
      "Bias cut contouring the body effortlessly",
      "Low scoop back with delicate rolled straps",
      "Floor-grazing hem with subtle side split"
    ],
    "fabric": "82% Viscose, 18% Mulberry Silk",
    "care": "Dry clean only. Store on padded hanger.",
    "badge": "CAPSULE",
    "inStock": true
  },
  {
    "id": "prod-night-market-silk-blouse",
    "slug": "night-market-silk-blouse",
    "name": "Night Market Silk Satin Blouse",
    "category": "the-edits",
    "department": "The Night Market",
    "price": 5490,
    "originalPrice": 6290,
    "saleNote": "The Night Market \u00b7 Save \u20b9800",
    "currency": "INR",
    "color": "Wine",
    "colorHex": "#713A48",
    "availableColors": [
      {
        "name": "Wine",
        "hex": "#713A48"
      },
      {
        "name": "Obsidian",
        "hex": "#1E1E24"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "image": "/images/products/night-market-silk-blouse/front.jpg",
    "secondaryImage": "/images/products/night-market-silk-blouse/side.jpg",
    "galleryImages": [
      "/images/editorial-everyday.png"
    ],
    "description": "Heavyweight 22-momme silk satin with a soft gathered neckline and french seams. Designed to catch warm ambient candlelight.",
    "details": [
      "100% Grade-6A Mulberry Silk Satin",
      "Gathered high cowl neckline",
      "Mother of pearl cuffs",
      "French seams throughout"
    ],
    "fabric": "100% Mulberry Silk (22 momme)",
    "care": "Specialist dry clean or cold delicate silk wash.",
    "badge": "BESTSELLER",
    "inStock": true
  },
  {
    "id": "prod-moonlight-tuxedo-blazer",
    "slug": "moonlight-tailored-tuxedo-blazer",
    "name": "Moonlight Tailored Tuxedo Blazer",
    "category": "the-edits",
    "department": "The Night Market",
    "price": 8990,
    "originalPrice": 10990,
    "saleNote": "The Night Market \u00b7 Save \u20b92,000",
    "currency": "INR",
    "color": "Obsidian",
    "colorHex": "#212121",
    "availableColors": [
      {
        "name": "Obsidian",
        "hex": "#212121"
      }
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "image": "/images/editorial-everyday.png",
    "secondaryImage": "/images/editorial-garden.png",
    "galleryImages": [
      "/images/editorial-garden.png"
    ],
    "description": "Sharp single-breasted evening blazer with satin peak lapels and structured shoulders. The cornerstone of the Night Market evening capsule.",
    "details": [
      "Fine Italian wool with silk satin contrast lapel",
      "Single covered horn button",
      "Flap pockets and welt chest pocket",
      "Full cupro lining for smooth layering"
    ],
    "fabric": "90% Virgin Wool, 10% Silk (Lining: 100% Cupro)",
    "care": "Specialist dry clean only.",
    "badge": "CAPSULE",
    "inStock": true
  },
  {
    "id": "prod-aura-pleated-skirt",
    "slug": "aura-pleated-metallic-skirt",
    "name": "Aura Pleated Metallic Midi Skirt",
    "category": "the-edits",
    "department": "The Night Market",
    "price": 6290,
    "originalPrice": 7490,
    "saleNote": "The Night Market \u00b7 Save \u20b91,200",
    "currency": "INR",
    "color": "Antique Champagne",
    "colorHex": "#C9A765",
    "availableColors": [
      {
        "name": "Antique Champagne",
        "hex": "#C9A765"
      },
      {
        "name": "Gunmetal",
        "hex": "#48494B"
      }
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "image": "/images/products/freya-pleated-merino-skirt/three-quarter.jpg",
    "secondaryImage": "/images/products/freya-pleated-merino-skirt/side.jpg",
    "galleryImages": [
      "/images/coord-model.jpg"
    ],
    "description": "Accordion sunburst pleats infused with micro-metallic spun threads that shimmer under evening streetlamps.",
    "details": [
      "Permanent sunburst knife pleating",
      "Concealed side zipper with grosgrain ribbon waist",
      "Midi length hitting mid-calf",
      "Complimentary unlined weight with heavy drape"
    ],
    "fabric": "70% Polyester, 30% Lurex Metallic Thread",
    "care": "Hand wash cold with gentle detergent or dry clean.",
    "badge": "LIMITED",
    "inStock": true
  },
  {
    "id": "prod-petal-drop-earrings-edit",
    "slug": "petal-drop-pearl-earrings-night-market",
    "name": "Petal Drop Pearl Earrings",
    "category": "the-edits",
    "department": "The Night Market",
    "price": 2890,
    "originalPrice": 3490,
    "saleNote": "Save \u20b9600",
    "currency": "INR",
    "color": "Brushed gold",
    "colorHex": "#C9A765",
    "availableColors": [
      {
        "name": "Brushed gold",
        "hex": "#C9A765"
      }
    ],
    "sizes": [
      "One Size"
    ],
    "image": "/images/products/luna-baroque-pearl-choker/detail.jpg",
    "secondaryImage": "/images/products/luna-baroque-pearl-choker/three-quarter.jpg",
    "galleryImages": [
      "/images/petal-drop-earrings.jpg"
    ],
    "description": "Hand-cast floral petals with baroque freshwater pearls suspended below. Understated evening glow.",
    "details": [
      "18k Gold vermeil over solid sterling silver",
      "Natural irregular baroque freshwater pearls",
      "Hypoallergenic post and butterfly backing",
      "Handcrafted in small artisan batches"
    ],
    "fabric": "18k Gold Vermeil & Freshwater Pearls",
    "care": "Store in soft pouch away from perfumes and moisture.",
    "badge": "NEW-IN",
    "inStock": true
  },
  {
    "id": "prod-keepsake-velvet-pouch-edit",
    "slug": "keepsake-velvet-evening-pouch-night-market",
    "name": "Keepsake Velvet Evening Pouch",
    "category": "the-edits",
    "department": "The Night Market",
    "price": 1490,
    "originalPrice": 1890,
    "saleNote": "Save \u20b9400",
    "currency": "INR",
    "color": "Wine",
    "colorHex": "#582B37",
    "availableColors": [
      {
        "name": "Wine",
        "hex": "#582B37"
      },
      {
        "name": "Deep Emerald",
        "hex": "#1B382B"
      }
    ],
    "sizes": [
      "One Size"
    ],
    "image": "/images/products/celeste-structured-leather-crossbody/detail.jpg",
    "secondaryImage": "/images/keepsake-velvet-pouch.jpg",
    "galleryImages": [
      "/images/keepsake-velvet-pouch.jpg"
    ],
    "description": "Drawstring pouch in rich jewel-toned plush velvet with braided silk tassels. Fits an evening compact, lipstick, and keys.",
    "details": [
      "Plush micro-velvet exterior",
      "Hand-braided silk cords with gold endcaps",
      "Satin interior lining with slip pocket",
      "Atelier monogram embossed label inside"
    ],
    "fabric": "100% Cotton Velvet, Satin Lining",
    "care": "Spot clean with dry cloth.",
    "badge": "GIFT",
    "inStock": true
  }
];

import { productsApi } from "./api/products";
import { ProductFilterParams } from "./api/types";

export { productsApi };

const SLUG_ALIASES: Record<string, string> = {
  "taupe-oversized-blazer": "camille-tailored-blazer",
  "brown-corduroy-co-ord": "elodie-corduroy-co-ord",
  "classic-white-tee-denim-set": "margot-straight-leg-jeans",
};

/**
 * Fetch products from the Django API.
 * MOCK_PRODUCTS is ONLY used as a fallback when the backend is unreachable.
 * mergeWithMock() has been REMOVED — deleted/disabled products in admin
 * will no longer reappear from the hardcoded list.
 */
export async function getProducts(params?: ProductFilterParams): Promise<Product[]> {
  // Build offline fallback subset with same filters
  let fallbackList = MOCK_PRODUCTS.filter((p) => isCategoryEnabled(p.category));
  if (params?.category) {
    fallbackList = fallbackList.filter((p) => p.category === params.category);
  }
  if (params?.minPrice !== undefined) {
    fallbackList = fallbackList.filter((p) => p.price >= (params.minPrice ?? 0));
  }
  if (params?.maxPrice !== undefined) {
    fallbackList = fallbackList.filter((p) => p.price <= (params.maxPrice ?? Infinity));
  }

  const products = await productsApi.getProducts({ pageSize: 100, ...params }, () => fallbackList);

  if (params?.sortBy === "price_asc") {
    return [...products].sort((a, b) => a.price - b.price);
  } else if (params?.sortBy === "price_desc") {
    return [...products].sort((a, b) => b.price - a.price);
  }
  return products;
}

/**
 * All catalog products including draft/disabled categories.
 * Tries the API first with ?all=true, falls back to MOCK_PRODUCTS.
 */
export async function getAllProductsIncludingDisabled(): Promise<Product[]> {
  try {
    return await productsApi.getProducts(undefined, () => MOCK_PRODUCTS);
  } catch {
    return MOCK_PRODUCTS;
  }
}

/**
 * Fetch a single product by slug via API or fallback
 */
export async function getProductBySlug(rawSlug: string): Promise<Product | null> {
  const slug = SLUG_ALIASES[rawSlug] || rawSlug;
  return productsApi.getProductBySlug(slug, () => {
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug || p.slug === rawSlug);
    if (!product) return null;
    if (!isCategoryEnabled(product.category)) return null;
    return product;
  });
}

/**
 * Fetch products belonging to a specific category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (!isCategoryEnabled(category)) return [];

  const fallbackSubset = MOCK_PRODUCTS.filter((p) => p.category === category);
  return productsApi.getProductsByCategory(category, () => fallbackSubset);
}

/**
 * Search products by query string
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const fallbackSubset = MOCK_PRODUCTS.filter((product) => {
    if (!isCategoryEnabled(product.category)) return false;
    return (
      product.name.toLowerCase().includes(clean) ||
      product.description.toLowerCase().includes(clean) ||
      product.department.toLowerCase().includes(clean) ||
      product.color.toLowerCase().includes(clean)
    );
  });

  return productsApi.searchProducts(query, () => fallbackSubset);
}
