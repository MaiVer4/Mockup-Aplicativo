import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles,
  FileText
} from 'lucide-react';

export default function HumanApprovalModal({ isOpen, onClose, event, onConfirmApproval }) {
  const [certified, setCertified] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!certified) return;
    setIsSubmitting(true);
    onConfirmApproval(event.id, {
      notes: approvalNotes.trim(),
      certifiedAt: new Date().toISOString()
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] overscroll-contain animate-in zoom-in-95 duration-150">
        
        {/* Cabecera Institucional */}
        <div className="px-5 py-4 border-b border-[#e2e8f0] bg-gradient-to-r from-[#0c2f3a] to-[#103a46] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-[#c4f246] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">
                Aprobación Humana de Publicación
              </h3>
              <p className="text-[11px] text-[#bfd3df]">
                Certificación y validación de parámetros normativos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido con Scroll */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* Ficha Resumen del Evento */}
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#c4f246] text-[#0e2738] font-mono text-[9px] font-extrabold">
                {event.area}
              </span>
              <span className="text-[10px] text-[#64748b] font-mono">
                {event.code || 'ACTIVIDAD SENA'}
              </span>
            </div>
            <h4 className="font-bold text-sm text-[#1e293b] font-heading leading-snug">
              {event.title}
            </h4>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e2e8f0]/80 text-[11px] text-[#475569]">
              <div className="flex items-center gap-1.5 truncate">
                <Calendar className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                <span className="font-mono font-semibold text-[#1e293b]">{event.date || 'Fecha pendiente'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Clock className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                <span className="font-mono">{event.time || '14:00 - 17:00'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                <span className="truncate">{event.location || 'Sede Principal'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Users className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                <span>{event.capacity || 60} cupos de aforo</span>
              </div>
            </div>
          </div>

          {/* Lista de Verificación Humana */}
          <div className="space-y-2">
            <label className="font-bold text-xs text-[#1e293b] block">
              Puntos de Verificación Humana:
            </label>
            <div className="space-y-1.5">
              <div className="p-2.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-start gap-2 text-[11px] text-[#166534]">
                <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                <span>Fecha y horario de ejecución definitivos comprobados sin conflictos de calendario.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-start gap-2 text-[11px] text-[#166534]">
                <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                <span>Aforo institucional y disponibilidad física de instalaciones verificadas.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-start gap-2 text-[11px] text-[#166534]">
                <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                <span>Alineación de objetivos con el formato oficial de bienestar GOR-F-013.</span>
              </div>
              {event.image ? (
                <div className="p-2.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-start gap-2 text-[11px] text-[#166534]">
                  <Sparkles className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span>Portada gráfica asignada y aprobada para publicación en la cartelera digital.</span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2 text-[11px] text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Se publicará con la portada institucional por defecto (puedes actualizarla luego).</span>
                </div>
              )}
            </div>
          </div>

          {/* Observaciones Opcionales */}
          <div>
            <label className="block text-[11px] font-bold text-[#334155] mb-1">
              Observaciones o directrices adicionales para los aprendices (opcional):
            </label>
            <textarea
              rows={2}
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Ej. Llevar ropa deportiva / Ingreso exclusivo con carnet de aprendiz..."
              className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d] resize-none"
            />
          </div>

          {/* Declaración Obligatoria de Certificación */}
          <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#cbd5e1] flex items-start gap-3">
            <input
              id="certify-checkbox"
              type="checkbox"
              checked={certified}
              onChange={(e) => setCertified(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#15803d] border-[#cbd5e1] focus:ring-[#15803d] cursor-pointer"
            />
            <label htmlFor="certify-checkbox" className="text-[11px] text-[#1e293b] font-medium leading-relaxed cursor-pointer">
              <strong>Certificación de Validación Humana:</strong> Certifico que he comprobado la exactitud de los datos y autorizo la publicación inmediata de esta actividad en la cartelera del aprendiz.
            </label>
          </div>

          {/* Acciones */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#475569] hover:bg-[#f1f5f9] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!certified || isSubmitting}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                certified && !isSubmitting
                  ? 'bg-[#15803d] hover:bg-[#166534] text-white cursor-pointer active:scale-[0.96]'
                  : 'bg-[#cbd5e1] text-[#64748b] cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Aprobar y Publicar en Cartelera</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
