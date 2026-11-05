import zipfile
import os
import shutil
import re

base_uploaded = r'C:\Users\USER\.gemini\antigravity\brain\139f5ca0-63b6-42f8-8e66-a77b4623ddd8\.user_uploaded'
dest_products_dir = r'artifacts\rynas-wardrobe\public\images\products'
dest_videos_dir = r'artifacts\rynas-wardrobe\public\videos'

os.makedirs(dest_products_dir, exist_ok=True)
os.makedirs(dest_videos_dir, exist_ok=True)

# 1. Copy the 10_products_360_rotation_reel.mp4
reel_src = os.path.join(base_uploaded, 'media_1793469503320_5724bc1d.mp4')
reel_dest = os.path.join(dest_videos_dir, '10_products_360_rotation_reel.mp4')
if os.path.exists(reel_src):
    shutil.copy2(reel_src, reel_dest)
    print(f'Copied 10_products_360_rotation_reel.mp4 ({os.path.getsize(reel_dest)} bytes)')
else:
    print('reel_src not found:', reel_src)

# 2. Extract zips
zips = [
    'media_1793469746394_9c1da3b0.zip', # REYA1
    'media_1793469826813_659e244e.zip', # REYA2
    'media_1793469838847_b942e85b.zip', # REYA5
]

for zip_filename in zips:
    zip_path = os.path.join(base_uploaded, zip_filename)
    if not os.path.exists(zip_path):
        print('Zip not found:', zip_path)
        continue
    print(f'Processing {zip_filename}...')
    with zipfile.ZipFile(zip_path, 'r') as z:
        for info in z.infolist():
            if info.is_dir():
                continue
            fname = info.filename
            parts = [p for p in fname.replace('\\', '/').split('/') if p]
            if not parts:
                continue
            
            # Find the actual product folder (e.g., 10.1-aurelia-ribbed-gold-bangle)
            # Some might be nested like 10.6-astrid-cable-knit-sweater/10.10-elodie-corduroy-co-ord/front.jpg
            target_product_folder = None
            for p in reversed(parts[:-1]):
                if re.match(r'^\d+(\.\d+)?-', p) or any(k in p for k in ['aurelia', 'luna', 'pave', 'celeste', 'cloud', 'astrid', 'freya', 'night-market', 'sunday', 'elodie']):
                    target_product_folder = p
                    break
            if not target_product_folder:
                target_product_folder = parts[0]
            
            # Clean folder name (e.g. 10.1-aurelia-ribbed-gold-bangle -> aurelia-ribbed-gold-bangle)
            clean_product_name = re.sub(r'^\d+(\.\d+)?-', '', target_product_folder).strip().lower()
            file_basename = parts[-1]
            
            out_folder = os.path.join(dest_products_dir, clean_product_name)
            os.makedirs(out_folder, exist_ok=True)
            out_file = os.path.join(out_folder, file_basename)
            
            with z.open(info) as src_file, open(out_file, 'wb') as dst_file:
                shutil.copyfileobj(src_file, dst_file)
            print(f'  Extracted: {clean_product_name}/{file_basename} ({os.path.getsize(out_file)} bytes)')

print('All assets extracted successfully!')

