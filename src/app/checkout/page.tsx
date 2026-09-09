"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, tierDiscount, promoDiscount, promoCode, createOrder } = useCart();

  const [formData, setFormData] = useState({
    fullName: "Kaito Takahashi",
    phone: "9876543210",
    email: "kaito@shinra.in",
    address: "Flat 402, Cyber Heights, 27th Main, Sector 1",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560102",
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = shippingMethod === "express" ? 149 : subtotal >= 799 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - tierDiscount - promoDiscount + shippingCost);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
      alert("Please fill in all required shipping fields.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Create order records
      const orderItems = cart.map((i) => ({
        id: `item-${Date.now()}-${Math.random()}`,
        productName: i.product.name,
        format: i.format,
        phoneModel: i.phoneModel,
        price: i.product.price,
        quantity: i.quantity,
        image: i.customDesignPreview || i.product.image,
      }));

      const newOrder = createOrder({
        items: orderItems.length > 0 ? orderItems : [
          {
            id: "sample-item",
            productName: "Luffy (Gear 5) — Sun God Nika",
            format: "Framed",
            price: 559,
            quantity: 1,
            image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787153686/mockups/luffy-gear-5-one-piece-poster-paper-5.jpg",
          }
        ],
        subtotal: subtotal || 559,
        discount: tierDiscount + promoDiscount,
        total: finalTotal || 559,
        shipping: {
          fullName: formData.fullName,
          phone: `+91 ${formData.phone}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod:
          paymentMethod === "upi"
            ? "UPI (Google Pay / PhonePe)"
            : paymentMethod === "card"
            ? "Debit / Credit Card"
            : paymentMethod === "netbanking"
            ? "Net Banking"
            : "Cash on Delivery",
      });

      setIsProcessing(false);
      router.push(`/order-confirmation?orderId=${newOrder.id}`);
    }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: "5rem" }}>
        {/* Banner */}
        <section
          style={{
            backgroundColor: "var(--background)",
            borderBottom: "1px solid var(--surface-border)",
            padding: "2rem 0",
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
                marginBottom: "0.4rem",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <a href="/" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                Home
              </a>
              <span>/</span>
              <a href="/cart" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                Cart
              </a>
              <span>/</span>
              <span style={{ color: "var(--shinra-red)" }}>Checkout</span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.3rem)",
                fontWeight: 900,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              SECURE CHECKOUT
            </h1>
          </div>
        </section>

        <section className="container" style={{ marginTop: "2.5rem" }}>
          <form
            onSubmit={handleSubmitOrder}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "3rem",
              alignItems: "start",
            }}
          >
            {/* Left: Shipping & Payment Form */}
            <div>
              {/* Step 1: Customer Contact & Shipping */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
                  <span
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: "var(--shinra-red)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: 900,
                    }}
                  >
                    1
                  </span>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase" }}>
                    SHIPPING ADDRESS (PAN-INDIA)
                  </h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "6px",
                        padding: "10px 14px",
                        color: "var(--foreground)",
                        fontSize: "0.85rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      Phone (for SMS Tracking) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "6px",
                        padding: "10px 14px",
                        color: "var(--foreground)",
                        fontSize: "0.85rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "6px",
                        padding: "10px 14px",
                        color: "var(--foreground)",
                        fontSize: "0.85rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      Delivery Street Address / Flat / Floor *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "6px",
                        padding: "10px 14px",
                        color: "var(--foreground)",
                        fontSize: "0.85rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "6px",
                        padding: "10px 14px",
                        color: "var(--foreground)",
                        fontSize: "0.85rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      PIN Code (Pan-India) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "6px",
                        padding: "10px 14px",
                        color: "var(--foreground)",
                        fontSize: "0.85rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Speed */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
                  <span
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: "var(--shinra-red)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: 900,
                    }}
                  >
                    2
                  </span>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase" }}>
                    SHIPPING SPEED
                  </h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem",
                      border: shippingMethod === "standard" ? "1px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                      backgroundColor: shippingMethod === "standard" ? "rgba(229,9,20,0.06)" : "var(--background)",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        style={{ accentColor: "var(--shinra-red)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>Standard Surface Delivery</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)" }}>Estimated 4-7 business days pan-India</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: "0.85rem", color: subtotal >= 799 ? "#22c55e" : "#ffffff" }}>
                      {subtotal >= 799 ? "FREE" : "₹99"}
                    </span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem",
                      border: shippingMethod === "express" ? "1px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                      backgroundColor: shippingMethod === "express" ? "rgba(229,9,20,0.06)" : "var(--background)",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        style={{ accentColor: "var(--shinra-red)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>⚡ Bluedart Priority Air Express</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)" }}>Dispatched in 24h • 2-3 business days</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>₹149</span>
                  </label>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
                  <span
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: "var(--shinra-red)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: 900,
                    }}
                  >
                    3
                  </span>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase" }}>
                    PAYMENT GATEWAY
                  </h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem",
                      border: paymentMethod === "upi" ? "1px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                      backgroundColor: paymentMethod === "upi" ? "rgba(229,9,20,0.06)" : "var(--background)",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        style={{ accentColor: "var(--shinra-red)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>Instant UPI / QR</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)" }}>Google Pay, PhonePe, Paytm, BHIM</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.7rem", backgroundColor: "rgba(34, 197, 94, 0.15)", color: "#22c55e", fontWeight: 800, padding: "3px 8px", borderRadius: "4px" }}>
                      Fastest
                    </span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem",
                      border: paymentMethod === "card" ? "1px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                      backgroundColor: paymentMethod === "card" ? "rgba(229,9,20,0.06)" : "var(--background)",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        style={{ accentColor: "var(--shinra-red)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>Credit / Debit Cards</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)" }}>Visa, Mastercard, RuPay, Amex</div>
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem",
                      border: paymentMethod === "cod" ? "1px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                      backgroundColor: paymentMethod === "cod" ? "rgba(229,9,20,0.06)" : "var(--background)",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        style={{ accentColor: "var(--shinra-red)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>Cash on Delivery</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)" }}>Pay at doorstep upon package arrival</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Sticky Order Summary */}
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
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  marginBottom: "1rem",
                  letterSpacing: "0.04em",
                }}
              >
                ORDER SUMMARY
              </h2>

              {/* Items Mini List */}
              <div style={{ maxHeight: "220px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem", paddingRight: "4px" }}>
                {cart.length > 0 ? (
                  cart.map((i) => (
                    <div key={`${i.product.id}-${i.format}`} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <div style={{ position: "relative", width: "42px", height: "54px", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                        <Image src={i.customDesignPreview || i.product.image} alt={i.product.name} fill sizes="42px" style={{ objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {i.product.name}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "var(--foreground-muted)" }}>
                          Qty: {i.quantity} • {i.format}
                        </div>
                      </div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 800 }}>
                        ₹{i.product.price * i.quantity}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: "0.8rem", color: "var(--foreground-muted)" }}>
                    Demo item: Luffy (Gear 5) Framed (₹559)
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", borderTop: "1px solid var(--surface-border)", paddingTop: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--foreground-muted)" }}>
                  <span>Subtotal</span>
                  <span style={{ color: "var(--foreground)", fontWeight: 700 }}>₹{subtotal || 559}</span>
                </div>
                {tierDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--shinra-red)" }}>
                    <span>Tier Discount</span>
                    <span style={{ fontWeight: 800 }}>-₹{tierDiscount}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--shinra-red)" }}>
                    <span>Promo Discount ({promoCode})</span>
                    <span style={{ fontWeight: 800 }}>-₹{promoDiscount}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--foreground-muted)" }}>
                  <span>Shipping</span>
                  <span style={{ color: shippingCost === 0 ? "#22c55e" : "var(--foreground)", fontWeight: 700 }}>
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid var(--surface-border)", paddingTop: "1rem", marginBottom: "1.5rem" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800 }}>
                  TOTAL PAYABLE
                </span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 900, color: "var(--shinra-red)" }}>
                  ₹{finalTotal || 559}
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  width: "100%",
                  backgroundColor: "var(--shinra-red)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "14px",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.9rem",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: isProcessing ? "wait" : "pointer",
                  boxShadow: "0 4px 20px var(--shinra-red-glow)",
                  opacity: isProcessing ? 0.7 : 1,
                  transition: "all 0.2s",
                }}
              >
                {isProcessing ? "Authorizing Order..." : "Confirm & Place Order →"}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "0.72rem", color: "var(--foreground-muted)", marginTop: "1rem" }}>
                <span>🛡️ Unconditional Replacement Guarantee</span>
              </div>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
