import type { Product } from "./products";
export type CartLine = { productId:string; quantity:number };
export const CART_KEY = "volt-cart-v1";
export function readCart():CartLine[] { if(typeof window==="undefined") return []; try { const raw=localStorage.getItem(CART_KEY); return raw?JSON.parse(raw) as CartLine[]:[]; } catch { return []; } }
export function writeCart(lines:CartLine[]) { if(typeof window==="undefined") return; localStorage.setItem(CART_KEY,JSON.stringify(lines)); window.dispatchEvent(new Event("volt-cart-updated")); }
export function addToCart(productId:string,quantity=1) { const lines=readCart(); const found=lines.find(x=>x.productId===productId); if(found) found.quantity+=quantity; else lines.push({productId,quantity}); writeCart(lines); }
export function cartCount(lines:CartLine[]) { return lines.reduce((sum,line)=>sum+line.quantity,0); }
export function cartTotal(lines:CartLine[],products:Product[]) { return lines.reduce((sum,line)=>sum+(products.find(p=>p.id===line.productId)?.price??0)*line.quantity,0); }
