import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/product.dart';
import '../config/luxury_theme.dart';
import '../providers/cart_provider.dart';
import '../providers/wishlist_provider.dart';
import '../widgets/studio_360_orbit_viewer.dart';

class ProductDetailScreen extends StatefulWidget {
  final String slug;
  final Product initialProduct;

  const ProductDetailScreen({
    Key? key,
    required this.slug,
    required this.initialProduct,
  }) : super(key: key);

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  late Product _product;
  int _selectedGalleryIndex = 0;
  bool _is360Mode = false;
  String _selectedSize = 'One Size';

  @override
  void initState() {
    super.initState();
    _product = widget.initialProduct;
    if (_product.sizes.isNotEmpty) {
      _selectedSize = _product.sizes.first;
    }
  }

  @override
  Widget build(BuildContext context) {
    final wishlist = context.watch<WishlistProvider>();
    final isFav = wishlist.isFavorite(_product.slug);
    final has360 = _product.galleryImages.length >= 3;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Ryna's Wardrobe",
          style: GoogleFonts.playfairDisplay(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: LuxuryColors.textObsidian,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(
              isFav ? Icons.favorite : Icons.favorite_border,
              color: isFav ? LuxuryColors.primaryBurgundy : LuxuryColors.textObsidian,
            ),
            onPressed: () => wishlist.toggleFavorite(_product),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Gallery / 360 Mode Switcher Pills
            if (has360)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  children: [
                    _buildModePill(
                      label: 'Studio Gallery (${_product.galleryImages.length})',
                      isActive: !_is360Mode,
                      icon: Icons.photo_library_outlined,
                      onTap: () => setState(() => _is360Mode = false),
                    ),
                    const SizedBox(width: 8),
                    _buildModePill(
                      label: '360° Studio Orbit',
                      isActive: _is360Mode,
                      icon: Icons.threed_rotation_outlined,
                      onTap: () => setState(() => _is360Mode = true),
                    ),
                  ],
                ),
              ),

            // Main Display: 360 Interactive Turntable OR Touch Swipe Gallery
            if (_is360Mode)
              Padding(
                padding: const EdgeInsets.all(16),
                child: Studio360OrbitViewer(product: _product),
              )
            else ...[
              // Main High-Res Image
              Container(
                height: 400,
                width: double.infinity,
                color: const Color(0xFFF7F4EF),
                child: CachedNetworkImage(
                  imageUrl: _product.galleryImages.isNotEmpty
                      ? _product.galleryImages[_selectedGalleryIndex]
                      : _product.imageUrl,
                  fit: BoxFit.cover,
                  placeholder: (_, __) => const Center(
                    child: CircularProgressIndicator(color: LuxuryColors.primaryBurgundy),
                  ),
                ),
              ),

              // Thumbnail strip
              if (_product.galleryImages.length > 1)
                Container(
                  height: 64,
                  padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _product.galleryImages.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (context, idx) {
                      final isSelected = idx == _selectedGalleryIndex;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedGalleryIndex = idx),
                        child: Container(
                          width: 48,
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: isSelected ? LuxuryColors.primaryBurgundy : LuxuryColors.borderSand,
                              width: isSelected ? 2 : 1,
                            ),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          clipBehavior: Clip.antiAlias,
                          child: CachedNetworkImage(
                            imageUrl: _product.galleryImages[idx],
                            fit: BoxFit.cover,
                          ),
                        ),
                      );
                    },
                  ),
                ),
            ],

            // Garment Details & Editorial Information
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (_product.department != null)
                    Text(
                      _product.department!.toUpperCase(),
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1.2,
                        color: LuxuryColors.primaryBurgundy,
                      ),
                    ),
                  const SizedBox(height: 6),
                  Text(
                    _product.name,
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                      color: LuxuryColors.textObsidian,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Text(
                        _product.formattedPrice,
                        style: GoogleFonts.inter(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: LuxuryColors.textObsidian,
                        ),
                      ),
                      if (_product.formattedOriginalPrice != null) ...[
                        const SizedBox(width: 10),
                        Text(
                          _product.formattedOriginalPrice!,
                          style: GoogleFonts.inter(
                            fontSize: 15,
                            color: LuxuryColors.textLight,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                      ],
                      if (_product.saleNote != null) ...[
                        const SizedBox(width: 10),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                          decoration: BoxDecoration(
                            color: LuxuryColors.softBurgundy,
                            borderRadius: BorderRadius.circular(3),
                          ),
                          child: Text(
                            _product.saleNote!,
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: LuxuryColors.primaryBurgundy,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),

                  const SizedBox(height: 16),
                  Text(
                    _product.description,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: LuxuryColors.textMuted,
                      height: 1.5,
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Size selection pills
                  if (_product.sizes.isNotEmpty && _product.sizes.first != 'One Size') ...[
                    Text(
                      'SELECT SIZE',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.8,
                        color: LuxuryColors.textObsidian,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: _product.sizes.map((sz) {
                        final isSel = sz == _selectedSize;
                        return ChoiceChip(
                          label: Text(sz),
                          selected: isSel,
                          onSelected: (_) => setState(() => _selectedSize = sz),
                          selectedColor: LuxuryColors.primaryBurgundy,
                          labelStyle: TextStyle(
                            color: isSel ? Colors.white : LuxuryColors.textObsidian,
                            fontWeight: FontWeight.w600,
                            fontSize: 12,
                          ),
                          backgroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(4),
                            side: BorderSide(
                              color: isSel ? LuxuryColors.primaryBurgundy : LuxuryColors.borderSand,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Fabric & Garment Care Accordion
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: LuxuryColors.borderSand),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Column(
                      children: [
                        ListTile(
                          title: Text(
                            'Fabric & Garment Care',
                            style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600),
                          ),
                          subtitle: Text(
                            _product.fabric ?? 'Artisan Atelier Finish',
                            style: GoogleFonts.inter(fontSize: 11, color: LuxuryColors.textMuted),
                          ),
                          trailing: const Icon(Icons.info_outline, size: 18),
                        ),
                        if (_product.care != null)
                          Padding(
                            padding: const EdgeInsets.only(left: 16, right: 16, bottom: 12),
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: Text(
                                _product.care!,
                                style: GoogleFonts.inter(fontSize: 12, color: LuxuryColors.textMuted),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ],
        ),
      ),

      // Bottom Sticky Purchase Bar
      bottomSheet: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: LuxuryColors.borderSand)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    context.read<CartProvider>().addToCart(
                          _product,
                          size: _selectedSize,
                        );
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Added ${_product.name} to your Bag'),
                        backgroundColor: LuxuryColors.primaryBurgundy,
                        duration: const Duration(seconds: 2),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  icon: const Icon(Icons.shopping_bag_outlined, size: 18),
                  label: Text('ADD TO BAG · ${_product.formattedPrice}'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: LuxuryColors.primaryBurgundy,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildModePill({
    required String label,
    required bool isActive,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isActive ? LuxuryColors.primaryBurgundy : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isActive ? LuxuryColors.primaryBurgundy : LuxuryColors.borderSand,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 14,
              color: isActive ? Colors.white : LuxuryColors.textObsidian,
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: isActive ? Colors.white : LuxuryColors.textObsidian,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

