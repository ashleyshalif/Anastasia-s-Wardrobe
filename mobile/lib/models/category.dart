class CategoryModel {
  final String slug;
  final String name;
  final String? subtitle;
  final String? imageUrl;
  final int count;

  CategoryModel({
    required this.slug,
    required this.name,
    this.subtitle,
    this.imageUrl,
    this.count = 0,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      slug: (json['slug'] as String?) ?? '',
      name: (json['name'] as String?) ?? 'Category',
      subtitle: json['subtitle'] as String?,
      imageUrl: json['image_url'] as String?,
      count: json['product_count'] as int? ?? 0,
    );
  }

  static List<CategoryModel> defaultCategories = [
    CategoryModel(slug: 'all', name: 'All Pieces', subtitle: 'The Complete Edit'),
    CategoryModel(slug: 'women', name: 'Women', subtitle: 'Thoughtfully cut silhouettes'),
    CategoryModel(slug: 'jewellery', name: 'Jewellery', subtitle: '18k gold plated & freshwater pearls'),
    CategoryModel(slug: 'gifts', name: 'Atelier Gifts', subtitle: 'Keepsakes & luxury bags'),
    CategoryModel(slug: 'girls', name: 'Girls 2–12', subtitle: 'Heirloom smocked pieces'),
    CategoryModel(slug: 'teens', name: 'Teens 13–17', subtitle: 'Refined modern tailoring'),
  ];
}

