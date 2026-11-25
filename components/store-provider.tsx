"use client";
import {createContext,useContext,useEffect,useMemo,useState, type ReactNode} from "react";
import {products as catalogue} from "../lib/products";
type Currency="EGP"|"SYP"; type Language="en"|"ar";
type PriceMap=Record<string,{EGP:number;SYP:number}>;
type StoreContextValue={currency:Currency;language:Language;prices:PriceMap;setCurrency:(v:Currency)=>void;setLanguage:(v:Language)=>void;savePrices:(id:string,prices:{EGP:number;SYP:number})=>void;price:(id:string,defaultPrice:number)=>number;format:(amount:number)=>string};
const StoreContext=createContext<StoreContextValue|null>(null);
const PREF_KEY="volt-store-preferences-v1"; const PRICE_KEY="volt-product-prices-v1";
export function StoreProvider({children}:{children:ReactNode}){
 const [currency,setCurrencyState]=useState<Currency>("EGP"); const [language,setLanguageState]=useState<Language>("en"); const [prices,setPrices]=useState<PriceMap>({});
 useEffect(()=>{try{const pref=JSON.parse(localStorage.getItem(PREF_KEY)||"{}");if(pref.currency==="EGP"||pref.currency==="SYP")setCurrencyState(pref.currency);if(pref.language==="en"||pref.language==="ar")setLanguageState(pref.language);const saved=JSON.parse(localStorage.getItem(PRICE_KEY)||"{}");setPrices(saved)}catch{}},[]);
 useEffect(()=>{document.documentElement.lang=language;document.documentElement.dir=language==="ar"?"rtl":"ltr";document.documentElement.dataset.language=language;},[language]);
 const setCurrency=(v:Currency)=>{setCurrencyState(v);try{localStorage.setItem(PREF_KEY,JSON.stringify({currency:v,language}))}catch{}};
 const setLanguage=(v:Language)=>{setLanguageState(v);try{localStorage.setItem(PREF_KEY,JSON.stringify({currency,language:v}))}catch{}};
 const savePrices=(id:string,next:{EGP:number;SYP:number})=>{setPrices(old=>{const updated={...old,[id]:next};try{localStorage.setItem(PRICE_KEY,JSON.stringify(updated))}catch{}return updated})};
 const price=(id:string,base:number)=>prices[id]?.[currency]??(currency==="EGP"?base:0);
 const format=(amount:number)=>amount>0?new Intl.NumberFormat(language==="ar"?"ar-EG":"en-EG",{style:"currency",currency,maximumFractionDigits:0}).format(amount):(language==="ar"?"السعر غير محدد":"Price not set");
 const value=useMemo(()=>({currency,language,prices,setCurrency,setLanguage,savePrices,price,format}),[currency,language,prices]);
 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore(){const value=useContext(StoreContext);if(!value)throw new Error("useStore must be used inside StoreProvider");return value}
export function StoreControls(){const {currency,language,setCurrency,setLanguage}=useStore();return <div className="volt-store-controls" aria-label="Store preferences"><label><span className="sr-only">Currency</span><select aria-label="Currency" value={currency} onChange={e=>setCurrency(e.target.value as Currency)}><option value="EGP">EGP</option><option value="SYP">SYP</option></select></label><span className="control-divider">|</span><button type="button" onClick={()=>setLanguage(language==="en"?"ar":"en")} aria-label="Switch language">{language==="en"?"العربية":"English"}</button></div>}
