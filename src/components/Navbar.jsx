import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  BarChart2, 
  FileSpreadsheet, 
  Calendar, 
  RotateCcw, 
  Shield, 
  Music2, 
  Dumbbell, 
  UserCheck, 
  ArrowUpRight,
  Sparkles
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
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Fila Principal */}
        <div className="flex items-center justify-between h-14 gap-4">
          
          {/* Logo Minimalista & Contexto */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white shadow-xs">
              <Layers className="w-4 h-4 text-zinc-100" />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-zinc-950">
                EventFlow
              </span>
              <span className="font-mono text-[10px] text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                OPS
              </span>
            </div>
          </div>

          {/* Navegación Central Segmentada (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 p-1 rounded-lg border border-zinc-200/80 text-xs font-medium">
            {!isAprendiz ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'events'
                      ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Eventos</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1.5 rounded-md transition-all relative ${
                    activeTab === 'upload'
                      ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Carga Excel</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('apprentice')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === 'apprentice'
                      ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Vista Aprendiz</span>
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('apprentice')}
                className="px-3.5 py-1.5 rounded-md bg-white text-zinc-950 shadow-xs font-semibold"
              >
                <span>Agenda de Hoy (Mi Asistencia)</span>
              </button>
            )}
          </nav>

          {/* Selector de Rol Minimalista + Controles */}
          <div className="flex items-center gap-2.5">
            
            {/* Segmented Role Selector */}
            <div className="hidden lg:flex items-center gap-1 bg-zinc-50 border border-zinc-200 p-0.5 rounded-lg text-xs">
              {users.map((u) => {
                const isActive = currentUser.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    {u.shortRole}
                  </button>
                );
              })}
            </div>

            {/* Botón Reset */}
            <button
              onClick={() => {
                if (window.confirm('¿Reiniciar datos a los valores de prueba originales?')) {
                  resetToDefaultData();
                }
              }}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 transition-colors"
              title="Restablecer datos de prueba"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Usuario Activo */}
            <div className="flex items-center gap-2 pl-1 border-l border-zinc-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-md object-cover border border-zinc-200"
              />
              <div className="hidden xl:block text-left text-xs">
                <div className="font-semibold text-zinc-900 leading-none">{currentUser.name}</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{currentUser.roleLabel.split('//')[0].trim()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de navegación secundaria móvil */}
        <div className="md:hidden flex items-center justify-between border-t border-zinc-100 py-2 overflow-x-auto gap-2">
          <div className="flex items-center gap-1 text-xs">
            {!isAprendiz ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-2.5 py-1 rounded-md text-xs ${activeTab === 'dashboard' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-600'}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-2.5 py-1 rounded-md text-xs ${activeTab === 'events' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-600'}`}
                >
                  Eventos
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-2.5 py-1 rounded-md text-xs ${activeTab === 'upload' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-600'}`}
                >
                  Excel
                </button>
                <button
                  onClick={() => setActiveTab('apprentice')}
                  className={`px-2.5 py-1 rounded-md text-xs ${activeTab === 'apprentice' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-600'}`}
                >
                  Aprendiz
                </button>
              </>
            ) : (
              <span className="text-xs font-semibold text-zinc-900">Agenda Hoy</span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 lg:hidden">
            <span className="text-[10px] font-mono text-zinc-400">ROL:</span>
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  currentUser.id === u.id ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {u.shortRole.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
