"use client";

import React, { useState, useEffect } from "react";
import {
  getStudio3DModels,
  saveStudio3DModel,
  getStudioPhoneModels,
  Studio3DModelConfig,
  StudioPhoneModel,
} from "@/lib/studioStorage";

export default function ThreeDModelsManagerView() {
  const [models3d, setModels3d] = useState<Studio3DModelConfig[]>([]);
  const [phoneModels, setPhoneModels] = useState<StudioPhoneModel[]>([]);
  const [editingModel, setEditingModel] = useState<Studio3DModelConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setModels3d(getStudio3DModels());
    setPhoneModels(getStudioPhoneModels());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddNew = () => {
    const new3d: Studio3DModelConfig = {
      id: `3d-${Date.now()}`,
      name: "New Custom 3D Chassis Model",
      phoneModelId: phoneModels[0]?.id || "ip-16-pm",
      caseType: "9H Tempered Glass",
      modelUrl: "/models/custom_phone_case.glb",
      textureUrl: "/mockups/textures/glass_sheen.jpg",
      normalMapUrl: "/mockups/textures/bumper_normal.jpg",
      roughnessMapUrl: "/mockups/textures/roughness_grid.jpg",
      materialType: "glass",
      roughness: 0.15,
      metallic: 0.8,
      transparency: 0.05,
      thickness: 2.0,
      lighting: {
        ambientIntensity: 0.6,
        directionalIntensity: 1.2,
        lightColor: "#ffffff",
        environmentPreset: "studio",
      },
      active: true,
    };
    setEditingModel(new3d);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel) return;
    const updated = saveStudio3DModel(editingModel);
    setModels3d(updated);
    setIsModalOpen(false);
    setEditingModel(null);
    showToast(`Saved 3D Model: ${editingModel.name}`);
  };

  const handleToggleActive = (id: string) => {
    const target = models3d.find((m) => m.id === id);
    if (!target) return;
    const updated = { ...target, active: !target.active };
    const res = saveStudio3DModel(updated);
    setModels3d(res);
    showToast(`3D model is now ${updated.active ? "Enabled" : "Disabled"}`);
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
            RENDER PIPELINE ASSETS
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 6px", color: "var(--foreground)" }}>
            3D Case Models & Asset Manager
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", margin: 0 }}>
            Upload and configure GLB/GLTF geometry, normal maps, roughness channels, and studio lighting rigs.
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
          <span>🧊</span>
          <span>+ Upload / Add 3D Model</span>
        </button>
      </div>

      {/* Grid of 3D Models */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {models3d.map((m) => {
          const linkedPhone = phoneModels.find((p) => p.id === m.phoneModelId);
          return (
            <div
              key={m.id}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--surface-border)",
                borderRadius: "14px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        backgroundColor: "rgba(230, 57, 70, 0.12)",
                        color: "var(--main-accent)",
                        padding: "3px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {m.materialType.toUpperCase()} SHADER
                    </span>
                    <h3 style={{ margin: "8px 0 4px", fontSize: "1.15rem", fontWeight: 800, color: "var(--foreground)" }}>
                      {m.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleToggleActive(m.id)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: m.active ? "rgba(34, 197, 94, 0.15)" : "rgba(156, 163, 175, 0.15)",
                      color: m.active ? "#22c55e" : "var(--foreground-muted)",
                    }}
                  >
                    {m.active ? "● Active" : "○ Disabled"}
                  </button>
                </div>

                <div style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", marginBottom: "16px" }}>
                  Linked Device: <strong style={{ color: "var(--foreground)" }}>{linkedPhone?.name || m.phoneModelId}</strong>
                  <br />
                  Case Format: <strong>{m.caseType}</strong>
                </div>

                {/* Spec Badges */}
                <div
                  style={{
                    backgroundColor: "var(--surface-raised)",
                    borderRadius: "8px",
                    padding: "12px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8px",
                    fontSize: "0.75rem",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--foreground-muted)" }}>GLB Model: </span>
                    <strong style={{ fontFamily: "monospace" }}>{m.modelUrl.split("/").pop()}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--foreground-muted)" }}>Roughness: </span>
                    <strong>{Math.round(m.roughness * 100)}%</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--foreground-muted)" }}>Metallic: </span>
                    <strong>{Math.round(m.metallic * 100)}%</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--foreground-muted)" }}>Transparency: </span>
                    <strong>{Math.round(m.transparency * 100)}%</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--foreground-muted)" }}>Thickness: </span>
                    <strong>{m.thickness}mm</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--foreground-muted)" }}>Lighting Rig: </span>
                    <strong>{m.lighting.environmentPreset}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--surface-border)", paddingTop: "14px" }}>
                <button
                  onClick={() => {
                    setEditingModel(m);
                    setIsModalOpen(true);
                  }}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "6px",
                    backgroundColor: "var(--surface-raised)",
                    border: "1px solid var(--surface-border)",
                    color: "var(--foreground)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ⚙ Configure 3D Spec
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingModel && (
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
              padding: "28px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--surface-border)", paddingBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800 }}>
                Configure 3D Asset: {editingModel.name}
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
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  value={editingModel.name}
                  onChange={(e) => setEditingModel({ ...editingModel, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Linked Phone Model
                  </label>
                  <select
                    value={editingModel.phoneModelId}
                    onChange={(e) => setEditingModel({ ...editingModel, phoneModelId: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                  >
                    {phoneModels.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.brand} — {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Case Type
                  </label>
                  <select
                    value={editingModel.caseType}
                    onChange={(e) => setEditingModel({ ...editingModel, caseType: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                  >
                    <option value="9H Tempered Glass">9H Tempered Glass</option>
                    <option value="Ultra Impact MagSafe">Ultra Impact MagSafe</option>
                    <option value="Matte Slim">Matte Slim</option>
                    <option value="Transparent Crystal TPU">Transparent Crystal TPU</option>
                  </select>
                </div>
              </div>

              {/* Model File and Texture Maps */}
              <div style={{ padding: "14px", backgroundColor: "var(--surface-raised)", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "10px", color: "var(--main-accent)" }}>
                  GLB / GLTF & Texture Channel URLs
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>GLB / GLTF Model File Path or URL</label>
                    <input
                      type="text"
                      value={editingModel.modelUrl}
                      onChange={(e) => setEditingModel({ ...editingModel, modelUrl: e.target.value })}
                      placeholder="/models/iphone_case.glb or https://..."
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>Normal Map URL</label>
                    <input
                      type="text"
                      value={editingModel.normalMapUrl || ""}
                      onChange={(e) => setEditingModel({ ...editingModel, normalMapUrl: e.target.value })}
                      placeholder="/mockups/textures/bumper_normal.jpg"
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>Roughness Map URL</label>
                    <input
                      type="text"
                      value={editingModel.roughnessMapUrl || ""}
                      onChange={(e) => setEditingModel({ ...editingModel, roughnessMapUrl: e.target.value })}
                      placeholder="/mockups/textures/roughness_grid.jpg"
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Shader Settings */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Roughness ({Math.round(editingModel.roughness * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={editingModel.roughness}
                    onChange={(e) => setEditingModel({ ...editingModel, roughness: parseFloat(e.target.value) })}
                    style={{ width: "100%", accentColor: "var(--main-accent)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Metallic ({Math.round(editingModel.metallic * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={editingModel.metallic}
                    onChange={(e) => setEditingModel({ ...editingModel, metallic: parseFloat(e.target.value) })}
                    style={{ width: "100%", accentColor: "var(--main-accent)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Transparency ({Math.round(editingModel.transparency * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={editingModel.transparency}
                    onChange={(e) => setEditingModel({ ...editingModel, transparency: parseFloat(e.target.value) })}
                    style={{ width: "100%", accentColor: "var(--main-accent)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Armor Thickness (mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingModel.thickness}
                    onChange={(e) => setEditingModel({ ...editingModel, thickness: parseFloat(e.target.value) || 2.0 })}
                    style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              {/* Lighting */}
              <div style={{ padding: "14px", backgroundColor: "var(--surface-raised)", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "10px", color: "#38bdf8" }}>
                  Studio Lighting Environment
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>Preset</label>
                    <select
                      value={editingModel.lighting.environmentPreset}
                      onChange={(e) =>
                        setEditingModel({
                          ...editingModel,
                          lighting: { ...editingModel.lighting, environmentPreset: e.target.value as any },
                        })
                      }
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    >
                      <option value="studio">Studio Softbox</option>
                      <option value="sunset">Golden Hour Rim</option>
                      <option value="neon-cyberpunk">Neon Cyberpunk</option>
                      <option value="clean-white">Clean Commercial White</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>Key Light Intensity ({editingModel.lighting.directionalIntensity}x)</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.1"
                      value={editingModel.lighting.directionalIntensity}
                      onChange={(e) =>
                        setEditingModel({
                          ...editingModel,
                          lighting: { ...editingModel.lighting, directionalIntensity: parseFloat(e.target.value) },
                        })
                      }
                      style={{ width: "100%", accentColor: "var(--main-accent)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "9px 16px", borderRadius: "6px", backgroundColor: "transparent", border: "1px solid var(--surface-border)", color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "9px 20px", borderRadius: "6px", backgroundColor: "var(--main-accent)", border: "none", color: "#fff", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer" }}
                >
                  Save 3D Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
