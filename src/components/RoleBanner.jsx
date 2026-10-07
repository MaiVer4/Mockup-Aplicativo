import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Music, Trophy, GraduationCap, Award } from 'lucide-react';

export default function RoleBanner() {
  const { currentUser } = useApp();

  const getRoleConfig = () => {
    switch (currentUser.role) {
      case 'admin_general':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
          bg: 'bg-[#0f2747] border-slate-700 text-slate-200',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
          title: 'Credencial: Decanatura General / Dirección de Extensión',
          desc: 'Supervisión curricular integral de todas las áreas académicas, validación de convocatorias y libro mayor de asistencias.'
        };
      case 'admin_area':
        if (currentUser.area === 'Música') {
          return {
            icon: <Music className="w-4 h-4 text-purple-300" />,
            bg: 'bg-[#181d36] border-purple-900/50 text-purple-100',
            badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
            title: 'Credencial: Dirección del Departamento de Música',
            desc: 'Gestión exclusiva del programa académico musical: conciertos, ensambles, talleres de síntesis y control de asistencia departamental.'
          };
        }
        return {
          icon: <Trophy className="w-4 h-4 text-emerald-300" />,
          bg: 'bg-[#0f2a24] border-emerald-900/50 text-emerald-100',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
          title: 'Credencial: Dirección del Departamento de Deportes y Bienestar',
          desc: 'Gestión exclusiva del programa formativo deportivo: torneos interfichas, acondicionamiento y acreditación de asistencia física.'
        };
      case 'aprendiz':
        return {
          icon: <GraduationCap className="w-4 h-4 text-sky-300" />,
          bg: 'bg-[#0d223a] border-sky-900/50 text-sky-100',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
          title: 'Credencial: Estudiante / Aprendiz Matriculado (Sofía Castillo)',
          desc: `Matrícula: ${currentUser.matricula || 'MAT-2026-8842'} | Acceso a la agenda del día para confirmar asistencia presencial y registrar presencia.`
        };
      default:
        return null;
    }
  };

  const config = getRoleConfig();
  if (!config) return null;

  return (
    <div className={`border-b px-4 py-2.5 transition-colors ${config.bg}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-black/30 border border-white/10 shrink-0">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs tracking-wide">{config.title}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${config.badgeBg}`}>
                {currentUser.area ? `Depto: ${currentUser.area}` : 'Nivel Central'}
              </span>
            </div>
            <p className="opacity-80 mt-0.5 text-[11px] leading-tight">{config.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 text-amber-300/80 text-[11px] font-medium">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Simulación por Perfil Académico</span>
        </div>
      </div>
    </div>
  );
}
