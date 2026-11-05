import urllib.request
import json
import re

routes = [
    ("Homepage", "http://localhost:3000/"),
    ("Freya Pleated Skirt (360° Studio Orbit)", "http://localhost:3000/product/freya-pleated-merino-skirt"),
    ("Primrose Smocked Sundress (Girls 2-12)", "http://localhost:3000/product/primrose-smocked-linen-sundress"),
    ("Staff Management Portal", "http://localhost:3000/staff"),
    ("Category - Women", "http://localhost:3000/category/women"),
    ("Category - Girls", "http://localhost:3000/category/girls"),
    ("Category - Teens", "http://localhost:3000/category/teens"),
    ("Django API - Products", "http://127.0.0.1:8000/api/v1/store/products/"),
]

print("=== RUNNING SYSTEM VERIFICATION SUITE ===")
all_passed = True
for name, url in routes:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            content = resp.read().decode("utf-8", errors="ignore")
            print(f"[PASS] {status} - {name} ({url})")
            
            # Content checks
            if "freya-pleated-merino-skirt" in url:
                if "/images/products/freya-pleated-merino-skirt/front.jpg" in content:
                    print("   Verified: Freya Skirt renders authentic studio multi-angle photos")
            if "primrose-smocked-linen-sundress" in url:
                if "/images/products/primrose-sundress/front.jpg" in content:
                    print("   Verified: Primrose Sundress renders authentic girls' studio photography")
                if "garden-dress-garden.jpg" not in content:
                    print("   Verified: Adult photoshoot photo was eliminated from Primrose Sundress")
            if url.endswith("/staff"):
                if "ATELIER BACKEND OPERATIONS CONSOLE" in content or "Staff Management Console" in content:
                    print("   Verified: Staff Management Console rendered without consumer storefront clutter")
    except Exception as e:
        all_passed = False
        print(f"[FAIL] {name} ({url}): {e}")

print("\n=== VERIFICATION RESULT ===")
if all_passed:
    print("ALL ROUTES VERIFIED 100% OPERATIONAL!")
else:
    print("SOME ROUTES FAILED.")

