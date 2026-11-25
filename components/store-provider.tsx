"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient } from "../lib/supabase/client";

type Currency = "EGP" | "SYP";
type Language = "en" | "ar";
type ProductPrices = { EGP: number; SYP: number | null };
type PriceMap = Record<string, ProductPrices>;
type StoreContextValue = {
  currency: Currency;
  language: Language;
  prices: PriceMap;
  setCurrency: (value: Currency) => void;
  setLanguage: (value: Language) => void;
  savePrices: (id: string, prices: ProductPrices) => Promise<void>;
  price: (id: string, defaultPrice: number) => number;
  format: (amount: number) => string;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const PREF_KEY = "volt-store-preferences-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("EGP");
  const [language, setLanguageState] = useState<Language>("en");
  const [prices, setPrices] = useState<PriceMap>({});

  useEffect(() => {
    try {
      const pref = JSON.parse(localStorage.getItem(PREF_KEY) || "{}");
      if (pref.currency === "EGP" || pref.currency === "SYP") setCurrencyState(pref.currency);
      if (pref.language === "en" || pref.language === "ar") setLanguageState(pref.language);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.language = language;
  }, [language]);

  useEffect(() => {
    let cancelled = false;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return;
    const supabase = createClient();
    supabase.from("products").select("id, price_egp, price_syp").then(({ data, error }) => {
      if (cancelled || error || !data) return;
      const next: PriceMap = {};
      data.forEach((row) => {
        next[row.id] = { EGP: Number(row.price_egp ?? 0), SYP: row.price_syp === null ? null : Number(row.price_syp) };
      });
      setPrices(next);
    });
    return () => { cancelled = true; };
  }, []);

  const setCurrency = (value: Currency) => {
    setCurrencyState(value);
    try { localStorage.setItem(PREF_KEY, JSON.stringify({ currency: value, language })); } catch {}
  };

  const setLanguage = (value: Language) => {
    setLanguageState(value);
    try { localStorage.setItem(PREF_KEY, JSON.stringify({ currency, language: value })); } catch {}
  };

  const savePrices = async (id: string, next: ProductPrices) => {
    const supabase = createClient();
    const { error } = await supabase.from("products").update({
      price_egp: next.EGP,
      price_syp: next.SYP,
    }).eq("id", id).select("id").single();
    if (error) throw error;
    setPrices((old) => ({ ...old, [id]: next }));
  };

  const price = (id: string, defaultPrice: number) => {
    const saved = prices[id];
    if (saved) return currency === "EGP" ? saved.EGP : (saved.SYP ?? 0);
    return currency === "EGP" ? defaultPrice : 0;
  };

  const format = (amount: number) => amount > 0
    ? new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-EG", {
        style: "currency", currency, maximumFractionDigits: 0,
      }).format(amount)
    : (language === "ar" ? "السعر غير محدد" : "Price not set");

  const value = useMemo(() => ({
    currency, language, prices, setCurrency, setLanguage, savePrices, price, format,
  }), [currency, language, prices]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}

export function StoreControls() {
  const { currency, language, setCurrency, setLanguage } = useStore();
  return (
    <div className="volt-store-controls" aria-label="Store preferences">
      <label><span className="sr-only">Currency</span>
        <select aria-label="Currency" value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
          <option value="EGP">EGP</option><option value="SYP">SYP</option>
        </select>
      </label>
      <span className="control-divider">|</span>
      <button type="button" onClick={() => setLanguage(language === "en" ? "ar" : "en")} aria-label="Switch language">
        {language === "en" ? "العربية" : "English"}
      </button>
    </div>
  );
}
