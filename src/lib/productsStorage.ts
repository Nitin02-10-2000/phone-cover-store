"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, PRODUCTS } from "@/data/products";

const STORAGE_KEY = "casetadka_custom_cases";
const DELETED_KEY = "casetadka_deleted_cases";
const EVENT_KEY = "casetadka_products_changed";

/**
 * Retrieve product IDs marked as deleted by the admin in localStorage
 */
export function getDeletedProductIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to parse deleted products from localStorage", err);
    return [];
  }
}

/**
 * Retrieve custom phone cases saved by the admin in localStorage
 */
export function getCustomProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const deletedIds = new Set(getDeletedProductIds());
    return (Array.isArray(parsed) ? parsed : []).filter((p: Product) => !deletedIds.has(p.id));
  } catch (err) {
    console.error("Failed to parse custom products from localStorage", err);
    return [];
  }
}

/**
 * Retrieve all products (Custom admin-uploaded products prepended before standard catalog, excluding deleted cases)
 */
export function getAllProducts(): Product[] {
  const custom = getCustomProducts();
  const deletedIds = new Set(getDeletedProductIds());
  return [...custom, ...PRODUCTS]
    .filter((p) => !deletedIds.has(p.id))
    .map((p) => {
      if (p.id === "case-tadka-signature-edition" && (p.image === "/case-tadka-logo.png" || !p.image)) {
        return { ...p, image: "/mockups/case_tadka_signature.jpg" };
      }
      return p;
    });
}

/**
 * Save a new phone case uploaded from the admin panel
 */
export function addCustomProduct(newProduct: Product): Product {
  if (typeof window === "undefined") return newProduct;
  try {
    // Unmark as deleted if previously deleted
    const deleted = getDeletedProductIds();
    if (deleted.includes(newProduct.id)) {
      localStorage.setItem(DELETED_KEY, JSON.stringify(deleted.filter((id) => id !== newProduct.id)));
    }

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
 * Delete a phone case (custom or catalog preset) from the store
 */
export function deleteCustomProduct(productId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    // 1. Remove from custom list if present
    const existing = getCustomProducts();
    const updated = existing.filter((p) => p.id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 2. Mark product ID as deleted so it is hidden persistently
    const deleted = getDeletedProductIds();
    if (!deleted.includes(productId)) {
      deleted.push(productId);
      localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    }

    window.dispatchEvent(new Event(EVENT_KEY));

    // 3. Delete from database API
    fetch(`/api/products/${productId}`, {
      method: "DELETE",
    }).catch((err) => console.warn("Background product delete from DB API:", err));

    return true;
  } catch (err) {
    console.error("Failed to delete product", err);
    return false;
  }
}

export const deleteProduct = deleteCustomProduct;

/**
 * Update an existing custom phone case in the catalog
 */
export function updateCustomProduct(updatedProduct: Product): Product {
  if (typeof window === "undefined") return updatedProduct;
  try {
    const existing = getCustomProducts();
    const updated = existing.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_KEY));

    // Persist to database API
    fetch(`/api/products/${updatedProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    }).catch((err) => console.warn("Background product update to DB API:", err));
  } catch (err) {
    console.error("Failed to update custom product in localStorage", err);
  }
  return updatedProduct;
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
          const deletedIds = new Set(getDeletedProductIds());
          setProducts(
            data.data
              .filter((p: Product) => !deletedIds.has(p.id))
              .map((p: Product) => {
                if (p.id === "case-tadka-signature-edition" && (p.image === "/case-tadka-logo.png" || !p.image)) {
                  return { ...p, image: "/mockups/case_tadka_signature.jpg" };
                }
                return p;
              })
          );
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
    updateProduct: updateCustomProduct,
    deleteProduct: deleteCustomProduct,
    isCustom: isCustomProduct,
    refresh,
  };
}
