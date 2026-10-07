import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Music, Trophy, GraduationCap, Sparkles } from 'lucide-react';

export default function RoleBanner() {
  const { currentUser } = useApp();

  const getRoleConfig = () => {
    switch (currentUser.role) {
      case 'admin_general':
        return {
          icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
          bg: 'bg-indigo-950/40 border-indigo-800/40 text-indigo-200',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
          title: 'Rol Activo: Administrador General',
          desc: 'Tienes control total del sistema: subida de archivos Excel globales, gestión y cierre de eventos de todas las áreas y analíticas ejecutivas consolidadas.'
        };
      case 'admin_area':
        if (currentUser.area === 'Música') {
          return {
            icon: <Music className="w-5 h-5 text-purple-400" />,
            bg: 'bg-purple-950/40 border-purple-800/40 text-purple-200',
            badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
            title: 'Rol Activo: Administrador de Área (Música)',
            desc: 'Vista restringida al área de Música: solo puedes crear, editar y consultar eventos o métricas correspondientes a esta disciplina.'
          };
        }
        return {
          icon: <Trophy className="w-5 h-5 text-emerald-400" />,
          bg: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
          title: 'Rol Activo: Administrador de Área (Deportes)',
          desc: 'Vista restringida al área de Deportes: solo puedes crear, editar y consultar eventos o métricas correspondientes a esta disciplina.'
        };
      case 'aprendiz':
        return {
          icon: <GraduationCap className="w-5 h-5 text-sky-400" />,
          bg: 'bg-sky-950/40 border-sky-800/40 text-sky-200',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
          title: 'Rol Activo: Aprendiz (Sofía Castillo)',
          desc: 'Vista de usuario final: solo puedes visualizar los eventos programados para hoy y registrar tu confirmación de asistencia en aquellos habilitados.'
        };
      default:
        return null;
    }
  };

  const config = getRoleConfig();
  if (!config) return null;

  return (
    <div className={`border-b backdrop-blur-sm px-4 py-2.5 transition-colors ${config.bg}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-lg bg-black/20 shrink-0">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{config.title}</span>
              <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${config.badgeBg}`}>
                {currentUser.area ? `Área: ${currentUser.area}` : 'Nivel SuperAdmin'}
              </span>
            </div>
            <p className="opacity-80 mt-0.5">{config.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 text-slate-400 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Cambia de rol en la barra superior para explorar cada perspectiva</span>
        </div>
      </div>
    </div>
  );
}
