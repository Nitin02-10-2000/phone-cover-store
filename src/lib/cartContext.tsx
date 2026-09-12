"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  format: string;
  phoneModel?: string;
  size?: string;
  customDesignPreview?: string;
  quantity: number;
}

export interface OrderItemRecord {
  id: string;
  productName: string;
  format: string;
  phoneModel?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  status: "PENDING" | "CONFIRMED" | "PRINTING" | "SHIPPED" | "DELIVERED";
  items: OrderItemRecord[];
  subtotal: number;
  discount: number;
  total: number;
  shipping: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface SavedDesign {
  id: string;
  title: string;
  productType: "phone_case" | "poster";
  phoneModel?: string;
  previewUrl: string;
  createdAt: string;
  price: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  tier: "Collector" | "VIP Hunter" | "Grandmaster";
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    format?: string,
    phoneModel?: string,
    size?: string,
    customPreview?: string
  ) => void;
  removeFromCart: (productId: string, format: string, phoneModel?: string) => void;
  updateQuantity: (productId: string, format: string, qty: number, phoneModel?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  totalItems: number;
  subtotal: number;
  tierDiscount: number;
  promoCode: string;
  applyPromo: (code: string) => boolean;
  promoDiscount: number;
  freeShippingProgress: number;
  toast: string | null;
  // Orders
  orders: OrderRecord[];
  createOrder: (data: Omit<OrderRecord, "id" | "date" | "status" | "trackingNumber" | "estimatedDelivery">) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderRecord["status"]) => void;
  // Saved Designs
  savedDesigns: SavedDesign[];
  saveDesign: (design: Omit<SavedDesign, "id" | "createdAt">) => SavedDesign;
  deleteDesign: (id: string) => void;
  // User
  user: UserProfile | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 799;

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "SHN-94281",
    date: "2026-09-06",
    status: "SHIPPED",
    items: [
      {
        id: "item-1",
        productName: "Luffy (Gear 5) — Sun God Nika",
        format: "Framed",
        price: 559,
        quantity: 1,
        image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787153686/mockups/luffy-gear-5-one-piece-poster-paper-5.jpg",
      },
      {
        id: "item-2",
        productName: "Guts — Blood-Red Eclipse",
        format: "Tough Case",
        phoneModel: "iPhone 16 Pro Max",
        price: 499,
        quantity: 1,
        image: "https://res.cloudinary.com/dv7oqos1m/image/private/s--tUURy_y1--/t_shinra_card/v1/products/kbvsttiw8hoxpfel82du?_a=BAMAPqfk0",
      },
    ],
    subtotal: 1058,
    discount: 106,
    total: 952,
    shipping: {
      fullName: "Kaito Takahashi",
      phone: "+91 98765 43210",
      address: "Flat 402, Cyber Heights, HSR Layout",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560102",
    },
    paymentMethod: "UPI (Google Pay)",
    trackingNumber: "BD-SHN-99824102-IN",
    estimatedDelivery: "Sep 11, 2026",
  },
  {
    id: "SHN-88194",
    date: "2026-08-28",
    status: "DELIVERED",
    items: [
      {
        id: "item-3",
        productName: "Satoru Gojo — The Honored One",
        format: "Acrylic",
        price: 499,
        quantity: 1,
        image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786122801/mockups/gojo-satoru-honored-one-poster-paper-1.jpg",
      },
    ],
    subtotal: 499,
    discount: 50,
    total: 449,
    shipping: {
      fullName: "Kaito Takahashi",
      phone: "+91 98765 43210",
      address: "Flat 402, Cyber Heights, HSR Layout",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560102",
    },
    paymentMethod: "Razorpay / Cards",
    trackingNumber: "DEL-8401927341",
    estimatedDelivery: "Aug 31, 2026",
  },
];

const INITIAL_DESIGNS: SavedDesign[] = [
  {
    id: "des-1",
    title: "Cyberpunk Oni — Armor Case",
    productType: "phone_case",
    phoneModel: "iPhone 16 Pro Max",
    previewUrl: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788283104/mockups/akira-poster-kaneda-neo-tokyo-anime-wall-art-paper-1.jpg",
    createdAt: "2026-09-05",
    price: 599,
  },
  {
    id: "des-2",
    title: "Sukuna Shrine Custom Canvas",
    productType: "poster",
    previewUrl: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787407303/mockups/ryomen-sukuna-jujutsu-kaisen-poster-cinematic-anime-wall-art-sukuna-decor-paper-1.jpg",
    createdAt: "2026-09-02",
    price: 699,
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>(INITIAL_DESIGNS);
  const [user, setUser] = useState<UserProfile | null>({
    name: "Kaito Takahashi",
    email: "kaito@hachiman.in",
    phone: "+91 98765 43210",
    tier: "VIP Hunter",
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [promoCode, setPromoCode] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Load from localStorage if available
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("hachiman_cart") || localStorage.getItem("shinra_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedTheme = (localStorage.getItem("hachiman_theme") || localStorage.getItem("shinra_theme")) as "dark" | "light";
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      }

      const storedOrders = localStorage.getItem("hachiman_orders") || localStorage.getItem("shinra_orders");
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedDesigns = localStorage.getItem("hachiman_saved_designs") || localStorage.getItem("shinra_saved_designs");
      if (storedDesigns) setSavedDesigns(JSON.parse(storedDesigns));

      const storedUser = localStorage.getItem("hachiman_user") || localStorage.getItem("shinra_user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      // ignore
    }
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem("hachiman_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Save orders
  useEffect(() => {
    try {
      localStorage.setItem("hachiman_orders", JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Save designs
  useEffect(() => {
    try {
      localStorage.setItem("hachiman_saved_designs", JSON.stringify(savedDesigns));
    } catch {
      // ignore
    }
  }, [savedDesigns]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("hachiman_theme", next);
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const addToCart = (
    product: Product,
    format?: string,
    phoneModel?: string,
    size?: string,
    customPreview?: string
  ) => {
    const chosenFormat = format || product.formats[0] || "Paper";
    setCart((prev) => {
      const index = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.format === chosenFormat &&
          i.phoneModel === phoneModel
      );
      if (index > -1) {
        const next = [...prev];
        next[index].quantity += 1;
        return next;
      }
      return [
        ...prev,
        {
          product,
          format: chosenFormat,
          phoneModel,
          size,
          customDesignPreview: customPreview,
          quantity: 1,
        },
      ];
    });
    showToast(`Added ${product.name} (${chosenFormat}${phoneModel ? ` - ${phoneModel}` : ""}) to cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, format: string, phoneModel?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        const matchesProduct = item.product.id === productId;
        const matchesFormat = item.format === format;
        const matchesModel = phoneModel !== undefined ? item.phoneModel === phoneModel : true;
        return !(matchesProduct && matchesFormat && matchesModel);
      })
    );
  };

  const updateQuantity = (
    productId: string,
    format: string,
    qty: number,
    phoneModel?: string
  ) => {
    if (qty <= 0) {
      removeFromCart(productId, format, phoneModel);
      return;
    }
    setCart((prev) => {
      let matched = false;
      return prev.map((item) => {
        if (!matched) {
          const matchesProduct = item.product.id === productId;
          const matchesFormat = item.format === format;
          const matchesModel = phoneModel !== undefined ? item.phoneModel === phoneModel : true;
          if (matchesProduct && matchesFormat && matchesModel) {
            matched = true;
            return { ...item, quantity: qty };
          }
        }
        return item;
      });
    });
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Buy More Save More tier discount
  // 3+ items: 15% OFF, 5+ items: 20% OFF, 10+ items: 25% OFF
  let tierPercentage = 0;
  if (totalItems >= 10) tierPercentage = 0.25;
  else if (totalItems >= 5) tierPercentage = 0.2;
  else if (totalItems >= 3) tierPercentage = 0.15;
  else if (totalItems >= 2) tierPercentage = 0.1;

  const tierDiscount = Math.round(subtotal * tierPercentage);

  // Promo code discounts
  const promoDiscount =
    promoCode.toUpperCase() === "HACHIMAN" ||
    promoCode.toUpperCase() === "HACHIMAN10" ||
    promoCode.toUpperCase() === "SHINRA" ||
    promoCode.toUpperCase() === "SHINRA10"
      ? Math.round((subtotal - tierDiscount) * 0.1)
      : promoCode.toUpperCase() === "DROP20"
      ? Math.round((subtotal - tierDiscount) * 0.2)
      : promoCode.toUpperCase() === "HACHIMAN50" || promoCode.toUpperCase() === "SHINRA50"
      ? 50
      : 0;

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (
      clean === "HACHIMAN" ||
      clean === "HACHIMAN10" ||
      clean === "HACHIMAN50" ||
      clean === "SHINRA" ||
      clean === "SHINRA10" ||
      clean === "SHINRA50" ||
      clean === "DROP20"
    ) {
      setPromoCode(clean);
      showToast(`Promo code ${clean} applied!`);
      return true;
    }
    showToast("Invalid promo code. Try 'HACHIMAN'");
    return false;
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  // Orders methods
  const createOrder = (
    data: Omit<OrderRecord, "id" | "date" | "status" | "trackingNumber" | "estimatedDelivery">
  ): OrderRecord => {
    const newId = `SHN-${Math.floor(10000 + Math.random() * 90000)}`;
    const tracking = `BD-${newId}-${Math.floor(100 + Math.random() * 900)}-IN`;
    const today = new Date().toISOString().split("T")[0];
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 4);
    const estDelivery = estDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newOrder: OrderRecord = {
      ...data,
      id: newId,
      date: today,
      status: "CONFIRMED",
      trackingNumber: tracking,
      estimatedDelivery: estDelivery,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Order ${newId} confirmed! Check tracking details.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderRecord["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order ${orderId} updated to ${status}`);
  };

  // Saved Designs methods
  const saveDesign = (design: Omit<SavedDesign, "id" | "createdAt">): SavedDesign => {
    const newDesign: SavedDesign = {
      ...design,
      id: `des-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setSavedDesigns((prev) => [newDesign, ...prev]);
    showToast("Custom design saved to your collection!");
    return newDesign;
  };

  const deleteDesign = (id: string) => {
    setSavedDesigns((prev) => prev.filter((d) => d.id !== id));
    showToast("Design removed from collection.");
  };

  // User auth methods
  const login = (email: string, name?: string) => {
    const newUser: UserProfile = {
      email,
      name: name || email.split("@")[0],
      tier: "VIP Hunter",
    };
    setUser(newUser);
    try {
      localStorage.setItem("hachiman_user", JSON.stringify(newUser));
      localStorage.removeItem("shinra_user");
    } catch {
      // ignore
    }
    showToast(`Welcome back, ${newUser.name}!`);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("hachiman_user");
      localStorage.removeItem("shinra_user");
    } catch {
      // ignore
    }
    showToast("Logged out successfully.");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        theme,
        toggleTheme,
        totalItems,
        subtotal,
        tierDiscount,
        promoCode,
        applyPromo,
        promoDiscount,
        freeShippingProgress,
        toast,
        orders,
        createOrder,
        updateOrderStatus,
        savedDesigns,
        saveDesign,
        deleteDesign,
        user,
        login,
        logout,
      }}
    >
      {children}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            backgroundColor: "#000000",
            border: "2px solid var(--shinra-red)",
            color: "#ffffff",
            padding: "12px 20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.8), 0 0 20px var(--shinra-red-glow)",
            fontFamily: "var(--font-heading)",
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          className="shinra-badge-red"
        >
          <span>🔥</span>
          <span>{toast}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

