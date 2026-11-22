"""

store/urls.py

URL patterns for the store API.

These are included under /api/ in core/urls.py.

"""



from django.urls import path

from . import views



urlpatterns = [

    # Health check

    path("health/", views.health_check, name="health-check"),



    # Categories

    path("categories/", views.CategoryListView.as_view(), name="category-list"),

    path("categories", views.CategoryListView.as_view()),



    # Products

    path("products/", views.ProductListView.as_view(), name="product-list"),

    path("products", views.ProductListView.as_view()),

    path("products/<slug:slug>/", views.ProductDetailView.as_view(), name="product-detail"),

    path("products/<slug:slug>", views.ProductDetailView.as_view()),



    # Orders (List past orders or Create new order)

    path("orders/", views.OrderListCreateView.as_view(), name="orders"),

    path("orders", views.OrderListCreateView.as_view()),

    path("orders/track/", views.track_order, name="order-track"),

    path("orders/track", views.track_order),

    path("orders/<str:order_id>/return/", views.create_return_request, name="order-return"),

    path("orders/<str:order_id>/return", views.create_return_request),

    path("returns/", views.create_return_request, name="returns-create"),

    path("returns", views.create_return_request),



    # Wishlist

    path("wishlist/", views.wishlist_view, name="wishlist"),

    path("wishlist", views.wishlist_view),



    # Contact & Customer Inquiries

    path("contact/", views.contact_form, name="contact"),

    path("contact", views.contact_form),

    path("contact/my/", views.my_inquiries, name="contact-my"),

    path("contact/my", views.my_inquiries),



    # Newsletter

    path("newsletter/subscribe/", views.newsletter_subscribe, name="newsletter-subscribe"),

    path("newsletter/subscribe", views.newsletter_subscribe),



    # Payments

    path("payments/create-session/", views.create_payment_session, name="payment-create-session"),

    path("payments/create-session", views.create_payment_session),

    path("payments/verify/", views.verify_payment, name="payment-verify"),

    path("payments/verify", views.verify_payment),



    # Razorpay server-to-server webhook (set this URL in Razorpay Dashboard → Webhooks)

    path("webhooks/razorpay/", views.razorpay_webhook, name="webhook-razorpay"),

    path("webhooks/razorpay", views.razorpay_webhook),



    # Customer & Staff Authentication

    path("auth/google/", views.api_auth_google, name="auth-google"),
    path("auth/google", views.api_auth_google),
    path("auth/register/", views.api_auth_register, name="auth-register"),

    path("auth/register", views.api_auth_register),

    path("auth/login/", views.api_auth_login, name="auth-login"),

    path("auth/login", views.api_auth_login),

    path("auth/send-otp/", views.api_auth_send_otp, name="auth-send-otp"),

    path("auth/send-otp", views.api_auth_send_otp),

    path("auth/verify-otp/", views.api_auth_verify_otp, name="auth-verify-otp"),

    path("auth/verify-otp", views.api_auth_verify_otp),

    path("auth/reset-password/", views.api_auth_reset_password, name="auth-reset-password"),

    path("auth/reset-password", views.api_auth_reset_password),

    path("auth/me/", views.api_auth_me, name="auth-me"),

    path("auth/me", views.api_auth_me),

    path("auth/logout/", views.api_auth_logout, name="auth-logout"),

    path("auth/logout", views.api_auth_logout),



    # Frontend Staff Portal APIs (Role-Based Access Control)

    path("staff/overview/", views.api_staff_overview, name="staff-overview"),

    path("staff/overview", views.api_staff_overview),

    path("staff/orders/", views.api_staff_orders, name="staff-orders"),

    path("staff/orders", views.api_staff_orders),

    path("staff/orders/<str:order_id>/status/", views.api_staff_order_update_status, name="staff-order-status"),

    path("staff/orders/<str:order_id>/status", views.api_staff_order_update_status),

    path("staff/inquiries/", views.api_staff_inquiries, name="staff-inquiries"),

    path("staff/inquiries", views.api_staff_inquiries),

    path("staff/inquiries/<int:inquiry_id>/reply/", views.api_staff_inquiry_reply, name="staff-inquiry-reply"),

    path("staff/inquiries/<int:inquiry_id>/reply", views.api_staff_inquiry_reply),

    path("staff/returns/", views.api_staff_returns, name="staff-returns"),

    path("staff/returns", views.api_staff_returns),

    path("staff/returns/<str:return_id>/status/", views.api_staff_return_update_status, name="staff-return-status"),

    path("staff/returns/<str:return_id>/status", views.api_staff_return_update_status),

    path("staff/catalog/export/", views.api_staff_catalog_export, name="staff-catalog-export"),
    path("staff/catalog/export", views.api_staff_catalog_export),
    path("staff/catalog/", views.api_staff_catalog, name="staff-catalog"),

    path("staff/catalog", views.api_staff_catalog),

    path("staff/catalog/<str:product_id>/toggle-stock/", views.api_staff_catalog_toggle_stock, name="staff-catalog-toggle-stock"),

    path("staff/catalog/<str:product_id>/toggle-stock", views.api_staff_catalog_toggle_stock),

]



