import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit3, 
  Lock, 
  Radio, 
  CheckCircle2
} from 'lucide-react';
import { AREAS } from '../data/mockData';

export default function EventsView({ onOpenModal }) {
  const { 
    currentUser, 
    visibleEvents, 
    togglePublishEvent, 
    toggleAttendance, 
    closeEvent 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

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
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              CATÁLOGO // OPERACIONAL
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <span className="font-mono text-[10px] text-zinc-600 font-medium">{filtered.length} ACTIVOS</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">
            Catálogo de Eventos
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cada registro contiene título, propósito, imagen temática y los 4 controles de ciclo de vida.
          </p>
        </div>

        <button
          onClick={() => onOpenModal(null)}
          className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-950 text-white hover:bg-zinc-800 transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Evento</span>
        </button>
      </div>

      {/* Barra de Filtros Minimalista */}
      <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por código, título o propósito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-zinc-900 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin_general' && (
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 bg-white focus:outline-none focus:border-zinc-900"
            >
              <option value="ALL">Todas las Áreas</option>
              {AREAS.map(a => (
                <option key={a} value={a}>Área: {a}</option>
              ))}
            </select>
          )}

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 bg-white focus:outline-none focus:border-zinc-900"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
            <option value="closed">Cerrados</option>
          </select>
        </div>
      </div>

      {/* Grid de Tarjetas Minimalistas */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-zinc-200">
          <p className="text-zinc-400 text-xs font-mono">No se encontraron eventos coincidentes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(evt => {
            const isClosed = evt.status === 'closed';
            const pct = Math.min(100, Math.round((evt.attendeesCount / (evt.capacity || 50)) * 100));

            return (
              <div 
                key={evt.id} 
                className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-zinc-300 transition-all group"
              >
                <div>
                  {/* Imagen del Evento */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                    {/* Metadata en la Imagen */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {evt.area}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-zinc-300">
                        {evt.code || 'EVT'}
                      </span>
                    </div>

                    {/* Estado en la Imagen */}
                    <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium backdrop-blur-md ${
                      evt.status === 'published'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : evt.status === 'draft'
                        ? 'bg-zinc-900/80 text-zinc-300 border border-zinc-700'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                    }`}>
                      {evt.status === 'published' ? '● PUBLICADO' : evt.status === 'draft' ? '○ BORRADOR' : '■ CERRADO'}
                    </span>

                    {/* Badge de Asistencia Habilitada */}
                    {evt.attendanceEnabled && (
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400 text-zinc-950 text-[10px] font-bold font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-ping" />
                        CHECK-IN ABIERTO
                      </div>
                    )}

                    {/* Contador de Asistentes */}
                    <div className="absolute bottom-2.5 right-2.5 font-mono text-[10px] px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white flex items-center gap-1">
                      <Users className="w-3 h-3 text-zinc-300" />
                      <span>{evt.attendeesCount}/{evt.capacity}</span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-zinc-900 text-sm leading-snug tracking-tight">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                        {evt.purpose}
                      </p>
                    </div>

                    {/* Metadatos */}
                    <div className="pt-2 border-t border-zinc-100 text-xs text-zinc-500 space-y-1">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        <span>{evt.date}</span>
                        <span className="text-zinc-300">•</span>
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 truncate">
                        <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>

                      {/* Barra de Quórum */}
                      <div className="pt-1">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-0.5">
                          <span>Aforo cubierto:</span>
                          <span className="font-bold text-zinc-700">{pct}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Los 4 Botones Operativos */}
                <div className="p-4 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    {/* Botón 1: Publicar / Despublicar */}
                    <button
                      disabled={isClosed}
                      onClick={() => togglePublishEvent(evt.id)}
                      className={`btn-tactile w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-all text-center ${
                        isClosed
                          ? 'opacity-40 cursor-not-allowed text-zinc-400 bg-zinc-50'
                          : evt.status === 'published'
                          ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200'
                          : 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-xs'
                      }`}
                    >
                      {evt.status === 'published' ? 'Despublicar' : 'Publicar'}
                    </button>

                    {/* Botón 2: Habilitar Asistencia */}
                    <button
                      disabled={isClosed || evt.status !== 'published'}
                      onClick={() => toggleAttendance(evt.id)}
                      className={`btn-tactile w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-all text-center ${
                        isClosed || evt.status !== 'published'
                          ? 'opacity-40 cursor-not-allowed text-zinc-400 bg-zinc-50'
                          : evt.attendanceEnabled
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      {evt.attendanceEnabled ? 'Pausar Asist.' : 'Habilitar Asist.'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {/* Botón 3: Editar Evento */}
                    <button
                      disabled={isClosed}
                      onClick={() => onOpenModal(evt)}
                      className={`btn-tactile w-full py-1.5 px-2 rounded-lg text-xs font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-1 ${
                        isClosed ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    >
                      <Edit3 className="w-3 h-3 text-zinc-400" />
                      <span>Editar</span>
                    </button>

                    {/* Botón 4: Cerrar Evento */}
                    <button
                      disabled={isClosed}
                      onClick={() => {
                        if (window.confirm(`¿Confirmas cerrar definitivamente el evento "${evt.title}"?`)) {
                          closeEvent(evt.id);
                        }
                      }}
                      className={`btn-tactile w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                        isClosed
                          ? 'bg-zinc-50 text-zinc-400 cursor-not-allowed border border-transparent'
                          : 'border border-zinc-200 text-zinc-600 hover:text-rose-600 hover:border-rose-200'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>{isClosed ? 'Cerrado' : 'Cerrar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
