import { Metadata } from "next";
import { MOCK_PRODUCTS, getProductBySlug } from "@/lib/products";
import { ProductDetailView } from "@/components/catalog/ProductDetailView";
import { brandConfig } from "@/config/brand";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((prod) => ({
    slug: prod.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: `Product Not Found | ${brandConfig.name}`,
    };
  }

  const title = `${product.name} · ${product.color} | ${brandConfig.name}`;
  const description =
    product.description ||
    `${product.name} in ${product.color}. Hand-finished luxury from ${brandConfig.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image ? [{ url: product.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const initialProduct = await getProductBySlug(slug);

  const jsonLd = initialProduct
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: initialProduct.name,
        image: initialProduct.image,
        description: initialProduct.description,
        color: initialProduct.color,
        brand: {
          "@type": "Brand",
          name: brandConfig.name,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: brandConfig.commerce.currencyCode,
          price: initialProduct.price,
          availability: initialProduct.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `https://${brandConfig.domain}/product/${initialProduct.slug}`,
          seller: {
            "@type": "Organization",
            name: brandConfig.name,
          },
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailView slug={slug} initialProduct={initialProduct} />
    </>
  );
}
