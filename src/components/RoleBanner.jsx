import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RoleBanner() {
  const { currentUser } = useApp();

  const getRoleConfig = () => {
    switch (currentUser.role) {
      case 'admin_general':
        return {
          icon: <Shield className="w-3.5 h-3.5 text-zinc-950" />,
          title: 'Rol Activo: Administrador General (Coordinación SENA)',
          badge: 'SUPERVISIÓN // ACCESO GLOBAL',
          desc: 'Supervisión de métricas globales, directorio de encargados y emisión de enlaces de invitación institucionales.'
        };
      case 'admin_area':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-zinc-950" />,
          title: `Rol Activo: Encargado de Área (${currentUser.area})`,
          badge: `ENCARGADO // ${currentUser.area?.toUpperCase()}`,
          desc: 'Carga del plan anual Excel con IA, revisión de ambigüedades, publicación, habilitación de asistencia y exportación oficial GOR-F-013.'
        };
      case 'aprendiz':
        return {
          icon: <User className="w-3.5 h-3.5 text-zinc-950" />,
          title: `Rol Activo: Aprendiz SENA (${currentUser.name})`,
          badge: currentUser.isProfileComplete ? 'PERFIL OFICIAL ACTIVO' : 'REGISTRO INICIAL PENDIENTE',
          desc: 'Consulta de eventos, preasistencia (hasta 1h antes), asistencia presencial en 1 clic con firma temporal digital e historial personal.'
        };
      default:
        return null;
    }
  };

  const config = getRoleConfig();
  if (!config) return null;

  return (
    <div className="bg-zinc-100/80 border-b border-zinc-200 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-2xs">
            {config.icon}
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-bold text-zinc-900 text-xs">{config.title}</span>
            <span className="font-mono text-[9px] text-zinc-700 bg-white px-1.5 py-0.5 rounded border border-zinc-200 font-semibold">
              {config.badge}
            </span>
            <span className="text-zinc-600 hidden md:inline text-[11px]">— {config.desc}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 self-end sm:self-auto">
          <span>BIENESTAR AL APRENDIZ</span>
        </div>
      </div>
    </div>
  );
}
