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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-zinc-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950">
              Cambiar Perfil // Control de Acceso
            </h3>
            <p className="text-[11px] text-zinc-500">
              Selecciona un rol para simular sus permisos de plataforma.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
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
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between group hover:border-zinc-400 ${
                  isSelected
                    ? 'border-zinc-950 bg-zinc-50'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-8 h-8 rounded-md object-cover border border-zinc-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-900 group-hover:text-zinc-950">
                        {u.name}
                      </span>
                      <span className="font-mono text-[9px] text-zinc-500 bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200">
                        {u.shortRole}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                      {u.description}
                    </p>
                  </div>
                </div>

                <div className="text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-zinc-100 text-center font-mono text-[10px] text-zinc-400 bg-zinc-50/50">
          CAMBIO DE ROL INSTANTÁNEO EN UN CLIC
        </div>
      </div>
    </div>
  );
}
