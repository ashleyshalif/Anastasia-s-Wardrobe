import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../models/category.dart';
import '../services/api_service.dart';

class CatalogProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<Product> _allProducts = [];
  List<CategoryModel> _categories = [];
  String _selectedCategory = 'all';
  String _searchQuery = '';
  bool _isLoading = false;
  String? _errorMessage;

  List<Product> get allProducts => _allProducts;
  List<CategoryModel> get categories => _categories;
  String get selectedCategory => _selectedCategory;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  List<Product> get filteredProducts {
    return _allProducts.where((p) {
      final matchesCategory = _selectedCategory == 'all' ||
          p.category.toLowerCase() == _selectedCategory.toLowerCase();
      final matchesSearch = _searchQuery.isEmpty ||
          p.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.description.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (p.department?.toLowerCase().contains(_searchQuery.toLowerCase()) ?? false);
      return matchesCategory && matchesSearch;
    }).toList();
  }

  // The Atelier Gift Shelf items: Curated Jewelry & Luxury Bags
  List<Product> get giftShelfProducts {
    final curatedSlugs = [
      'luna-baroque-pearl-choker',
      'celeste-structured-leather-crossbody',
      'aurelia-ribbed-gold-bangle',
      'pave-dome-statement-ring',
    ];
    final matched = curatedSlugs
        .map((slug) => _allProducts.cast<Product?>().firstWhere(
              (p) => p?.slug == slug,
              orElse: () => null,
            ))
        .whereType<Product>()
        .toList();

    if (matched.isNotEmpty) return matched;
    return _allProducts
        .where((p) => p.category == 'jewellery' || p.category == 'gifts')
        .take(3)
        .toList();
  }

  Future<void> loadCatalog() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final results = await Future.wait([
        _api.fetchProducts(),
        _api.fetchCategories(),
      ]);
      _allProducts = results[0] as List<Product>;
      _categories = results[1] as List<CategoryModel>;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void selectCategory(String slug) {
    _selectedCategory = slug;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }
}

