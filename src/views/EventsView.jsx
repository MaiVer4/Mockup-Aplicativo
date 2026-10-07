import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Radio, 
  Edit3, 
  Lock, 
  Share2, 
  Music, 
  Trophy,
  Filter
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
      evt.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea === 'ALL' || evt.area === filterArea;
    const matchesStatus = filterStatus === 'ALL' || evt.status === filterStatus;
    return matchesSearch && matchesArea && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Gestión y Catálogo de Eventos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cada evento cuenta con título, propósito, imagen representativa y los 4 controles operativos.
          </p>
        </div>

        <button
          onClick={() => onOpenModal(null)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Crear Evento</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por título o propósito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin_general' && (
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="ALL">Todas las Áreas</option>
              {AREAS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          )}

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
            <option value="closed">Cerrados</option>
          </select>
        </div>
      </div>

      {/* Grid de Tarjetas de Eventos */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-sm font-medium">No hay eventos para mostrar con los filtros actuales.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(evt => {
            const isMusic = evt.area === 'Música';
            const isClosed = evt.status === 'closed';
            const pct = Math.min(100, Math.round((evt.attendeesCount / (evt.capacity || 50)) * 100));

            return (
              <div 
                key={evt.id} 
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
              >
                {/* Imagen del Evento */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  {/* Badge de Área */}
                  <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border shadow-sm ${
                    isMusic
                      ? 'bg-purple-900/80 text-purple-200 border-purple-400/30'
                      : 'bg-emerald-900/80 text-emerald-200 border-emerald-400/30'
                  }`}>
                    {isMusic ? <Music className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5" />}
                    {evt.area}
                  </span>

                  {/* Badge de Estado */}
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md border shadow-sm ${
                    evt.status === 'published'
                      ? 'bg-emerald-500/90 text-white border-emerald-400'
                      : evt.status === 'draft'
                      ? 'bg-slate-800/90 text-slate-200 border-slate-600'
                      : 'bg-rose-600/90 text-white border-rose-500'
                  }`}>
                    {evt.status === 'published' ? '● Publicado' : evt.status === 'draft' ? '○ Borrador' : '🔒 Cerrado'}
                  </span>

                  {/* Indicador de Asistencia Abierta */}
                  {evt.attendanceEnabled && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/95 text-slate-950 text-[11px] font-extrabold shadow-md">
                      <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                      Asistencia Habilitada
                    </div>
                  )}

                  {/* Contador de Asistentes en la Foto */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-mono font-bold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{evt.attendeesCount} / {evt.capacity}</span>
                  </div>
                </div>

                {/* Contenido: Título, Propósito y Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-snug tracking-tight">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {evt.purpose}
                    </p>
                  </div>

                  {/* Metadata de Fecha, Lugar y Horario */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.date}</span>
                      <span className="text-slate-300">•</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{evt.location}</span>
                    </div>

                    {/* Barra de Progreso de Asistencia */}
                    <div className="pt-1.5">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Aforo cubierto:</span>
                        <span className="font-bold text-slate-800">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Los 4 Botones de Acción del Evento Solicitados */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Botón 1: Publicar / Despublicar */}
                      <button
                        disabled={isClosed}
                        onClick={() => togglePublishEvent(evt.id)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isClosed
                            ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                            : evt.status === 'published'
                            ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/25'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{evt.status === 'published' ? 'Despublicar' : 'Publicar Evento'}</span>
                      </button>

                      {/* Botón 2: Habilitar Asistencia */}
                      <button
                        disabled={isClosed || evt.status !== 'published'}
                        onClick={() => toggleAttendance(evt.id)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isClosed || evt.status !== 'published'
                            ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                            : evt.attendanceEnabled
                            ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-600/25'
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                        }`}
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>{evt.attendanceEnabled ? 'Pausar Asist.' : 'Habilitar Asist.'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Botón 3: Editar Evento */}
                      <button
                        disabled={isClosed}
                        onClick={() => onOpenModal(evt)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 ${
                          isClosed ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Editar Evento</span>
                      </button>

                      {/* Botón 4: Cerrar Evento */}
                      <button
                        disabled={isClosed}
                        onClick={() => {
                          if (window.confirm(`¿Confirmas cerrar definitivamente el evento "${evt.title}"?`)) {
                            closeEvent(evt.id);
                          }
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                          isClosed
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5 text-rose-500" />
                        <span>{isClosed ? 'Cerrado' : 'Cerrar Evento'}</span>
                      </button>
                    </div>
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
