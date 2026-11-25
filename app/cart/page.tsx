'use client';
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ShoppingBag,Minus,Plus,Trash2} from "lucide-react";
import {products,formatEGP} from "../../lib/products";
import {readCart,writeCart,type CartLine} from "../../lib/cart";
import {StoreControls,useStore} from "../../components/store-provider";
export default function CartPage(){
 const {price,format}=useStore();
 const [lines,setLines]=useState<CartLine[]>([]);
 useEffect(()=>{setLines(readCart())},[]);
 const total=useMemo(()=>lines.reduce((sum,line)=>{const p=products.find(x=>x.id===line.productId);return sum+(p?price(p.id,p.price):0)*line.quantity},0),[lines,price]);
 const update=(id:string,quantity:number)=>{const next=lines.map(x=>x.productId===id?{...x,quantity}:x).filter(x=>x.quantity>0);setLines(next);writeCart(next)};
 const clear=()=>{setLines([]);writeCart([])};
 return <main className="store-page"><header className="header wrap commerce-header"><Link className="logo" href="/">VOLT<span>.</span></Link><nav className="nav"><Link href="/shop">Continue shopping</Link></nav><div className="head-actions"><StoreControls/><span className="bag"><ShoppingBag size={17}/> Your cart</span></div></header>
 <section className="wrap cart-page"><div className="eyebrow">YOUR VOLT ORDER</div><h1>Shopping <em>cart.</em></h1>{lines.length===0?<div className="cart-empty"><ShoppingBag size={34}/><h2>Your cart is empty.</h2><p>Explore the catalogue and add products to your cart.</p><Link className="button dark" href="/shop">Start shopping <span>↗</span></Link></div>:<div className="cart-layout"><div className="cart-lines">{lines.map(line=>{const p=products.find(x=>x.id===line.productId);if(!p)return null;return <article className="cart-line" key={p.id}><Link href={`/product/${p.id}`} className="cart-line-image"><img src={`https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=400&q=80`} alt={p.name}/></Link><div className="cart-line-info"><small>{p.category}</small><Link href={`/product/${p.id}`}><b>{p.name}</b></Link><span>{format(price(p.id,p.price))}</span><div className="quantity-stepper"><button onClick={()=>update(p.id,line.quantity-1)} aria-label="Decrease"><Minus size={13}/></button><span>{line.quantity}</span><button onClick={()=>update(p.id,line.quantity+1)} aria-label="Increase"><Plus size={13}/></button></div></div><button className="remove-line" onClick={()=>update(p.id,0)} aria-label="Remove product"><Trash2 size={16}/></button><b className="line-total">{format(price(p.id,p.price)*line.quantity)}</b></article>})}<button className="clear-cart" onClick={clear}>Clear cart</button></div><aside className="order-summary"><h2>Order summary</h2><div><span>Subtotal</span><b>{format(total)}</b></div><div><span>Delivery</span><small>Calculated at checkout</small></div><div className="summary-total"><span>Total</span><b>{formatEGP(total)}</b></div><Link className="button dark checkout-link" href="/checkout">Continue to checkout <span>→</span></Link><p>Demo cart. Orders are not yet submitted or paid for.</p></aside></div>}</section></main>
}