"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import { useCart } from "@/lib/cartContext";

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tierDiscount,
    promoCode,
    applyPromo,
    promoDiscount,
    freeShippingProgress,
    totalItems,
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const shippingCost = subtotal >= 799 || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - tierDiscount - promoDiscount + shippingCost);

  // Next tier computation
  let nextTierMsg = "";
  if (totalItems < 2) nextTierMsg = "Add 1 more item to unlock 10% OFF!";
  else if (totalItems < 3) nextTierMsg = "Add 1 more item to unlock 15% OFF!";
  else if (totalItems < 5) nextTierMsg = `Add ${5 - totalItems} more items to unlock 20% OFF!`;
  else if (totalItems < 10) nextTierMsg = `Add ${10 - totalItems} more items to unlock 25% OFF!`;
  else nextTierMsg = "🎉 Maximum 25% Collector Tier discount unlocked!";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <CartDrawer />
      <SearchModal />

      <main style={{ flex: 1, paddingBottom: "5rem" }}>
        {/* Banner */}
        <section
          style={{
            backgroundColor: "var(--background)",
            borderBottom: "1px solid var(--surface-border)",
            padding: "2.5rem 0",
          }}
        >
          <div className="container">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--foreground-muted)",
                marginBottom: "0.5rem",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <a href="/" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                Home
              </a>
              <span>/</span>
              <span style={{ color: "var(--shinra-red)" }}>Your Cart</span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                fontWeight: 900,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              SHOPPING CART ({totalItems})
            </h1>
          </div>
        </section>

        <section className="container" style={{ marginTop: "2.5rem" }}>
          {cart.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "3rem",
                alignItems: "start",
              }}
            >
              {/* Left Column: Line Items */}
              <div style={{ flex: "1 1 60%" }}>
                {/* Free Shipping Meter */}
                <div
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "8px",
                    padding: "1rem 1.25rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>
                    <span>
                      {subtotal >= 799 ? "🚀 You unlocked FREE Pan-India Shipping!" : `Add ₹${799 - subtotal} more for FREE shipping`}
                    </span>
                    <span style={{ color: "var(--shinra-red)" }}>{freeShippingProgress}%</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", backgroundColor: "var(--surface-border)", borderRadius: "999px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${freeShippingProgress}%`,
                        height: "100%",
                        backgroundColor: "var(--shinra-red)",
                        borderRadius: "999px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Tier Discount Meter */}
                <div
                  style={{
                    backgroundColor: "var(--surface-raised)",
                    border: "1px dashed var(--shinra-red)",
                    borderRadius: "8px",
                    padding: "0.85rem 1.25rem",
                    marginBottom: "1.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--foreground)",
                  }}
                >
                  <span>🔥</span>
                  <span>{nextTierMsg}</span>
                </div>

                {/* Items List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.format}-${item.phoneModel || ""}`}
                      style={{
                        display: "flex",
                        gap: "1.25rem",
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "10px",
                        padding: "1rem",
                        alignItems: "center",
                      }}
                    >
                      {/* Image */}
                      <div
                        style={{
                          position: "relative",
                          width: "80px",
                          height: "105px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          flexShrink: 0,
                          backgroundColor: "#000",
                        }}
                      >
                        <Image
                          src={item.customDesignPreview || item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "1rem",
                            fontWeight: 800,
                            marginBottom: "4px",
                          }}
                        >
                          {item.product.name}
                        </h3>

                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                          <span
                            style={{
                              backgroundColor: "rgba(255,255,255,0.08)",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: "4px",
                              textTransform: "uppercase",
                            }}
                          >
                            Format: {item.format}
                          </span>
                          {item.phoneModel && (
                            <span
                              style={{
                                backgroundColor: "rgba(229, 9, 20, 0.15)",
                                color: "var(--shinra-red)",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              {item.phoneModel}
                            </span>
                          )}
                          {item.size && (
                            <span
                              style={{
                                backgroundColor: "rgba(255,255,255,0.08)",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              Size: {item.size}
                            </span>
                          )}
                        </div>

                        <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>
                          ₹{item.product.price}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid var(--surface-border)",
                          borderRadius: "4px",
                          backgroundColor: "var(--background)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.format, item.quantity - 1, item.phoneModel)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ffffff",
                            padding: "4px 10px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: 700,
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, minWidth: "20px", textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.format, item.quantity + 1, item.phoneModel)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ffffff",
                            padding: "4px 10px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: 700,
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Item Subtotal */}
                      <div style={{ textAlign: "right", minWidth: "70px" }}>
                        <div style={{ fontWeight: 900, fontFamily: "var(--font-heading)", fontSize: "1.1rem" }}>
                          ₹{item.product.price * item.quantity}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id, item.format, item.phoneModel)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--foreground-muted)",
                            fontSize: "0.72rem",
                            cursor: "pointer",
                            textDecoration: "underline",
                            marginTop: "4px",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
                  <a
                    href="/shop"
                    style={{
                      color: "var(--foreground-muted)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      textTransform: "uppercase",
                    }}
                  >
                    ← Continue Shopping
                  </a>
                  <button
                    type="button"
                    onClick={clearCart}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    Clear All Items
                  </button>
                </div>
              </div>

              {/* Right Column: Order Summary & Checkout */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  position: "sticky",
                  top: "100px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.3rem",
                    fontWeight: 900,
                    marginBottom: "1.25rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  ORDER SUMMARY
                </h2>

                {/* Promo Input */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--foreground-muted)", marginBottom: "6px" }}>
                    Coupon Voucher
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Use: HACHIMAN or DROP20"
                      style={{
                        flex: 1,
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        color: "var(--foreground)",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        fontSize: "0.82rem",
                        outline: "none",
                        textTransform: "uppercase",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => applyPromo(inputCode)}
                      style={{
                        backgroundColor: "var(--shinra-red)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 14px",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        textTransform: "uppercase",
                      }}
                    >
                      Apply
                    </button>
                  </div>
                  {promoCode && (
                    <div style={{ color: "#22c55e", fontSize: "0.72rem", fontWeight: 700, marginTop: "4px" }}>
                      ✓ Code {promoCode} active!
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderBottom: "1px solid var(--surface-border)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--foreground-muted)" }}>
                    <span>Items Subtotal</span>
                    <span style={{ color: "#ffffff", fontWeight: 700 }}>₹{subtotal}</span>
                  </div>
                  {tierDiscount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--shinra-red)" }}>
                      <span>Buy More Save More Tier</span>
                      <span style={{ fontWeight: 800 }}>-₹{tierDiscount}</span>
                    </div>
                  )}
                  {promoDiscount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--shinra-red)" }}>
                      <span>Promo Coupon ({promoCode})</span>
                      <span style={{ fontWeight: 800 }}>-₹{promoDiscount}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--foreground-muted)" }}>
                    <span>Pan-India Shipping</span>
                    <span style={{ color: shippingCost === 0 ? "#22c55e" : "#ffffff", fontWeight: 700 }}>
                      {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                    </span>
                  </div>
                </div>

                {/* Final Total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800 }}>
                    TOTAL AMOUNT
                  </span>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 900, color: "var(--shinra-red)" }}>
                    ₹{finalTotal}
                  </span>
                </div>

                {/* Special Instructions */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add delivery instructions or gift note..."
                    style={{
                      width: "100%",
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--surface-border)",
                      color: "#ffffff",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "0.78rem",
                      outline: "none",
                      resize: "none",
                    }}
                  />
                </div>

                {/* Proceed to Checkout CTA */}
                <Link
                  href="/checkout"
                  style={{
                    display: "block",
                    textAlign: "center",
                    backgroundColor: "var(--shinra-red)",
                    color: "#ffffff",
                    borderRadius: "6px",
                    padding: "14px",
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    boxShadow: "0 4px 20px var(--shinra-red-glow)",
                    transition: "all 0.2s",
                  }}
                >
                  Proceed to Checkout →
                </Link>

                <div style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--foreground-muted)", marginTop: "1rem" }}>
                  🔒 256-Bit Encrypted Secure Checkout
                </div>
              </div>
            </div>
          ) : (
            /* Empty Cart */
            <div
              style={{
                textAlign: "center",
                padding: "5rem 1rem",
                backgroundColor: "var(--surface)",
                border: "1px dashed var(--surface-border)",
                borderRadius: "16px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.5rem" }}>
                YOUR CART IS EMPTY
              </h2>
              <p style={{ color: "var(--foreground-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
                You haven&apos;t added any anime drops or custom cases yet. Check out our latest drops with Buy More Save More discounts!
              </p>
              <a
                href="/shop"
                style={{
                  display: "inline-block",
                  backgroundColor: "var(--shinra-red)",
                  color: "#ffffff",
                  padding: "12px 28px",
                  borderRadius: "6px",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px var(--shinra-red-glow)",
                }}
              >
                Explore Drops Catalog
              </a>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
