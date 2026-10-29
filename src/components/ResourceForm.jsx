import { useEffect, useState } from 'react'
import { fromRecord, toPayload } from '../api/resources'

export default function ResourceForm({ config, record, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(() => fromRecord(record || {}, config))
  const [error, setError] = useState('')
  useEffect(() => setForm(fromRecord(record || {}, config)), [record, config])

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (config.fields.some(field => field.name === 'endsAt') && new Date(form.endsAt) <= new Date(form.startsAt)) {
      setError('Bitmə vaxtı başlama vaxtından sonra olmalıdır.')
      return
    }
    try { await onSubmit(toPayload(form, config)) } catch (exception) { setError(exception.message) }
  }

  return <form onSubmit={submit} className="form-body">
    <div className="form-grid">
      {config.fields.map(field => <label className={`field ${field.type === 'textarea' ? 'field-full' : ''}`} key={field.name}>
        <span>{field.label}{field.required && <b className="required"> *</b>}</span>
        {field.type === 'textarea'
          ? <textarea rows="3" maxLength={field.maxLength} required={field.required} value={form[field.name]} onChange={event => setForm({ ...form, [field.name]: event.target.value })} />
          : field.type === 'select'
            ? <select required={field.required} value={form[field.name]} onChange={event => setForm({ ...form, [field.name]: event.target.value })}>{field.options.map(option => <option key={option}>{option}</option>)}</select>
            : <input type={field.type || 'text'} min={field.min} max={field.max} step={field.step} maxLength={field.maxLength} required={field.required} value={form[field.name]} onChange={event => setForm({ ...form, [field.name]: event.target.value })} />}
      </label>)}
    </div>
    {error && <div className="inline-error">{error}</div>}
    <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onCancel}>Ləğv et</button><button className="button button-primary" disabled={busy}>{busy ? 'Yadda saxlanılır…' : 'Yadda saxla'}</button></div>
  </form>
}
