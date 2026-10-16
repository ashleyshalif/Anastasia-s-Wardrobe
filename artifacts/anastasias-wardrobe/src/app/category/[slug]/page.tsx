import { CATALOG_CATEGORIES } from "@/config/catalog";
import { CategoryView } from "@/components/catalog/CategoryView";

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
  return <CategoryView slug={slug} />;
}
