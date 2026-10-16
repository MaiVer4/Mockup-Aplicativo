import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RoleBanner() {
  const { currentUser } = useApp();

  const getRoleConfig = () => {
    switch (currentUser.role) {
      case 'admin_general':
        return {
          icon: <Shield className="w-3.5 h-3.5 text-[#15803d]" />,
          title: 'Rol Activo: Administrador General (Coordinación SENA)',
          badge: 'SUPERVISIÓN GLOBAL',
          desc: 'Supervisión de métricas globales, directorio de encargados y emisión de enlaces de invitación institucionales.'
        };
      case 'admin_area':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />,
          title: `Rol Activo: Encargado de Área (${currentUser.area})`,
          badge: `ENCARGADO DE ${currentUser.area?.toUpperCase()}`,
          desc: 'Carga del plan anual Excel con IA, revisión de ambigüedades, publicación, habilitación de asistencia y exportación oficial GOR-F-013.'
        };
      case 'aprendiz':
        return {
          icon: <User className="w-3.5 h-3.5 text-[#0284c7]" />,
          title: `Rol Activo: Aprendiz SENA (${currentUser.name})`,
          badge: currentUser.isProfileComplete ? 'PERFIL OFICIAL ACTIVO' : 'REGISTRO INICIAL PENDIENTE',
          desc: 'Consulta de cartelera institucional, acreditación presencial de asistencia en 1 clic con firma digital de servidor e historial personal.'
        };
      default:
        return null;
    }
  };

  const config = getRoleConfig();
  if (!config) return null;

  return (
    <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-white border border-[#cbd5e1] flex items-center justify-center shrink-0 shadow-2xs">
            {config.icon}
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-bold text-[#1e293b] text-xs font-heading">{config.title}</span>
            <span className="text-[10px] text-[#15803d] bg-[#eafaf1] px-2 py-0.5 rounded-md border border-[#bbf7d0] font-bold font-heading">
              {config.badge}
            </span>
            <span className="text-[#475569] hidden md:inline text-[11px]">— {config.desc}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#64748b] self-end sm:self-auto font-semibold font-heading tracking-wider">
          <span>BIENESTAR AL APRENDIZ</span>
        </div>
      </div>
    </div>
  );
}
