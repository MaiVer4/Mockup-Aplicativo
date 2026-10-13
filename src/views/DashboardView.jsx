import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  MapPin, 
  MoreHorizontal, 
  Search, 
  Link as LinkIcon, 
  Sparkles,
  BarChart3,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { AREAS, MOCK_PARTICIPANTS_DATABASE } from '../data/mockData';

export default function DashboardView({ onOpenInviteModal, onNavigateView, onOpenEventDetail }) {
  const { 
    currentUser, 
    events, 
    users, 
    inviteLinks, 
    activeTab, 
    setActiveTab 
  } = useApp();

  const [searchLearner, setSearchLearner] = useState('');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState('Últimas 5 semanas');

  // Filtrado de eventos según rol
  const relevantEvents = currentUser.role === 'admin_area'
    ? events.filter(e => e.area === currentUser.area)
    : events;

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
      
      {/* Encabezado Principal estilo Functional Mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#162e50] font-heading tracking-tight">
            Buenos días, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs md:text-sm text-[#77869a] mt-1">
            {currentUser.role === 'admin_general'
              ? 'Supervisión global de las 6 áreas de Bienestar al Aprendiz y gestión de accesos.'
              : `Aquí tienes el estado operativo y rendimiento de tus eventos del Área de ${currentUser.area}.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentUser.role === 'admin_general' ? (
            <button
              type="button"
              onClick={onOpenInviteModal}
              className="btn btn-primary"
            >
              <LinkIcon className="w-4 h-4 text-[#10233f]" />
              <span>Generar Enlace Encargado</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigateView && onNavigateView('upload')}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 text-[#10233f]" />
              <span>Crear desde Excel</span>
            </button>
          )}
        </div>
      </div>

      {/* Si NO es vista de usuarios: mostrar Dashboard completo */}
      {!isUsersView && (
        <>
          {/* Grid de 4 StatCards estilo Functional Mockup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* StatCard 1: Eventos Activos */}
            <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 relative shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#edf5ff] text-[#2d6bbb] flex items-center justify-center absolute right-4 top-4">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#748397] font-semibold">Eventos activos</div>
              <div className="font-heading text-3xl font-extrabold text-[#183050] my-2">
                {publishedEvents + inProgressEvents}
              </div>
              <div className="text-[11px] text-[#9aa6b5] flex items-center gap-1">
                <span className="text-[#5c8515] font-bold">↗ +18%</span>
                <span>vs. mes anterior</span>
              </div>
            </div>

            {/* StatCard 2: Preasistencias */}
            <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 relative shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#f4fadf] text-[#6e9210] flex items-center justify-center absolute right-4 top-4">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#748397] font-semibold">Preasistencias (Reservas)</div>
              <div className="font-heading text-3xl font-extrabold text-[#183050] my-2">
                {totalPreAttendees}
              </div>
              <div className="text-[11px] text-[#9aa6b5] flex items-center gap-1">
                <span className="text-[#5c8515] font-bold">↗ +24%</span>
                <span>aprendices registrados</span>
              </div>
            </div>

            {/* StatCard 3: Asistencias Acreditadas */}
            <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 relative shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#f4effc] text-[#7b5bb1] flex items-center justify-center absolute right-4 top-4">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#748397] font-semibold">Asistencias confirmadas</div>
              <div className="font-heading text-3xl font-extrabold text-[#183050] my-2">
                {totalAttendees}
              </div>
              <div className="text-[11px] text-[#9aa6b5] flex items-center gap-1">
                <span className="text-[#5c8515] font-bold">↗ +12%</span>
                <span>con firma digital</span>
              </div>
            </div>

            {/* StatCard 4: Tasa de Asistencia */}
            <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 relative shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#fff4e8] text-[#b47331] flex items-center justify-center absolute right-4 top-4">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#748397] font-semibold">Tasa de cumplimiento</div>
              <div className="font-heading text-3xl font-extrabold text-[#183050] my-2">
                {attendanceRate}%
              </div>
              <div className="text-[11px] text-[#9aa6b5] flex items-center gap-1">
                <span className="text-[#5c8515] font-bold">↗ +6,2%</span>
                <span>promedio general</span>
              </div>
            </div>

          </div>

          {/* Grid de 2 Columnas: Gráfico Comparativo + Agenda de Hoy */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4">
            
            {/* Panel de Gráfico: Asistencia por semana */}
            <div className="bg-white border border-[#e4e8ee] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <strong className="text-sm font-heading font-bold text-[#203754]">
                    Asistencia por semana
                  </strong>
                  <p className="text-[11px] text-[#8b98a9]">
                    Comparativo de aprendices preasistentes y asistentes confirmados
                  </p>
                </div>
                <select 
                  value={selectedWeekFilter}
                  onChange={(e) => setSelectedWeekFilter(e.target.value)}
                  className="text-xs text-[#5f7187] border border-[#e0e5ec] rounded-lg px-2.5 py-1 bg-white focus:outline-none"
                >
                  <option>Últimas 5 semanas</option>
                  <option>Trimestre I</option>
                  <option>Trimestre II</option>
                </select>
              </div>

              {/* Leyenda del Gráfico */}
              <div className="flex items-center justify-end gap-4 text-[11px] text-[#7b899b] my-2">
                <span className="flex items-center gap-1.5">
                  <i className="w-2.5 h-2.5 rounded-xs bg-[#c9f45a] inline-block" />
                  <span>Preasistencias (Reservas)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="w-2.5 h-2.5 rounded-xs bg-[#183a65] inline-block" />
                  <span>Asistencias (Firma 1 Clic)</span>
                </span>
              </div>

              {/* Área de Barras Simuladas con CSS */}
              <div className="h-44 border-b border-[#e7ebf0] pt-2 flex items-end justify-around gap-2 px-4 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_40px,#f4f6f8_41px)]">
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
                        className="w-3.5 bg-[#c9f45a] rounded-t-md transition-all duration-300" 
                        title={`Preasistencias: ${item.pre}`}
                      />
                      <div 
                        style={{ height: `${item.att}%` }} 
                        className="w-3.5 bg-[#183a65] rounded-t-md transition-all duration-300" 
                        title={`Asistencias: ${item.att}`}
                      />
                    </div>
                    <span className="text-[10px] text-[#929dac] font-mono">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel de Agenda de Hoy estilo Functional Mockup */}
            <div className="bg-white border border-[#e4e8ee] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <strong className="text-sm font-heading font-bold text-[#203754]">
                    Agenda de hoy
                  </strong>
                  <p className="text-[11px] text-[#8b98a9]">
                    Viernes, 14 de marzo • {todayEvents.length} actividades programadas
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateView && onNavigateView('events')}
                  className="btn-ghost text-xs text-[#58708f] hover:text-[#142b4d]"
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
                    className="w-full text-left p-2.5 rounded-xl border border-[#ebedf1] hover:border-[#c9d5e2] hover:shadow-xs transition-all grid grid-cols-[48px_52px_1fr_20px] items-center gap-2.5 group bg-white"
                  >
                    {/* Chip de Hora */}
                    <div className={`h-11 rounded-lg flex flex-col items-center justify-center text-center ${
                      idx === 1 ? 'bg-[#f4fadf] text-[#648213]' : 'bg-[#edf4fc] text-[#245486]'
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
                      className="w-[52px] h-11 object-cover rounded-lg"
                    />

                    {/* Texto del Evento */}
                    <div className="min-w-0">
                      <strong className="block text-xs text-[#253c58] font-heading font-bold truncate group-hover:text-[#16a34a] transition-colors">
                        {evt.title}
                      </strong>
                      <span className="flex items-center gap-1 text-[10px] text-[#7f8da0] mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-[#7f8da0] shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </span>
                      <small className="text-[10px] text-[#6f8f20] font-bold block mt-0.5 font-mono">
                        {evt.preattendanceCount || 0} preasistentes
                      </small>
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#8ba2be] group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Tabla de Eventos Recientes estilo Functional Mockup */}
          <div className="bg-white border border-[#e4e8ee] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#edf0f3]">
              <div>
                <strong className="text-sm font-heading font-bold text-[#203754]">
                  Eventos recientes
                </strong>
                <p className="text-[11px] text-[#8b98a9]">
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
                  <tr className="text-[10px] text-[#99a4b2] font-bold uppercase tracking-wider border-b border-[#edf0f3]">
                    <th className="py-3 px-3">EVENTO</th>
                    <th className="py-3 px-3">FECHA</th>
                    <th className="py-3 px-3">ESTADO</th>
                    <th className="py-3 px-3">ASISTENCIA / CAPACIDAD</th>
                    <th className="py-3 px-3 text-right">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f3] text-[#617188]">
                  {relevantEvents.slice(0, 5).map(evt => {
                    const capacity = evt.capacity || 50;
                    const count = evt.attendeesCount || 0;
                    const percent = Math.min(100, Math.round((count / capacity) * 100));

                    const getStatusBadge = (st) => {
                      switch (st) {
                        case 'publicado':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eef9e6] text-[#568020]">Publicado</span>;
                        case 'en_curso':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">En Curso</span>;
                        case 'finalizado':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600">Finalizado</span>;
                        default:
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-500">Borrador</span>;
                      }
                    };

                    return (
                      <tr key={evt.id} className="hover:bg-[#fafbfc] transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={evt.image || 'https://images.unsplash.com/photo-1598588436316-1e65ffcffc0a?w=120&auto=format&fit=crop&q=80'} 
                              alt={evt.title} 
                              className="w-10 h-9 rounded-lg object-cover shrink-0"
                            />
                            <div>
                              <strong className="block text-xs text-[#243b57] font-heading font-bold truncate max-w-[200px]">
                                {evt.title}
                              </strong>
                              <small className="text-[10px] text-[#8c99a9] font-mono">
                                Área: {evt.area}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-[#64758b]">
                          {evt.date}
                        </td>
                        <td className="py-3 px-3">
                          {getStatusBadge(evt.status)}
                        </td>
                        <td className="py-3 px-3">
                          <div className="w-32">
                            <div className="flex items-baseline justify-between text-[11px] font-mono mb-1">
                              <strong className="text-[#273e5a]">{count}</strong>
                              <span className="text-[#9aa5b2]">/ {capacity}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#edf0f3] overflow-hidden">
                              <div 
                                style={{ width: `${percent}%` }}
                                className="h-full bg-[#b7dc4c] rounded-full"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onOpenEventDetail && onOpenEventDetail(evt)}
                            className="p-1 rounded-lg text-[#8ba2be] hover:text-[#152e4f] hover:bg-[#edf2f7]"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-[#e4e8ee] shadow-xs">
            <div>
              <h2 className="text-base font-bold text-[#162e50] font-heading">
                Administradores de Área Registrados ({encargadosList.length})
              </h2>
              <p className="text-xs text-[#718098] mt-0.5">
                Los encargados acceden exclusivamente por invitaciones multiuso generadas con token institucional.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenInviteModal}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Enlace Exclusivo</span>
            </button>
          </div>

          {/* Grid de Encargados estilo Functional Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {encargadosList.map(enc => {
              const encEvents = events.filter(e => e.area === enc.area);

              return (
                <div key={enc.id} className="p-4 rounded-2xl bg-white border border-[#e4e8ee] shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={enc.avatar} alt={enc.name} className="w-10 h-10 rounded-xl object-cover border border-[#e2e8f0]" />
                    <div className="truncate">
                      <h3 className="font-bold text-[#142b4d] text-xs font-heading truncate">{enc.name}</h3>
                      <span className="font-mono text-[10px] text-[#16a34a] bg-[#eaf7ec] px-1.5 py-0.5 rounded font-bold">
                        Área: {enc.area}
                      </span>
                    </div>
                  </div>

                  <p className="text-[#718098] text-[11px] leading-relaxed line-clamp-2">
                    {enc.description}
                  </p>

                  <div className="pt-2 border-t border-[#edf0f3] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#8492a5]">Actividades del área:</span>
                    <strong className="text-[#142b4d] font-bold">{encEvents.length}</strong>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#9aa5b2] pt-1">
                    <span>Estado: Activo</span>
                    <span className="text-[#568020] font-bold">Acceso por Token</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consulta Individual de Aprendices */}
          <div className="p-5 rounded-2xl bg-white border border-[#e4e8ee] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#162e50] font-heading">
                  Consulta Individual de Aprendices y Participaciones
                </h3>
                <p className="text-xs text-[#718098] mt-0.5">
                  Auditoría institucional de registros con marcas de tiempo inmutables.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#8492a5] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar cédula, nombre o ficha..."
                  value={searchLearner}
                  onChange={(e) => setSearchLearner(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#dbe1e9] text-xs bg-white text-[#203754] focus:outline-none focus:border-[#91b52c]"
                />
              </div>
            </div>

            <div className="border border-[#e4e8ee] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#f8fafc] text-[#718098] font-bold border-b border-[#e4e8ee]">
                  <tr>
                    <th className="p-3">Documento</th>
                    <th className="p-3">Nombre del Aprendiz</th>
                    <th className="p-3">Ficha SENA</th>
                    <th className="p-3">Programa</th>
                    <th className="p-3">Actividades Acreditadas</th>
                    <th className="p-3">Último Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f3] text-[#64758b]">
                  {MOCK_PARTICIPANTS_DATABASE
                    .filter(p => 
                      !searchLearner ||
                      p.name.toLowerCase().includes(searchLearner.toLowerCase()) ||
                      p.documentNumber.includes(searchLearner) ||
                      p.ficha.includes(searchLearner)
                    )
                    .map(p => (
                      <tr key={p.id} className="hover:bg-[#fafbfc]">
                        <td className="p-3 font-mono text-[11px] font-bold text-[#142b4d]">{p.documentNumber}</td>
                        <td className="p-3 font-medium text-[#142b4d]">{p.name}</td>
                        <td className="p-3 font-mono text-[11px]">{p.ficha}</td>
                        <td className="p-3 truncate max-w-[200px]">{p.program}</td>
                        <td className="p-3">
                          <span className="font-mono text-[10px] bg-[#eaf7ec] text-[#16a34a] font-bold px-2 py-0.5 rounded">
                            {p.historyCount || 3} asistencias
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[10px] text-[#8492a5]">
                          {p.lastAttendanceTimestamp}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
