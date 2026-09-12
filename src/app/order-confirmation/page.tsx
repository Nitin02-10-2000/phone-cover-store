"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "SHN-94281";
  const { orders } = useCart();

  const currentOrder = orders.find((o) => o.id === orderId) || orders[0];

  return (
    <div className="container" style={{ maxWidth: "800px", margin: "3rem auto" }}>
      {/* Celebration Header */}
      <div
        style={{
          textAlign: "center",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "16px",
          padding: "3rem 2rem",
          marginBottom: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, var(--shinra-red), #fbbf24, var(--shinra-red))",
          }}
        />

        {/* Animated Checkmark Badge */}
        <div
          style={{
            width: "72px",
            height: "72px",
            backgroundColor: "#22c55e",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem auto",
            boxShadow: "0 0 30px rgba(34, 197, 94, 0.4)",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <span
          style={{
            color: "var(--shinra-red)",
            fontFamily: "var(--font-heading)",
            fontSize: "0.8rem",
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          THANK YOU FOR YOUR ORDER
        </span>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 900,
            marginTop: "0.5rem",
            marginBottom: "0.75rem",
            letterSpacing: "0.04em",
          }}
        >
          ORDER #{currentOrder?.id || orderId} CONFIRMED!
        </h1>

        <p style={{ color: "var(--foreground-muted)", fontSize: "0.95rem", maxWidth: "550px", margin: "0 auto" }}>
          We’ve received your order and our print workshop is preparing your high-res anime drop. A confirmation SMS & email have been dispatched.
        </p>

        {/* Quick Tracking Info */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "1.5rem",
            marginTop: "1.5rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "var(--background)",
            border: "1px solid var(--surface-border)",
            borderRadius: "8px",
          }}
        >
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--foreground-muted)", textTransform: "uppercase" }}>
              Tracking AWB
            </div>
            <div style={{ fontWeight: 800, fontFamily: "var(--font-heading)", fontSize: "0.85rem", color: "var(--shinra-red)" }}>
              {currentOrder?.trackingNumber || "BD-SHN-99824102-IN"}
            </div>
          </div>
          <div style={{ borderLeft: "1px solid var(--surface-border)", paddingLeft: "1.5rem" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--foreground-muted)", textTransform: "uppercase" }}>
              Est. Doorstep Arrival
            </div>
            <div style={{ fontWeight: 800, fontFamily: "var(--font-heading)", fontSize: "0.85rem" }}>
              {currentOrder?.estimatedDelivery || "4-5 Business Days"}
            </div>
          </div>
        </div>
      </div>

      {/* Production & Shipment Stepper */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "12px",
          padding: "1.75rem",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1.25rem" }}>
          FULFILLMENT STATUS
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", position: "relative" }}>
          {[
            { step: "1", title: "Order Confirmed", desc: "Payment verified", done: true },
            { step: "2", title: "UV Armor Printing", desc: "Quality inspection", done: true },
            { step: "3", title: "Dispatched", desc: "Handover to Bluedart", done: false },
            { step: "4", title: "Delivered", desc: "At your doorstep", done: false },
          ].map((s, idx) => (
            <div key={s.step} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: s.done ? "var(--shinra-red)" : "var(--background)",
                  border: s.done ? "none" : "2px solid var(--surface-border)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px auto",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  boxShadow: s.done ? "0 0 15px var(--shinra-red-glow)" : "none",
                }}
              >
                {s.done ? "✓" : s.step}
              </div>
              <div style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", color: s.done ? "#ffffff" : "var(--foreground-muted)" }}>
                {s.title}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Items & Shipping Details */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        {/* Ordered items */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "12px",
            padding: "1.5rem",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1rem" }}>
            Items in Order
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {currentOrder?.items.map((i) => (
              <div key={i.id} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ position: "relative", width: "48px", height: "64px", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                  <Image src={i.image} alt={i.productName} fill sizes="48px" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{i.productName}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)" }}>
                    Format: {i.format} {i.phoneModel ? `(${i.phoneModel})` : ""} • Qty: {i.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>
                  ₹{i.price * i.quantity}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--surface-border)", marginTop: "1.25rem", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", fontWeight: 900, fontFamily: "var(--font-heading)", fontSize: "1.1rem" }}>
            <span>Total Paid</span>
            <span style={{ color: "var(--shinra-red)" }}>₹{currentOrder?.total}</span>
          </div>
        </div>

        {/* Shipping address recap */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "12px",
            padding: "1.5rem",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1rem" }}>
            Shipping & Payment
          </h3>

          <div style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>
            <div style={{ color: "#ffffff", fontWeight: 700 }}>{currentOrder?.shipping.fullName}</div>
            <div>{currentOrder?.shipping.address}</div>
            <div>
              {currentOrder?.shipping.city}, {currentOrder?.shipping.state} — {currentOrder?.shipping.pincode}
            </div>
            <div>Phone: {currentOrder?.shipping.phone}</div>
          </div>

          <div style={{ borderTop: "1px solid var(--surface-border)", paddingTop: "1rem", fontSize: "0.82rem" }}>
            <div style={{ color: "var(--foreground-muted)", marginBottom: "2px" }}>Payment Method:</div>
            <div style={{ fontWeight: 700, color: "#ffffff" }}>{currentOrder?.paymentMethod}</div>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link
          href={`/track-order?id=${currentOrder?.id || orderId}`}
          style={{
            backgroundColor: "var(--shinra-red)",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "6px",
            fontFamily: "var(--font-heading)",
            fontSize: "0.85rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            boxShadow: "0 4px 15px var(--shinra-red-glow)",
          }}
        >
          Track Live Delivery →
        </Link>

        <Link
          href="/account"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "6px",
            fontFamily: "var(--font-heading)",
            fontSize: "0.85rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          View in My Account
        </Link>

        <Link
          href="/shop"
          style={{
            backgroundColor: "transparent",
            color: "var(--foreground-muted)",
            padding: "12px 24px",
            borderRadius: "6px",
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            textDecoration: "underline",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem" }}>Loading confirmation...</div>}>
          <OrderConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
