import { Navigate, Route, Routes } from 'react-router-dom'
import Chat from './pages/Chat'
import Login from './pages/Login'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDocuments from './pages/admin/AdminDocuments'
import AdminSettings from './pages/admin/AdminSettings'
import AdminKnowledgeGraph from './pages/admin/AdminKnowledgeGraph'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="knowledge-graph" element={<AdminKnowledgeGraph />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
