import '../config/api_config.dart';

class ProductImageModel {
  final int? id;
  final String angle;
  final String imageUrl;
  final String? color;
  final String? altText;

  ProductImageModel({
    this.id,
    required this.angle,
    required this.imageUrl,
    this.color,
    this.altText,
  });

  factory ProductImageModel.fromJson(Map<String, dynamic> json) {
    return ProductImageModel(
      id: json['id'] as int?,
      angle: (json['angle'] as String?) ?? 'front',
      imageUrl: ApiConfig.resolveImageUrl(json['image_url'] as String? ?? json['image'] as String?),
      color: json['color'] as String?,
      altText: json['alt_text'] as String?,
    );
  }
}

class Product {
  final dynamic id;
  final String slug;
  final String name;
  final String category;
  final String? department;
  final double price;
  final double? originalPrice;
  final String? saleNote;
  final String color;
  final String? colorHex;
  final List<String> sizes;
  final String imageUrl;
  final String? secondaryImageUrl;
  final List<String> galleryImages;
  final List<ProductImageModel> multiAngleImages;
  final String description;
  final List<String> details;
  final String? fabric;
  final String? care;
  final String? badge;
  final bool inStock;

  Product({
    required this.id,
    required this.slug,
    required this.name,
    required this.category,
    this.department,
    required this.price,
    this.originalPrice,
    this.saleNote,
    required this.color,
    this.colorHex,
    required this.sizes,
    required this.imageUrl,
    this.secondaryImageUrl,
    required this.galleryImages,
    this.multiAngleImages = const [],
    required this.description,
    this.details = const [],
    this.fabric,
    this.care,
    this.badge,
    this.inStock = true,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    // Gallery images parsing
    List<String> parsedGallery = [];
    if (json['gallery_images'] is List) {
      for (var item in json['gallery_images']) {
        if (item is String) {
          parsedGallery.add(ApiConfig.resolveImageUrl(item));
        } else if (item is Map && item['image_url'] != null) {
          parsedGallery.add(ApiConfig.resolveImageUrl(item['image_url'] as String));
        }
      }
    }

    // Multi-angle ProductImage models
    List<ProductImageModel> parsedAngles = [];
    if (json['images'] is List) {
      for (var imgJson in json['images']) {
        if (imgJson is Map<String, dynamic>) {
          parsedAngles.add(ProductImageModel.fromJson(imgJson));
        }
      }
    }

    // Sizes parsing
    List<String> parsedSizes = [];
    if (json['sizes'] is List) {
      parsedSizes = (json['sizes'] as List).map((e) => e.toString()).toList();
    } else {
      parsedSizes = ['One Size'];
    }

    // Price parsing
    double parsePrice(dynamic val) {
      if (val == null) return 0.0;
      if (val is num) return val.toDouble();
      return double.tryParse(val.toString().replaceAll(RegExp(r'[^0-9.]'), '')) ?? 0.0;
    }

    String mainImg = ApiConfig.resolveImageUrl(json['image'] as String? ?? json['image_url'] as String?);
    String? secImg = json['secondary_image'] != null
        ? ApiConfig.resolveImageUrl(json['secondary_image'] as String)
        : (parsedGallery.length > 1 ? parsedGallery[1] : null);

    if (parsedGallery.isEmpty && mainImg.isNotEmpty) {
      parsedGallery.add(mainImg);
      if (secImg != null) parsedGallery.add(secImg);
    }

    return Product(
      id: json['id'] ?? json['slug'],
      slug: (json['slug'] as String?) ?? '',
      name: (json['name'] as String?) ?? 'Atelier Piece',
      category: json['category'] is Map
          ? (json['category']['slug'] ?? json['category']['name'] ?? 'women')
          : (json['category'] as String? ?? 'women'),
      department: json['department'] as String?,
      price: parsePrice(json['price']),
      originalPrice: json['original_price'] != null ? parsePrice(json['original_price']) : null,
      saleNote: json['sale_note'] as String?,
      color: (json['color'] as String?) ?? 'Default',
      colorHex: json['color_hex'] as String?,
      sizes: parsedSizes.isNotEmpty ? parsedSizes : ['One Size'],
      imageUrl: mainImg,
      secondaryImageUrl: secImg,
      galleryImages: parsedGallery,
      multiAngleImages: parsedAngles,
      description: (json['description'] as String?) ?? '',
      details: (json['details'] is List)
          ? (json['details'] as List).map((e) => e.toString()).toList()
          : [],
      fabric: json['fabric'] as String?,
      care: json['care'] as String?,
      badge: json['badge'] as String?,
      inStock: (json['in_stock'] as bool?) ?? true,
    );
  }

  String get formattedPrice => '₹${price.toStringAsFixed(0).replaceAllMapped(
        RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
        (Match m) => '${m[1]},',
      )}';

  String? get formattedOriginalPrice => originalPrice != null
      ? '₹${originalPrice!.toStringAsFixed(0).replaceAllMapped(
            RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
            (Match m) => '${m[1]},',
          )}'
      : null;
}

