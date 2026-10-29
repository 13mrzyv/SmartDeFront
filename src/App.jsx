import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import ResourcePage from './pages/ResourcePage'

export default function App() {
  return <Routes><Route element={<AppLayout />}><Route index element={<Dashboard />} /><Route path="products" element={<ResourcePage resourceKey="products" />} /><Route path="orders" element={<ResourcePage resourceKey="orders" />} /><Route path="campaigns" element={<ResourcePage resourceKey="campaigns" />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes>
}
