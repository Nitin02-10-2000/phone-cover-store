"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import { useCart } from "@/lib/cartContext";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { orders } = useCart();
  const initialId = searchParams.get("id") || (orders[0]?.id ?? "");

  const [searchOrderId, setSearchOrderId] = useState(initialId);
  const [searchedId, setSearchedId] = useState(initialId);

  const matchedOrder = orders.find(
    (o) => o.id.toLowerCase() === searchedId.trim().toLowerCase()
  ) || (searchedId ? undefined : orders[0]);

  const milestones = [
    {
      title: "Order Placed & Verified",
      date: "Sep 06, 2026 • 02:45 PM",
      location: "Case Tadka Hub, Bengaluru",
      completed: true,
      desc: "Payment authorized via 256-bit SSL gateway. Order queued for made-to-order device precision molding.",
    },
    {
      title: "UV-Cured Armor Printing",
      date: "Sep 07, 2026 • 11:20 AM",
      location: "Case Tadka Print Lab, Bengaluru",
      completed: true,
      desc: "Japanese UV DTF inks bonded directly into the shock armor substrate with scratch-proof hard coat. Precision color-calibrated.",
    },
    {
      title: "QC Inspection & Shockproof Packaging",
      date: "Sep 07, 2026 • 04:30 PM",
      location: "Fulfillment Bay 2",
      completed: true,
      desc: "1.8mm camera ring tolerance tested, tactile click responsiveness verified, and sealed in shockproof Case Tadka box.",
    },
    {
      title: "Dispatched with Courier Partner",
      date: "Sep 08, 2026 • 09:15 AM",
      location: "Bluedart Air Hub, Kempegowda Intl",
      completed: matchedOrder?.status === "SHIPPED" || matchedOrder?.status === "DELIVERED",
      desc: `Manifested with Bluedart Air under AWB #${matchedOrder?.trackingNumber || "BD-TADKA-99824102-IN"}. In transit to destination city.`,
    },
    {
      title: "Out for Doorstep Delivery",
      date: matchedOrder?.status === "DELIVERED" ? "Aug 31, 2026 • 10:30 AM" : "Expected in 2 Days",
      location: `${matchedOrder?.shipping?.city || "Bengaluru"} Local Hub`,
      completed: matchedOrder?.status === "DELIVERED",
      desc: "Assigned to delivery agent for contactless doorstep handover.",
    },
    {
      title: "Delivered to Customer",
      date: matchedOrder?.status === "DELIVERED" ? "Aug 31, 2026 • 02:15 PM" : `Estimated ${matchedOrder?.estimatedDelivery || "4-5 Business Days"}`,
      location: matchedOrder?.shipping?.city || "Bengaluru",
      completed: matchedOrder?.status === "DELIVERED",
      desc: "Package signed and received. Covered under unconditional 7-day free damage replacement.",
    },
  ];

  return (
    <div className="container" style={{ maxWidth: "850px", margin: "2.5rem auto 5rem auto" }}>
      {/* Banner */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span
          style={{
            color: "var(--shinra-red)",
            fontFamily: "var(--font-heading)",
            fontSize: "0.75rem",
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          REAL-TIME SHIPMENT TELEMETRY
        </span>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 4vw, 2.7rem)",
            fontWeight: 900,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginTop: "0.4rem",
          }}
        >
          TRACK YOUR CASE TADKA ARMOR
        </h1>
        <p style={{ color: "var(--foreground-muted)", fontSize: "0.95rem" }}>
          Track the live production, UV curing, and express courier transit of your Case Tadka order.
        </p>
      </div>

      {/* Lookup Card */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "12px",
          padding: "1.5rem 2rem",
          marginBottom: "2.5rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--foreground-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              Order ID or Tracking Number
            </label>
            <input
              type="text"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              placeholder="e.g. CATAD-12345"
              style={{
                width: "100%",
                backgroundColor: "var(--background)",
                border: "1px solid var(--surface-border)",
                color: "#ffffff",
                borderRadius: "6px",
                padding: "10px 14px",
                fontSize: "0.85rem",
                fontFamily: "var(--font-heading)",
                textTransform: "uppercase",
                outline: "none",
              }}
            />
          </div>

          <div style={{ alignSelf: "flex-end" }}>
            <button
              type="button"
              onClick={() => setSearchedId(searchOrderId)}
              style={{
                backgroundColor: "var(--shinra-red)",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 24px",
                fontFamily: "var(--font-heading)",
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 4px 15px var(--shinra-red-glow)",
              }}
            >
              Track Order
            </button>
          </div>
        </div>

        {/* Quick Recent Orders Selector */}
        {orders.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Recent Orders:
            </span>
            {orders.slice(0, 3).map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => {
                  setSearchOrderId(ord.id);
                  setSearchedId(ord.id);
                }}
                style={{
                  background: "none",
                  border: "1px solid var(--surface-border)",
                  color: "#ffffff",
                  padding: "3px 10px",
                  borderRadius: "4px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                #{ord.id} ({ord.status})
              </button>
            ))}
          </div>
        )}
      </div>

      {!matchedOrder ? (
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "12px",
            padding: "3rem 2rem",
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔍</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
            {searchedId ? `No order found for "${searchedId}"` : "Enter an Order ID to track shipment"}
          </h3>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", maxWidth: "450px", margin: "0 auto" }}>
            Order IDs start with CATAD- and are provided immediately upon order confirmation.
          </p>
        </div>
      ) : (
        <>

      {/* Order Status Overview Banner */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
        }}
      >
        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", textTransform: "uppercase" }}>
            Order ID
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 900, color: "var(--foreground)" }}>
            #{matchedOrder?.id}
          </div>
        </div>

        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", textTransform: "uppercase" }}>
            Current Status
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor:
                matchedOrder?.status === "DELIVERED"
                  ? "rgba(34, 197, 94, 0.15)"
                  : "rgba(229, 9, 20, 0.15)",
              color: matchedOrder?.status === "DELIVERED" ? "#22c55e" : "var(--shinra-red)",
              fontWeight: 800,
              fontSize: "0.8rem",
              padding: "4px 12px",
              borderRadius: "4px",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: matchedOrder?.status === "DELIVERED" ? "#22c55e" : "var(--shinra-red)",
              }}
            />
            <span>{matchedOrder?.status}</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", textTransform: "uppercase" }}>
            Courier Partner
          </div>
          <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>
            Bluedart Priority Air
          </div>
        </div>

        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", textTransform: "uppercase" }}>
            Estimated Arrival
          </div>
          <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "#fbbf24" }}>
            {matchedOrder?.estimatedDelivery}
          </div>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "12px",
          padding: "2rem",
          marginBottom: "2.5rem",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1.75rem" }}>
          SHIPMENT MILESTONES & DISPATCH LOG
        </h2>

        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          {milestones.map((m, idx) => (
            <div
              key={m.title}
              style={{
                display: "flex",
                gap: "1.5rem",
                position: "relative",
                paddingBottom: idx === milestones.length - 1 ? 0 : "2rem",
              }}
            >
              {/* Connector line */}
              {idx < milestones.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "32px",
                    left: "15px",
                    bottom: 0,
                    width: "2px",
                    backgroundColor: m.completed ? "var(--shinra-red)" : "var(--surface-border)",
                  }}
                />
              )}

              {/* Dot icon */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: m.completed ? "var(--shinra-red)" : "var(--background)",
                  border: m.completed ? "none" : "2px solid var(--surface-border)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "0.75rem",
                  fontWeight: 900,
                  boxShadow: m.completed ? "0 0 12px var(--shinra-red-glow)" : "none",
                  zIndex: 2,
                }}
              >
                {m.completed ? "✓" : idx + 1}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "4px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: m.completed ? "#ffffff" : "var(--foreground-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    {m.title}
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "var(--foreground-muted)" }}>
                    {m.date}
                  </span>
                </div>

                <div style={{ fontSize: "0.72rem", color: "var(--shinra-red)", fontWeight: 700, marginTop: "2px" }}>
                  📍 {m.location}
                </div>

                <p style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", lineHeight: 1.5, marginTop: "4px" }}>
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Items & Address Summary */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "12px",
          padding: "1.75rem",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1rem" }}>
          DESTINATION ADDRESS & PACKAGE ITEMS
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
              Recipient:
            </div>
            <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>{matchedOrder?.shipping.fullName}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--foreground-muted)" }}>{matchedOrder?.shipping.address}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--foreground-muted)" }}>
              {matchedOrder?.shipping.city}, {matchedOrder?.shipping.state} — {matchedOrder?.shipping.pincode}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--foreground-muted)" }}>Phone: {matchedOrder?.shipping.phone}</div>
          </div>

          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
              Package Contents ({matchedOrder?.items.length} items):
            </div>
            {matchedOrder?.items.map((it) => (
              <div key={it.id} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                <div style={{ position: "relative", width: "32px", height: "42px", borderRadius: "3px", overflow: "hidden", flexShrink: 0 }}>
                  <Image src={it.image} alt={it.productName} fill sizes="32px" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                  {it.productName} ({it.format}) × {it.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <CartDrawer />
      <SearchModal />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem" }}>Loading tracking telemetry...</div>}>
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
