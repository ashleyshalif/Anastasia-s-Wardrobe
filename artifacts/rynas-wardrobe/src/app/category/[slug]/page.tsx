import { CATALOG_CATEGORIES } from "@/config/catalog";
import { CategoryView } from "@/components/catalog/CategoryView";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export function generateStaticParams() {
  return CATALOG_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts();
  return <CategoryView slug={slug} initialProducts={products} />;
}
