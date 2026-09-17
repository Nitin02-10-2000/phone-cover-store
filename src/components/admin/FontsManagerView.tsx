"use client";

import React, { useState, useEffect } from "react";
import {
  getStudioFonts,
  saveStudioFont,
  toggleStudioFont,
  deleteStudioFont,
  StudioFontItem,
} from "@/lib/studioStorage";

export default function FontsManagerView() {
  const [fonts, setFonts] = useState<StudioFontItem[]>([]);
  const [editingFont, setEditingFont] = useState<StudioFontItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewSample, setPreviewSample] = useState("CASE TADKA 2026");
  const [confirmDeleteFont, setConfirmDeleteFont] = useState<StudioFontItem | null>(null);

  useEffect(() => {
    setFonts(getStudioFonts());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = (id: string) => {
    const updated = toggleStudioFont(id);
    setFonts(updated);
    const target = updated.find((f) => f.id === id);
    showToast(`Font "${target?.name}" is now ${target?.enabled ? "Enabled for Studio" : "Disabled"}`);
  };

  const handleDelete = (font: StudioFontItem) => {
    setConfirmDeleteFont(font);
  };

  const handleAddNew = () => {
    const newFont: StudioFontItem = {
      id: `font-${Date.now()}`,
      name: "New Custom Typography",
      family: "'Outfit', sans-serif",
      isGoogleFont: true,
      enabled: true,
      previewText: "ARMOR DESIGN",
    };
    setEditingFont(newFont);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFont) return;
    const updated = saveStudioFont(editingFont);
    setFonts(updated);
    setIsModalOpen(false);
    setEditingFont(null);
    showToast(`Saved font: ${editingFont.name}`);
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
            TYPOGRAPHY FOUNDRY
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 6px", color: "var(--foreground)" }}>
            Fonts Management
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", margin: 0 }}>
            Configure active typography families for call-signs, names, and kanji scripts in the Custom Studio.
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
          <span>🔤</span>
          <span>+ Add Font Family</span>
        </button>
      </div>

      {/* Preview Sample Input */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "10px",
          padding: "14px 20px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--foreground-muted)", whiteSpace: "nowrap" }}>
          Live Typography Tester:
        </span>
        <input
          type="text"
          value={previewSample}
          onChange={(e) => setPreviewSample(e.target.value)}
          placeholder="Type custom text to preview font rendering..."
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
      </div>

      {/* Fonts List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "18px" }}>
        {fonts.map((f) => (
          <div
            key={f.id}
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: f.enabled ? 1 : 0.6,
              transition: "all 0.15s",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "var(--foreground)" }}>
                    {f.name}
                  </h3>
                  <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", fontFamily: "monospace", marginTop: "2px" }}>
                    {f.family}
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(f.id)}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: f.enabled ? "rgba(34, 197, 94, 0.15)" : "rgba(156, 163, 175, 0.15)",
                    color: f.enabled ? "#22c55e" : "var(--foreground-muted)",
                  }}
                >
                  {f.enabled ? "● Enabled" : "○ Disabled"}
                </button>
              </div>

              {/* Sample Rendering Card */}
              <div
                style={{
                  backgroundColor: "var(--surface-raised)",
                  borderRadius: "8px",
                  padding: "18px 14px",
                  marginBottom: "14px",
                  textAlign: "center",
                  border: "1px solid var(--surface-border)",
                }}
              >
                <div
                  style={{
                    fontFamily: f.family,
                    fontSize: "1.6rem",
                    color: "var(--foreground)",
                    fontWeight: 900,
                    letterSpacing: "0.05em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {previewSample || "CASE TADKA"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--surface-border)", paddingTop: "12px" }}>
              <button
                onClick={() => {
                  setEditingFont(f);
                  setIsModalOpen(true);
                }}
                style={{
                  flex: 1,
                  padding: "6px",
                  borderRadius: "6px",
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--surface-border)",
                  color: "var(--foreground)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ✏️ Edit Font
              </button>
              <button
                onClick={() => handleDelete(f)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
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
      {isModalOpen && editingFont && (
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
                {editingFont.id.startsWith("font-") ? "Add New Font" : `Edit: ${editingFont.name}`}
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
                  Font Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editingFont.name}
                  onChange={(e) => setEditingFont({ ...editingFont, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  CSS Font Family / Stack
                </label>
                <input
                  type="text"
                  required
                  value={editingFont.family}
                  onChange={(e) => setEditingFont({ ...editingFont, family: e.target.value })}
                  placeholder="'Outfit', sans-serif"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Custom Web Font URL (Optional @font-face link)
                </label>
                <input
                  type="text"
                  value={editingFont.sourceUrl || ""}
                  onChange={(e) => setEditingFont({ ...editingFont, sourceUrl: e.target.value })}
                  placeholder="https://fonts.googleapis.com/... or /fonts/myfont.woff2"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="fontEnableCheck"
                  checked={editingFont.enabled}
                  onChange={(e) => setEditingFont({ ...editingFont, enabled: e.target.checked })}
                />
                <label htmlFor="fontEnableCheck" style={{ fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>
                  Enabled (Show in Customer Custom Studio text options)
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
                  Save Font
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Inline Delete Confirm Modal ────────────────────────── */}
      {confirmDeleteFont && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setConfirmDeleteFont(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "#18181b", border: "1px solid rgba(239,68,68,0.35)", borderRadius: "16px", padding: "32px 28px", maxWidth: "420px", width: "90%", boxShadow: "0 24px 60px rgba(0,0,0,0.8)", textAlign: "center" }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🗑️</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>Delete Font?</div>
            <div style={{ fontSize: "0.88rem", color: "#a1a1aa", marginBottom: "24px", lineHeight: 1.5 }}>
              Delete <strong style={{ color: "#fff" }}>&quot;{confirmDeleteFont.name}&quot;</strong>? This cannot be undone.
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button type="button" onClick={() => setConfirmDeleteFont(null)}
                style={{ padding: "10px 22px", borderRadius: "8px", backgroundColor: "transparent", color: "#a1a1aa", border: "1px solid #3f3f46", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer" }}
              >Cancel</button>
              <button type="button"
                onClick={() => { const u = deleteStudioFont(confirmDeleteFont.id); setFonts(u); showToast(`Deleted "${confirmDeleteFont.name}"`); setConfirmDeleteFont(null); }}
                style={{ padding: "10px 22px", borderRadius: "8px", backgroundColor: "#ef4444", color: "#fff", border: "none", fontSize: "0.9rem", fontWeight: 800, cursor: "pointer" }}
              >🗑️ Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
