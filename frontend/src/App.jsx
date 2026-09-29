import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackgroundFX from './components/BackgroundFX'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Detection from './pages/Detection'
import HealthyPlants from './pages/HealthyPlants'
import DiseaseLibrary from './pages/DiseaseLibrary'
import DiseaseDetails from './pages/DiseaseDetails'
import Models from './pages/Models'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import History from './pages/History'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function AppRoutes() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-leaf-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <BackgroundFX />
      <Navbar />
      <main id="main" className="flex-1">
        <div key={location.pathname} className="page-enter h-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/disease-detection" element={<Detection />} />
            <Route path="/healthy-plants" element={<HealthyPlants />} />
            <Route path="/disease-library" element={<DiseaseLibrary />} />
            <Route path="/disease-library/:key" element={<DiseaseDetails />} />
            <Route path="/models" element={<Models />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App