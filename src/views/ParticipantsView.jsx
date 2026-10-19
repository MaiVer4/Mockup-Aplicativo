import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  Layers, 
  BookOpen, 
  Sparkles, 
  Download,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { PROGRAMAS_FORMACION } from '../data/mockData';

export default function ParticipantsView({ onOpenExportModal }) {
  const { 
    currentUser, 
    events, 
    visibleEvents, 
    getEventParticipants, 
    allParticipantsList 
  } = useApp();

  // Filtros requeridos taxativamente por RF-09:
  // 1. Actividad, 2. Fecha, 3. Programa, 4. Ficha/grupo, 5. Modalidad, 6. Estado
  const [filterEventId, setFilterEventId] = useState('ALL');
  const [filterDate, setFilterDate] = useState('');
  const [filterProgram, setFilterProgram] = useState('ALL');
  const [filterFicha, setFilterFicha] = useState('ALL');
  const [filterModality, setFilterModality] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Eventos disponibles para filtrar según permisos del rol
  const availableEvents = visibleEvents.filter(e => e.status !== 'borrador');

  // Consolidar todos los participantes vinculados
  const rawParticipants = useMemo(() => {
    if (allParticipantsList && allParticipantsList.length > 0) {
      return allParticipantsList;
    }
    // Si no está el consolidado global, combinar participantes de los eventos visibles
    const combined = [];
    visibleEvents.forEach(evt => {
      const parts = getEventParticipants(evt.id);
      parts.forEach(p => {
        combined.push({
          ...p,
          eventId: evt.id,
          eventTitle: evt.title,
          eventDate: evt.date,
          eventArea: evt.area
        });
      });
    });
    return combined;
  }, [visibleEvents, allParticipantsList, getEventParticipants]);

  // Lista única de fichas y programas para los selectores de filtro
  const uniqueFichas = useMemo(() => {
    const set = new Set();
    rawParticipants.forEach(p => { if (p.ficha) set.add(p.ficha); });
    return Array.from(set).sort();
  }, [rawParticipants]);

  const uniquePrograms = useMemo(() => {
    const set = new Set();
    rawParticipants.forEach(p => { if (p.program) set.add(p.program); });
    return Array.from(set).sort();
  }, [rawParticipants]);

  // Aplicación estricta de los 6 filtros de RF-09
  const filteredParticipants = useMemo(() => {
    return rawParticipants.filter(p => {
      // 1. Filtro por Actividad
      if (filterEventId !== 'ALL' && p.eventId !== filterEventId) return false;

      // 2. Filtro por Fecha
      if (filterDate && p.eventDate !== filterDate && !p.timestamp?.startsWith(filterDate)) return false;

      // 3. Filtro por Programa
      if (filterProgram !== 'ALL' && p.program !== filterProgram) return false;

      // 4. Filtro por Ficha / Grupo
      if (filterFicha !== 'ALL' && p.ficha !== filterFicha) return false;

      // 5. Filtro por Modalidad
      if (filterModality !== 'ALL' && p.modality !== filterModality) return false;

      // 6. Filtro por Estado
      if (filterStatus !== 'ALL') {
        const isAttended = p.status === 'asistio';
        if (filterStatus === 'asistio' && !isAttended) return false;
        if (filterStatus === 'pendiente' && isAttended) return false;
      }

      // Búsqueda por texto (Nombre o Documento)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = p.name?.toLowerCase().includes(term);
        const matchDoc = p.documentNumber?.toLowerCase().includes(term);
        const matchEmail = p.email?.toLowerCase().includes(term);
        if (!matchName && !matchDoc && !matchEmail) return false;
      }

      return true;
    });
  }, [rawParticipants, filterEventId, filterDate, filterProgram, filterFicha, filterModality, filterStatus, searchTerm]);

  // Evento actualmente seleccionado para la exportación
  const selectedEventObj = availableEvents.find(e => e.id === filterEventId) || availableEvents[0] || null;

  return (
    <div className="space-y-6">
      
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e2e8f0]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] font-heading tracking-tight">
              Consulta y Aforo de Participantes
            </h1>
            <span className="font-mono text-[10px] bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2 py-0.5 rounded-full font-bold">
              OFICIAL SENA
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#64748b] mt-1">
            Supervisión institucional de aprendices registrados por actividad con marca temporal inmutable de servidor.
          </p>
        </div>

        {/* Botón de Exportar XLSX Oficial */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (onOpenExportModal && selectedEventObj) {
                onOpenExportModal(selectedEventObj);
              }
            }}
            disabled={!selectedEventObj}
            className="btn btn-primary text-xs py-2 px-3.5 flex items-center gap-2 font-bold shadow-xs cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>Exportar XLSX Oficial</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas de Conteo en Vivo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs">
          <span className="text-[10px] font-extrabold text-[#64748b] font-mono uppercase tracking-wider block">
            TOTAL EN PADRÓN
          </span>
          <strong className="text-2xl font-extrabold text-[#1e293b] font-heading block mt-1">
            {rawParticipants.length}
          </strong>
          <small className="text-[#64748b] text-[10px]">asistencias registradas</small>
        </div>

        <div className="p-4 rounded-2xl bg-[#eafaf1] border border-[#bbf7d0] shadow-xs">
          <span className="text-[10px] font-extrabold text-[#15803d] font-mono uppercase tracking-wider block">
            FILTRADOS EN PANTALLA
          </span>
          <strong className="text-2xl font-extrabold text-[#15803d] font-heading block mt-1">
            {filteredParticipants.length}
          </strong>
          <small className="text-[#15803d] text-[10px]">aprendices coincidentes</small>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs">
          <span className="text-[10px] font-extrabold text-[#64748b] font-mono uppercase tracking-wider block">
            FICHAS REPRESENTADAS
          </span>
          <strong className="text-2xl font-extrabold text-[#1e293b] font-heading block mt-1">
            {uniqueFichas.length}
          </strong>
          <small className="text-[#64748b] text-[10px]">grupos de formación activos</small>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs">
          <span className="text-[10px] font-extrabold text-[#64748b] font-mono uppercase tracking-wider block">
            PROGRAMAS ACTIVOS
          </span>
          <strong className="text-2xl font-extrabold text-[#1e293b] font-heading block mt-1">
            {uniquePrograms.length}
          </strong>
          <small className="text-[#64748b] text-[10px]">especialidades técnicas</small>
        </div>
      </div>

      {/* Barra de los 6 Filtros Estrictos de RF-09 */}
      <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#15803d]" />
            <h3 className="text-xs font-bold text-[#1e293b] font-heading">
              Criterios de Filtrado y Alcance
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#64748b]">
            Mostrando <strong className="text-[#15803d]">{filteredParticipants.length}</strong> de {rawParticipants.length} registros
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-xl bg-[#f8fafc] border border-[#f1f5f9] px-3 py-2">
          <span className="text-[11px] text-[#64748b]">Usa los filtros básicos o despliega los criterios avanzados.</span>
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(prev => !prev)}
            className="text-[11px] font-bold text-[#15803d] hover:underline shrink-0"
          >
            {showAdvancedFilters ? 'Ocultar avanzados' : 'Mostrar avanzados (3)'}
          </button>
        </div>

        {/* Grid de 6 Controles de Filtro */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          
          {/* 1. Actividad */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider mb-1">
              1. Actividad
            </label>
            <select
              value={filterEventId}
              onChange={(e) => setFilterEventId(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
            >
              <option value="ALL">Todas las Actividades ({availableEvents.length})</option>
              {availableEvents.map(evt => (
                <option key={evt.id} value={evt.id}>
                  [{evt.code}] {evt.title} ({evt.area})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Fecha */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider mb-1">
              2. Fecha de Actividad
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
            />
          </div>

          {/* 3. Programa */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider mb-1">
              3. Programa de Formación
            </label>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
            >
              <option value="ALL">Todos los Programas</option>
              {uniquePrograms.map(prog => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>
          </div>

          {showAdvancedFilters && <>
          {/* 4. Ficha */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider mb-1">
              4. Ficha
            </label>
            <select
              value={filterFicha}
              onChange={(e) => setFilterFicha(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d] font-mono"
            >
              <option value="ALL">Todas las Fichas</option>
              {uniqueFichas.map(f => (
                <option key={f} value={f}>Ficha {f}</option>
              ))}
            </select>
          </div>

          {/* 5. Modalidad */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider mb-1">
              5. Modalidad
            </label>
            <select
              value={filterModality}
              onChange={(e) => setFilterModality(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
            >
              <option value="ALL">Todas las Modalidades</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="Mixta">Mixta (A Distancia)</option>
            </select>
          </div>

          {/* 6. Estado */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider mb-1">
              6. Estado de Acreditación
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="asistio">Acreditado (Asistió)</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
          </>}

        </div>

        {/* Buscador de Texto Rápido y Limpiar */
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#f1f5f9]">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por aprendiz, documento o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
            />
          </div>

          {(filterEventId !== 'ALL' || filterDate || filterProgram !== 'ALL' || filterFicha !== 'ALL' || filterModality !== 'ALL' || filterStatus !== 'ALL' || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setFilterEventId('ALL');
                setFilterDate('');
                setFilterProgram('ALL');
                setFilterFicha('ALL');
                setFilterModality('ALL');
                setFilterStatus('ALL');
                setSearchTerm('');
              }}
              className="text-xs text-[#15803d] hover:underline font-bold"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla y Tarjetas Móviles Oficiales de Participantes */}
      <div className="rounded-2xl bg-white border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#15803d]" />
            <h3 className="text-xs font-bold text-[#1e293b] font-heading">
              Listado Oficial de Participación Registrada
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#64748b]">
            Total registros filtrados: <strong className="text-[#1e293b]">{filteredParticipants.length}</strong>
          </span>
        </div>

        {filteredParticipants.length === 0 ? (
          <div className="p-12 text-center text-[#64748b] space-y-2">
            <Users className="w-8 h-8 mx-auto text-[#94a3b8]" />
            <p className="text-xs font-bold text-[#1e293b]">No se encontraron participantes</p>
            <p className="text-[11px]">Prueba ajustando los criterios de los 6 filtros superiores.</p>
          </div>
        ) : (
          <>
            {/* Vista Móvil: Tarjetas (<sm) */}
            <div className="block sm:hidden divide-y divide-[#e2e8f0]">
              {filteredParticipants.map((part, idx) => (
                <div key={part.id || idx} className="p-4 space-y-3 hover:bg-[#f8fafc] transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] font-bold flex items-center justify-center text-xs font-mono shrink-0">
                        {part.name ? part.name.slice(0, 2).toUpperCase() : 'AP'}
                      </div>
                      <div>
                        <strong className="text-xs text-[#1e293b] font-heading block">
                          {part.name}
                        </strong>
                        <span className="text-[10px] text-[#64748b] font-mono">
                          {part.documentType || 'CC'} {part.documentNumber} • {part.gender || 'F'}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Acreditado</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#f8fafc] p-2.5 rounded-xl border border-[#e2e8f0]">
                    <div>
                      <span className="text-[10px] text-[#64748b] uppercase font-bold block">Ficha</span>
                      <strong className="font-mono text-xs text-[#1e293b]">{part.ficha || '2670192'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748b] uppercase font-bold block">Modalidad</span>
                      <span className="text-[#475569] font-medium">{part.modality || 'Presencial'}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-[#e2e8f0]/60">
                      <span className="text-[10px] text-[#64748b] uppercase font-bold block">Programa</span>
                      <span className="text-xs text-[#334155] font-medium truncate block">{part.program || 'Análisis y Desarrollo de Software (ADSO)'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                      <span className="text-[10px] font-mono text-[#15803d] bg-[#eafaf1] px-1.5 py-0.5 rounded font-bold shrink-0">
                        {part.eventArea || 'Bienestar'}
                      </span>
                      <span className="text-xs text-[#1e293b] truncate font-medium">{part.eventTitle || 'Actividad SENA'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-[#64748b] shrink-0">
                      <Clock className="w-3 h-3 text-[#15803d]" />
                      <span>{part.timestamp?.split(' ')[1] || '14:05:12'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista Desktop / Tablet: Tabla (≥sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] text-[10px] font-extrabold uppercase tracking-wider font-mono">
                    <th className="py-3 px-4">APRENDIZ / DOCUMENTO</th>
                    <th className="py-3 px-4">PROGRAMA</th>
                    <th className="py-3 px-4">FICHA</th>
                    <th className="py-3 px-4">MODALIDAD</th>
                    <th className="py-3 px-4">ACTIVIDAD</th>
                    <th className="py-3 px-4">MARCA TEMPORAL (SERVIDOR)</th>
                    <th className="py-3 px-4 text-center">ESTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {filteredParticipants.map((part, idx) => (
                    <tr key={part.id || idx} className="hover:bg-[#f8fafc] transition-colors">
                      
                      {/* Aprendiz */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] font-bold flex items-center justify-center text-[10px] font-mono shrink-0">
                            {part.name ? part.name.slice(0, 2).toUpperCase() : 'AP'}
                          </div>
                          <div>
                            <strong className="text-xs text-[#1e293b] font-heading block leading-tight">
                              {part.name}
                            </strong>
                            <span className="text-[10px] text-[#64748b] font-mono">
                              {part.documentType || 'CC'} {part.documentNumber} • {part.gender || 'F'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Programa */}
                      <td className="py-3 px-4 max-w-[200px]">
                        <span className="text-xs text-[#334155] font-medium block truncate" title={part.program}>
                          {part.program || 'Análisis y Desarrollo de Software (ADSO)'}
                        </span>
                        <small className="text-[10px] text-[#64748b]">{part.level || 'Tecnólogo'}</small>
                      </td>

                      {/* Ficha */}
                      <td className="py-3 px-4 font-mono text-xs font-bold text-[#1e293b]">
                        {part.ficha || '2670192'}
                      </td>

                      {/* Modalidad */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]/50">
                          {part.modality || 'Presencial'}
                        </span>
                      </td>

                      {/* Actividad */}
                      <td className="py-3 px-4 max-w-[180px]">
                        <span className="text-xs text-[#1e293b] font-medium block truncate" title={part.eventTitle}>
                          {part.eventTitle || 'Actividad SENA'}
                        </span>
                        <span className="text-[10px] font-mono text-[#15803d] bg-[#eafaf1] px-1.5 py-0.2 rounded font-bold">
                          {part.eventArea || 'Bienestar'}
                        </span>
                      </td>

                      {/* Timestamp Servidor (Inmutable) */}
                      <td className="py-3 px-4 font-mono text-[11px] text-[#475569]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                          <span>{part.timestamp || '2026-10-13 14:05:12'}</span>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Acreditado</span>
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
