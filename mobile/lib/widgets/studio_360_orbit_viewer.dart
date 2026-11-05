import 'dart:async';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/product.dart';
import '../config/luxury_theme.dart';

class Studio360OrbitViewer extends StatefulWidget {
  final Product product;

  const Studio360OrbitViewer({Key? key, required this.product}) : super(key: key);

  @override
  State<Studio360OrbitViewer> createState() => _Studio360OrbitViewerState();
}

class _Studio360OrbitViewerState extends State<Studio360OrbitViewer> {
  int _currentIndex = 0;
  bool _isAutoSpinning = true;
  Timer? _spinTimer;
  double _dragAccumulator = 0.0;

  List<String> get _frames {
    if (widget.product.galleryImages.length >= 3) {
      return widget.product.galleryImages;
    }
    return [
      widget.product.imageUrl,
      if (widget.product.secondaryImageUrl != null) widget.product.secondaryImageUrl!,
      widget.product.imageUrl,
    ];
  }

  static const List<String> _angleLabels = [
    '0° Studio Front',
    '45° Three-Quarter',
    '90° Profile Silhouette',
    '180° Rear Back',
    '270° Texture Detail',
    '360° Runway Movement',
  ];

  @override
  void initState() {
    super.initState();
    _startAutoSpin();
  }

  void _startAutoSpin() {
    _spinTimer?.cancel();
    if (!_isAutoSpinning || _frames.isEmpty) return;

    _spinTimer = Timer.periodic(const Duration(milliseconds: 500), (_) {
      if (mounted) {
        setState(() {
          _currentIndex = (_currentIndex + 1) % _frames.length;
        });
      }
    });
  }

  void _stopAutoSpin() {
    _spinTimer?.cancel();
    if (_isAutoSpinning) {
      setState(() {
        _isAutoSpinning = false;
      });
    }
  }

  void _onHorizontalDragUpdate(DragUpdateDetails details) {
    _stopAutoSpin();
    _dragAccumulator += details.delta.dx;

    const double sensitivity = 22.0; // 22 pixels per frame
    if (_dragAccumulator.abs() >= sensitivity) {
      final steps = (_dragAccumulator / sensitivity).truncate();
      _dragAccumulator -= steps * sensitivity;

      setState(() {
        int next = (_currentIndex - steps) % _frames.length;
        if (next < 0) next += _frames.length;
        _currentIndex = next;
      });
    }
  }

  @override
  void dispose() {
    _spinTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_frames.isEmpty) return const SizedBox.shrink();

    final currentLabel = _currentIndex < _angleLabels.length
        ? _angleLabels[_currentIndex]
        : '${_currentIndex * 60}° Studio View';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: LuxuryColors.borderSand),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          // Header Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        color: LuxuryColors.primaryBurgundy,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '360°',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Interactive Studio Orbit',
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: LuxuryColors.textObsidian,
                          ),
                        ),
                        Text(
                          currentLabel,
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            color: LuxuryColors.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _isAutoSpinning = !_isAutoSpinning;
                    });
                    if (_isAutoSpinning) {
                      _startAutoSpin();
                    } else {
                      _stopAutoSpin();
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: _isAutoSpinning ? LuxuryColors.primaryBurgundy : Colors.white,
                      border: Border.all(
                        color: _isAutoSpinning ? LuxuryColors.primaryBurgundy : LuxuryColors.borderSand,
                      ),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          _isAutoSpinning ? Icons.pause : Icons.play_arrow,
                          size: 13,
                          color: _isAutoSpinning ? Colors.white : LuxuryColors.textObsidian,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          _isAutoSpinning ? 'PAUSE' : 'AUTO SPIN',
                          style: GoogleFonts.inter(
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.5,
                            color: _isAutoSpinning ? Colors.white : LuxuryColors.textObsidian,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1, color: LuxuryColors.softDivider),

          // Main Interactive Turntable Canvas
          GestureDetector(
            onHorizontalDragUpdate: _onHorizontalDragUpdate,
            child: Container(
              height: 340,
              width: double.infinity,
              color: const Color(0xFFF7F4EF),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  CachedNetworkImage(
                    imageUrl: _frames[_currentIndex],
                    fit: BoxFit.contain,
                    placeholder: (_, __) => const Center(
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: LuxuryColors.primaryBurgundy,
                      ),
                    ),
                  ),

                  // Drag hint overlay pill
                  Positioned(
                    bottom: 12,
                    left: 0,
                    right: 0,
                    child: Center(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.92),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: LuxuryColors.borderSand),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Text(
                          'Drag left / right to rotate piece',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                            color: LuxuryColors.textObsidian,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          const Divider(height: 1, color: LuxuryColors.softDivider),

          // Angle Thumbnails Strip
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            color: Colors.white,
            child: Row(
              children: List.generate(_frames.length, (idx) {
                final isSelected = idx == _currentIndex;
                return Expanded(
                  child: GestureDetector(
                    onTap: () {
                      _stopAutoSpin();
                      setState(() {
                        _currentIndex = idx;
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 3),
                      height: 48,
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: isSelected ? LuxuryColors.primaryBurgundy : LuxuryColors.borderSand,
                          width: isSelected ? 2 : 1,
                        ),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: CachedNetworkImage(
                        imageUrl: _frames[idx],
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                );
              }),
            ),
          ),
        ],
      ),
    );
  }
}

