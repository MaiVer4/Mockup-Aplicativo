import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Search, 
  Radio, 
  Edit3, 
  Lock, 
  FileSpreadsheet,
  Plus,
  ArrowUpRight,
  CheckCircle,
  MoreHorizontal
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

  // Cálculos de métricas
  const totalEvents = visibleEvents.length;
  const totalAttendees = visibleEvents.reduce((acc, curr) => acc + (curr.attendeesCount || 0), 0);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = visibleEvents.filter(e => e.date === todayStr);
  
  const activeAttendanceEvents = visibleEvents.filter(e => e.attendanceEnabled && e.status === 'published');
  
  const totalCapacity = visibleEvents.reduce((acc, curr) => acc + (curr.capacity || 50), 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalAttendees / totalCapacity) * 100) : 0;

  // Filtrado
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
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Encabezado de Operaciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              OPERACIONES // ANALÍTICA
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <span className="font-mono text-[10px] text-emerald-600 font-medium">TIEMPO REAL</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">
            Métricas & Control de Eventos
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Supervisión continua de aforo, estados operativos y registro de asistencia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExcelUpload}
            className="btn-tactile flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-600" />
            <span>Cargar Excel (IA)</span>
          </button>

          <button
            onClick={() => onOpenModal(null)}
            className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-950 text-white hover:bg-zinc-800 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Evento</span>
          </button>
        </div>
      </div>

      {/* Grid de 4 KPIs Minimalistas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* KPI 1: Total Eventos */}
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span className="font-medium text-zinc-600">Total Eventos</span>
            <Calendar className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tracking-tight font-mono text-zinc-950">{totalEvents}</div>
            <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
              {todayEvents.length} programados hoy
            </div>
          </div>
        </div>

        {/* KPI 2: Total Asistentes */}
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span className="font-medium text-zinc-600">Asistencias Confirmadas</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tracking-tight font-mono text-zinc-950">{totalAttendees}</div>
            <div className="text-[11px] text-emerald-600 font-mono mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>Registros validados</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Asistencia Abierta */}
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span className="font-medium text-zinc-600">Asistencia Habilitada</span>
            <Radio className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight font-mono text-zinc-950 flex items-center gap-2">
              {activeAttendanceEvents.length}
              {activeAttendanceEvents.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </div>
            <span className="text-[10px] font-mono text-zinc-500">EN CURSO</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
            Recibiendo check-ins
          </div>
        </div>

        {/* KPI 4: Tasa de Ocupación */}
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span className="font-medium text-zinc-600">Ocupación Global</span>
            <TrendingUp className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tracking-tight font-mono text-zinc-950">{occupancyRate}%</div>
            <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
              {totalAttendees} / {totalCapacity} aforo total
            </div>
          </div>
        </div>
      </div>

      {/* Sección Analítica: Capacidad por Evento & Distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Desglose de Capacidad */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
            <div>
              <h2 className="text-xs font-bold text-zinc-900 tracking-tight uppercase">
                Capacidad & Quórum por Evento
              </h2>
              <p className="text-[11px] text-zinc-500">Comparativa de asistentes vs límite de aforo</p>
            </div>
            <span className="font-mono text-[10px] text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200">
              TELEMETRÍA
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {visibleEvents.slice(0, 5).map(evt => {
              const pct = Math.min(100, Math.round((evt.attendeesCount / (evt.capacity || 50)) * 100));
              return (
                <div key={evt.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[70%]">
                      <span className="font-mono text-[10px] text-zinc-600 bg-zinc-100 px-1 py-0.5 rounded border border-zinc-200">
                        {evt.code || 'EVT'}
                      </span>
                      <span className="font-medium text-zinc-800 truncate">{evt.title}</span>
                    </div>
                    <div className="font-mono text-zinc-600 text-xs">
                      <strong className="text-zinc-950">{evt.attendeesCount}</strong>/{evt.capacity} <span className="text-zinc-400">({pct}%)</span>
                    </div>
                  </div>
                  
                  {/* Barra monocromática limpia */}
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribución de Estados */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="border-b border-zinc-100 pb-2.5">
            <h2 className="text-xs font-bold text-zinc-900 tracking-tight uppercase">
              Ciclo de Vida Operativo
            </h2>
            <p className="text-[11px] text-zinc-500">Estado de convocatorias activas</p>
          </div>

          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50/70 border border-zinc-200/80 text-xs">
              <div className="flex items-center gap-2 font-medium text-zinc-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Publicados</span>
              </div>
              <span className="font-mono font-bold text-zinc-900">
                {visibleEvents.filter(e => e.status === 'published').length}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50/70 border border-zinc-200/80 text-xs">
              <div className="flex items-center gap-2 font-medium text-zinc-800">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Asistencia Habilitada</span>
              </div>
              <span className="font-mono font-bold text-zinc-900">
                {visibleEvents.filter(e => e.attendanceEnabled).length}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50/70 border border-zinc-200/80 text-xs">
              <div className="flex items-center gap-2 font-medium text-zinc-800">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                <span>Borradores</span>
              </div>
              <span className="font-mono font-bold text-zinc-900">
                {visibleEvents.filter(e => e.status === 'draft').length}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50/70 border border-zinc-200/80 text-xs">
              <div className="flex items-center gap-2 font-medium text-zinc-800">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Cerrados</span>
              </div>
              <span className="font-mono font-bold text-zinc-900">
                {visibleEvents.filter(e => e.status === 'closed').length}
              </span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-zinc-400 text-center pt-2 border-t border-zinc-100">
            AUTO-SYNC CON LOCALSTORAGE
          </div>
        </div>
      </div>

      {/* Barra de Filtros Minimalista */}
      <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filtrar por código, título, propósito o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-zinc-900 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin_general' && (
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 bg-white focus:outline-none focus:border-zinc-900"
            >
              <option value="ALL">Todas las Áreas</option>
              {AREAS.map(a => (
                <option key={a} value={a}>Área: {a}</option>
              ))}
            </select>
          )}

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 bg-white focus:outline-none focus:border-zinc-900"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
            <option value="closed">Cerrados</option>
          </select>
        </div>
      </div>

      {/* Tabla Maestra de Alta Densidad */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Registro de Operaciones
            </h3>
          </div>
          <span className="font-mono text-[10px] text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
            {filteredEvents.length} REGISTROS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50/80 font-mono text-[10px] uppercase text-zinc-500 border-b border-zinc-200">
              <tr>
                <th className="px-4 py-2.5 font-medium">Evento // Propósito</th>
                <th className="px-3 py-2.5 font-medium">Área</th>
                <th className="px-3 py-2.5 font-medium">Fecha & Lugar</th>
                <th className="px-3 py-2.5 font-medium">Asistencia</th>
                <th className="px-3 py-2.5 font-medium">Estado</th>
                <th className="px-4 py-2.5 text-center font-medium">Acciones Operativas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-zinc-400 font-mono">
                    No se encontraron registros.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const isClosed = evt.status === 'closed';

                  return (
                    <tr key={evt.id} className="hover:bg-zinc-50/70 transition-colors">
                      {/* Evento & Propósito */}
                      <td className="px-4 py-3 max-w-sm">
                        <div className="flex items-start gap-3">
                          <img
                            src={evt.image}
                            alt={evt.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-zinc-200 mt-0.5"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-mono text-[10px] text-zinc-500 bg-zinc-100 px-1 rounded">
                                {evt.code || 'EVT'}
                              </span>
                              <h4 className="font-semibold text-zinc-900 text-xs truncate">
                                {evt.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-zinc-500 line-clamp-1 leading-snug">
                              {evt.purpose}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Área */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="font-mono text-[10px] text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                          {evt.area}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="font-mono text-zinc-900 text-xs">{evt.date}</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate max-w-[140px]">
                          {evt.location}
                        </div>
                      </td>

                      {/* Asistencia */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="font-mono text-xs">
                          <strong className="text-zinc-950 font-bold">{evt.attendeesCount}</strong>
                          <span className="text-zinc-400">/{evt.capacity}</span>
                        </div>
                        <div className="w-20 h-1 bg-zinc-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-zinc-900 rounded-full"
                            style={{ width: `${Math.min(100, (evt.attendeesCount / evt.capacity) * 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="space-y-1">
                          {evt.status === 'published' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              Publicado
                            </span>
                          )}
                          {evt.status === 'draft' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                              Borrador
                            </span>
                          )}
                          {evt.status === 'closed' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Cerrado
                            </span>
                          )}

                          {evt.attendanceEnabled && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-700 font-mono font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                              Asist. Abierta
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Los 4 Botones Operativos Minimalistas */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1 bg-zinc-100/70 p-1 rounded-lg border border-zinc-200">
                          
                          {/* 1. Publicar / Despublicar */}
                          <button
                            disabled={isClosed}
                            onClick={() => togglePublishEvent(evt.id)}
                            className={`btn-tactile px-2 py-1 rounded text-xs font-medium transition-all ${
                              isClosed
                                ? 'opacity-40 cursor-not-allowed text-zinc-400'
                                : evt.status === 'published'
                                ? 'bg-white text-zinc-800 shadow-xs border border-zinc-200 hover:bg-zinc-50'
                                : 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-xs'
                            }`}
                            title={evt.status === 'published' ? 'Despublicar evento' : 'Publicar evento'}
                          >
                            {evt.status === 'published' ? 'Despublicar' : 'Publicar'}
                          </button>

                          {/* 2. Habilitar Asistencia */}
                          <button
                            disabled={isClosed || evt.status !== 'published'}
                            onClick={() => toggleAttendance(evt.id)}
                            className={`btn-tactile px-2 py-1 rounded text-xs font-medium transition-all ${
                              isClosed || evt.status !== 'published'
                                ? 'opacity-40 cursor-not-allowed text-zinc-400'
                                : evt.attendanceEnabled
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
                            }`}
                            title="Habilitar o pausar asistencia de aprendices"
                          >
                            {evt.attendanceEnabled ? 'Pausar Asist.' : 'Habilitar Asist.'}
                          </button>

                          {/* 3. Editar Evento */}
                          <button
                            disabled={isClosed}
                            onClick={() => onOpenModal(evt)}
                            className={`btn-tactile p-1 rounded text-zinc-600 hover:text-zinc-950 hover:bg-white transition-colors ${
                              isClosed ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                            title="Editar evento"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* 4. Cerrar Evento */}
                          <button
                            disabled={isClosed}
                            onClick={() => {
                              if (window.confirm(`¿Confirmas cerrar definitivamente el evento "${evt.title}"?`)) {
                                closeEvent(evt.id);
                              }
                            }}
                            className={`btn-tactile p-1 rounded transition-colors ${
                              isClosed
                                ? 'text-zinc-300 cursor-not-allowed'
                                : 'text-zinc-400 hover:text-rose-600 hover:bg-white'
                            }`}
                            title={isClosed ? 'Evento cerrado' : 'Cerrar evento y congelar métricas'}
                          >
                            <Lock className="w-3.5 h-3.5" />
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
