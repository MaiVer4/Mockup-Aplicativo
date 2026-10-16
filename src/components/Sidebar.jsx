import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutGrid, 
  Calendar, 
  Upload, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  LogOut, 
  X,
  FileSpreadsheet
} from 'lucide-react';

export default function Sidebar({ view, setView, open, close }) {
  const { currentUser, logout, events, sentEmails, setIsEmailDrawerOpen } = useApp();

  const activeEventsCount = events.filter(e => e.status !== 'finalizado').length;

  const navItems = currentUser.role === 'admin_area'
    ? [
        { id: 'events', icon: Calendar, label: 'Mis Actividades', count: activeEventsCount },
        { id: 'upload', icon: Upload, label: 'Cargar Plan XLSX' },
        { id: 'participants', icon: Users, label: 'Participantes' }
      ]
    : [
        { id: 'dashboard', icon: LayoutGrid, label: 'Supervisión' },
        { id: 'events', icon: Calendar, label: 'Todas las Actividades', count: activeEventsCount },
        { id: 'participants', icon: Users, label: 'Participantes Globales' },
        { id: 'users', icon: Users, label: 'Gestión de Usuarios' }
      ];

  return (
    <>
      {/* Backdrop para mobile */}
      {open && (
        <div 
          onClick={close} 
          className="fixed inset-0 bg-[#081b28]/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar contenedor en Verde Petróleo Ergonómico */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#0e2738] border-r border-[#1a3a4e] text-[#cbd5e1] p-5 flex flex-col transition-transform duration-250 lg:translate-x-0 ${
        open ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Botón cerrar en mobile */}
        <button 
          onClick={close}
          className="absolute right-3 top-3 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo de Bienestar SENA */}
        <div className="logo-wrap px-1 pt-1 pb-4">
          <div className="logo-mark logo-dark">
            <span>S</span>
          </div>
          <div className="logo-type text-white">
            <strong>Bienestar SENA</strong>
            <small className="text-[#c4f246]">Gestión Institucional</small>
          </div>
        </div>

        {/* Etiqueta de sección suave */}
        <div className="text-[10px] font-extrabold tracking-[1.5px] uppercase text-[#64748b] px-2 pt-6 pb-2">
          MENÚ PRINCIPAL
        </div>

        {/* Lista de navegación ergonómica */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = view === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setView(item.id);
                  close();
                }}
                className={`w-full h-11 px-3.5 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#15803d] text-white font-bold shadow-md shadow-emerald-950/20'
                    : 'text-[#94a3b8] hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#7e95a9]'}`} />
                <span className="truncate">{item.label}</span>
                {item.count !== undefined && (
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-[#cbd5e1]'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Caja de Automatización IA con contraste atenuado */}
        <div className="mt-auto p-3.5 rounded-2xl border border-[#1e3e54] bg-[#143247]/60 text-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#15803d] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <strong className="block text-white text-xs font-heading font-bold">
              Automatización IA
            </strong>
            <p className="text-[#94a3b8] text-[11px] leading-relaxed mt-0.5">
              El motor está listo para procesar el plan anual Excel y auditar ambigüedades.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setView('upload');
              close();
            }}
            className="text-[#c4f246] hover:text-[#d4f768] text-[11px] font-bold flex items-center gap-1.5 pt-1"
          >
            <span>Importar ahora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zona inferior de la sidebar */}
        <div className="pt-3 mt-3 border-t border-[#1a3a4e] space-y-1">
          {/* Buzón de correos automáticos */}
          <button
            type="button"
            onClick={() => setIsEmailDrawerOpen(true)}
            className="w-full h-10 px-3 rounded-xl flex items-center justify-between text-xs text-[#94a3b8] hover:bg-white/5 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#7e95a9]" />
              <span>Notificaciones</span>
            </div>
            {sentEmails.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#15803d] text-white text-[10px] font-bold flex items-center justify-center font-mono">
                {sentEmails.length}
              </span>
            )}
          </button>

          {/* Cerrar Sesión */}
          <button
            type="button"
            onClick={logout}
            className="w-full h-10 px-3 rounded-xl flex items-center gap-3 text-xs text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>

      </aside>
    </>
  );
}
