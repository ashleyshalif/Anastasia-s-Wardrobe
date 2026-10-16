import { MOCK_PRODUCTS } from "@/lib/products";
import { ProductDetailView } from "@/components/catalog/ProductDetailView";

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((prod) => ({
    slug: prod.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailView slug={slug} />;
}
