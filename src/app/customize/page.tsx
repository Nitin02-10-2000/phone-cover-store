"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import { PHONE_MODELS } from "@/data/products";
import { useCart } from "@/lib/cartContext";

const PRESET_ARTWORKS = [
  {
    id: "art-1",
    name: "Akira Neo-Tokyo",
    url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788283104/mockups/akira-poster-kaneda-neo-tokyo-anime-wall-art-paper-1.jpg",
  },
  {
    id: "art-2",
    name: "Gojo Hollow Purple",
    url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786122801/mockups/gojo-satoru-honored-one-poster-paper-1.jpg",
  },
  {
    id: "art-3",
    name: "Luffy Gear 5 Awakening",
    url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787153686/mockups/luffy-gear-5-one-piece-poster-paper-5.jpg",
  },
  {
    id: "art-4",
    name: "Sukuna Malevolent Shrine",
    url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787407303/mockups/ryomen-sukuna-jujutsu-kaisen-poster-cinematic-anime-wall-art-sukuna-decor-paper-1.jpg",
  },
  {
    id: "art-5",
    name: "Sung Jinwoo Monarch",
    url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786123391/mockups/sung-jinwoo-arise-poster-paper-5.jpg",
  },
  {
    id: "art-6",
    name: "Zoro Enma",
    url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787154245/mockups/roronoa-zoro-one-piece-poster-paper-1.jpg",
  },
  {
    id: "art-7",
    name: "Tanjiro Sun Breathing",
    url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788284762/mockups/tanjiro-kamado-poster-demon-slayer-anime-wall-art-hinokami-kagura-paper-1.jpg",
  },
  {
    id: "art-8",
    name: "Itachi Tsukuyomi",
    url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788283307/mockups/itachi-uchiha-poster-naruto-anime-wall-art-crow-genjutsu-paper-1.jpg",
  },
  {
    id: "art-9",
    name: "Eren Founding Titan",
    url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788284852/mockups/eren-yeager-poster-attack-on-titan-anime-wall-art-founding-titan-paper-1.jpg",
  },
  {
    id: "art-10",
    name: "Sasuke Indra",
    url: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788284960/mockups/sasuke-uchiha-poster-naruto-anime-wall-art-rinnegan-sharingan-paper-6.jpg",
  },
];

const STICKERS = ["⚡ HACHIMAN CORPS", "👁️ HONORED ONE", "🔥 GEAR 5 NIKA", "⚔️ BERSERK BRAND", "👑 ARISE"];

export default function CustomizePage() {
  const router = useRouter();
  const { addToCart, saveDesign } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productType, setProductType] = useState<"phone_case" | "poster">("phone_case");
  const [selectedBrand, setSelectedBrand] = useState("Apple");
  const [selectedModel, setSelectedModel] = useState("iPhone 16 Pro Max");
  const [selectedArtUrl, setSelectedArtUrl] = useState(PRESET_ARTWORKS[0].url);
  const [customText, setCustomText] = useState("HACHIMAN-01");
  const [textColor, setTextColor] = useState("#ffffff");
  const [activeSticker, setActiveSticker] = useState<string | null>("⚡ HACHIMAN CORPS");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [caseFinish, setCaseFinish] = useState<"matte" | "tempered">("tempered");

  const casePrice = caseFinish === "tempered" ? 599 : 499;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedArtUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToDesigns = () => {
    saveDesign({
      title: `${selectedModel} — ${customText || "Custom Edit"}`,
      productType,
      phoneModel: selectedModel,
      previewUrl: selectedArtUrl,
      price: casePrice,
    });
    router.push("/saved-designs");
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id: `custom-${Date.now()}`,
        name: `Custom ${productType === "phone_case" ? `${selectedModel} Tough Case` : "Wall Poster"}`,
        franchise: "all",
        category: productType === "phone_case" ? "case" : "poster",
        tag: "Personalized Custom",
        price: casePrice,
        originalPrice: Math.round(casePrice * 1.5),
        rating: 5.0,
        reviewsCount: 1,
        image: selectedArtUrl,
        formats: [productType === "phone_case" ? "Tough Case" : "Paper"],
        description: `Custom artwork with text "${customText}" (${caseFinish} finish).`,
      },
      productType === "phone_case" ? "Tough Case" : "Paper",
      productType === "phone_case" ? selectedModel : undefined,
      undefined,
      selectedArtUrl
    );
  };

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
              <span style={{ color: "var(--shinra-red)" }}>Customize Studio</span>
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
              CUSTOM DESIGN LAB
            </h1>
            <p style={{ color: "var(--foreground-muted)", fontSize: "0.95rem" }}>
              Upload your own anime art, adjust camera framing, add custom typography, and print onto military-grade shockproof cases or museum posters.
            </p>
          </div>
        </section>

        {/* Studio Workspace */}
        <section className="container" style={{ marginTop: "2.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "3rem",
              alignItems: "start",
            }}
          >
            {/* Left: Interactive Canvas / Mockup */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "16px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "580px",
                position: "relative",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
            >
              {/* Phone Case Silhouette Container */}
              <div
                style={{
                  position: "relative",
                  width: productType === "phone_case" ? "270px" : "320px",
                  height: productType === "phone_case" ? "540px" : "460px",
                  borderRadius: productType === "phone_case" ? "42px" : "8px",
                  border: productType === "phone_case" ? "10px solid #1a1a1f" : "12px solid #111113",
                  overflow: "hidden",
                  boxShadow:
                    productType === "phone_case"
                      ? "0 0 0 2px #2d2d35, 0 25px 50px rgba(0,0,0,0.9), 0 0 30px rgba(229,9,20,0.15)"
                      : "0 25px 50px rgba(0,0,0,0.9)",
                  backgroundColor: "#050507",
                }}
              >
                {/* Background Image with Zoom */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${selectedArtUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transform: `scale(${zoomLevel / 100})`,
                    transition: "transform 0.15s ease",
                    zIndex: 1,
                  }}
                />

                {/* Glass / Finish Gradient Overlay */}
                {caseFinish === "tempered" && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.3) 100%)",
                      pointerEvents: "none",
                      zIndex: 3,
                    }}
                  />
                )}

                {/* Camera Cutout for Phone Cases */}
                {productType === "phone_case" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      width: "80px",
                      height: "85px",
                      borderRadius: "22px",
                      backgroundColor: "rgba(10, 10, 14, 0.95)",
                      border: "2px solid #2d2d35",
                      zIndex: 10,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-around",
                      padding: "8px 0",
                    }}
                  >
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#000000", border: "2px solid #3d3d48" }} />
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#000000", border: "2px solid #3d3d48" }} />
                  </div>
                )}

                {/* Custom Overlay Typography */}
                {customText && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: productType === "phone_case" ? "32px" : "20px",
                      left: "20px",
                      right: "20px",
                      textAlign: "center",
                      color: textColor,
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem",
                      fontWeight: 900,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                      zIndex: 10,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {customText}
                  </div>
                )}

                {/* Sticker Badge Overlay */}
                {activeSticker && (
                  <div
                    style={{
                      position: "absolute",
                      top: productType === "phone_case" ? "120px" : "20px",
                      right: "16px",
                      zIndex: 10,
                      backgroundColor: "var(--shinra-red)",
                      color: "#ffffff",
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.68rem",
                      fontWeight: 900,
                      padding: "4px 8px",
                      borderRadius: "3px",
                      letterSpacing: "0.08em",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.8)",
                    }}
                    className="shinra-badge"
                  >
                    {activeSticker}
                  </div>
                )}
              </div>

              {/* Zoom slider control */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.5rem", width: "100%", maxWidth: "300px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Scale
                </span>
                <input
                  type="range"
                  min="80"
                  max="180"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "var(--shinra-red)" }}
                />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, width: "40px" }}>{zoomLevel}%</span>
              </div>
            </div>

            {/* Right: Customizer Controls */}
            <div>
              {/* Product Type Toggle */}
              <div style={{ marginBottom: "1.75rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
                  1. Choose Format to Customize:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={() => setProductType("phone_case")}
                    style={{
                      backgroundColor: productType === "phone_case" ? "var(--shinra-red)" : "var(--surface)",
                      border: productType === "phone_case" ? "1px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                      color: "#ffffff",
                      borderRadius: "6px",
                      padding: "12px",
                      fontWeight: 800,
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <span>📱</span>
                    <span>Tough Phone Case</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductType("poster")}
                    style={{
                      backgroundColor: productType === "poster" ? "var(--shinra-red)" : "var(--surface)",
                      border: productType === "poster" ? "1px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                      color: "#ffffff",
                      borderRadius: "6px",
                      padding: "12px",
                      fontWeight: 800,
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <span>🖼️</span>
                    <span>Wall Canvas Print</span>
                  </button>
                </div>
              </div>

              {/* Phone Model Selector if Case */}
              {productType === "phone_case" && (
                <div style={{ marginBottom: "1.75rem" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
                    2. Select Phone Device:
                  </div>

                  {/* Brand chips */}
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.6rem" }}>
                    {PHONE_MODELS.map((b) => (
                      <button
                        key={b.brand}
                        type="button"
                        onClick={() => {
                          setSelectedBrand(b.brand);
                          setSelectedModel(b.models[0]);
                        }}
                        style={{
                          backgroundColor: selectedBrand === b.brand ? "#ffffff" : "var(--surface)",
                          color: selectedBrand === b.brand ? "#000000" : "#ffffff",
                          border: "1px solid var(--surface-border)",
                          borderRadius: "4px",
                          padding: "5px 12px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {b.brand}
                      </button>
                    ))}
                  </div>

                  {/* Dropdown */}
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    style={{
                      width: "100%",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--surface-border)",
                      color: "#ffffff",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-heading)",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {PHONE_MODELS.find((b) => b.brand === selectedBrand)?.models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Choose or Upload Artwork */}
              <div style={{ marginBottom: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    3. Artwork & Image Source:
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: "none",
                      border: "1px solid var(--shinra-red)",
                      color: "var(--shinra-red)",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "4px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    + Upload Custom Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>

                {/* Presets */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem" }}>
                  {PRESET_ARTWORKS.map((art) => {
                    const isSelected = selectedArtUrl === art.url;
                    return (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => setSelectedArtUrl(art.url)}
                        style={{
                          position: "relative",
                          aspectRatio: "3/4",
                          borderRadius: "6px",
                          overflow: "hidden",
                          border: isSelected ? "2px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                          cursor: "pointer",
                          padding: 0,
                          backgroundColor: "#000",
                        }}
                      >
                        <Image src={art.url} alt={art.name} fill sizes="80px" style={{ objectFit: "cover" }} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Text Overlay */}
              <div style={{ marginBottom: "1.75rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
                  4. Custom Call-sign / Text:
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Enter gamertag, name, or kanji..."
                    maxLength={18}
                    style={{
                      flex: 1,
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--surface-border)",
                      color: "#ffffff",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      fontSize: "0.85rem",
                      outline: "none",
                    }}
                  />
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    title="Choose Text Color"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "6px",
                      border: "1px solid var(--surface-border)",
                      cursor: "pointer",
                      backgroundColor: "var(--surface)",
                      padding: "4px",
                    }}
                  />
                </div>
              </div>

              {/* Anime Sticker Badge Overlay */}
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
                  5. Tactical Hologram Sticker Badge:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setActiveSticker(null)}
                    style={{
                      backgroundColor: activeSticker === null ? "var(--surface-border)" : "var(--surface)",
                      color: "#ffffff",
                      border: "1px solid var(--surface-border)",
                      borderRadius: "4px",
                      padding: "6px 10px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    None
                  </button>
                  {STICKERS.map((stk) => (
                    <button
                      key={stk}
                      type="button"
                      onClick={() => setActiveSticker(stk)}
                      style={{
                        backgroundColor: activeSticker === stk ? "var(--shinra-red)" : "var(--surface)",
                        color: "#ffffff",
                        border: activeSticker === stk ? "1px solid var(--shinra-red)" : "1px solid var(--surface-border)",
                        borderRadius: "4px",
                        padding: "6px 10px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", textTransform: "uppercase" }}>
                    Custom Unit Price
                  </div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 900 }}>
                    ₹{casePrice}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: "#22c55e", fontSize: "0.75rem", fontWeight: 700 }}>
                    ✓ 100% Precision Mold Guaranteed
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={handleSaveToDesigns}
                  style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    border: "1px solid var(--surface-border)",
                    color: "#ffffff",
                    borderRadius: "6px",
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    padding: "14px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--shinra-red)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--surface-border)")}
                >
                  Save Design
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    backgroundColor: "var(--shinra-red)",
                    border: "none",
                    color: "#ffffff",
                    borderRadius: "6px",
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    padding: "14px",
                    boxShadow: "0 4px 20px var(--shinra-red-glow)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--shinra-red-bright)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--shinra-red)")}
                >
                  Add Custom to Cart
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
