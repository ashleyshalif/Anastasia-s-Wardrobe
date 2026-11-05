import 'package:flutter/foundation.dart';
import '../models/product.dart';

class WishlistProvider extends ChangeNotifier {
  final Set<String> _wishlistSlugs = {};

  bool isFavorite(String slug) => _wishlistSlugs.contains(slug);

  int get count => _wishlistSlugs.length;

  void toggleFavorite(Product product) {
    if (_wishlistSlugs.contains(product.slug)) {
      _wishlistSlugs.remove(product.slug);
    } else {
      _wishlistSlugs.add(product.slug);
    }
    notifyListeners();
  }
}

