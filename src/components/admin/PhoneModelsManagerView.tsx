"use client";

import React, { useState, useEffect } from "react";
import {
  getStudioPhoneModels,
  saveStudioPhoneModel,
  deleteStudioPhoneModel,
  StudioPhoneModel,
} from "@/lib/studioStorage";

export default function PhoneModelsManagerView() {
  const [models, setModels] = useState<StudioPhoneModel[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [editingModel, setEditingModel] = useState<StudioPhoneModel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmDeleteModel, setConfirmDeleteModel] = useState<StudioPhoneModel | null>(null);

  useEffect(() => {
    setModels(getStudioPhoneModels());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const brands = Array.from(new Set(models.map((m) => m.brand)));

  const filtered = models.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.brand.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = selectedBrand === "ALL" || m.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const handleToggleActive = (id: string) => {
    const target = models.find((m) => m.id === id);
    if (!target) return;
    const updated = { ...target, active: !target.active };
    const result = saveStudioPhoneModel(updated);
    setModels(result);
    showToast(`Status updated: ${target.name} is now ${updated.active ? "Active" : "Inactive"}`);
  };

  const handleDuplicate = (model: StudioPhoneModel) => {
    const copy: StudioPhoneModel = {
      ...model,
      id: `${model.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${model.name} (Copy)`,
    };
    const result = saveStudioPhoneModel(copy);
    setModels(result);
    showToast(`Duplicated model: ${copy.name}`);
  };

  const handleDelete = (model: StudioPhoneModel) => {
    setConfirmDeleteModel(model);
  };

  const handleAddNew = () => {
    const newModel: StudioPhoneModel = {
      id: `model-${Date.now()}`,
      brand: "Apple",
      name: "New Phone Armor Chassis",
      caseType: "9H Tempered Glass",
      model3dId: "3d-default-iphone",
      canvasWidth: 800,
      canvasHeight: 1600,
      printWidthMm: 78,
      printHeightMm: 162,
      cameraCutout: { x: 20, y: 20, width: 75, height: 85, radius: 24 },
      flashCutout: { x: 60, y: 35, radius: 8 },
      buttonAreas: "Power (R: 350-430px), Volume (L: 280-460px)",
      safeArea: { insetX: 24, insetY: 30 },
      bleedArea: { bleedMm: 3 },
      active: true,
      releaseYear: new Date().getFullYear(),
      corners: "rounded",
      hasMagSafe: true,
    };
    setEditingModel(newModel);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel) return;
    const result = saveStudioPhoneModel(editingModel);
    setModels(result);
    setIsModalOpen(false);
    setEditingModel(null);
    showToast(`Saved phone model: ${editingModel.name}`);
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
            DEVICE FLEET DATABASE
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 6px", color: "var(--foreground)" }}>
            Phone Models Management
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", margin: 0 }}>
            Configure database-driven phone chassis, exact print dimensions, camera cutout bounds, and safe areas.
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
          <span>+ Add Phone Model</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
          alignItems: "center",
          backgroundColor: "var(--surface)",
          padding: "14px 18px",
          borderRadius: "10px",
          border: "1px solid var(--surface-border)",
        }}
      >
        <input
          type="text"
          placeholder="Search by model or brand (e.g. iPhone 16, S25, OnePlus)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: "240px",
            padding: "8px 14px",
            borderRadius: "6px",
            backgroundColor: "var(--surface-raised)",
            border: "1px solid var(--surface-border)",
            color: "var(--foreground)",
            fontSize: "0.85rem",
            outline: "none",
          }}
        />

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedBrand("ALL")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "0.78rem",
              fontWeight: 700,
              backgroundColor: selectedBrand === "ALL" ? "var(--main-accent)" : "var(--surface-raised)",
              color: selectedBrand === "ALL" ? "#fff" : "var(--foreground-muted)",
              border: "1px solid var(--surface-border)",
              cursor: "pointer",
            }}
          >
            All Brands ({models.length})
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "0.78rem",
                fontWeight: 700,
                backgroundColor: selectedBrand === b ? "var(--main-accent)" : "var(--surface-raised)",
                color: selectedBrand === b ? "#fff" : "var(--foreground-muted)",
                border: "1px solid var(--surface-border)",
                cursor: "pointer",
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Models Table */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--surface-raised)", borderBottom: "1px solid var(--surface-border)", color: "var(--foreground-muted)" }}>
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>BRAND & MODEL</th>
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>CASE TYPE</th>
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>CANVAS / PRINT DIMS</th>
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>CAMERA CUTOUT</th>
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>SAFE / BLEED</th>
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>STATUS</th>
                <th style={{ padding: "12px 18px", fontWeight: 800, textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "var(--foreground-muted)" }}>
                    No phone models matched your search query.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr
                    key={m.id}
                    style={{
                      borderBottom: "1px solid var(--surface-border)",
                      transition: "background-color 0.15s",
                    }}
                  >
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 800, color: "var(--foreground)" }}>{m.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", display: "flex", gap: "6px", marginTop: "2px" }}>
                        <span>{m.brand}</span>
                        <span>•</span>
                        <span>{m.releaseYear || 2024}</span>
                        {m.hasMagSafe && (
                          <>
                            <span>•</span>
                            <span style={{ color: "#38bdf8", fontWeight: 700 }}>MagSafe</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <span
                        style={{
                          backgroundColor: "rgba(230, 57, 70, 0.08)",
                          color: "var(--main-accent)",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                        }}
                      >
                        {m.caseType}
                      </span>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 700 }}>
                        {m.canvasWidth} x {m.canvasHeight} px
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>
                        {m.printWidthMm} x {m.printHeightMm} mm
                      </div>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontSize: "0.78rem", color: "var(--foreground)" }}>
                        {m.cameraCutout.width}x{m.cameraCutout.height}px (R:{m.cameraCutout.radius}px)
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--foreground-muted)" }}>
                        Pos: X:{m.cameraCutout.x}, Y:{m.cameraCutout.y}
                      </div>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontSize: "0.78rem", color: "#22c55e", fontWeight: 600 }}>
                        Safe: {m.safeArea?.insetX || 24}px
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#ef4444", fontWeight: 600 }}>
                        Bleed: {m.bleedArea?.bleedMm || 3}mm
                      </div>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <button
                        onClick={() => handleToggleActive(m.id)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: m.active ? "rgba(34, 197, 94, 0.15)" : "rgba(156, 163, 175, 0.15)",
                          color: m.active ? "#22c55e" : "var(--foreground-muted)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: m.active ? "#22c55e" : "#9ca3af" }} />
                        <span>{m.active ? "Active" : "Disabled"}</span>
                      </button>
                    </td>

                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          onClick={() => {
                            setEditingModel(m);
                            setIsModalOpen(true);
                          }}
                          style={{
                            padding: "5px 10px",
                            borderRadius: "6px",
                            backgroundColor: "var(--surface-raised)",
                            border: "1px solid var(--surface-border)",
                            color: "var(--foreground)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                          title="Edit dimensions & cutouts"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDuplicate(m)}
                          style={{
                            padding: "5px 10px",
                            borderRadius: "6px",
                            backgroundColor: "var(--surface-raised)",
                            border: "1px solid var(--surface-border)",
                            color: "var(--foreground)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                          title="Duplicate chassis spec"
                        >
                          📋 Clone
                        </button>
                        <button
                          onClick={() => handleDelete(m)}
                          style={{
                            padding: "5px 10px",
                            borderRadius: "6px",
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "#ef4444",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                          title="Delete from studio catalog"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
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
                {editingModel.id.startsWith("model-") ? "Add New Phone Chassis" : `Edit: ${editingModel.name}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--foreground-muted)", fontSize: "1.4rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>Brand</label>
                  <input
                    type="text"
                    required
                    value={editingModel.brand}
                    onChange={(e) => setEditingModel({ ...editingModel, brand: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>Model Name</label>
                  <input
                    type="text"
                    required
                    value={editingModel.name}
                    onChange={(e) => setEditingModel({ ...editingModel, name: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>Default Case Type</label>
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
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>Corner Geometry</label>
                  <select
                    value={editingModel.corners || "rounded"}
                    onChange={(e) => setEditingModel({ ...editingModel, corners: e.target.value as any })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                  >
                    <option value="rounded">Rounded (Standard Apple/Samsung)</option>
                    <option value="sharp">Sharp Rectangular (Galaxy Ultra)</option>
                    <option value="extra-rounded">Extra Rounded (Pixel)</option>
                  </select>
                </div>
              </div>

              {/* Dimensions */}
              <div style={{ padding: "14px", backgroundColor: "var(--surface-raised)", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "10px", color: "var(--main-accent)" }}>
                  Canvas & Print Dimensions
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>Canvas W (px)</label>
                    <input
                      type="number"
                      value={editingModel.canvasWidth}
                      onChange={(e) => setEditingModel({ ...editingModel, canvasWidth: parseInt(e.target.value) || 800 })}
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>Canvas H (px)</label>
                    <input
                      type="number"
                      value={editingModel.canvasHeight}
                      onChange={(e) => setEditingModel({ ...editingModel, canvasHeight: parseInt(e.target.value) || 1600 })}
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>Print W (mm)</label>
                    <input
                      type="number"
                      value={editingModel.printWidthMm}
                      onChange={(e) => setEditingModel({ ...editingModel, printWidthMm: parseFloat(e.target.value) || 78 })}
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>Print H (mm)</label>
                    <input
                      type="number"
                      value={editingModel.printHeightMm}
                      onChange={(e) => setEditingModel({ ...editingModel, printHeightMm: parseFloat(e.target.value) || 162 })}
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Camera Cutout Coordinates */}
              <div style={{ padding: "14px", backgroundColor: "var(--surface-raised)", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "10px", color: "#f59e0b" }}>
                  Camera Cutout Coordinates
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>X (px)</label>
                    <input
                      type="number"
                      value={editingModel.cameraCutout.x}
                      onChange={(e) =>
                        setEditingModel({
                          ...editingModel,
                          cameraCutout: { ...editingModel.cameraCutout, x: parseInt(e.target.value) || 0 },
                        })
                      }
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>Y (px)</label>
                    <input
                      type="number"
                      value={editingModel.cameraCutout.y}
                      onChange={(e) =>
                        setEditingModel({
                          ...editingModel,
                          cameraCutout: { ...editingModel.cameraCutout, y: parseInt(e.target.value) || 0 },
                        })
                      }
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>Width (px)</label>
                    <input
                      type="number"
                      value={editingModel.cameraCutout.width}
                      onChange={(e) =>
                        setEditingModel({
                          ...editingModel,
                          cameraCutout: { ...editingModel.cameraCutout, width: parseInt(e.target.value) || 0 },
                        })
                      }
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>Height (px)</label>
                    <input
                      type="number"
                      value={editingModel.cameraCutout.height}
                      onChange={(e) =>
                        setEditingModel({
                          ...editingModel,
                          cameraCutout: { ...editingModel.cameraCutout, height: parseInt(e.target.value) || 0 },
                        })
                      }
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700 }}>Radius (px)</label>
                    <input
                      type="number"
                      value={editingModel.cameraCutout.radius}
                      onChange={(e) =>
                        setEditingModel({
                          ...editingModel,
                          cameraCutout: { ...editingModel.cameraCutout, radius: parseInt(e.target.value) || 0 },
                        })
                      }
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Safe & Bleed */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>Safe Area Inset (px)</label>
                  <input
                    type="number"
                    value={editingModel.safeArea?.insetX || 24}
                    onChange={(e) =>
                      setEditingModel({
                        ...editingModel,
                        safeArea: { insetX: parseInt(e.target.value) || 24, insetY: parseInt(e.target.value) || 24 },
                      })
                    }
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>Bleed Margin (mm)</label>
                  <input
                    type="number"
                    value={editingModel.bleedArea?.bleedMm || 3}
                    onChange={(e) =>
                      setEditingModel({
                        ...editingModel,
                        bleedArea: { bleedMm: parseFloat(e.target.value) || 3 },
                      })
                    }
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              {/* Buttons Area text description */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Physical Button & Port Cutouts
                </label>
                <input
                  type="text"
                  value={editingModel.buttonAreas || ""}
                  onChange={(e) => setEditingModel({ ...editingModel, buttonAreas: e.target.value })}
                  placeholder="e.g. Power Button (R: 350-430px), Volume (L: 280-460px), USB-C bottom center"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--foreground)" }}
                />
              </div>

              {/* Active Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={editingModel.active}
                  onChange={(e) => setEditingModel({ ...editingModel, active: e.target.checked })}
                />
                <label htmlFor="activeCheck" style={{ fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>
                  Active (Customer Custom Studio can select this phone model)
                </label>
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
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Inline Delete Confirm Modal ────────────────────────── */}
      {confirmDeleteModel && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setConfirmDeleteModel(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "#18181b", border: "1px solid rgba(239,68,68,0.35)", borderRadius: "16px", padding: "32px 28px", maxWidth: "420px", width: "90%", boxShadow: "0 24px 60px rgba(0,0,0,0.8)", textAlign: "center" }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🗑️</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>Delete Phone Model?</div>
            <div style={{ fontSize: "0.88rem", color: "#a1a1aa", marginBottom: "24px", lineHeight: 1.5 }}>
              Delete <strong style={{ color: "#fff" }}>&quot;{confirmDeleteModel.name}&quot;</strong>? This cannot be undone.
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button type="button" onClick={() => setConfirmDeleteModel(null)}
                style={{ padding: "10px 22px", borderRadius: "8px", backgroundColor: "transparent", color: "#a1a1aa", border: "1px solid #3f3f46", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer" }}
              >Cancel</button>
              <button type="button"
                onClick={() => { const r = deleteStudioPhoneModel(confirmDeleteModel.id); setModels(r); showToast(`Deleted "${confirmDeleteModel.name}"`); setConfirmDeleteModel(null); }}
                style={{ padding: "10px 22px", borderRadius: "8px", backgroundColor: "#ef4444", color: "#fff", border: "none", fontSize: "0.9rem", fontWeight: 800, cursor: "pointer" }}
              >🗑️ Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
