"""
store/models.py
Database models for Anastasia's Wardrobe.

Each class here becomes a table in the database.
We mirror the exact data the Next.js frontend uses.
"""

import os
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


from django.core.cache import cache


class CacheInvalidatingQuerySet(models.QuerySet):
    """
    Ensures that queryset.update() and queryset.delete() also clear the catalog cache,
    since Django's post_save / post_delete signals are bypassed by bulk queryset operations.
    """
    def update(self, **kwargs):
        rows = super().update(**kwargs)
        try:
            cache.clear()
        except Exception:
            pass
        return rows

    def delete(self):
        result = super().delete()
        try:
            cache.clear()
        except Exception:
            pass
        return result


# ─────────────────────────────────────────────────────────────────────────────
# CATEGORY
# ─────────────────────────────────────────────────────────────────────────────

class Category(models.Model):
    """
    A product category, e.g. 'Women', 'Girls 2-12', 'Gifts'.
    enabled=False means it's hidden from the shop (like Jewellery).
    """
    objects = CacheInvalidatingQuerySet.as_manager()

    id = models.CharField(max_length=50, primary_key=True)   # e.g. 'women', 'girls'
    name = models.CharField(max_length=100)                  # Display name: 'Girls 2–12'
    slug = models.SlugField(unique=True)                     # URL-safe: 'girls-2-12'
    enabled = models.BooleanField(default=True, db_index=True)              # False = hidden from shop
    tagline = models.CharField(max_length=255, blank=True)   # Short description shown in nav

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


# ─────────────────────────────────────────────────────────────────────────────
# PRODUCT
# ─────────────────────────────────────────────────────────────────────────────

class Product(models.Model):
    """
    A single product in the shop.
    Matches the Product TypeScript interface in the frontend exactly.
    """
    objects = CacheInvalidatingQuerySet.as_manager()

    # Identity
    slug = models.SlugField(unique=True)         # Used in the URL: /products/sunday-wool-cardigan
    name = models.CharField(max_length=200)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="products"
    )
    department = models.CharField(max_length=100)  # Human label e.g. 'Girls · 2–12'

    # Pricing (in INR paise? No — frontend uses whole rupees, so we store whole rupees)
    price = models.PositiveIntegerField(help_text="Price in INR (whole rupees)")
    original_price = models.PositiveIntegerField(
        null=True, blank=True, help_text="Original price if on sale"
    )
    sale_note = models.CharField(max_length=100, blank=True, help_text="e.g. 'Sale · save ₹500'")
    currency = models.CharField(max_length=10, default="INR")

    # Colour
    color = models.CharField(max_length=50)
    color_hex = models.CharField(max_length=10, blank=True, help_text="e.g. #D9CDB8")

    # Available colours stored as JSON: [{"name": "Oat", "hex": "#D9CDB8"}, ...]
    available_colors = models.JSONField(default=list, blank=True)

    # Sizes stored as JSON array: ["XS", "S", "M", "L"] or ["2-3 Y", "4-5 Y"]
    sizes = models.JSONField(default=list)

    # Main product image (URL path, e.g. /images/cardigan.png)
    image = models.CharField(max_length=500, blank=True)

    # Optional gallery images
    gallery_images = models.JSONField(default=list, blank=True)

    # Copy
    description = models.TextField()
    details = models.JSONField(default=list, blank=True, help_text="Bullet point details list")
    fabric = models.CharField(max_length=200, blank=True)
    care = models.CharField(max_length=200, blank=True)

    # Normalized Taxonomy & Material Attributes
    FIT_CHOICES = [
        ("relaxed", "Relaxed Fit"),
        ("tailored", "Tailored Fit"),
        ("oversized", "Oversized Fit"),
        ("regular", "Regular Fit"),
        ("classic", "Classic Fit"),
    ]
    fit = models.CharField(max_length=50, blank=True, choices=FIT_CHOICES, help_text="Garment silhouette fit")
    material_composition = models.CharField(max_length=200, blank=True, help_text="e.g. 100% Extra-Fine Merino Wool")
    occasion = models.CharField(max_length=100, blank=True, help_text="e.g. Everyday, Weekend, Workwear, Evening")

    # Badge shown on product card: 'BESTSELLER', 'JUST IN', 'NEW COLOUR', 'SALE'
    badge = models.CharField(max_length=50, blank=True)

    # Stock
    in_stock = models.BooleanField(default=True, db_index=True)

    # Timestamps (auto-managed by Django)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["category", "in_stock"]),
            models.Index(fields=["price"]),
        ]

    @property
    def primary_image_url(self):
        """Returns the primary image URL or fallback to legacy image field."""
        prim = self.images.filter(is_primary=True).first() or self.images.first()
        if prim:
            return prim.url
        return self.image or "/images/cardigan.png"

    @property
    def secondary_image_url(self):
        """Returns secondary image (side/back/lifestyle) for card hover preview."""
        imgs = list(self.images.all()[:3])
        if len(imgs) > 1:
            return imgs[1].url
        if self.gallery_images and len(self.gallery_images) > 0:
            return self.gallery_images[0]
        return ""

    def __str__(self):
        return self.name


from django.core.exceptions import ValidationError
from django.core.cache import cache

def validate_image_file(file_obj):
    """
    Validates uploaded image file:
    1. Maximum file size check (10MB)
    2. Extension whitelist (.jpg, .jpeg, .png, .webp, .avif)
    3. Magic byte header inspection to prevent disguised executables
    4. PIL image header verification
    """
    max_size_mb = 10
    if file_obj.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f"Image file too large. Maximum allowed size is {max_size_mb}MB.")

    ext = os.path.splitext(file_obj.name)[1].lower()
    allowed_exts = [".jpg", ".jpeg", ".png", ".webp", ".avif"]
    if ext not in allowed_exts:
        raise ValidationError(
            f"Unsupported file format '{ext}'. Please upload JPEG, PNG, or WebP images."
        )

    # Magic byte inspection: check the actual binary file header
    header = file_obj.read(32)
    file_obj.seek(0)  # Reset pointer immediately

    is_jpeg = header.startswith(b"\xff\xd8\xff")
    is_png = header.startswith(b"\x89PNG\r\n\x1a\n")
    is_webp = header.startswith(b"RIFF") and b"WEBP" in header[:16]
    is_avif = b"ftyp" in header[:12]

    if not (is_jpeg or is_png or is_webp or is_avif):
        raise ValidationError(
            "Security verification failed: File content does not match a valid image signature."
        )

    # Verify that PIL can decode the image structure
    try:
        from PIL import Image as PilImage
        img = PilImage.open(file_obj)
        img.verify()
        file_obj.seek(0)
    except Exception:
        file_obj.seek(0)
        raise ValidationError("Corrupt or invalid image file structure.")


# ─────────────────────────────────────────────────────────────────────────────
# PRODUCT IMAGE
# ─────────────────────────────────────────────────────────────────────────────

class ProductImage(models.Model):
    """
    Multiple high-resolution photography angles for a product.
    Tied optionally to a specific color variant (e.g. 'Brown', 'Apricot')
    or generic if shared across all variants.
    """
    objects = CacheInvalidatingQuerySet.as_manager()

    ANGLE_CHOICES = [
        ("front", "Front View"),
        ("side", "Side View"),
        ("back", "Back View"),
        ("detail", "Fabric / Detail View"),
        ("lifestyle", "Editorial / Lifestyle View"),
    ]

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    color = models.CharField(
        max_length=50, blank=True, db_index=True,
        help_text="Color variant this photo belongs to e.g. Brown, Apricot. Leave blank if neutral."
    )
    image = models.ImageField(
        upload_to="products/%Y/%m/",
        blank=True, null=True,
        max_length=500,
        validators=[validate_image_file],
        help_text="Upload product photo file (max 10MB, auto-compressed to WebP/JPEG)"
    )
    image_url = models.CharField(
        max_length=500, blank=True,
        help_text="Or enter existing path e.g. /images/cashmere-crewneck-jumper.jpg"
    )
    thumbnail = models.ImageField(
        upload_to="products/thumbnails/%Y/%m/",
        blank=True, null=True,
        max_length=500,
        help_text="Auto-generated thumbnail (300px wide)"
    )
    alt_text = models.CharField(max_length=255, blank=True)
    angle = models.CharField(max_length=20, choices=ANGLE_CHOICES, default="front")
    position = models.PositiveIntegerField(default=0, db_index=True, help_text="Ordering position (0 = first)")
    is_primary = models.BooleanField(default=False, help_text="Is this the primary cover photo for this color?")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["position", "id"]
        verbose_name = "Product Image"
        verbose_name_plural = "Product Images"
        indexes = [
            models.Index(fields=["product", "color"]),
            models.Index(fields=["position"]),
        ]

    @property
    def url(self):
        if self.image:
            return self.image.url
        return self.image_url or "/images/cardigan.png"

    @property
    def thumb_url(self):
        if self.thumbnail:
            return self.thumbnail.url
        return self.url

    def save(self, *args, **kwargs):
        # Auto-generate alt_text if blank
        if not self.alt_text:
            col = f" in {self.color}" if self.color else ""
            ang = f" - {self.get_angle_display()}" if self.angle else ""
            self.alt_text = f"{self.product.name}{col}{ang}"

        # If marked as primary, ensure other images for this product & color are unmarked
        if self.is_primary and self.product_id:
            ProductImage.objects.filter(
                product_id=self.product_id, color=self.color, is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)

        super().save(*args, **kwargs)

        # Optimize image with Pillow if an uploaded image file exists
        try:
            if self.image and hasattr(self.image, "path") and os.path.exists(self.image.path):
                self._optimize_and_generate_thumbnail()
        except Exception:
            pass

    def _optimize_and_generate_thumbnail(self):
        try:
            from PIL import Image as PilImage
            img_path = self.image.path
            with PilImage.open(img_path) as im:
                # Convert transparency to clean RGB
                if im.mode in ("RGBA", "LA", "P"):
                    bg = PilImage.new("RGB", im.size, (255, 253, 250))
                    bg.paste(im, mask=im.split()[-1] if im.mode in ("RGBA", "LA") else None)
                    im = bg
                elif im.mode != "RGB":
                    im = im.convert("RGB")

                # Resize if wider than 1600px
                max_w = 1600
                if im.width > max_w:
                    ratio = max_w / float(im.width)
                    new_h = int(float(im.height) * float(ratio))
                    im = im.resize((max_w, new_h), PilImage.Resampling.LANCZOS)

                # Save compressed WebP or high-grade optimized image
                im.save(img_path, format="JPEG", quality=85, optimize=True)

                # Generate WebP thumbnail if missing
                if not self.thumbnail:
                    import io
                    from django.core.files.base import ContentFile
                    thumb_w = 400
                    ratio = thumb_w / float(im.width)
                    thumb_h = int(float(im.height) * float(ratio))
                    thumb_im = im.resize((thumb_w, thumb_h), PilImage.Resampling.LANCZOS)
                    buffer = io.BytesIO()
                    thumb_im.save(buffer, format="WEBP", quality=82)
                    thumb_name = f"thumb_{os.path.splitext(os.path.basename(img_path))[0]}.webp"
                    self.thumbnail.save(thumb_name, ContentFile(buffer.getvalue()), save=False)
                    super().save(update_fields=["thumbnail"])
        except Exception:
            pass

    def __str__(self):
        col = f" [{self.color}]" if self.color else ""
        return f"{self.product.name} - {self.get_angle_display()}{col}"


from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

@receiver(post_delete, sender=ProductImage)
def cleanup_orphaned_image_files(sender, instance, **kwargs):
    """Deletes uploaded physical files when a ProductImage row is removed from DB."""
    for f in [instance.image, instance.thumbnail]:
        try:
            if f and hasattr(f, "path") and os.path.isfile(f.path):
                os.remove(f.path)
        except (OSError, ValueError, Exception):
            pass

@receiver([post_save, post_delete], sender=Product)
@receiver([post_save, post_delete], sender=ProductImage)
@receiver([post_save, post_delete], sender=Category)
def invalidate_catalog_cache(sender, **kwargs):
    """Instantly invalidates cached product & category responses on any catalog edit."""
    try:
        cache.clear()
    except Exception:
        pass



# ─────────────────────────────────────────────────────────────────────────────
# ORDER
# ─────────────────────────────────────────────────────────────────────────────

class Order(models.Model):
    """
    A customer order, created when they complete checkout.
    """

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    PAYMENT_CHOICES = [
        ("cod", "Cash on Delivery"),
        ("card", "Card"),
        ("upi", "UPI"),
        ("razorpay", "Razorpay"),
        ("netbanking", "NetBanking"),
    ]

    DELIVERY_CHOICES = [
        ("standard", "Standard Delivery (5–7 days)"),
        ("express", "Express Delivery (2–3 days)"),
    ]

    # Unique readable order number like AW-2024-00042
    order_number = models.CharField(max_length=30, unique=True, editable=False)

    # Customer contact info (no login required)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    # Delivery address
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    postcode = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="India")

    # Financials
    subtotal = models.PositiveIntegerField(help_text="Cart total in INR")
    delivery_fee = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField(help_text="Final total in INR")
    currency = models.CharField(max_length=10, default="INR")

    # Delivery & payment
    delivery_method = models.CharField(max_length=20, choices=DELIVERY_CHOICES, default="standard")
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default="cod")
    card_last4 = models.CharField(max_length=4, blank=True)

    # Optional gift note
    gift_note = models.TextField(blank=True)

    # Order lifecycle
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    estimated_delivery = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        # Auto-generate a readable order number on first save
        if not self.order_number:
            import datetime
            year = datetime.date.today().year
            # Count existing orders this year and pad to 5 digits
            count = Order.objects.filter(created_at__year=year).count() + 1
            self.order_number = f"AW-{year}-{count:05d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_number} ({self.first_name} {self.last_name})"


class OrderItem(models.Model):
    """
    A single line in an order (one product, one size, one colour, a quantity).
    An Order can have many OrderItems.
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=200)   # Snapshot in case product is deleted
    product_slug = models.CharField(max_length=200)
    size = models.CharField(max_length=20)
    color = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.PositiveIntegerField(help_text="Price per item at time of order")

    def get_total(self):
        if self.unit_price is None or self.quantity is None:
            return 0
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.quantity}× {self.product_name} ({self.size})"


class ReturnRequest(models.Model):
    """
    Tracks a customer return or exchange request linked to an order.
    Visible in Django admin and synchronized with the customer's account portal.
    """
    STATUS_CHOICES = [
        ("pending", "Pending Review"),
        ("pickup_scheduled", "Pickup Scheduled"),
        ("in_transit", "In Transit to Atelier"),
        ("received", "Received at Atelier"),
        ("inspected", "Inspected & Approved"),
        ("completed", "Completed"),
        ("rejected", "Rejected"),
    ]
    RESOLUTION_CHOICES = [
        ("exchange", "Size Exchange"),
        ("refund_original", "Refund to Original Payment"),
        ("store_credit", "Atelier Store Credit (+10% Bonus)"),
    ]

    return_number = models.CharField(max_length=30, unique=True, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="returns")
    item_name = models.CharField(max_length=200)
    item_size = models.CharField(max_length=50, blank=True)
    item_color = models.CharField(max_length=50, blank=True)
    item_quantity = models.PositiveIntegerField(default=1)
    reason = models.CharField(max_length=200)
    resolution = models.CharField(max_length=30, choices=RESOLUTION_CHOICES, default="exchange")
    requested_exchange_size = models.CharField(max_length=50, blank=True, verbose_name="Exchange Size")
    pickup_slot = models.CharField(max_length=200, default="Tomorrow, 10:00 AM – 2:00 PM (Blue Dart Courier)")
    courier = models.CharField(max_length=100, default="Blue Dart Express")
    customer_notes = models.TextField(blank=True)
    staff_notes = models.TextField(blank=True, help_text="Internal notes for warehouse / atelier staff.")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="pickup_scheduled")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Return & Exchange Request"
        verbose_name_plural = "Return & Exchange Requests"

    def save(self, *args, **kwargs):
        if not self.return_number:
            import random
            self.return_number = f"RA-{random.randint(10000, 99999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.return_number} · {self.get_resolution_display()} for {self.order.order_number} ({self.status})"


# ─────────────────────────────────────────────────────────────────────────────
# WISHLIST
# ─────────────────────────────────────────────────────────────────────────────

class WishlistItem(models.Model):
    """
    A product saved to a wishlist.
    session_key ties it to a browser session (no login needed).
    """
    session_key = models.CharField(max_length=40, db_index=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("session_key", "product")

    def __str__(self):
        return f"Wishlist: {self.product.name}"


# ─────────────────────────────────────────────────────────────────────────────
# CONTACT MESSAGE
# ─────────────────────────────────────────────────────────────────────────────

class ContactMessage(models.Model):
    """
    A message submitted through the contact form.
    Stored in the database so you can read them in the Django admin.
    """
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)   # Mark as read in admin
    admin_reply = models.TextField(blank=True, verbose_name="Staff Reply", help_text="Compose your response to the customer. Saving records your reply.")
    replied_at = models.DateTimeField(null=True, blank=True, verbose_name="Replied At")
    is_replied = models.BooleanField(default=False, verbose_name="Replied")

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"Message from {self.name} — {self.subject or '(no subject)'}"


# ─────────────────────────────────────────────────────────────────────────────
# NEWSLETTER SUBSCRIBER
# ─────────────────────────────────────────────────────────────────────────────

class NewsletterSubscriber(models.Model):
    """
    Subscribers to 'Letters from the wardrobe'.
    Allows the atelier to manage subscriber lists directly from the admin panel.
    """
    email = models.EmailField(unique=True, db_index=True)
    source = models.CharField(max_length=100, default="homepage_wardrobe_letters")
    is_active = models.BooleanField(default=True, db_index=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-subscribed_at"]
        verbose_name = "Newsletter Subscriber"
        verbose_name_plural = "Newsletter Subscribers"

    def __str__(self):
        return self.email


# ─────────────────────────────────────────────────────────────────────────────
# STAFF PROFILE & GRANULAR ACCESS CONTROL
# ─────────────────────────────────────────────────────────────────────────────

class StaffProfile(models.Model):
    """
    Role-Based Access Control (RBAC) profile for atelier staff members.
    Admins can selectively grant access to Orders, Inquiries, or Catalog modules.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="staff_profile")
    department = models.CharField(max_length=100, default="Operations", help_text="e.g. Concierge, Fulfillment, Inventory")
    can_manage_orders = models.BooleanField(
        default=False,
        verbose_name="Orders & Fulfillment Access",
        help_text="Can view, update order status, dispatch parcels, and process returns/exchanges."
    )
    can_manage_inquiries = models.BooleanField(
        default=False,
        verbose_name="Customer Inquiries Access",
        help_text="Can view, reply to customer inquiries, and trigger SMTP email replies."
    )
    can_manage_catalog = models.BooleanField(
        default=False,
        verbose_name="Catalog & Inventory Access",
        help_text="Can view catalog and toggle piece stock availability."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Staff Access Profile"
        verbose_name_plural = "Staff Access Profiles"

    def __str__(self):
        perms = []
        if self.can_manage_orders: perms.append("Orders")
        if self.can_manage_inquiries: perms.append("Inquiries")
        if self.can_manage_catalog: perms.append("Catalog")
        perm_str = ", ".join(perms) if perms else "No permissions"
        return f"{self.user.username} ({self.department}) — [{perm_str}]"


# ─────────────────────────────────────────────────────────────────────────────
# EMAIL OTP & PASSWORD RESET PASSKEYS
# ─────────────────────────────────────────────────────────────────────────────

class EmailVerificationOTP(models.Model):
    """
    Stores 6-digit one-time passkeys sent via SMTP for login, signup, and password reset.
    """
    PURPOSE_CHOICES = [
        ("login", "Customer / Staff Sign In"),
        ("signup", "New Account Verification"),
        ("reset_password", "Password Reset"),
    ]

    email = models.EmailField(db_index=True)
    otp = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES, default="login")
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Email OTP Passkey"
        verbose_name_plural = "Email OTP Passkeys"

    def __str__(self):
        status = "Used" if self.is_used else "Active"
        return f"{self.otp} for {self.email} ({self.purpose}) — {status}"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

