import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Mail, 
  CheckCircle2, 
  Send, 
  Calendar, 
  Clock, 
  User, 
  Inbox
} from 'lucide-react';

export default function EmailNotificationDrawer({ isOpen, onClose }) {
  const { sentEmails } = useApp();

  if (!isOpen) return null;

  const getTypeBadge = (type) => {
    switch (type) {
      case 'invitacion':
        return { label: 'INVITACIÓN ENCARGADO', color: 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]' };
      case 'asistencia':
        return { label: 'REGISTRO DE ASISTENCIA', color: 'bg-[#eafaf1] text-[#15803d] border-[#bbf7d0]' };
      case 'publicacion':
        return { label: 'EVENTO PUBLICADO', color: 'bg-[#f3e8ff] text-[#7e22ce] border-[#e9d5ff]' };
      default:
        return { label: 'NOTIFICACIÓN', color: 'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]' };
    }
  };

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
                Buzón de Notificaciones por Correo
              </h3>
              <p className="text-[11px] text-[#64748b]">
                Trazabilidad en vivo de correos automáticos institucionales
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

        {/* Lista de correos emitidos */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs overscroll-contain">
          {sentEmails.length === 0 ? (
            <div className="text-center py-12 text-[#94a3b8] space-y-2">
              <Inbox className="w-8 h-8 mx-auto stroke-1" />
              <p>No se han emitido correos en esta sesión.</p>
            </div>
          ) : (
            sentEmails.map(mail => {
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
                    <span className="text-[10px] text-[#64748b] block font-mono font-medium">DESTINATARIO:</span>
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
        <div className="p-3 border-t border-[#e2e8f0] bg-[#f8fafc] text-[11px] text-[#64748b] text-center font-medium">
          Demostración de eventos automáticos por correo según especificación SENA v2.
        </div>

      </div>
    </div>
  );
}
