import { Product } from "@/types/product";
import { isCategoryEnabled } from "@/config/catalog";

type GarmentRole = "top" | "knitwear" | "bottom" | "dress" | "outerwear" | "accessory" | "jewellery" | "other";

/**
 * Classifies a product into an outfit styling role based on its name, slug, description, or category.
 */
function classifyRole(product: Product): GarmentRole {
  const text = `${product.name} ${product.slug} ${product.category} ${product.description || ""}`.toLowerCase();

  if (text.includes("coat") || text.includes("jacket") || text.includes("blazer") || text.includes("trench")) {
    return "outerwear";
  }
  if (text.includes("dress") || text.includes("gown") || text.includes("pinafore")) {
    return "dress";
  }
  if (text.includes("cardigan") || text.includes("jumper") || text.includes("sweater") || text.includes("knit")) {
    return "knitwear";
  }
  if (text.includes("trouser") || text.includes("pant") || text.includes("jean") || text.includes("skirt") || text.includes("short")) {
    return "bottom";
  }
  if (text.includes("earring") || text.includes("necklace") || text.includes("bracelet") || text.includes("ring") || text.includes("jewel")) {
    return "jewellery";
  }
  if (text.includes("scarf") || text.includes("pouch") || text.includes("bag") || text.includes("belt") || text.includes("tote")) {
    return "accessory";
  }
  if (text.includes("shirt") || text.includes("blouse") || text.includes("tee") || text.includes("top")) {
    return "top";
  }
  return "other";
}

/**
 * Defines ideal complementary garment roles for an outfit.
 */
const COMPATIBLE_ROLES: Record<GarmentRole, GarmentRole[]> = {
  knitwear: ["bottom", "outerwear", "accessory", "jewellery", "dress"],
  top: ["bottom", "outerwear", "knitwear", "accessory", "jewellery"],
  bottom: ["knitwear", "top", "outerwear", "accessory", "jewellery"],
  dress: ["outerwear", "knitwear", "accessory", "jewellery"],
  outerwear: ["knitwear", "dress", "bottom", "accessory"],
  accessory: ["knitwear", "dress", "outerwear", "top"],
  jewellery: ["dress", "knitwear", "top", "outerwear"],
  other: ["knitwear", "dress", "bottom", "outerwear", "accessory"],
};

/**
 * Evaluates stylistic and color harmony between two products.
 */
function calculatePairingScore(current: Product, candidate: Product): number {
  if (current.slug === candidate.slug || current.id === candidate.id) return -100;
  if (!isCategoryEnabled(candidate.category)) return -100;
  if (candidate.inStock === false) return -50;

  let score = 0;

  // 1. Department compatibility
  const currentDept = (current.department || "").toLowerCase();
  const candDept = (candidate.department || "").toLowerCase();

  const isCurrentGirls = currentDept.includes("girl") || current.category === "girls";
  const isCandGirls = candDept.includes("girl") || candidate.category === "girls";

  if (isCurrentGirls && isCandGirls) {
    score += 40;
  } else if (!isCurrentGirls && !isCandGirls) {
    score += 30;
  } else {
    // Cross-department match penalty (unless it's a neutral accessory/gift)
    if (candidate.category === "gifts" || candidate.category === "jewellery") {
      score += 10;
    } else {
      score -= 30;
    }
  }

  // 2. Role Complementarity
  const currentRole = classifyRole(current);
  const candRole = classifyRole(candidate);

  if (currentRole === candRole && currentRole !== "accessory") {
    // Don't recommend a sweater with another sweater, or dress with another dress
    score -= 25;
  } else {
    const preferredRoles = COMPATIBLE_ROLES[currentRole] || [];
    const roleIndex = preferredRoles.indexOf(candRole);
    if (roleIndex !== -1) {
      score += (preferredRoles.length - roleIndex) * 8;
    }
  }

  // 3. Color Harmony matching
  const curColor = (current.color || "").toLowerCase();
  const candColor = (candidate.color || "").toLowerCase();

  const warmNeutrals = ["oat", "cream", "apricot", "beige", "camel", "natural", "sand", "ecru"];
  const richTones = ["brown", "rosewood", "burgundy", "wine", "chocolate", "caramel", "rust", "chestnut"];
  const coolEarth = ["sage", "olive", "forest", "charcoal", "slate", "black", "navy"];

  const isCurWarm = warmNeutrals.some(c => curColor.includes(c));
  const isCandWarm = warmNeutrals.some(c => candColor.includes(c));
  const isCurRich = richTones.some(c => curColor.includes(c));
  const isCandRich = richTones.some(c => candColor.includes(c));
  const isCurCool = coolEarth.some(c => curColor.includes(c));
  const isCandCool = coolEarth.some(c => candColor.includes(c));

  // Tonal pairing boost
  if ((isCurWarm && isCandRich) || (isCurRich && isCandWarm)) {
    score += 15;
  } else if ((isCurWarm && isCandWarm) || (isCurRich && isCandRich) || (isCurCool && isCandCool)) {
    score += 10;
  }

  // 4. Boost curated or bestseller items
  if (candidate.badge) {
    score += 5;
  }

  return score;
}

/**
 * Returns the top rule-curated complementary pieces for the "Wear It With" section.
 * Fast, deterministic, and runs locally with zero external API latency or cost.
 */
export function getComplementaryProducts(currentProduct: Product, allProducts: Product[], limit: number = 3): Product[] {
  if (!currentProduct || !allProducts || allProducts.length === 0) return [];

  const candidates = allProducts.filter(
    p => p.slug !== currentProduct.slug && isCategoryEnabled(p.category) && p.inStock !== false
  );

  const scored = candidates.map(candidate => ({
    product: candidate,
    score: calculatePairingScore(currentProduct, candidate),
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const result: Product[] = [];
  const seenRoles = new Set<GarmentRole>();

  // Ensure variety in recommended pieces (e.g. don't pick two identical roles)
  for (const item of scored) {
    if (result.length >= limit) break;
    const role = classifyRole(item.product);
    if (!seenRoles.has(role) || scored.length <= limit) {
      result.push(item.product);
      seenRoles.add(role);
    }
  }

  // Backfill if needed
  if (result.length < limit) {
    for (const item of scored) {
      if (result.length >= limit) break;
      if (!result.some(r => r.id === item.product.id)) {
        result.push(item.product);
      }
    }
  }

  return result;
}
