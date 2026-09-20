"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import CustomerStudioWorkspace from "@/components/studio/CustomerStudioWorkspace";

export default function CustomizePage() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#e2e5eb",
        color: "#18181b",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CartDrawer />
      <SearchModal />
      <main style={{ flex: 1, width: "100%", height: "100%", overflow: "hidden" }}>
        <CustomerStudioWorkspace />
      </main>
    </div>
  );
}
