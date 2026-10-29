import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Boxes, ChevronRight, LayoutDashboard, Menu, Package, Tag, Truck, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { to: '/', label: 'İdarə paneli', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Məhsullar', icon: Package },
  { to: '/orders', label: 'Sifarişlər', icon: Truck },
  { to: '/campaigns', label: 'Kampaniyalar', icon: Tag },
]
const titles = { '/': 'İdarə paneli', '/products': 'Məhsullar', '/orders': 'Sifarişlər', '/campaigns': 'Kampaniyalar' }

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const title = titles[location.pathname] || 'Səhifə'
  return <div className="app-shell">
    {open && <button className="mobile-scrim" onClick={() => setOpen(false)} aria-label="Menyunu bağla" />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Boxes size={20} /></div><span>Smart<span className="brand-accent">De</span></span><button className="icon-button sidebar-close" onClick={() => setOpen(false)} aria-label="Bağla"><X size={18} /></button></div>
      <div className="nav-caption">İDARƏETMƏ</div>
      <nav className="side-nav">{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}><Icon size={18} /><span>{label}</span>{to === location.pathname && <ChevronRight size={16} className="nav-arrow" />}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="status-dot" /> API idarəetmə paneli</div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="icon-button menu-toggle" onClick={() => setOpen(true)} aria-label="Menyunu aç"><Menu size={20} /></button><div className="breadcrumb"><span>SmartDe</span><ChevronRight size={15} /><strong>{title}</strong></div><div className="topbar-right"><span className="connection-pill"><i /> İdarəetmə paneli</span><div className="avatar">SD</div></div></header>
      <div className="page-content"><Outlet /></div>
    </main>
  </div>
}
