"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product, OrderDetails } from "@/types/product";
import { UserProfile, SavedAddress, OrderHistoryItem, ReturnRequest } from "@/types/account";
import { MOCK_PRODUCTS } from "./products";

const DEFAULT_PROFILE: UserProfile = {
  id: "usr-maya-892",
  firstName: "Maya",
  lastName: "Kapoor",
  email: "maya.kapoor@example.com",
  phone: "+91 98200 12345",
  memberSince: "Autumn 2025",
  newsletterConsent: true,
  tier: "Privilege Member",
  preferredCurrency: "INR",
};

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-home-1",
    label: "Home",
    firstName: "Maya",
    lastName: "Kapoor",
    email: "maya.kapoor@example.com",
    phone: "+91 98200 12345",
    addressLine1: "18 Altamount Road",
    addressLine2: "Apt 4B, Hill Crest",
    city: "Mumbai",
    postcode: "400026",
    country: "India",
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
  {
    id: "addr-atelier-2",
    label: "Atelier",
    firstName: "Maya",
    lastName: "Kapoor",
    email: "maya.kapoor@example.com",
    phone: "+91 98200 12345",
    addressLine1: "Studio 302, Nariman Bhavan",
    addressLine2: "227 Backbay Reclamation, Nariman Point",
    city: "Mumbai",
    postcode: "400021",
    country: "India",
    isDefaultShipping: false,
    isDefaultBilling: false,
  },
];

const INITIAL_ORDERS: OrderHistoryItem[] = [
  {
    orderNumber: "AW-84192",
    date: "12 October 2026",
    status: "Delivered",
    trackingNumber: "BD-88401928",
    trackingCourier: "Blue Dart Express",
    returnEligibleUntil: "12 November 2026",
    items: [
      {
        id: "prod-sunday-cardigan-sample",
        product: MOCK_PRODUCTS[0],
        size: "M",
        color: "Oat",
        quantity: 1,
      },
    ],
    subtotal: 6490,
    deliveryFee: 0,
    deliveryMethod: "Standard courier (Blue Dart Express)",
    estimatedDelivery: "Delivered on 14 Oct 2026",
    total: 6490,
    currency: "INR",
    address: {
      firstName: "Maya",
      lastName: "Kapoor",
      email: "maya.kapoor@example.com",
      phone: "+91 98200 12345",
      addressLine1: "18 Altamount Road",
      addressLine2: "Apt 4B, Hill Crest",
      city: "Mumbai",
      postcode: "400026",
      country: "India",
    },
    giftNote: "For quiet autumn mornings.",
    paymentMethod: "UPI (maya@oksbi)",
  },
  {
    orderNumber: "AW-72810",
    date: "28 September 2026",
    status: "Delivered",
    trackingNumber: "DEL-9920141",
    trackingCourier: "Delhivery Air",
    returnEligibleUntil: "28 October 2026",
    items: [
      {
        id: "prod-amelie-wrap-dress-sample",
        product: MOCK_PRODUCTS[2],
        size: "M",
        color: "Burgundy",
        quantity: 1,
      },
    ],
    subtotal: 7490,
    deliveryFee: 0,
    deliveryMethod: "Priority Air Express (Delhivery Air)",
    estimatedDelivery: "Delivered on 30 Sep 2026",
    total: 7490,
    currency: "INR",
    address: {
      firstName: "Maya",
      lastName: "Kapoor",
      email: "maya.kapoor@example.com",
      phone: "+91 98200 12345",
      addressLine1: "18 Altamount Road",
      addressLine2: "Apt 4B, Hill Crest",
      city: "Mumbai",
      postcode: "400026",
      country: "India",
    },
    paymentMethod: "Credit Card (ending 4242)",
    cardLast4: "4242",
  },
];

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  giftNote: string;
  setGiftNote: (note: string) => void;

  promoCode: string;
  discount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  lastOrder: OrderDetails | null;
  setLastOrder: (order: OrderDetails | null) => void;
  orders: OrderHistoryItem[];
  addOrderToHistory: (order: OrderDetails) => void;

  user: UserProfile | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  login: (email: string, firstName?: string, lastName?: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;

  addresses: SavedAddress[];
  addAddress: (address: Omit<SavedAddress, "id">) => void;
  updateAddress: (id: string, address: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultShipping: (id: string) => void;
  setDefaultBilling: (id: string) => void;

  returnRequests: ReturnRequest[];
  submitReturnRequest: (
    req: Omit<ReturnRequest, "id" | "date" | "status" | "courier">
  ) => ReturnRequest;

  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [giftNote, setGiftNote] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);
  const [orders, setOrders] = useState<OrderHistoryItem[]>(INITIAL_ORDERS);

  const [user, setUser] = useState<UserProfile | null>(DEFAULT_PROFILE);
  const [addresses, setAddresses] = useState<SavedAddress[]>(DEFAULT_ADDRESSES);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("aw_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("aw_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedGiftNote = localStorage.getItem("aw_gift_note");
      if (savedGiftNote) setGiftNote(savedGiftNote);

      const savedPromo = localStorage.getItem("aw_promo");
      if (savedPromo) {
        const { code, disc } = JSON.parse(savedPromo);
        setPromoCode(code);
        setDiscount(disc);
      }

      const savedLastOrder = localStorage.getItem("aw_last_order");
      if (savedLastOrder) setLastOrder(JSON.parse(savedLastOrder));

      const savedOrders = localStorage.getItem("aw_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedUser = localStorage.getItem("aw_user");
      if (savedUser !== null) {
        if (savedUser === "null" || savedUser === "") {
          setUser(null);
        } else {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            setUser(null);
          }
        }
      }

      const savedAddresses = localStorage.getItem("aw_addresses");
      if (savedAddresses) setAddresses(JSON.parse(savedAddresses));

      const savedReturns = localStorage.getItem("aw_returns");
      if (savedReturns) setReturnRequests(JSON.parse(savedReturns));
    } catch (e) {
      console.error("Failed to load store from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("aw_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart", e);
      }
    }
  }, [cart, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("aw_wishlist", JSON.stringify(wishlist));
      } catch (e) {
        console.error("Failed to save wishlist", e);
      }
    }
  }, [wishlist, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("aw_orders", JSON.stringify(orders));
      } catch (e) {
        console.error("Failed to save orders", e);
      }
    }
  }, [orders, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("aw_addresses", JSON.stringify(addresses));
      } catch (e) {
        console.error("Failed to save addresses", e);
      }
    }
  }, [addresses, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("aw_returns", JSON.stringify(returnRequests));
      } catch (e) {
        console.error("Failed to save return requests", e);
      }
    }
  }, [returnRequests, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        if (user) {
          localStorage.setItem("aw_user", JSON.stringify(user));
        } else {
          localStorage.setItem("aw_user", "null");
        }
      } catch (e) {
        console.error("Failed to save user", e);
      }
    }
  }, [user, isHydrated]);

  // Cart operations
  const addToCart = (
    product: Product,
    size: string,
    color: string = product.color,
    quantity: number = 1
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      const newItem: CartItem = {
        id: `${product.id}-${size}-${color}-${Date.now()}`,
        product,
        size,
        color,
        quantity,
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Promo code
  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "WELCOME10" || clean === "AUTUMN" || clean === "ANASTASIA10") {
      setPromoCode(clean);
      setDiscount(0.1);
      return { success: true, message: "10% promotional privilege applied to your order." };
    }
    return { success: false, message: "Code not recognized. Please check and try again." };
  };

  const removePromoCode = () => {
    setPromoCode("");
    setDiscount(0);
  };

  // Orders
  const addOrderToHistory = (order: OrderDetails) => {
    const historyItem: OrderHistoryItem = {
      ...order,
      status: "Preparing",
      trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
      trackingCourier: "Blue Dart Express",
      returnEligibleUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-IN",
        { day: "numeric", month: "long", year: "numeric" }
      ),
    };
    setOrders((prev) => [historyItem, ...prev]);
  };

  // Auth & Profile
  const login = (email: string, firstName: string = "Maya", lastName: string = "Kapoor") => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      firstName: firstName || "Maya",
      lastName: lastName || "Kapoor",
      email: email || "maya.kapoor@example.com",
      phone: "+91 98200 12345",
      memberSince: "October 2026",
      newsletterConsent: true,
      tier: "Privilege Member",
      preferredCurrency: "INR",
    };
    setUser(newUser);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("aw_user", JSON.stringify(newUser));
      } catch (e) {
        console.error("Failed to save user to localStorage", e);
      }
    }
  };

  const setIsAuthenticated = (auth: boolean) => {
    if (auth) {
      login("maya.kapoor@example.com", "Maya", "Kapoor");
    } else {
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("aw_user", "null");
      } catch (e) {
        console.error("Failed to update user in localStorage", e);
      }
    }
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...profile } : null));
  };

  // Address management
  const addAddress = (address: Omit<SavedAddress, "id">) => {
    const newAddress: SavedAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    setAddresses((prev) => {
      let updated = [...prev];
      if (newAddress.isDefaultShipping) {
        updated = updated.map((a) => ({ ...a, isDefaultShipping: false }));
      }
      if (newAddress.isDefaultBilling) {
        updated = updated.map((a) => ({ ...a, isDefaultBilling: false }));
      }
      return [...updated, newAddress];
    });
  };

  const updateAddress = (id: string, updatedFields: Partial<SavedAddress>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updatedFields };
        }
        if (updatedFields.isDefaultShipping && a.id !== id) {
          return { ...a, isDefaultShipping: false };
        }
        if (updatedFields.isDefaultBilling && a.id !== id) {
          return { ...a, isDefaultBilling: false };
        }
        return a;
      })
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultShipping = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefaultShipping: a.id === id }))
    );
  };

  const setDefaultBilling = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefaultBilling: a.id === id }))
    );
  };

  // Returns
  const submitReturnRequest = (
    req: Omit<ReturnRequest, "id" | "date" | "status" | "courier">
  ): ReturnRequest => {
    const newReturn: ReturnRequest = {
      ...req,
      id: `RA-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      courier: "Blue Dart Express",
      status: "Pickup Scheduled",
    };

    setReturnRequests((prev) => [newReturn, ...prev]);

    // Update the corresponding order's return list
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderNumber === req.orderNumber) {
          return {
            ...ord,
            returns: [...(ord.returns || []), newReturn],
          };
        }
        return ord;
      })
    );

    return newReturn;
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        giftNote,
        setGiftNote,
        promoCode,
        discount,
        applyPromoCode,
        removePromoCode,
        lastOrder,
        setLastOrder,
        orders,
        addOrderToHistory,
        user,
        isAuthenticated: !!user,
        setIsAuthenticated,
        login,
        logout,
        updateProfile,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultShipping,
        setDefaultBilling,
        returnRequests,
        submitReturnRequest,
        mobileMenuOpen,
        setMobileMenuOpen,
        searchOpen,
        setSearchOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
