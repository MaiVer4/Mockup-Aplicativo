import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  FileSpreadsheet, 
  ExternalLink,
  Plus,
  Link as LinkIcon,
  Shield,
  ArrowRight,
  MoreHorizontal,
  MapPin,
  Search,
  Filter
} from 'lucide-react';

export default function DashboardView({ onOpenInviteModal, onNavigateView, onOpenEventDetail }) {
  const { 
    currentUser, 
    events, 
    visibleEvents, 
    users, 
    activeTab, 
    setActiveTab, 
    getApprenticeAuditData 
  } = useApp();

  const [selectedWeekFilter, setSelectedWeekFilter] = useState('Últimas 5 semanas');
  const [apprenticeSearchDoc, setApprenticeSearchDoc] = useState('');
  const [searchedAuditResult, setSearchedAuditResult] = useState(null);

  // Filtrar eventos relevantes según el rol
  const relevantEvents = visibleEvents;

  // Métricas Consolidadas
  const totalEvents = relevantEvents.length;
  const draftEvents = relevantEvents.filter(e => e.status === 'borrador').length;
  const publishedEvents = relevantEvents.filter(e => e.status === 'publicado').length;
  const inProgressEvents = relevantEvents.filter(e => e.status === 'en_curso').length;
  const finishedEvents = relevantEvents.filter(e => e.status === 'finalizado').length;

  const totalAttendees = relevantEvents.reduce((acc, curr) => acc + (curr.attendeesCount || 0), 0);
  const totalPreAttendees = relevantEvents.reduce((acc, curr) => acc + (curr.preattendanceCount || 0), 0);
  const totalCapacity = relevantEvents.reduce((acc, curr) => acc + (curr.capacity || 50), 0);
  const attendanceRate = totalPreAttendees > 0 
    ? Math.min(100, Math.round((totalAttendees / totalPreAttendees) * 100)) 
    : 86.4;

  const encargadosList = users.filter(u => u.role === 'admin_area');

  // Sub-sección activa para admin general: si activeTab es 'users' muestra directorio
  const isUsersView = activeTab === 'users';

  // Eventos para la agenda de hoy
  const todayEvents = relevantEvents.slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Encabezado Principal Ergonómico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] font-heading tracking-tight">
            Buenos días, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs md:text-sm text-[#64748b] mt-1">
            {currentUser.role === 'admin_general'
              ? 'Supervisión global de las 6 áreas de Bienestar al Aprendiz y gestión de accesos.'
              : `Aquí tienes el estado operativo y rendimiento de tus actividades del Área de ${currentUser.area}.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentUser.role === 'admin_general' ? (
            <button
              type="button"
              onClick={onOpenInviteModal}
              className="btn btn-primary"
            >
              <LinkIcon className="w-4 h-4 text-white" />
              <span>Generar Enlace Encargado</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigateView && onNavigateView('upload')}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Crear desde Excel</span>
            </button>
          )}
        </div>
      </div>

      {/* Si NO es vista de usuarios: mostrar Dashboard completo */}
      {!isUsersView && (
        <>
          {/* Grid de 4 StatCards Ergonómicas Anti-Fatiga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* StatCard 1: Eventos Activos */}
            <div className="card-ergonomic p-5 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center absolute right-4 top-4 border border-blue-100">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#64748b] font-semibold">Eventos activos</div>
              <div className="font-heading text-3xl font-extrabold text-[#1e293b] my-2">
                {publishedEvents + inProgressEvents}
              </div>
              <div className="text-[11px] text-[#64748b] flex items-center gap-1 font-medium">
                <span className="text-[#15803d] font-bold">↗ +18%</span>
                <span>vs. mes anterior</span>
              </div>
            </div>

            {/* StatCard 2: Preasistencias */}
            <div className="card-ergonomic p-5 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center absolute right-4 top-4 border border-emerald-100">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#64748b] font-semibold">Preasistencias (Reservas)</div>
              <div className="font-heading text-3xl font-extrabold text-[#1e293b] my-2">
                {totalPreAttendees}
              </div>
              <div className="text-[11px] text-[#64748b] flex items-center gap-1 font-medium">
                <span className="text-[#15803d] font-bold">↗ +24%</span>
                <span>aprendices registrados</span>
              </div>
            </div>

            {/* StatCard 3: Asistencias Acreditadas */}
            <div className="card-ergonomic p-5 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center absolute right-4 top-4 border border-purple-100">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#64748b] font-semibold">Asistencias confirmadas</div>
              <div className="font-heading text-3xl font-extrabold text-[#1e293b] my-2">
                {totalAttendees}
              </div>
              <div className="text-[11px] text-[#64748b] flex items-center gap-1 font-medium">
                <span className="text-[#15803d] font-bold">↗ +12%</span>
                <span>con firma digital</span>
              </div>
            </div>

            {/* StatCard 4: Tasa de Asistencia */}
            <div className="card-ergonomic p-5 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center absolute right-4 top-4 border border-amber-100">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#64748b] font-semibold">Tasa de cumplimiento</div>
              <div className="font-heading text-3xl font-extrabold text-[#1e293b] my-2">
                {attendanceRate}%
              </div>
              <div className="text-[11px] text-[#64748b] flex items-center gap-1 font-medium">
                <span className="text-[#15803d] font-bold">↗ +6,2%</span>
                <span>promedio general</span>
              </div>
            </div>

          </div>

          {/* Grid de 2 Columnas: Gráfico Comparativo + Agenda de Hoy */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4">
            
            {/* Panel de Gráfico: Asistencia por semana */}
            <div className="card-ergonomic p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <strong className="text-sm font-heading font-bold text-[#1e293b]">
                    Asistencia por semana
                  </strong>
                  <p className="text-[11px] text-[#64748b]">
                    Comparativo de aprendices preasistentes y asistentes confirmados
                  </p>
                </div>
                <select 
                  value={selectedWeekFilter}
                  onChange={(e) => setSelectedWeekFilter(e.target.value)}
                  className="text-xs text-[#475569] border border-[#cbd5e1] rounded-lg px-2.5 py-1 bg-[#f8fafc] focus:outline-none focus:border-[#15803d]"
                >
                  <option>Últimas 5 semanas</option>
                  <option>Trimestre I</option>
                  <option>Trimestre II</option>
                </select>
              </div>

              {/* Leyenda del Gráfico */}
              <div className="flex items-center justify-end gap-4 text-[11px] text-[#64748b] my-2">
                <span className="flex items-center gap-1.5">
                  <i className="w-2.5 h-2.5 rounded-xs bg-[#22c55e] inline-block" />
                  <span>Preasistencias (Reservas)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="w-2.5 h-2.5 rounded-xs bg-[#0e2738] inline-block" />
                  <span>Asistencias (Firma 1 Clic)</span>
                </span>
              </div>

              {/* Área de Barras con Tonos Calmantes */}
              <div className="h-44 border-b border-[#e2e8f0] pt-2 flex items-end justify-around gap-2 px-4 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_40px,#f1f5f9_41px)]">
                {[
                  { label: 'Sem 1', pre: 75, att: 62 },
                  { label: 'Sem 2', pre: 85, att: 70 },
                  { label: 'Sem 3', pre: 65, att: 58 },
                  { label: 'Sem 4', pre: 95, att: 88 },
                  { label: 'Sem 5', pre: 90, att: 82 }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end flex-1">
                    <div className="flex items-end gap-1.5 h-[80%]">
                      <div 
                        style={{ height: `${item.pre}%` }} 
                        className="w-3.5 bg-[#22c55e] rounded-t-md transition-all duration-300 shadow-2xs" 
                        title={`Preasistencias: ${item.pre}`}
                      />
                      <div 
                        style={{ height: `${item.att}%` }} 
                        className="w-3.5 bg-[#0e2738] rounded-t-md transition-all duration-300 shadow-2xs" 
                        title={`Asistencias Confirmadas: ${item.att}`}
                      />
                    </div>
                    <span className="text-[10px] text-[#64748b] font-mono font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel de Agenda de Hoy */}
            <div className="card-ergonomic p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <strong className="text-sm font-heading font-bold text-[#1e293b]">
                    Agenda de hoy
                  </strong>
                  <p className="text-[11px] text-[#64748b]">
                    Viernes, 14 de marzo • {todayEvents.length} actividades programadas
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateView && onNavigateView('events')}
                  className="btn-ghost text-xs text-[#475569] hover:text-[#1e293b]"
                >
                  Ver todos
                </button>
              </div>

              <div className="space-y-2.5 my-auto">
                {todayEvents.map((evt, idx) => (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => onOpenEventDetail && onOpenEventDetail(evt)}
                    className="w-full text-left p-2.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1] hover:shadow-sm transition-all grid grid-cols-[48px_52px_1fr_20px] items-center gap-2.5 group"
                  >
                    {/* Chip de Hora */}
                    <div className={`h-11 rounded-lg flex flex-col items-center justify-center text-center ${
                      idx === 1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      <strong className="text-xs font-bold font-mono leading-none">
                        {evt.schedule?.split(' - ')[0] || '14:00'}
                      </strong>
                      <small className="text-[8px] font-medium">horas</small>
                    </div>

                    {/* Portada */}
                    <img 
                      src={evt.image || 'https://images.unsplash.com/photo-1598588436316-1e65ffcffc0a?w=120&auto=format&fit=crop&q=80'} 
                      alt={evt.title} 
                      className="w-[52px] h-11 object-cover rounded-lg border border-[#e2e8f0]"
                    />

                    {/* Texto del Evento */}
                    <div className="min-w-0">
                      <strong className="block text-xs text-[#1e293b] font-heading font-bold truncate group-hover:text-[#15803d] transition-colors">
                        {evt.title}
                      </strong>
                      <span className="flex items-center gap-1 text-[10px] text-[#64748b] mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-[#94a3b8] shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </span>
                      <small className="text-[10px] text-[#15803d] font-bold block mt-0.5 font-mono">
                        {evt.preattendanceCount || 0} preasistentes
                      </small>
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#15803d] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Tabla de Eventos Recientes Ergonómica */}
          <div className="card-ergonomic p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div>
                <strong className="text-sm font-heading font-bold text-[#1e293b]">
                  Eventos recientes
                </strong>
                <p className="text-[11px] text-[#64748b]">
                  Supervisión de aforo y estado del ciclo de vida
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateView && onNavigateView('events')}
                className="btn btn-secondary text-xs"
              >
                <span>Ver todos los eventos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] text-[#475569] bg-[#f8fafc] font-bold uppercase tracking-wider border-b border-[#e2e8f0]">
                    <th className="py-3 px-3">EVENTO</th>
                    <th className="py-3 px-3">FECHA</th>
                    <th className="py-3 px-3">ESTADO</th>
                    <th className="py-3 px-3">ASISTENCIA / CAPACIDAD</th>
                    <th className="py-3 px-3 text-right">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-[#334155]">
                  {relevantEvents.slice(0, 5).map(evt => {
                    const capacity = evt.capacity || 50;
                    const count = evt.attendeesCount || 0;
                    const percent = Math.min(100, Math.round((count / capacity) * 100));

                    const getStatusBadge = (st) => {
                      switch (st) {
                        case 'publicado':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0]">Publicado</span>;
                        case 'en_curso':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">En Curso</span>;
                        case 'finalizado':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Finalizado</span>;
                        default:
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200">Borrador</span>;
                      }
                    };

                    return (
                      <tr key={evt.id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-heading font-bold text-[#1e293b]">{evt.title}</div>
                          <div className="text-[11px] text-[#64748b]">{evt.location}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-[#475569]">
                          {evt.date} • {evt.schedule?.split(' - ')[0] || '14:00'}
                        </td>
                        <td className="py-3 px-3">
                          {getStatusBadge(evt.status)}
                        </td>
                        <td className="py-3 px-3">
                          <div className="w-36 space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <strong className="text-[#1e293b]">{count}</strong>
                              <span className="text-[#64748b]">/ {capacity}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#e2e8f0] overflow-hidden">
                              <div 
                                style={{ width: `${percent}%` }}
                                className="h-full bg-[#15803d] rounded-full"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onOpenEventDetail && onOpenEventDetail(evt)}
                            className="p-1 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0]"
                            title="Ver detalle del evento"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Si ES vista de usuarios: mostrar Directorio de Encargados y Consulta de Aprendices */}
      {isUsersView && currentUser.role === 'admin_general' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Encabezado de Gestión de Encargados */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 card-ergonomic">
            <div>
              <h2 className="text-base font-bold text-[#1e293b] font-heading">
                Administradores de Área Registrados ({encargadosList.length})
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Los encargados acceden exclusivamente por invitaciones multiuso generadas con token institucional.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenInviteModal}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Crear Enlace Exclusivo</span>
            </button>
          </div>

          {/* Grid de Encargados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {encargadosList.map(enc => {
              const encEvents = events.filter(e => e.area === enc.area);

              return (
                <div key={enc.id} className="p-4 card-ergonomic space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={enc.avatar} alt={enc.name} className="w-10 h-10 rounded-xl object-cover border border-[#e2e8f0]" />
                    <div className="truncate">
                      <h3 className="font-bold text-[#1e293b] text-xs font-heading truncate">{enc.name}</h3>
                      <span className="font-mono text-[10px] text-[#15803d] bg-[#eafaf1] border border-[#bbf7d0] px-1.5 py-0.5 rounded font-bold">
                        Área: {enc.area}
                      </span>
                    </div>
                  </div>

                  <p className="text-[#475569] text-[11px] leading-relaxed line-clamp-2">
                    {enc.description}
                  </p>

                  <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#64748b]">Actividades del área:</span>
                    <strong className="text-[#1e293b] font-bold">{encEvents.length}</strong>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#64748b] pt-1">
                    <span>Estado: Activo</span>
                    <span className="text-[#15803d] font-bold">Acceso por Token</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consulta Individual de Aprendices */}
          <div className="p-5 card-ergonomic space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#1e293b] font-heading">
                  Consulta Individual de Aprendices y Participaciones
                </h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Auditoría institucional de registros con marcas de tiempo inmutables.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Documento aprendiz (ej. 1020495821)"
                    value={apprenticeSearchDoc}
                    onChange={(e) => setApprenticeSearchDoc(e.target.value)}
                    className="pl-9 pr-3 py-1.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d] w-64 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const res = getApprenticeAuditData(apprenticeSearchDoc.trim());
                    setSearchedAuditResult(res);
                  }}
                  className="btn btn-secondary text-xs py-1.5"
                >
                  Consultar
                </button>
              </div>
            </div>

            {searchedAuditResult && (
              <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] font-bold flex items-center justify-center text-xs">
                      {searchedAuditResult.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <strong className="text-xs text-[#1e293b] font-heading block">{searchedAuditResult.name}</strong>
                      <span className="text-[10px] text-[#64748b] font-mono">Ficha: {searchedAuditResult.ficha} • Doc: {searchedAuditResult.documentNumber}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0]">
                    Total Asistencias: {searchedAuditResult.history?.length || 0}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="text-[#64748b] border-b border-[#e2e8f0]">
                        <th className="py-2">EVENTO</th>
                        <th className="py-2">TIPO REGISTRO</th>
                        <th className="py-2">TIMESTAMP INMUTABLE</th>
                        <th className="py-2">ESTADO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {searchedAuditResult.history?.map((h, i) => (
                        <tr key={i} className="text-[#334155]">
                          <td className="py-2 font-medium">{h.title}</td>
                          <td className="py-2 font-mono text-[#15803d]">{h.recordType}</td>
                          <td className="py-2 font-mono text-[#64748b]">{h.timestamp}</td>
                          <td className="py-2">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              Acreditado
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
