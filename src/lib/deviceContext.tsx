"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ALL_PHONE_MODELS,
  BRAND_GROUPS,
  PhoneModelItem,
  getPhoneModelDetails,
} from "@/data/phoneModels";

interface DeviceContextType {
  selectedBrand: string;
  selectedModel: string;
  activePhone: PhoneModelItem;
  setDevice: (brand: string, model: string) => void;
  setDeviceByModel: (model: string) => void;
  isDevicePickerOpen: boolean;
  setIsDevicePickerOpen: (open: boolean) => void;
  openDevicePicker: () => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [selectedBrand, setSelectedBrand] = useState<string>("Apple");
  const [selectedModel, setSelectedModel] = useState<string>("iPhone 16 Pro Max");
  const [activePhone, setActivePhone] = useState<PhoneModelItem>(ALL_PHONE_MODELS[0]);
  const [isDevicePickerOpen, setIsDevicePickerOpen] = useState<boolean>(false);

  // Load from localStorage on initial mount
  useEffect(() => {
    try {
      const savedBrand = localStorage.getItem("hachiman_selected_brand");
      const savedModel = localStorage.getItem("hachiman_selected_model");

      if (savedModel) {
        const details = getPhoneModelDetails(savedModel);
        setSelectedModel(details.name);
        setSelectedBrand(savedBrand || details.brand);
        setActivePhone(details);
      }
    } catch {
      // ignore localStorage errors in SSR/private browsing
    }
  }, []);

  const setDevice = (brand: string, model: string) => {
    setSelectedBrand(brand);
    setSelectedModel(model);
    const details = getPhoneModelDetails(model);
    setActivePhone(details);

    try {
      localStorage.setItem("hachiman_selected_brand", brand);
      localStorage.setItem("hachiman_selected_model", model);
    } catch {
      // ignore
    }
  };

  const setDeviceByModel = (model: string) => {
    const details = getPhoneModelDetails(model);
    setSelectedBrand(details.brand);
    setSelectedModel(details.name);
    setActivePhone(details);

    try {
      localStorage.setItem("hachiman_selected_brand", details.brand);
      localStorage.setItem("hachiman_selected_model", details.name);
    } catch {
      // ignore
    }
  };

  const openDevicePicker = () => setIsDevicePickerOpen(true);

  return (
    <DeviceContext.Provider
      value={{
        selectedBrand,
        selectedModel,
        activePhone,
        setDevice,
        setDeviceByModel,
        isDevicePickerOpen,
        setIsDevicePickerOpen,
        openDevicePicker,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) {
    // Provide safe fallback if accessed outside provider
    const fallbackPhone = ALL_PHONE_MODELS[0];
    return {
      selectedBrand: "Apple",
      selectedModel: "iPhone 16 Pro Max",
      activePhone: fallbackPhone,
      setDevice: () => {},
      setDeviceByModel: () => {},
      isDevicePickerOpen: false,
      setIsDevicePickerOpen: () => {},
      openDevicePicker: () => {},
    };
  }
  return context;
}
