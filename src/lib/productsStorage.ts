"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, PRODUCTS } from "@/data/products";

const STORAGE_KEY = "casetadka_custom_cases";
const EVENT_KEY = "casetadka_products_changed";

/**
 * Retrieve custom phone cases saved by the admin in localStorage
 */
export function getCustomProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to parse custom products from localStorage", err);
    return [];
  }
}

/**
 * Retrieve all products (Custom admin-uploaded products prepended before standard catalog)
 */
export function getAllProducts(): Product[] {
  const custom = getCustomProducts();
  return [...custom, ...PRODUCTS];
}

/**
 * Save a new phone case uploaded from the admin panel
 */
export function addCustomProduct(newProduct: Product): Product {
  if (typeof window === "undefined") return newProduct;
  try {
    const existing = getCustomProducts();
    // Filter out if same ID already exists
    const updated = [newProduct, ...existing.filter((p) => p.id !== newProduct.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_KEY));

    // Persist to database API
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    }).catch((err) => console.warn("Background product sync to DB API:", err));
  } catch (err) {
    console.error("Failed to save custom product to localStorage", err);
  }
  return newProduct;
}

/**
 * Delete a custom phone case from the catalog
 */
export function deleteCustomProduct(productId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const existing = getCustomProducts();
    const updated = existing.filter((p) => p.id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_KEY));

    // Delete from database API
    fetch(`/api/products/${productId}`, {
      method: "DELETE",
    }).catch((err) => console.warn("Background product delete from DB API:", err));

    return true;
  } catch (err) {
    console.error("Failed to delete custom product", err);
    return false;
  }
}

/**
 * Check if a product was added by admin
 */
export function isCustomProduct(productId: string): boolean {
  const custom = getCustomProducts();
  return custom.some((p) => p.id === productId);
}

/**
 * React hook to get all products with live reactivity when admin adds/deletes cases
 */
export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isClient, setIsClient] = useState(false);

  const refresh = useCallback(() => {
    // 1. Instant local state
    setProducts(getAllProducts());

    // 2. Sync with database API
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data);
        }
      })
      .catch(() => {
        // keep local state
      });
  }, []);

  useEffect(() => {
    setIsClient(true);
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  return {
    products,
    isClient,
    addProduct: addCustomProduct,
    deleteProduct: deleteCustomProduct,
    isCustom: isCustomProduct,
    refresh,
  };
}
