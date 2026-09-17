"use client";

import React, { useState, useEffect } from "react";
import {
  getStudioAssets,
  saveStudioAsset,
  toggleStudioAsset,
  deleteStudioAsset,
  StudioAssetItem,
  STICKER_CATEGORIES,
  StickerCategory,
} from "@/lib/studioStorage";

export default function StickersAssetsManagerView() {
  const [assets, setAssets] = useState<StudioAssetItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [editingAsset, setEditingAsset] = useState<StudioAssetItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmDeleteAsset, setConfirmDeleteAsset] = useState<StudioAssetItem | null>(null);

  useEffect(() => {
    setAssets(getStudioAssets());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filtered = assets.filter((a) => {
    const matchCat = selectedCategory === "ALL" || a.category === selectedCategory;
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.url.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleToggle = (id: string) => {
    const updated = toggleStudioAsset(id);
    setAssets(updated);
    const target = updated.find((a) => a.id === id);
    showToast(`Sticker ${target?.name} is now ${target?.enabled ? "Enabled" : "Disabled"}`);
  };

  const handleDelete = (asset: StudioAssetItem) => {
    setConfirmDeleteAsset(asset);
  };

  const handleAddNew = () => {
    const newAsset: StudioAssetItem = {
      id: `asset-${Date.now()}`,
      name: "New Tactical Sticker",
      category: "Desi",
      url: "🌶️ DESI TADKA",
      enabled: true,
    };
    setEditingAsset(newAsset);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    const updated = saveStudioAsset(editingAsset);
    setAssets(updated);
    setIsModalOpen(false);
    setEditingAsset(null);
    showToast(`Saved sticker: ${editingAsset.name}`);
  };

  return (
    <div style={{ animation: "fadeIn 0.2s ease-in-out" }}>
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            backgroundColor: "#111",
            color: "#fff",
            border: "1px solid var(--main-accent)",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            zIndex: 9999,
            fontSize: "0.85rem",
            fontWeight: 700,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em", color: "var(--main-accent)", textTransform: "uppercase", marginBottom: "4px" }}>
            TACTICAL HOLOGRAM BADGES
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 6px", color: "var(--foreground)" }}>
            Stickers & Assets Library
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", margin: 0 }}>
            Categorized holograms, anime stamps, meme badges, and typography accents ready for customer drag-and-drop.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            backgroundColor: "var(--main-accent)",
            color: "#ffffff",
            border: "none",
            fontSize: "0.85rem",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 14px rgba(230, 57, 70, 0.25)",
          }}
        >
          <span>✨</span>
          <span>+ Upload / Add Sticker</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search stickers, meme tags, kanji badges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 14px",
              borderRadius: "6px",
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--surface-border)",
              color: "var(--foreground)",
              fontSize: "0.85rem",
              outline: "none",
            }}
          />
          <span style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", fontWeight: 700 }}>
            Showing {filtered.length} of {assets.length} assets
          </span>
        </div>

        {/* 11 Requested Categories */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          <button
            onClick={() => setSelectedCategory("ALL")}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.78rem",
              fontWeight: 800,
              backgroundColor: selectedCategory === "ALL" ? "var(--main-accent)" : "var(--surface-raised)",
              color: selectedCategory === "ALL" ? "#fff" : "var(--foreground-muted)",
              border: "1px solid var(--surface-border)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            All Categories ({assets.length})
          </button>
          {STICKER_CATEGORIES.map((cat) => {
            const count = assets.filter((a) => a.category === cat).length;
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  backgroundColor: isSel ? "var(--main-accent)" : "var(--surface-raised)",
                  color: isSel ? "#fff" : "var(--foreground-muted)",
                  border: "1px solid var(--surface-border)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Assets Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
        {filtered.map((asset) => (
          <div
            key={asset.id}
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: asset.enabled ? 1 : 0.6,
              transition: "all 0.15s",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    backgroundColor: "rgba(230, 57, 70, 0.1)",
                    color: "var(--main-accent)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {asset.category}
                </span>

                <button
                  onClick={() => handleToggle(asset.id)}
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: asset.enabled ? "rgba(34, 197, 94, 0.15)" : "rgba(156, 163, 175, 0.15)",
                    color: asset.enabled ? "#22c55e" : "var(--foreground-muted)",
                  }}
                >
                  {asset.enabled ? "Enabled" : "Disabled"}
                </button>
              </div>

              {/* Sticker Visual Badge Preview */}
              <div
                style={{
                  height: "80px",
                  backgroundColor: "var(--surface-raised)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                  border: "1px dashed var(--surface-border)",
                  padding: "8px",
                }}
              >
                {asset.url.startsWith("http") || asset.url.startsWith("/") ? (
                  <img src={asset.url} alt={asset.name} style={{ maxHeight: "60px", maxWidth: "100%", objectFit: "contain" }} />
                ) : (
                  <span
                    style={{
                      backgroundColor: "var(--main-accent)",
                      color: "#fff",
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.85rem",
                      fontWeight: 900,
                      padding: "6px 12px",
                      borderRadius: "4px",
                      letterSpacing: "0.08em",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    }}
                  >
                    {asset.url}
                  </span>
                )}
              </div>

              <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "4px" }}>
                {asset.name}
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px", marginTop: "12px", borderTop: "1px solid var(--surface-border)", paddingTop: "10px" }}>
              <button
                onClick={() => {
                  setEditingAsset(asset);
                  setIsModalOpen(true);
                }}
                style={{
                  flex: 1,
                  padding: "6px",
                  borderRadius: "4px",
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--surface-border)",
                  color: "var(--foreground)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(asset)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingAsset && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "24px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1px solid var(--surface-border)", paddingBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>
                {editingAsset.id.startsWith("asset-") ? "Add Sticker / Hologram" : `Edit: ${editingAsset.name}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--foreground-muted)", fontSize: "1.4rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Sticker Label / Name
                </label>
                <input
                  type="text"
                  required
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Category
                </label>
                <select
                  value={editingAsset.category}
                  onChange={(e) => setEditingAsset({ ...editingAsset, category: e.target.value as StickerCategory })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                >
                  {STICKER_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Badge Value (Text stamp or Image URL)
                </label>
                <input
                  type="text"
                  required
                  value={editingAsset.url}
                  onChange={(e) => setEditingAsset({ ...editingAsset, url: e.target.value })}
                  placeholder="e.g. ⚡ TADKA ARMOR or https://...png"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="assetActiveCheck"
                  checked={editingAsset.enabled}
                  onChange={(e) => setEditingAsset({ ...editingAsset, enabled: e.target.checked })}
                />
                <label htmlFor="assetActiveCheck" style={{ fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>
                  Enabled (Show in customer Custom Studio)
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "8px 14px", borderRadius: "6px", backgroundColor: "transparent", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", borderRadius: "6px", backgroundColor: "var(--main-accent)", border: "none", color: "#fff", fontSize: "0.82rem", fontWeight: 800, cursor: "pointer" }}
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Inline Delete Confirm Modal ────────────────────────── */}
      {confirmDeleteAsset && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setConfirmDeleteAsset(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "#18181b", border: "1px solid rgba(239,68,68,0.35)", borderRadius: "16px", padding: "32px 28px", maxWidth: "420px", width: "90%", boxShadow: "0 24px 60px rgba(0,0,0,0.8)", textAlign: "center" }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🗑️</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>Delete Sticker?</div>
            <div style={{ fontSize: "0.88rem", color: "#a1a1aa", marginBottom: "24px", lineHeight: 1.5 }}>
              Delete <strong style={{ color: "#fff" }}>&quot;{confirmDeleteAsset.name}&quot;</strong>? This cannot be undone.
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button type="button" onClick={() => setConfirmDeleteAsset(null)}
                style={{ padding: "10px 22px", borderRadius: "8px", backgroundColor: "transparent", color: "#a1a1aa", border: "1px solid #3f3f46", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer" }}
              >Cancel</button>
              <button type="button"
                onClick={() => { const u = deleteStudioAsset(confirmDeleteAsset.id); setAssets(u); showToast(`Deleted "${confirmDeleteAsset.name}"`); setConfirmDeleteAsset(null); }}
                style={{ padding: "10px 22px", borderRadius: "8px", backgroundColor: "#ef4444", color: "#fff", border: "none", fontSize: "0.9rem", fontWeight: 800, cursor: "pointer" }}
              >🗑️ Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
