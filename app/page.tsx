'use client';
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Search, ShoppingBag, Menu, X, Zap, ShieldCheck, Truck, Headphones, Heart } from "lucide-react";
import Link from "next/link";
import { products, categories, formatEGP } from "../lib/products";
import { addToCart, cartCount, readCart, type CartLine } from "../lib/cart";

function RevealLine({text,italic=false}:{text:string;italic?:boolean}) {
 return <span className={italic?"reveal-line reveal-italic":"reveal-line"} aria-hidden="true">{Array.from(text).map((char,i)=><span className="reveal-mask" key={i}><span className="reveal-char" style={{animationDelay:`${180+i*38}ms`}}>{char===" "?"\u00a0":char}</span></span>)}</span>;
}
export default function Home() {
 const [cart,setCart]=useState<CartLine[]>([]);
 const [menu,setMenu]=useState(false);
 const [query,setQuery]=useState("");
 const [saved,setSaved]=useState<string[]>([]);
 const [introActive,setIntroActive]=useState(false);
 const [introChecked,setIntroChecked]=useState(false);
 useEffect(()=>{
  const key="volt-intro-played";
  if(sessionStorage.getItem(key)){setIntroChecked(true);return;}
  setIntroActive(true);
  setIntroChecked(true);
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timer=window.setTimeout(()=>{sessionStorage.setItem(key,"1");setIntroActive(false);},reduced?650:2850);
  return()=>window.clearTimeout(timer);
 },[]);
 useEffect(()=>{const sync=()=>setCart(readCart());sync();window.addEventListener("volt-cart-updated",sync);return()=>window.removeEventListener("volt-cart-updated",sync)},[]);
 const featured=useMemo(()=>products.filter(p=>p.featured&&(`${p.name} ${p.category} ${p.shortDescription}`.toLowerCase().includes(query.toLowerCase()))),[query]);
 const count=cartCount(cart);
 return <>
 <main className={introChecked?"volt-page-enter":"volt-page-hidden"}>
  <div className="topline">VOLT ELECTRICAL STORE <span>·</span> SHOP LIGHTING, SWITCHES & ELECTRICAL ESSENTIALS</div>
  <header className="header wrap commerce-header">
   <button className="iconbtn mobile" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">{menu?<X/>:<Menu/>}</button>
   <Link className="logo" href="/">VOLT<span>.</span></Link>
   <nav className={menu?"nav open":"nav"}><Link href="/shop">All products</Link><Link href="/shop?category=LED%20Bulbs">LED bulbs</Link><Link href="/shop?category=Decorative%20Lighting">Lighting</Link><Link href="/shop?category=Switches%20%26%20Sockets">Switches & sockets</Link><Link href="/shop?category=Protection%20%26%20Distribution">Protection</Link></nav>
   <div className="head-actions"><Link className="bag" href="/cart"><ShoppingBag size={18}/><span>Cart ({count})</span></Link></div>
  </header>
  <section className="shop-hero wrap">
   <div className="shop-hero-copy"><div className="eyebrow"><span className="dot"/> ELECTRICAL ESSENTIALS, ALL IN ONE PLACE</div>
    <h1 aria-label="Everything your space needs."><RevealLine text="Everything your"/><br/><em><RevealLine text="space needs." italic/></em></h1>
    <p>Discover lighting, switches and reliable electrical essentials for every room, project and everyday need.</p>
    <div className="hero-actions"><Link className="button dark" href="/shop">Shop all products <ArrowUpRight size={16}/></Link><Link className="textlink" href="#popular">Explore best sellers <ArrowRight size={15}/></Link></div>
   </div>
   <div className="shop-hero-image"><img src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1400&q=85" alt="Modern pendant lighting in an interior"/><div className="shop-hero-caption"><span>VOLT / LIGHTING</span><b>Find the right light for your space.</b></div></div>
  </section>
  <section className="trust wrap"><div><Zap/><span>Everyday essentials</span></div><div><ShieldCheck/><span>Product details that matter</span></div><div><Truck/><span>Delivery options at checkout</span></div><div><Headphones/><span>Support when you need it</span></div></section>
  <section className="commerce-categories wrap">
   <div className="section-head"><div><div className="eyebrow">BROWSE THE STORE</div><h2>Shop by <em>category.</em></h2></div><Link className="textlink" href="/shop">View all products <ArrowUpRight size={15}/></Link></div>
   <div className="commerce-category-grid">
    <Link href="/shop?category=LED%20Bulbs" className="commerce-category"><img src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80" alt="Lighting"/><span>01</span><b>LED bulbs</b><small>Shop lighting <ArrowUpRight size={13}/></small></Link>
    <Link href="/shop?category=Decorative%20Lighting" className="commerce-category"><img src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80" alt="Decorative lighting"/><span>02</span><b>Decorative lighting</b><small>Explore collection <ArrowUpRight size={13}/></small></Link>
    <Link href="/shop?category=Switches%20%26%20Sockets" className="commerce-category"><img src="https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80" alt="Switches and sockets"/><span>03</span><b>Switches & sockets</b><small>Shop essentials <ArrowUpRight size={13}/></small></Link>
    <Link href="/shop?category=Protection%20%26%20Distribution" className="commerce-category"><img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80" alt="Electrical protection"/><span>04</span><b>Protection & distribution</b><small>Browse products <ArrowUpRight size={13}/></small></Link>
   </div>
  </section>
  <section className="commerce-products" id="popular"><div className="wrap">
   <div className="section-head"><div><div className="eyebrow">PICKED FOR YOU</div><h2>Popular <em>products.</em></h2></div><Link className="textlink" href="/shop">Shop the full catalogue <ArrowUpRight size={15}/></Link></div>
   <label className="commerce-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products by name or category"/></label>
   <div className="commerce-product-grid">{featured.map(p=><article className="commerce-product" key={p.id}>
    <Link href={`/product/${p.id}`} className="commerce-product-image"><img src={`https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=850&q=85`} alt={p.name}/>{p.badge&&<span className="tag">{p.badge}</span>}</Link>
    <button className={saved.includes(p.id)?"heart saved":"heart"} aria-label="Save product" onClick={()=>setSaved(s=>s.includes(p.id)?s.filter(x=>x!==p.id):[...s,p.id])}><Heart size={17} fill={saved.includes(p.id)?"currentColor":"none"}/></button>
    <div className="commerce-product-info"><div><small>{p.category}</small><Link href={`/product/${p.id}`}><h3>{p.name}</h3></Link><p>{p.shortDescription}</p></div><b>{formatEGP(p.price)}</b></div>
    <button className="commerce-add" onClick={()=>addToCart(p.id)}>Add to cart <span>+</span></button>
   </article>)}</div>
   <p className="catalogue-disclaimer">Demo catalogue: displayed products, prices and technical details are sample content and must be replaced with verified stock and supplier data before accepting orders.</p>
  </div></section>
  <section className="store-help wrap"><div><div className="eyebrow">NEED HELP FINDING THE RIGHT ITEM?</div><h2>Let's find the right <em>solution.</em></h2><p>Browse the catalogue or contact the store team for help with product selection and availability.</p><Link className="button dark" href="/shop">Browse all products <ArrowUpRight size={16}/></Link></div><div className="store-help-mark"><ShoppingBag size={42}/><span>VOLT STORE</span></div></section>
  <footer><div className="wrap footer-top"><div><Link className="logo" href="/">VOLT<span>.</span></Link><p>Electrical products for homes,<br/>spaces and everyday projects.</p></div><div><b>Shop</b><Link href="/shop">All products</Link><Link href="/shop?category=LED%20Bulbs">LED bulbs</Link><Link href="/shop?category=Switches%20%26%20Sockets">Switches & sockets</Link></div><div><b>Customer care</b><Link href="/account">My account</Link><Link href="/cart">Shopping cart</Link><Link href="/checkout">Checkout</Link></div><div><b>Need a hand?</b><a href="mailto:hello@volt.example">Contact the store</a><Link href="/admin">Admin access</Link></div></div><div className="wrap footer-bottom"><span>© 2026 VOLT. Sample storefront.</span><span>EGP pricing preview</span><span>Electrical essentials, online.</span></div></footer>
 </main>
 {introActive&&<div className="volt-intro" role="status" aria-label="Opening VOLT store">
  <div className="volt-intro-orbit volt-orbit-one"/><div className="volt-intro-orbit volt-orbit-two"/>
  <div className="volt-intro-content">
   <div className="volt-intro-symbol"><span>V</span><i/></div>
   <div className="volt-intro-wordmark">VOLT<span>.</span></div>
   <p>POWERING EVERY SPACE</p>
   <div className="volt-intro-progress"><span/></div>
  </div>
  <div className="volt-intro-bottom"><span>LIGHTING</span><span>·</span><span>ELECTRICAL</span><span>·</span><span>ESSENTIALS</span></div>
 </div>}
 <style jsx global>{`
  .volt-page-hidden{opacity:0;visibility:hidden}
  .volt-page-enter{animation:volt-page-arrive .95s cubic-bezier(.22,1,.36,1) both}
  @keyframes volt-page-arrive{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  .volt-intro{position:fixed;inset:0;z-index:9999;overflow:hidden;background:#20251f;color:#f4f4ec;display:grid;place-items:center;animation:volt-intro-exit .6s cubic-bezier(.76,0,.24,1) 2.25s both}
  .volt-intro:before,.volt-intro:after{content:"";position:absolute;width:min(72vw,720px);aspect-ratio:1;border:1px solid rgba(205,216,190,.11);border-radius:50%;animation:volt-orbit-in 1.5s cubic-bezier(.16,1,.3,1) both}
  .volt-intro:after{width:min(54vw,540px);animation-delay:.12s;border-color:rgba(205,216,190,.17)}
  .volt-intro-orbit{position:absolute;width:min(90vw,900px);height:1px;background:linear-gradient(90deg,transparent,rgba(199,214,183,.3),transparent);transform:rotate(-34deg);animation:volt-scan 1.8s ease-in-out both}
  .volt-orbit-two{transform:rotate(34deg);animation-delay:.18s;opacity:.55}
  .volt-intro-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;animation:volt-brand-in .9s cubic-bezier(.16,1,.3,1) .18s both}
  .volt-intro-symbol{width:64px;height:64px;border:1px solid rgba(199,214,183,.65);border-radius:50%;display:grid;place-items:center;position:relative;margin-bottom:23px;color:#c4d0b6}
  .volt-intro-symbol span{font-family:Georgia,serif;font-size:34px;font-style:italic;transform:translateX(-2px)}
  .volt-intro-symbol i{position:absolute;width:8px;height:8px;border-radius:50%;background:#c4d0b6;right:7px;top:8px;box-shadow:0 0 18px #c4d0b6}
  .volt-intro-wordmark{font-size:clamp(52px,9vw,88px);font-weight:700;letter-spacing:-7px;line-height:1}
  .volt-intro-wordmark span{color:#a6b397}
  .volt-intro-content p{font-size:8px;letter-spacing:4px;color:#aeb7a5;margin:17px 0 30px}
  .volt-intro-progress{height:1px;width:150px;background:rgba(255,255,255,.17);overflow:hidden}
  .volt-intro-progress span{display:block;height:100%;background:#c4d0b6;transform:scaleX(0);transform-origin:left;animation:volt-progress 2.15s cubic-bezier(.4,0,.2,1) .2s forwards}
  .volt-intro-bottom{position:absolute;bottom:34px;left:0;right:0;display:flex;justify-content:center;gap:13px;color:#899486;font-size:7px;letter-spacing:2px;animation:volt-brand-in 1s ease .5s both}
  @keyframes volt-brand-in{from{opacity:0;transform:translateY(22px);filter:blur(8px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
  @keyframes volt-orbit-in{from{opacity:0;transform:scale(.72)}to{opacity:1;transform:scale(1)}}
  @keyframes volt-scan{0%{opacity:0;transform:translateY(-80px) rotate(-34deg)}35%{opacity:1}100%{opacity:0;transform:translateY(80px) rotate(-34deg)}}
  @keyframes volt-progress{to{transform:scaleX(1)}}
  @keyframes volt-intro-exit{0%{opacity:1;clip-path:inset(0 0 0 0)}100%{opacity:0;clip-path:inset(0 0 100% 0);visibility:hidden;pointer-events:none}}
  .shop-hero h1 .reveal-line{display:inline-block;white-space:nowrap}
  .shop-hero h1 .reveal-mask{display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.08em;margin-bottom:-.08em}
  .shop-hero h1 .reveal-char{display:inline-block;transform:translateY(115%);clip-path:inset(0 0 100% 0);animation:volt-masked-rise .95s cubic-bezier(.22,1,.36,1) forwards;will-change:transform,clip-path}
  @media(prefers-reduced-motion:reduce){.volt-page-enter{animation:none}.volt-intro{animation-duration:.1s;animation-delay:.5s}.volt-intro *{animation-duration:.1s!important}.shop-hero h1 .reveal-char{animation:none;transform:none;clip-path:none}}
 `}</style>
 </>;
}
