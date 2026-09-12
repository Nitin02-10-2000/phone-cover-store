"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartContext";

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
    tierDiscount,
    promoCode,
    applyPromo,
    promoDiscount,
    freeShippingProgress,
  } = useCart();

  const [inputCode, setInputCode] = useState("");

  if (!isCartOpen) return null;

  const finalTotal = Math.max(0, subtotal - tierDiscount - promoDiscount);
  const remainingForFreeShipping = Math.max(0, 799 - subtotal);

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      {/* Drawer Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "460px",
          height: "100%",
          backgroundColor: "#0c0c0e",
          borderLeft: "1px solid var(--surface-border)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.8)",
          zIndex: 10,
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--surface-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              YOUR COLLECTOR CART
            </h2>
            <span
              style={{
                backgroundColor: "var(--shinra-red)",
                color: "#ffffff",
                borderRadius: "999px",
                padding: "2px 8px",
                fontSize: "0.72rem",
                fontWeight: 800,
              }}
            >
              {totalItems}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
            style={{
              background: "transparent",
              border: "1px solid var(--surface-border)",
              borderRadius: "6px",
              color: "var(--foreground-muted)",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div
          style={{
            padding: "0.85rem 1.5rem",
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--surface-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.75rem",
              fontWeight: 700,
              marginBottom: "6px",
              color: freeShippingProgress >= 100 ? "#22c55e" : "#ffffff",
            }}
          >
            {freeShippingProgress >= 100 ? (
              <span>🎉 UNLOCKED FREE PAN-INDIA SHIPPING!</span>
            ) : (
              <span>
                Add <span style={{ color: "var(--shinra-red)" }}>₹{remainingForFreeShipping}</span> more for Free Shipping!
              </span>
            )}
            <span>{freeShippingProgress}%</span>
          </div>
          <div
            style={{
              width: "100%",
              height: "6px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: "100%",
                backgroundColor: freeShippingProgress >= 100 ? "#22c55e" : "var(--shinra-red)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {cart.length === 0 ? (
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                padding: "2rem 0",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginBottom: "0.5rem",
                }}
              >
                YOUR CART IS EMPTY
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--foreground-muted)",
                  marginBottom: "1.5rem",
                }}
              >
                Level up your wall or gear with our latest anime drops.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="shinra-btn shinra-btn-primary"
                style={{ fontSize: "0.8rem", padding: "0.65rem 1.25rem" }}
              >
                EXPLORE DROPS
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.format}-${item.phoneModel || ""}-${index}`}
                style={{
                  display: "flex",
                  gap: "1rem",
                  padding: "0.85rem",
                  backgroundColor: "var(--surface)",
                  borderRadius: "6px",
                  border: "1px solid var(--surface-border)",
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    position: "relative",
                    width: "70px",
                    height: "95px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    backgroundColor: "#000000",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={item.customDesignPreview || item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="70px"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                {/* Details */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: "#ffffff",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id, item.format, item.phoneModel)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--foreground-muted)",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          padding: "2px",
                          transition: "color 0.15s",
                        }}
                        title="Remove from Cart"
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground-muted)")}
                      >
                        🗑️
                      </button>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "var(--main-accent-bright)",
                          backgroundColor: "rgba(255, 42, 58, 0.15)",
                          padding: "1px 6px",
                          borderRadius: "3px",
                          display: "inline-block",
                        }}
                      >
                        {item.format}
                      </span>
                      {item.phoneModel && (
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: "var(--secondary-accent)",
                            backgroundColor: "rgba(236, 72, 153, 0.15)",
                            padding: "1px 6px",
                            borderRadius: "3px",
                            display: "inline-block",
                          }}
                        >
                          📱 {item.phoneModel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Price Controls */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid var(--surface-border)",
                        borderRadius: "4px",
                        backgroundColor: "#000000",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.format, item.quantity - 1, item.phoneModel)
                        }
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ffffff",
                          padding: "4px 10px",
                          cursor: "pointer",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                        }}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span
                        style={{
                          padding: "0 8px",
                          fontSize: "0.82rem",
                          fontWeight: 800,
                          color: "#ffffff",
                          minWidth: "20px",
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.format, item.quantity + 1, item.phoneModel)
                        }
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ffffff",
                          padding: "4px 10px",
                          cursor: "pointer",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                        }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        color: "#ffffff",
                      }}
                    >
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Summary */}
        {cart.length > 0 && (
          <div
            style={{
              padding: "1.25rem 1.5rem",
              backgroundColor: "var(--surface)",
              borderTop: "1px solid var(--surface-border)",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            {/* Promo Code Input */}
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="PROMO CODE (TRY 'TADKA10')"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  color: "var(--foreground)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  outline: "none",
                }}
              />
              <button
                onClick={() => applyPromo(inputCode)}
                className="shinra-btn shinra-btn-dark"
                style={{ fontSize: "0.72rem", padding: "0 14px", borderRadius: "4px" }}
              >
                APPLY
              </button>
            </div>

            {/* Calculations */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.82rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--foreground-muted)" }}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              {tierDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#22c55e", fontWeight: 700 }}>
                  <span>Tier Bundle Savings</span>
                  <span>-₹{tierDiscount}</span>
                </div>
              )}

              {promoDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#22c55e", fontWeight: 700 }}>
                  <span>Coupon ({promoCode})</span>
                  <span>-₹{promoDiscount}</span>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "var(--foreground)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  borderTop: "1px solid var(--surface-border)",
                  paddingTop: "6px",
                  marginTop: "4px",
                }}
              >
                <span>Estimated Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="shinra-btn shinra-btn-primary"
              style={{
                width: "100%",
                padding: "0.95rem",
                fontSize: "0.88rem",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: "pointer",
                boxShadow: "0 4px 20px var(--shinra-red-glow)",
              }}
            >
              <span>PROCEED TO CHECKOUT (₹{finalTotal})</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "4px" }}>
              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                style={{
                  fontSize: "0.75rem",
                  color: "var(--foreground-muted)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Or view complete cart details
              </Link>
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: "0.68rem",
                color: "var(--foreground-muted)",
                letterSpacing: "0.08em",
              }}
            >
              🔒 256-BIT SSL ENCRYPTED • UPI, CARDS, NET BANKING
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
