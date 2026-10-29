import api from './client'

export const resources = {
  products: {
    title: 'Məhsullar', singular: 'məhsul', endpoint: '/api/products', icon: 'package',
    fields: [
      { name: 'name', label: 'Məhsulun adı', required: true, maxLength: 200 },
      { name: 'description', label: 'Təsvir', type: 'textarea', maxLength: 2000 },
      { name: 'price', label: 'Qiymət (₼)', type: 'number', min: 0, step: '0.01', required: true },
      { name: 'stockQuantity', label: 'Stok sayı', type: 'number', min: 0, required: true },
    ], columns: [
      { key: 'name', label: 'Məhsul' }, { key: 'description', label: 'Təsvir' },
      { key: 'price', label: 'Qiymət', format: value => `${Number(value).toFixed(2)} ₼` },
      { key: 'stockQuantity', label: 'Stok' },
    ],
  },
  orders: {
    title: 'Sifarişlər', singular: 'sifariş', endpoint: '/api/orders', icon: 'truck',
    fields: [
      { name: 'customerName', label: 'Müştərinin adı', required: true, maxLength: 200 },
      { name: 'deliveryAddress', label: 'Çatdırılma ünvanı', type: 'textarea', required: true, maxLength: 500 },
      { name: 'status', label: 'Status', required: true, maxLength: 30 },
      { name: 'totalAmount', label: 'Ümumi məbləğ (₼)', type: 'number', min: 0, step: '0.01', required: true },
    ], columns: [
      { key: 'id', label: '№' }, { key: 'customerName', label: 'Müştəri' },
      { key: 'deliveryAddress', label: 'Ünvan' }, { key: 'status', label: 'Status', badge: true },
      { key: 'totalAmount', label: 'Məbləğ', format: value => `${Number(value).toFixed(2)} ₼` },
      { key: 'createdAt', label: 'Yaradılıb', format: value => new Date(value).toLocaleDateString('az-AZ') },
    ],
  },
  campaigns: {
    title: 'Kampaniyalar', singular: 'kampaniya', endpoint: '/api/campaigns', icon: 'tag',
    fields: [
      { name: 'name', label: 'Kampaniyanın adı', required: true, maxLength: 200 },
      { name: 'description', label: 'Təsvir', type: 'textarea', maxLength: 2000 },
      { name: 'discountPercentage', label: 'Endirim (%)', type: 'number', min: 0, max: 100, step: '0.01', required: true },
      { name: 'startsAt', label: 'Başlama vaxtı', type: 'datetime-local', required: true },
      { name: 'endsAt', label: 'Bitmə vaxtı', type: 'datetime-local', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Expired'], required: true },
    ], columns: [
      { key: 'name', label: 'Kampaniya' },
      { key: 'discountPercentage', label: 'Endirim', format: value => `${value}%` },
      { key: 'startsAt', label: 'Başlayır', format: value => new Date(value).toLocaleDateString('az-AZ') },
      { key: 'endsAt', label: 'Bitir', format: value => new Date(value).toLocaleDateString('az-AZ') },
      { key: 'status', label: 'Status', badge: true },
    ],
  },
}

export const getAll = key => api.get(resources[key].endpoint).then(response => response.data)
export const create = (key, data) => api.post(resources[key].endpoint, data)
export const update = (key, id, data) => api.put(`${resources[key].endpoint}/${id}`, data)
export const remove = (key, id) => api.delete(`${resources[key].endpoint}/${id}`)

export function toPayload(form, config) {
  return Object.fromEntries(config.fields.map(field => {
    let value = form[field.name]
    if (value === '') value = field.type === 'number' ? 0 : null
    if (field.type === 'number') value = Number(value)
    if (field.type === 'datetime-local' && value) value = new Date(value).toISOString()
    return [field.name, value]
  }))
}

export function fromRecord(record, config) {
  return Object.fromEntries(config.fields.map(field => {
    let value = record[field.name] ?? ''
    if (field.type === 'datetime-local' && value) {
      const date = new Date(value)
      value = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    }
    return [field.name, value]
  }))
}
