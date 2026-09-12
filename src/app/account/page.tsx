"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";

export default function AccountPage() {
  const { user, logout, orders } = useCart();
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses">("orders");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", padding: "100px 20px 80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span style={{ color: "var(--shinra-red)", fontWeight: 600 }}>Account</span>
        </div>

        {/* Header / Profile Hero Card */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "32px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "250px",
              height: "250px",
              background: "radial-gradient(circle, rgba(255, 42, 58, 0.12), transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #e63946, #800f2f)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: "#fff",
                  boxShadow: "0 0 20px rgba(230, 57, 70, 0.4)",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {user ? user.name.charAt(0) : "S"}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px", margin: 0 }}>
                    {user ? user.name : "Cyberpunk Hunter"}
                  </h1>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "20px",
                      backgroundColor: "var(--surface-raised)",
                      color: "var(--main-accent)",
                      border: "1px solid var(--main-accent)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {user?.tier || "VIP Hunter"}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px", margin: 0 }}>
                  {user?.email || "operative@shinra.in"} • Member since 2024
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href="/saved-designs"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "var(--foreground)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.2s ease",
                }}
              >
                <span>🎨</span> Saved Custom Studio
              </Link>
              <Link
                href="/admin"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  backgroundColor: "var(--surface-raised)",
                  color: "var(--main-accent)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid var(--surface-border)",
                }}
              >
                <span>⚡</span> Admin Command
              </Link>
              <button
                onClick={logout}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid var(--surface-border)",
                }}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Hunter Tier Benefits Banner */}
          <div
            style={{
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.3rem" }}>🚀</span>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Fulfillment Priority</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--foreground)" }}>24h Bluedart Air</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.3rem" }}>💎</span>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Hunter Reward Coins</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--foreground)" }}>1,250 SHN Pts</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.3rem" }}>🎟️</span>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Next Drop Access</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--foreground)" }}>1 Hour Early RSVP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "32px" }}>
          {[
            { id: "orders", label: `Order History (${orders.length})` },
            { id: "profile", label: "Hunter Profile" },
            { id: "addresses", label: "Saved Addresses" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "12px 20px",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid var(--shinra-red)" : "2px solid transparent",
                color: activeTab === tab.id ? "var(--foreground)" : "var(--text-muted)",
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  background: "var(--surface)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📦</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>No orders placed yet</h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Explore our limited franchise archive and tough phone armor.</p>
                <Link
                  href="/shop"
                  style={{
                    display: "inline-block",
                    padding: "12px 28px",
                    borderRadius: "8px",
                    backgroundColor: "var(--shinra-red)",
                    color: "#fff",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Explore Drops
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {orders.map((order) => {
                  const getStatusBadge = (st: string) => {
                    switch (st) {
                      case "DELIVERED":
                        return { bg: "rgba(46, 213, 115, 0.15)", color: "#2ed573", border: "rgba(46, 213, 115, 0.3)" };
                      case "SHIPPED":
                        return { bg: "rgba(0, 168, 255, 0.15)", color: "#00a8ff", border: "rgba(0, 168, 255, 0.3)" };
                      case "PRINTING":
                        return { bg: "rgba(255, 177, 66, 0.15)", color: "#ffb142", border: "rgba(255, 177, 66, 0.3)" };
                      default:
                        return { bg: "rgba(230, 57, 70, 0.15)", color: "#e63946", border: "rgba(230, 57, 70, 0.3)" };
                    }
                  };
                  const badge = getStatusBadge(order.status);

                  return (
                    <div
                      key={order.id}
                      style={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "14px",
                        overflow: "hidden",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
                      }}
                    >
                      {/* Top Bar */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "16px 24px",
                          backgroundColor: "var(--background)",
                          borderBottom: "1px solid var(--surface-border)",
                          gap: "12px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                          <div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>ORDER PLACED</span>
                            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{order.date}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>TOTAL</span>
                            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>₹{order.total}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>SHIP TO</span>
                            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{order.shipping.fullName}</span>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "20px",
                              backgroundColor: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              letterSpacing: "0.05em",
                            }}
                          >
                            {order.status}
                          </span>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                            #{order.id}
                          </span>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div style={{ padding: "24px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          {order.items.map((item) => (
                            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              <img
                                src={item.image}
                                alt={item.productName}
                                style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{item.productName}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                  Format: <strong style={{ color: "var(--foreground)" }}>{item.format}</strong>
                                  {item.phoneModel && ` • Device: ${item.phoneModel}`}
                                  {` • Qty: ${item.quantity}`}
                                </div>
                              </div>
                              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)" }}>
                                ₹{item.price * item.quantity}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div
                          style={{
                            marginTop: "20px",
                            paddingTop: "16px",
                            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "12px",
                          }}
                        >
                          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            AWB: <span style={{ fontFamily: "monospace", color: "var(--foreground)" }}>{order.trackingNumber}</span>
                          </div>

                          <div style={{ display: "flex", gap: "12px" }}>
                            <Link
                              href={`/track-order?id=${order.id}`}
                              style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                backgroundColor: "var(--shinra-red)",
                                color: "#fff",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                textDecoration: "none",
                              }}
                            >
                              Live Telemetry Track
                            </Link>
                            <Link
                              href={`/order-confirmation?orderId=${order.id}`}
                              style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                color: "var(--foreground)",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                textDecoration: "none",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                              }}
                            >
                              View Invoice
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile */}
        {activeTab === "profile" && (
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "32px",
              maxWidth: "680px",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "20px" }}>Personal Identification</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "6px" }}>Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || "Kaito Takahashi"}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "var(--foreground)",
                    fontSize: "0.95rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "6px" }}>Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email || "kaito@shinra.in"}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "var(--foreground)",
                    fontSize: "0.95rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "6px" }}>Phone Number</label>
                <input
                  type="tel"
                  defaultValue={user?.phone || "+91 98765 43210"}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "var(--foreground)",
                    fontSize: "0.95rem",
                  }}
                />
              </div>

              <div style={{ marginTop: "12px" }}>
                <button
                  type="button"
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    backgroundColor: "var(--shinra-red)",
                    color: "#fff",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === "addresses" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid rgba(230, 57, 70, 0.3)",
                borderRadius: "14px",
                padding: "24px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  backgroundColor: "rgba(230, 57, 70, 0.15)",
                  color: "#e63946",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
              >
                DEFAULT
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 8px" }}>Kaito Takahashi (Home)</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                Flat 402, Cyber Heights, 17th Cross<br />
                HSR Layout, Sector 4<br />
                Bengaluru, Karnataka — 560102<br />
                India<br />
                Phone: +91 98765 43210
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                <button
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "var(--foreground)",
                    fontSize: "0.8rem",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Add Address Card */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                border: "2px dashed rgba(255, 255, 255, 0.1)",
                borderRadius: "14px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "180px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "2rem", marginBottom: "8px", color: "var(--text-muted)" }}>+</span>
              <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--foreground)" }}>Add New Cyber Terminal Address</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>Pan-India courier supported</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
