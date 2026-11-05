import 'dart:io';

class ApiConfig {
  // Development Host Configuration:
  // - Android Emulator: 10.0.2.2 points to host PC
  // - Physical Device: Laptop Wi-Fi IP (192.168.29.239)
  // - iOS Simulator / Desktop: 127.0.0.1 or localhost
  static String get defaultHost {
    try {
      if (Platform.isAndroid) {
        // You can toggle between 10.0.2.2 (emulator) and 192.168.29.239 (physical device)
        return "192.168.29.239";
      }
    } catch (_) {}
    return "192.168.29.239";
  }

  static const int defaultPort = 8000;

  static String get baseUrl {
    return "http://$defaultHost:$defaultPort/api";
  }

  static String get mediaBaseUrl {
    return "http://$defaultHost:$defaultPort";
  }

  // Endpoints
  static String get products => "$baseUrl/products/";
  static String get categories => "$baseUrl/categories/";
  static String get orders => "$baseUrl/orders/";
  static String get authLogin => "$baseUrl/auth/login/";
  static String get authRegister => "$baseUrl/auth/register/";
  static String get authProfile => "$baseUrl/auth/profile/";

  // Helper to ensure image URLs are fully qualified
  static String resolveImageUrl(String? rawUrl) {
    if (rawUrl == null || rawUrl.isEmpty) {
      return "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80";
    }
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
      return rawUrl;
    }
    if (rawUrl.startsWith("/")) {
      return "$mediaBaseUrl$rawUrl";
    }
    return "$mediaBaseUrl/$rawUrl";
  }
}

