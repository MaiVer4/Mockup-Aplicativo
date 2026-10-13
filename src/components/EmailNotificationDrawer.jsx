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
      case 'preasistencia':
        return { label: 'CONFIRMACIÓN PREASISTENCIA', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'asistencia':
        return { label: 'REGISTRO DE ASISTENCIA', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'publicacion':
        return { label: 'EVENTO PUBLICADO', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      default:
        return { label: 'NOTIFICACIÓN', color: 'bg-zinc-100 text-zinc-700 border-zinc-200' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white h-full w-full max-w-md shadow-2xl border-l border-zinc-200 flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Cabecera */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950">
                Buzón de Notificaciones por Correo
              </h3>
              <p className="text-[11px] text-zinc-500">
                Trazabilidad en vivo de correos automáticos institucionales
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de correos emitidos */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {sentEmails.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 space-y-2">
              <Inbox className="w-8 h-8 mx-auto stroke-1" />
              <p>No se han emitido correos en esta sesión.</p>
            </div>
          ) : (
            sentEmails.map(mail => {
              const badge = getTypeBadge(mail.type);

              return (
                <div
                  key={mail.id}
                  className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-colors shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">
                      {mail.timestamp}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-400 block font-mono">DESTINATARIO:</span>
                    <span className="font-semibold text-zinc-900 font-mono text-[11px] bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200 inline-block">
                      {mail.to}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-zinc-950 text-xs mt-1">
                      {mail.subject}
                    </h4>
                    <p className="text-zinc-600 text-[11px] mt-1 leading-relaxed bg-zinc-50/50 p-2.5 rounded-lg border border-zinc-100">
                      {mail.body}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pie */}
        <div className="p-3 border-t border-zinc-200 bg-zinc-50 text-[11px] text-zinc-500 text-center">
          Demostración de eventos automáticos por correo según especificación SENA v2.
        </div>

      </div>
    </div>
  );
}
