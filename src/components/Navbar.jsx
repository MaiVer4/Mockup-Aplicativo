import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  BarChart2, 
  FileSpreadsheet, 
  Calendar, 
  RotateCcw, 
  Shield, 
  Sparkles, 
  UserCheck, 
  Mail, 
  Users, 
  IdCard, 
  CheckCircle2, 
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser, 
    users, 
    switchUser, 
    logout,
    activeTab, 
    setActiveTab, 
    resetToDefaultData,
    sentEmails,
    setIsEmailDrawerOpen
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAprendiz = currentUser.role === 'aprendiz';
  const isAdminGeneral = currentUser.role === 'admin_general';
  const isEncargado = currentUser.role === 'admin_area';

  return (
    <header className="bg-[#f8fafc] border-b border-[#e2e8f0] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Fila Principal */}
        <div className="flex items-center justify-between h-14 gap-3">
          
          {/* Logo SENA Bienestar al Aprendiz */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#15803d] flex items-center justify-center text-white shadow-xs font-bold text-xs tracking-tighter">
              SENA
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight text-[#1e293b] sm:text-sm font-heading">
                  Bienestar al Aprendiz
                </span>
                <span className="font-mono text-[9px] text-[#15803d] bg-[#eafaf1] px-1.5 py-0.2 rounded border border-[#bbf7d0] font-bold">
                  v2.0
                </span>
              </div>
              <span className="text-[10px] text-[#64748b] hidden sm:inline">
                Gestión Integral de Eventos y Control de Asistencia
              </span>
            </div>
          </div>

          {/* Navegación Central según el rol */}
          <nav className="hidden md:flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl border border-[#e2e8f0] text-xs font-medium">
            
            {/* Pestañas para Administrador General */}
            {isAdminGeneral && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-[#1e293b] shadow-xs font-bold'
                      : 'text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Métricas Globales</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('encargados')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'encargados'
                      ? 'bg-white text-[#1e293b] shadow-xs font-bold'
                      : 'text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Gestión de Encargados</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('aprendices')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'aprendices'
                      ? 'bg-white text-[#1e293b] shadow-xs font-bold'
                      : 'text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Consulta de Aprendices</span>
                  </span>
                </button>
              </>
            )}

            {/* Pestañas para Administrador de Área (Encargado) */}
            {isEncargado && (
              <>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'events'
                      ? 'bg-white text-[#1e293b] shadow-xs font-bold'
                      : 'text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Mis Actividades ({currentUser.area})</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'upload'
                      ? 'bg-white text-[#1e293b] shadow-xs font-bold'
                      : 'text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#15803d]" />
                    <span>Cargar Plan Anual (IA)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15803d] animate-pulse" />
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('area_metrics')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'area_metrics'
                      ? 'bg-white text-[#1e293b] shadow-xs font-bold'
                      : 'text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Métricas de Área</span>
                  </span>
                </button>
              </>
            )}

            {/* Pestañas para el Aprendiz */}
            {isAprendiz && (
              <>
                <button
                  onClick={() => setActiveTab('apprentice')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'apprentice'
                      ? 'bg-white text-[#1e293b] shadow-xs font-bold'
                      : 'text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Cartelera de Actividades</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'history'
                      ? 'bg-white text-[#1e293b] shadow-xs font-bold'
                      : 'text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
                    <span>Mis Asistencias</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'profile'
                      ? 'bg-white text-[#1e293b] shadow-xs font-bold'
                      : 'text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Mi Perfil</span>
                  </span>
                </button>
              </>
            )}

          </nav>

          {/* Controles de la derecha */}
          <div className="flex items-center gap-2">
            
            {/* Buzón de Notificaciones Automáticas */}
            <button
              onClick={() => setIsEmailDrawerOpen(true)}
              className="relative p-2 rounded-xl border border-[#e2e8f0] text-[#64748b] hover:text-[#1e293b] hover:bg-white transition-colors"
              title="Ver buzón de notificaciones automáticas por correo"
            >
              <Mail className="w-4 h-4" />
              {sentEmails.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#15803d] text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono">
                  {sentEmails.length}
                </span>
              )}
            </button>

            {/* Selector Rápido de Perfil SENA */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition-all text-xs shadow-2xs"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-lg object-cover border border-[#cbd5e1]"
                />
                <div className="text-left hidden lg:block leading-tight">
                  <span className="font-bold text-[#1e293b] block text-[11px] truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#64748b] font-mono block">
                    {currentUser.shortRole}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-[#64748b]" />
              </button>

              {/* Menú desplegable de perfiles */}
              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="p-2 border-b border-[#e2e8f0] font-mono text-[10px] text-[#64748b] font-bold uppercase tracking-wider">
                    Cambiar Perfil // Prueba de Roles
                  </div>
                  
                  <div className="py-1 space-y-0.5">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                          currentUser.id === u.id ? 'bg-[#f0fdf4] font-bold text-[#15803d]' : 'hover:bg-[#f8fafc] text-[#334155]'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-lg object-cover" />
                        <div className="truncate flex-1">
                          <span className="text-[#1e293b] block truncate font-medium">{u.name}</span>
                          <span className="font-mono text-[9px] text-[#64748b] block">
                            {u.shortRole}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-1 border-t border-[#e2e8f0] space-y-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl text-[#334155] hover:bg-[#f1f5f9] font-semibold inline-flex items-center gap-2 transition-colors text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#64748b]" />
                      <span>Cerrar Sesión</span>
                    </button>

                    <button
                      onClick={() => {
                        resetToDefaultData();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium inline-flex items-center gap-2 transition-colors text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restablecer Datos Demo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botón directo de Cerrar Sesión en Desktop */}
            <button
              onClick={logout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#334155] hover:text-[#1e293b] hover:bg-[#f1f5f9] transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>

          </div>

        </div>

      </div>
    </header>
  );
}
