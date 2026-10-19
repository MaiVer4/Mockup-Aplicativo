import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  LogOut, 
  RotateCcw, 
  Shield, 
  Sparkles,
  Mail,
  KeyRound
} from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

export default function AdminHeader({ onOpenMenu, searchQuery, setSearchQuery }) {
  const { 
    currentUser, 
    logout, 
    resetToDefaultData, 
    sentEmails, 
    setIsEmailDrawerOpen 
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'S';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadge = () => {
    if (currentUser.role === 'admin_general') {
      return {
        label: 'COORDINACIÓN GENERAL · 6 ÁREAS',
        color: 'bg-[#0e2738] text-[#c4f246] border-[#1a3a4e]'
      };
    }
    return {
      label: `ENCARGADO OPERATIVO · ${currentUser.area?.toUpperCase() || 'CULTURA'}`,
      color: 'bg-[#eafaf1] text-[#15803d] border-[#bbf7d0]'
    };
  };

  const roleBadge = getRoleBadge();

  return (
    <header className="h-[64px] sm:h-[74px] bg-white border-b border-[#e2e8f0] px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      
      {/* Botón menú mobile + Buscador */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md min-w-0">
        <button
          type="button"
          onClick={onOpenMenu}
          className="p-1.5 sm:p-2 rounded-xl text-[#334155] hover:bg-[#f1f5f9] lg:hidden transition-colors shrink-0"
          title="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search box ergonómico */}
        <div className="h-9 sm:h-10 flex-1 min-w-0 bg-[#f1f5f9] rounded-xl flex items-center gap-2 px-2.5 sm:px-3.5 text-[#64748b] border border-[#cbd5e1]/70 focus-within:border-[#15803d] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#15803d]/20 transition-all">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#64748b]" />
          <input
            type="text"
            placeholder="Buscar eventos, aprendices..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-xs text-[#1e293b] placeholder:text-[#64748b] min-w-0"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-bold bg-white border border-[#cbd5e1] text-[#64748b] px-1.5 py-0.5 rounded shadow-2xs">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Acciones de la derecha */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* Badge del Área o Rol */}
        <span className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${roleBadge.color}`}>
          {currentUser.role === 'admin_general' ? (
            <Shield className="w-3.5 h-3.5" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{roleBadge.label}</span>
        </span>

        {/* Campana de Notificaciones de correo automático */}
        <button
          type="button"
          onClick={() => setIsEmailDrawerOpen(true)}
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#cbd5e1] bg-white text-[#475569] hover:text-[#0f172a] hover:bg-[#f8fafc] flex items-center justify-center transition-colors shadow-2xs"
          title="Buzón de notificaciones automáticas"
        >
          <Bell className="w-4 h-4" />
          {sentEmails.length > 0 && (
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* Perfil del Usuario estilo Functional Mockup */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-[#e2e8f0] text-left hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] flex items-center justify-center font-extrabold text-xs shadow-2xs shrink-0">
              {getInitials(currentUser.name)}
            </div>
            <div className="hidden sm:flex flex-col">
              <strong className="text-xs text-[#1e293b] font-heading font-bold truncate max-w-[130px]">
                {currentUser.name}
              </strong>
              <small className="text-[#64748b] text-[10px] truncate max-w-[130px]">
                {currentUser.shortRole || currentUser.role}
              </small>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8492a5] hidden sm:block" />
          </button>

          {/* Menú Desplegable */}
          {isProfileOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e6eaf0] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <div className="px-4 py-2 border-b border-[#edf0f3]">
                <p className="text-xs font-bold text-[#203754] truncate">{currentUser.name}</p>
                <p className="text-[11px] text-[#718098] truncate">{currentUser.email}</p>
              </div>

              <div className="p-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEmailDrawerOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#203754] hover:bg-[#f4f7fa] flex items-center gap-2 font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-[#718098]" />
                  <span>Buzón de Correos</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#203754] hover:bg-[#f4f7fa] flex items-center gap-2 font-medium"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#718098]" />
                  <span>Cambiar Contraseña</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetToDefaultData();
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                  <span>Restablecer Datos Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#203754] hover:bg-[#f4f7fa] flex items-center gap-2 font-bold border-t border-[#edf0f3] mt-1 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#718098]" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal de Cambio de Contraseña */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

    </header>
  );
}
