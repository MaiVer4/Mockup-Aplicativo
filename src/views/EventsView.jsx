import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Play, 
  Pause, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Filter,
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';
import { AREAS } from '../data/mockData';

export default function EventsView({ onOpenModal, onOpenExportModal, onOpenDetailModal }) {
  const { 
    currentUser, 
    visibleEvents, 
    publishEvent, 
    startEventAttendance, 
    closeEventAttendance, 
    deleteEvent,
    setActiveTab
  } = useApp();

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterQuarter, setFilterQuarter] = useState('ALL');
  const [filterArea, setFilterArea] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const isEncargado = currentUser.role === 'admin_area';
  const isAdminGeneral = currentUser.role === 'admin_general';

  // Contadores para pestañas
  const totalCount = visibleEvents.length;
  const publishedCount = visibleEvents.filter(e => e.status === 'publicado').length;
  const inProgressCount = visibleEvents.filter(e => e.status === 'en_curso').length;
  const draftCount = visibleEvents.filter(e => e.status === 'borrador').length;
  const finishedCount = visibleEvents.filter(e => e.status === 'finalizado').length;

  const filtered = visibleEvents.filter(evt => {
    const matchesSearch = 
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.code && evt.code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesArea = filterArea === 'ALL' || evt.area === filterArea;
    const matchesStatus = filterStatus === 'ALL' || evt.status === filterStatus;
    const matchesQuarter = 
      filterQuarter === 'ALL' || 
      evt.quarter === filterQuarter || 
      (!evt.quarter && filterQuarter === 'ALL') ||
      (filterQuarter === 'Trimestre 1' && (evt.quarter?.includes('1') || evt.quarter === 'T1')) ||
      (filterQuarter === 'Trimestre 2' && (evt.quarter?.includes('2') || evt.quarter === 'T2')) ||
      (filterQuarter === 'Trimestre 3' && (evt.quarter?.includes('3') || evt.quarter === 'T3')) ||
      (filterQuarter === 'Trimestre 4' && (evt.quarter?.includes('4') || evt.quarter === 'T4'));
    return matchesSearch && matchesArea && matchesStatus && matchesQuarter;
  });

  return (
    <div className="space-y-6">
      
      {/* Encabezado Ergonómico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] font-heading tracking-tight">
            Eventos
          </h1>
          <p className="text-xs md:text-sm text-[#64748b] mt-1">
            {isEncargado 
              ? `Administra y supervisa las actividades del Área de ${currentUser.area}.`
              : 'Supervisa todos los eventos generados en las 6 áreas de bienestar institucional.'}
          </p>
        </div>

        {isEncargado && (
          <button
            type="button"
            onClick={() => onOpenModal(null)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Nuevo evento</span>
          </button>
        )}
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="space-y-2.5">
        
        {/* FILA 1: Estados del Evento y Búsqueda */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Pestañas de Estados */}
          <div className="flex items-center gap-1 bg-[#e2e8f0]/80 p-1 rounded-xl text-xs font-semibold overflow-x-auto border border-[#cbd5e1]/50">
            <button
              type="button"
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterStatus === 'ALL'
                  ? 'bg-white text-[#1e293b] font-bold shadow-xs border border-[#cbd5e1]'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <span>Todos</span>
              <span className="text-[10px] font-mono font-bold bg-[#f1f5f9] text-[#475569] px-1.5 py-0.2 rounded">
                {totalCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus('publicado')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterStatus === 'publicado'
                  ? 'bg-white text-[#1e293b] font-bold shadow-xs border border-[#cbd5e1]'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <span>Publicados</span>
              <span className="text-[10px] font-mono font-bold bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-1.5 py-0.2 rounded">
                {publishedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus('en_curso')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterStatus === 'en_curso'
                  ? 'bg-white text-[#1e293b] font-bold shadow-xs border border-[#cbd5e1]'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <span>En Curso</span>
              <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded animate-pulse">
                {inProgressCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus('borrador')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterStatus === 'borrador'
                  ? 'bg-white text-[#1e293b] font-bold shadow-xs border border-[#cbd5e1]'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <span>Borradores</span>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                {draftCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus('finalizado')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterStatus === 'finalizado'
                  ? 'bg-white text-[#1e293b] font-bold shadow-xs border border-[#cbd5e1]'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <span>Finalizados</span>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                {finishedCount}
              </span>
            </button>
          </div>

          {/* Buscador + Filtro de Área */}
          <div className="flex items-center gap-2">
            {isAdminGeneral && (
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="text-xs text-[#1e293b] border border-[#cbd5e1] rounded-xl px-2.5 py-2 bg-[#f8fafc] focus:bg-white focus:outline-none focus:border-[#15803d]"
              >
                <option value="ALL">Todas las Áreas</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            )}

            <div className="h-10 w-full sm:w-60 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl flex items-center gap-2 px-3 text-[#64748b] focus-within:bg-white focus-within:border-[#15803d] focus-within:ring-2 focus-within:ring-[#15803d]/20 transition-all shadow-2xs">
              <Search className="w-4 h-4 shrink-0 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Buscar evento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-xs text-[#1e293b] placeholder:text-[#94a3b8]"
              />
            </div>
          </div>
        </div>

        {/* FILA 2: Filtro Temporal por Trimestres (Vigencia Anual) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-1">
          <span className="text-[11px] font-bold text-[#64748b] flex items-center gap-1 font-mono shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#15803d]" />
            <span>PERIODO:</span>
          </span>
          {[
            { id: 'ALL', label: 'Todo el Año (Anual)' },
            { id: 'Trimestre 1', label: 'T1' },
            { id: 'Trimestre 2', label: 'T2' },
            { id: 'Trimestre 3', label: 'T3' },
            { id: 'Trimestre 4', label: 'T4' }
          ].map(q => (
            <button
              key={q.id}
              type="button"
              onClick={() => setFilterQuarter(q.id)}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-xs border ${
                filterQuarter === q.id
                  ? 'bg-[#15803d] text-white border-[#15803d] shadow-2xs'
                  : 'bg-white text-[#475569] border-[#cbd5e1] hover:border-[#15803d] hover:text-[#1e293b]'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>

      </div>

      {/* Grid de Tarjetas de Eventos */}
      {filtered.length === 0 ? (
        <div className="p-14 text-center bg-white rounded-2xl border border-[#e2e8f0] space-y-2">
          <Calendar className="w-10 h-10 text-[#94a3b8] mx-auto stroke-1" />
          <p className="text-[#1e293b] text-sm font-bold font-heading">
            No se encontraron eventos con estos filtros
          </p>
          <p className="text-[#64748b] text-xs">
            Prueba cambiando el estado o el término de búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(evt => {
            const isDraft = evt.status === 'borrador';
            const isPublished = evt.status === 'publicado';
            const isInProgress = evt.status === 'en_curso';
            const isFinished = evt.status === 'finalizado';

            const getStatusBadge = () => {
              if (isPublished) return <span className="bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2.5 py-1 rounded-xl text-[10px] font-bold">Publicado</span>;
              if (isInProgress) return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl text-[10px] font-bold animate-pulse">En Curso</span>;
              if (isFinished) return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-xl text-[10px] font-bold">Finalizado</span>;
              return <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-xl text-[10px] font-bold">Borrador</span>;
            };

            return (
              <article 
                key={evt.id} 
                className="card-ergonomic overflow-hidden flex flex-col justify-between group"
              >
                {/* Imagen de Portada o Bloque de Borrador sin Portada */}
                <button
                  type="button"
                  onClick={() => onOpenDetailModal && onOpenDetailModal(evt)}
                  className="relative h-44 w-full block overflow-hidden text-left cursor-pointer"
                >
                  {evt.image ? (
                    <img 
                      src={evt.image} 
                      alt={evt.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] border-b border-[#e2e8f0] flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#cbd5e1] text-[#15803d] flex items-center justify-center shadow-2xs mb-2 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#334155] font-heading">
                        Sin portada asignada
                      </span>
                      <span className="text-[10px] text-[#64748b] mt-0.5">
                        {isFinished
                          ? 'Actividad institucional sin fotografía'
                          : evt.isAmbiguous || !evt.date
                          ? 'Asigna primero la fecha para generar portada con IA'
                          : 'Haz clic para añadir con Prompt IA o imagen externa'}
                      </span>
                    </div>
                  )}
                  {/* Badges de Área y Trimestre */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="bg-[#0e2738]/85 text-white backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-[10px] font-bold border border-white/10">
                      {evt.area}
                    </span>
                    {evt.quarter && (
                      <span className="bg-blue-600/90 text-white backdrop-blur-xs px-2 py-0.5 rounded-lg text-[9px] font-bold font-mono border border-blue-400/30">
                        {evt.quarter.replace('Trimestre ', 'T')}
                      </span>
                    )}
                  </div>
                  {/* Badge de Estado */}
                  <div className="absolute top-3 right-3 shadow-xs">
                    {getStatusBadge()}
                  </div>
                </button>

                {/* Cuerpo de la Tarjeta */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-heading font-extrabold text-[#1e293b] text-base group-hover:text-[#15803d] transition-colors line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-[#475569] text-xs line-clamp-2 mt-1 leading-relaxed">
                      {evt.purpose}
                    </p>
                  </div>

                  {/* Metadatos: Horario y Lugar */}
                  <div className="pt-2 border-t border-[#e2e8f0] space-y-1 text-[11px] text-[#475569]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#94a3b8]" />
                      <span className="font-mono">{evt.date} • {evt.schedule || '14:00'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#94a3b8]" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>

                  {/* Contador de Aforo y Avatares */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        <span className="w-6 h-6 rounded-full bg-[#eafaf1] text-[#15803d] border-2 border-white flex items-center justify-center font-bold text-[9px]">
                          {evt.attendeesCount > 0 ? evt.attendeesCount : '0'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748b] font-mono">
                        {evt.attendeesCount || 0} / {evt.capacity || 50} asistentes
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenDetailModal && onOpenDetailModal(evt)}
                      className="btn-ghost text-xs text-[#1e293b] font-bold flex items-center gap-1"
                    >
                      <span>Ver detalle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Barra de Acciones del Ciclo de 4 Estados (Solo para Encargado) */}
                  {isEncargado && (
                    <div className="pt-2.5 border-t border-[#e2e8f0] space-y-2">
                      
                      {/* FILA 1: Acción Operativa Principal de Ancho Completo */}
                      {isDraft && (
                        evt.isAmbiguous ? (
                          <div className="w-full flex items-center justify-between gap-2 p-2 bg-amber-50 border border-amber-200/90 rounded-xl shadow-2xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-[11px] text-amber-950 font-bold truncate">
                                Fecha por confirmar
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => onOpenModal && onOpenModal(evt, { focusDate: true })}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-extrabold shrink-0 transition-colors shadow-2xs cursor-pointer"
                            >
                              Fijar Fecha
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => publishEvent(evt.id)}
                            className="btn btn-primary w-full px-3 py-2 rounded-xl flex items-center justify-between gap-2 group/pub"
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center shrink-0 group-hover/pub:bg-[#c4f246] group-hover/pub:text-[#0e2738] transition-colors">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-xs font-extrabold tracking-tight truncate">
                                Publicar Evento
                              </span>
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-[#0e2738]/35 border border-white/15 text-[10px] font-mono font-extrabold text-[#c4f246] shrink-0 flex items-center gap-1">
                              <span> PUBLICAR</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </button>
                        )
                      )}

                      {isPublished && (
                        <button
                          type="button"
                          onClick={() => startEventAttendance(evt.id)}
                          className="btn btn-primary w-full px-3 py-2 rounded-xl flex items-center justify-between gap-2 group/live"
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center shrink-0 group-hover/live:bg-[#c4f246] group-hover/live:text-[#0e2738] transition-colors">
                              <Play className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-xs font-extrabold tracking-tight truncate">
                              Habilitar Asistencia
                            </span>
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#0e2738]/35 border border-white/15 text-[10px] font-mono font-extrabold text-[#c4f246] shrink-0">
                            INICIAR
                          </span>
                        </button>
                      )}

                      {isInProgress && (
                        <button
                          type="button"
                          onClick={() => closeEventAttendance(evt.id)}
                          className="btn btn-danger w-full px-3 py-2 rounded-xl flex items-center justify-between gap-2"
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                              <Pause className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-xs font-extrabold tracking-tight truncate">
                              Finalizar Evento
                            </span>
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white border border-rose-200 text-[10px] font-mono font-extrabold text-rose-700 shrink-0">
                            CERRAR
                          </span>
                        </button>
                      )}

                      {isFinished && (
                        <button
                          type="button"
                          onClick={() => onOpenExportModal && onOpenExportModal(evt)}
                          className="btn btn-secondary w-full px-3 py-2 rounded-xl flex items-center justify-between gap-2 text-[#1e293b] border border-[#cbd5e1] hover:border-[#15803d]"
                          title="Exportar acta oficial de asistencia GOR-F-013"
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-[#eafaf1] text-[#15803d] flex items-center justify-center shrink-0">
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-xs font-extrabold tracking-tight truncate">
                              Exportar Acta GOR-F-013
                            </span>
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#f8fafc] border border-[#cbd5e1] text-[10px] font-mono font-extrabold text-[#15803d] shrink-0">
                            .XLSX
                          </span>
                        </button>
                      )}

                      {/* FILA 2: Acciones Complementarias y Herramientas (Wrap Fluido) */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-[#e2e8f0]/60">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {((!isFinished && (evt.attendeesCount || 0) > 0) || isFinished) && (
                            <button
                              type="button"
                              onClick={() => setActiveTab('participants')}
                              className="btn btn-secondary px-2.5 py-1.5 text-xs font-semibold text-[#1e293b] flex items-center gap-1"
                              title="Consultar participantes y asistencias (RF-09)"
                            >
                              <Users className="w-3.5 h-3.5 text-[#15803d]" />
                              <span>
                                <span className="inline sm:hidden">Asistentes</span>
                                <span className="hidden sm:inline">Participantes</span>
                              </span>
                            </button>
                          )}

                          {!isFinished && (evt.attendeesCount || 0) > 0 && (
                            <button
                              type="button"
                              onClick={() => onOpenExportModal && onOpenExportModal(evt)}
                              className="btn btn-secondary px-2.5 py-1.5 text-xs font-semibold text-[#1e293b] flex items-center gap-1"
                              title="Exportar acta oficial de asistencia (RF-10)"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5 text-[#15803d]" />
                              <span>
                                <span className="inline sm:hidden">Exportar</span>
                                <span className="hidden sm:inline">Exportar XLSX</span>
                              </span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1 ml-auto">
                          {/* Editar */}
                          <button
                            type="button"
                            onClick={() => onOpenModal && onOpenModal(evt)}
                            className="p-1.5 sm:p-2 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0] transition-colors"
                            title="Editar parámetros del evento"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Eliminar (solo en borrador) */}
                          {isDraft && (
                            <button
                              type="button"
                              onClick={() => deleteEvent(evt.id)}
                              className="p-1.5 sm:p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Eliminar borrador"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </article>
            );
          })}
        </div>
      )}

    </div>
  );
}
