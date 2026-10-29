import { useEffect, useState } from 'react'
import { Activity, ArrowRight, Package, Tag, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAll, resources } from '../api/resources'

const icons = { products: Package, orders: Truck, campaigns: Tag }
export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  async function load() {
    setLoading(true); setError('')
    try { const entries = await Promise.all(Object.keys(resources).map(async key => [key, await getAll(key)])); setData(Object.fromEntries(entries)) }
    catch (exception) { setError(exception.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const cards = data ? [
    { label: 'Məhsullar', value: data.products.length, note: `Stokda ${data.products.reduce((sum, item) => sum + (item.stockQuantity || 0), 0)} vahid`, key: 'products' },
    { label: 'Sifarişlər', value: data.orders.length, note: `${data.orders.filter(item => item.status?.toLowerCase() === 'pending').length} gözləyir`, key: 'orders' },
    { label: 'Kampaniyalar', value: data.campaigns.length, note: `${data.campaigns.filter(item => item.status === 'Active').length} aktiv`, key: 'campaigns' },
  ] : []
  return <>
    <div className="page-heading"><div><div className="eyebrow">SMARTDE İDARƏETMƏ</div><h1>İdarə paneli</h1><p>Biznesinizin ümumi vəziyyətinə nəzər salın.</p></div><button className="button button-secondary refresh-button" onClick={load} disabled={loading}><Activity size={16} /> Yenilə</button></div>
    {error && <div className="error-banner"><strong>Məlumat yüklənmədi.</strong> {error}<span> API serverinin işlədiyini və .env faylındakı ünvanı yoxlayın.</span><button className="button button-secondary" onClick={load}>Yenidən yoxla</button></div>}
    {loading && <div className="loading-line"><span className="spinner" /> API-dən məlumatlar yüklənir…</div>}
    {data && <><div className="stats-grid">{cards.map(card => { const Icon = icons[card.key]; return <Link to={`/${card.key}`} className="stat-card" key={card.key}><div className="stat-top"><span>{card.label}</span><div className="stat-icon"><Icon size={18} /></div></div><div className="stat-value">{card.value}</div><div className="stat-note">{card.note}</div><ArrowRight className="stat-arrow" size={16} /></Link> })}</div>
      <section className="panel quick-panel"><div className="panel-header"><div><h2>Modullar</h2><p>İdarə etmək istədiyiniz bölməni seçin.</p></div></div><div className="module-list">{cards.map(card => { const Icon = icons[card.key]; return <Link className="module-row" to={`/${card.key}`} key={card.key}><div className="module-icon"><Icon size={19} /></div><div className="module-copy"><strong>{resources[card.key].title}</strong><span>{card.value} qeyd</span></div><ArrowRight size={17} className="module-arrow" /></Link> })}</div></section>
    </>}
  </>
}
