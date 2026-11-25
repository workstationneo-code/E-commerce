'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Warehouse, ChartNoAxesCombined, Settings, ArrowUpRight, Bell, Plus, LogOut } from 'lucide-react';
import { products } from '../../lib/products';
import { useStore } from '../../components/store-provider';
import { createClient } from '../../lib/supabase/client';

const rows = [
  ['ORD-1048', 'Mariam Hassan', '2 items', 'EGP 1,240', 'Processing'],
  ['ORD-1047', 'Omar Khaled', '5 items', 'SYP 18,500', 'Shipped'],
  ['ORD-1046', 'Nour Adel', '1 item', 'EGP 680', 'Delivered'],
  ['ORD-1045', 'Youssef Samir', '8 items', 'EGP 6,320', 'Pending'],
];

export default function Admin() {
  const router = useRouter();
  const [tab, setTab] = useState('Overview');
  const { currency, prices, savePrices } = useStore();
  const [selected, setSelected] = useState(products[0].id);
  const [egp, setEgp] = useState(String(products[0].price));
  const [syp, setSyp] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const product = products.find((item) => item.id === selected) || products[0];
    setEgp(String(prices[selected]?.EGP ?? product.price));
    setSyp(prices[selected]?.SYP == null ? '' : String(prices[selected].SYP));
  }, [selected, prices]);

  const choose = (id: string) => {
    setSelected(id);
    setSaved(false);
    setSaveError('');
  };

  const save = async () => {
    const egpValue = Number(egp);
    const sypValue = syp.trim() === '' ? null : Number(syp);
    if (!Number.isFinite(egpValue) || egpValue <= 0 ||
        (sypValue !== null && (!Number.isFinite(sypValue) || sypValue <= 0))) {
      setSaveError('Enter a valid EGP price. SYP can be left blank until you have a confirmed price.');
      return;
    }
    setSaving(true);
    setSaved(false);
    setSaveError('');
    try {
      await savePrices(selected, { EGP: egpValue, SYP: sypValue });
      setSaved(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not save the prices. Check your admin access and try again.');
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <a className="logo" href="/">VOLT<span>.</span></a>
        <small>COMMERCE ADMIN</small>
        <div className="admin-nav">
          {[
            ['Overview', LayoutDashboard], ['Products', Package], ['Pricing', Settings],
            ['Orders', ShoppingCart], ['Customers', Users], ['Inventory', Warehouse],
            ['Analytics', ChartNoAxesCombined],
          ].map(([name, Icon]: any) => (
            <button className={tab === name ? 'selected' : ''} onClick={() => setTab(name)} key={name}>
              <Icon size={17} />{name}
            </button>
          ))}
        </div>
        <div className="side-bottom">
          <div className="admin-avatar">VO</div>
          <div><b>VOLT Admin</b><small>Signed-in administrator</small></div>
          <button type="button" onClick={signOut} aria-label="Sign out" title="Sign out"><LogOut size={17}/></button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div><span className="eyebrow">VOLT / STORE MANAGEMENT</span><h1>{tab}</h1></div>
          <div className="admin-actions"><span>{currency}</span><button type="button" aria-label="Notifications"><Bell size={18}/></button><a className="view-store" href="/">View store <ArrowUpRight size={14}/></a></div>
        </header>
        {tab === 'Pricing' ? (
          <section className="admin-panel pricing-editor">
            <div className="eyebrow">LIVE DATABASE PRICING</div>
            <h2>Product pricing</h2>
            <p>Set separate EGP and SYP prices. Changes are saved to the VOLT database and shared with customers.</p>
            <label>Choose product
              <select value={selected} onChange={(event) => choose(event.target.value)}>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
              </select>
            </label>
            <div className="price-edit-grid">
              <label>Egyptian pound (EGP)
                <input type="number" min="0.01" step="0.01" value={egp} onChange={(event) => { setEgp(event.target.value); setSaved(false); }} placeholder="Enter EGP price"/>
              </label>
              <label>Syrian pound (SYP)
                <input type="number" min="0.01" step="0.01" value={syp} onChange={(event) => { setSyp(event.target.value); setSaved(false); }} placeholder="Leave blank if not set"/>
              </label>
            </div>
            <button className="button dark" type="button" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save product prices'} <ArrowUpRight size={15}/>
            </button>
            {saved && <p className="save-confirm" role="status">Prices saved successfully to the VOLT database.</p>}
            {saveError && <p className="login-error" role="alert">{saveError}</p>}
            <p className="demo-note">SYP is never automatically converted from EGP. Leave it blank until you confirm the correct SYP price. Product sample status is managed separately.</p>
          </section>
        ) : (
          <>
            <div className="admin-welcome">
              <div><span>YOUR STORE AT A GLANCE</span><h2>Good afternoon. <em>Here's the picture.</em></h2><p>A calm overview of what needs your attention today.</p></div>
              <button className="button dark" onClick={() => setTab('Pricing')}><Plus size={16}/> Edit product prices</button>
            </div>
            <div className="stats-grid">
              {[
                ['Gross sales', currency === 'EGP' ? 'EGP 48,250' : 'SYP 130,275', '+12.8%'],
                ['Orders', '126', '+8.2%'], ['Customers', '842', '+5.4%'], ['Products', String(products.length), 'catalogue'],
              ].map(([label, value, change]) => <div className="stat-card" key={label}><span>{label}</span><strong>{value}</strong><small>{change} this month</small></div>)}
            </div>
            <div className="admin-panels">
              <section className="admin-panel">
                <div className="panel-head"><div><span className="eyebrow">PERFORMANCE</span><h3>Sales overview</h3></div></div>
                <div className="chart-bars">{[42,65,52,78,58,88,72,95,62,82,70,100].map((height,index) => <div key={index}><span style={{height:`${height}%`}}/><small>{['M','T','W','T','F','S','S','M','T','W','T','F'][index]}</small></div>)}</div>
              </section>
              <section className="admin-panel attention">
                <div className="panel-head"><div><span className="eyebrow">NEEDS A LOOK</span><h3>Store attention</h3></div><span className="attention-count">3</span></div>
                <div className="attention-item"><b>Low stock items</b><small>8 products need restocking</small></div>
                <div className="attention-item"><b>Orders to process</b><small>4 orders awaiting action</small></div>
              </section>
            </div>
            <section className="admin-panel orders-panel">
              <div className="panel-head"><div><span className="eyebrow">THE LATEST</span><h3>Recent orders</h3></div><button className="textlink" onClick={() => setTab('Orders')}>View all <ArrowUpRight size={14}/></button></div>
              <div className="table-wrap"><table><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>ITEMS</th><th>TOTAL</th><th>STATUS</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell,index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
            </section>
          </>
        )}
        <p className="demo-note">Authentication and product pricing use Supabase. Orders, customer figures, inventory and analytics remain sample dashboard data until those modules are connected.</p>
      </main>
    </div>
  );
}
