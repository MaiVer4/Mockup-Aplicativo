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
import { Sparkles, KeyRound } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      {/* Barra de navegación superior */}
      <Navbar />

      {/* Banner contextual del rol activo */}
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

      {/* Pie de página con atajos y créditos de demostración */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">EventFlow Mockup Funcional</span>
            <span>—</span>
            <span>Flujo de análisis por IA, roles y control de asistencia</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Cambiar Perfil (Modal Login)</span>
            </button>
            <span className="text-[11px] text-slate-400">Versión 1.0 Demo</span>
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
