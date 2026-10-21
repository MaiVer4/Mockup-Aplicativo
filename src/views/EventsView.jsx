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
  ShieldCheck,
  Filter,
  ArrowRight,
  Sparkles,
  Users,
  Ban,
  Send,
  Lock
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
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
  const pendingCount = visibleEvents.filter(e => e.status === 'pendiente_aprobacion').length;
  const finishedCount = visibleEvents.filter(e => e.status === 'finalizado').length;
  const cancelledCount = visibleEvents.filter(e => e.status === 'cancelada').length;

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
      
      {/* Encabezado Ergonómico Unificado (Item 8 y 12) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e2e8f0]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isAdminGeneral ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c2f3a] text-[#c4f246] text-[11px] font-bold border border-white/10 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SUPERVISIÓN GENERAL · 6 ÁREAS INSTITUCIONALES</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0fdf4] text-[#15803d] text-[11px] font-bold border border-[#bbf7d0] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ENCARGADO OPERATIVO · ÁREA: {currentUser.area?.toUpperCase()}</span>
              </div>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] font-heading tracking-tight">
            Actividades de Bienestar al Aprendiz
          </h1>
          <p className="text-xs md:text-sm text-[#64748b]">
            {isEncargado 
              ? `Programación, fijación de fechas, control de asistencia presencial y actas de ${currentUser.area}.`
              : 'Supervisión integral de actividades, validación normativa institucional y consolidado de acreditación.'}
          </p>
        </div>

        {isAdminGeneral && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] max-w-xl">
            <ShieldCheck className="w-4 h-4 shrink-0 text-blue-700 mt-0.5" />
            <span><strong>Vista de supervisión:</strong> el administrador consulta estados, ventanas y métricas; la publicación y operación corresponden al Encargado de Área.</span>
          </div>
        )}

        {isEncargado && (
          <button
            type="button"
            onClick={() => onOpenModal(null)}
            className="btn btn-primary self-start sm:self-auto py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs active:scale-[0.96]"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Nueva Actividad</span>
          </button>
        )}
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="space-y-2.5">
        
        {/* FILA 1: Estados del Evento y Búsqueda */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Pestañas de Estados con soporte para Pendientes y Canceladas */}
          <div className="flex items-center gap-1 bg-[#e2e8f0]/80 p-1 rounded-xl text-xs font-semibold overflow-x-auto border border-[#cbd5e1]/50 custom-scrollbar">
            <button
              type="button"
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-[0.96] ${
                filterStatus === 'ALL'
                  ? 'bg-white text-[#1e293b] font-bold shadow-xs border border-[#cbd5e1]'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <span>Todas</span>
              <span className="text-[10px] font-mono font-bold bg-[#f1f5f9] text-[#475569] px-1.5 py-0.2 rounded">
                {totalCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus('publicado')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-[0.96] ${
                filterStatus === 'publicado'
                  ? 'bg-white text-[#1e293b] font-bold shadow-xs border border-[#cbd5e1]'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <span>Publicadas</span>
              <span className="text-[10px] font-mono font-bold bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-1.5 py-0.2 rounded">
                {publishedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus('en_curso')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-[0.96] ${
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
              onClick={() => setFilterStatus('pendiente_aprobacion')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-[0.96] ${
                filterStatus === 'pendiente_aprobacion'
                  ? 'bg-white text-[#1e293b] font-bold shadow-xs border border-[#cbd5e1]'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <span>En Revisión</span>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">
                {pendingCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus('borrador')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-[0.96] ${
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
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-[0.96] ${
                filterStatus === 'finalizado'
                  ? 'bg-white text-[#1e293b] font-bold shadow-xs border border-[#cbd5e1]'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <span>Finalizadas</span>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                {finishedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus('cancelada')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-[0.96] ${
                filterStatus === 'cancelada'
                  ? 'bg-white text-[#1e293b] font-bold shadow-xs border border-[#cbd5e1]'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              <span>Canceladas</span>
              <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.2 rounded">
                {cancelledCount}
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
        <EmptyState
          title="Sin actividades para este criterio"
          description="No se encontraron actividades con los filtros actuales. Prueba ajustando el estado, trimestre, área o término de búsqueda."
          icon={Calendar}
          actionLabel="Restablecer Filtros"
          onAction={() => {
            setFilterStatus('ALL');
            setFilterQuarter('ALL');
            setFilterArea('ALL');
            setSearchTerm('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(evt => {
            const isDraft = evt.status === 'borrador';
            const isPublished = evt.status === 'publicado';
            const isInProgress = evt.status === 'en_curso';
            const isFinished = evt.status === 'finalizado';
            const isPending = evt.status === 'pendiente_aprobacion';
            const isCancelled = evt.status === 'cancelada';

            const getStatusBadge = () => {
              if (isPublished) return <span className="bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2.5 py-1 rounded-xl text-[10px] font-bold">Publicada</span>;
              if (isInProgress) return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl text-[10px] font-bold animate-pulse">En Curso</span>;
              if (isPending) return <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-xl text-[10px] font-bold">En Revisión</span>;
              if (isFinished) return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-xl text-[10px] font-bold">Finalizada</span>;
              if (isCancelled) return <span className="bg-rose-50 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-xl text-[10px] font-bold">Cancelada</span>;
              return <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-xl text-[10px] font-bold">Borrador</span>;
            };

            return (
              <article 
                key={evt.id} 
                className={`card-ergonomic overflow-hidden flex flex-col justify-between group transition-all ${
                  isCancelled ? 'border-rose-200 bg-rose-50/15 opacity-90' : ''
                }`}
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

                {/* Flujo visual RF-08: revisión → publicación → ventana → cierre/cancelación */}
                <div className="px-4 pt-3">
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-[#64748b]">
                    <span className={isDraft ? 'text-amber-700' : 'text-[#15803d]'}>Revisión</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className={isDraft ? 'text-slate-400' : 'text-[#15803d]'}>Aprobada / publicada</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className={isInProgress ? 'text-amber-700' : 'text-slate-400'}>Ventana activa</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className={isFinished ? 'text-[#475569]' : 'text-slate-400'}>Cierre</span>
                  </div>
                  <p className="text-[10px] text-[#64748b] mt-1">
                    {isDraft ? 'Pendiente de aprobación antes de publicar' : isPublished ? 'Publicada · asistencia cerrada hasta la apertura' : isInProgress ? 'Apertura activa · participación habilitada' : 'Ventana cerrada · acta final'}
                  </p>
                </div>

                {/* Cuerpo de la Tarjeta */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-heading font-extrabold text-[#1e293b] text-base group-hover:text-[#15803d] transition-colors line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-[#475569] text-xs line-clamp-4 mt-1 leading-relaxed whitespace-pre-line">
                      {evt.purpose}
                    </p>
                  </div>

                  {/* Metadatos: Horario, Apertura y Lugar */}
                  <div className="pt-2 border-t border-[#e2e8f0] space-y-1.5 text-[11px] text-[#475569]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#94a3b8]" />
                        <span className="font-mono">{evt.date} • {evt.schedule || '14:00'}</span>
                      </div>
                      {evt.attendanceOpenedAt && isInProgress && (
                        <span className="text-[10px] font-mono font-bold text-[#15803d] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15803d] animate-pulse" />
                          Abierta {new Date(evt.attendanceOpenedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                      {evt.attendanceClosedAt && isFinished && (
                        <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          Cerrada {new Date(evt.attendanceClosedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#94a3b8]" />
                      <span className="truncate">{evt.location}</span>
                    </div>

                    {isCancelled && (
                      <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[10px] flex items-center gap-1.5">
                        <Ban className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span className="truncate">Cancelada: {evt.cancellationReason || 'Fuerza mayor'}</span>
                      </div>
                    )}
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

                  {/* Barra de Acciones Unificada y Proporcionada (Solo para Encargado) */}
                  {isEncargado && (
                    <div className="pt-2.5 border-t border-[#e2e8f0]">
                      {isDraft && (
                        <div className="flex items-center gap-2">
                          {evt.isAmbiguous ? (
                            <button
                              type="button"
                              onClick={() => onOpenModal && onOpenModal(evt, { focusDate: true })}
                              className="btn bg-amber-600 hover:bg-amber-700 text-white flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer min-w-0"
                            >
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Fijar Fecha</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => publishEvent(evt.id)}
                              className="btn btn-primary flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs group/pub min-w-0"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-white/90 shrink-0" />
                              <span className="truncate">Publicar</span>
                              <ArrowRight className="w-3 h-3 text-[#c4f246] group-hover/pub:translate-x-0.5 transition-transform shrink-0" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenModal && onOpenModal(evt)}
                            className="btn btn-secondary py-2 px-3 rounded-xl text-xs font-semibold text-[#1e293b] flex items-center justify-center gap-1.5 border border-[#cbd5e1] hover:border-[#15803d] hover:text-[#15803d] hover:bg-emerald-50/40 transition-colors shrink-0 shadow-2xs"
                            title="Editar parámetros del evento"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#15803d]" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteEvent(evt.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-[#cbd5e1] hover:border-rose-200 transition-colors shrink-0"
                            title="Eliminar borrador"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {isPublished && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEventAttendance(evt.id)}
                            className="btn btn-primary flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 group/live min-w-0 shadow-2xs"
                          >
                            <Play className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Habilitar Asistencia</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenModal && onOpenModal(evt)}
                            className="btn btn-secondary py-2 px-3 rounded-xl text-xs font-semibold text-[#1e293b] flex items-center justify-center gap-1.5 border border-[#cbd5e1] hover:border-[#15803d] hover:text-[#15803d] hover:bg-emerald-50/40 transition-colors shrink-0 shadow-2xs"
                            title="Editar parámetros del evento"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#15803d]" />
                            <span>Editar</span>
                          </button>
                        </div>
                      )}

                      {isInProgress && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => closeEventAttendance(evt.id)}
                            className="btn btn-danger flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 min-w-0 shadow-2xs"
                          >
                            <Pause className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Finalizar Evento</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenModal && onOpenModal(evt)}
                            className="btn btn-secondary py-2 px-3 rounded-xl text-xs font-semibold text-[#1e293b] flex items-center justify-center gap-1.5 border border-[#cbd5e1] hover:border-[#15803d] hover:text-[#15803d] hover:bg-emerald-50/40 transition-colors shrink-0 shadow-2xs"
                            title="Editar parámetros del evento"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#15803d]" />
                            <span>Editar</span>
                          </button>
                        </div>
                      )}

                      {isFinished && (
                        <div className="space-y-2">
                          <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-medium">
                            Cierre registrado · cancelación disponible como estado terminal de contingencia
                          </div>
                          <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenExportModal && onOpenExportModal(evt)}
                            className="btn btn-secondary flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-[#1e293b] border border-[#cbd5e1] hover:border-[#15803d] min-w-0 shadow-2xs"
                            title="Exportar acta oficial de asistencia GOR-F-013"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                            <span className="truncate">Exportar Acta (.XLSX)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveTab('participants')}
                            className="btn btn-secondary py-2 px-3 rounded-xl text-xs font-semibold text-[#1e293b] flex items-center justify-center gap-1.5 border border-[#cbd5e1] hover:border-[#15803d] hover:text-[#15803d] transition-colors shrink-0 shadow-2xs"
                            title="Ver asistentes registrados"
                          >
                            <Users className="w-3.5 h-3.5 text-[#15803d]" />
                            <span>Asistentes</span>
                          </button>
                          </div>
                        </div>
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
