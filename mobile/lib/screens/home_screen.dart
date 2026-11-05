import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/luxury_theme.dart';
import '../providers/catalog_provider.dart';
import '../providers/cart_provider.dart';
import '../widgets/luxury_product_card.dart';
import '../widgets/gift_shelf_section.dart';
import 'cart_screen.dart';

class HomeScreen extends StatelessWidget {
  final Function(int) onTabChange;

  const HomeScreen({Key? key, required this.onTabChange}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final catalog = context.watch<CatalogProvider>();
    final cart = context.watch<CartProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Column(
          children: [
            Text(
              "Ryna's Wardrobe",
              style: GoogleFonts.playfairDisplay(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: LuxuryColors.textObsidian,
                letterSpacing: 0.5,
              ),
            ),
            Text(
              "THOUGHTFULLY CHOSEN. WORN YOUR WAY.",
              style: GoogleFonts.inter(
                fontSize: 8,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                color: LuxuryColors.primaryBurgundy,
              ),
            ),
          ],
        ),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_bag_outlined, color: LuxuryColors.textObsidian),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CartScreen()),
                  );
                },
              ),
              if (cart.itemCount > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: LuxuryColors.primaryBurgundy,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      '${cart.itemCount}',
                      style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: RefreshIndicator(
        color: LuxuryColors.primaryBurgundy,
        onRefresh: () => catalog.loadCatalog(),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Category Filter Pills Strip
              Container(
                height: 50,
                color: Colors.white,
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  scrollDirection: Axis.horizontal,
                  itemCount: catalog.categories.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, idx) {
                    final cat = catalog.categories[idx];
                    final isSelected = cat.slug == catalog.selectedCategory;
                    return ChoiceChip(
                      label: Text(cat.name),
                      selected: isSelected,
                      onSelected: (_) => catalog.selectCategory(cat.slug),
                      selectedColor: LuxuryColors.primaryBurgundy,
                      labelStyle: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isSelected ? Colors.white : LuxuryColors.textObsidian,
                      ),
                      backgroundColor: LuxuryColors.backgroundIvory,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: BorderSide(
                          color: isSelected ? LuxuryColors.primaryBurgundy : LuxuryColors.borderSand,
                        ),
                      ),
                    );
                  },
                ),
              ),

              // Hero Atelier Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                color: const Color(0xFFFAF6F0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'AUTUMN / WINTER 2026',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1.5,
                        color: LuxuryColors.primaryBurgundy,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'The Atelier Collection',
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 26,
                        fontWeight: FontWeight.w600,
                        color: LuxuryColors.textObsidian,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Tactile cashmere knitwear, sculptural 18k vermeil jewelry, and Italian calfskin leather pieces hand-finished in small atelier editions.',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        color: LuxuryColors.textMuted,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),

              // The Atelier Gift Shelf (Interactive Jewelry & Bags)
              GiftShelfSection(
                giftProducts: catalog.giftShelfProducts,
                onExploreAll: () {
                  catalog.selectCategory('gifts');
                  onTabChange(1); // Switch to Catalog tab
                },
              ),

              // Section Header: Collection Edit
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          catalog.selectedCategory == 'all'
                              ? 'Curated Pieces'
                              : catalog.categories
                                  .firstWhere(
                                    (c) => c.slug == catalog.selectedCategory,
                                    orElse: () => catalog.categories.first,
                                  )
                                  .name,
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: LuxuryColors.textObsidian,
                          ),
                        ),
                        Text(
                          '${catalog.filteredProducts.length} pieces',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            color: LuxuryColors.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // 2-Column Product Grid
              if (catalog.isLoading)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(40),
                    child: CircularProgressIndicator(color: LuxuryColors.primaryBurgundy),
                  ),
                )
              else if (catalog.filteredProducts.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(40),
                    child: Column(
                      children: [
                        const Icon(Icons.checkroom_outlined, size: 48, color: LuxuryColors.textLight),
                        const SizedBox(height: 12),
                        Text(
                          'No garments match your selection',
                          style: GoogleFonts.playfairDisplay(fontSize: 16),
                        ),
                        const SizedBox(height: 8),
                        TextButton(
                          onPressed: () => catalog.selectCategory('all'),
                          child: const Text('Clear Filters', style: TextStyle(color: LuxuryColors.primaryBurgundy)),
                        ),
                      ],
                    ),
                  ),
                )
              else
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: catalog.filteredProducts.length,
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.58,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 14,
                    ),
                    itemBuilder: (context, idx) {
                      return LuxuryProductCard(product: catalog.filteredProducts[idx]);
                    },
                  ),
                ),

              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

