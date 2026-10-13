import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  FileSpreadsheet, 
  Play, 
  Pause, 
  Sparkles,
  MoreHorizontal,
  Trash2,
  Edit3
} from 'lucide-react';
import { AREAS } from '../data/mockData';

export default function EventsView({ 
  onOpenModal, 
  onOpenExportModal, 
  onOpenDetailModal 
}) {
  const { 
    currentUser, 
    visibleEvents, 
    publishEvent, 
    unpublishEvent, 
    startEventAttendance, 
    closeEventAttendance,
    deleteEvent 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState(currentUser.area || 'ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const isEncargado = currentUser.role === 'admin_area';
  const isAdminGeneral = currentUser.role === 'admin_general';

  // Contadores por estado para las pestañas de filtro estilo Functional Mockup
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
    return matchesSearch && matchesArea && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Encabezado estilo Functional Mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#162e50] font-heading tracking-tight">
            Eventos
          </h1>
          <p className="text-xs md:text-sm text-[#77869a] mt-1">
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
            <Plus className="w-4 h-4 text-[#10233f]" />
            <span>Nuevo evento</span>
          </button>
        )}
      </div>

      {/* Barra de Filtros y Búsqueda estilo Functional Mockup */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Pestañas de Estados */}
        <div className="flex items-center gap-1 bg-[#e9edf2] p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'ALL'
                ? 'bg-white text-[#243b57] font-bold shadow-xs'
                : 'text-[#718197] hover:text-[#243b57]'
            }`}
          >
            <span>Todos</span>
            <span className="text-[10px] font-mono font-bold bg-[#edf2f7] px-1.5 py-0.2 rounded">
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('publicado')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'publicado'
                ? 'bg-white text-[#243b57] font-bold shadow-xs'
                : 'text-[#718197] hover:text-[#243b57]'
            }`}
          >
            <span>Publicados</span>
            <span className="text-[10px] font-mono font-bold bg-[#eaf7ec] text-[#16a34a] px-1.5 py-0.2 rounded">
              {publishedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('en_curso')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'en_curso'
                ? 'bg-white text-[#243b57] font-bold shadow-xs'
                : 'text-[#718197] hover:text-[#243b57]'
            }`}
          >
            <span>En Curso</span>
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded animate-pulse">
              {inProgressCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('borrador')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'borrador'
                ? 'bg-white text-[#243b57] font-bold shadow-xs'
                : 'text-[#718197] hover:text-[#243b57]'
            }`}
          >
            <span>Borradores</span>
            <span className="text-[10px] font-mono font-bold bg-zinc-200 text-zinc-700 px-1.5 py-0.2 rounded">
              {draftCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('finalizado')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'finalizado'
                ? 'bg-white text-[#243b57] font-bold shadow-xs'
                : 'text-[#718197] hover:text-[#243b57]'
            }`}
          >
            <span>Finalizados</span>
            <span className="text-[10px] font-mono font-bold bg-zinc-200 text-zinc-700 px-1.5 py-0.2 rounded">
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
              className="text-xs text-[#243b57] border border-[#dfe4eb] rounded-xl px-2.5 py-2 bg-white focus:outline-none"
            >
              <option value="ALL">Todas las Áreas</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )}

          <div className="h-10 w-full sm:w-60 bg-white border border-[#dfe4eb] rounded-xl flex items-center gap-2 px-3 text-[#8996a7] shadow-2xs">
            <Search className="w-4 h-4 shrink-0 text-[#8996a7]" />
            <input
              type="text"
              placeholder="Buscar evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-0 outline-none text-xs text-[#233954] placeholder:text-[#8996a7]"
            />
          </div>
        </div>

      </div>

      {/* Grid de Tarjetas de Eventos estilo Functional Mockup */}
      {filtered.length === 0 ? (
        <div className="p-14 text-center bg-white rounded-2xl border border-[#e1e6ec] space-y-2">
          <Calendar className="w-10 h-10 text-[#8ba2be] mx-auto stroke-1" />
          <p className="text-[#203754] text-sm font-bold font-heading">
            No se encontraron eventos con estos filtros
          </p>
          <p className="text-[#718098] text-xs">
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
              if (isPublished) return <span className="bg-[#eaf8df] text-[#4f7b1d] px-2.5 py-1 rounded-xl text-[10px] font-bold">Publicado</span>;
              if (isInProgress) return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-xl text-[10px] font-bold animate-pulse">En Curso</span>;
              if (isFinished) return <span className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-xl text-[10px] font-bold">Finalizado</span>;
              return <span className="bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-xl text-[10px] font-bold">Borrador</span>;
            };

            return (
              <article 
                key={evt.id} 
                className="rounded-2xl border border-[#e1e6ec] bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Imagen de Portada con Zoom al hover y Badges Superiores */}
                <button
                  type="button"
                  onClick={() => onOpenDetailModal && onOpenDetailModal(evt)}
                  className="relative h-44 w-full block overflow-hidden text-left"
                >
                  <img 
                    src={evt.image || 'https://images.unsplash.com/photo-1598588436316-1e65ffcffc0a?w=400&auto=format&fit=crop&q=80'} 
                    alt={evt.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badge de Área */}
                  <span className="absolute top-3 left-3 bg-[#112744]/80 text-white backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                    {evt.area}
                  </span>
                  {/* Badge de Estado */}
                  <div className="absolute top-3 right-3 shadow-xs">
                    {getStatusBadge()}
                  </div>
                </button>

                {/* Cuerpo de la Tarjeta */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-heading font-extrabold text-[#1d3555] text-base group-hover:text-[#16a34a] transition-colors line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-[#78879a] text-xs line-clamp-2 mt-1 leading-relaxed">
                      {evt.purpose}
                    </p>
                  </div>

                  {/* Metadatos: Horario y Lugar */}
                  <div className="pt-2 border-t border-[#edf0f3] space-y-1 text-[11px] text-[#5f7289]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#7f8da0]" />
                      <span className="font-mono">{evt.date} • {evt.schedule || '14:00'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#7f8da0]" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>

                  {/* Contador de Aforo y Avatares */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        <span className="w-6 h-6 rounded-full bg-[#c9f45a] text-[#142b4d] border-2 border-white flex items-center justify-center font-bold text-[9px]">AM</span>
                        <span className="w-6 h-6 rounded-full bg-[#2d4c70] text-white border-2 border-white flex items-center justify-center font-bold text-[9px]">JS</span>
                        <span className="w-6 h-6 rounded-full bg-[#183a65] text-[#c9f45a] border-2 border-white flex items-center justify-center font-bold text-[8px]">
                          +{(evt.preattendanceCount || 10) - 2}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#78879a] font-mono">
                        {evt.attendeesCount || 0} / {evt.capacity || 50}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenDetailModal && onOpenDetailModal(evt)}
                      className="btn-ghost text-xs text-[#203754] font-bold flex items-center gap-1"
                    >
                      <span>Ver detalle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Barra de Acciones del Ciclo de 4 Estados (Solo para Encargado) */}
                  {isEncargado && (
                    <div className="pt-2 border-t border-[#edf0f3] flex items-center justify-between gap-1.5">
                      {isDraft && (
                        <button
                          type="button"
                          onClick={() => publishEvent(evt.id)}
                          className="btn btn-primary flex-1 py-1.5 text-xs font-bold"
                        >
                          <span>Publicar Evento</span>
                        </button>
                      )}

                      {isPublished && (
                        <button
                          type="button"
                          onClick={() => startEventAttendance(evt.id)}
                          className="btn btn-sena flex-1 py-1.5 text-xs font-bold"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Habilitar Asistencia</span>
                        </button>
                      )}

                      {isInProgress && (
                        <button
                          type="button"
                          onClick={() => closeEventAttendance(evt.id)}
                          className="btn btn-danger flex-1 py-1.5 text-xs font-bold"
                        >
                          <Pause className="w-3.5 h-3.5" />
                          <span>Finalizar Evento</span>
                        </button>
                      )}

                      {(isFinished || (evt.attendeesCount || 0) > 0) && (
                        <button
                          type="button"
                          onClick={() => onOpenExportModal && onOpenExportModal(evt)}
                          className="btn btn-secondary px-2.5 py-1.5 text-xs font-bold text-[#142b4d]"
                          title="Exportar acta oficial GOR-F-013"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-[#16a34a]" />
                          <span>GOR-F-013</span>
                        </button>
                      )}

                      {/* Editar */}
                      <button
                        type="button"
                        onClick={() => onOpenModal && onOpenModal(evt)}
                        className="p-2 rounded-lg text-[#718098] hover:text-[#142b4d] hover:bg-[#f4f7fa]"
                        title="Editar parámetros del evento"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Eliminar (solo en borrador) */}
                      {isDraft && (
                        <button
                          type="button"
                          onClick={() => deleteEvent(evt.id)}
                          className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="Eliminar borrador"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
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
