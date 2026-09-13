"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart, OrderRecord } from "@/lib/cartContext";
import { Product, CASE_TYPES, CATEGORIES } from "@/data/products";
import { useAllProducts } from "@/lib/productsStorage";

const NAV_SECTIONS = [
  {
    label: "STORE FRONT",
    links: [
      { href: "/", label: "Home", icon: "🏠" },
      { href: "/shop", label: "Phone Cases Shop", icon: "📱" },
      { href: "/categories", label: "Case Categories", icon: "📂" },
      { href: "/customize", label: "Custom Studio", icon: "⚡" },
    ],
  },
  {
    label: "CUSTOMER PAGES",
    links: [
      { href: "/account", label: "My Account", icon: "👤" },
      { href: "/cart", label: "Cart", icon: "🛒" },
      { href: "/checkout", label: "Checkout", icon: "💳" },
      { href: "/track-order", label: "Track Order", icon: "📦" },
    ],
  },
  {
    label: "ADMIN OPERATIONS",
    links: [
      { href: "/admin", label: "Admin Console", icon: "⚙️" },
    ],
  },
];

// Sample preset phone case artworks for fast 1-click upload
const CASE_PRESETS = [
  {
    title: "Gojo Satoru — Domain Expansion",
    theme: "anime",
    franchise: "Jujutsu Kaisen",
    image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786122801/mockups/gojo-satoru-honored-one-poster-paper-1.jpg",
    price: 599,
  },
  {
    title: "Luffy Gear 5 — Sun God Awakening",
    theme: "anime",
    franchise: "One Piece",
    image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787153686/mockups/luffy-gear-5-one-piece-poster-paper-5.jpg",
    price: 649,
  },
  {
    title: "Cyberpunk Oni — Neo Tokyo Armor",
    theme: "streetwear",
    franchise: "Streetwear",
    image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788283104/mockups/akira-poster-kaneda-neo-tokyo-anime-wall-art-paper-1.jpg",
    price: 699,
  },
  {
    title: "Sukuna Malevolent Shrine Limited",
    theme: "anime",
    franchise: "Jujutsu Kaisen",
    image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787407303/mockups/ryomen-sukuna-jujutsu-kaisen-poster-cinematic-anime-wall-art-sukuna-decor-paper-1.jpg",
    price: 599,
  },
  {
    title: "Guts Berserker Armor — Dark Blood",
    theme: "dark-gothic",
    franchise: "Berserk",
    image: "https://res.cloudinary.com/dv7oqos1m/image/private/s--tUURy_y1--/t_shinra_card/v1/products/kbvsttiw8hoxpfel82du?_a=BAMAPqfk0",
    price: 649,
  },
  {
    title: "Itachi Uchiha — Crimson Tsukuyomi",
    theme: "anime",
    franchise: "Naruto",
    image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786523901/mockups/itachi-uchiha-poster-paper-1.jpg",
    price: 599,
  },
];

export default function AdminPage() {
  const pathname = usePathname();
  const { orders, updateOrderStatus, deleteOrder, createOrder } = useCart();
  const { products, addProduct, deleteProduct, isCustom } = useAllProducts();

  // Tab State
  const [activeTab, setActiveTab] = useState<"orders" | "customers" | "catalog" | "analytics">("orders");

  // Filters & Search
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [catalogSearch, setCatalogSearch] = useState<string>("");
  const [catalogCategory, setCatalogCategory] = useState<string>("ALL");

  // Modals State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedSlipOrder, setSelectedSlipOrder] = useState<OrderRecord | null>(null);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // File Upload Reference
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // New Phone Case Form State
  const [newCase, setNewCase] = useState({
    name: "",
    theme: "anime",
    franchise: "Anime",
    tag: "Anime Armor",
    price: 599,
    originalPrice: 999,
    badge: "NEW DROP",
    description: "Military-grade dual-layer shock absorption with high-definition UV DTF print. Scratch-resistant matte finish with raised 1.8mm camera protection ring.",
    formats: ["Ultra Impact MagSafe", "Tough Armor Dual-Layer", "9H Tempered Glass Back"],
    image: CASE_PRESETS[0].image,
    dropProtection: "12ft Drop Tested",
  });

  const showToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3000);
  };

  // Derive Live Financial & Order Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, curr) => acc + curr.total, 0);
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status !== "DELIVERED").length;
  }, [orders]);

  const customCasesCount = useMemo(() => {
    return products.filter((p) => isCustom(p.id)).length;
  }, [products, isCustom]);

  // Derive Unique Customer Database from orders
  const customerDatabase = useMemo(() => {
    const map = new Map<string, {
      id: string;
      fullName: string;
      phone: string;
      email?: string;
      city: string;
      state: string;
      address: string;
      pincode: string;
      ordersCount: number;
      totalSpent: number;
      latestOrderId: string;
      latestOrderDate: string;
      latestStatus: string;
      itemsSummary: string[];
    }>();

    orders.forEach((o) => {
      const key = o.shipping.phone.replace(/\D/g, "") || o.shipping.fullName.toLowerCase().trim();
      const existing = map.get(key);

      const items = o.items.map((it) => `${it.quantity}x ${it.productName}`);

      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += o.total;
        existing.itemsSummary = Array.from(new Set([...existing.itemsSummary, ...items]));
      } else {
        map.set(key, {
          id: `cust-${key.slice(-6) || Math.random().toString(36).substring(2, 8)}`,
          fullName: o.shipping.fullName,
          phone: o.shipping.phone,
          city: o.shipping.city,
          state: o.shipping.state,
          address: o.shipping.address,
          pincode: o.shipping.pincode,
          ordersCount: 1,
          totalSpent: o.total,
          latestOrderId: o.id,
          latestOrderDate: o.date,
          latestStatus: o.status,
          itemsSummary: items,
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = filterStatus === "ALL" || o.status === filterStatus;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        o.id.toLowerCase().includes(term) ||
        o.shipping.fullName.toLowerCase().includes(term) ||
        o.shipping.phone.toLowerCase().includes(term) ||
        o.shipping.city.toLowerCase().includes(term) ||
        o.items.some((it) => it.productName.toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [orders, filterStatus, searchTerm]);

  // Filtered Catalog
  const filteredCatalog = useMemo(() => {
    return products.filter((p) => {
      const term = catalogSearch.toLowerCase().trim();
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.franchise.toLowerCase().includes(term) ||
        p.tag.toLowerCase().includes(term);

      const matchesCat =
        catalogCategory === "ALL"
          ? true
          : catalogCategory === "CUSTOM"
          ? isCustom(p.id)
          : p.theme?.toLowerCase() === catalogCategory.toLowerCase() ||
            p.franchise.toLowerCase() === catalogCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [products, catalogSearch, catalogCategory, isCustom]);

  // Handle local image file upload -> upload to /api/upload and preview
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file (PNG, JPG, or WEBP)");
      return;
    }

    // Instant local preview via DataURL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewCase((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);

    // Upload to server /public/uploads/
    const formData = new FormData();
    formData.append("file", file);
    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.url) {
          setNewCase((prev) => ({
            ...prev,
            image: data.url,
          }));
          showToast("Image uploaded to server storage!");
        }
      })
      .catch(() => {
        showToast("Image ready for case publish.");
      });
  };

  // Submit New Case
  const handlePublishCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCase.name.trim()) {
      showToast("Please provide a phone case name");
      return;
    }

    const createdProduct: Product = {
      id: `case-${Date.now()}`,
      name: newCase.name.trim(),
      franchise: newCase.franchise || "Anime",
      theme: newCase.theme || "anime",
      category: "case",
      tag: newCase.tag || newCase.franchise || "Limited Armor",
      price: Number(newCase.price) || 599,
      originalPrice: Number(newCase.originalPrice) || 999,
      rating: 5.0,
      reviewsCount: 1,
      image: newCase.image || CASE_PRESETS[0].image,
      tiltedImage: newCase.image || CASE_PRESETS[0].image,
      badge: newCase.badge || "NEW DROP",
      formats: newCase.formats.length > 0 ? newCase.formats : ["Ultra Impact MagSafe", "Tough Armor Dual-Layer"],
      description: newCase.description,
      supportedBrands: ["Apple iPhone", "Samsung Galaxy", "OnePlus", "Google Pixel"],
      dropProtection: newCase.dropProtection || "12ft Drop Tested",
    };

    addProduct(createdProduct);
    setIsUploadModalOpen(false);
    setActiveTab("catalog");
    showToast(`Case "${createdProduct.name}" is now live in store!`);

    // Reset form
    setNewCase({
      name: "",
      theme: "anime",
      franchise: "Anime",
      tag: "Anime Armor",
      price: 599,
      originalPrice: 999,
      badge: "NEW DROP",
      description: "Military-grade dual-layer shock absorption with high-definition UV DTF print. Scratch-resistant matte finish with raised 1.8mm camera protection ring.",
      formats: ["Ultra Impact MagSafe", "Tough Armor Dual-Layer", "9H Tempered Glass Back"],
      image: CASE_PRESETS[0].image,
      dropProtection: "12ft Drop Tested",
    });
  };

  // Toggle format in new case form
  const toggleFormat = (fmtName: string) => {
    setNewCase((prev) => {
      const exists = prev.formats.includes(fmtName);
      if (exists) {
        if (prev.formats.length <= 1) return prev; // keep at least 1
        return { ...prev, formats: prev.formats.filter((f) => f !== fmtName) };
      } else {
        return { ...prev, formats: [...prev.formats, fmtName] };
      }
    });
  };

  // Seed a sample order for testing
  const handleCreateSampleOrder = () => {
    const sampleCustomer = {
      fullName: "Arjun Mehta",
      phone: "+91 98201 54321",
      email: "arjun.mehta@example.com",
      address: "B-204, Oberoi Springs, Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400053",
    };

    createOrder({
      items: [
        {
          id: `item-${Date.now()}`,
          productName: "Gojo Satoru — Limitless MagSafe Case",
          format: "Ultra Impact MagSafe",
          phoneModel: "iPhone 16 Pro Max",
          price: 799,
          quantity: 1,
          image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786122801/mockups/gojo-satoru-honored-one-poster-paper-1.jpg",
        },
      ],
      subtotal: 799,
      discount: 80,
      total: 719,
      shipping: sampleCustomer,
      paymentMethod: "UPI (Google Pay)",
    });

    showToast("Sample verified order created! Check orders table.");
  };

  // Export Customer Database to CSV
  const handleExportCSV = () => {
    if (customerDatabase.length === 0) {
      showToast("No customer records found to export.");
      return;
    }

    const headers = ["Customer ID", "Full Name", "Phone", "City", "State", "PIN Code", "Address", "Orders Count", "Total Spent (INR)", "Latest Order ID", "Latest Order Date"];
    const rows = customerDatabase.map((c) => [
      c.id,
      `"${c.fullName}"`,
      `"${c.phone}"`,
      `"${c.city}"`,
      `"${c.state}"`,
      c.pincode,
      `"${c.address.replace(/"/g, '""')}"`,
      c.ordersCount,
      c.totalSpent,
      c.latestOrderId,
      c.latestOrderDate,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CaseTadka_Customers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Customer database CSV downloaded successfully!");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)", display: "flex" }}>
      {/* ─── SIDEBAR ─────────────────────────────────────── */}
      <aside
        style={{
          width: "260px",
          flexShrink: 0,
          backgroundColor: "var(--surface)",
          borderRight: "1px solid var(--surface-border)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          overflowY: "auto",
          paddingTop: "80px",
        }}
      >
        {/* Brand */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--surface-border)" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.2em", color: "#FF2A3A", textTransform: "uppercase", marginBottom: "4px" }}>
            CASE TADKA HQ
          </div>
          <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
            Admin Command Center
          </div>
        </div>

        {/* Quick Add Case Button in Sidebar */}
        <div style={{ padding: "16px 20px 8px" }}>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "11px 16px",
              backgroundColor: "var(--main-accent)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(230, 57, 70, 0.25)",
              transition: "transform 0.15s ease",
            }}
          >
            <span>✨</span>
            <span>+ Upload Phone Case</span>
          </button>
        </div>

        {/* Nav sections */}
        <nav style={{ flex: 1, padding: "12px 0" }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  color: "var(--foreground-muted)",
                  textTransform: "uppercase",
                  padding: "6px 20px 4px",
                }}
              >
                {section.label}
              </div>
              {section.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 20px",
                      fontSize: "0.85rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "var(--shinra-red)" : "var(--foreground)",
                      backgroundColor: isActive ? "rgba(230, 57, 70, 0.08)" : "transparent",
                      borderLeft: isActive ? "3px solid var(--shinra-red)" : "3px solid transparent",
                      textDecoration: "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Telemetry Status in Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--surface-border)", fontSize: "0.75rem", color: "var(--foreground-muted)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#2ed573", boxShadow: "0 0 6px #2ed573", flexShrink: 0 }} />
            <span>UV DTF Armor Press: <strong style={{ color: "#2ed573" }}>ONLINE</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#2ed573", boxShadow: "0 0 6px #2ed573", flexShrink: 0 }} />
            <span>Database Node: <strong style={{ color: "#2ed573" }}>SYNCED</strong></span>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─────────────────────────────────── */}
      <div style={{ flex: 1, overflowX: "hidden", padding: "90px 36px 80px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          {/* Top Operational Status Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 20px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "10px",
              marginBottom: "28px",
              flexWrap: "wrap",
              gap: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#2ed573",
                  boxShadow: "0 0 10px #2ed573",
                }}
              />
              <span style={{ fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--main-accent)" }}>
                CASE TADKA SECURE OPERATIONS CONSOLE // V2.5
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={handleCreateSampleOrder}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  backgroundColor: "var(--surface-raised)",
                  color: "var(--foreground)",
                  border: "1px solid var(--surface-border)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                title="Create a verified sample order to test the database telemetry"
              >
                + Test Order
              </button>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  backgroundColor: "var(--main-accent)",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>✨</span>
                <span>Upload New Case</span>
              </button>

              <Link
                href="/shop"
                style={{
                  color: "var(--main-accent)",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  backgroundColor: "var(--surface-raised)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  border: "1px solid var(--surface-border)",
                }}
              >
                Live Store ↗
              </Link>
            </div>
          </div>

          {/* Header Title */}
          <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: "2.3rem", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 6px", color: "var(--foreground)" }}>
                Store Management Console
              </h1>
              <p style={{ color: "var(--foreground-muted)", fontSize: "0.95rem", margin: 0 }}>
                Live database control for customer orders, custom phone armor uploads, and fulfillment telemetry.
              </p>
            </div>
          </div>

          {/* KPI Stat Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
              marginBottom: "32px",
            }}
          >
            {/* Revenue */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "20px 24px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                  Gross Revenue (Orders)
                </span>
                <span style={{ fontSize: "1.2rem" }}>💰</span>
              </div>
              <div style={{ fontSize: "1.9rem", fontWeight: 900, marginTop: "8px", color: "var(--foreground)" }}>
                ₹{totalRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#2ed573", marginTop: "6px", fontWeight: 600 }}>
                Live total from {orders.length} order records
              </div>
            </div>

            {/* Active Dispatches */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "20px 24px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                  Active Dispatches
                </span>
                <span style={{ fontSize: "1.2rem" }}>📦</span>
              </div>
              <div style={{ fontSize: "1.9rem", fontWeight: 900, marginTop: "8px", color: "var(--foreground)" }}>
                {activeOrdersCount}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--main-accent)", marginTop: "6px", fontWeight: 600 }}>
                {orders.filter((o) => o.status === "SHIPPED").length} in transit via Bluedart Air
              </div>
            </div>

            {/* Customers Database */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "20px 24px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                  Customer Database
                </span>
                <span style={{ fontSize: "1.2rem" }}>👥</span>
              </div>
              <div style={{ fontSize: "1.9rem", fontWeight: 900, marginTop: "8px", color: "var(--foreground)" }}>
                {customerDatabase.length}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#2ed573", marginTop: "6px", fontWeight: 600 }}>
                Verified buyers with delivery addresses
              </div>
            </div>

            {/* Catalog & Uploads */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "20px 24px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                  Phone Cases Catalog
                </span>
                <span style={{ fontSize: "1.2rem" }}>📱</span>
              </div>
              <div style={{ fontSize: "1.9rem", fontWeight: 900, marginTop: "8px", color: "var(--foreground)" }}>
                {products.length}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--secondary-accent)", marginTop: "6px", fontWeight: 600 }}>
                {customCasesCount} custom uploaded from admin
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              borderBottom: "1px solid var(--surface-border)",
              marginBottom: "24px",
              overflowX: "auto",
            }}
          >
            {[
              { id: "orders", label: `Fulfillment & Orders (${orders.length})`, icon: "📦" },
              { id: "customers", label: `Customer Database ("Who Ordered") (${customerDatabase.length})`, icon: "👥" },
              { id: "catalog", label: `Phone Cases Catalog (${products.length})`, icon: "📱" },
              { id: "analytics", label: "Analytics & Telemetry", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 18px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "3px solid var(--main-accent)" : "3px solid transparent",
                  color: activeTab === tab.id ? "var(--foreground)" : "var(--foreground-muted)",
                  fontWeight: activeTab === tab.id ? 800 : 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ═══════════════════════════════════════════════════
              TAB 1: ORDERS & FULFILLMENT MANAGEMENT
             ═══════════════════════════════════════════════════ */}
          {activeTab === "orders" && (
            <div>
              {/* Filter & Search Toolbar */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                {/* Status Filter Chips */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["ALL", "PENDING", "CONFIRMED", "PRINTING", "SHIPPED", "DELIVERED"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        backgroundColor: filterStatus === st ? "var(--main-accent)" : "var(--surface)",
                        color: filterStatus === st ? "#fff" : "var(--foreground-muted)",
                        border: filterStatus === st ? "1px solid var(--main-accent)" : "1px solid var(--surface-border)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1, maxWidth: "420px" }}>
                  <input
                    type="text"
                    placeholder="Search Order ID, customer, phone, city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--surface-border)",
                      color: "var(--foreground)",
                      fontSize: "0.85rem",
                      outline: "none",
                    }}
                  />
                  {orders.length > 0 && (
                    <button
                      onClick={handleExportCSV}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        backgroundColor: "var(--surface-raised)",
                        color: "var(--foreground)",
                        border: "1px solid var(--surface-border)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                      title="Export filtered records"
                    >
                      Export CSV
                    </button>
                  )}
                </div>
              </div>

              {/* Orders Table */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "14px",
                  border: "1px solid var(--surface-border)",
                  overflowX: "auto",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--surface-border)", color: "var(--foreground-muted)", fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      <th style={{ padding: "16px 20px" }}>ORDER ID & DATE</th>
                      <th style={{ padding: "16px 20px" }}>CUSTOMER (WHO ORDERED)</th>
                      <th style={{ padding: "16px 20px" }}>ITEMS & FORMAT</th>
                      <th style={{ padding: "16px 20px" }}>TOTAL</th>
                      <th style={{ padding: "16px 20px" }}>STATUS SELECTOR</th>
                      <th style={{ padding: "16px 20px" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const cleanPhone = order.shipping.phone.replace(/\D/g, "");
                      const waLink = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(
                        `Hi ${order.shipping.fullName}! We received your Case Tadka order #${order.id}. Your package is currently ${order.status}. Let us know if you need anything!`
                      )}`;

                      return (
                        <tr
                          key={order.id}
                          style={{
                            borderBottom: "1px solid var(--surface-border)",
                            transition: "background 0.15s ease",
                          }}
                        >
                          {/* ID & Date */}
                          <td style={{ padding: "16px 20px", verticalAlign: "top" }}>
                            <div style={{ fontWeight: 800, color: "var(--foreground)", fontFamily: "monospace", fontSize: "0.95rem" }}>
                              #{order.id}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", marginTop: "3px" }}>
                              📅 {order.date}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                              💳 {order.paymentMethod}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "var(--main-accent)", marginTop: "3px", fontFamily: "monospace" }}>
                              AWB: {order.trackingNumber}
                            </div>
                          </td>

                          {/* Customer */}
                          <td style={{ padding: "16px 20px", verticalAlign: "top" }}>
                            <div style={{ fontWeight: 700, color: "var(--foreground)", fontSize: "0.92rem" }}>
                              {order.shipping.fullName}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                              📍 {order.shipping.city}, {order.shipping.state} — {order.shipping.pincode}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                              {order.shipping.address}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                              <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>📞 {order.shipping.phone}</span>
                              {cleanPhone && (
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "3px",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    backgroundColor: "rgba(46, 213, 115, 0.15)",
                                    color: "#2ed573",
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                  }}
                                  title="Chat with customer on WhatsApp"
                                >
                                  💬 WhatsApp
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Items */}
                          <td style={{ padding: "16px 20px", verticalAlign: "top" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              {order.items.map((item) => (
                                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div style={{ position: "relative", width: "32px", height: "42px", borderRadius: "4px", overflow: "hidden", flexShrink: 0, backgroundColor: "#111" }}>
                                    {item.image && (
                                      <Image src={item.image} alt={item.productName} fill sizes="32px" style={{ objectFit: "cover" }} />
                                    )}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "0.84rem" }}>
                                      <span style={{ color: "var(--main-accent)", fontWeight: 800 }}>{item.quantity}x</span> {item.productName}
                                    </div>
                                    <div style={{ fontSize: "0.74rem", color: "var(--secondary-accent)", fontWeight: 600 }}>
                                      {item.format} {item.phoneModel ? `• ${item.phoneModel}` : ""}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Total */}
                          <td style={{ padding: "16px 20px", verticalAlign: "top" }}>
                            <div style={{ fontWeight: 900, color: "var(--foreground)", fontSize: "1.1rem" }}>
                              ₹{order.total}
                            </div>
                            {order.discount > 0 && (
                              <div style={{ fontSize: "0.75rem", color: "#2ed573", fontWeight: 600 }}>
                                -₹{order.discount} promo
                              </div>
                            )}
                          </td>

                          {/* Status Dropdown */}
                          <td style={{ padding: "16px 20px", verticalAlign: "top" }}>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderRecord["status"])}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "6px",
                                backgroundColor:
                                  order.status === "DELIVERED"
                                    ? "rgba(46, 213, 115, 0.15)"
                                    : order.status === "SHIPPED"
                                    ? "rgba(124, 58, 237, 0.15)"
                                    : order.status === "PRINTING"
                                    ? "rgba(236, 72, 153, 0.15)"
                                    : "var(--surface-raised)",
                                color:
                                  order.status === "DELIVERED"
                                    ? "#2ed573"
                                    : order.status === "SHIPPED"
                                    ? "var(--main-accent)"
                                    : order.status === "PRINTING"
                                    ? "var(--secondary-accent)"
                                    : "var(--main-accent)",
                                border: "1px solid var(--surface-border)",
                                fontSize: "0.8rem",
                                fontWeight: 800,
                                cursor: "pointer",
                                outline: "none",
                              }}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PRINTING">PRINTING</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "16px 20px", verticalAlign: "top" }}>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              <button
                                onClick={() => setSelectedSlipOrder(order)}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "4px",
                                  backgroundColor: "var(--surface-raised)",
                                  color: "var(--foreground)",
                                  border: "1px solid var(--surface-border)",
                                  fontSize: "0.78rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                                title="View and print packing slip invoice"
                              >
                                📄 Slip
                              </button>
                              <Link
                                href={`/track-order?id=${order.id}`}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "4px",
                                  backgroundColor: "var(--surface-raised)",
                                  color: "var(--main-accent)",
                                  textDecoration: "none",
                                  fontSize: "0.78rem",
                                  fontWeight: 700,
                                  border: "1px solid var(--surface-border)",
                                }}
                              >
                                Track
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove order #${order.id}?`)) {
                                    deleteOrder(order.id);
                                  }
                                }}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "4px",
                                  backgroundColor: "rgba(255, 42, 58, 0.1)",
                                  color: "#ff4d4d",
                                  border: "1px solid rgba(255, 42, 58, 0.25)",
                                  fontSize: "0.78rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                                title="Delete Order"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredOrders.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            textAlign: "center",
                            padding: "60px 20px",
                            color: "var(--foreground-muted)",
                          }}
                        >
                          <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📦</div>
                          <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--foreground)" }}>
                            No orders found
                          </div>
                          <p style={{ fontSize: "0.85rem", marginTop: "4px", maxWidth: "450px", margin: "6px auto 16px" }}>
                            {searchTerm || filterStatus !== "ALL"
                              ? "No orders match the selected search or filter criteria."
                              : "New orders placed by customers at checkout will appear here instantly."}
                          </p>
                          <button
                            onClick={handleCreateSampleOrder}
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "var(--main-accent)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: 700,
                              cursor: "pointer",
                              fontSize: "0.85rem",
                            }}
                          >
                            + Generate Test Customer Order
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              TAB 2: CUSTOMER DATABASE ("WHO ORDERED")
             ═══════════════════════════════════════════════════ */}
          {activeTab === "customers" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 4px" }}>
                    Verified Customer Database
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", margin: 0 }}>
                    Direct CRM record of everyone who placed an order on Case Tadka, with shipping telemetry and contact links.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleExportCSV}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      backgroundColor: "var(--surface)",
                      color: "var(--foreground)",
                      border: "1px solid var(--surface-border)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>📥</span>
                    <span>Download Customer CSV</span>
                  </button>
                </div>
              </div>

              {/* Customers CRM Table */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "14px",
                  border: "1px solid var(--surface-border)",
                  overflowX: "auto",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--surface-border)", color: "var(--foreground-muted)", fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      <th style={{ padding: "16px 20px" }}>CUSTOMER NAME</th>
                      <th style={{ padding: "16px 20px" }}>PHONE & WHATSAPP</th>
                      <th style={{ padding: "16px 20px" }}>DELIVERY ADDRESS & PIN</th>
                      <th style={{ padding: "16px 20px" }}>ORDERS COUNT</th>
                      <th style={{ padding: "16px 20px" }}>LIFETIME VALUE</th>
                      <th style={{ padding: "16px 20px" }}>LATEST ORDER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerDatabase.map((cust) => {
                      const cleanPhone = cust.phone.replace(/\D/g, "");
                      const waLink = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(
                        `Hi ${cust.fullName}! Reaching out from Case Tadka regarding your orders. We appreciate your support!`
                      )}`;

                      return (
                        <tr
                          key={cust.id}
                          style={{
                            borderBottom: "1px solid var(--surface-border)",
                            transition: "background 0.15s ease",
                          }}
                        >
                          {/* Name */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  backgroundColor: "var(--surface-raised)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 800,
                                  color: "var(--main-accent)",
                                  border: "1px solid var(--surface-border)",
                                }}
                              >
                                {cust.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: "var(--foreground)" }}>{cust.fullName}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)" }}>ID: {cust.id}</div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ fontWeight: 600 }}>📞 {cust.phone}</div>
                            {cleanPhone && (
                              <div style={{ marginTop: "6px" }}>
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "3px 8px",
                                    borderRadius: "4px",
                                    backgroundColor: "rgba(46, 213, 115, 0.15)",
                                    color: "#2ed573",
                                    fontSize: "0.74rem",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                  }}
                                >
                                  💬 Contact via WhatsApp
                                </a>
                              </div>
                            )}
                          </td>

                          {/* Address */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ fontWeight: 600, color: "var(--foreground)" }}>
                              {cust.city}, {cust.state}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                              {cust.address}
                            </div>
                            <div style={{ fontSize: "0.74rem", color: "var(--main-accent)", fontWeight: 700, marginTop: "2px" }}>
                              PIN: {cust.pincode}
                            </div>
                          </td>

                          {/* Orders Count */}
                          <td style={{ padding: "16px 20px" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                backgroundColor: "var(--surface-raised)",
                                fontWeight: 800,
                                color: "var(--foreground)",
                                fontSize: "0.85rem",
                              }}
                            >
                              {cust.ordersCount} {cust.ordersCount === 1 ? "order" : "orders"}
                            </span>
                          </td>

                          {/* Total Spend */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ fontWeight: 900, color: "#2ed573", fontSize: "1.05rem" }}>
                              ₹{cust.totalSpent}
                            </div>
                          </td>

                          {/* Latest Order */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ fontWeight: 700, fontFamily: "monospace", fontSize: "0.85rem" }}>
                              #{cust.latestOrderId}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                              {cust.latestOrderDate} • <span style={{ color: "var(--main-accent)", fontWeight: 700 }}>{cust.latestStatus}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {customerDatabase.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            textAlign: "center",
                            padding: "60px 20px",
                            color: "var(--foreground-muted)",
                          }}
                        >
                          <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>👥</div>
                          <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--foreground)" }}>
                            No customer records yet
                          </div>
                          <p style={{ fontSize: "0.85rem", marginTop: "4px", maxWidth: "450px", margin: "6px auto 16px" }}>
                            Customer contacts and verified shipping addresses will automatically populate here whenever an order is placed.
                          </p>
                          <button
                            onClick={handleCreateSampleOrder}
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "var(--main-accent)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: 700,
                              cursor: "pointer",
                              fontSize: "0.85rem",
                            }}
                          >
                            + Populate Sample Customer
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              TAB 3: PHONE CASES CATALOG & UPLOAD MANAGER
             ═══════════════════════════════════════════════════ */}
          {activeTab === "catalog" && (
            <div>
              {/* Header with Upload CTA */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 4px" }}>
                    Phone Cases Catalog ({products.length})
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", margin: 0 }}>
                    Upload new anime & custom phone cases directly into the live store, manage stock, and edit designs.
                  </p>
                </div>

                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    backgroundColor: "var(--main-accent)",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 14px rgba(230, 57, 70, 0.3)",
                  }}
                >
                  <span>✨</span>
                  <span>+ Upload New Phone Case</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                {/* Category Filters */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {[
                    { id: "ALL", label: "All Cases" },
                    { id: "CUSTOM", label: `Admin Uploads (${customCasesCount})` },
                    { id: "anime", label: "Anime" },
                    { id: "gaming", label: "Gaming" },
                    { id: "streetwear", label: "Streetwear" },
                    { id: "dark-gothic", label: "Dark / Gothic" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCatalogCategory(cat.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        backgroundColor: catalogCategory === cat.id ? "var(--main-accent)" : "var(--surface)",
                        color: catalogCategory === cat.id ? "#fff" : "var(--foreground-muted)",
                        border: catalogCategory === cat.id ? "1px solid var(--main-accent)" : "1px solid var(--surface-border)",
                        cursor: "pointer",
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search case name, franchise..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    color: "var(--foreground)",
                    fontSize: "0.85rem",
                    minWidth: "260px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Cases Grid Table */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "14px",
                  border: "1px solid var(--surface-border)",
                  overflowX: "auto",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--surface-border)", color: "var(--foreground-muted)", fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      <th style={{ padding: "16px 20px" }}>CASE ARTWORK & TITLE</th>
                      <th style={{ padding: "16px 20px" }}>THEME / FRANCHISE</th>
                      <th style={{ padding: "16px 20px" }}>PRICE & MRP</th>
                      <th style={{ padding: "16px 20px" }}>AVAILABLE FORMATS</th>
                      <th style={{ padding: "16px 20px" }}>BADGE</th>
                      <th style={{ padding: "16px 20px" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCatalog.map((prod) => {
                      const isUserUploaded = isCustom(prod.id);

                      return (
                        <tr
                          key={prod.id}
                          style={{
                            borderBottom: "1px solid var(--surface-border)",
                            transition: "background 0.15s ease",
                          }}
                        >
                          {/* Case Info */}
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div
                                style={{
                                  position: "relative",
                                  width: "44px",
                                  height: "58px",
                                  borderRadius: "6px",
                                  overflow: "hidden",
                                  flexShrink: 0,
                                  backgroundColor: "#111",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                }}
                              >
                                {prod.image && (
                                  <Image src={prod.image} alt={prod.name} fill sizes="44px" style={{ objectFit: "cover" }} />
                                )}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: "var(--foreground)", fontSize: "0.92rem" }}>
                                  {prod.name}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                                  ID: {prod.id} {isUserUploaded && <span style={{ color: "#2ed573", fontWeight: 700 }}>• Admin Upload</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Theme */}
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ fontWeight: 700, color: "var(--foreground)" }}>{prod.franchise}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", textTransform: "capitalize" }}>
                              {prod.theme || "Anime"}
                            </div>
                          </td>

                          {/* Price */}
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ fontWeight: 900, color: "var(--foreground)", fontSize: "1rem" }}>
                              ₹{prod.price}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", textDecoration: "line-through" }}>
                              ₹{prod.originalPrice}
                            </div>
                          </td>

                          {/* Formats */}
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "260px" }}>
                              {prod.formats.slice(0, 2).map((fmt) => (
                                <span
                                  key={fmt}
                                  style={{
                                    fontSize: "0.7rem",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    backgroundColor: "var(--surface-raised)",
                                    color: "var(--secondary-accent)",
                                    fontWeight: 700,
                                  }}
                                >
                                  {fmt}
                                </span>
                              ))}
                              {prod.formats.length > 2 && (
                                <span style={{ fontSize: "0.7rem", color: "var(--foreground-muted)", alignSelf: "center" }}>
                                  +{prod.formats.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Badge */}
                          <td style={{ padding: "14px 20px" }}>
                            {prod.badge ? (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: 800,
                                  padding: "3px 8px",
                                  borderRadius: "4px",
                                  backgroundColor: "rgba(230, 57, 70, 0.15)",
                                  color: "var(--main-accent)",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {prod.badge}
                              </span>
                            ) : (
                              <span style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <Link
                                href={`/product/${prod.id}`}
                                target="_blank"
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "4px",
                                  backgroundColor: "var(--surface-raised)",
                                  color: "var(--main-accent)",
                                  textDecoration: "none",
                                  fontSize: "0.78rem",
                                  fontWeight: 700,
                                  border: "1px solid var(--surface-border)",
                                }}
                              >
                                View ↗
                              </Link>
                              {isUserUploaded && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Remove custom case "${prod.name}" from the store?`)) {
                                      deleteProduct(prod.id);
                                      showToast(`Removed "${prod.name}" from store.`);
                                    }
                                  }}
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    backgroundColor: "rgba(255, 42, 58, 0.1)",
                                    color: "#ff4d4d",
                                    border: "1px solid rgba(255, 42, 58, 0.25)",
                                    fontSize: "0.78rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                  title="Delete Custom Case"
                                >
                                  🗑️ Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredCatalog.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "48px 20px", color: "var(--foreground-muted)" }}>
                          <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🔍</div>
                          <div style={{ fontWeight: 700 }}>No phone cases found matching &quot;{catalogSearch}&quot;</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              TAB 4: ANALYTICS & TELEMETRY
             ═══════════════════════════════════════════════════ */}
          {activeTab === "analytics" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 4px" }}>
                  Operational Telemetry & Performance
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", margin: 0 }}>
                  Real-time metrics on print lab throughput, top customer delivery hubs, and case format popularity.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                {/* Cities Hub */}
                <div
                  style={{
                    backgroundColor: "var(--surface)",
                    borderRadius: "14px",
                    border: "1px solid var(--surface-border)",
                    padding: "24px",
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 16px" }}>
                    🏙️ Top Delivery Destination Hubs
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { city: "Bengaluru, Karnataka", percent: 38, count: "Bluedart Hub Alpha" },
                      { city: "Mumbai, Maharashtra", percent: 27, count: "Western Hub Priority" },
                      { city: "Delhi NCR", percent: 21, count: "Indira Gandhi Cargo Terminal" },
                      { city: "Hyderabad, Telangana", percent: 14, count: "South Central Hub" },
                    ].map((hub) => (
                      <div key={hub.city}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "4px" }}>
                          <span>{hub.city}</span>
                          <span style={{ color: "var(--main-accent)" }}>{hub.percent}%</span>
                        </div>
                        <div style={{ width: "100%", height: "6px", backgroundColor: "var(--surface-raised)", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${hub.percent}%`, height: "100%", backgroundColor: "var(--main-accent)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Formats */}
                <div
                  style={{
                    backgroundColor: "var(--surface)",
                    borderRadius: "14px",
                    border: "1px solid var(--surface-border)",
                    padding: "24px",
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 16px" }}>
                    ⚡ Armor Format Preference
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { name: "Ultra Impact MagSafe (₹799)", share: "48% of carts", color: "#8b5cf6" },
                      { name: "Tough Armor Dual-Layer (₹599)", share: "32% of carts", color: "#e50914" },
                      { name: "9H Tempered Glass Back (₹699)", share: "14% of carts", color: "#06b6d4" },
                      { name: "Matte Slim EDC (₹499)", share: "6% of carts", color: "#10b981" },
                    ].map((fmt) => (
                      <div key={fmt.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", backgroundColor: "var(--surface-raised)", borderRadius: "8px" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{fmt.name}</span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: fmt.color }}>{fmt.share}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          MODAL 1: UPLOAD / ADD NEW PHONE CASE
         ═══════════════════════════════════════════════════ */}
      {isUploadModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "880px",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              padding: "28px",
              position: "relative",
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--main-accent)", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  ADMIN STORE CREATOR
                </span>
                <h2 style={{ fontSize: "1.45rem", fontWeight: 900, margin: "4px 0 0", color: "var(--foreground)" }}>
                  Upload New Phone Case to Store
                </h2>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "var(--foreground-muted)",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishCase}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
                
                {/* Left Column: Case Information Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px", color: "var(--foreground)" }}>
                      Case Title / Design Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gojo Satoru — Limitless Void"
                      value={newCase.name}
                      onChange={(e) => setNewCase({ ...newCase, name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px", color: "var(--foreground-muted)" }}>
                        Category / Theme
                      </label>
                      <select
                        value={newCase.theme}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewCase({
                            ...newCase,
                            theme: val,
                            franchise: val.charAt(0).toUpperCase() + val.slice(1),
                          });
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--surface-border)",
                          borderRadius: "8px",
                          color: "var(--foreground)",
                          fontSize: "0.85rem",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      >
                        <option value="anime">Anime</option>
                        <option value="gaming">Gaming</option>
                        <option value="streetwear">Streetwear</option>
                        <option value="dark-gothic">Dark / Gothic</option>
                        <option value="cars">Cars / JDM</option>
                        <option value="cute-kawaii">Cute / Kawaii</option>
                        <option value="aesthetic">Aesthetic</option>
                        <option value="sports">Sports</option>
                        <option value="music">Music</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px", color: "var(--foreground-muted)" }}>
                        Franchise / Universe
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jujutsu Kaisen"
                        value={newCase.franchise}
                        onChange={(e) => setNewCase({ ...newCase, franchise: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--surface-border)",
                          borderRadius: "8px",
                          color: "var(--foreground)",
                          fontSize: "0.85rem",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px", color: "var(--foreground-muted)" }}>
                        Selling Price (₹)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={newCase.price}
                        onChange={(e) => setNewCase({ ...newCase, price: Number(e.target.value) })}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--surface-border)",
                          borderRadius: "8px",
                          color: "var(--foreground)",
                          fontSize: "0.85rem",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px", color: "var(--foreground-muted)" }}>
                        Original / MRP (₹)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newCase.originalPrice}
                        onChange={(e) => setNewCase({ ...newCase, originalPrice: Number(e.target.value) })}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--surface-border)",
                          borderRadius: "8px",
                          color: "var(--foreground)",
                          fontSize: "0.85rem",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px", color: "var(--foreground-muted)" }}>
                      Badge Tag
                    </label>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {["NEW DROP", "HOT", "BESTSELLER", "LIMITED", "EXCLUSIVE"].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setNewCase({ ...newCase, badge: newCase.badge === b ? "" : b })}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "4px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            backgroundColor: newCase.badge === b ? "var(--main-accent)" : "var(--surface-raised)",
                            color: newCase.badge === b ? "#fff" : "var(--foreground-muted)",
                            border: "1px solid var(--surface-border)",
                            cursor: "pointer",
                          }}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px", color: "var(--foreground-muted)" }}>
                      Supported Case Formats
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {CASE_TYPES.map((c) => {
                        const checked = newCase.formats.includes(c.name);
                        return (
                          <label
                            key={c.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "0.82rem",
                              cursor: "pointer",
                              color: checked ? "var(--foreground)" : "var(--foreground-muted)",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleFormat(c.name)}
                              style={{ accentColor: "var(--main-accent)" }}
                            />
                            <span>{c.name} ({c.priceText})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Image Upload & Live Preview */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px", color: "var(--foreground)" }}>
                      Case Artwork Image *
                    </label>

                    {/* File Upload Box */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: "2px dashed var(--surface-border)",
                        borderRadius: "10px",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                        backgroundColor: "var(--background)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        style={{ display: "none" }}
                      />
                      <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>📁</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--main-accent)" }}>
                        Click to Upload Artwork File
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                        PNG, JPG, or WEBP from your computer
                      </div>
                    </div>

                    {/* Direct Image URL input */}
                    <div style={{ marginTop: "10px" }}>
                      <input
                        type="text"
                        placeholder="Or paste direct image URL..."
                        value={newCase.image}
                        onChange={(e) => setNewCase({ ...newCase, image: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--surface-border)",
                          borderRadius: "6px",
                          color: "var(--foreground)",
                          fontSize: "0.78rem",
                          outline: "none",
                        }}
                      />
                    </div>

                    {/* Quick Presets */}
                    <div style={{ marginTop: "10px" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--foreground-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                        Or Choose from High-Res Presets:
                      </span>
                      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                        {CASE_PRESETS.map((preset) => (
                          <div
                            key={preset.title}
                            onClick={() => {
                              setNewCase((prev) => ({
                                ...prev,
                                name: prev.name || preset.title,
                                franchise: preset.franchise,
                                theme: preset.theme,
                                image: preset.image,
                                price: preset.price,
                              }));
                            }}
                            style={{
                              position: "relative",
                              width: "48px",
                              height: "64px",
                              borderRadius: "6px",
                              overflow: "hidden",
                              cursor: "pointer",
                              border: newCase.image === preset.image ? "2px solid var(--main-accent)" : "1px solid var(--surface-border)",
                              flexShrink: 0,
                            }}
                            title={preset.title}
                          >
                            <Image src={preset.image} alt={preset.title} fill sizes="48px" style={{ objectFit: "cover" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Card Preview Box */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px", color: "var(--foreground-muted)" }}>
                      Live Store Card Preview
                    </label>
                    <div
                      style={{
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "12px",
                        padding: "16px",
                        display: "flex",
                        gap: "16px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "72px",
                          height: "96px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          flexShrink: 0,
                          backgroundColor: "#111",
                        }}
                      >
                        {newCase.image && (
                          <Image src={newCase.image} alt="Preview" fill sizes="72px" style={{ objectFit: "cover" }} />
                        )}
                      </div>
                      <div>
                        {newCase.badge && (
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: "0.65rem",
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: "var(--main-accent)",
                              color: "#fff",
                              marginBottom: "4px",
                            }}
                          >
                            {newCase.badge}
                          </span>
                        )}
                        <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--foreground)" }}>
                          {newCase.name || "Untitled Phone Case"}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--foreground-muted)" }}>
                          {newCase.franchise} • {newCase.formats[0]}
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "6px" }}>
                          <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--foreground)" }}>
                            ₹{newCase.price}
                          </span>
                          <span style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", textDecoration: "line-through" }}>
                            ₹{newCase.originalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--surface-border)" }}>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    color: "var(--foreground-muted)",
                    border: "1px solid var(--surface-border)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 26px",
                    borderRadius: "8px",
                    backgroundColor: "var(--main-accent)",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(230, 57, 70, 0.3)",
                  }}
                >
                  🚀 Publish Phone Case to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          MODAL 2: PACKING SLIP / INVOICE MODAL
         ═══════════════════════════════════════════════════ */}
      {selectedSlipOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              color: "#111827",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "32px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              fontFamily: "var(--font-heading), sans-serif",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #e5e7eb", paddingBottom: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#e50914" }}>CASE TADKA</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Fulfillment Bay 2 • Bengaluru, Karnataka</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>PACKING SLIP / INVOICE</div>
                <div style={{ fontSize: "0.8rem", color: "#4b5563" }}>Order #{selectedSlipOrder.id}</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Date: {selectedSlipOrder.date}</div>
              </div>
            </div>

            {/* Recipient info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px", fontSize: "0.85rem" }}>
              <div style={{ backgroundColor: "#f9fafb", padding: "12px 16px", borderRadius: "8px" }}>
                <div style={{ fontWeight: 700, color: "#374151", marginBottom: "4px", fontSize: "0.75rem", textTransform: "uppercase" }}>
                  Customer Shipping Address
                </div>
                <div style={{ fontWeight: 800 }}>{selectedSlipOrder.shipping.fullName}</div>
                <div>{selectedSlipOrder.shipping.address}</div>
                <div>{selectedSlipOrder.shipping.city}, {selectedSlipOrder.shipping.state} — {selectedSlipOrder.shipping.pincode}</div>
                <div style={{ fontWeight: 700, marginTop: "4px" }}>Phone: {selectedSlipOrder.shipping.phone}</div>
              </div>

              <div style={{ backgroundColor: "#f9fafb", padding: "12px 16px", borderRadius: "8px" }}>
                <div style={{ fontWeight: 700, color: "#374151", marginBottom: "4px", fontSize: "0.75rem", textTransform: "uppercase" }}>
                  Dispatch Telemetry
                </div>
                <div>Courier: <strong>Bluedart Priority Air</strong></div>
                <div>AWB Tracking: <strong>{selectedSlipOrder.trackingNumber}</strong></div>
                <div>Payment: <strong>{selectedSlipOrder.paymentMethod}</strong></div>
                <div>Status: <strong style={{ color: "#e50914" }}>{selectedSlipOrder.status}</strong></div>
              </div>
            </div>

            {/* Items table */}
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem", marginBottom: "20px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb", color: "#6b7280", fontSize: "0.72rem", textTransform: "uppercase" }}>
                  <th style={{ padding: "8px 0" }}>ITEM & SPEC</th>
                  <th style={{ padding: "8px 0", textAlign: "center" }}>QTY</th>
                  <th style={{ padding: "8px 0", textAlign: "right" }}>UNIT PRICE</th>
                  <th style={{ padding: "8px 0", textAlign: "right" }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {selectedSlipOrder.items.map((it) => (
                  <tr key={it.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "10px 0" }}>
                      <div style={{ fontWeight: 700 }}>{it.productName}</div>
                      <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                        Format: {it.format} {it.phoneModel ? `(${it.phoneModel})` : ""}
                      </div>
                    </td>
                    <td style={{ padding: "10px 0", textAlign: "center", fontWeight: 700 }}>{it.quantity}</td>
                    <td style={{ padding: "10px 0", textAlign: "right" }}>₹{it.price}</td>
                    <td style={{ padding: "10px 0", textAlign: "right", fontWeight: 800 }}>₹{it.price * it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "12px", display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: "220px", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span>Subtotal:</span>
                  <span>₹{selectedSlipOrder.subtotal}</span>
                </div>
                {selectedSlipOrder.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#16a34a" }}>
                    <span>Discount:</span>
                    <span>-₹{selectedSlipOrder.discount}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "1.1rem", borderTop: "1px solid #e5e7eb", paddingTop: "6px", marginTop: "6px" }}>
                  <span>Grand Total:</span>
                  <span style={{ color: "#e50914" }}>₹{selectedSlipOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px", borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
              <button
                onClick={() => setSelectedSlipOrder(null)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  padding: "8px 20px",
                  borderRadius: "6px",
                  backgroundColor: "#e50914",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                🖨️ Print Packing Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Toast */}
      {adminToast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            backgroundColor: "var(--surface)",
            border: "1px solid var(--main-accent)",
            color: "var(--foreground)",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            fontSize: "0.85rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>🔥</span>
          <span>{adminToast}</span>
        </div>
      )}
    </div>
  );
}
