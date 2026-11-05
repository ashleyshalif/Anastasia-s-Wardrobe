import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class LuxuryColors {
  // Brand Palette: Ryna's Wardrobe Atelier
  static const Color primaryBurgundy = Color(0xFF713A48);
  static const Color darkBurgundy = Color(0xFF582B37);
  static const Color softBurgundy = Color(0xFFF7EFF1);

  static const Color backgroundIvory = Color(0xFFFAF8F5);
  static const Color surfaceCream = Color(0xFFFFFFFF);
  static const Color borderSand = Color(0xFFE6E0D8);
  static const Color softDivider = Color(0xFFEEE8E0);

  static const Color goldAccent = Color(0xFFD4AF37);
  static const Color textObsidian = Color(0xFF2C2623);
  static const Color textMuted = Color(0xFF69615B);
  static const Color textLight = Color(0xFF9E958C);
}

class LuxuryTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: LuxuryColors.backgroundIvory,
      primaryColor: LuxuryColors.primaryBurgundy,
      colorScheme: const ColorScheme.light(
        primary: LuxuryColors.primaryBurgundy,
        onPrimary: Colors.white,
        secondary: LuxuryColors.goldAccent,
        onSecondary: LuxuryColors.textObsidian,
        surface: LuxuryColors.surfaceCream,
        onSurface: LuxuryColors.textObsidian,
        surfaceContainerHighest: LuxuryColors.borderSand,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: LuxuryColors.backgroundIvory,
        elevation: 0,
        centerTitle: true,
        scrolledUnderElevation: 0,
        iconTheme: const IconThemeData(color: LuxuryColors.textObsidian),
        titleTextStyle: GoogleFonts.playfairDisplay(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: LuxuryColors.textObsidian,
          letterSpacing: 0.5,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: LuxuryColors.primaryBurgundy,
        unselectedItemColor: LuxuryColors.textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.playfairDisplay(
          fontSize: 32,
          fontWeight: FontWeight.w600,
          color: LuxuryColors.textObsidian,
          letterSpacing: -0.5,
        ),
        displayMedium: GoogleFonts.playfairDisplay(
          fontSize: 26,
          fontWeight: FontWeight.w600,
          color: LuxuryColors.textObsidian,
        ),
        headlineSmall: GoogleFonts.playfairDisplay(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: LuxuryColors.textObsidian,
        ),
        titleMedium: GoogleFonts.inter(
          fontSize: 15,
          fontWeight: FontWeight.w600,
          color: LuxuryColors.textObsidian,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 15,
          color: LuxuryColors.textObsidian,
          height: 1.5,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 13,
          color: LuxuryColors.textMuted,
          height: 1.4,
        ),
        labelLarge: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.2,
          color: Colors.white,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: LuxuryColors.primaryBurgundy,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(6),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            letterSpacing: 1.1,
          ),
        ),
      ),
    );
  }
}

