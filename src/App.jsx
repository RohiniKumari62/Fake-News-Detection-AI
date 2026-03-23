import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Analyzer from './pages/Analyzer'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import NewsFeed from './pages/NewsFeed'
import DNATracker from './pages/DNATracker'
import BiasScanner from './pages/BiasScanner'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="analyze"  element={<Analyzer />} />
          <Route path="feed"     element={<NewsFeed />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="history"  element={<History />} />
          <Route path="dna"      element={<DNATracker />} />
          <Route path="bias"     element={<BiasScanner />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}