"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

interface EndpointDef {
  method: "GET" | "POST";
  path: string;
  title: string;
  desc: string;
  params?: { name: string; type: string; desc: string }[];
  exampleResponse: object;
}

const ENDPOINTS: EndpointDef[] = [
  {
    method: "GET",
    path: "/api/products",
    title: "Catalog & Case Models",
    desc: "Fetch all phone armor cases with franchise tags, compatible models, prices, and drop ratings.",
    params: [
      { name: "franchise", type: "string", desc: "Filter by franchise (e.g. One Piece, Jujutsu Kaisen, Berserk)" },
      { name: "limit", type: "number", desc: "Max items returned (default: all)" },
    ],
    exampleResponse: {
      success: true,
      total: 12,
      caseTypes: [
        { id: "magsafe-ultra", name: "Ultra Impact MagSafe", specs: "12ft Drop Tested • N52 Array", basePrice: 799 },
        { id: "tough-armor", name: "Tough Armor Dual-Layer", specs: "Dual-layer TPU + PC", basePrice: 599 },
      ],
      data: [
        {
          id: "luffy-gear5-case",
          name: "Luffy (Gear 5) Sun God Nika Case",
          franchise: "One Piece",
          price: 799,
          dropProtection: "12ft Mil-Spec",
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/health",
    title: "System Status & Health",
    desc: "Retrieve real-time infrastructure latency, active subsystems, and commerce engine status.",
    exampleResponse: {
      status: "healthy",
      uptime: "99.99%",
      service: "HACHIMAN Phone Armor Commerce API",
      version: "v1.4.2",
      region: "ap-south-1 (Mumbai)",
    },
  },
  {
    method: "POST",
    path: "/api/checkout",
    title: "Process Case Orders",
    desc: "Create new verified phone case order with phone model, finish type, customer address, and Razorpay/UPI intent.",
    params: [
      { name: "items", type: "CartItem[]", desc: "Array of selected cases, models, and quantities" },
      { name: "shipping", type: "object", desc: "Delivery address, city, pincode, and phone number" },
      { name: "promoCode", type: "string", desc: "Optional discount code (e.g. HACHIMAN)" },
    ],
    exampleResponse: {
      success: true,
      orderId: "HCH-88291",
      status: "CONFIRMED",
      estimatedDelivery: "2-4 Business Days",
      trackingUrl: "/track-order?id=HCH-88291",
    },
  },
];

export default function ApiPage() {
  const [activeEndpoint, setActiveEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [liveOutput, setLiveOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const testEndpoint = async (path: string) => {
    setLoading(true);
    try {
      const res = await fetch(path);
      const data = await res.json();
      setLiveOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setLiveOutput(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const curlExample = `curl -X ${activeEndpoint.method} "https://hachiman.in${activeEndpoint.path}" \\
  -H "Accept: application/json"`;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>
      <Navbar />

      <main style={{ padding: "3rem 0 5rem" }}>
        <div className="container">
          {/* Header Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(236, 72, 153, 0.08))",
              border: "1px solid rgba(124, 58, 237, 0.25)",
              borderRadius: "16px",
              padding: "2.5rem 2rem",
              marginBottom: "3rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span
                    style={{
                      background: "var(--main-accent)",
                      color: "#ffffff",
                      fontSize: "0.7rem",
                      fontWeight: 900,
                      letterSpacing: "0.15em",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      textTransform: "uppercase",
                    }}
                  >
                    HACHIMAN CORE API v1.4
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#10b981",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                    All Systems Operational
                  </span>
                </div>
                <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: "0.5rem" }}>
                  Developer REST API & Integrations
                </h1>
                <p style={{ color: "var(--foreground-muted)", maxWidth: "680px", fontSize: "0.95rem" }}>
                  Access real-time phone case inventory, anime drop collections, MagSafe armor specs, order tracking, and custom 3D build configurations directly via JSON REST APIs.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link
                  href="/track-order"
                  className="hachiman-btn hachiman-btn-ghost"
                  style={{ fontSize: "0.78rem", padding: "0.65rem 1.2rem" }}
                >
                  📦 Track Order
                </Link>
                <Link
                  href="/admin"
                  className="hachiman-btn hachiman-btn-primary"
                  style={{ fontSize: "0.78rem", padding: "0.65rem 1.2rem" }}
                >
                  🛡️ Admin Ops Console
                </Link>
              </div>
            </div>
          </div>

          {/* Endpoints Workspace */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            {/* Left: Endpoint List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                AVAILABLE ENDPOINTS
              </h2>

              {ENDPOINTS.map((ep) => {
                const isActive = activeEndpoint.path === ep.path;
                return (
                  <button
                    key={ep.path}
                    onClick={() => {
                      setActiveEndpoint(ep);
                      setLiveOutput(null);
                    }}
                    style={{
                      textAlign: "left",
                      backgroundColor: isActive ? "var(--surface)" : "transparent",
                      border: isActive ? "1.5px solid var(--main-accent)" : "1px solid var(--surface-border)",
                      borderRadius: "12px",
                      padding: "1.2rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: isActive ? "0 8px 24px rgba(124, 58, 237, 0.12)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <span
                        style={{
                          backgroundColor: ep.method === "GET" ? "rgba(16, 185, 129, 0.15)" : "rgba(124, 58, 237, 0.15)",
                          color: ep.method === "GET" ? "#059669" : "var(--main-accent)",
                          fontWeight: 900,
                          fontSize: "0.72rem",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {ep.method}
                      </span>
                      <code style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--foreground)" }}>{ep.path}</code>
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>
                      {ep.title}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", lineHeight: 1.4 }}>
                      {ep.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Endpoint Details & Live Runner */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
                <div>
                  <span
                    style={{
                      backgroundColor: activeEndpoint.method === "GET" ? "rgba(16, 185, 129, 0.15)" : "rgba(124, 58, 237, 0.15)",
                      color: activeEndpoint.method === "GET" ? "#059669" : "var(--main-accent)",
                      fontWeight: 900,
                      fontSize: "0.75rem",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      marginRight: "8px",
                    }}
                  >
                    {activeEndpoint.method}
                  </span>
                  <code style={{ fontSize: "1.1rem", fontWeight: 800 }}>{activeEndpoint.path}</code>
                </div>

                {activeEndpoint.method === "GET" && (
                  <button
                    onClick={() => testEndpoint(activeEndpoint.path)}
                    disabled={loading}
                    className="hachiman-btn hachiman-btn-primary"
                    style={{ fontSize: "0.75rem", padding: "0.5rem 1rem" }}
                  >
                    {loading ? "Running..." : "⚡ Send Request"}
                  </button>
                )}
              </div>

              <p style={{ color: "var(--foreground-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
                {activeEndpoint.desc}
              </p>

              {/* cURL snippet */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-muted)" }}>
                    cURL Command
                  </span>
                  <button
                    onClick={() => copySnippet(curlExample)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--main-accent)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {copied ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <pre
                  style={{
                    backgroundColor: "#111115",
                    color: "#f3f4f6",
                    padding: "1rem",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    overflowX: "auto",
                    fontFamily: "monospace",
                  }}
                >
                  {curlExample}
                </pre>
              </div>

              {/* Response Preview */}
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-muted)", display: "block", marginBottom: "6px" }}>
                  {liveOutput ? "Live Response (Status: 200 OK)" : "Schema / Example Response"}
                </span>
                <pre
                  style={{
                    backgroundColor: "#111115",
                    color: liveOutput ? "#34d399" : "#93c5fd",
                    padding: "1.2rem",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    maxHeight: "380px",
                    overflowY: "auto",
                    fontFamily: "monospace",
                    lineHeight: 1.4,
                  }}
                >
                  {liveOutput || JSON.stringify(activeEndpoint.exampleResponse, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
