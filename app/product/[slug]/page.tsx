'use client';
import {useState} from "react";
import {useParams} from "next/navigation";
import Link from "next/link";
import {ShoppingBag,Minus,Plus,Check} from "lucide-react";
import {products,formatEGP} from "../../../lib/products";
import {addToCart} from "../../../lib/cart";
export default function ProductPage(){
 const params=useParams<{slug:string}>();const product=products.find(p=>p.id===params.slug)||products[0];const [qty,setQty]=useState(1);const [added,setAdded]=useState(false);
 return <main className="store-page"><header className="header wrap commerce-header"><Link className="logo" href="/">VOLT<span>.</span></Link><nav className="nav"><Link href="/shop">All products</Link><Link href="/shop?category=LED%20Bulbs">LED bulbs</Link><Link href="/shop?category=Switches%20%26%20Sockets">Switches & sockets</Link></nav><Link className="bag" href="/cart"><ShoppingBag size={17}/> Cart</Link></header>
 <div className="wrap product-breadcrumb"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {product.name}</div>
 <section className="wrap product-detail commerce-detail"><div className="detail-photo"><img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=1300&q=90`} alt={product.name}/></div><div className="product-detail-copy"><div className="eyebrow">{product.category} · {product.sku}</div><h1>{product.name}</h1><p className="detail-price">{formatEGP(product.price)}</p><p>{product.description}</p><div className="sample-alert">DEMO PRODUCT — sample listing. Verify supplier pricing, stock, specifications and certifications before purchase.</div>
 <div className="spec-list">{product.specs.map(s=><div key={s.label}><span>{s.label}</span><b>{s.value}</b></div>)}</div><div className="purchase-row"><div className="quantity-stepper"><button onClick={()=>setQty(q=>Math.max(1,q-1))} aria-label="Decrease quantity"><Minus size={14}/></button><span>{qty}</span><button onClick={()=>setQty(q=>q+1)} aria-label="Increase quantity"><Plus size={14}/></button></div><button className="button dark add-cart-button" onClick={()=>{addToCart(product.id,qty);setAdded(true)}}>{added?<><Check size={16}/> Added to cart</>:<>Add to cart <ShoppingBag size={16}/></>}</button></div><Link className="textlink back-shop" href="/shop">← Continue shopping</Link></div></section>
 <section className="wrap product-extra"><h2>Product <em>information.</em></h2><p>Detailed product descriptions, installation instructions, warranty terms and manufacturer datasheets will be displayed here once verified supplier information is connected.</p></section></main>
}