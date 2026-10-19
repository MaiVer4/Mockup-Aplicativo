import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Mail, 
  CheckCircle2, 
  Send, 
  Calendar, 
  Clock, 
  User, 
  Inbox,
  Filter,
  ShieldCheck,
  Ban,
  Lock,
  KeyRound,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import EmptyState from './EmptyState';

export default function EmailNotificationDrawer({ isOpen, onClose }) {
  const { sentEmails } = useApp();
  const [activeCategory, setActiveCategory] = useState('ALL'); // 'ALL' | 'asistencia' | 'eventos' | 'aprobaciones' | 'seguridad'

  if (!isOpen) return null;

  const getTypeBadge = (type) => {
    switch (type) {
      case 'recuperacion':
        return { label: 'RECUPERACIÓN SEGURIDAD', color: 'bg-amber-50 text-amber-900 border-amber-300' };
      case 'invitacion':
        return { label: 'INVITACIÓN ENCARGADO', color: 'bg-sky-50 text-sky-800 border-sky-300' };
      case 'asistencia':
        return { label: 'REGISTRO DE ASISTENCIA', color: 'bg-[#eafaf1] text-[#15803d] border-[#bbf7d0]' };
      case 'aprobacion_solicitada':
        return { label: 'REVISIÓN SOLICITADA', color: 'bg-indigo-50 text-indigo-900 border-indigo-300' };
      case 'aprobacion_resuelta':
        return { label: 'DICTAMEN COORDINACIÓN', color: 'bg-purple-50 text-purple-900 border-purple-300' };
      case 'publicacion':
        return { label: 'ACTIVIDAD PUBLICADA', color: 'bg-violet-50 text-violet-900 border-violet-300' };
      case 'asistencia_apertura':
        return { label: 'APERTURA DE ASISTENCIA', color: 'bg-teal-50 text-teal-900 border-teal-300' };
      case 'asistencia_cierre':
        return { label: 'CIERRE ACTA GOR-F-013', color: 'bg-slate-100 text-slate-800 border-slate-300' };
      case 'cancelacion':
        return { label: 'ACTIVIDAD CANCELADA', color: 'bg-rose-50 text-rose-900 border-rose-300' };
      case 'onboarding_bienvenida':
        return { label: 'BIENVENIDA APRENDIZ', color: 'bg-emerald-50 text-emerald-900 border-emerald-300' };
      default:
        return { label: 'NOTIFICACIÓN', color: 'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]' };
    }
  };

  const filteredEmails = sentEmails.filter(mail => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'asistencia') {
      return mail.type === 'asistencia' || mail.type === 'asistencia_apertura' || mail.type === 'asistencia_cierre';
    }
    if (activeCategory === 'eventos') {
      return mail.type === 'publicacion' || mail.type === 'cancelacion' || mail.type === 'invitacion';
    }
    if (activeCategory === 'aprobaciones') {
      return mail.type === 'aprobacion_solicitada' || mail.type === 'aprobacion_resuelta';
    }
    if (activeCategory === 'seguridad') {
      return mail.type === 'recuperacion' || mail.type === 'onboarding_bienvenida';
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#0e2738]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white h-full w-full max-w-md shadow-2xl border-l border-[#e2e8f0] flex flex-col overscroll-contain animate-in slide-in-from-right duration-200">
        
        {/* Cabecera */}
        <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0e2738] text-[#c4f246] flex items-center justify-center shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e293b] font-heading">
                Buzón de Notificaciones Institucionales
              </h3>
              <p className="text-[11px] text-[#64748b]">
                Trazabilidad oficial de 10 tipos de eventos automatizados (SENA v2)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de Filtros por Categoría */}
        <div className="px-4 py-2 border-b border-[#e2e8f0] bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
          {[
            { id: 'ALL', label: 'Todas' },
            { id: 'asistencia', label: 'Asistencia' },
            { id: 'eventos', label: 'Eventos' },
            { id: 'aprobaciones', label: 'Aprobaciones' },
            { id: 'seguridad', label: 'Seguridad' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap active:scale-[0.96] text-[11px] ${
                activeCategory === cat.id
                  ? 'bg-[#15803d] text-white shadow-2xs font-bold'
                  : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Lista de correos emitidos */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs overscroll-contain custom-scrollbar">
          {filteredEmails.length === 0 ? (
            <EmptyState
              title="Sin notificaciones en esta categoría"
              description="No hay mensajes emitidos con el filtro actual. Selecciona 'Todas' para ver el buzón completo."
              icon={Inbox}
              actionLabel="Ver Todas las Notificaciones"
              onAction={() => setActiveCategory('ALL')}
            />
          ) : (
            filteredEmails.map(mail => {
              const badge = getTypeBadge(mail.type);

              return (
                <div
                  key={mail.id}
                  className="p-4 rounded-2xl border border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:shadow-xs transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded-lg font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="font-mono text-[10px] text-[#64748b]">
                      {mail.timestamp}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#64748b] block font-mono font-medium">DESTINATARIO OFICIAL:</span>
                    <span className="font-semibold text-[#1e293b] font-mono text-[11px] bg-[#f8fafc] px-2 py-0.5 rounded-lg border border-[#e2e8f0] inline-block mt-0.5">
                      {mail.to}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#1e293b] text-xs mt-1 font-heading">
                      {mail.subject}
                    </h4>
                    <p className="text-[#334155] text-[11px] mt-1.5 leading-relaxed bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
                      {mail.body}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pie */}
        <div className="p-3 border-t border-[#e2e8f0] bg-[#f8fafc] text-[10px] text-[#64748b] text-center font-medium">
          Emisión de 10 tipos de notificaciones normativas integradas con el buzón institucional.
        </div>

      </div>
    </div>
  );
}
