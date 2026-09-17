"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  getStudioTemplates,
  saveStudioTemplate,
  deleteStudioTemplate,
  StudioTemplate,
  TemplateLayer,
} from "@/lib/studioStorage";

export default function DesignTemplateBuilderView() {
  const [templates, setTemplates] = useState<StudioTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<StudioTemplate | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmDeleteTemplate, setConfirmDeleteTemplate] = useState<StudioTemplate | null>(null);

  useEffect(() => {
    setTemplates(getStudioTemplates());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePublish = (id: string) => {
    const target = templates.find((t) => t.id === id);
    if (!target) return;
    const updated: StudioTemplate = { ...target, published: !target.published };
    const res = saveStudioTemplate(updated);
    setTemplates(res);
    showToast(`Template is now ${updated.published ? "Published to Custom Studio" : "Unpublished"}`);
  };

  const handleDuplicate = (template: StudioTemplate) => {
    const copy: StudioTemplate = {
      ...template,
      id: `tmpl-${Date.now()}`,
      title: `${template.title} (Remix)`,
      published: false,
      createdAt: new Date().toISOString(),
    };
    const res = saveStudioTemplate(copy);
    setTemplates(res);
    showToast(`Duplicated template: ${copy.title}`);
  };

  const handleDelete = (template: StudioTemplate) => {
    setConfirmDeleteTemplate(template);
  };

  const handleCreateNew = () => {
    const newTmpl: StudioTemplate = {
      id: `tmpl-${Date.now()}`,
      title: "New Custom Armor Template",
      category: "Anime",
      previewUrl: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786122801/mockups/gojo-satoru-honored-one-poster-paper-1.jpg",
      phoneModel: "iPhone 16 Pro Max",
      caseType: "9H Tempered Glass",
      published: true,
      createdAt: new Date().toISOString(),
      layers: [
        {
          id: "l-bg",
          type: "background",
          content: "https://res.cloudinary.com/dv7oqos1m/image/upload/v1786122801/mockups/gojo-satoru-honored-one-poster-paper-1.jpg",
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          visible: true,
        },
        {
          id: "l-txt",
          type: "text",
          content: "DOMINANCE 2026",
          x: 15,
          y: 82,
          scale: 1,
          rotation: 0,
          color: "#ffffff",
          fontFamily: "'Outfit', sans-serif",
          fontSize: 18,
          opacity: 1,
          zIndex: 2,
          visible: true,
        },
        {
          id: "l-stk",
          type: "sticker",
          content: "⚡ CASE TADKA HQ",
          x: 50,
          y: 16,
          scale: 1,
          rotation: -3,
          opacity: 1,
          zIndex: 3,
          visible: true,
        },
      ],
    };
    setEditingTemplate(newTmpl);
    setIsBuilderOpen(true);
  };

  // Layer editing inside builder
  const handleAddLayer = (type: TemplateLayer["type"]) => {
    if (!editingTemplate) return;
    const newLayer: TemplateLayer = {
      id: `layer-${Date.now()}`,
      type,
      content:
        type === "text"
          ? "CUSTOM CALL-SIGN"
          : type === "sticker"
          ? "🔥 NIKA GEAR 5"
          : type === "shape"
          ? "accent-badge"
          : "https://res.cloudinary.com/dv7oqos1m/image/upload/v1787153686/mockups/luffy-gear-5-one-piece-poster-paper-5.jpg",
      x: 20,
      y: 50,
      scale: 1,
      rotation: 0,
      opacity: 1,
      zIndex: editingTemplate.layers.length + 1,
      visible: true,
      color: "#ffffff",
      fontFamily: "'Outfit', sans-serif",
      fontSize: 16,
    };
    setEditingTemplate({
      ...editingTemplate,
      layers: [...editingTemplate.layers, newLayer],
    });
  };

  const handleUpdateLayer = (id: string, updates: Partial<TemplateLayer>) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      layers: editingTemplate.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    });
  };

  const handleDeleteLayer = (id: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      layers: editingTemplate.layers.filter((l) => l.id !== id),
    });
  };

  const handleSaveBuilder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    const res = saveStudioTemplate(editingTemplate);
    setTemplates(res);
    setIsBuilderOpen(false);
    setEditingTemplate(null);
    showToast(`Template saved: ${editingTemplate.title}`);
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
            CREATIVE ASSET PIPELINE
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 6px", color: "var(--foreground)" }}>
            Design Template Builder
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", margin: 0 }}>
            Curate ready-to-print multi-layered design presets that customers can pick and customize in 1-click.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
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
          <span>🖼️</span>
          <span>+ Create New Template</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "22px" }}>
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--surface-border)",
              borderRadius: "14px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
            }}
          >
            {/* Visual Thumbnail */}
            <div style={{ position: "relative", height: "220px", backgroundColor: "#000", overflow: "hidden" }}>
              <Image
                src={tmpl.previewUrl}
                alt={tmpl.title}
                fill
                sizes="340px"
                style={{ objectFit: "cover" }}
              />

              {/* Badges overlay */}
              <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
                <span
                  style={{
                    backgroundColor: "rgba(0,0,0,0.75)",
                    backdropFilter: "blur(4px)",
                    color: "#fff",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {tmpl.category}
                </span>
                <span
                  style={{
                    backgroundColor: tmpl.published ? "rgba(34, 197, 94, 0.85)" : "rgba(239, 68, 68, 0.85)",
                    color: "#fff",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {tmpl.published ? "PUBLISHED" : "DRAFT"}
                </span>
              </div>

              {/* Layer count */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "12px",
                  backgroundColor: "rgba(0,0,0,0.8)",
                  color: "#38bdf8",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "4px",
                }}
              >
                📚 {tmpl.layers.length} Layers
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: "1.1rem", fontWeight: 800, color: "var(--foreground)" }}>
                  {tmpl.title}
                </h3>
                <div style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", marginBottom: "14px" }}>
                  Chassis: <strong style={{ color: "var(--foreground)" }}>{tmpl.phoneModel}</strong> • {tmpl.caseType}
                </div>

                {/* Layer pills preview */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                  {tmpl.layers.map((l, idx) => (
                    <span
                      key={l.id || idx}
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        backgroundColor: "var(--surface-raised)",
                        border: "1px solid var(--surface-border)",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        color: "var(--foreground)",
                      }}
                    >
                      {l.type === "text" ? `🔤 ${l.content}` : l.type === "sticker" ? `✨ ${l.content}` : `🖼️ ${l.type}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "6px", borderTop: "1px solid var(--surface-border)", paddingTop: "12px" }}>
                <button
                  onClick={() => {
                    setEditingTemplate(tmpl);
                    setIsBuilderOpen(true);
                  }}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "6px",
                    backgroundColor: "var(--surface-raised)",
                    border: "1px solid var(--surface-border)",
                    color: "var(--foreground)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✏️ Edit Layers
                </button>
                <button
                  onClick={() => handleTogglePublish(tmpl.id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    backgroundColor: tmpl.published ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                    border: tmpl.published ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(34, 197, 94, 0.2)",
                    color: tmpl.published ? "#ef4444" : "#22c55e",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  title={tmpl.published ? "Unpublish from Studio" : "Publish to Studio"}
                >
                  {tmpl.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => handleDuplicate(tmpl)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "6px",
                    backgroundColor: "var(--surface-raised)",
                    border: "1px solid var(--surface-border)",
                    color: "var(--foreground)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  title="Clone Template"
                >
                  📋
                </button>
                <button
                  onClick={() => handleDelete(tmpl)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "#ef4444",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  title="Delete Template"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Layer-Based Builder Modal */}
      {isBuilderOpen && editingTemplate && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
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
              padding: "28px",
              width: "100%",
              maxWidth: "840px",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--surface-border)", paddingBottom: "14px" }}>
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--main-accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  MULTI-LAYER STUDIO COMPOSER
                </span>
                <h3 style={{ margin: "2px 0 0", fontSize: "1.3rem", fontWeight: 800 }}>
                  {editingTemplate.title}
                </h3>
              </div>
              <button
                onClick={() => setIsBuilderOpen(false)}
                style={{ background: "none", border: "none", color: "var(--foreground-muted)", fontSize: "1.4rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBuilder} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Template Title, Category & Model */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Template Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTemplate.title}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Category
                  </label>
                  <select
                    value={editingTemplate.category}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                  >
                    <option value="Anime">Anime</option>
                    <option value="Streetwear">Streetwear</option>
                    <option value="Desi">Desi</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Dark">Dark Gothic</option>
                    <option value="Trending">Trending</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Default Phone Model
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.phoneModel}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, phoneModel: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              {/* Preview Image URL */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Cover / Flattened Preview URL
                </label>
                <input
                  type="text"
                  required
                  value={editingTemplate.previewUrl}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, previewUrl: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                />
              </div>

              {/* Layer Stack Header & Add Buttons */}
              <div style={{ backgroundColor: "var(--surface-raised)", borderRadius: "10px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--foreground)" }}>
                    Layer Stack ({editingTemplate.layers.length} Layers)
                  </span>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => handleAddLayer("text")}
                      style={{ padding: "5px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                    >
                      + Text Layer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddLayer("sticker")}
                      style={{ padding: "5px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                    >
                      + Sticker Layer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddLayer("shape")}
                      style={{ padding: "5px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                    >
                      + Shape Element
                    </button>
                  </div>
                </div>

                {/* Layer Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {editingTemplate.layers.map((layer, index) => (
                    <div
                      key={layer.id || index}
                      style={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--foreground-muted)", width: "24px" }}>
                        #{index + 1}
                      </span>

                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          backgroundColor: "rgba(230, 57, 70, 0.12)",
                          color: "var(--main-accent)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                          width: "70px",
                          textAlign: "center",
                        }}
                      >
                        {layer.type}
                      </span>

                      <input
                        type="text"
                        value={layer.content}
                        onChange={(e) => handleUpdateLayer(layer.id, { content: e.target.value })}
                        placeholder="Content text / sticker / URL"
                        style={{
                          flex: 1,
                          padding: "6px 10px",
                          borderRadius: "4px",
                          backgroundColor: "var(--surface-raised)",
                          border: "1px solid var(--surface-border)",
                          color: "var(--foreground)",
                          fontSize: "0.82rem",
                        }}
                      />

                      {/* Position & Scale sliders mini */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "0.7rem", color: "var(--foreground-muted)" }}>Scale:</span>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={layer.scale}
                          onChange={(e) => handleUpdateLayer(layer.id, { scale: parseFloat(e.target.value) })}
                          style={{ width: "60px", accentColor: "var(--main-accent)" }}
                        />
                      </div>

                      {/* Delete layer */}
                      <button
                        type="button"
                        onClick={() => handleDeleteLayer(layer.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: "1rem",
                          padding: "0 6px",
                        }}
                        title="Remove layer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publish Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={editingTemplate.published}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, published: e.target.checked })}
                />
                <label htmlFor="pubCheck" style={{ fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>
                  Publish Template (Enable "Customize this template" for customers in Custom Studio)
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  style={{ padding: "9px 16px", borderRadius: "6px", backgroundColor: "transparent", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "9px 22px", borderRadius: "6px", backgroundColor: "var(--main-accent)", border: "none", color: "#fff", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer" }}
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Inline Delete Confirm Modal ────────────────────────────────── */}
      {confirmDeleteTemplate && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setConfirmDeleteTemplate(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#18181b",
              border: "1px solid rgba(239,68,68,0.35)",
              borderRadius: "16px",
              padding: "32px 28px",
              maxWidth: "420px",
              width: "90%",
              boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🗑️</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
              Delete Template?
            </div>
            <div style={{ fontSize: "0.88rem", color: "#a1a1aa", marginBottom: "24px", lineHeight: 1.5 }}>
              Are you sure you want to delete{" "}
              <strong style={{ color: "#fff" }}>&quot;{confirmDeleteTemplate.title}&quot;</strong>?{" "}
              This cannot be undone.
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => setConfirmDeleteTemplate(null)}
                style={{
                  padding: "10px 22px",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "#a1a1aa",
                  border: "1px solid #3f3f46",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const res = deleteStudioTemplate(confirmDeleteTemplate.id);
                  setTemplates(res);
                  showToast(`Deleted "${confirmDeleteTemplate.title}"`);
                  setConfirmDeleteTemplate(null);
                }}
                style={{
                  padding: "10px 22px",
                  borderRadius: "8px",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(239,68,68,0.4)",
                }}
              >
                🗑️ Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
