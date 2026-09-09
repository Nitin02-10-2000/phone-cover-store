"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useCart();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, name || undefined);
    router.push("/account");
  };

  const handleDemoLogin = () => {
    login("kaito@shinra.in", "Kaito Takahashi");
    router.push("/account");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "16px",
            padding: "2.5rem 2rem",
            boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(229,9,20,0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top accent bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              backgroundColor: "var(--shinra-red)",
            }}
          />

          {/* Logo & Title */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#000000",
                border: "1px solid var(--shinra-red)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem auto",
                boxShadow: "0 0 20px var(--shinra-red-glow)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--shinra-red)" strokeWidth="2.5">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.6rem",
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {mode === "login" ? "ACCESS HACHIMAN" : "JOIN THE COLLECTIVE"}
            </h1>
            <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
              {mode === "login" ? "Sign in to manage drops, orders & custom cases" : "Create an account for VIP early drop access"}
            </p>
          </div>

          {/* Mode Tabs */}
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--background)",
              borderRadius: "6px",
              padding: "4px",
              marginBottom: "1.75rem",
            }}
          >
            <button
              type="button"
              onClick={() => setMode("login")}
              style={{
                flex: 1,
                backgroundColor: mode === "login" ? "var(--shinra-red)" : "transparent",
                color: mode === "login" ? "#ffffff" : "var(--foreground-muted)",
                border: "none",
                borderRadius: "4px",
                padding: "8px",
                fontFamily: "var(--font-heading)",
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              style={{
                flex: 1,
                backgroundColor: mode === "register" ? "var(--shinra-red)" : "transparent",
                color: mode === "register" ? "#ffffff" : "var(--foreground-muted)",
                border: "none",
                borderRadius: "4px",
                padding: "8px",
                fontFamily: "var(--font-heading)",
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {mode === "register" && (
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--foreground-muted)", display: "block", marginBottom: "4px" }}>
                  Collector Handle / Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kaito Takahashi"
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
            )}

            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--foreground-muted)", display: "block", marginBottom: "4px" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hunter@hachiman.in"
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
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--foreground-muted)" }}>
                  Password
                </label>
                {mode === "login" && (
                  <span style={{ fontSize: "0.72rem", color: "var(--shinra-red)", cursor: "pointer" }}>
                    Forgot?
                  </span>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "var(--shinra-red)",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "12px",
                fontFamily: "var(--font-heading)",
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 4px 15px var(--shinra-red-glow)",
                marginTop: "0.5rem",
              }}
            >
              {mode === "login" ? "Sign In →" : "Create Collector Profile →"}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "1.5rem 0",
              color: "var(--foreground-muted)",
              fontSize: "0.75rem",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--surface-border)" }} />
            <span style={{ padding: "0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>OR</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--surface-border)" }} />
          </div>

          {/* Quick Demo One-Click Login */}
          <button
            type="button"
            onClick={handleDemoLogin}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "1px solid var(--surface-border)",
              color: "#ffffff",
              borderRadius: "6px",
              padding: "10px",
              fontFamily: "var(--font-heading)",
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--shinra-red)";
              e.currentTarget.style.color = "var(--shinra-red)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--surface-border)";
              e.currentTarget.style.color = "#ffffff";
            }}
          >
            <span>⚡</span>
            <span>Quick Login as Demo Collector</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
