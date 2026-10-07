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
  School,
  Award
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { users, switchUser, currentUser } = useApp();

  if (!isOpen) return null;

  const handleQuickSelect = (userId) => {
    switchUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-[#0b1e38] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Acceso al Campus Virtual (Demostración)
              </h3>
              <p className="text-[11px] text-slate-300">
                Selecciona una credencial académica para simular sus facultades operativas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con opciones de rol */}
        <div className="p-6 space-y-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Credenciales Académicas Disponibles
          </span>

          <div className="space-y-2.5">
            {users.map(u => {
              let Icon = ShieldCheck;
              let color = 'text-[#0b1e38] bg-slate-100 border-slate-300';
              if (u.id === 'user_admin_musica') {
                Icon = Music;
                color = 'text-blue-900 bg-blue-50 border-blue-200';
              } else if (u.id === 'user_admin_deportes') {
                Icon = Trophy;
                color = 'text-emerald-900 bg-emerald-50 border-emerald-200';
              } else if (u.id === 'user_aprendiz') {
                Icon = GraduationCap;
                color = 'text-amber-900 bg-amber-50 border-amber-200';
              }

              return (
                <div
                  key={u.id}
                  onClick={() => handleQuickSelect(u.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group hover:border-amber-500 hover:bg-amber-50/20 ${
                    currentUser.id === u.id
                      ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-[#0b1e38] transition-colors">
                          {u.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${color}`}>
                          {u.shortRole || u.roleLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {u.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-slate-400 group-hover:text-amber-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>También puedes cambiar de perfil al instante desde la barra superior del portal.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
