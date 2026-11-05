"""
store/admin.py
Registers all models with the Django admin panel.
After this you can add/edit/delete products, categories, orders and messages
at http://127.0.0.1:8000/admin
"""

from django.contrib import admin
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import (
    Category,
    Product,
    ProductImage,
    Order,
    OrderItem,
    ReturnRequest,
    WishlistItem,
    ContactMessage,
    NewsletterSubscriber,
    StaffProfile,
    EmailVerificationOTP,
)


# ─── Category ────────────────────────────────────────────────────────────────

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "id", "slug", "enabled", "product_count"]
    list_editable = ["enabled"]   # Toggle enabled right from the list page
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name", "slug", "tagline"]
    ordering = ["name"]

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = "Products"


# ─── Product Image Inline ─────────────────────────────────────────────────────

class ProductImageInline(admin.TabularInline):
    """
    Shows multiple photography angles for the product inline.
    Allows uploading files or entering static paths, specifying angles & color variants.
    """
    model = ProductImage
    extra = 1
    fields = [
        "image_preview",
        "image",
        "image_url",
        "color",
        "angle",
        "position",
        "is_primary",
        "alt_text",
    ]
    readonly_fields = ["image_preview"]
    ordering = ["position", "id"]

    def image_preview(self, obj):
        if obj and (obj.image or obj.image_url):
            url = obj.url
            return format_html(
                '<a href="{0}" target="_blank">'
                '<img src="{0}" style="width: 52px; height: 68px; object-fit: cover; border-radius: 4px; border: 1px solid #D8CFC6; box-shadow: 0 1px 3px rgba(0,0,0,0.1);" />'
                '</a>',
                url
            )
        return mark_safe('<span style="color:#A89F91; font-size:11px; font-style:italic;">No photo</span>')
    image_preview.short_description = "Preview"


# ─── Product ─────────────────────────────────────────────────────────────────

class CategoryListFilter(admin.SimpleListFilter):
    """Clean category filter without empty '-' entry."""
    title = "Category"
    parameter_name = "category"

    def lookups(self, request, model_admin):
        cats = [(c.id, c.name) for c in Category.objects.all().order_by("name")]
        if Product.objects.filter(category__isnull=True).exists():
            cats.append(("none", "— Uncategorized —"))
        return cats

    def queryset(self, request, queryset):
        val = self.value()
        if val == "none":
            return queryset.filter(category__isnull=True)
        elif val:
            return queryset.filter(category__id=val)
        return queryset


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "thumbnail_tag", "name", "category", "price",
        "color", "in_stock", "image_count", "created_at"
    ]
    list_display_links = ["thumbnail_tag", "name"]
    list_filter = [CategoryListFilter, "in_stock", "badge", "created_at"]
    search_fields = ["name", "description", "slug", "color"]
    list_editable = ["price", "in_stock"]
    list_per_page = 20
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ["created_at", "updated_at", "cover_preview", "color_status_notice"]
    inlines = [ProductImageInline]

    fieldsets = [
        ("Identity", {
            "fields": ["name", "slug", "category", "department"],
            "description": "Core product title, category mapping and department heading."
        }),
        ("Pricing & Currency", {
            "fields": ["price", "original_price", "sale_note", "currency"],
            "description": "Enter whole amounts in INR. Sale note shows as a tag (e.g. 'Sale · Save ₹1,130')."
        }),
        ("Colours & Variant Sync", {
            "fields": [
                "color_status_notice",
                "color", "color_hex", "available_colors"
            ],
            "description": "Primary color and available swatch choices. Use the warning above to ensure all colors have photos."
        }),
        ("Legacy Cover Photo & Sizing", {
            "fields": [
                "cover_preview", "image", "gallery_images", "sizes"
            ],
            "description": "Cover photo fallback and available size choices. Add multi-angle photos in the gallery below."
        }),
        ("Copy & Editorial", {
            "fields": ["description", "details", "fabric", "care", "badge"],
            "description": "Customer-facing description, bullet points, fabric blend and luxury care instructions."
        }),
        ("Silhouette & Material Taxonomy", {
            "fields": ["fit", "material_composition", "occasion"],
            "description": "Garment silhouette fit, normalized fabric composition, and suggested styling occasions."
        }),
        ("Stock & Availability", {
            "fields": ["in_stock"],
        }),
        ("Timestamps", {
            "fields": ["created_at", "updated_at"],
            "classes": ["collapse"]
        }),
    ]

    change_list_template = "admin/store/product/change_list.html"
    actions = [
        "mark_in_stock",
        "mark_out_of_stock",
        "duplicate_product",
        "export_selected_csv",
        "export_selected_excel",
    ]

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path("import/", self.admin_site.admin_view(self.import_view), name="store_product_import"),
            path("export/csv/", self.admin_site.admin_view(self.export_csv_view), name="store_product_export_csv"),
            path("export/excel/", self.admin_site.admin_view(self.export_excel_view), name="store_product_export_excel"),
            path("template/csv/", self.admin_site.admin_view(self.template_csv_view), name="store_product_template_csv"),
            path("template/excel/", self.admin_site.admin_view(self.template_excel_view), name="store_product_template_excel"),
        ]
        return custom_urls + urls

    def import_view(self, request):
        from django.shortcuts import render
        from .bulk import parse_and_validate_import
        report = None
        is_dry_run = True
        submitted = False

        if request.method == "POST" and "import_file" in request.FILES:
            submitted = True
            uploaded_file = request.FILES["import_file"]
            is_dry_run = bool(request.POST.get("is_dry_run"))
            auto_create = bool(request.POST.get("auto_create_categories"))
            report = parse_and_validate_import(
                uploaded_file, is_dry_run=is_dry_run, auto_create_categories=auto_create
            )

            if not is_dry_run and report.get("error_count", 0) == 0 and (report.get("created_count", 0) > 0 or report.get("updated_count", 0) > 0):
                self.message_user(
                    request,
                    f"Successfully imported {report['created_count']} new and updated {report['updated_count']} products.",
                    messages.SUCCESS,
                )

        context = {
            **self.admin_site.each_context(request),
            "opts": self.model._meta,
            "title": "Bulk Product & Gallery Import",
            "report": report,
            "is_dry_run": is_dry_run,
            "submitted": submitted,
        }
        return render(request, "admin/store/product/import.html", context)

    def export_csv_view(self, request):
        from .bulk import export_products_csv
        return export_products_csv(self.get_queryset(request))

    def export_excel_view(self, request):
        from .bulk import export_products_excel
        return export_products_excel(self.get_queryset(request))

    def template_csv_view(self, request):
        from .bulk import generate_template_csv
        return generate_template_csv()

    def template_excel_view(self, request):
        from .bulk import generate_template_excel
        return generate_template_excel()

    @admin.action(description="Export selected products as CSV")
    def export_selected_csv(self, request, queryset):
        from .bulk import export_products_csv
        return export_products_csv(queryset)

    @admin.action(description="Export selected products as Excel (.xlsx)")
    def export_selected_excel(self, request, queryset):
        from .bulk import export_products_excel
        return export_products_excel(queryset)

    def delete_model(self, request, obj):
        # Soft-delete / Protect check if referenced in orders
        if obj.orderitem_set.exists():
            obj.in_stock = False
            obj.save(update_fields=["in_stock"])
            self.message_user(
                request,
                f"Product '{obj.name}' is part of customer order history and cannot be deleted. "
                "It has been safely archived (marked Out of Stock) to remove it from the storefront without breaking orders.",
                messages.WARNING,
            )
            return
        super().delete_model(request, obj)

    def delete_queryset(self, request, queryset):
        protected = []
        deletable = []
        for p in queryset:
            if p.orderitem_set.exists():
                protected.append(p)
            else:
                deletable.append(p)

        if protected:
            for p in protected:
                p.in_stock = False
                p.save(update_fields=["in_stock"])
            self.message_user(
                request,
                f"{len(protected)} product(s) ({', '.join(p.name for p in protected[:3])}...) are linked to completed customer orders and were archived (marked Out of Stock) rather than deleted to protect audit trails.",
                messages.WARNING,
            )

        if deletable:
            Product.objects.filter(id__in=[p.id for p in deletable]).delete()
            self.message_user(
                request,
                f"{len(deletable)} unreferenced product(s) permanently deleted.",
                messages.SUCCESS,
            )

    def thumbnail_tag(self, obj):
        url = obj.primary_image_url
        return format_html(
            '<img src="{}" style="width: 42px; height: 54px; object-fit: cover; border-radius: 3px; border: 1px solid #D8CFC6;" />',
            url
        )
    thumbnail_tag.short_description = "Photo"

    def cover_preview(self, obj):
        if obj and obj.image:
            return format_html(
                '<div style="margin-bottom:8px;">'
                '<img src="{}" style="max-height: 140px; border-radius: 4px; border: 1px solid #D8CFC6;" /><br>'
                '<small style="color:#666;">Current main image URL: <code>{}</code></small>'
                '</div>',
                obj.image, obj.image
            )
        return "(no image set)"
    cover_preview.short_description = "Cover Preview"

    def image_count(self, obj):
        cnt = obj.images.count()
        if cnt > 0:
            return format_html('<span style="color:#2E7D32; font-weight:600;">{} photos</span>', cnt)
        return mark_safe('<span style="color:#856404; font-size:12px;">1 legacy</span>')
    image_count.short_description = "Gallery"

    def color_status_notice(self, obj):
        if not obj or not obj.pk:
            return mark_safe('<p style="color:#777;">Save the product first to verify color photo coverage.</p>')

        colors = []
        if isinstance(obj.available_colors, list):
            for c in obj.available_colors:
                if isinstance(c, dict) and "name" in c:
                    colors.append(c["name"])
                elif isinstance(c, str):
                    colors.append(c)
        if obj.color and obj.color not in colors:
            colors.append(obj.color)

        missing = []
        for col in colors:
            has_img = obj.images.filter(color__iexact=col.strip()).exists()
            if not has_img:
                missing.append(col.strip())

        if missing:
            badges = "".join([
                f'<span style="background:#FFF3CD; color:#856404; padding:3px 8px; border-radius:4px; font-weight:600; font-size:12px; margin-right:6px; border:1px solid #FFEEBA; display:inline-block; margin-bottom:4px;">⚠️ Color &ldquo;{c}&rdquo; has no images</span>'
                for c in missing
            ])
            return format_html(
                '<div style="background:#FFF8E7; border-left:4px solid #FFC107; padding:12px 14px; margin-bottom:12px; border-radius:0 4px 4px 0;">'
                '<strong style="color:#856404;">Photo Notice:</strong> The following color variants currently have no dedicated gallery images:<div style="margin:6px 0;">{}</div>'
                '<small style="color:#69615B;">In the <strong>Product Images</strong> inline below, add photo rows matching these Color names so when a customer clicks a swatch, the photos switch instantly.</small>'
                '</div>',
                mark_safe(badges)
            )

        return mark_safe(
            '<div style="background:#E8F5E9; border-left:4px solid #4CAF50; padding:10px 14px; color:#2E7D32; font-size:13px; font-weight:500; border-radius:0 4px 4px 0;">'
            '✓ All defined color variants have dedicated photos in the gallery.'
            '</div>'
        )
    color_status_notice.short_description = "Color Gallery Check"

    # Admin Actions
    @admin.action(description="Mark selected products as In Stock")
    def mark_in_stock(self, request, queryset):
        queryset.update(in_stock=True)
        self.message_user(request, f"{queryset.count()} product(s) marked as in stock.", messages.SUCCESS)

    @admin.action(description="Mark selected products as Out of Stock")
    def mark_out_of_stock(self, request, queryset):
        queryset.update(in_stock=False)
        self.message_user(request, f"{queryset.count()} product(s) marked as out of stock.", messages.WARNING)

    @admin.action(description="Duplicate selected product (creates copy)")
    def duplicate_product(self, request, queryset):
        for prod in queryset:
            images = list(prod.images.all())
            prod.pk = None
            prod.id = None
            prod.name = f"{prod.name} (Copy)"
            prod.slug = f"{prod.slug}-copy"
            prod.save()
            for img in images:
                img.pk = None
                img.id = None
                img.product = prod
                img.save()
        self.message_user(request, f"{queryset.count()} product(s) duplicated.", messages.SUCCESS)


# ─── Order & OrderItem ────────────────────────────────────────────────────────

class OrderItemInline(admin.TabularInline):
    """Shows order items as rows inside the Order admin page (Read-Only)."""
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = ["product", "product_name", "product_slug", "size", "color", "quantity", "unit_price", "line_total"]
    fields = ["product", "product_name", "size", "color", "quantity", "unit_price", "line_total"]

    def line_total(self, obj):
        if not obj or not obj.pk or obj.unit_price is None:
            return "—"
        try:
            return f"₹{int(obj.get_total()):,}"
        except (ValueError, TypeError):
            return f"₹{obj.get_total()}"
    line_total.short_description = "Total"


class ReturnRequestInline(admin.TabularInline):
    """Shows return and exchange requests linked to this order."""
    model = ReturnRequest
    extra = 0
    fields = [
        "return_number",
        "item_name",
        "item_size",
        "reason",
        "resolution",
        "requested_exchange_size",
        "status",
        "created_at",
    ]
    readonly_fields = ["return_number", "created_at"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "order_number", "customer_summary", "formatted_total",
        "status_badge", "delivery_method", "created_at"
    ]
    list_filter = ["status", "payment_method", "delivery_method", "created_at"]
    search_fields = ["order_number", "email", "first_name", "last_name", "phone"]
    list_editable = []
    readonly_fields = [
        "order_number", "created_at", "updated_at",
        "subtotal", "delivery_fee", "total", "currency"
    ]
    inlines = [OrderItemInline, ReturnRequestInline]

    fieldsets = [
        ("Order Header", {
            "fields": ["order_number", "status", "created_at", "updated_at"],
            "description": "Lifecycle milestone: Update status as parcel moves through fulfillment."
        }),
        ("Customer Contact", {
            "fields": ["first_name", "last_name", "email", "phone"]
        }),
        ("Delivery Address", {
            "fields": ["address_line1", "address_line2", "city", "postcode", "country"]
        }),
        ("Financials (GST Invoice)", {
            "fields": ["subtotal", "delivery_fee", "total", "currency"]
        }),
        ("Courier Dispatch & Logistics", {
            "fields": ["delivery_method", "estimated_delivery", "payment_method", "card_last4"]
        }),
        ("Complimentary Gift Note", {
            "fields": ["gift_note"],
            "classes": ["collapse"]
        }),
    ]

    def customer_summary(self, obj):
        return format_html(
            '<strong>{} {}</strong><br><small style="color:#69615B;">{} &middot; {}</small>',
            obj.first_name, obj.last_name, obj.email, obj.phone
        )
    customer_summary.short_description = "Customer"

    def formatted_total(self, obj):
        try:
            val = f"{int(obj.total):,}"
        except (ValueError, TypeError):
            val = str(obj.total)
        return format_html('<span style="font-weight:600; font-size:13px; color:#302B28;">₹{}</span>', val)
    formatted_total.short_description = "Amount"

    def status_badge(self, obj):
        colors = {
            "pending": ("#FFF3CD", "#856404"),
            "confirmed": ("#E3F2FD", "#1565C0"),
            "processing": ("#EDE7F6", "#512DA8"),
            "shipped": ("#E0F2F1", "#00695C"),
            "delivered": ("#E8F5E9", "#2E7D32"),
            "cancelled": ("#FFEBEE", "#C62828"),
        }
        bg, text = colors.get(obj.status.lower(), ("#F5F5F5", "#333"))
        return format_html(
            '<span style="background:{}; color:{}; padding:4px 10px; border-radius:12px; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.05em;">{}</span>',
            bg, text, obj.get_status_display()
        )
    status_badge.short_description = "Status"


# ─── Wishlist ─────────────────────────────────────────────────────────────────

@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ["product", "session_key", "added_at"]
    list_filter = ["added_at"]


# ─── Contact Messages ─────────────────────────────────────────────────────────

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "subject", "submitted_at", "status_badge", "quick_reply_link"]
    list_filter = ["is_replied", "is_read", "submitted_at"]
    search_fields = ["name", "email", "subject", "message", "admin_reply"]
    readonly_fields = ["name", "email", "subject", "message", "submitted_at", "replied_at", "email_reply_button"]
    fieldsets = (
        ("Customer Inquiry", {
            "fields": ("name", "email", "subject", "submitted_at", "message"),
        }),
        ("Atelier Staff Response & Reply", {
            "fields": ("is_read", "is_replied", "replied_at", "admin_reply", "email_reply_button"),
            "description": "Enter your response below and click Save. Saving will record the staff reply and update status to Replied.",
        }),
    )

    def status_badge(self, obj):
        if obj.is_replied:
            return mark_safe(
                '<span style="background:#E8F5E9; color:#2E7D32; padding:4px 10px; border-radius:12px; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.04em;">✓ Replied</span>'
            )
        if obj.is_read:
            return mark_safe(
                '<span style="background:#E3F2FD; color:#1565C0; padding:4px 10px; border-radius:12px; font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.04em;">Read</span>'
            )
        return mark_safe(
            '<span style="background:#FFEBEE; color:#C62828; padding:4px 10px; border-radius:12px; font-weight:700; font-size:11px; text-transform:uppercase; letter-spacing:0.04em;">● Unread</span>'
        )
    status_badge.short_description = "Status"

    def quick_reply_link(self, obj):
        from django.urls import reverse
        change_url = reverse("admin:store_contactmessage_change", args=[obj.pk])
        if obj.is_replied:
            return format_html('<a href="{}" style="color:var(--aw-wine);font-weight:600;font-size:12.5px;">View Reply →</a>', change_url)
        return format_html('<a href="{}" style="color:#C62828;font-weight:700;font-size:12.5px;">Reply Now →</a>', change_url)
    quick_reply_link.short_description = "Action"

    def email_reply_button(self, obj):
        if not obj.pk:
            return "Save inquiry first."
        import urllib.parse
        subject = f"Re: {obj.subject or 'Your Inquiry with Ryna\'s Wardrobe'}"
        greeting = f"Dear {obj.name},\n\n"
        body = greeting + (obj.admin_reply or "Thank you for contacting Ryna's Wardrobe.\n\n") + "\nWarm regards,\nRyna's Wardrobe Atelier Team"
        mailto_url = f"mailto:{obj.email}?subject={urllib.parse.quote(subject)}&body={urllib.parse.quote(body)}"
        return format_html(
            '<a href="{}" class="button" style="background:var(--aw-wine);color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;">'
            '✉️ Open in Email Client to Send to {}</a>',
            mailto_url, obj.email
        )
    email_reply_button.short_description = "Send via Email"

    def save_model(self, request, obj, form, change):
        from django.utils import timezone
        if obj.admin_reply and not obj.is_replied:
            obj.is_replied = True
            obj.is_read = True
            obj.replied_at = timezone.now()
        super().save_model(request, obj, form, change)


# ─── Return & Exchange Requests ──────────────────────────────────────────────

@admin.register(ReturnRequest)
class ReturnRequestAdmin(admin.ModelAdmin):
    list_display = [
        "return_number",
        "order_link",
        "item_name",
        "item_size",
        "resolution_badge",
        "status",
        "courier",
        "created_at",
    ]
    list_filter = ["status", "resolution", "courier", "created_at"]
    search_fields = ["return_number", "order__order_number", "order__email", "item_name", "reason"]
    readonly_fields = ["return_number", "created_at", "updated_at"]
    list_editable = ["status"]

    fieldsets = [
        ("Return Header", {
            "fields": ["return_number", "order", "status", "created_at", "updated_at"]
        }),
        ("Garment Details", {
            "fields": ["item_name", "item_size", "item_color", "item_quantity"]
        }),
        ("Customer Request", {
            "fields": ["reason", "resolution", "requested_exchange_size", "customer_notes"]
        }),
        ("Logistics & Doorstep Pickup", {
            "fields": ["courier", "pickup_slot", "staff_notes"]
        }),
    ]

    def order_link(self, obj):
        url = f"/admin/store/order/{obj.order.id}/change/"
        return format_html('<a href="{}" style="color:var(--aw-wine);font-weight:600;">{}</a>', url, obj.order.order_number)
    order_link.short_description = "Order"

    def resolution_badge(self, obj):
        return obj.get_resolution_display()
    resolution_badge.short_description = "Resolution"

    def status_badge(self, obj):
        colors = {
            "pending": "#B45309",
            "pickup_scheduled": "#2563EB",
            "in_transit": "#4F46E5",
            "received": "#0891B2",
            "inspected": "#059669",
            "completed": "#16A34A",
            "rejected": "#DC2626",
        }
        color = colors.get(obj.status, "#6B7280")
        return format_html(
            '<span style="background-color:{}1A;color:{};padding:3px 8px;border-radius:4px;font-weight:600;font-size:11px;border:1px solid {}40;">{}</span>',
            color, color, color, obj.get_status_display()
        )
    status_badge.short_description = "Status"


# ─── Newsletter Subscribers ──────────────────────────────────────────────────

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ["email", "status_badge", "source", "subscribed_at", "unsubscribed_at"]
    list_filter = ["is_active", "source", "subscribed_at"]
    search_fields = ["email"]
    ordering = ["-subscribed_at"]
    actions = ["activate_subscribers", "deactivate_subscribers"]

    def status_badge(self, obj):
        if obj.is_active:
            return mark_safe(
                '<span style="background:#E8F5E9; color:#2E7D32; padding:3px 9px; border-radius:12px; font-weight:600; font-size:11px; text-transform:uppercase;">Active</span>'
            )
        return mark_safe(
            '<span style="background:#ECEFF1; color:#546E7A; padding:3px 9px; border-radius:12px; font-weight:600; font-size:11px; text-transform:uppercase;">Unsubscribed</span>'
        )
    status_badge.short_description = "Status"

    def activate_subscribers(self, request, queryset):
        count = queryset.update(is_active=True, unsubscribed_at=None)
        self.message_user(request, f"{count} subscriber(s) marked as active.")
    activate_subscribers.short_description = "Mark selected as Active"

    def deactivate_subscribers(self, request, queryset):
        from django.utils import timezone
        count = queryset.update(is_active=False, unsubscribed_at=timezone.now())
        self.message_user(request, f"{count} subscriber(s) marked as unsubscribed.")
    deactivate_subscribers.short_description = "Mark selected as Unsubscribed"


# ─── Staff Access Profiles & Permissions ─────────────────────────────────────

@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "department", "orders_badge", "inquiries_badge", "catalog_badge", "updated_at"]
    list_filter = ["department", "can_manage_orders", "can_manage_inquiries", "can_manage_catalog"]
    search_fields = ["user__username", "user__email", "user__first_name", "user__last_name", "department"]
    list_editable = ["department"]

    def orders_badge(self, obj):
        if obj.can_manage_orders:
            return mark_safe('<span style="background:#E8F5E9; color:#2E7D32; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11px;">GRANTED</span>')
        return mark_safe('<span style="background:#FFEBEE; color:#C62828; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11px;">NO ACCESS</span>')
    orders_badge.short_description = "Orders & Fulfillment"

    def inquiries_badge(self, obj):
        if obj.can_manage_inquiries:
            return mark_safe('<span style="background:#E8F5E9; color:#2E7D32; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11px;">GRANTED</span>')
        return mark_safe('<span style="background:#FFEBEE; color:#C62828; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11px;">NO ACCESS</span>')
    inquiries_badge.short_description = "Customer Inquiries"

    def catalog_badge(self, obj):
        if obj.can_manage_catalog:
            return mark_safe('<span style="background:#E8F5E9; color:#2E7D32; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11px;">GRANTED</span>')
        return mark_safe('<span style="background:#FFEBEE; color:#C62828; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11px;">NO ACCESS</span>')
    catalog_badge.short_description = "Catalog / Stock"


@admin.register(EmailVerificationOTP)
class EmailVerificationOTPAdmin(admin.ModelAdmin):
    list_display = ["email", "otp", "purpose", "status_badge", "created_at", "expires_at"]
    list_filter = ["purpose", "is_used", "created_at"]
    search_fields = ["email", "otp"]
    readonly_fields = ["email", "otp", "purpose", "created_at", "expires_at"]

    def status_badge(self, obj):
        if obj.is_used:
            return mark_safe('<span style="background:#ECEFF1; color:#546E7A; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11px;">USED</span>')
        if obj.is_expired:
            return mark_safe('<span style="background:#FFEBEE; color:#C62828; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11px;">EXPIRED</span>')
        return mark_safe('<span style="background:#E8F5E9; color:#2E7D32; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11px;">ACTIVE</span>')
    status_badge.short_description = "Status"


class StaffProfileInline(admin.StackedInline):
    model = StaffProfile
    can_delete = False
    verbose_name_plural = "Atelier Staff Access Permissions"
    extra = 0


# Unregister default User and re-register with StaffProfileInline
try:
    admin.site.unregister(User)
except Exception:
    pass

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    inlines = [StaffProfileInline]
    list_display = ["username", "email", "first_name", "last_name", "is_staff", "staff_roles"]

    def staff_roles(self, obj):
        if obj.is_superuser:
            return mark_safe('<span style="background:#713A48; color:#fff; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">SUPERADMIN</span>')
        profile = getattr(obj, "staff_profile", None)
        if not profile:
            return mark_safe('<span style="color:#888;">Customer</span>')
        perms = []
        if profile.can_manage_orders: perms.append("Orders")
        if profile.can_manage_inquiries: perms.append("Inquiries")
        if profile.can_manage_catalog: perms.append("Catalog")
        perm_text = ", ".join(perms) if perms else "No Access"
        return mark_safe(f'<span style="background:#F0EAE1; color:#302B28; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:500;">{perm_text}</span>')
    staff_roles.short_description = "Granted Permissions"



# ─── Admin site branding & theme ─────────────────────────────────────────────

admin.site.site_header = "Ryna's Wardrobe — Store"
admin.site.site_title = "Ryna's Wardrobe Admin"
admin.site.index_title = "Atelier Store Management"
