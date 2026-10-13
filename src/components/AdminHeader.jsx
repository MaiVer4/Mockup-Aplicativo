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
  Mail
} from 'lucide-react';

export default function AdminHeader({ onOpenMenu, searchQuery, setSearchQuery }) {
  const { 
    currentUser, 
    logout, 
    resetToDefaultData, 
    sentEmails, 
    setIsEmailDrawerOpen 
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'S';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadge = () => {
    if (currentUser.role === 'admin_general') {
      return {
        label: 'Administración General',
        color: 'bg-[#122b4c] text-[#c9f45a] border-[#122b4c]'
      };
    }
    return {
      label: `Área de ${currentUser.area || 'Cultura'}`,
      color: 'bg-[#eaf7ec] text-[#16a34a] border-[#bbf7d0]'
    };
  };

  const roleBadge = getRoleBadge();

  return (
    <header className="h-[74px] bg-white border-b border-[#e6eaf0] px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      
      {/* Botón menú mobile + Buscador */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onOpenMenu}
          className="p-2 rounded-xl text-[#27425f] hover:bg-[#f4f6f8] lg:hidden transition-colors"
          title="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search box estilo Functional Mockup */}
        <div className="h-10 w-full bg-[#f4f6f8] rounded-xl flex items-center gap-2.5 px-3.5 text-[#8492a5] border border-transparent focus-within:border-[#91b52c] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#c9f45a]/25 transition-all">
          <Search className="w-4 h-4 shrink-0 text-[#8492a5]" />
          <input
            type="text"
            placeholder="Buscar eventos, aprendices o fichas..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-xs text-[#233954] placeholder:text-[#8492a5] min-w-0"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-bold bg-white border border-[#d8dee7] text-[#6b7b92] px-1.5 py-0.5 rounded shadow-2xs">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Acciones de la derecha */}
      <div className="flex items-center gap-4">
        
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
          className="relative w-10 h-10 rounded-xl border border-[#e1e6ed] bg-white text-[#5e7188] hover:text-[#142b4d] hover:bg-[#f8fafc] flex items-center justify-center transition-colors shadow-2xs"
          title="Buzón de notificaciones automáticas"
        >
          <Bell className="w-4 h-4" />
          {sentEmails.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#d86654] ring-2 ring-white" />
          )}
        </button>

        {/* Perfil del Usuario estilo Functional Mockup */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-3 border-l border-[#e4e8ee] text-left hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-[#dce8cf] text-[#31503c] flex items-center justify-center font-extrabold text-xs shadow-2xs">
              {getInitials(currentUser.name)}
            </div>
            <div className="hidden sm:flex flex-col">
              <strong className="text-xs text-[#273c57] font-heading font-bold truncate max-w-[130px]">
                {currentUser.name}
              </strong>
              <small className="text-[#8693a5] text-[10px] truncate max-w-[130px]">
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

    </header>
  );
}
