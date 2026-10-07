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
  Music, 
  Trophy,
  BookOpen,
  Award,
  Building2
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
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Cabecera Académica */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/90 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0b1e38] text-amber-300 border border-amber-400/30">
              Catálogo Oficial de Extensión
            </span>
            <span className="text-xs text-slate-400">• Fichas Curriculares</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0b1e38] tracking-tight">
            Catálogo de Convocatorias y Eventos
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Cada ficha curricular formal contiene título, propósito pedagógico e imagen temática, junto con los 4 controles operativos institucionales.
          </p>
        </div>

        <button
          onClick={() => onOpenModal(null)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0b1e38] text-amber-300 hover:bg-[#143156] border border-amber-400/40 shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Registrar Convocatoria</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por código (ej. MUS-2026), título o propósito formativo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin_general' && (
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <option value="ALL">Todos los Departamentos</option>
              {AREAS.map(a => (
                <option key={a} value={a}>Depto. de {a}</option>
              ))}
            </select>
          )}

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="published">Convocatorias Publicadas</option>
            <option value="draft">Borradores Curriculares</option>
            <option value="closed">Actas Cerradas</option>
          </select>
        </div>
      </div>

      {/* Grid de Fichas Académicas */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-sm font-medium">No se encontraron fichas curriculares con los filtros seleccionados.</p>
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
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  {/* Imagen y Sellos Institucionales */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061325]/85 via-black/20 to-transparent" />

                    {/* Sello de Departamento y Código */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold backdrop-blur-md border shadow-sm ${
                        isMusic
                          ? 'bg-[#0b1e38]/90 text-amber-200 border-amber-400/30'
                          : 'bg-[#064e3b]/90 text-emerald-100 border-emerald-400/30'
                      }`}>
                        {isMusic ? <Music className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
                        {evt.area}
                      </span>

                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-slate-200 border border-white/20">
                        {evt.code || 'ACT-2026'}
                      </span>
                    </div>

                    {/* Badge de Estado */}
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold backdrop-blur-md border shadow-sm uppercase tracking-wider ${
                      evt.status === 'published'
                        ? 'bg-emerald-700/95 text-white border-emerald-400'
                        : evt.status === 'draft'
                        ? 'bg-slate-800/95 text-slate-200 border-slate-600'
                        : 'bg-rose-800/95 text-white border-rose-500'
                    }`}>
                      {evt.status === 'published' ? '● Publicado' : evt.status === 'draft' ? '○ Borrador' : '🔒 Cerrado'}
                    </span>

                    {/* Indicador de Asistencia Abierta */}
                    {evt.attendanceEnabled && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                        <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                        Libro de Asistencia Abierto
                      </div>
                    )}

                    {/* Quórum en la Foto */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{evt.attendeesCount} / {evt.capacity}</span>
                    </div>
                  </div>

                  {/* Cuerpo Curricular */}
                  <div className="p-5 space-y-3.5">
                    <div>
                      <h3 className="font-serif font-bold text-[#0b1e38] text-lg leading-snug tracking-tight">
                        {evt.title}
                      </h3>
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-0.5">
                          Propósito Pedagógico y Formativo:
                        </span>
                        <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                          {evt.purpose}
                        </p>
                      </div>
                    </div>

                    {/* Metadatos de Horario, Aula y Aforo */}
                    <div className="space-y-1.5 pt-1 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{evt.date}</span>
                        <span className="text-slate-300">•</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{evt.location}</span>
                      </div>

                      {/* Progreso de Aforo */}
                      <div className="pt-1.5">
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Aforo cubierto:</span>
                          <span className="font-bold text-[#0b1e38]">{pct}% ({evt.attendeesCount} de {evt.capacity})</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-600 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Los 4 Botones Operativos con Estilo Institucional */}
                <div className="p-5 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Botón 1: Publicar / Despublicar */}
                    <button
                      disabled={isClosed}
                      onClick={() => togglePublishEvent(evt.id)}
                      className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isClosed
                          ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                          : evt.status === 'published'
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                          : 'bg-[#0b1e38] text-amber-300 hover:bg-[#143156] border border-amber-400/40 shadow-sm'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{evt.status === 'published' ? 'Despublicar' : 'Publicar'}</span>
                    </button>

                    {/* Botón 2: Habilitar Asistencia */}
                    <button
                      disabled={isClosed || evt.status !== 'published'}
                      onClick={() => toggleAttendance(evt.id)}
                      className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isClosed || evt.status !== 'published'
                          ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                          : evt.attendanceEnabled
                          ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
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
                      className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 ${
                        isClosed ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Editar Ficha</span>
                    </button>

                    {/* Botón 4: Cerrar Evento */}
                    <button
                      disabled={isClosed}
                      onClick={() => {
                        if (window.confirm(`¿Confirmas cerrar definitivamente el acta del evento "${evt.title}"?`)) {
                          closeEvent(evt.id);
                        }
                      }}
                      className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                        isClosed
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'border border-rose-200 text-rose-800 hover:bg-rose-50'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5 text-rose-600" />
                      <span>{isClosed ? 'Acta Cerrada' : 'Cerrar Acta'}</span>
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
