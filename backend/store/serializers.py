"""
store/serializers.py
Serializers convert Django model instances into JSON (and validate incoming JSON).
Think of them as the 'translator' between Python objects and the API responses.
"""

from rest_framework import serializers
from .models import (
    Category, Product, ProductImage, Order, OrderItem, ReturnRequest, WishlistItem, ContactMessage, NewsletterSubscriber
)


# ─── Category ────────────────────────────────────────────────────────────────

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "enabled", "tagline"]


# ─── Product Image ───────────────────────────────────────────────────────────

class ProductImageSerializer(serializers.ModelSerializer):
    """
    Serializes a single photo angle, returning full URL and thumbnail URL.
    """
    url = serializers.CharField(read_only=True)
    thumbnailUrl = serializers.CharField(source="thumb_url", read_only=True)
    alt = serializers.CharField(source="alt_text", read_only=True)

    class Meta:
        model = ProductImage
        fields = [
            "id",
            "url",
            "thumbnailUrl",
            "color",
            "angle",
            "position",
            "is_primary",
            "alt",
        ]


# ─── Product ─────────────────────────────────────────────────────────────────

class ProductSerializer(serializers.ModelSerializer):
    """
    Full product representation. Matches the Product interface in the frontend.
    Includes grouped color variants with multi-angle photography.
    """
    category = serializers.CharField(source="category.id", read_only=True)  # Returns 'women', 'girls' etc.
    originalPrice = serializers.IntegerField(source="original_price", read_only=True)
    saleNote = serializers.CharField(source="sale_note", read_only=True)
    colorHex = serializers.CharField(source="color_hex", read_only=True)
    availableColors = serializers.JSONField(source="available_colors", read_only=True)
    galleryImages = serializers.JSONField(source="gallery_images", read_only=True)
    materialComposition = serializers.CharField(source="material_composition", read_only=True)
    inStock = serializers.BooleanField(source="in_stock", read_only=True)
    image = serializers.CharField(source="primary_image_url", read_only=True)
    secondaryImage = serializers.CharField(source="secondary_image_url", read_only=True)
    materialComposition = serializers.CharField(source="material_composition", read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "slug",
            "name",
            "category",
            "department",
            "price",
            "original_price",
            "originalPrice",
            "sale_note",
            "saleNote",
            "currency",
            "color",
            "color_hex",
            "colorHex",
            "available_colors",
            "availableColors",
            "sizes",
            "image",
            "secondaryImage",
            "images",
            "variants",
            "gallery_images",
            "galleryImages",
            "description",
            "details",
            "fabric",
            "care",
            "badge",
            "fit",
            "material_composition",
            "materialComposition",
            "occasion",
            "in_stock",
            "inStock",
        ]

    def get_variants(self, obj):
        """
        Groups photos per color variant so frontend switches photos instantly when a swatch is clicked.
        Format:
        [
          {
            "color": "Brown",
            "hex": "#7A5C43",
            "hasImages": true,
            "images": [ { "id": 1, "url": "...", "thumbnailUrl": "...", "angle": "front", "alt": "...", "position": 0, "isPrimary": true } ]
          },
          {
            "color": "Apricot",
            "hex": "#F0C4A4",
            "hasImages": false,
            "images": []
          }
        ]
        """
        result = []
        all_imgs = list(obj.images.all())

        # Collect configured color options
        color_entries = []
        if isinstance(obj.available_colors, list):
            for c in obj.available_colors:
                if isinstance(c, dict) and "name" in c:
                    color_entries.append((c["name"], c.get("hex", "#D8CFC6")))
                elif isinstance(c, str):
                    clean = c.replace('[', '').replace(']', '').replace('"', '').replace("'", '').strip()
                    if clean:
                        color_entries.append((clean, obj.color_hex or "#D8CFC6"))

        # Include base color if not in available_colors
        existing_names = {c[0].lower() for c in color_entries}
        if obj.color and obj.color.lower() not in existing_names:
            color_entries.insert(0, (obj.color, obj.color_hex or "#D8CFC6"))

        # Build variant for each configured color
        for name, hex_code in color_entries:
            matching = [
                img for img in all_imgs
                if img.color and img.color.strip().lower() == name.lower()
            ]

            # If no color-specific images exist, but there are unassigned/neutral images and this is the primary color
            if not matching and (name.lower() == (obj.color or "").lower()) and all_imgs:
                neutral = [img for img in all_imgs if not img.color]
                if neutral:
                    matching = neutral

            # Fallback for legacy products with no ProductImage rows
            if not matching and not all_imgs and obj.image and name.lower() == (obj.color or "").lower():
                serialized_imgs = [
                    {
                        "id": 0,
                        "url": obj.image,
                        "thumbnailUrl": obj.image,
                        "angle": "front",
                        "alt": f"{obj.name} in {name}",
                        "position": 0,
                        "isPrimary": True,
                    }
                ]
                if obj.gallery_images and isinstance(obj.gallery_images, list):
                    for idx, g_url in enumerate(obj.gallery_images, start=1):
                        serialized_imgs.append({
                            "id": f"g_{idx}",
                            "url": g_url,
                            "thumbnailUrl": g_url,
                            "angle": "detail",
                            "alt": f"{obj.name} view {idx + 1}",
                            "position": idx,
                            "isPrimary": False,
                        })
                result.append({
                    "color": name,
                    "hex": hex_code,
                    "hasImages": True,
                    "images": serialized_imgs,
                })
            else:
                serialized_imgs = [
                    {
                        "id": img.id,
                        "url": img.url,
                        "thumbnailUrl": img.thumb_url,
                        "color": img.color,
                        "angle": img.angle,
                        "alt": img.alt_text,
                        "position": img.position,
                        "isPrimary": img.is_primary,
                    }
                    for img in matching
                ]
                result.append({
                    "color": name,
                    "hex": hex_code,
                    "hasImages": len(serialized_imgs) > 0,
                    "images": serialized_imgs,
                })

        # Also capture any colors present in ProductImage not explicitly listed in available_colors
        assigned_colors = {c[0].lower() for c in color_entries}
        for img in all_imgs:
            if img.color and img.color.strip().lower() not in assigned_colors:
                c_name = img.color.strip()
                assigned_colors.add(c_name.lower())
                matching = [i for i in all_imgs if i.color and i.color.strip().lower() == c_name.lower()]
                result.append({
                    "color": c_name,
                    "hex": "#D8CFC6",
                    "hasImages": True,
                    "images": [
                        {
                            "id": i.id,
                            "url": i.url,
                            "thumbnailUrl": i.thumb_url,
                            "color": i.color,
                            "angle": i.angle,
                            "alt": i.alt_text,
                            "position": i.position,
                            "isPrimary": i.is_primary,
                        }
                        for i in matching
                    ],
                })

        return result


class ProductListSerializer(serializers.ModelSerializer):
    """
    Lightweight version for listing many products (no gallery, no details array).
    Used on category pages and search results to keep response small.
    Includes secondaryImage for smooth hover previews.
    """
    category = serializers.CharField(source="category.id", read_only=True)
    originalPrice = serializers.IntegerField(source="original_price", read_only=True)
    saleNote = serializers.CharField(source="sale_note", read_only=True)
    colorHex = serializers.CharField(source="color_hex", read_only=True)
    availableColors = serializers.JSONField(source="available_colors", read_only=True)
    inStock = serializers.BooleanField(source="in_stock", read_only=True)
    image = serializers.CharField(source="primary_image_url", read_only=True)
    secondaryImage = serializers.CharField(source="secondary_image_url", read_only=True)
    materialComposition = serializers.CharField(source="material_composition", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "slug",
            "name",
            "category",
            "department",
            "price",
            "original_price",
            "originalPrice",
            "sale_note",
            "saleNote",
            "currency",
            "color",
            "color_hex",
            "colorHex",
            "available_colors",
            "availableColors",
            "sizes",
            "image",
            "secondaryImage",
            "badge",
            "fit",
            "material_composition",
            "materialComposition",
            "occasion",
            "in_stock",
            "inStock",
        ]



# ─── Order ───────────────────────────────────────────────────────────────────

class OrderItemSerializer(serializers.ModelSerializer):
    """A single line item in an order."""
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), required=False, allow_null=True
    )
    product_name = serializers.CharField(required=False, allow_blank=True)
    product_slug = serializers.CharField(required=False, allow_blank=True)
    size = serializers.CharField(required=False, allow_blank=True, default="Standard")
    color = serializers.CharField(required=False, allow_blank=True, default="")
    quantity = serializers.IntegerField(required=False, default=1)
    unit_price = serializers.IntegerField(required=False, default=0)
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.product:
            return obj.product.primary_image_url or "/images/cardigan.png"
        return "/images/cardigan.png"

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_slug",
            "size",
            "color",
            "quantity",
            "unit_price",
            "image",
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    """
    Used when the frontend POSTS a new order.
    Accepts a list of items nested inside the order.
    """
    items = OrderItemSerializer(many=True)   # Accept array of items
    subtotal = serializers.IntegerField(required=False)
    delivery_fee = serializers.IntegerField(required=False, default=0)
    total = serializers.IntegerField(required=False)

    class Meta:
        model = Order
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "address_line1",
            "address_line2",
            "city",
            "postcode",
            "country",
            "subtotal",
            "delivery_fee",
            "total",
            "currency",
            "delivery_method",
            "payment_method",
            "card_last4",
            "gift_note",
            "estimated_delivery",
            "items",
        ]

    def validate(self, attrs):
        items = attrs.get("items", [])
        if not items:
            raise serializers.ValidationError({"items": "An order must contain at least one item."})

        calculated_subtotal = 0
        for item in items:
            product = item.get("product")
            product_slug = item.get("product_slug")
            # If product FK is omitted, resolve via product_slug
            if not product and product_slug:
                product = Product.objects.filter(slug=product_slug).first()
                if product:
                    item["product"] = product

            qty = item.get("quantity", 1)
            if qty <= 0:
                raise serializers.ValidationError({"items": "Item quantity must be greater than zero."})

            if product:
                # Stock validation: reject if item is disabled/out of stock
                if not product.in_stock:
                    raise serializers.ValidationError(
                        {"items": f"'{product.name}' is currently out of stock and cannot be purchased."}
                    )
                # Server-authoritative unit price (prevent client body tampering)
                item["unit_price"] = product.price
                item["product_name"] = product.name
                item["product_slug"] = product.slug
                calculated_subtotal += product.price * qty
            else:
                unit_price = item.get("unit_price", 0)
                calculated_subtotal += unit_price * qty

        delivery_fee = attrs.get("delivery_fee", 0)
        attrs["subtotal"] = calculated_subtotal
        attrs["total"] = calculated_subtotal + delivery_fee

        # Auto-confirmation & Tentative Delivery:
        # Cash on Delivery orders are auto-confirmed immediately upon placement
        payment_method = attrs.get("payment_method", "").lower()
        if payment_method in ["cod", "cash on delivery", "upi", "card", "credit card", "debit card", "netbanking"]:
            attrs["status"] = "confirmed"

        if not attrs.get("estimated_delivery"):
            delivery_method = attrs.get("delivery_method", "").lower()
            if "express" in delivery_method or "priority" in delivery_method:
                attrs["estimated_delivery"] = "1–2 working days"
            else:
                attrs["estimated_delivery"] = "3–5 working days"

        return attrs

    def create(self, validated_data):
        # Pull out the nested items list before creating the order
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        # Create each OrderItem linked to this order
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order


class ReturnRequestSerializer(serializers.ModelSerializer):
    """Serializes a return or exchange request linked to an order."""
    resolution_display = serializers.CharField(source="get_resolution_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = ReturnRequest
        fields = [
            "id",
            "return_number",
            "order",
            "item_name",
            "item_size",
            "item_color",
            "item_quantity",
            "reason",
            "resolution",
            "resolution_display",
            "requested_exchange_size",
            "pickup_slot",
            "courier",
            "customer_notes",
            "status",
            "status_display",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "return_number", "created_at", "updated_at"]


class OrderSerializer(serializers.ModelSerializer):
    """Full order representation including all its items and return requests."""
    items = OrderItemSerializer(many=True, read_only=True)
    returns = ReturnRequestSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "first_name",
            "last_name",
            "email",
            "phone",
            "address_line1",
            "address_line2",
            "city",
            "postcode",
            "country",
            "subtotal",
            "delivery_fee",
            "total",
            "currency",
            "delivery_method",
            "payment_method",
            "card_last4",
            "gift_note",
            "status",
            "estimated_delivery",
            "created_at",
            "items",
            "returns",
        ]


# ─── Contact ─────────────────────────────────────────────────────────────────

class ContactMessageSerializer(serializers.ModelSerializer):
    """Validates and saves a contact form submission, and serializes responses."""

    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "name",
            "email",
            "subject",
            "message",
            "submitted_at",
            "is_read",
            "is_replied",
            "replied_at",
            "admin_reply",
        ]
        read_only_fields = ["id", "submitted_at", "is_read", "is_replied", "replied_at", "admin_reply"]


# ─── Wishlist ────────────────────────────────────────────────────────────────

class WishlistItemSerializer(serializers.ModelSerializer):
    """Serializes wishlist items with linked product details."""
    product = ProductListSerializer(read_only=True)
    product_slug = serializers.CharField(source="product.slug", read_only=True)

    class Meta:
        model = WishlistItem
        fields = ["id", "session_key", "product", "product_slug", "added_at"]


# ─── Newsletter ──────────────────────────────────────────────────────────────

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    """Validates and creates or reactivates a newsletter subscription."""
    email = serializers.EmailField()

    class Meta:
        model = NewsletterSubscriber
        fields = ["id", "email", "source", "is_active", "subscribed_at"]
        read_only_fields = ["id", "is_active", "subscribed_at"]

    def create(self, validated_data):
        email = validated_data.get("email").strip().lower()
        source = validated_data.get("source", "homepage_wardrobe_letters")
        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=email,
            defaults={"source": source, "is_active": True}
        )
        if not created and not subscriber.is_active:
            subscriber.is_active = True
            subscriber.unsubscribed_at = None
            subscriber.save()
        return subscriber

