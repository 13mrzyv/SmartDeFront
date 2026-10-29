import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, LoaderCircle, Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react'
import { create, getAll, remove, resources, update } from '../api/resources'
import Modal from '../components/Modal'
import ResourceForm from '../components/ResourceForm'

export default function ResourcePage({ resourceKey }) {
  const config = resources[resourceKey]
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setRows(await getAll(resourceKey)) } catch (exception) { setError(exception.message) } finally { setLoading(false) }
  }, [resourceKey])
  useEffect(() => { load() }, [load])

  async function save(payload) {
    setBusy(true)
    try { if (editor.record) await update(resourceKey, editor.record.id, payload); else await create(resourceKey, payload); setEditor(null); await load() }
    finally { setBusy(false) }
  }
  async function confirmDelete() {
    setBusy(true)
    try { await remove(resourceKey, deleting.id); setDeleting(null); await load() } catch (exception) { setError(exception.message); setDeleting(null) } finally { setBusy(false) }
  }
  const filtered = rows.filter(row => Object.values(row).some(value => String(value ?? '').toLowerCase().includes(search.toLowerCase())))

  return <>
    <div className="page-heading"><div><div className="eyebrow">MƏLUMATLARIN İDARƏ EDİLMƏSİ</div><h1>{config.title}</h1><p>Qeydləri əlavə edin, redaktə edin və idarə edin.</p></div><button className="button button-primary" onClick={() => setEditor({ record: null })}><Plus size={17} /> Yeni {config.singular}</button></div>
    {error && <div className="error-banner"><AlertCircle size={18} /><span>{error}</span><button className="icon-button" onClick={() => setError('')} aria-label="Bağla">×</button></div>}
    <section className="panel data-panel"><div className="panel-header table-toolbar"><div><h2>{config.title} siyahısı</h2><p>{loading ? 'Yüklənir…' : `${rows.length} qeyd`}</p></div><div className="toolbar-actions"><label className="search-box"><Search size={16} /><input placeholder="Axtar…" value={search} onChange={event => setSearch(event.target.value)} /></label><button className="icon-button" onClick={load} disabled={loading} title="Yenilə" aria-label="Yenilə"><RefreshCw size={17} /></button></div></div>
      <div className="table-wrap"><table><thead><tr>{config.columns.map(column => <th key={column.key}>{column.label}</th>)}<th className="actions-column">Əməliyyatlar</th></tr></thead><tbody>
        {loading && <tr><td colSpan={config.columns.length + 1} className="table-state"><LoaderCircle className="spin" size={22} /> Məlumatlar yüklənir…</td></tr>}
        {!loading && filtered.map(row => <tr key={row.id}>{config.columns.map(column => <td key={column.key}>{column.badge ? <span className={`badge badge-${String(row[column.key] || '').toLowerCase()}`}>{row[column.key] || '—'}</span> : column.format ? column.format(row[column.key]) : row[column.key] || <span className="muted">—</span>}</td>)}<td className="row-actions"><button className="icon-button edit-button" title="Redaktə et" aria-label="Redaktə et" onClick={() => setEditor({ record: row })}><Pencil size={16} /></button><button className="icon-button delete-button" title="Sil" aria-label="Sil" onClick={() => setDeleting(row)}><Trash2 size={16} /></button></td></tr>)}
        {!loading && filtered.length === 0 && <tr><td colSpan={config.columns.length + 1} className="table-state">{rows.length ? 'Axtarışa uyğun nəticə yoxdur.' : 'Hələ məlumat əlavə edilməyib.'}</td></tr>}
      </tbody></table></div><div className="table-footer">Göstərilir: {filtered.length} / {rows.length}</div>
    </section>
    {editor && <Modal title={editor.record ? `${config.singular} məlumatını redaktə et` : `Yeni ${config.singular}`} onClose={() => setEditor(null)} wide><ResourceForm config={config} record={editor.record} onSubmit={save} onCancel={() => setEditor(null)} busy={busy} /></Modal>}
    {deleting && <Modal title="Silməni təsdiqləyin" onClose={() => !busy && setDeleting(null)}><div className="confirm-body"><div className="confirm-icon"><Trash2 size={20} /></div><p><strong>{deleting.name || deleting.customerName || `#${deleting.id}`}</strong> qeydini silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarılmır.</p><div className="modal-actions"><button className="button button-secondary" disabled={busy} onClick={() => setDeleting(null)}>Ləğv et</button><button className="button button-danger" disabled={busy} onClick={confirmDelete}>{busy ? 'Silinir…' : 'Bəli, sil'}</button></div></div></Modal>}
  </>
}
