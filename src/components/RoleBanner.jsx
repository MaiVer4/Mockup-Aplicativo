import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Music, Dumbbell, User, CheckCircle2 } from 'lucide-react';

export default function RoleBanner() {
  const { currentUser } = useApp();

  const getRoleConfig = () => {
    switch (currentUser.role) {
      case 'admin_general':
        return {
          icon: <Shield className="w-3.5 h-3.5 text-zinc-900" />,
          title: 'Rol Activo: Administrador General',
          badge: 'NIVEL CENTRAL // FULL ACCESS',
          desc: 'Permisos absolutos: ingesta de planillas Excel sin restricción de división, publicación, edición y cierre global de eventos.'
        };
      case 'admin_area':
        if (currentUser.area === 'Música') {
          return {
            icon: <Music className="w-3.5 h-3.5 text-zinc-900" />,
            title: 'Rol Activo: Lead de División (Música)',
            badge: 'DIVISIÓN // MÚSICA',
            desc: 'Permisos restringidos a eventos y métricas de la división de Música. Convocatorias de otras áreas se omiten.'
          };
        }
        return {
          icon: <Dumbbell className="w-3.5 h-3.5 text-zinc-900" />,
          title: 'Rol Activo: Lead de División (Deportes)',
          badge: 'DIVISIÓN // DEPORTES',
          desc: 'Permisos restringidos a eventos y métricas de la división de Deportes. Convocatorias de otras áreas se omiten.'
        };
      case 'aprendiz':
        return {
          icon: <User className="w-3.5 h-3.5 text-zinc-900" />,
          title: 'Rol Activo: Aprendiz / Participante (Sofía Castillo)',
          badge: 'VISTA PARTICIPANTE',
          desc: 'Visualización exclusiva de eventos convocados para hoy. Registro y acreditación de asistencia presencial.'
        };
      default:
        return null;
    }
  };

  const config = getRoleConfig();
  if (!config) return null;

  return (
    <div className="bg-zinc-50/80 border-b border-zinc-200/80 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded bg-white border border-zinc-200 flex items-center justify-center shrink-0">
            {config.icon}
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-semibold text-zinc-900 text-xs">{config.title}</span>
            <span className="font-mono text-[10px] text-zinc-600 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
              {config.badge}
            </span>
            <span className="text-zinc-500 hidden md:inline text-[11px]">— {config.desc}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>SISTEMA EN LÍNEA</span>
        </div>
      </div>
    </div>
  );
}
