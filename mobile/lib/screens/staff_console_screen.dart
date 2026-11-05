import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/luxury_theme.dart';
import '../providers/catalog_provider.dart';

class StaffConsoleScreen extends StatelessWidget {
  const StaffConsoleScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final catalog = context.watch<CatalogProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Atelier Staff Portal',
          style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Staff Session Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: LuxuryColors.borderSand),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: LuxuryColors.softBurgundy,
                      borderRadius: BorderRadius.circular(22),
                    ),
                    child: const Icon(Icons.shield_outlined, color: LuxuryColors.primaryBurgundy),
                  ),
                  const SizedBox(width: 14),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'STAFF CONSOLE · ACTIVE SESSION',
                        style: GoogleFonts.inter(
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.2,
                          color: LuxuryColors.primaryBurgundy,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Store Operations & Inventory',
                        style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Quick Stats
            Row(
              children: [
                _buildStatCard('Active Products', '${catalog.allProducts.length}', Icons.checkroom),
                const SizedBox(width: 12),
                _buildStatCard('Categories', '${catalog.categories.length}', Icons.category_outlined),
              ],
            ),
            const SizedBox(height: 24),

            Text(
              'INVENTORY RECONCILIATION',
              style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 1.0, color: LuxuryColors.textObsidian),
            ),
            const SizedBox(height: 10),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: catalog.allProducts.take(8).length,
              separatorBuilder: (_, __) => const Divider(height: 1, color: LuxuryColors.softDivider),
              itemBuilder: (context, idx) {
                final prod = catalog.allProducts[idx];
                return Container(
                  color: Colors.white,
                  child: ListTile(
                    dense: true,
                    title: Text(prod.name, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600)),
                    subtitle: Text('${prod.category.toUpperCase()} · ${prod.formattedPrice}', style: GoogleFonts.inter(fontSize: 11)),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE8F5E9),
                        borderRadius: BorderRadius.circular(3),
                      ),
                      child: Text(
                        'IN STOCK',
                        style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: const Color(0xFF2E7D32)),
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String val, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: LuxuryColors.borderSand),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 20, color: LuxuryColors.primaryBurgundy),
            const SizedBox(height: 8),
            Text(val, style: GoogleFonts.playfairDisplay(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 2),
            Text(title, style: GoogleFonts.inter(fontSize: 11, color: LuxuryColors.textMuted)),
          ],
        ),
      ),
    );
  }
}

