"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";

const INDIAN_STATES = [
  "Delhi NCR",
  "Maharashtra",
  "Karnataka",
  "Uttar Pradesh",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "Telangana",
  "West Bengal",
  "Haryana",
  "Kerala",
  "Punjab",
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Madhya Pradesh",
  "Odisha",
  "Uttarakhand",
  "Chandigarh",
  "Puducherry",
  "Other State / UT",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, tierDiscount, promoDiscount, promoCode, createOrder } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("upi");

  // UPI specific state
  const [upiMode, setUpiMode] = useState<"id" | "qr">("id");
  const [upiId, setUpiId] = useState("");

  // Card specific state
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // Net banking state
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // COD captcha state
  const [codCaptcha, setCodCaptcha] = useState("");
  const [generatedCaptcha, setGeneratedCaptcha] = useState("4829");

  const [validationError, setValidationError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load saved customer address from previous orders if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hachiman_customer_address");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setFormData((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      }
      // Generate a random 4-digit code for COD verification
      setGeneratedCaptcha(Math.floor(1000 + Math.random() * 9000).toString());
    } catch {
      // ignore
    }
  }, []);

  const shippingCost = shippingMethod === "express" ? 149 : subtotal >= 799 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - tierDiscount - promoDiscount + shippingCost);

  // Card number formatter
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardData({ ...cardData, number: formatted });
  };

  // Card expiry formatter
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      setCardData({ ...cardData, expiry: `${raw.slice(0, 2)}/${raw.slice(2)}` });
    } else {
      setCardData({ ...cardData, expiry: raw });
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validate shipping fields
    if (!formData.fullName.trim()) {
      setValidationError("Please enter your Full Name.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setValidationError("Please enter a valid 10-digit mobile phone number.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setValidationError("Please enter a valid email address for order & tracking updates.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }
    if (!formData.address.trim()) {
      setValidationError("Please enter your complete Street Address, House/Flat No.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }
    if (!formData.city.trim()) {
      setValidationError("Please enter your City.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.replace(/\D/g, "").length !== 6) {
      setValidationError("Please enter a valid 6-digit Indian PIN Code.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }

    // Validate Payment specific inputs
    if (paymentMethod === "upi" && upiMode === "id") {
      if (!upiId.trim() || !upiId.includes("@")) {
        setValidationError("Please enter a valid UPI ID (e.g. mobile@paytm or name@okhdfcbank).");
        return;
      }
    }

    if (paymentMethod === "card") {
      const cleanCard = cardData.number.replace(/\s/g, "");
      if (cleanCard.length < 15) {
        setValidationError("Please enter a valid 16-digit debit or credit card number.");
        return;
      }
      if (!cardData.name.trim()) {
        setValidationError("Please enter the name printed on your card.");
        return;
      }
      if (cardData.expiry.length < 5) {
        setValidationError("Please enter card expiry date (MM/YY).");
        return;
      }
      if (cardData.cvv.replace(/\D/g, "").length < 3) {
        setValidationError("Please enter 3-digit CVV from behind your card.");
        return;
      }
    }

    if (paymentMethod === "cod") {
      if (codCaptcha.trim() !== generatedCaptcha) {
        setValidationError(`Invalid COD security code. Please type "${generatedCaptcha}" to confirm.`);
        return;
      }
    }

    setIsProcessing(true);

    // Persist address to localStorage for future visits
    try {
      localStorage.setItem("hachiman_customer_address", JSON.stringify(formData));
    } catch {
      // ignore
    }

    setTimeout(() => {
      // Create order records
      const orderItems =
        cart.length > 0
          ? cart.map((i) => ({
              id: `item-${Date.now()}-${Math.random()}`,
              productName: i.product.name,
              format: i.format,
              phoneModel: i.phoneModel,
              price: i.product.price,
              quantity: i.quantity,
              image: i.customDesignPreview || i.product.image,
            }))
          : [
              {
                id: "sample-item",
                productName: "Luffy (Gear 5) Armor Case",
                format: "Ultra Impact MagSafe",
                phoneModel: "iPhone 16 Pro Max",
                price: 599,
                quantity: 1,
                image: "/showcase/case-1.jpg",
              },
            ];

      const paymentLabel =
        paymentMethod === "upi"
          ? `Instant UPI (${upiMode === "qr" ? "QR Code Scan" : upiId})`
          : paymentMethod === "card"
          ? `Card (•••• ${cardData.number.replace(/\s/g, "").slice(-4) || "8842"})`
          : paymentMethod === "netbanking"
          ? `Net Banking (${selectedBank})`
          : "Cash on Delivery (Verified)";

      const newOrder = createOrder({
        items: orderItems,
        subtotal: subtotal || 599,
        discount: tierDiscount + promoDiscount,
        total: finalTotal || 599,
        shipping: {
          fullName: formData.fullName,
          phone: `+91 ${formData.phone.replace(/\D/g, "")}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: paymentLabel,
      });

      setIsProcessing(false);
      router.push(`/order-confirmation?orderId=${newOrder.id}`);
    }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--background)" }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: "5rem" }}>
        {/* Banner */}
        <section
          style={{
            backgroundColor: "var(--surface)",
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
              <Link href="/" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                Home
              </Link>
              <span>/</span>
              <Link href="/cart" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                Cart
              </Link>
              <span>/</span>
              <span style={{ color: "var(--shinra-red)", fontWeight: 700 }}>Checkout</span>
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
              DELIVERY ADDRESS & PAYMENT
            </h1>
            <p style={{ color: "var(--foreground-muted)", fontSize: "0.88rem", marginTop: "4px" }}>
              Provide your delivery address and choose your preferred payment method below.
            </p>
          </div>
        </section>

        <section className="container" style={{ marginTop: "2.5rem" }}>
          {/* Validation Alert */}
          {validationError && (
            <div
              style={{
                backgroundColor: "rgba(229, 9, 20, 0.15)",
                border: "1px solid var(--shinra-red)",
                color: "#ff8b8b",
                padding: "14px 18px",
                borderRadius: "8px",
                marginBottom: "2rem",
                fontWeight: 700,
                fontSize: "0.88rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>⚠️</span>
              <span>{validationError}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmitOrder}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2.5rem",
              alignItems: "start",
            }}
          >
            {/* Left Column: Delivery Address & Payment */}
            <div>
              {/* STEP 1: Delivery Address */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "var(--shinra-red)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      fontWeight: 900,
                    }}
                  >
                    1
                  </span>
                  <div>
                    <h2
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.15rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                      }}
                    >
                      SHIPPING ADDRESS (PAN-INDIA)
                    </h2>
                    <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>
                      Where should we deliver your phone case?
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.1rem" }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--foreground-muted)",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        color: "var(--foreground)",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--foreground-muted)",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Mobile Phone (for SMS tracking) *
                    </label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          backgroundColor: "var(--surface-raised)",
                          border: "1px solid var(--surface-border)",
                          borderRight: "none",
                          borderTopLeftRadius: "8px",
                          borderBottomLeftRadius: "8px",
                          padding: "12px 12px",
                          color: "var(--foreground-muted)",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                        }}
                      >
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                        style={{
                          flex: 1,
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--surface-border)",
                          borderTopRightRadius: "8px",
                          borderBottomRightRadius: "8px",
                          padding: "12px 14px",
                          color: "var(--foreground)",
                          fontSize: "0.9rem",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--foreground-muted)",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Email Address (for Invoice) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        color: "var(--foreground)",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--foreground-muted)",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Street Address / House No. / Flat / Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 302, Sai Residency, Near Metro Station, Sector 14"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        color: "var(--foreground)",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--foreground-muted)",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      City / Town *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai / Bengaluru"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        color: "var(--foreground)",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--foreground-muted)",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      State / Union Territory *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        color: "var(--foreground)",
                        fontSize: "0.88rem",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st} style={{ backgroundColor: "#111114", color: "#fff" }}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--foreground-muted)",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      PIN Code (Pan-India) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="6-digit PIN code"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        color: "var(--foreground)",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2: Delivery Speed */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "var(--shinra-red)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      fontWeight: 900,
                    }}
                  >
                    2
                  </span>
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    SHIPPING SPEED
                  </h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1.1rem",
                      border:
                        shippingMethod === "standard"
                          ? "1.5px solid var(--shinra-red)"
                          : "1px solid var(--surface-border)",
                      backgroundColor:
                        shippingMethod === "standard" ? "rgba(229,9,20,0.08)" : "var(--background)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        style={{ accentColor: "var(--shinra-red)", width: "18px", height: "18px" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>Standard Surface Delivery</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>
                          Estimated 4-6 business days pan-India
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: "0.9rem",
                        color: subtotal >= 799 ? "#22c55e" : "var(--foreground)",
                      }}
                    >
                      {subtotal >= 799 ? "FREE" : "₹99"}
                    </span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1.1rem",
                      border:
                        shippingMethod === "express"
                          ? "1.5px solid var(--shinra-red)"
                          : "1px solid var(--surface-border)",
                      backgroundColor:
                        shippingMethod === "express" ? "rgba(229,9,20,0.08)" : "var(--background)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        style={{ accentColor: "var(--shinra-red)", width: "18px", height: "18px" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>⚡ Bluedart Priority Air Express</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>
                          Dispatched in 24 hours • 2-3 business days delivery
                        </div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: "0.9rem" }}>₹149</span>
                  </label>
                </div>
              </div>

              {/* STEP 3: Payment Gateway & Method */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "var(--shinra-red)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      fontWeight: 900,
                    }}
                  >
                    3
                  </span>
                  <div>
                    <h2
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.15rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      PAYMENT METHOD
                    </h2>
                    <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>
                      100% Safe & 256-bit Encrypted Checkout
                    </div>
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {/* OPTION 1: UPI */}
                  <div
                    style={{
                      border:
                        paymentMethod === "upi"
                          ? "1.5px solid var(--shinra-red)"
                          : "1px solid var(--surface-border)",
                      backgroundColor:
                        paymentMethod === "upi" ? "rgba(229,9,20,0.06)" : "var(--background)",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <label
                      onClick={() => setPaymentMethod("upi")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1.1rem",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "upi"}
                          onChange={() => setPaymentMethod("upi")}
                          style={{ accentColor: "var(--shinra-red)", width: "18px", height: "18px" }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>Instant UPI / QR Code</span>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                backgroundColor: "rgba(34, 197, 94, 0.15)",
                                color: "#22c55e",
                                fontWeight: 800,
                                padding: "2px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              FASTEST
                            </span>
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                            Google Pay, PhonePe, Paytm, BHIM, Cred UPI
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span style={{ fontSize: "1.3rem" }}>📱</span>
                      </div>
                    </label>

                    {paymentMethod === "upi" && (
                      <div
                        style={{
                          padding: "1rem 1.25rem 1.25rem",
                          borderTop: "1px solid var(--surface-border)",
                          backgroundColor: "#0d0d10",
                        }}
                      >
                        <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                          <button
                            type="button"
                            onClick={() => setUpiMode("id")}
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              borderRadius: "6px",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              border: upiMode === "id" ? "1px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                              backgroundColor: upiMode === "id" ? "var(--shinra-red)" : "var(--surface)",
                              color: "#ffffff",
                              cursor: "pointer",
                            }}
                          >
                            Enter UPI ID / VPA
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpiMode("qr")}
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              borderRadius: "6px",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              border: upiMode === "qr" ? "1px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                              backgroundColor: upiMode === "qr" ? "var(--shinra-red)" : "var(--surface)",
                              color: "#ffffff",
                              cursor: "pointer",
                            }}
                          >
                            Scan Dynamic QR Code
                          </button>
                        </div>

                        {upiMode === "id" ? (
                          <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", display: "block", marginBottom: "6px" }}>
                              Your UPI ID (e.g. mobile@paytm, user@oksbi)
                            </label>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <input
                                type="text"
                                placeholder="9876543210@paytm"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                style={{
                                  flex: 1,
                                  backgroundColor: "var(--background)",
                                  border: "1px solid var(--surface-border)",
                                  borderRadius: "6px",
                                  padding: "10px 14px",
                                  color: "var(--foreground)",
                                  fontSize: "0.88rem",
                                  outline: "none",
                                }}
                              />
                            </div>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                              {["@okhdfcbank", "@okicici", "@oksbi", "@paytm", "@apl", "@ybl"].map((handle) => (
                                <button
                                  key={handle}
                                  type="button"
                                  onClick={() => {
                                    const base = upiId.split("@")[0] || "user";
                                    setUpiId(`${base}${handle}`);
                                  }}
                                  style={{
                                    backgroundColor: "var(--surface-raised)",
                                    border: "1px solid var(--surface-border)",
                                    borderRadius: "4px",
                                    padding: "3px 8px",
                                    fontSize: "0.7rem",
                                    color: "var(--foreground-muted)",
                                    cursor: "pointer",
                                  }}
                                >
                                  {handle}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div style={{ textAlign: "center", padding: "10px 0" }}>
                            <div
                              style={{
                                display: "inline-block",
                                backgroundColor: "#ffffff",
                                padding: "16px",
                                borderRadius: "12px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                              }}
                            >
                              <div
                                style={{
                                  width: "160px",
                                  height: "160px",
                                  backgroundColor: "#000",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#fff",
                                  flexDirection: "column",
                                  position: "relative",
                                  overflow: "hidden",
                                }}
                              >
                                <svg width="130" height="130" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5">
                                  <rect x="2" y="2" width="8" height="8" rx="1" fill="#fff" />
                                  <rect x="14" y="2" width="8" height="8" rx="1" fill="#fff" />
                                  <rect x="2" y="14" width="8" height="8" rx="1" fill="#fff" />
                                  <rect x="5" y="5" width="2" height="2" fill="#000" />
                                  <rect x="17" y="5" width="2" height="2" fill="#000" />
                                  <rect x="5" y="17" width="2" height="2" fill="#000" />
                                  <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h4v4h-4zM10 10h4v4h-4z" fill="#fff" />
                                </svg>
                                <div
                                  style={{
                                    position: "absolute",
                                    backgroundColor: "var(--shinra-red)",
                                    color: "#fff",
                                    fontSize: "0.62rem",
                                    fontWeight: 900,
                                    padding: "2px 6px",
                                    borderRadius: "3px",
                                  }}
                                >
                                  HACHIMAN
                                </div>
                              </div>
                              <div style={{ color: "#000000", fontWeight: 900, fontSize: "0.95rem", marginTop: "8px" }}>
                                ₹{finalTotal}
                              </div>
                              <div style={{ color: "#666", fontSize: "0.68rem", fontWeight: 700 }}>
                                Scan with any UPI app to pay
                              </div>
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "#22c55e", fontWeight: 700, marginTop: "8px" }}>
                              ✓ Dynamic UPI verified for Hachiman India Merchant
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* OPTION 2: Debit / Credit Card */}
                  <div
                    style={{
                      border:
                        paymentMethod === "card"
                          ? "1.5px solid var(--shinra-red)"
                          : "1px solid var(--surface-border)",
                      backgroundColor:
                        paymentMethod === "card" ? "rgba(229,9,20,0.06)" : "var(--background)",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <label
                      onClick={() => setPaymentMethod("card")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1.1rem",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          style={{ accentColor: "var(--shinra-red)", width: "18px", height: "18px" }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "0.92rem" }}>Credit / Debit Cards</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                            Visa, Mastercard, RuPay, American Express
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span style={{ fontSize: "1.3rem" }}>💳</span>
                      </div>
                    </label>

                    {paymentMethod === "card" && (
                      <div
                        style={{
                          padding: "1rem 1.25rem 1.25rem",
                          borderTop: "1px solid var(--surface-border)",
                          backgroundColor: "#0d0d10",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.85rem",
                        }}
                      >
                        <div>
                          <label style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", display: "block", marginBottom: "4px" }}>
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="4532 8920 1142 8842"
                            value={cardData.number}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            style={{
                              width: "100%",
                              backgroundColor: "var(--background)",
                              border: "1px solid var(--surface-border)",
                              borderRadius: "6px",
                              padding: "10px 14px",
                              color: "var(--foreground)",
                              fontSize: "0.9rem",
                              letterSpacing: "0.08em",
                              outline: "none",
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", display: "block", marginBottom: "4px" }}>
                            Name on Card
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Rahul Sharma"
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                            style={{
                              width: "100%",
                              backgroundColor: "var(--background)",
                              border: "1px solid var(--surface-border)",
                              borderRadius: "6px",
                              padding: "10px 14px",
                              color: "var(--foreground)",
                              fontSize: "0.88rem",
                              outline: "none",
                            }}
                          />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", display: "block", marginBottom: "4px" }}>
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              maxLength={5}
                              placeholder="MM/YY"
                              value={cardData.expiry}
                              onChange={(e) => handleExpiryChange(e.target.value)}
                              style={{
                                width: "100%",
                                backgroundColor: "var(--background)",
                                border: "1px solid var(--surface-border)",
                                borderRadius: "6px",
                                padding: "10px 14px",
                                color: "var(--foreground)",
                                fontSize: "0.88rem",
                                outline: "none",
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", display: "block", marginBottom: "4px" }}>
                              CVV / Security Code
                            </label>
                            <input
                              type="password"
                              maxLength={4}
                              placeholder="•••"
                              value={cardData.cvv}
                              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "") })}
                              style={{
                                width: "100%",
                                backgroundColor: "var(--background)",
                                border: "1px solid var(--surface-border)",
                                borderRadius: "6px",
                                padding: "10px 14px",
                                color: "var(--foreground)",
                                fontSize: "0.88rem",
                                outline: "none",
                              }}
                            />
                          </div>
                        </div>

                        <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>🔒 256-bit PCI-DSS Bank Grade Security</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OPTION 3: Net Banking */}
                  <div
                    style={{
                      border:
                        paymentMethod === "netbanking"
                          ? "1.5px solid var(--shinra-red)"
                          : "1px solid var(--surface-border)",
                      backgroundColor:
                        paymentMethod === "netbanking" ? "rgba(229,9,20,0.06)" : "var(--background)",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <label
                      onClick={() => setPaymentMethod("netbanking")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1.1rem",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "netbanking"}
                          onChange={() => setPaymentMethod("netbanking")}
                          style={{ accentColor: "var(--shinra-red)", width: "18px", height: "18px" }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "0.92rem" }}>Net Banking</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                            All Indian major banks supported
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: "1.3rem" }}>🏦</span>
                    </label>

                    {paymentMethod === "netbanking" && (
                      <div
                        style={{
                          padding: "1rem 1.25rem 1.25rem",
                          borderTop: "1px solid var(--surface-border)",
                          backgroundColor: "#0d0d10",
                        }}
                      >
                        <label style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", display: "block", marginBottom: "8px" }}>
                          Choose Your Bank
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                          {["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank", "Kotak Bank", "PNB"].map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => setSelectedBank(bank)}
                              style={{
                                padding: "8px 6px",
                                borderRadius: "6px",
                                fontSize: "0.76rem",
                                fontWeight: 700,
                                border:
                                  selectedBank === bank
                                    ? "1px solid var(--shinra-red)"
                                    : "1px solid var(--surface-border)",
                                backgroundColor:
                                  selectedBank === bank ? "rgba(229, 9, 20, 0.15)" : "var(--surface)",
                                color: selectedBank === bank ? "var(--shinra-red)" : "var(--foreground)",
                                cursor: "pointer",
                              }}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OPTION 4: Cash on Delivery (COD) */}
                  <div
                    style={{
                      border:
                        paymentMethod === "cod"
                          ? "1.5px solid var(--shinra-red)"
                          : "1px solid var(--surface-border)",
                      backgroundColor:
                        paymentMethod === "cod" ? "rgba(229,9,20,0.06)" : "var(--background)",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <label
                      onClick={() => setPaymentMethod("cod")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1.1rem",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          style={{ accentColor: "var(--shinra-red)", width: "18px", height: "18px" }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "0.92rem" }}>Cash on Delivery (COD)</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                            Pay at your doorstep via Cash or any UPI QR upon arrival
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: "1.3rem" }}>💵</span>
                    </label>

                    {paymentMethod === "cod" && (
                      <div
                        style={{
                          padding: "1rem 1.25rem 1.25rem",
                          borderTop: "1px solid var(--surface-border)",
                          backgroundColor: "#0d0d10",
                        }}
                      >
                        <div style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", marginBottom: "10px" }}>
                          To confirm your delivery intent, please enter the 4-digit code shown below:
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              backgroundColor: "#222",
                              border: "1px dashed #555",
                              color: "#22c55e",
                              fontWeight: 900,
                              fontSize: "1.1rem",
                              letterSpacing: "0.3em",
                              padding: "8px 16px",
                              borderRadius: "6px",
                              userSelect: "none",
                            }}
                          >
                            {generatedCaptcha}
                          </div>
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="Enter 4-digit code"
                            value={codCaptcha}
                            onChange={(e) => setCodCaptcha(e.target.value)}
                            style={{
                              width: "160px",
                              backgroundColor: "var(--background)",
                              border: "1px solid var(--surface-border)",
                              borderRadius: "6px",
                              padding: "9px 12px",
                              color: "var(--foreground)",
                              fontSize: "0.9rem",
                              outline: "none",
                              textAlign: "center",
                              fontWeight: 700,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Order Summary */}
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

              {/* Items List */}
              <div
                style={{
                  maxHeight: "260px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                  marginBottom: "1.25rem",
                  paddingRight: "4px",
                }}
              >
                {cart.length > 0 ? (
                  cart.map((i) => (
                    <div
                      key={`${i.product.id}-${i.format}-${i.phoneModel || ""}`}
                      style={{ display: "flex", gap: "10px", alignItems: "center" }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "46px",
                          height: "60px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          flexShrink: 0,
                          backgroundColor: "#000",
                        }}
                      >
                        <Image
                          src={i.customDesignPreview || i.product.image}
                          alt={i.product.name}
                          fill
                          sizes="46px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {i.product.name}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                          Qty: {i.quantity} • {i.format}
                        </div>
                        {i.phoneModel && (
                          <div style={{ fontSize: "0.7rem", color: "var(--shinra-red)", fontWeight: 700 }}>
                            📱 {i.phoneModel}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 800 }}>
                        ₹{i.product.price * i.quantity}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "var(--background)",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", marginBottom: "8px" }}>
                      No items in cart right now.
                    </div>
                    <Link
                      href="/shop"
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--shinra-red)",
                        fontWeight: 700,
                        textDecoration: "underline",
                      }}
                    >
                      Browse Anime Covers →
                    </Link>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                  borderTop: "1px solid var(--surface-border)",
                  paddingTop: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--foreground-muted)" }}>
                  <span>Items Subtotal</span>
                  <span style={{ color: "var(--foreground)", fontWeight: 700 }}>₹{subtotal || (cart.length > 0 ? subtotal : 0)}</span>
                </div>
                {tierDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#22c55e" }}>
                    <span>Bundle Discount</span>
                    <span style={{ fontWeight: 800 }}>-₹{tierDiscount}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#22c55e" }}>
                    <span>Coupon ({promoCode})</span>
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  borderTop: "1px solid var(--surface-border)",
                  paddingTop: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800 }}>
                  TOTAL PAYABLE
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.8rem",
                    fontWeight: 900,
                    color: "var(--shinra-red)",
                  }}
                >
                  ₹{finalTotal || 0}
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing || (cart.length === 0 && subtotal === 0)}
                style={{
                  width: "100%",
                  backgroundColor: "var(--shinra-red)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "16px",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.95rem",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: isProcessing || (cart.length === 0 && subtotal === 0) ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 25px var(--shinra-red-glow)",
                  opacity: isProcessing || (cart.length === 0 && subtotal === 0) ? 0.7 : 1,
                  transition: "all 0.2s",
                }}
              >
                {isProcessing ? "Authorizing Order & Payment..." : `Confirm & Place Order (₹${finalTotal || 0}) →`}
              </button>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.72rem",
                  color: "var(--foreground-muted)",
                  marginTop: "1.25rem",
                  textAlign: "center",
                }}
              >
                <span>🛡️ 100% Secure Checkout • 7-Day Replacement Guarantee</span>
                <span>📦 Dispatched from Hachiman Armory, India</span>
              </div>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
