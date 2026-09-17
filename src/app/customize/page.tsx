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
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <CartDrawer />
      <SearchModal />

      <main style={{ flex: 1, paddingTop: "72px" }}>
        <CustomerStudioWorkspace />
      </main>

      <Footer />
    </div>
  );
}
