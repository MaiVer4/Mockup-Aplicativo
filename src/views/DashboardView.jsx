import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  CalendarCheck2, 
  TrendingUp, 
  Search, 
  CheckCircle2, 
  Radio, 
  Edit3, 
  Lock, 
  FileSpreadsheet,
  PlusCircle,
  Music,
  Trophy,
  ArrowUpRight,
  School,
  BookOpen,
  FileText
} from 'lucide-react';
import { AREAS } from '../data/mockData';

export default function DashboardView({ onOpenModal, onOpenExcelUpload }) {
  const { 
    currentUser, 
    visibleEvents, 
    togglePublishEvent, 
    toggleAttendance, 
    closeEvent 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Métricas institucionales
  const totalEvents = visibleEvents.length;
  const totalAttendees = visibleEvents.reduce((acc, curr) => acc + (curr.attendeesCount || 0), 0);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = visibleEvents.filter(e => e.date === todayStr);
  
  const activeAttendanceEvents = visibleEvents.filter(e => e.attendanceEnabled && e.status === 'published');
  
  const totalCapacity = visibleEvents.reduce((acc, curr) => acc + (curr.capacity || 50), 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalAttendees / totalCapacity) * 100) : 0;

  // Filtrado de la tabla
  const filteredEvents = visibleEvents.filter(evt => {
    const matchesSearch = 
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.code && evt.code.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArea = selectedArea === 'ALL' || evt.area === selectedArea;
    const matchesStatus = selectedStatus === 'ALL' || evt.status === selectedStatus;

    return matchesSearch && matchesArea && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Encabezado Académico */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/90 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0b1e38] text-amber-300 border border-amber-400/30">
              Decanatura & Extensión Universitaria
            </span>
            <span className="text-xs text-slate-400">• Periodo Lectivo 2026-II</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0b1e38] tracking-tight">
            Panel de Indicadores y Analítica Académica
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Monitoreo en tiempo real de convocatorias de extensión, control de aforo por auditorio y registro formal de quórum estudiantil.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenExcelUpload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0b1e38] text-amber-300 hover:bg-[#143156] border border-amber-400/40 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Cargar Planilla Excel</span>
          </button>

          <button
            onClick={() => onOpenModal(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nueva Convocatoria</span>
          </button>
        </div>
      </div>

      {/* Tarjetas KPI Académicas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Eventos */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-amber-400/60 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Convocatorias Totales</span>
            <div className="w-9 h-9 rounded-xl bg-[#0b1e38]/5 border border-[#0b1e38]/10 flex items-center justify-center text-[#0b1e38]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-[#0b1e38] tracking-tight">{totalEvents}</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="text-amber-700 font-bold">{todayEvents.length} programadas para hoy</span>
          </p>
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-[#0b1e38] to-amber-500" />
        </div>

        {/* KPI 2: Total Asistencias */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-amber-400/60 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Asistencias Validadas</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-slate-900 tracking-tight">{totalAttendees}</div>
          <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> Registros de presencia
          </p>
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-emerald-600 to-teal-500" />
        </div>

        {/* KPI 3: Asistencia Abierta Ahora */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-amber-400/60 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Libro de Asistencia</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-amber-800 tracking-tight flex items-center gap-2">
            {activeAttendanceEvents.length}
            {activeAttendanceEvents.length > 0 && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Convocatorias en fase de registro
          </p>
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-amber-500 to-yellow-400" />
        </div>

        {/* KPI 4: Índice de Aforo */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-amber-400/60 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cobertura de Aforo</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-[#0b1e38] tracking-tight">{occupancyRate}%</div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {totalAttendees} ocupados de {totalCapacity} cupos
          </p>
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-[#173d63] to-indigo-500" />
        </div>
      </div>

      {/* Gráficos y Desglose Curricular */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico 1: Asistencia vs Aforo por Actividad */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-serif font-bold text-[#0b1e38]">
                Quórum Curricular por Actividad
              </h2>
              <p className="text-xs text-slate-500">Estudiantes acreditados frente al aforo del recinto académico</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              Acreditación Oficial
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {visibleEvents.slice(0, 5).map(evt => {
              const pct = Math.min(100, Math.round((evt.attendeesCount / (evt.capacity || 50)) * 100));
              const isMusic = evt.area === 'Música';
              return (
                <div key={evt.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[68%]">
                      <span className="font-mono text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {evt.code || 'ACT'}
                      </span>
                      <span className="font-bold text-slate-800 truncate">{evt.title}</span>
                    </div>
                    <div className="font-mono text-slate-600 text-xs">
                      <strong className="text-[#0b1e38] font-bold">{evt.attendeesCount}</strong> / {evt.capacity} asist. ({pct}%)
                    </div>
                  </div>
                  
                  {/* Barra sobria */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        isMusic 
                          ? 'bg-gradient-to-r from-[#1b4170] to-[#2563eb]' 
                          : 'bg-gradient-to-r from-emerald-700 to-teal-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desglose de Actas y Estados */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-serif font-bold text-[#0b1e38]">
              Estado del Libro de Actas
            </h2>
            <p className="text-xs text-slate-500">Distribución operativa de las convocatorias</p>
          </div>

          <div className="space-y-2.5 py-1">
            {/* Publicados */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Convocatorias Publicadas</span>
              </div>
              <span className="font-bold text-sm text-[#0b1e38]">
                {visibleEvents.filter(e => e.status === 'published').length}
              </span>
            </div>

            {/* Asistencia Abierta */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Radio className="w-4 h-4 text-amber-600" />
                <span>Libro de Asistencia Abierto</span>
              </div>
              <span className="font-bold text-sm text-amber-900">
                {visibleEvents.filter(e => e.attendanceEnabled).length}
              </span>
            </div>

            {/* Borradores */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Edit3 className="w-4 h-4 text-slate-500" />
                <span>Borradores Curriculares</span>
              </div>
              <span className="font-bold text-sm text-slate-700">
                {visibleEvents.filter(e => e.status === 'draft').length}
              </span>
            </div>

            {/* Cerrados */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/70 border border-rose-200">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                <Lock className="w-4 h-4 text-rose-700" />
                <span>Actas Finalizadas y Cerradas</span>
              </div>
              <span className="font-bold text-sm text-rose-900">
                {visibleEvents.filter(e => e.status === 'closed').length}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 font-medium">
            Registros sincronizados con la secretaría académica
          </div>
        </div>
      </div>

      {/* Controles de Búsqueda y Filtros de la Tabla */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por código, título, propósito formativo o auditorio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin_general' && (
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <option value="ALL">Todos los Departamentos</option>
              {AREAS.map(a => (
                <option key={a} value={a}>Depto. de {a}</option>
              ))}
            </select>
          )}

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="published">Convocatorias Publicadas</option>
            <option value="draft">Borradores Curriculares</option>
            <option value="closed">Actas Cerradas</option>
          </select>
        </div>
      </div>

      {/* Tabla Maestra con los 4 Botones Operativos en Diseño Académico */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-serif font-bold text-[#0b1e38]">
              Libro de Registro de Convocatorias
            </h2>
            <p className="text-xs text-slate-500">
              Operaciones del ciclo de vida: Publicar, Habilitar Asistencia, Editar Ficha y Cerrar Acta
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            {filteredEvents.length} convocatorias listadas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#0b1e38] uppercase tracking-wider text-[11px] font-bold text-amber-300/90 border-b border-slate-300">
              <tr>
                <th className="px-5 py-3.5">Ficha Curricular & Propósito</th>
                <th className="px-4 py-3.5">Departamento</th>
                <th className="px-4 py-3.5">Fecha & Recinto</th>
                <th className="px-4 py-3.5">Quórum Acreditado</th>
                <th className="px-4 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-center">Acciones Operativas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    No se encontraron convocatorias académicas con los criterios especificados.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const isMusic = evt.area === 'Música';
                  const isClosed = evt.status === 'closed';

                  return (
                    <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                      {/* Columna: Evento */}
                      <td className="px-5 py-4 max-w-sm">
                        <div className="flex items-start gap-3">
                          <img
                            src={evt.image}
                            alt={evt.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 shadow-sm mt-0.5"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                {evt.code || 'COD-ACT'}
                              </span>
                            </div>
                            <h3 className="font-bold text-[#0b1e38] text-sm leading-snug line-clamp-1">{evt.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{evt.purpose}</p>
                          </div>
                        </div>
                      </td>

                      {/* Columna: Departamento */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isMusic 
                            ? 'bg-blue-50 text-blue-800 border-blue-200' 
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {isMusic ? <Music className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
                          Depto. {evt.area}
                        </span>
                      </td>

                      {/* Columna: Fecha */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{evt.date}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{evt.time}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">📍 {evt.location}</div>
                      </td>

                      {/* Columna: Métrica de Asistencia */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-[#0b1e38]">{evt.attendeesCount}</span>
                          <span className="text-slate-400 text-xs">/ {evt.capacity} cupos</span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-amber-600 rounded-full"
                            style={{ width: `${Math.min(100, (evt.attendeesCount / evt.capacity) * 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Columna: Estado & Asistencia */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {evt.status === 'published' && (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              Publicado
                            </span>
                          )}
                          {evt.status === 'draft' && (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                              Borrador
                            </span>
                          )}
                          {evt.status === 'closed' && (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                              Acta Cerrada
                            </span>
                          )}

                          {evt.attendanceEnabled && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-800 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                              Asistencia Abierta
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Columna: Los 4 Botones Operativos */}
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                          
                          {/* 1. Botón Publicar / Despublicar */}
                          <button
                            disabled={isClosed}
                            onClick={() => togglePublishEvent(evt.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isClosed
                                ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-500'
                                : evt.status === 'published'
                                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                                : 'bg-[#0b1e38] text-amber-300 hover:bg-[#143156] border border-amber-400/40 shadow-sm'
                            }`}
                            title={evt.status === 'published' ? 'Despublicar convocatoria' : 'Publicar convocatoria oficial'}
                          >
                            {evt.status === 'published' ? 'Despublicar' : 'Publicar'}
                          </button>

                          {/* 2. Botón Habilitar / Deshabilitar Asistencia */}
                          <button
                            disabled={isClosed || evt.status !== 'published'}
                            onClick={() => toggleAttendance(evt.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isClosed || evt.status !== 'published'
                                ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-500'
                                : evt.attendanceEnabled
                                ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                            }`}
                            title="Habilitar o pausar libro de asistencia"
                          >
                            {evt.attendanceEnabled ? 'Pausar Asist.' : 'Habilitar Asist.'}
                          </button>

                          {/* 3. Botón Editar Evento */}
                          <button
                            disabled={isClosed}
                            onClick={() => onOpenModal(evt)}
                            className={`p-1.5 rounded-lg text-slate-600 hover:text-[#0b1e38] hover:bg-slate-200 transition-colors ${
                              isClosed ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                            title="Editar ficha curricular del evento"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* 4. Botón Cerrar Evento */}
                          <button
                            disabled={isClosed}
                            onClick={() => {
                              if (window.confirm(`¿Confirmas cerrar definitivamente el acta del evento "${evt.title}"?`)) {
                                closeEvent(evt.id);
                              }
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isClosed
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-400 hover:text-rose-700 hover:bg-rose-50'
                            }`}
                            title={isClosed ? 'Acta ya cerrada' : 'Cerrar acta y certificar asistencias'}
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
