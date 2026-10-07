import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  BarChart3, 
  FileSpreadsheet, 
  BookOpen, 
  RotateCcw, 
  ShieldCheck, 
  Music, 
  Trophy, 
  GraduationCap,
  Sparkles,
  School,
  Award
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
    <header className="bg-[#0b1e38] text-slate-100 sticky top-0 z-40 shadow-xl border-b border-slate-800">
      
      {/* Barra superior de identificación institucional */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Escudo e Identidad Institucional */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-md shadow-amber-600/20 ring-2 ring-amber-400/40 text-slate-950">
              <Building2 className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-extrabold text-lg tracking-tight text-white">
                  SIEE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Campus Virtual
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block font-medium">
                Sistema Institucional de Eventos y Extensión Universitaria
              </p>
            </div>
          </div>

          {/* Selector de Perfil Académico para Demostración */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-[#061325]/90 border border-slate-700/80 shadow-inner">
            <span className="text-[11px] text-amber-200/90 font-bold px-2.5 flex items-center gap-1.5 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Perfil:
            </span>
            <div className="flex items-center gap-1">
              {users.map((u) => {
                const isActive = currentUser.id === u.id;
                let Icon = ShieldCheck;
                if (u.id === 'user_admin_musica') Icon = Music;
                if (u.id === 'user_admin_deportes') Icon = Trophy;
                if (u.id === 'user_aprendiz') Icon = GraduationCap;

                return (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30 ring-1 ring-amber-300/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{u.shortRole || u.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Acciones de Cabecera: Restablecer y Perfil */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('¿Deseas restaurar la base de datos de prueba a los valores institucionales iniciales?')) {
                  resetToDefaultData();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 border border-slate-700 hover:border-amber-400/40 transition-all"
              title="Restablecer datos de prueba"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar Datos</span>
            </button>

            {/* Credencial del usuario activo */}
            <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-700">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/50 shadow-sm"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-100 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-amber-300/80 font-medium">{currentUser.roleLabel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fila Secundaria: Navegación Curricular y Académica */}
        <div className="flex items-center justify-between border-t border-slate-800/90 py-1.5 overflow-x-auto">
          <nav className="flex items-center gap-1.5">
            {!isAprendiz ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Panel de Indicadores</span>
                </button>

                <button
                  onClick={() => setActiveTab('events')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'events'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Catálogo de Eventos</span>
                </button>

                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                    activeTab === 'upload'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Carga de Planilla (IA)</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('apprentice')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'apprentice'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                      : 'text-slate-300 hover:text-sky-300 hover:bg-slate-800/60'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  <span>Simular Portal Estudiantil</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('apprentice')}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Mi Agenda Académica & Registro de Asistencia</span>
                </button>
              </>
            )}
          </nav>

          {/* Selector de rol móvil */}
          <div className="lg:hidden flex items-center gap-1 shrink-0 ml-2">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Rol:</span>
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  currentUser.id === u.id ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {u.shortRole || u.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ribete dorado institucional de alta distinción */}
      <div className="h-[2px] w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
    </header>
  );
}
