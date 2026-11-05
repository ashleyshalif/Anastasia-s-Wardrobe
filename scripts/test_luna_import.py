import os, sys, django
sys.path.append(os.path.abspath('backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from store.bulk import parse_and_validate_import

zpath = r'C:/Users/USER/.gemini/antigravity/brain/139f5ca0-63b6-42f8-8e66-a77b4623ddd8/.user_uploaded/media_1793526364490_75bd0c8d.zip'

class MockUpload:
    def __init__(self, path, name):
        self.file = open(path, 'rb')
        self.name = name
    def read(self, *args):
        return self.file.read(*args)
    def seek(self, *args):
        return self.file.seek(*args)
    def tell(self):
        return self.file.tell()

mock = MockUpload(zpath, '10.2-luna-baroque-pearl-choker.zip')
report = parse_and_validate_import(mock, is_dry_run=False, auto_create_categories=True)

print('Report zip images:', report['zip_images_count'])
print('Attached count:', len(report['zip_images_attached']))
print('Updated count:', report['updated_count'])
for item in report['zip_images_attached']:
    print('  ', item['file'], '->', item['product'], item['slug'])

