import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/luxury_theme.dart';
import '../providers/catalog_provider.dart';
import '../widgets/luxury_product_card.dart';

class CatalogScreen extends StatelessWidget {
  const CatalogScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final catalog = context.watch<CatalogProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Department Catalog',
          style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
            child: TextField(
              onChanged: (val) => catalog.setSearchQuery(val),
              decoration: InputDecoration(
                hintText: 'Search dresses, jewellery, cashmere...',
                hintStyle: GoogleFonts.inter(fontSize: 13, color: LuxuryColors.textLight),
                prefixIcon: const Icon(Icons.search, size: 20, color: LuxuryColors.textMuted),
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(6),
                  borderSide: const BorderSide(color: LuxuryColors.borderSand),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(6),
                  borderSide: const BorderSide(color: LuxuryColors.borderSand),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(6),
                  borderSide: const BorderSide(color: LuxuryColors.primaryBurgundy),
                ),
              ),
            ),
          ),

          // Department Pills
          SizedBox(
            height: 38,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
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
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: isSelected ? Colors.white : LuxuryColors.textObsidian,
                  ),
                  backgroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(4),
                    side: BorderSide(
                      color: isSelected ? LuxuryColors.primaryBurgundy : LuxuryColors.borderSand,
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 12),

          // Catalog Grid
          Expanded(
            child: catalog.isLoading
                ? const Center(child: CircularProgressIndicator(color: LuxuryColors.primaryBurgundy))
                : catalog.filteredProducts.isEmpty
                    ? Center(
                        child: Text(
                          'No garments found',
                          style: GoogleFonts.playfairDisplay(fontSize: 16, color: LuxuryColors.textMuted),
                        ),
                      )
                    : GridView.builder(
                        padding: const EdgeInsets.all(16),
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
        ],
      ),
    );
  }
}

