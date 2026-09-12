"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart, OrderRecord } from "@/lib/cartContext";
import { PRODUCTS } from "@/data/products";

const NAV_SECTIONS = [
  {
    label: "STORE FRONT",
    links: [
      { href: "/", label: "Home", icon: "🏠" },
      { href: "/shop", label: "Phone Cases Shop", icon: "📱" },
      { href: "/categories", label: "Case Categories", icon: "📂" },
      { href: "/product/luffy-gear5-case", label: "Product Detail", icon: "🛍️" },
      { href: "/customize", label: "Custom Studio", icon: "⚡" },
    ],
  },
  {
    label: "CUSTOMER PAGES",
    links: [
      { href: "/login", label: "Login / Sign In", icon: "🔐" },
      { href: "/account", label: "My Account", icon: "👤" },
      { href: "/cart", label: "Cart", icon: "🛒" },
      { href: "/checkout", label: "Checkout", icon: "💳" },
      { href: "/order-confirmation", label: "Order Confirmation", icon: "✅" },
      { href: "/track-order", label: "Track Order", icon: "📦" },
      { href: "/saved-designs", label: "Saved Designs", icon: "💾" },
    ],
  },
  {
    label: "ADMIN",
    links: [
      { href: "/admin", label: "Admin Dashboard", icon: "⚙️" },
    ],
  },
];

export default function AdminPage() {
  const pathname = usePathname();
  const { orders, updateOrderStatus } = useCart();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "coupons">("orders");

  // Calculate live metrics
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0) + 148200; // Including base history
  const activeOrders = orders.filter((o) => o.status !== "DELIVERED").length;
  const customQueueCount = orders.reduce((count, o) => {
    return count + o.items.filter((item) => item.format === "Tough Case" || item.format === "Acrylic").length;
  }, 7);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === "ALL" || o.status === filterStatus;
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shipping.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shipping.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
          <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.2em", color: "var(--shinra-red)", textTransform: "uppercase", marginBottom: "4px" }}>HACHIMAN</div>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--foreground)" }}>Admin Panel</div>
        </div>

        {/* Nav sections */}
        <nav style={{ flex: 1, padding: "12px 0" }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} style={{ marginBottom: "8px" }}>
              <div style={{
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "var(--foreground-muted)",
                textTransform: "uppercase",
                padding: "10px 20px 4px",
              }}>
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

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--surface-border)", fontSize: "0.75rem", color: "var(--foreground-muted)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#2ed573", boxShadow: "0 0 6px #2ed573", flexShrink: 0 }} />
            <span>UV DTF Press: <strong style={{ color: "#2ed573" }}>ONLINE</strong></span>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─────────────────────────────────── */}
      <div style={{ flex: 1, overflowX: "hidden", padding: "100px 32px 80px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
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
            marginBottom: "32px",
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
            <span style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--main-accent)" }}>
              HACHIMAN OPS COMMAND TERMINAL // SECURE NODE
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "0.85rem", color: "var(--foreground-muted)" }}>
            <span>UV DTF Press: <strong style={{ color: "#2ed573" }}>ONLINE</strong></span>
            <span>Bluedart API: <strong style={{ color: "#2ed573" }}>SYNCED</strong></span>
            <Link
              href="/"
              style={{
                color: "var(--main-accent)",
                textDecoration: "none",
                padding: "4px 10px",
                borderRadius: "6px",
                backgroundColor: "var(--surface-raised)",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              Back to Storefront ↗
            </Link>
          </div>
        </div>

        {/* Dashboard Title & Quick Stats */}
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 8px", color: "var(--foreground)" }}>
            Store Management Console
          </h1>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.95rem", margin: 0 }}>
            Live telemetry for print-on-demand fulfillment, phone armor production, and dispatch logs.
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "24px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Gross Revenue (MTD)
            </span>
            <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px", color: "var(--foreground)" }}>
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#2ed573", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
              <span>↑ 24.8%</span> from last cycle
            </div>
          </div>

          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "24px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Active Dispatches
            </span>
            <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px", color: "var(--foreground)" }}>
              {activeOrders}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--main-accent)", marginTop: "6px" }}>
              4 in transit via Bluedart Air
            </div>
          </div>

          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "24px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              UV Print Queue
            </span>
            <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px", color: "var(--secondary-accent)" }}>
              {customQueueCount} items
            </div>
            <div style={{ fontSize: "0.8rem", color: "#ffb142", marginTop: "6px" }}>
              Tough cases & Acrylic magnetic
            </div>
          </div>

          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "24px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Avg Order Value
            </span>
            <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px", color: "var(--foreground)" }}>
              ₹1,180
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", marginTop: "6px" }}>
              2.4 items per cart avg
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid var(--surface-border)", marginBottom: "28px" }}>
          {[
            { id: "orders", label: `Fulfillment & Orders (${orders.length})` },
            { id: "inventory", label: `Catalog Stocks (${PRODUCTS.length})` },
            { id: "coupons", label: "Active Promos" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "12px 20px",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid var(--main-accent)" : "2px solid transparent",
                color: activeTab === tab.id ? "var(--main-accent)" : "var(--foreground-muted)",
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === "orders" && (
          <div>
            {/* Filters Row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              {/* Status Chips */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["ALL", "PENDING", "CONFIRMED", "PRINTING", "SHIPPED", "DELIVERED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      backgroundColor: filterStatus === st ? "var(--main-accent)" : "var(--surface)",
                      color: filterStatus === st ? "#fff" : "var(--foreground-muted)",
                      border: filterStatus === st ? "1px solid var(--main-accent)" : "1px solid var(--surface-border)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search Order ID, customer, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

            {/* Orders Table Container */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "14px",
                border: "1px solid var(--surface-border)",
                overflowX: "auto",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--surface-border)", color: "var(--foreground-muted)", fontSize: "0.8rem" }}>
                    <th style={{ padding: "16px 20px" }}>ORDER ID & DATE</th>
                    <th style={{ padding: "16px 20px" }}>CUSTOMER</th>
                    <th style={{ padding: "16px 20px" }}>ITEMS & FORMAT</th>
                    <th style={{ padding: "16px 20px" }}>TOTAL</th>
                    <th style={{ padding: "16px 20px" }}>STATUS SELECTOR</th>
                    <th style={{ padding: "16px 20px" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: "1px solid var(--surface-border)",
                        transition: "background 0.2s ease",
                      }}
                    >
                      {/* ID & Date */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 700, color: "var(--foreground)", fontFamily: "monospace" }}>#{order.id}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", marginTop: "2px" }}>{order.date}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", marginTop: "2px" }}>{order.paymentMethod}</div>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 600, color: "var(--foreground)" }}>{order.shipping.fullName}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--foreground-muted)" }}>
                          {order.shipping.city}, {order.shipping.state}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>{order.shipping.phone}</div>
                      </td>

                      {/* Items */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {order.items.map((item) => (
                            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  backgroundColor: "var(--surface-raised)",
                                  color: "var(--main-accent)",
                                  fontWeight: 700,
                                }}
                              >
                                {item.quantity}x
                              </span>
                              <span style={{ fontWeight: 500, color: "var(--foreground)", fontSize: "0.85rem" }}>
                                {item.productName.slice(0, 26)}...
                              </span>
                              <span style={{ fontSize: "0.75rem", color: "var(--secondary-accent)", fontWeight: 600 }}>({item.format})</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 800, color: "var(--foreground)" }}>₹{order.total}</div>
                        {order.discount > 0 && (
                          <div style={{ fontSize: "0.75rem", color: "#2ed573" }}>-₹{order.discount} saved</div>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td style={{ padding: "16px 20px" }}>
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
                            fontWeight: 700,
                            cursor: "pointer",
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
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Link
                            href={`/track-order?id=${order.id}`}
                            style={{
                              padding: "6px 10px",
                              borderRadius: "4px",
                              backgroundColor: "var(--surface-raised)",
                              color: "var(--main-accent)",
                              textDecoration: "none",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              border: "1px solid var(--surface-border)",
                            }}
                          >
                            Track
                          </Link>
                          <Link
                            href={`/order-confirmation?orderId=${order.id}`}
                            style={{
                              padding: "6px 10px",
                              borderRadius: "4px",
                              backgroundColor: "var(--background)",
                              color: "var(--foreground)",
                              textDecoration: "none",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              border: "1px solid var(--surface-border)",
                            }}
                          >
                            Slip
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Inventory */}
        {activeTab === "inventory" && (
          <div
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "14px",
              border: "1px solid var(--surface-border)",
              overflowX: "auto",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--surface-border)", color: "var(--foreground-muted)", fontSize: "0.8rem" }}>
                  <th style={{ padding: "16px 20px" }}>PRODUCT</th>
                  <th style={{ padding: "16px 20px" }}>UNIVERSE</th>
                  <th style={{ padding: "16px 20px" }}>FORMAT</th>
                  <th style={{ padding: "16px 20px" }}>PRICE</th>
                  <th style={{ padding: "16px 20px" }}>STOCK STATUS</th>
                  <th style={{ padding: "16px 20px" }}>LINK</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.slice(0, 10).map((prod) => (
                  <tr key={prod.id} style={{ borderBottom: "1px solid var(--surface-border)" }}>
                    <td style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--foreground)" }}>{prod.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>SKU: SHN-{prod.id}</div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", color: "var(--foreground-muted)" }}>{prod.franchise}</td>
                    <td style={{ padding: "16px 20px", color: "var(--main-accent)", fontWeight: 600 }}>{prod.formats?.[0] || "Paper"}</td>
                    <td style={{ padding: "16px 20px", fontWeight: 700, color: "var(--foreground)" }}>₹{prod.price}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(46, 213, 115, 0.15)",
                          color: "#2ed573",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        IN STOCK (UV Ready)
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <Link
                        href={`/product/${prod.id}`}
                        style={{ color: "var(--main-accent)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 }}
                      >
                        View ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Coupons */}
        {activeTab === "coupons" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {[
              { code: "HACHIMAN", disc: "10% OFF Sitewide", uses: "1,249 redeemed", status: "ACTIVE" },
              { code: "DROP20", disc: "20% OFF Orders > ₹1,499", uses: "582 redeemed", status: "ACTIVE" },
              { code: "HACHIMAN50", disc: "Flat ₹50 OFF for New Hunters", uses: "3,110 redeemed", status: "ACTIVE" },
              { code: "CYBERPUNK", disc: "15% OFF Tough Cases Only", uses: "419 redeemed", status: "PAUSED" },
            ].map((c) => (
              <div
                key={c.code}
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      color: "var(--main-accent)",
                      backgroundColor: "var(--surface-raised)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px dashed var(--main-accent)",
                    }}
                  >
                    {c.code}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: c.status === "ACTIVE" ? "#2ed573" : "var(--foreground-muted)",
                    }}
                  >
                    {c.status}
                  </span>
                </div>
                <div style={{ fontWeight: 600, color: "var(--foreground)", marginBottom: "4px" }}>{c.disc}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--foreground-muted)" }}>{c.uses}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
