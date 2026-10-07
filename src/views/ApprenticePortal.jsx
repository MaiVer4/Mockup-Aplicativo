import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  PartyPopper,
  Music,
  Trophy,
  ArrowRight,
  Award,
  BookOpen,
  BadgeCheck,
  Building2
} from 'lucide-react';

export default function ApprenticePortal() {
  const { 
    currentUser, 
    events, 
    registerAttendance, 
    switchUser 
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Regla de negocio: Solo eventos de HOY que estén PUBLICADOS o CERRADOS
  const todayAvailableEvents = events.filter(evt => {
    return evt.date === todayStr && (evt.status === 'published' || evt.status === 'closed');
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Carné Digital / Encabezado Estudiantil */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0b1e38] via-[#143156] to-[#0b1e38] text-white shadow-xl border border-slate-700/80 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-400/40 shadow-lg"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold mb-1.5 uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Portal de Acreditación Estudiantil</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                {currentUser.name}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span>Matrícula: <strong className="text-amber-300 font-mono">{currentUser.matricula || 'MAT-2026-8842'}</strong></span>
                <span>•</span>
                <span>Estado: <strong className="text-emerald-400">Regular / Activo</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-right self-start md:self-center shrink-0">
            <div className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Fecha del Calendario Lectivo</div>
            <div className="text-lg font-mono font-extrabold text-white">{todayStr}</div>
            <div className="text-xs text-slate-300 mt-0.5">{todayAvailableEvents.length} convocatorias activas hoy</div>
          </div>
        </div>

        {/* Ribete dorado fino en la tarjeta */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
      </div>

      {/* Cartelera de Actividades del Día */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-slate-200/90 pb-3">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#0b1e38] flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-600" />
              Convocatorias Programadas para Hoy ({todayStr})
            </h2>
            <p className="text-xs text-slate-500">
              Solo se muestran eventos con fecha de hoy y aprobados por la coordinación correspondiente.
            </p>
          </div>

          <span className="text-[11px] font-bold px-3 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            Acreditación de Asistencia en Línea
          </span>
        </div>

        {todayAvailableEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#0b1e38]">
              No hay convocatorias programadas para la fecha de hoy
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Puedes cambiar temporalmente al rol de <strong>Decanatura General</strong> en la barra superior para publicar convocatorias o modificar fechas de prueba.
            </p>
            <button
              onClick={() => switchUser('user_admin_gen')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0b1e38] text-amber-300 hover:bg-[#143156] border border-amber-400/40 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Cambiar a Decanatura para Publicar Convocatorias</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todayAvailableEvents.map((evt) => {
              const isRegistered = evt.attendedByUserIds?.includes(currentUser.id);
              const isMusic = evt.area === 'Música';
              const isClosed = evt.status === 'closed';

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Imagen de la Ficha */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#061325]/90 via-black/25 to-transparent" />

                      {/* Sello de Área y Código */}
                      <div className="absolute top-4 left-4 flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold backdrop-blur-md border shadow-sm ${
                          isMusic
                            ? 'bg-[#0b1e38]/90 text-amber-200 border-amber-400/30'
                            : 'bg-[#064e3b]/90 text-emerald-100 border-emerald-400/30'
                        }`}>
                          {isMusic ? <Music className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5" />}
                          Depto. {evt.area}
                        </span>

                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-slate-200 border border-white/20">
                          {evt.code || 'ACT-2026'}
                        </span>
                      </div>

                      {/* Badge de Asistencia Acreditada */}
                      {isRegistered && (
                        <span className="absolute top-4 right-4 px-3 py-1 rounded-md text-xs font-bold bg-emerald-700 text-white shadow-lg border border-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Asistencia Acreditada
                        </span>
                      )}

                      {/* Título en la Imagen */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="font-serif font-bold text-lg leading-tight drop-shadow-sm">
                          {evt.title}
                        </h3>
                      </div>
                    </div>

                    {/* Contenido Curricular */}
                    <div className="p-6 space-y-4">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-1">
                          Propósito Pedagógico y Formativo
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {evt.purpose}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="font-medium truncate">{evt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="font-medium truncate">{evt.location}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-slate-200/60 text-slate-500">
                          <Users className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            Quórum actual: <strong className="text-[#0b1e38] font-bold">{evt.attendeesCount}</strong> de {evt.capacity} cupos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección de Registro de Asistencia */}
                  <div className="p-6 pt-0">
                    {isClosed ? (
                      <div className="p-3 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold text-center flex items-center justify-center gap-2">
                        <span>🔒 Esta convocatoria ha finalizado y el acta se encuentra cerrada.</span>
                      </div>
                    ) : evt.attendanceEnabled ? (
                      <button
                        onClick={() => registerAttendance(evt.id)}
                        className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
                          isRegistered
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
                            : 'bg-[#0b1e38] hover:bg-[#143156] text-amber-300 border border-amber-400/40 shadow-sm hover:scale-[1.01]'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>✓ Asistencia Acreditada (Clic para cancelar registro)</span>
                          </>
                        ) : (
                          <>
                            <BadgeCheck className="w-4 h-4 text-amber-400" />
                            <span>Confirmar / Acreditar Mi Asistencia</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                        <div>
                          <strong className="block font-bold">Libro de Asistencia cerrado temporalmente</strong>
                          <span className="text-[11px] text-amber-800">El docente o coordinador abrirá el registro durante la sesión presencial.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
