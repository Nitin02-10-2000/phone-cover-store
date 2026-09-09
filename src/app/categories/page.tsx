"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import { CASE_TYPES, PHONE_MODELS } from "@/data/products";
import Link from "next/link";

export default function CategoriesPage() {
  const franchiseBanners = [
    {
      id: "one-piece",
      name: "One Piece Cases",
      japanese: "ワンピース",
      tagline: "Sun God Nika Gear 5, Zoro Enma & Straw Hat Pirates",
      image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787153686/mockups/luffy-gear-5-one-piece-poster-paper-5.jpg",
      drops: "12 Case Editions",
      accent: "#f59e0b",
    },
    {
      id: "jujutsu-kaisen",
      name: "Jujutsu Kaisen Cases",
      japanese: "呪術廻戦",
      tagline: "Infinite Void Gojo, Malevolent Shrine Sukuna & Megumi",
      image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786122801/mockups/gojo-satoru-honored-one-poster-paper-1.jpg",
      drops: "10 Case Editions",
      accent: "#8b5cf6",
    },
    {
      id: "berserk",
      name: "Berserk Dark Fantasy Cases",
      japanese: "ベルセルク",
      tagline: "Brand of Sacrifice, Dragonslayer Sword & Guts Eclipse",
      image: "https://res.cloudinary.com/dv7oqos1m/image/private/s--tUURy_y1--/t_shinra_card/v1/products/kbvsttiw8hoxpfel82du?_a=BAMAPqfk0",
      drops: "6 Case Editions",
      accent: "#e50914",
    },
    {
      id: "demon-slayer",
      name: "Demon Slayer Cases",
      japanese: "鬼滅の刃",
      tagline: "Sun Breathing Tanjiro, Zenitsu Thunder & Hashira Corps",
      image: "https://res.cloudinary.com/dv7oqos1m/image/upload/t_shinra_card/v1788284762/mockups/tanjiro-kamado-poster-demon-slayer-anime-wall-art-hinokami-kagura-paper-1.jpg",
      drops: "8 Case Editions",
      accent: "#eab308",
    },
    {
      id: "solo-leveling",
      name: "Solo Leveling Hunter Cases",
      japanese: "나 혼자만 레벨업",
      tagline: "The Shadow Monarch, Arise Army & Dagger Arts",
      image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788283838/mockups/solo-leveling-poster-sung-jin-woo-shadow-monarch-anime-wall-art-paper-1.jpg",
      drops: "7 Case Editions",
      accent: "#3b82f6",
    },
    {
      id: "naruto",
      name: "Naruto Shinobi Cases",
      japanese: "ナルト",
      tagline: "Itachi Crow Genjutsu, Sasuke Rinnegan & Akatsuki Clouds",
      image: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1788283307/mockups/itachi-uchiha-poster-naruto-anime-wall-art-crow-genjutsu-paper-1.jpg",
      drops: "9 Case Editions",
      accent: "#f97316",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <CartDrawer />
      <SearchModal />

      <main style={{ flex: 1, paddingBottom: "5rem" }}>
        {/* Header Hero */}
        <section
          style={{
            backgroundColor: "var(--background)",
            borderBottom: "1px solid var(--surface-border)",
            padding: "3rem 0",
            position: "relative",
            overflow: "hidden",
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
                marginBottom: "0.75rem",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <Link href="/" style={{ color: "var(--foreground-muted)", textDecoration: "none" }}>
                Home
              </Link>
              <span>/</span>
              <span style={{ color: "var(--shinra-red)" }}>Case Categories</span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                fontWeight: 900,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              CASE CATEGORIES & FINISHES
            </h1>
            <p
              style={{
                color: "var(--foreground-muted)",
                fontSize: "1rem",
                maxWidth: "650px",
                lineHeight: 1.6,
              }}
            >
              Compare military-grade drop defense tiers, high-gloss 9H tempered glass backs, MagSafe arrays, or shop by your favorite anime universe.
            </p>
          </div>
        </section>

        {/* Section 1: Phone Case Protection Tiers */}
        <section className="container" style={{ marginTop: "3.5rem" }}>
          <div style={{ marginBottom: "2rem" }}>
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
              CHOOSE YOUR ARMOR LEVEL
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.8rem",
                fontWeight: 800,
                marginTop: "0.3rem",
              }}
            >
              PHONE CASE FINISHES & PROTECTION
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {CASE_TYPES.map((f) => (
              <div
                key={f.id}
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                className="category-card"
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "2.4rem" }}>{f.icon}</span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "var(--shinra-red)",
                        backgroundColor: "rgba(230, 57, 70, 0.12)",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid rgba(230, 57, 70, 0.25)",
                      }}
                    >
                      {f.priceText}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {f.name}
                  </h3>

                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--shinra-red)",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginBottom: "0.85rem",
                    }}
                  >
                    {f.specs}
                  </div>

                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--foreground-muted)",
                      lineHeight: 1.6,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {f.description}
                  </p>
                </div>

                <Link
                  href={`/shop?format=${encodeURIComponent(f.name)}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.85rem 1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "6px",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>BROWSE {f.name.toUpperCase()}</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Anime Universe Banners */}
        <section className="container" style={{ marginTop: "5rem" }}>
          <div style={{ marginBottom: "2rem" }}>
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
              EXCLUSIVE DROPS
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.8rem",
                fontWeight: 800,
                marginTop: "0.3rem",
              }}
            >
              PHONE CASES BY ANIME UNIVERSE
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "2rem",
            }}
          >
            {franchiseBanners.map((f) => (
              <div
                key={f.id}
                style={{
                  position: "relative",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid var(--surface-border)",
                  height: "320px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "1.75rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                }}
              >
                {/* Background Image */}
                <img
                  src={f.image}
                  alt={f.name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 0,
                    filter: "brightness(0.35) contrast(1.2)",
                  }}
                />

                {/* Gradient vignette */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                    zIndex: 1,
                  }}
                />

                {/* Content */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        color: f.accent,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {f.japanese}
                    </span>
                    <span
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        border: `1px solid ${f.accent}55`,
                        color: "#ffffff",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      {f.drops}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.4rem",
                      fontWeight: 900,
                      color: "#ffffff",
                      marginBottom: "6px",
                    }}
                  >
                    {f.name}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "rgba(255, 255, 255, 0.75)",
                      lineHeight: 1.4,
                      marginBottom: "16px",
                    }}
                  >
                    {f.tagline}
                  </p>

                  <Link
                    href={`/shop?universe=${f.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      backgroundColor: "var(--shinra-red)",
                      color: "#ffffff",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textDecoration: "none",
                    }}
                  >
                    <span>EXPLORE {f.name.toUpperCase()}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
