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
import MaintenanceView from './views/MaintenanceView';
import { Wrench } from 'lucide-react';

function MainLayout() {
  const { activeTab, setActiveTab } = useApp();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(true);

  // Pantalla completa de mantenimiento al inicio
  if (isMaintenanceMode) {
    return <MaintenanceView />;
  }

  const handleOpenEventModal = (event = null) => {
    setEventToEdit(event);
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setEventToEdit(null);
    setIsEventModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans">
      {/* Barra de navegación superior */}
      <Navbar />

      {/* Banner de rol activo */}
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

      {/* Pie de página minimalista */}
      <footer className="border-t border-zinc-200 bg-white py-5 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900">EventFlow Operations</span>
            <span>—</span>
            <span>Mockup Funcional para Demostración Corporativa</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMaintenanceMode(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold transition-colors text-xs"
              title="Volver a la pantalla de mantenimiento 503"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              <span>Pantalla Mantenimiento</span>
            </button>

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs text-zinc-700 hover:text-zinc-950 font-medium underline underline-offset-4"
            >
              Cambiar Perfil (Modal)
            </button>
            <span className="font-mono text-[11px] text-zinc-400">BUILD 2026.10</span>
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
