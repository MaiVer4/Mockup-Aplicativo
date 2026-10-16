import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  LogIn, 
  Shield, 
  Music, 
  Dumbbell, 
  User, 
  ArrowRight
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { users, switchUser, currentUser } = useApp();

  if (!isOpen) return null;

  const handleQuickSelect = (userId) => {
    switchUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] w-full max-w-md overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="px-5 py-3.5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div>
            <h3 className="text-sm font-bold text-[#1e293b] font-heading">
              Cambiar Perfil Institucional
            </h3>
            <p className="text-[11px] text-[#64748b]">
              Selecciona un rol para simular sus permisos de plataforma.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de Usuarios */}
        <div className="p-4 space-y-2 text-xs">
          {users.map(u => {
            const isSelected = currentUser.id === u.id;
            return (
              <div
                key={u.id}
                onClick={() => handleQuickSelect(u.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'border-[#15803d] bg-[#f0fdf4] shadow-xs'
                    : 'border-[#e2e8f0] bg-white hover:bg-[#f8fafc] hover:border-[#cbd5e1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-8 h-8 rounded-lg object-cover border border-[#e2e8f0]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#1e293b] group-hover:text-[#0e2738]">
                        {u.name}
                      </span>
                      <span className="font-mono text-[9px] text-[#475569] bg-[#f1f5f9] px-1.5 py-0.5 rounded-md border border-[#cbd5e1] font-semibold">
                        {u.shortRole}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748b] line-clamp-1 mt-0.5">
                      {u.description}
                    </p>
                  </div>
                </div>

                <div className="text-[#64748b] group-hover:text-[#15803d] transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-[#e2e8f0] text-center text-[10px] text-[#64748b] bg-[#f8fafc] font-semibold font-heading tracking-wider">
          SELECCIÓN RÁPIDA DE ROL
        </div>
      </div>
    </div>
  );
}
