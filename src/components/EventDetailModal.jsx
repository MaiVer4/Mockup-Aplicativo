import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Check,
  Play,
  Pause,
  FileSpreadsheet,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export default function EventDetailModal({ isOpen, onClose, event }) {
  const { 
    currentUser, 
    registerAttendance,
    publishEvent,
    startEventAttendance,
    closeEventAttendance,
    generateAIEventCover
  } = useApp();

  if (!isOpen || !event) return null;

  const isLearner = currentUser.role === 'aprendiz';
  const isEncargado = currentUser.role === 'admin_area';
  const isAttended = event.attendedByUserIds?.includes(currentUser.id);
  const isEnCurso = event.status === 'en_curso';
  const isPublicado = event.status === 'publicado';
  const isFinalizado = event.status === 'finalizado';
  const isDraft = event.status === 'borrador';

  const capacity = event.capacity || 50;
  const attendeesCount = event.attendeesCount || 0;
  const percent = Math.min(100, Math.round((attendeesCount / capacity) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-[#e2e8f0] w-full max-w-2xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh] relative">
        
        {/* Botón Cerrar flotante con blur */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0e2738]/80 hover:bg-[#0e2738] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero de Portada estilo Functional Mockup */}
        <div className="relative h-44 sm:h-60 w-full overflow-hidden shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c2f3a]/95 via-[#0c2f3a]/40 to-transparent" />
          
          <div className="absolute bottom-3 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 text-white space-y-1 sm:space-y-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="bg-[#c4f246] text-[#0e2738] text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-lg font-mono">
                {event.area}
              </span>
              <span className="bg-white/20 text-white backdrop-blur-xs text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-lg">
                {event.quarter || 'Trimestre 4'}
              </span>
              {isEnCurso && (
                <span className="bg-[#15803d] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-lg animate-pulse">
                  EN CURSO
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold font-heading text-white tracking-tight line-clamp-2">
              {event.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-1">
              {event.purpose}
            </p>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs flex-1">
          
          {/* Métricas clave estilo Functional Mockup */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#64748b] font-mono block">
                ASISTENTES
              </span>
              <strong className="text-xl sm:text-2xl font-extrabold text-[#1e293b] font-heading block mt-0.5 sm:mt-1">
                {attendeesCount}
              </strong>
              <small className="text-[#64748b] text-[9px] sm:text-[10px] truncate block">asistencias en sala</small>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#64748b] font-mono block">
                CAPACIDAD
              </span>
              <strong className="text-xl sm:text-2xl font-extrabold text-[#1e293b] font-heading block mt-0.5 sm:mt-1">
                {capacity}
              </strong>
              <small className="text-[#64748b] text-[9px] sm:text-[10px] truncate block">aforo oficial</small>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#eafaf1] border border-[#bbf7d0]">
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#15803d] font-mono block">
                OCUPACIÓN
              </span>
              <strong className="text-xl sm:text-2xl font-extrabold text-[#15803d] font-heading block mt-0.5 sm:mt-1">
                {percent}%
              </strong>
              <small className="text-[#15803d] text-[9px] sm:text-[10px] truncate block">meta alcanzada</small>
            </div>
          </div>

          {/* Información y Parámetros con Iconos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#64748b] shrink-0" />
              <div>
                <small className="text-[10px] text-[#64748b] block">Fecha y Horario</small>
                <strong className="text-xs text-[#334155] font-mono block">{event.date} • {event.schedule || '14:00'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#64748b] shrink-0" />
              <div className="truncate">
                <small className="text-[10px] text-[#64748b] block">Ubicación</small>
                <strong className="text-xs text-[#334155] block truncate">{event.location}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#64748b] shrink-0" />
              <div>
                <small className="text-[10px] text-[#64748b] block">Responsable</small>
                <strong className="text-xs text-[#334155] block">Bienestar • {event.area}</strong>
              </div>
            </div>
          </div>

          {/* Descripción Extendida y Metodología */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#1e293b] font-heading">
              Metodología y Objetivos Formativos
            </h4>
            <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#334155] leading-relaxed text-xs">
              {event.extendedDescription || event.purpose}
            </div>
          </div>

          {/* Acciones para el Aprendiz */}
          {isLearner && (
            <div className="pt-2 border-t border-[#e2e8f0]">
              {isAttended ? (
                <div className="p-3.5 rounded-xl bg-[#eafaf1] border border-[#bbf7d0] text-[#15803d] font-bold flex items-center justify-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tu asistencia presencial está certificada en acta con firma digital</span>
                </div>
              ) : isEnCurso ? (
                <button
                  type="button"
                  onClick={() => {
                    registerAttendance(event.id);
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm bg-[#15803d] text-white hover:bg-[#166534] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Confirmar Asistencia Presencial (1 Clic)</span>
                </button>
              ) : isFinalizado ? (
                <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] text-center text-xs font-semibold">
                  Evento finalizado · Acreditación presencial cerrada
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#f0f9ff] border border-[#bae6fd] text-[#0369a1] text-xs font-medium flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>Programado · La acreditación presencial se habilitará al iniciar la actividad</span>
                </div>
              )}
            </div>
          )}

          {/* Alerta de Ambigüedad para el Encargado */}
          {isEncargado && isDraft && event.isAmbiguous && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-bold text-xs">Fecha pendiente de confirmación</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {event.ambiguityReason || 'Esta actividad proviene del plan de bienestar con programación tentativa. Confirma la fecha para proceder a publicarla en la cartelera oficial.'}
              </p>
            </div>
          )}

          {/* RF-07: Generación de Portada con IA al Publicar */}
          {isEncargado && isDraft && (
            <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#15803d]" />
                  <span className="font-bold text-xs text-[#166534]">Portada con IA Institucional</span>
                </div>
                <button
                  type="button"
                  onClick={() => generateAIEventCover(event.id)}
                  className="px-2.5 py-1 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Regenerar Portada con IA</span>
                </button>
              </div>
              <p className="text-[11px] text-[#166534]/90 leading-tight">
                Genera una portada visual temática adaptada al área ({event.area}) y propósito antes de publicar formalmente.
              </p>
            </div>
          )}

          {/* Acciones para el Encargado */}
          {isEncargado && (
            <div className="pt-2 border-t border-[#edf0f3] flex flex-wrap gap-2">
              {isDraft && (
                event.isAmbiguous ? (
                  <button
                    type="button"
                    onClick={() => {
                      const success = publishEvent(event.id, { confirmAmbiguity: true });
                      if (success) onClose();
                    }}
                    className="btn bg-[#15803d] hover:bg-[#166534] text-white flex-1 py-2 text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirmar Fecha Sugerida y Publicar</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const success = publishEvent(event.id);
                      if (success) onClose();
                    }}
                    className="btn btn-primary flex-1 py-2 text-xs font-bold"
                  >
                    <span>Publicar Evento</span>
                  </button>
                )
              )}

              {isPublicado && (
                <button
                  type="button"
                  onClick={() => {
                    startEventAttendance(event.id);
                    onClose();
                  }}
                  className="btn btn-sena flex-1 py-2 text-xs font-bold"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Habilitar Asistencia Presencial</span>
                </button>
              )}

              {isEnCurso && (
                <button
                  type="button"
                  onClick={() => {
                    closeEventAttendance(event.id);
                    onClose();
                  }}
                  className="btn btn-danger flex-1 py-2 text-xs font-bold"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Finalizar Evento</span>
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
