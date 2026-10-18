import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter, 
  Award, 
  Heart, 
  Dumbbell, 
  Palette, 
  Brain, 
  Wallet,
  ArrowRight,
  X,
  Check,
  UserCheck
} from 'lucide-react';
import EventDetailModal from '../components/EventDetailModal';

export default function ApprenticePortal() {
  const { 
    currentUser, 
    visibleEvents, 
    events, 
    registerAttendance, 
    activeTab, 
    setActiveTab,
    addToast 
  } = useApp();

  const [currentSection, setCurrentSection] = useState('billboard'); // 'billboard' | 'profile'
  const [filterArea, setFilterArea] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);

  // Filtrar eventos publicados o en curso (los visibles para el aprendiz)
  const availableEvents = visibleEvents.filter(e => e.status !== 'borrador');

  const filteredEvents = availableEvents.filter(evt => {
    const matchesSearch = searchQuery === '' || 
      evt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesArea = filterArea === 'ALL' || evt.area === filterArea;
    return matchesSearch && matchesArea;
  });

  // Configuración de las 6 Áreas de Bienestar con tonos suaves y descansados
  const stitchAreas = [
    { name: 'Actividad Física', label: 'Deporte y Recreación', icon: Dumbbell, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { name: 'Prevención', label: 'Salud Integral', icon: Heart, color: 'text-sky-700', bg: 'bg-sky-50' },
    { name: 'Cultura', label: 'Cultura y Arte', icon: Palette, color: 'text-amber-700', bg: 'bg-amber-50' },
    { name: 'Habilidades', label: 'Apoyo Psicosocial', icon: Brain, color: 'text-teal-700', bg: 'bg-teal-50' },
    { name: 'Liderazgo', label: 'Liderazgo y Mentoría', icon: Award, color: 'text-cyan-700', bg: 'bg-cyan-50' },
    { name: 'Arte', label: 'Apoyos Económicos', icon: Wallet, color: 'text-purple-700', bg: 'bg-purple-50' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* 1. Header Secundario del Aprendiz: Navegación de Pestañas ergonómica */}
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <button
            type="button"
            onClick={() => setCurrentSection('billboard')}
            className={`text-xs md:text-sm font-heading font-bold transition-all relative py-2 whitespace-nowrap ${
              currentSection === 'billboard'
                ? 'text-[#15803d] border-b-2 border-[#15803d]'
                : 'text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            Eventos de hoy
          </button>

          <button
            type="button"
            onClick={() => setCurrentSection('profile')}
            className={`text-xs md:text-sm font-heading font-bold transition-all relative py-2 whitespace-nowrap ${
              currentSection === 'profile'
                ? 'text-[#15803d] border-b-2 border-[#15803d]'
                : 'text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            Mi Perfil
          </button>
        </div>

        <div className="text-[11px] text-[#64748b] font-medium hidden md:block shrink-0">
          Regional Distrito Capital • Complejo Paloquemao
        </div>
      </div>

      {/* SECCIÓN 1: CARTELERA Y EXPERIENCIA PRINCIPAL */}
      {currentSection === 'billboard' && (
        <div className="space-y-6">
          
          {/* Banner de Bienvenida Institucional Ergonómico (verde petróleo cálido) */}
          <div className="rounded-3xl bg-gradient-to-r from-[#0c2f39] via-[#103a46] to-[#08262f] text-white p-5 sm:p-7 md:p-9 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-lg border border-[#1a4a58]">
            
            <div className="relative z-10 max-w-lg space-y-1.5 sm:space-y-2">
              <span className="text-[10px] font-extrabold tracking-[1.8px] text-[#c4f246] uppercase font-mono">
                VIERNES, 14 DE MARZO DE 2026
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight">
                Hay experiencias esperando por ti.
              </h1>
              <p className="text-xs md:text-sm text-[#bfd3df] leading-relaxed">
                Explora las actividades de Bienestar al Aprendiz y acredita tu asistencia presencial en 1 clic.
              </p>
            </div>

            {/* Tarjeta de Calendario Flotante con contraste suave */}
            <div className="relative z-10 w-20 h-24 sm:w-24 sm:h-28 bg-[#f8fafc] border border-[#cbd5e1] rounded-2xl text-[#1e293b] flex flex-col items-center justify-center shadow-lg shrink-0 self-end sm:self-auto">
              <small className="text-[#15803d] text-[10px] font-extrabold tracking-wider">MAR</small>
              <strong className="text-3xl sm:text-4xl font-extrabold font-heading leading-tight text-[#1e293b]">14</strong>
              <span className="text-[9px] text-[#64748b] font-semibold">Viernes</span>
            </div>

            {/* Círculo visual decorativo suave */}
            <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full border-[50px] border-white/[0.03] pointer-events-none" />
          </div>

          {/* Grid / Carrusel táctil de 6 Áreas de Bienestar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-heading font-bold text-[#1e293b]">
                Áreas de Bienestar al Aprendiz
              </strong>
              {filterArea !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setFilterArea('ALL')}
                  className="text-xs text-[#15803d] font-bold hover:underline"
                >
                  Ver todas
                </button>
              )}
            </div>

            {/* En móvil: carrusel swipe horizontal táctil. En sm+: rejilla 3 a 6 columnas */}
            <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2.5 overflow-x-auto pb-2 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0 no-scrollbar scroll-smooth">
              {stitchAreas.map((areaItem) => {
                const IconComponent = areaItem.icon;
                const isSelected = filterArea === areaItem.name;

                return (
                  <button
                    key={areaItem.name}
                    type="button"
                    onClick={() => setFilterArea(isSelected ? 'ALL' : areaItem.name)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 shrink-0 sm:shrink w-[130px] sm:w-auto group ${
                      isSelected 
                        ? 'border-[#15803d] bg-white ring-2 ring-[#15803d]/30 shadow-xs' 
                        : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:shadow-2xs'
                    }`}
                  >
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${areaItem.bg} ${areaItem.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#1e293b] leading-tight line-clamp-2">
                      {areaItem.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid de Actividades Programadas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-sm font-heading font-bold text-[#1e293b]">
                  Eventos disponibles hoy
                </strong>
                <span className="text-xs text-[#64748b] ml-2">
                  ({filteredEvents.length} actividades programadas)
                </span>
              </div>
              <div className="text-xs text-[#64748b]">
                <span className="text-[#15803d] font-bold">24°</span> Jornada agradable
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#e2e8f0] space-y-2">
                <Calendar className="w-8 h-8 text-[#94a3b8] mx-auto stroke-1" />
                <p className="text-xs font-bold text-[#1e293b]">No hay actividades en esta área para hoy</p>
                <button
                  type="button"
                  onClick={() => setFilterArea('ALL')}
                  className="text-xs text-[#15803d] font-bold hover:underline"
                >
                  Ver todas las áreas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredEvents.map(evt => {
                  const hasAttended = evt.attendedByUserIds?.includes(currentUser.id);
                  const isInProgress = evt.status === 'en_curso';
                  const isFinished = evt.status === 'finalizado';

                  return (
                    <article 
                      key={evt.id}
                      className="grid grid-cols-1 sm:grid-cols-[43%_57%] card-ergonomic overflow-hidden min-h-[300px]"
                    >
                      {/* Portada a la izquierda con Time Chip */}
                      <div
                        onClick={() => setSelectedEventForDetail(evt)}
                        className="relative min-h-[180px] sm:min-h-full bg-[#f8fafc] cursor-pointer group overflow-hidden"
                      >
                        {evt.image ? (
                          <img 
                            src={evt.image} 
                            alt={evt.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full min-h-[180px] bg-gradient-to-br from-[#0c2f39] via-[#103a46] to-[#08262f] flex flex-col items-center justify-center p-4 text-center">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-2">
                              <Sparkles className="w-5 h-5 text-[#c4f246]" />
                            </div>
                            <span className="text-[11px] font-bold text-white/90 leading-snug">
                              Bienestar al Aprendiz
                            </span>
                            <span className="text-[9px] text-[#bfd3df] mt-0.5">
                              Sin portada gráfica asignada
                            </span>
                          </div>
                        )}
                        {/* Area Badge */}
                        <span className="absolute top-3 left-3 bg-[#0e2738]/85 text-white backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-[9px] font-bold border border-white/10">
                          {evt.area}
                        </span>
                        {/* Time Chip flotante en la foto */}
                        <div className="absolute left-3 bottom-3 bg-white/95 text-[#1e293b] rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-md border border-[#cbd5e1]/60">
                          <Clock className="w-3.5 h-3.5 text-[#15803d]" />
                          <strong className="text-xs font-bold font-mono">
                            {evt.time?.split(' - ')[0] || evt.schedule?.split(' - ')[0] || '14:00'}
                          </strong>
                          <small className="text-[8px] text-[#64748b] font-semibold">horas</small>
                        </div>
                      </div>

                      {/* Cuerpo de la tarjeta */}
                      <div className="p-4 sm:p-5 min-w-0 flex flex-col justify-between space-y-3">
                        <div className="min-w-0">
                          <h3 className="font-heading font-extrabold text-[#1e293b] text-base leading-snug line-clamp-2">
                            {evt.title}
                          </h3>
                          <p className="text-[#475569] text-xs line-clamp-2 mt-1 leading-relaxed">
                            {evt.purpose}
                          </p>
                        </div>

                        {/* Ubicación */}
                        <div className="pt-2 border-t border-[#e2e8f0] flex items-center gap-2 text-[11px] text-[#64748b] min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>

                        {/* Avatares y aforo de asistentes */}
                        <div className="flex items-center justify-between gap-2 text-[11px] text-[#64748b]">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-6 h-6 rounded-full bg-[#eafaf1] text-[#15803d] border-2 border-white flex items-center justify-center font-bold text-[9px] shrink-0 shadow-2xs">
                              {evt.attendeesCount > 0 ? evt.attendeesCount : '0'}
                            </span>
                            <span className="truncate">{evt.attendeesCount || 0} de {evt.capacity || 60} cupos</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedEventForDetail(evt)}
                            className="text-[11px] font-bold text-[#15803d] hover:text-[#166534] flex items-center gap-0.5 shrink-0 cursor-pointer"
                          >
                            <span>Ficha</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Botón de Acción Presencial con jerarquía editorial y sin recorte de texto */}
                        <div className="pt-0.5">
                          {hasAttended ? (
                            <div className="w-full px-3 py-2 rounded-xl bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] flex items-center justify-between gap-2 shadow-2xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-6 h-6 rounded-lg bg-[#15803d] text-white flex items-center justify-center shrink-0">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-xs font-bold truncate">Asistencia Confirmada</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-white/90 border border-[#bbf7d0] text-[10px] font-mono font-extrabold text-[#15803d] shrink-0">
                                ACTA ✓
                              </span>
                            </div>
                          ) : isInProgress ? (
                            <button
                              type="button"
                              onClick={() => registerAttendance(evt.id)}
                              className="btn btn-primary w-full px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 group/cta shadow-xs"
                            >
                              <span className="w-6 h-6 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center shrink-0 group-hover/cta:bg-[#c4f246] group-hover/cta:text-[#0e2738] transition-colors">
                                <UserCheck className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-xs font-extrabold tracking-tight">
                                Confirmar Asistencia
                              </span>
                            </button>
                          ) : isFinished ? (
                            <div className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0] flex items-center justify-center gap-2">
                              <span>Actividad Finalizada</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedEventForDetail(evt)}
                              className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-[#f8fafc] hover:bg-[#f0f9ff] text-[#334155] hover:text-[#0369a1] border border-[#cbd5e1] hover:border-[#bae6fd] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <span className="w-6 h-6 rounded-lg bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center shrink-0">
                                  <Clock className="w-3.5 h-3.5" />
                                </span>
                                <span className="truncate">Programado · Al iniciar</span>
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                            </button>
                          )}
                        </div>

                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Consejo Institucional Ergonómico */}
          <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#15803d] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs font-heading font-bold text-[#14532d]">
                Tu asistencia cuenta
              </strong>
              <p className="text-[11px] text-[#166534] mt-0.5">
                Al confirmar tu asistencia presencial en 1 clic, dejas constancia oficial en el formato institucional GOR-F-013 con firma digital inmutable del servidor.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* SECCIÓN 2: CONFIGURACIÓN Y PERFIL INSTITUCIONAL (RF-01, RF-02) */}
      {currentSection === 'profile' && (
        <div className="p-6 card-ergonomic space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
            <div>
              <h2 className="text-base font-bold text-[#1e293b] font-heading">
                Perfil Institucional del Aprendiz
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Consulta y actualiza los datos oficiales de tu ficha y contacto.
              </p>
            </div>
            <span className="font-mono text-[10px] bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2.5 py-1 rounded-lg font-bold">
              INSTANTÁNEA HISTÓRICA ACTIVA
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-xs text-[#166534] leading-relaxed">
            <strong>Trazabilidad Institucional:</strong> Los cambios que realices en tu ficha o contacto aplicarán únicamente para futuras actividades. Las participaciones ya registradas en actas anteriores conservan su instantánea histórica inalterada.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">Nombre Completo</label>
              <input type="text" readOnly value={currentUser.name} className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f1f5f9] text-[#64748b] cursor-not-allowed" />
              <span className="text-[10px] text-[#94a3b8] mt-0.5 block">Vinculado a documento de identidad oficial.</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">Cédula / Documento</label>
              <input type="text" readOnly value={`${currentUser.documentType || 'CC'} ${currentUser.documentNumber || currentUser.username}`} className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f1f5f9] text-[#64748b] font-mono cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">Ficha de Formación</label>
              <input type="text" defaultValue={currentUser.ficha || '2670192'} className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] font-mono text-[#1e293b]" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">Teléfono de Contacto</label>
              <input type="tel" defaultValue={currentUser.phone || '3157849201'} className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-[#1e293b]" />
            </div>
          </div>

          <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#64748b]">
              Los cambios se reflejarán en próximas actividades
            </span>
            <button
              type="button"
              onClick={() => addToast('Perfil Actualizado', 'Se han guardado tus modificaciones institucionales.', 'success')}
              className="btn btn-primary text-xs font-bold"
            >
              Guardar Modificaciones
            </button>
          </div>
        </div>
      )}

      {/* Modal de Detalle Extendido */}
      <EventDetailModal
        isOpen={Boolean(selectedEventForDetail)}
        onClose={() => setSelectedEventForDetail(null)}
        event={selectedEventForDetail}
      />

    </div>
  );
}
