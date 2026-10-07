import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  LogIn, 
  ShieldCheck, 
  Music, 
  Trophy, 
  GraduationCap, 
  ArrowRight,
  KeyRound,
  Mail
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { users, switchUser, currentUser } = useApp();
  const [selectedUser, setSelectedUser] = useState(currentUser.id);
  const [password, setPassword] = useState('••••••••');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    switchUser(selectedUser);
    onClose();
  };

  const handleQuickSelect = (userId) => {
    switchUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Iniciar Sesión por Rol (Demostración)
              </h3>
              <p className="text-xs text-slate-500">
                Selecciona uno de los perfiles para simular sus accesos y permisos.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con opciones de rol */}
        <div className="p-6 space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Perfiles Disponibles para la Demostración
          </span>

          <div className="space-y-2.5">
            {users.map(u => {
              const isSelected = selectedUser === u.id;
              let Icon = ShieldCheck;
              let color = 'text-indigo-600 bg-indigo-50 border-indigo-200';
              if (u.id === 'user_admin_musica') {
                Icon = Music;
                color = 'text-purple-600 bg-purple-50 border-purple-200';
              } else if (u.id === 'user_admin_deportes') {
                Icon = Trophy;
                color = 'text-emerald-600 bg-emerald-50 border-emerald-200';
              } else if (u.id === 'user_aprendiz') {
                Icon = GraduationCap;
                color = 'text-sky-600 bg-sky-50 border-sky-200';
              }

              return (
                <div
                  key={u.id}
                  onClick={() => handleQuickSelect(u.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group hover:border-indigo-400 hover:bg-indigo-50/30 ${
                    currentUser.id === u.id
                      ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {u.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${color}`}>
                          {u.roleLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {u.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              💡 También puedes cambiar de usuario al instante usando los botones en la barra superior del navegador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
