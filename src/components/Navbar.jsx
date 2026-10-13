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
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Fila Principal */}
        <div className="flex items-center justify-between h-14 gap-3">
          
          {/* Logo SENA Bienestar al Aprendiz */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs font-bold text-xs tracking-tighter">
              SENA
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight text-zinc-950 sm:text-sm">
                  Bienestar al Aprendiz
                </span>
                <span className="font-mono text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-bold">
                  v2.0
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 hidden sm:inline">
                Gestión Integral de Eventos y Control de Asistencia
              </span>
            </div>
          </div>

          {/* Navegación Central según el rol */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200 text-xs font-medium">
            
            {/* Pestañas para Administrador General */}
            {isAdminGeneral && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-zinc-950 shadow-xs font-bold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Métricas Globales</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('encargados')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'encargados'
                      ? 'bg-white text-zinc-950 shadow-xs font-bold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Gestión de Encargados</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('aprendices')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'aprendices'
                      ? 'bg-white text-zinc-950 shadow-xs font-bold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-zinc-700" />
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
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'events'
                      ? 'bg-white text-zinc-950 shadow-xs font-bold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Mis Actividades ({currentUser.area})</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'upload'
                      ? 'bg-white text-zinc-950 shadow-xs font-bold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cargar Plan Anual (IA)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('area_metrics')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'area_metrics'
                      ? 'bg-white text-zinc-950 shadow-xs font-bold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-zinc-700" />
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
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'apprentice'
                      ? 'bg-white text-zinc-950 shadow-xs font-bold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Cartelera de Actividades</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'history'
                      ? 'bg-white text-zinc-950 shadow-xs font-bold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mis Asistencias</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'profile'
                      ? 'bg-white text-zinc-950 shadow-xs font-bold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <IdCard className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Mi Carnet & Perfil</span>
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
              className="relative p-2 rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
              title="Ver buzón de notificaciones automáticas por correo"
            >
              <Mail className="w-4 h-4" />
              {sentEmails.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono">
                  {sentEmails.length}
                </span>
              )}
            </button>

            {/* Selector Rápido de Perfil SENA */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="btn-tactile flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-all text-xs"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-md object-cover border border-zinc-200"
                />
                <div className="text-left hidden lg:block leading-tight">
                  <span className="font-bold text-zinc-900 block text-[11px] truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono block">
                    {currentUser.shortRole}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {/* Menú desplegable de perfiles */}
              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="p-2 border-b border-zinc-100 font-mono text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
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
                        className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 transition-colors ${
                          currentUser.id === u.id ? 'bg-zinc-100 font-bold' : 'hover:bg-zinc-50'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-md object-cover" />
                        <div className="truncate flex-1">
                          <span className="text-zinc-900 block truncate">{u.name}</span>
                          <span className="font-mono text-[9px] text-zinc-500 block">
                            {u.shortRole}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-1 border-t border-zinc-100 space-y-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg text-zinc-800 hover:bg-zinc-100 font-semibold inline-flex items-center gap-2 transition-colors text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Cerrar Sesión</span>
                    </button>

                    <button
                      onClick={() => {
                        resetToDefaultData();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg text-rose-600 hover:bg-rose-50 font-medium inline-flex items-center gap-2 transition-colors text-[11px]"
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
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
