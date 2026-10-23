import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import AdminHeader from './components/AdminHeader';
import ToastContainer from './components/ToastContainer';
import EventModal from './components/EventModal';
import ExportValidationModal from './components/ExportValidationModal';
import RegisterEncargadoModal from './components/RegisterEncargadoModal';
import EventDetailModal from './components/EventDetailModal';
import ApprenticeOnboardingModal from './components/ApprenticeOnboardingModal';
import EmailNotificationDrawer from './components/EmailNotificationDrawer';
import DashboardView from './views/DashboardView';
import EventsView from './views/EventsView';
import ExcelUploadView from './views/ExcelUploadView';
import ParticipantsView from './views/ParticipantsView';
import LearnersManagementView from './views/LearnersManagementView';
import EncargadosView from './views/EncargadosView';
import CreateApprenticeModal from './components/CreateApprenticeModal';
import ApprenticePortal from './views/ApprenticePortal';
import LoginView from './views/LoginView';
import ChangePasswordModal from './components/ChangePasswordModal';

function AdminShell() {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    isEmailDrawerOpen, 
    setIsEmailDrawerOpen 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modales
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [focusDateOnModal, setFocusDateOnModal] = useState(false);
  const [focusCoverOnModal, setFocusCoverOnModal] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [encargadoToEdit, setEncargadoToEdit] = useState(null);
  const [isCreateApprenticeModalOpen, setIsCreateApprenticeModalOpen] = useState(false);
  const [selectedEventForExport, setSelectedEventForExport] = useState(null);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);

  const handleOpenEventModal = (event = null, options = {}) => {
    setEventToEdit(event);
    setFocusDateOnModal(Boolean(options.focusDate));
    setFocusCoverOnModal(Boolean(options.focusCover));
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setEventToEdit(null);
    setFocusDateOnModal(false);
    setFocusCoverOnModal(false);
    setIsEventModalOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#f1f4f8] text-[#1e293b] font-sans antialiased">
      
      {/* Sidebar de Navegación Fija estilo Functional Mockup */}
      <Sidebar 
        view={activeTab}
        setView={setActiveTab}
        open={mobileMenuOpen}
        close={() => setMobileMenuOpen(false)}
      />

      {/* Contenedor Principal (con margen izquierdo para dar espacio a la sidebar en desktop) */}
      <div className="flex-1 min-w-0 lg:ml-60 flex flex-col min-h-screen">
        
        {/* Header Superior Administrativo */}
        <AdminHeader 
          onOpenMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Contenido de la Vista Activa */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            currentUser.role === 'admin_general' ? (
              <DashboardView 
                onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
                onNavigateView={setActiveTab}
                onOpenEventDetail={setSelectedEventForDetail}
              />
            ) : (
              <EventsView 
                onOpenModal={handleOpenEventModal}
                onOpenExportModal={setSelectedEventForExport}
                onOpenDetailModal={setSelectedEventForDetail}
              />
            )
          )}

          {activeTab === 'events' && (
            <EventsView 
              onOpenModal={handleOpenEventModal}
              onOpenExportModal={setSelectedEventForExport}
              onOpenDetailModal={setSelectedEventForDetail}
            />
          )}

          {activeTab === 'upload' && (
            <ExcelUploadView 
              onSuccessNavigate={() => setActiveTab('events')}
            />
          )}

          {activeTab === 'participants' && (
            <ParticipantsView 
              onOpenExportModal={setSelectedEventForExport}
            />
          )}

          {(activeTab === 'aprendices' || activeTab === 'users') && (
            <LearnersManagementView 
              onOpenCreateModal={() => setIsCreateApprenticeModalOpen(true)}
            />
          )}

          {activeTab === 'encargados' && (
            <EncargadosView 
              onOpenRegisterModal={() => {
                setEncargadoToEdit(null);
                setIsRegisterModalOpen(true);
              }}
              onOpenEditModal={(encargado) => {
                setEncargadoToEdit(encargado);
                setIsRegisterModalOpen(true);
              }}
            />
          )}
        </main>

        {/* Footer Institucional */}
        <footer className="border-t border-[#e6eaf0] bg-white py-4 px-6 text-xs text-[#8290a1] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <strong className="text-[#203754]">SENA — Bienestar al Aprendiz</strong>
            <span>•</span>
            <span>Sistema Institucional de Control de Asistencia y Aforo</span>
          </div>
          <div className="font-mono text-[11px] text-[#9aa5b2]">
            Versión 2026.10 • Bienestar Institucional
          </div>
        </footer>

      </div>

      {/* MODALES GLOBALES */}

      {/* 1. Modal para crear/editar evento (Solo Encargado) */}
      {currentUser.role === 'admin_area' && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={handleCloseEventModal}
          eventToEdit={eventToEdit}
          focusDate={focusDateOnModal}
          focusCover={focusCoverOnModal}
        />
      )}

      {/* 2. Modal de exportación oficial */}
      <ExportValidationModal
        isOpen={Boolean(selectedEventForExport)}
        onClose={() => setSelectedEventForExport(null)}
        event={selectedEventForExport}
      />

      {/* 3. Modal para registrar encargados de área directamente (RF-14) */}
      <RegisterEncargadoModal
        isOpen={isRegisterModalOpen}
        encargadoToEdit={encargadoToEdit}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setEncargadoToEdit(null);
        }}
      />

      {/* 4. Modal para registrar aprendiz directamente (RF-01) */}
      <CreateApprenticeModal
        isOpen={isCreateApprenticeModalOpen}
        onClose={() => setIsCreateApprenticeModalOpen(false)}
      />

      {/* 5. Modal de detalle extendido para la ficha del evento */}
      <EventDetailModal
        isOpen={Boolean(selectedEventForDetail)}
        onClose={() => setSelectedEventForDetail(null)}
        event={selectedEventForDetail}
        onOpenEditModal={(evt, opts = { focusDate: true }) => {
          setSelectedEventForDetail(null);
          handleOpenEventModal(evt, opts);
        }}
      />

      {/* 6. Buzón de notificaciones automáticas por correo */}
      <EmailNotificationDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
      />

    </div>
  );
}

function LearnerShell() {
  const { 
    currentUser, 
    logout, 
    isEmailDrawerOpen, 
    setIsEmailDrawerOpen, 
    sentEmails 
  } = useApp();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f4f8] text-[#1e293b] font-sans antialiased">
      
      {/* Header Superior del Aprendiz */}
      <header className="h-[64px] sm:h-[74px] bg-white border-b border-[#e2e8f0] px-3 sm:px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="logo-wrap">
            <div className="logo-mark logo-dark">
              <span>S</span>
            </div>
            <div className="logo-type text-[#1e293b]">
              <strong>Bienestar SENA</strong>
              <small className="text-[#15803d]">Portal del Aprendiz</small>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Campana de Notificaciones */}
          <button
            type="button"
            onClick={() => setIsEmailDrawerOpen(true)}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#cbd5e1] bg-white text-[#475569] hover:text-[#0f172a] hover:bg-[#f8fafc] flex items-center justify-center transition-colors shadow-2xs"
            title="Buzón de notificaciones automáticas"
          >
            <span className="w-2 h-2 rounded-full bg-[#15803d] absolute top-2 right-2" />
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Perfil del Aprendiz */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-[#e2e8f0]">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-[#cbd5e1]"
            />
            <div className="hidden sm:flex flex-col text-left">
              <strong className="text-xs font-bold text-[#1e293b] font-heading truncate max-w-[140px]">
                {currentUser.name}
              </strong>
              <small className="text-[#15803d] font-bold text-[10px]">
                Ficha {currentUser.ficha || '2687140'}
              </small>
            </div>
            
            <button
              type="button"
              onClick={logout}
              className="p-1.5 sm:p-2 rounded-xl text-[#64748b] hover:text-rose-600 hover:bg-rose-50 transition-colors ml-0.5"
              title="Cerrar sesión"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal del Aprendiz */}
      <main className="flex-1 p-3.5 sm:p-5 md:p-8 max-w-6xl w-full mx-auto">
        <ApprenticePortal onOpenChangePassword={() => setIsChangePasswordOpen(true)} />
      </main>

      {/* Footer del Aprendiz */}
      <footer className="border-t border-[#e2e8f0] bg-white py-4 px-6 text-xs text-[#64748b] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <strong className="text-[#1e293b]">Servicio Nacional de Aprendizaje SENA</strong>
          <span>•</span>
          <span>Bienestar al Aprendiz</span>
        </div>
        <div className="font-mono text-[11px] text-[#94a3b8]">
          Complejo Paloquemao • 2026
        </div>
      </footer>

      {/* Modal Bloqueante de Onboarding Institucional (12 campos oficiales) */}
      <ApprenticeOnboardingModal />

      {/* Buzón de Notificaciones por Correo */}
      <EmailNotificationDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
      />

      {/* Cambio de contraseña accesible desde el perfil del aprendiz */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

    </div>
  );
}

function MainRouter() {
  const { currentUser } = useApp();

  // Si no hay usuario autenticado: Pantalla de Login con split-screen de Functional Mockup
  if (!currentUser) {
    return <LoginView />;
  }

  // Si el usuario es Aprendiz: Shell del Aprendiz estilo Stitch + Functional Mockup
  if (currentUser.role === 'aprendiz') {
    return <LearnerShell />;
  }

  // Si el usuario es Administrador (General o de Área): Shell Administrativa con Sidebar fija
  return <AdminShell />;
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
      <ToastContainer />
    </AppProvider>
  );
}
