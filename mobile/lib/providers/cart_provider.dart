import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../models/cart_item.dart';

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);

  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  double get subtotal => _items.fold(0.0, (sum, item) => sum + item.totalPrice);

  double get shippingFee => subtotal > 5000 || _items.isEmpty ? 0.0 : 250.0;

  double get grandTotal => subtotal + shippingFee;

  String get formattedSubtotal => '₹${subtotal.toStringAsFixed(0).replaceAllMapped(
        RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
        (Match m) => '${m[1]},',
      )}';

  String get formattedGrandTotal => '₹${grandTotal.toStringAsFixed(0).replaceAllMapped(
        RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
        (Match m) => '${m[1]},',
      )}';

  void addToCart(Product product, {String? size, String? color}) {
    final chosenSize = size ?? (product.sizes.isNotEmpty ? product.sizes.first : 'One Size');
    final chosenColor = color ?? product.color;

    final existingIndex = _items.indexWhere(
      (item) =>
          item.product.slug == product.slug &&
          item.selectedSize == chosenSize &&
          item.selectedColor == chosenColor,
    );

    if (existingIndex >= 0) {
      _items[existingIndex].quantity += 1;
    } else {
      _items.add(
        CartItem(
          product: product,
          selectedSize: chosenSize,
          selectedColor: chosenColor,
          quantity: 1,
        ),
      );
    }
    notifyListeners();
  }

  void updateQuantity(CartItem item, int newQuantity) {
    if (newQuantity <= 0) {
      _items.remove(item);
    } else {
      item.quantity = newQuantity;
    }
    notifyListeners();
  }

  void removeItem(CartItem item) {
    _items.remove(item);
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
  }
}

