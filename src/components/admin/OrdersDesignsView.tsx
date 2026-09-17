"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  getCustomOrdersWithDesigns,
  saveCustomOrderDesign,
  CustomOrderDesignRecord,
  getStudioPrintConfig,
} from "@/lib/studioStorage";

export default function OrdersDesignsView() {
  const [orders, setOrders] = useState<CustomOrderDesignRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CustomOrderDesignRecord | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setOrders(getCustomOrdersWithDesigns());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = (orderId: string, newStatus: any) => {
    const target = orders.find((o) => o.orderId === orderId);
    if (!target) return;
    const updated = { ...target, orderStatus: newStatus };
    const res = saveCustomOrderDesign(updated);
    setOrders(res);
    showToast(`Order ${orderId} marked as ${newStatus}`);
  };

  const handleDownloadPrintFile = (order: CustomOrderDesignRecord) => {
    const printConfig = getStudioPrintConfig();
    // Generate a high-resolution export canvas with production bleed
    const canvas = document.createElement("canvas");
    const dpi = printConfig.dpi || 300;
    const widthMm = (printConfig.widthMm || 78) + (printConfig.bleedMm || 3) * 2;
    const heightMm = (printConfig.heightMm || 162) + (printConfig.bleedMm || 3) * 2;
    const pxW = Math.round((widthMm / 25.4) * dpi);
    const pxH = Math.round((heightMm / 25.4) * dpi);

    canvas.width = pxW;
    canvas.height = pxH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0a0a0c";
    ctx.fillRect(0, 0, pxW, pxH);

    // Draw print crop markers in corners
    ctx.strokeStyle = "#ff2a3a";
    ctx.lineWidth = 4;
    // Top-left
    ctx.strokeRect(40, 40, pxW - 80, pxH - 80);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.drawImage(img, 40, 40, pxW - 80, pxH - 80);

      // Print footer barcode & info text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(
        `CASE TADKA PRODUCTION // ORDER: ${order.orderId} // MODEL: ${order.phoneModel} // ${printConfig.colorProfile}`,
        60,
        pxH - 60
      );

      // Download
      const link = document.createElement("a");
      link.download = `PRODUCTION_PRINT_${order.orderId}_${order.phoneModel.replace(/\s+/g, "_")}.${printConfig.exportFormat.toLowerCase()}`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast(`Downloaded 300 DPI print-ready production master for ${order.orderId}!`);
    };
    img.src = order.designPreviewUrl;
  };

  const handleDownloadJson = (order: CustomOrderDesignRecord) => {
    const jsonStr = JSON.stringify(order.customizationData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CUSTOM_DATA_${order.orderId}.json`;
    link.click();
    showToast(`Downloaded structured JSON specification for ${order.orderId}`);
  };

  const handleCopyJson = (order: CustomOrderDesignRecord) => {
    navigator.clipboard.writeText(JSON.stringify(order.customizationData, null, 2));
    showToast("Structured JSON copied to clipboard!");
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
            FULFILLMENT TELEMETRY
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 6px", color: "var(--foreground)" }}>
            Custom Orders & Print-Ready Designs
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", margin: 0 }}>
            Inspect customized buyer designs, review structured JSON specifications, and export 300 DPI production files.
          </p>
        </div>
      </div>

      {/* Orders Table */}
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
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>ORDER ID</th>
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>CUSTOMER</th>
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>PREVIEW</th>
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>DEVICE & CASE TYPE</th>
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>CUSTOMIZATION DATA</th>
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>STATUS</th>
                <th style={{ padding: "12px 18px", fontWeight: 800 }}>PRICE</th>
                <th style={{ padding: "12px 18px", fontWeight: 800, textAlign: "right" }}>PRODUCTION EXPORT</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.orderId}
                  style={{
                    borderBottom: "1px solid var(--surface-border)",
                    transition: "background-color 0.15s",
                  }}
                >
                  <td style={{ padding: "14px 18px", fontWeight: 900, fontFamily: "monospace", color: "var(--main-accent)" }}>
                    {o.orderId}
                  </td>

                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontWeight: 800, color: "var(--foreground)" }}>{o.customerName}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>{o.customerPhone}</div>
                  </td>

                  <td style={{ padding: "14px 18px" }}>
                    <div
                      style={{
                        position: "relative",
                        width: "50px",
                        height: "75px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        border: "1px solid var(--surface-border)",
                        backgroundColor: "#000",
                      }}
                    >
                      <Image
                        src={o.designPreviewUrl}
                        alt="Design Preview"
                        fill
                        sizes="60px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </td>

                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontWeight: 800 }}>{o.phoneModel}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", marginTop: "2px" }}>
                      {o.caseType}
                    </div>
                  </td>

                  <td style={{ padding: "14px 18px" }}>
                    <button
                      onClick={() => {
                        setSelectedOrder(o);
                        setIsJsonModalOpen(true);
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
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>🔍</span>
                      <span>View JSON Data</span>
                    </button>
                  </td>

                  <td style={{ padding: "14px 18px" }}>
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o.orderId, e.target.value)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        backgroundColor:
                          o.orderStatus === "PRINTING"
                            ? "rgba(245, 158, 11, 0.15)"
                            : o.orderStatus === "CONFIRMED"
                            ? "rgba(56, 189, 248, 0.15)"
                            : o.orderStatus === "SHIPPED"
                            ? "rgba(168, 85, 247, 0.15)"
                            : "rgba(34, 197, 94, 0.15)",
                        color:
                          o.orderStatus === "PRINTING"
                            ? "#f59e0b"
                            : o.orderStatus === "CONFIRMED"
                            ? "#38bdf8"
                            : o.orderStatus === "SHIPPED"
                            ? "#a855f7"
                            : "#22c55e",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PRINTING">PRINTING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </td>

                  <td style={{ padding: "14px 18px", fontWeight: 900, color: "var(--foreground)" }}>
                    ₹{o.price}
                  </td>

                  <td style={{ padding: "14px 18px", textAlign: "right" }}>
                    <button
                      onClick={() => handleDownloadPrintFile(o)}
                      style={{
                        padding: "7px 14px",
                        borderRadius: "6px",
                        backgroundColor: "var(--main-accent)",
                        color: "#ffffff",
                        border: "none",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 2px 8px rgba(230, 57, 70, 0.2)",
                      }}
                    >
                      <span>🖨️</span>
                      <span>Download Print Master</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Structured JSON Modal */}
      {isJsonModalOpen && selectedOrder && (
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
              padding: "26px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--surface-border)", paddingBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--main-accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  STRUCTURED CUSTOMIZATION DATA
                </span>
                <h3 style={{ margin: "2px 0 0", fontSize: "1.2rem", fontWeight: 800 }}>
                  Order: {selectedOrder.orderId} ({selectedOrder.phoneModel})
                </h3>
              </div>
              <button
                onClick={() => setIsJsonModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--foreground-muted)", fontSize: "1.4rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* JSON Code View */}
            <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#0b0b0e", borderRadius: "8px", padding: "16px", marginBottom: "16px", border: "1px solid #1f1f26" }}>
              <pre style={{ margin: 0, fontSize: "0.8rem", color: "#38bdf8", fontFamily: "monospace", lineHeight: 1.5 }}>
                {JSON.stringify(selectedOrder.customizationData, null, 2)}
              </pre>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => handleCopyJson(selectedOrder)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--surface-border)",
                  color: "var(--foreground)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📋 Copy JSON
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleDownloadJson(selectedOrder)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    backgroundColor: "var(--surface-raised)",
                    border: "1px solid var(--surface-border)",
                    color: "var(--foreground)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  💾 Download .JSON
                </button>
                <button
                  onClick={() => setIsJsonModalOpen(false)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "6px",
                    backgroundColor: "var(--main-accent)",
                    border: "none",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
