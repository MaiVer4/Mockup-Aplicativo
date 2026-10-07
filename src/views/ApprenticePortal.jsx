import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Radio, 
  AlertCircle, 
  PartyPopper,
  Sparkles,
  Music,
  Trophy,
  ArrowRight
} from 'lucide-react';

export default function ApprenticePortal() {
  const { 
    currentUser, 
    events, 
    registerAttendance, 
    setActiveTab, 
    switchUser 
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Regla de negocio estricta: Solo eventos de HOY que estén PUBLICADOS o CERRADOS (no borradores)
  const todayAvailableEvents = events.filter(evt => {
    return evt.date === todayStr && (evt.status === 'published' || evt.status === 'closed');
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Tarjeta de Bienvenida del Aprendiz */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-indigo-800 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-sky-200 mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>Portal Estudiantil / Aprendiz</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                ¡Hola, {currentUser.name}! 👋
              </h1>
              <p className="text-sm text-sky-100 max-w-xl mt-1 opacity-90">
                Aquí tienes la cartelera exclusiva de los eventos publicados para el día de hoy. Puedes confirmar tu asistencia con un clic.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-right self-start md:self-center shrink-0">
            <div className="text-xs uppercase tracking-wider text-sky-200 font-bold">Fecha Actual</div>
            <div className="text-lg font-mono font-extrabold">{todayStr}</div>
            <div className="text-xs text-sky-200 mt-0.5">{todayAvailableEvents.length} eventos hoy</div>
          </div>
        </div>

        {/* Círculos decorativos de fondo */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-32 h-32 bg-sky-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Cartelera de Eventos Disponibles para Hoy */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              Eventos Disponibles Hoy ({todayStr})
            </h2>
            <p className="text-xs text-slate-500">
              Solo se muestran eventos con fecha de hoy y aprobados por la coordinación.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
            Acceso restringido por rol Aprendiz
          </span>
        </div>

        {todayAvailableEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No hay eventos programados para hoy todavía
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Puedes cambiar temporalmente al rol de <strong>Admin General</strong> en la barra superior para publicar eventos o cambiar fechas para probar el flujo.
            </p>
            <button
              onClick={() => switchUser('user_admin_gen')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Cambiar a Admin para Publicar Eventos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todayAvailableEvents.map((evt) => {
              const isRegistered = evt.attendedByUserIds?.includes(currentUser.id);
              const isMusic = evt.area === 'Música';
              const isClosed = evt.status === 'closed';
              const canAttend = evt.attendanceEnabled && !isClosed;

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Imagen del Evento */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />

                      {/* Badge de Área */}
                      <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border shadow-sm ${
                        isMusic
                          ? 'bg-purple-900/80 text-purple-200 border-purple-400/30'
                          : 'bg-emerald-900/80 text-emerald-200 border-emerald-400/30'
                      }`}>
                        {isMusic ? <Music className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5" />}
                        {evt.area}
                      </span>

                      {/* Badge de Estado del Registro */}
                      {isRegistered && (
                        <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-lg flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Asistencia Confirmada
                        </span>
                      )}

                      {/* Título en la Imagen */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="font-extrabold text-lg leading-tight drop-shadow-sm">
                          {evt.title}
                        </h3>
                      </div>
                    </div>

                    {/* Propósito y Detalles */}
                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Propósito del Evento
                        </span>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                          {evt.purpose}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="font-medium truncate">{evt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="font-medium truncate">{evt.location}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-slate-200/60 text-slate-500">
                          <Users className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>
                            Asistentes registrados: <strong className="text-slate-800">{evt.attendeesCount}</strong> / {evt.capacity} cupos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección de Aceptación de Asistencia */}
                  <div className="p-6 pt-0">
                    {isClosed ? (
                      <div className="p-3 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold text-center flex items-center justify-center gap-2">
                        <span>🔒 Este evento ya ha finalizado y se encuentra cerrado.</span>
                      </div>
                    ) : evt.attendanceEnabled ? (
                      <button
                        onClick={() => registerAttendance(evt.id)}
                        className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                          isRegistered
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                            : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-indigo-600/30 hover:scale-[1.01]'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            <span>¡Ya estás registrado! (Clic para cancelar)</span>
                          </>
                        ) : (
                          <>
                            <PartyPopper className="w-5 h-5 text-amber-300" />
                            <span>Confirmar / Aceptar Asistencia</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <strong className="block font-bold">Asistencia no habilitada aún</strong>
                          <span>El coordinador del evento aún no ha abierto el registro de asistencia.</span>
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
