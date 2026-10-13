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
  ArrowRight
} from 'lucide-react';

export default function EventDetailModal({ isOpen, onClose, event }) {
  const { 
    currentUser, 
    registerPreAttendance, 
    registerAttendance,
    publishEvent,
    startEventAttendance,
    closeEventAttendance 
  } = useApp();

  if (!isOpen || !event) return null;

  const isLearner = currentUser.role === 'aprendiz';
  const isEncargado = currentUser.role === 'admin_area';
  const isPreRegistered = event.preattendedByUserIds?.includes(currentUser.id);
  const isAttended = event.attendedByUserIds?.includes(currentUser.id);
  const isEnCurso = event.status === 'en_curso';
  const isPublicado = event.status === 'publicado';
  const isFinalizado = event.status === 'finalizado';
  const isDraft = event.status === 'borrador';

  const capacity = event.capacity || 50;
  const attendeesCount = event.attendeesCount || 0;
  const preattendanceCount = event.preattendanceCount || 0;
  const percent = Math.min(100, Math.round((attendeesCount / capacity) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09182b]/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#e4e8ee] w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] relative">
        
        {/* Botón Cerrar flotante con blur */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#0d2039]/70 hover:bg-[#0d2039] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero de Portada estilo Functional Mockup */}
        <div className="relative h-60 w-full overflow-hidden shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071528]/95 via-[#071528]/40 to-transparent" />
          
          <div className="absolute bottom-5 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#c9f45a] text-[#15304f] text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg font-mono">
                {event.area}
              </span>
              <span className="bg-white/20 text-white backdrop-blur-xs text-[10px] font-bold px-2.5 py-0.5 rounded-lg">
                {event.quarter || 'Trimestre 4'}
              </span>
              {isEnCurso && (
                <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg animate-pulse">
                  EN CURSO
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold font-heading text-white tracking-tight">
              {event.title}
            </h2>
            <p className="text-xs text-[#cbd5e1] line-clamp-1">
              {event.purpose}
            </p>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          
          {/* Métricas clave estilo Functional Mockup */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#f4f7fa] border border-[#e8ecf2]">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#8290a1] font-mono block">
                ASISTENTES
              </span>
              <strong className="text-2xl font-extrabold text-[#1d3758] font-heading block mt-1">
                {attendeesCount}
              </strong>
              <small className="text-[#8592a3] text-[10px]">de {capacity} cupos</small>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f4f7fa] border border-[#e8ecf2]">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#8290a1] font-mono block">
                CONFIRMADOS
              </span>
              <strong className="text-2xl font-extrabold text-[#1d3758] font-heading block mt-1">
                {preattendanceCount}
              </strong>
              <small className="text-[#8592a3] text-[10px]">preasistencias</small>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f4f7fa] border border-[#e8ecf2]">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#8290a1] font-mono block">
                OCUPACIÓN
              </span>
              <strong className="text-2xl font-extrabold text-[#1d3758] font-heading block mt-1">
                {percent}%
              </strong>
              <small className="text-[#8592a3] text-[10px]">del aforo oficial</small>
            </div>
          </div>

          {/* Información y Parámetros con Iconos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#f8fafc] border border-[#e8ecf2]">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#7890aa] shrink-0" />
              <div>
                <small className="text-[10px] text-[#8e9aaa] block">Fecha y Horario</small>
                <strong className="text-xs text-[#314966] font-mono block">{event.date} • {event.schedule || '14:00'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#7890aa] shrink-0" />
              <div className="truncate">
                <small className="text-[10px] text-[#8e9aaa] block">Ubicación</small>
                <strong className="text-xs text-[#314966] block truncate">{event.location}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#7890aa] shrink-0" />
              <div>
                <small className="text-[10px] text-[#8e9aaa] block">Responsable</small>
                <strong className="text-xs text-[#314966] block">Bienestar • {event.area}</strong>
              </div>
            </div>
          </div>

          {/* Descripción Extendida y Metodología */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#142b4d] font-heading">
              Metodología y Objetivos Formativos
            </h4>
            <div className="p-3.5 rounded-xl bg-white border border-[#e4e8ee] text-[#556987] leading-relaxed text-xs">
              {event.extendedDescription || event.purpose}
            </div>
          </div>

          {/* Acciones para el Aprendiz */}
          {isLearner && (
            <div className="pt-2 border-t border-[#edf0f3]">
              {isAttended ? (
                <div className="p-3.5 rounded-xl bg-[#eaf7ec] border border-[#bbf7d0] text-[#16a34a] font-bold flex items-center justify-center gap-2 text-xs">
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
                  className="btn btn-primary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#10233f]" />
                  <span>Confirmar Asistencia Presencial (1 Clic)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    registerPreAttendance(event.id);
                    onClose();
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isPreRegistered
                      ? 'bg-[#edf4fc] text-[#245486] border border-[#bfdbfe] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                      : 'btn btn-primary'
                  }`}
                >
                  {isPreRegistered ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Preasistencia Registrada (Cancelar Reserva)</span>
                    </>
                  ) : (
                    <>
                      <span>Registrar Preasistencia a esta Actividad</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Acciones para el Encargado */}
          {isEncargado && (
            <div className="pt-2 border-t border-[#edf0f3] flex flex-wrap gap-2">
              {isDraft && (
                <button
                  type="button"
                  onClick={() => {
                    publishEvent(event.id);
                    onClose();
                  }}
                  className="btn btn-primary flex-1 py-2 text-xs font-bold"
                >
                  <span>Publicar Evento</span>
                </button>
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
