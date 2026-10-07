import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function ApprenticePortal() {
  const { 
    currentUser, 
    events, 
    registerAttendance, 
    switchUser 
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Regla: Solo eventos de HOY que estén PUBLICADOS o CERRADOS
  const todayAvailableEvents = events.filter(evt => {
    return evt.date === todayStr && (evt.status === 'published' || evt.status === 'closed');
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      
      {/* Credencial Digital Minimalista */}
      <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-lg object-cover border border-zinc-200"
          />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-zinc-950 text-sm">{currentUser.name}</span>
              <span className="font-mono text-[10px] text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                {currentUser.matricula || 'ID-8842'}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Participante // Acreditación de Asistencia Diaria
            </p>
          </div>
        </div>

        <div className="font-mono text-right text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100">
          <div className="text-[10px] text-zinc-400">FECHA ACTUAL</div>
          <div className="font-bold text-zinc-900">{todayStr}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">{todayAvailableEvents.length} eventos hoy</div>
        </div>
      </div>

      {/* Cartelera de Eventos de Hoy */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
              Eventos Disponibles Hoy ({todayStr})
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Confirma tu asistencia haciendo clic en los eventos con registro habilitado.
            </p>
          </div>

          <span className="font-mono text-[10px] text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
            SOLO LECTURA + CHECK-IN
          </span>
        </div>

        {todayAvailableEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-zinc-200 space-y-3">
            <p className="text-zinc-500 text-xs font-mono">
              No hay eventos programados para la fecha de hoy.
            </p>
            <button
              onClick={() => switchUser('user_admin_gen')}
              className="btn-tactile px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Cambiar a Admin para Publicar Eventos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayAvailableEvents.map((evt) => {
              const isRegistered = evt.attendedByUserIds?.includes(currentUser.id);
              const isClosed = evt.status === 'closed';

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-zinc-300 transition-all"
                >
                  <div>
                    {/* Imagen */}
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white border border-white/20">
                          {evt.area}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-zinc-300">
                          {evt.code || 'EVT'}
                        </span>
                      </div>

                      {isRegistered && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500 text-white flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          CONFIRMADO
                        </span>
                      )}

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <h3 className="font-semibold text-sm leading-tight">
                          {evt.title}
                        </h3>
                      </div>
                    </div>

                    {/* Propósito y Datos */}
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        {evt.purpose}
                      </p>

                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 font-mono text-[11px] text-zinc-600">
                        <div className="flex items-center gap-1.5 truncate">
                          <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span className="truncate">{evt.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2 pt-1 border-t border-zinc-200/60 text-zinc-500">
                          <Users className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span>
                            Asistentes: <strong className="text-zinc-900">{evt.attendeesCount}</strong>/{evt.capacity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón de Check-in */}
                  <div className="p-4 pt-0">
                    {isClosed ? (
                      <div className="p-2.5 rounded-lg bg-zinc-100 text-zinc-500 text-xs font-mono text-center">
                        🔒 Evento finalizado y cerrado.
                      </div>
                    ) : evt.attendanceEnabled ? (
                      <button
                        onClick={() => registerAttendance(evt.id)}
                        className={`btn-tactile w-full py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                          isRegistered
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-xs'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Asistencia Confirmada (Clic para cancelar)</span>
                          </>
                        ) : (
                          <>
                            <span>Confirmar Asistencia</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="text-[11px]">Asistencia no habilitada aún por el coordinador.</span>
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
