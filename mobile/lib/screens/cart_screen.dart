import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/luxury_theme.dart';
import '../providers/cart_provider.dart';
import '../services/api_service.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({Key? key}) : super(key: key);

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  bool _isSubmitting = false;

  void _handleCheckout(BuildContext context) async {
    final cart = context.read<CartProvider>();
    if (cart.items.isEmpty) return;

    setState(() => _isSubmitting = true);

    final itemsPayload = cart.items
        .map((item) => {
              'product_slug': item.product.slug,
              'quantity': item.quantity,
              'size': item.selectedSize,
              'color': item.selectedColor,
              'price': item.product.price,
            })
        .toList();

    final result = await ApiService().createOrder(
      items: itemsPayload,
      shippingAddress: {
        'name': 'Atelier Patron',
        'city': 'Mumbai',
        'state': 'Maharashtra',
        'pincode': '400001',
      },
      paymentMethod: 'razorpay',
    );

    setState(() => _isSubmitting = false);

    if (!mounted) return;

    cart.clearCart();

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        title: Text(
          'Order Confirmed',
          style: GoogleFonts.playfairDisplay(fontSize: 20, fontWeight: FontWeight.w600),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Thank you for your order.',
              style: GoogleFonts.inter(fontSize: 14, color: LuxuryColors.textObsidian),
            ),
            const SizedBox(height: 8),
            Text(
              'Order ID: ${result['order_id'] ?? 'ATELIER-2026'}',
              style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: LuxuryColors.primaryBurgundy),
            ),
            const SizedBox(height: 12),
            Text(
              'Your pieces are being prepared in our archival linen presentation box with signature tissue wrapping.',
              style: GoogleFonts.inter(fontSize: 12, color: LuxuryColors.textMuted),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('CONTINUE EXPLORING'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Shopping Bag (${cart.itemCount})',
          style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: cart.items.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.shopping_bag_outlined, size: 56, color: LuxuryColors.textLight),
                  const SizedBox(height: 14),
                  Text(
                    'Your Atelier Bag is Empty',
                    style: GoogleFonts.playfairDisplay(fontSize: 20, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Explore our curated collection of luxury silhouettes.',
                    style: GoogleFonts.inter(fontSize: 13, color: LuxuryColors.textMuted),
                  ),
                ],
              ),
            )
          : Column(
              children: [
                Expanded(
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: cart.items.length,
                    separatorBuilder: (_, __) => const Divider(height: 24, color: LuxuryColors.softDivider),
                    itemBuilder: (context, idx) {
                      final item = cart.items[idx];
                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Thumbnail
                          Container(
                            width: 80,
                            height: 104,
                            decoration: BoxDecoration(
                              color: const Color(0xFFF7F4EF),
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(color: LuxuryColors.borderSand),
                            ),
                            clipBehavior: Clip.antiAlias,
                            child: CachedNetworkImage(
                              imageUrl: item.product.imageUrl,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 14),

                          // Details
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.product.name,
                                  style: GoogleFonts.playfairDisplay(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    color: LuxuryColors.textObsidian,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Size: ${item.selectedSize} · Color: ${item.selectedColor}',
                                  style: GoogleFonts.inter(fontSize: 11, color: LuxuryColors.textMuted),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  item.product.formattedPrice,
                                  style: GoogleFonts.inter(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                    color: LuxuryColors.textObsidian,
                                  ),
                                ),
                                const SizedBox(height: 8),

                                // Stepper & Remove
                                Row(
                                  children: [
                                    _buildQuantityBtn(
                                      icon: Icons.remove,
                                      onTap: () => cart.updateQuantity(item, item.quantity - 1),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 10),
                                      child: Text(
                                        '${item.quantity}',
                                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                    _buildQuantityBtn(
                                      icon: Icons.add,
                                      onTap: () => cart.updateQuantity(item, item.quantity + 1),
                                    ),
                                    const Spacer(),
                                    IconButton(
                                      icon: const Icon(Icons.delete_outline, size: 18, color: LuxuryColors.textMuted),
                                      onPressed: () => cart.removeItem(item),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),

                // Order Summary Card
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    border: Border(top: BorderSide(color: LuxuryColors.borderSand)),
                  ),
                  child: SafeArea(
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Subtotal', style: GoogleFonts.inter(fontSize: 13, color: LuxuryColors.textMuted)),
                            Text(cart.formattedSubtotal, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Presentation Box & Delivery', style: GoogleFonts.inter(fontSize: 13, color: LuxuryColors.textMuted)),
                            Text(
                              cart.shippingFee == 0 ? 'COMPLIMENTARY' : '₹250',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: cart.shippingFee == 0 ? const Color(0xFF2E7D32) : LuxuryColors.textObsidian,
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 20, color: LuxuryColors.softDivider),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Total',
                              style: GoogleFonts.playfairDisplay(fontSize: 17, fontWeight: FontWeight.w600),
                            ),
                            Text(
                              cart.formattedGrandTotal,
                              style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w700, color: LuxuryColors.primaryBurgundy),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _isSubmitting ? null : () => _handleCheckout(context),
                            child: _isSubmitting
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                                  )
                                : const Text('PROCEED TO CHECKOUT'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildQuantityBtn({required IconData icon, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(3),
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          border: Border.all(color: LuxuryColors.borderSand),
          borderRadius: BorderRadius.circular(3),
        ),
        child: Icon(icon, size: 14, color: LuxuryColors.textObsidian),
      ),
    );
  }
}

