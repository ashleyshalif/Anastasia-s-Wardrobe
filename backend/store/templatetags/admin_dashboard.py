from django import template
from django.db.models import Sum, Count
from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION
from store.models import Order, Product, Category, ContactMessage

register = template.Library()

@register.simple_tag
def get_dashboard_metrics():
    total_orders = Order.objects.count()
    revenue_res = Order.objects.filter(
        status__in=["confirmed", "processing", "shipped", "delivered"]
    ).aggregate(total_rev=Sum("total"))
    total_revenue = revenue_res["total_rev"] or 0

    pending_orders = Order.objects.filter(status="pending").count()
    confirmed_orders = Order.objects.filter(status="confirmed").count()
    shipped_orders = Order.objects.filter(status__in=["shipped", "delivered"]).count()
    cancelled_orders = Order.objects.filter(status="cancelled").count()

    active_products = Product.objects.filter(in_stock=True).count()
    out_of_stock_products = Product.objects.filter(in_stock=False).count()
    total_products = Product.objects.count()
    active_categories = Category.objects.filter(enabled=True).count()
    unread_inquiries = ContactMessage.objects.filter(is_read=False).count()

    recent_orders = Order.objects.order_by("-created_at")[:6]

    # Status distribution for visual breakdown
    status_counts = {
        "confirmed": confirmed_orders,
        "shipped": shipped_orders,
        "pending": pending_orders,
        "cancelled": cancelled_orders,
    }

    # Recent Audit Log Actions (SimpleUI style timeline)
    try:
        recent_actions = LogEntry.objects.select_related("content_type", "user").order_by("-action_time")[:8]
    except Exception:
        recent_actions = []

    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "pending_orders": pending_orders,
        "confirmed_orders": confirmed_orders,
        "shipped_orders": shipped_orders,
        "cancelled_orders": cancelled_orders,
        "active_products": active_products,
        "out_of_stock_products": out_of_stock_products,
        "total_products": total_products,
        "active_categories": active_categories,
        "unread_inquiries": unread_inquiries,
        "recent_orders": recent_orders,
        "status_counts": status_counts,
        "recent_actions": recent_actions,
    }

