import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import RoleBanner from './components/RoleBanner';
import ToastContainer from './components/ToastContainer';
import EventModal from './components/EventModal';
import LoginModal from './components/LoginModal';
import DashboardView from './views/DashboardView';
import EventsView from './views/EventsView';
import ExcelUploadView from './views/ExcelUploadView';
import ApprenticePortal from './views/ApprenticePortal';
import { KeyRound, Building2 } from 'lucide-react';

function MainLayout() {
  const { activeTab, setActiveTab } = useApp();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenEventModal = (event = null) => {
    setEventToEdit(event);
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setEventToEdit(null);
    setIsEventModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 selection:bg-amber-600 selection:text-white">
      {/* Barra de navegación superior institucional */}
      <Navbar />

      {/* Banner contextual de credencial activa */}
      <RoleBanner />

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView 
            onOpenModal={handleOpenEventModal}
            onOpenExcelUpload={() => setActiveTab('upload')}
          />
        )}

        {activeTab === 'events' && (
          <EventsView 
            onOpenModal={handleOpenEventModal} 
          />
        )}

        {activeTab === 'upload' && (
          <ExcelUploadView 
            onSuccessNavigate={() => setActiveTab('events')} 
          />
        )}

        {activeTab === 'apprentice' && (
          <ApprenticePortal />
        )}
      </main>

      {/* Pie de página con créditos institucionales y cambio de credencial */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span className="font-serif font-bold text-[#0b1e38]">SIEE — Plataforma Universitaria</span>
            <span>—</span>
            <span>Gestión Curricular, Extensión y Acreditación de Asistencia</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Cambiar Perfil (Modal de Acceso)</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono">Edición Académica 2026</span>
          </div>
        </div>
      </footer>

      {/* Modales globales */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
        eventToEdit={eventToEdit}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Notificaciones flotantes */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
