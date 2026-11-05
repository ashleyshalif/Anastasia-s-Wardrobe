import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/product.dart';
import '../config/luxury_theme.dart';
import 'luxury_product_card.dart';

class GiftShelfSection extends StatelessWidget {
  final List<Product> giftProducts;
  final VoidCallback onExploreAll;

  const GiftShelfSection({
    Key? key,
    required this.giftProducts,
    required this.onExploreAll,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (giftProducts.isEmpty) return const SizedBox.shrink();

    return Container(
      color: const Color(0xFFFBF9F6),
      padding: const EdgeInsets.symmetric(vertical: 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'CURATED FINDS & KEEPSAKES',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1.5,
                    color: LuxuryColors.primaryBurgundy,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'The Atelier Gift Shelf',
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 22,
                        fontWeight: FontWeight.w600,
                        color: LuxuryColors.textObsidian,
                      ),
                    ),
                    InkWell(
                      onTap: onExploreAll,
                      child: Text(
                        'EXPLORE ALL',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.8,
                          color: LuxuryColors.primaryBurgundy,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Handcrafted velvet evening pouches, freshwater baroque pearls, and tactile cashmere wraps — packaged in our archival linen presentation box.',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: LuxuryColors.textMuted,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Horizontal scroll of curated luxury cards
          SizedBox(
            height: 290,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              scrollDirection: Axis.horizontal,
              itemCount: giftProducts.length,
              separatorBuilder: (_, __) => const SizedBox(width: 14),
              itemBuilder: (context, index) {
                return SizedBox(
                  width: 190,
                  child: LuxuryProductCard(product: giftProducts[index]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

