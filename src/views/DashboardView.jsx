import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  CalendarCheck2, 
  Flame, 
  TrendingUp, 
  Search, 
  Filter, 
  CheckCircle2, 
  Radio, 
  Edit3, 
  Lock, 
  FileSpreadsheet,
  PlusCircle,
  Eye,
  Music,
  Trophy,
  Layers,
  ArrowUpRight
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

  // Cálculos de métricas ejecutivas
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
      evt.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArea = selectedArea === 'ALL' || evt.area === selectedArea;
    const matchesStatus = selectedStatus === 'ALL' || evt.status === selectedStatus;

    return matchesSearch && matchesArea && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Panel de Métricas y Analítica de Eventos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitoreo en tiempo real de asistencia, estados de publicación y cobertura institucional.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenExcelUpload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Cargar Excel (IA)</span>
          </button>

          <button
            onClick={() => onOpenModal(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Evento</span>
          </button>
        </div>
      </div>

      {/* Tarjetas KPI Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Eventos */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Eventos</span>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalEvents}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <span className="text-indigo-600 font-semibold">{todayEvents.length} programados hoy</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-indigo-500/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform" />
        </div>

        {/* KPI 2: Total Asistentes */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Asistentes</span>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalAttendees}</div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Confirmaciones registradas
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-emerald-500/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform" />
        </div>

        {/* KPI 3: Asistencia Abierta Ahora */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asistencia Activa</span>
            <div className="text-3xl font-extrabold text-amber-600 tracking-tight flex items-center gap-2">
              {activeAttendanceEvents.length}
              {activeAttendanceEvents.length > 0 && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500">
              Eventos recibiendo confirmaciones
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Radio className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-amber-500/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform" />
        </div>

        {/* KPI 4: Tasa de Ocupación */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasa de Asistencia</span>
            <div className="text-3xl font-extrabold text-indigo-600 tracking-tight">{occupancyRate}%</div>
            <div className="text-xs text-slate-500">
              {totalAttendees} de {totalCapacity} aforo total
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-violet-500/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform" />
        </div>
      </div>

      {/* Gráficos Visuales de Analítica */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico 1: Asistencia por Evento (Barras visuales en CSS) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Métricas de Asistencia por Evento</h2>
              <p className="text-xs text-slate-500">Volumen de participantes frente al cupo máximo proyectado</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
              En tiempo real
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {visibleEvents.slice(0, 5).map(evt => {
              const pct = Math.min(100, Math.round((evt.attendeesCount / (evt.capacity || 50)) * 100));
              const isMusic = evt.area === 'Música';
              return (
                <div key={evt.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[70%]">
                      <span className={`w-2 h-2 rounded-full ${isMusic ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                      <span className="font-semibold text-slate-800 truncate">{evt.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({evt.date})</span>
                    </div>
                    <div className="font-mono text-slate-600">
                      <strong className="text-slate-900">{evt.attendeesCount}</strong> / {evt.capacity} asist. ({pct}%)
                    </div>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        isMusic 
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfico 2: Desglose por Estado y Cobertura */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Distribución de Estados</h2>
            <p className="text-xs text-slate-500">Ciclo de vida actual de los eventos registrados</p>
          </div>

          <div className="space-y-3 py-2">
            {/* Publicados */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Publicados</span>
              </div>
              <span className="font-bold text-sm text-indigo-900">
                {visibleEvents.filter(e => e.status === 'published').length}
              </span>
            </div>

            {/* Asistencia Abierta */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                <Radio className="w-4 h-4 text-amber-600" />
                <span>Asistencia Habilitada</span>
              </div>
              <span className="font-bold text-sm text-amber-900">
                {visibleEvents.filter(e => e.attendanceEnabled).length}
              </span>
            </div>

            {/* Borradores */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/70 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Edit3 className="w-4 h-4 text-slate-500" />
                <span>Borradores (Pendientes)</span>
              </div>
              <span className="font-bold text-sm text-slate-700">
                {visibleEvents.filter(e => e.status === 'draft').length}
              </span>
            </div>

            {/* Cerrados */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 border border-rose-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-900">
                <Lock className="w-4 h-4 text-rose-600" />
                <span>Cerrados (Finalizados)</span>
              </div>
              <span className="font-bold text-sm text-rose-900">
                {visibleEvents.filter(e => e.status === 'closed').length}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
            Permite controlar el flujo completo del evento en tiempo real
          </div>
        </div>
      </div>

      {/* Controles de Búsqueda y Filtros de la Tabla */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar evento por título, propósito o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin_general' && (
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todas las Áreas</option>
              {AREAS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          )}

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="published">Solo Publicados</option>
            <option value="draft">Solo Borradores</option>
            <option value="closed">Solo Cerrados</option>
          </select>
        </div>
      </div>

      {/* Tabla Detallada de Eventos con los 4 Botones de Acción */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Listado Maestro de Eventos</h2>
            <p className="text-xs text-slate-500">Acciones del ciclo de vida: Publicar, Habilitar Asistencia, Editar y Cerrar</p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {filteredEvents.length} eventos listados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/70 uppercase tracking-wider text-[11px] font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Evento & Propósito</th>
                <th className="px-4 py-3.5">Área</th>
                <th className="px-4 py-3.5">Fecha & Horario</th>
                <th className="px-4 py-3.5">Métrica Asistencia</th>
                <th className="px-4 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-center">Acciones del Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    No se encontraron eventos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const isMusic = evt.area === 'Música';
                  const isClosed = evt.status === 'closed';

                  return (
                    <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Columna: Evento */}
                      <td className="px-5 py-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.image}
                            alt={evt.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm border border-slate-200"
                          />
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{evt.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{evt.purpose}</p>
                            <span className="text-[10px] text-slate-400 font-mono">📍 {evt.location}</span>
                          </div>
                        </div>
                      </td>

                      {/* Columna: Área */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          isMusic 
                            ? 'bg-purple-50 text-purple-700 border-purple-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {isMusic ? <Music className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
                          {evt.area}
                        </span>
                      </td>

                      {/* Columna: Fecha */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{evt.date}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{evt.time}</div>
                      </td>

                      {/* Columna: Métrica de Asistencia */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{evt.attendeesCount}</span>
                          <span className="text-slate-400 text-xs">/ {evt.capacity} cupos</span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${Math.min(100, (evt.attendeesCount / evt.capacity) * 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Columna: Estado & Asistencia */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {evt.status === 'published' && (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Publicado
                            </span>
                          )}
                          {evt.status === 'draft' && (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                              Borrador
                            </span>
                          )}
                          {evt.status === 'closed' && (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              Cerrado
                            </span>
                          )}

                          {evt.attendanceEnabled && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-700 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                              Asistencia Abierta
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Columna: Los 4 Botones de Acción Solicitados */}
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                          
                          {/* 1. Botón Publicar / Despublicar */}
                          <button
                            disabled={isClosed}
                            onClick={() => togglePublishEvent(evt.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              isClosed
                                ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-500'
                                : evt.status === 'published'
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                            }`}
                            title={evt.status === 'published' ? 'Despublicar evento' : 'Publicar evento'}
                          >
                            {evt.status === 'published' ? 'Despublicar' : 'Publicar'}
                          </button>

                          {/* 2. Botón Habilitar / Deshabilitar Asistencia */}
                          <button
                            disabled={isClosed || evt.status !== 'published'}
                            onClick={() => toggleAttendance(evt.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              isClosed || evt.status !== 'published'
                                ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-500'
                                : evt.attendanceEnabled
                                ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm'
                                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                            }`}
                            title="Habilitar o pausar asistencia de aprendices"
                          >
                            {evt.attendanceEnabled ? 'Pausar Asist.' : 'Habilitar Asist.'}
                          </button>

                          {/* 3. Botón Editar Evento */}
                          <button
                            disabled={isClosed}
                            onClick={() => onOpenModal(evt)}
                            className={`p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ${
                              isClosed ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                            title="Editar detalles del evento"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* 4. Botón Cerrar Evento */}
                          <button
                            disabled={isClosed}
                            onClick={() => {
                              if (window.confirm(`¿Confirmas cerrar definitivamente el evento "${evt.title}"?`)) {
                                closeEvent(evt.id);
                              }
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isClosed
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                            title={isClosed ? 'Evento ya cerrado' : 'Cerrar evento y congelar métricas'}
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
