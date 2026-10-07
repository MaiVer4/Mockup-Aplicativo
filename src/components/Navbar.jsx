import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarCheck2, 
  BarChart3, 
  FileSpreadsheet, 
  CalendarDays, 
  RotateCcw, 
  ShieldAlert, 
  Music2, 
  Dumbbell, 
  GraduationCap,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser, 
    users, 
    switchUser, 
    activeTab, 
    setActiveTab, 
    resetToDefaultData 
  } = useApp();

  const isAprendiz = currentUser.role === 'aprendiz';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Fila Principal del Header */}
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo y Nombre de la Plataforma */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/30">
              <CalendarCheck2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">EventFlow</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  AI Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Gestión de Eventos & Extracción de Excel</p>
            </div>
          </div>

          {/* Selector Rápido de Roles (Elemento clave para la presentación de mockup) */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
            <span className="text-[11px] text-slate-400 font-medium px-2.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Rol:
            </span>
            <div className="flex items-center gap-1">
              {users.map((u) => {
                const isActive = currentUser.id === u.id;
                let Icon = ShieldAlert;
                if (u.id === 'user_admin_musica') Icon = Music2;
                if (u.id === 'user_admin_deportes') Icon = Dumbbell;
                if (u.id === 'user_aprendiz') Icon = GraduationCap;

                return (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{u.name.split(' ')[0]}</span>
                    <span className="text-[10px] opacity-75">
                      {u.area ? `(${u.area})` : u.role === 'aprendiz' ? '(Estudiante)' : '(Admin)'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menú de Acciones Secundarias */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('¿Deseas restablecer todos los eventos y asistencias a los valores de prueba iniciales?')) {
                  resetToDefaultData();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 border border-slate-800 hover:border-amber-400/30 transition-all"
              title="Reiniciar datos de prueba a fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restablecer</span>
            </button>

            {/* Perfil del usuario activo */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-200 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400">{currentUser.roleLabel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fila Secundaria: Navegación de Vistas */}
        <div className="flex items-center justify-between border-t border-slate-800/80 py-1.5 overflow-x-auto">
          <nav className="flex items-center gap-1">
            {!isAprendiz ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard & Métricas</span>
                </button>

                <button
                  onClick={() => setActiveTab('events')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'events'
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Gestión de Eventos</span>
                </button>

                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                    activeTab === 'upload'
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Carga Excel & IA</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('apprentice')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'apprentice'
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                      : 'text-slate-400 hover:text-sky-300 hover:bg-slate-800/50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  <span>Simular Vista Aprendiz</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('apprentice')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/40`}
                >
                  <CalendarDays className="w-4 h-4 text-sky-400" />
                  <span>Eventos Publicados Hoy (Mi Asistencia)</span>
                </button>
              </>
            )}
          </nav>

          {/* Selector de rol móvil */}
          <div className="lg:hidden flex items-center gap-1 shrink-0 ml-2">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Cambiar a:</span>
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  currentUser.id === u.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {u.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
