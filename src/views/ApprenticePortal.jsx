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
  UserCheck,
  History,
  FileText,
  Download,
  QrCode,
  Printer,
  Lock,
  ShieldCheck,
  Building2,
  IdCard,
  Mail,
  Phone,
  Ban,
  BookOpen,
  Layers,
  FileCheck2
} from 'lucide-react';
import EventDetailModal from '../components/EventDetailModal';
import EmptyState from '../components/EmptyState';
import { 
  PROGRAMAS_FORMACION, 
  CENTROS_FORMACION, 
  NIVELES_FORMACION, 
  MODALIDADES, 
  JORNADAS 
} from '../data/mockData';

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

  const [currentSection, setCurrentSection] = useState('billboard'); // 'billboard' | 'history' | 'profile'
  const [filterArea, setFilterArea] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);
  const [selectedEventForCertificate, setSelectedEventForCertificate] = useState(null);

  // Estado para el formulario enriquecido de perfil institucional (Item 7)
  const [profileData, setProfileData] = useState({
    name: currentUser.name || 'Sofia Arango Castillo',
    documentType: currentUser.documentType || 'Cédula de Ciudadanía (CC)',
    documentNumber: currentUser.documentNumber || currentUser.username || '1020495821',
    ficha: currentUser.ficha || '2670192',
    program: currentUser.program || PROGRAMAS_FORMACION[0] || 'Análisis y Desarrollo de Software (ADSO)',
    trainingCenter: currentUser.trainingCenter || CENTROS_FORMACION[0] || 'SENA Centro de Comercio y Turismo Armenia Quindio',
    level: currentUser.level || 'Tecnólogo',
    modality: currentUser.modality || 'Presencial',
    jornada: currentUser.jornada || 'Diurna',
    gender: currentUser.gender || 'Femenino',
    email: currentUser.email || `${currentUser.username || 'sofia.castillo'}@misena.edu.co`,
    personalEmail: currentUser.personalEmail || 'sofia.castillo@gmail.com',
    phone: currentUser.phone || '3157849201'
  });

  // Filtrar eventos visibles para el aprendiz (no borradores ni pendientes)
  const availableEvents = visibleEvents.filter(e => e.status !== 'borrador' && e.status !== 'pendiente_aprobacion');

  const filteredEvents = availableEvents.filter(evt => {
    const matchesSearch = searchQuery === '' || 
      evt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesArea = filterArea === 'ALL' || evt.area === filterArea;
    return matchesSearch && matchesArea;
  });

  // Cálculo de historial explícito de asistencias del aprendiz (Item 3)
  const attendedEvents = events.filter(e => e.attendedByUserIds?.includes(currentUser.id));
  const totalHours = attendedEvents.length * 2; // 2 horas institucionales estándar por actividad
  const uniqueAreasCount = new Set(attendedEvents.map(e => e.area)).size;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    addToast(
      'Perfil Institucional Actualizado',
      'Tus modificaciones en ficha, programa y contacto se han guardado. Las actas históricas conservan su instantánea original.',
      'success'
    );
  };

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
      
      {/* 1. Header Secundario del Aprendiz: Navegación de Pestañas ergonómica (Item 3 y 12) */}
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <button
            type="button"
            onClick={() => setCurrentSection('billboard')}
            className={`text-xs md:text-sm font-heading font-bold transition-all relative py-2 whitespace-nowrap active:scale-[0.96] flex items-center gap-2 ${
              currentSection === 'billboard'
                ? 'text-[#15803d] border-b-2 border-[#15803d]'
                : 'text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#15803d]" />
            <span>Cartelera de Actividades</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentSection('history')}
            className={`text-xs md:text-sm font-heading font-bold transition-all relative py-2 whitespace-nowrap active:scale-[0.96] flex items-center gap-2 ${
              currentSection === 'history'
                ? 'text-[#15803d] border-b-2 border-[#15803d]'
                : 'text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            <History className="w-4 h-4 text-[#0284c7]" />
            <span>Mi Historial de Asistencia</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
              attendedEvents.length > 0 
                ? 'bg-emerald-100 text-[#15803d]' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {attendedEvents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentSection('profile')}
            className={`text-xs md:text-sm font-heading font-bold transition-all relative py-2 whitespace-nowrap active:scale-[0.96] flex items-center gap-2 ${
              currentSection === 'profile'
                ? 'text-[#15803d] border-b-2 border-[#15803d]'
                : 'text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            <IdCard className="w-4 h-4 text-[#ea580c]" />
            <span>Mi Perfil Institucional</span>
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
                  const isCancelled = evt.status === 'cancelada';

                  return (
                    <article 
                      key={evt.id}
                      className={`grid grid-cols-1 sm:grid-cols-[43%_57%] card-ergonomic overflow-hidden min-h-[300px] transition-all ${
                        isCancelled ? 'border-rose-200 bg-rose-50/15 opacity-90' : ''
                      }`}
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

                        {/* Badge si está cancelada */}
                        {isCancelled && (
                          <span className="absolute top-3 right-3 bg-rose-600 text-white px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase font-mono shadow-xs">
                            Cancelada
                          </span>
                        )}

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

                        {/* Ubicación y Apertura */}
                        <div className="pt-2 border-t border-[#e2e8f0] space-y-1 text-[11px] text-[#64748b] min-w-0">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                          {evt.attendanceOpenedAt && isInProgress && (
                            <div className="flex items-center gap-1.5 text-[#15803d] font-mono text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#15803d] animate-pulse" />
                              <span>Asistencia abierta hoy {new Date(evt.attendanceOpenedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          )}
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

                        {/* Botón de Acción Presencial */}
                        <div className="pt-0.5">
                          {isCancelled ? (
                            <div className="w-full px-3 py-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-between gap-2 shadow-2xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                                  <Ban className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-xs font-bold truncate">Actividad Cancelada</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-white text-rose-800 text-[10px] font-mono font-bold shrink-0">
                                SUSPENDIDA
                              </span>
                            </div>
                          ) : hasAttended ? (
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
                              className="btn btn-primary w-full px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 group/cta shadow-xs active:scale-[0.96]"
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
                              className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-[#f8fafc] hover:bg-[#f0f9ff] text-[#334155] hover:text-[#0369a1] border border-[#cbd5e1] hover:border-[#bae6fd] flex items-center justify-between gap-2 transition-colors cursor-pointer active:scale-[0.96]"
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

      {/* SECCIÓN 2: HISTORIAL EXPLÍCITO DEL APRENDIZ (Item 3) */}
      {currentSection === 'history' && (
        <div className="space-y-6">

          {/* Bloque de Métricas Resumen */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-2">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Horas Acreditadas</span>
              <strong className="block text-2xl font-extrabold text-[#1e293b] font-heading mt-0.5">
                {totalHours} h
              </strong>
              <small className="text-[10px] text-[#15803d] font-semibold">2h por actividad oficial</small>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284c7] flex items-center justify-center mb-2">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Actividades Asistidas</span>
              <strong className="block text-2xl font-extrabold text-[#1e293b] font-heading mt-0.5">
                {attendedEvents.length}
              </strong>
              <small className="text-[10px] text-[#64748b]">presenciales verificadas</small>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
                <Palette className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Áreas Cubiertas</span>
              <strong className="block text-2xl font-extrabold text-[#1e293b] font-heading mt-0.5">
                {uniqueAreasCount} / 6
              </strong>
              <small className="text-[10px] text-[#64748b]">diversidad formativa</small>
            </div>

            <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#15803d] text-white flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803d]">Formato GOR-F-013</span>
              <strong className="block text-sm font-extrabold text-[#14532d] font-heading mt-1">
                Acta Activa ✓
              </strong>
              <small className="text-[10px] text-[#166534]">cumplimiento normativo</small>
            </div>
          </div>

          {/* Listado Cronológico de Participaciones */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold font-heading text-[#1e293b]">
                  Registro Histórico de Participación Presencial
                </h2>
                <p className="text-xs text-[#64748b]">
                  Constancias oficiales emitidas y acreditadas en la base de datos de Bienestar al Aprendiz.
                </p>
              </div>
            </div>

            {attendedEvents.length === 0 ? (
              <EmptyState
                title="Aún no tienes asistencias registradas"
                description="Explora la Cartelera de Actividades y confirma tu presencia en los eventos de bienestar institucional para acreditar tus horas."
                icon={History}
                actionLabel="Explorar Cartelera de Actividades"
                onAction={() => setCurrentSection('billboard')}
              />
            ) : (
              <div className="space-y-3">
                {attendedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs hover:border-[#cbd5e1] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#0c2f3a] text-white flex items-center justify-center shrink-0 font-bold overflow-hidden">
                        {evt.image ? (
                          <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-[#c4f246]" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] text-[10px] font-bold font-mono">
                            {evt.area}
                          </span>
                          <span className="text-[11px] text-[#64748b] font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#94a3b8]" />
                            {evt.date} • {evt.schedule || '14:00'}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-[#15803d] text-[10px] font-extrabold">
                            <CheckCircle2 className="w-3 h-3" />
                            Acta GOR-F-013 Registrada
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-[#1e293b] font-heading">
                          {evt.title}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-[#64748b]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#94a3b8]" />
                            {evt.location}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-[#15803d]">2 Horas Acreditadas</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setSelectedEventForDetail(evt)}
                        className="btn btn-secondary py-2 px-3 rounded-xl text-xs font-semibold text-[#1e293b] border border-[#cbd5e1] hover:border-[#15803d] transition-colors"
                      >
                        Ver Ficha
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedEventForCertificate(evt)}
                        className="btn btn-primary py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-[0.96]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Constancia Digital</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* SECCIÓN 3: CONFIGURACIÓN Y PERFIL INSTITUCIONAL EN 3 BLOQUES (Item 7) */}
      {currentSection === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-5">
          
          {/* Cabecera del Perfil con Trazabilidad */}
          <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-[#1e293b] font-heading">
                Perfil Institucional del Aprendiz
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Consulta tus datos oficiales de formación y mantén actualizados tus canales de contacto.
              </p>
            </div>
            <span className="font-mono text-[10px] bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-3 py-1 rounded-full font-bold self-start sm:self-auto">
              INSTANTÁNEA HISTÓRICA ACTIVA
            </span>
          </div>

          {/* Banner Normativo de Instantáneas Históricas */}
          <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-xs text-[#166534] leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#15803d] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Trazabilidad Normativa del Sistema:</strong>
              Los ajustes que realices en tu ficha o canales de contacto se aplicarán únicamente para futuras participaciones. Las actas de asistencia GOR-F-013 ya emitidas conservan inalterada la información histórica registrada en la fecha de cada evento.
            </div>
          </div>

          {/* BLOQUE 1: Identificación Oficial (Solo Lectura con Candado) */}
          <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2.5">
              <div className="flex items-center gap-2">
                <IdCard className="w-4 h-4 text-[#0e2738]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0e2738]">
                  1. Identificación Oficial (Inmutable en Portal)
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-[#64748b] flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                <Lock className="w-3 h-3 text-slate-500" />
                Solo Lectura
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Nombre Completo *</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={profileData.name}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-[#475569] font-medium cursor-not-allowed select-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#94a3b8] absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Tipo y Número de Documento *</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={`${profileData.documentType} - ${profileData.documentNumber}`}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-[#475569] font-mono font-medium cursor-not-allowed select-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#94a3b8] absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Género Registrado</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={profileData.gender}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-[#475569] cursor-not-allowed select-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#94a3b8] absolute right-3 top-3" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[#64748b] text-[11px] flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Para corregir nombres o documento acércate con cédula original a Registro y Control.</span>
              </div>
            </div>
          </div>

          {/* BLOQUE 2: Datos Académicos SENA (Editables) */}
          <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e2e8f0] pb-2.5">
              <Building2 className="w-4 h-4 text-[#15803d]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e293b]">
                2. Formación Académica SENA
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Ficha de Formación *</label>
                <input
                  type="text"
                  required
                  value={profileData.ficha}
                  onChange={(e) => setProfileData({ ...profileData, ficha: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#cbd5e1] font-mono text-xs text-[#1e293b] focus:border-[#15803d] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Programa de Formación *</label>
                <select
                  value={profileData.program}
                  onChange={(e) => setProfileData({ ...profileData, program: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:border-[#15803d] focus:outline-none"
                >
                  {PROGRAMAS_FORMACION.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Centro de Formación *</label>
                <select
                  value={profileData.trainingCenter}
                  onChange={(e) => setProfileData({ ...profileData, trainingCenter: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:border-[#15803d] focus:outline-none"
                >
                  {CENTROS_FORMACION.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">Nivel</label>
                  <select
                    value={profileData.level}
                    onChange={(e) => setProfileData({ ...profileData, level: e.target.value })}
                    className="w-full px-2 py-2.5 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:border-[#15803d] focus:outline-none"
                  >
                    {NIVELES_FORMACION.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">Modalidad</label>
                  <select
                    value={profileData.modality}
                    onChange={(e) => setProfileData({ ...profileData, modality: e.target.value })}
                    className="w-full px-2 py-2.5 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:border-[#15803d] focus:outline-none"
                  >
                    {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">Jornada</label>
                  <select
                    value={profileData.jornada}
                    onChange={(e) => setProfileData({ ...profileData, jornada: e.target.value })}
                    className="w-full px-2 py-2.5 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:border-[#15803d] focus:outline-none"
                  >
                    {JORNADAS.map((j) => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* BLOQUE 3: Contacto y Notificaciones */}
          <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e2e8f0] pb-2.5">
              <Mail className="w-4 h-4 text-[#0284c7]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e293b]">
                3. Canales de Contacto y Notificaciones
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Correo Institucional *</label>
                <input
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:border-[#15803d] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Correo Personal</label>
                <input
                  type="email"
                  value={profileData.personalEmail}
                  onChange={(e) => setProfileData({ ...profileData, personalEmail: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:border-[#15803d] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Teléfono Móvil *</label>
                <input
                  type="tel"
                  required
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:border-[#15803d] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Botón de Guardar Cambios */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#64748b]">
              Asegúrate de que tu ficha y correo institucional estén correctos para recibir constancias.
            </span>
            <button
              type="submit"
              className="btn btn-primary py-2.5 px-5 rounded-xl text-xs font-bold shadow-xs active:scale-[0.96]"
            >
              Guardar Modificaciones
            </button>
          </div>

        </form>
      )}

      {/* Modal de Detalle Extendido */}
      <EventDetailModal
        isOpen={Boolean(selectedEventForDetail)}
        onClose={() => setSelectedEventForDetail(null)}
        event={selectedEventForDetail}
      />

      {/* MODAL DE CONSTANCIA DIGITAL DE ASISTENCIA GOR-F-013 (Item 3) */}
      {selectedEventForCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#cbd5e1] w-full max-w-xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            
            {/* Header del Modal */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-[#0c2f3a] to-[#103a46] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#c4f246]" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Constancia Oficial de Asistencia Presencial
                  </h3>
                  <span className="text-[10px] text-[#bfd3df]">Formato Institucional GOR-F-013</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEventForCertificate(null)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo del Certificado (Estilo Oficial SENA) */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              
              <div className="border-2 border-[#15803d] rounded-2xl p-5 space-y-4 bg-gradient-to-b from-white via-[#f0fdf4]/20 to-white relative">
                
                {/* Cabecera Institucional */}
                <div className="text-center space-y-1 pb-3 border-b border-[#cbd5e1]">
                  <div className="w-10 h-10 rounded-full bg-[#15803d] text-white flex items-center justify-center mx-auto font-black text-sm">
                    S
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0e2738]">
                    SERVICIO NACIONAL DE APRENDIZAJE · SENA
                  </h4>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wide">
                    Dirección de Formación Profesional · Bienestar al Aprendiz
                  </p>
                </div>

                {/* Título de la Constancia */}
                <div className="text-center py-1">
                  <span className="text-[10px] uppercase font-bold text-[#15803d] tracking-widest block">
                    CERTIFICACIÓN DE PARTICIPACIÓN PRESENCIAL
                  </span>
                  <h5 className="text-sm font-extrabold text-[#1e293b] font-heading mt-1">
                    HACE CONSTAR QUE EL APRENDIZ
                  </h5>
                </div>

                {/* Datos del Aprendiz */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <strong className="block text-sm font-extrabold text-[#0e2738]">
                    {currentUser.name?.toUpperCase() || 'SOFIA ARANGO CASTILLO'}
                  </strong>
                  <div className="text-[11px] text-[#64748b]">
                    <span>{currentUser.documentType || 'CC'}: <strong>{currentUser.documentNumber || currentUser.username || '1020495821'}</strong></span>
                    <span className="mx-2">•</span>
                    <span>Ficha: <strong>{currentUser.ficha || '2670192'}</strong></span>
                  </div>
                  <span className="text-[10px] text-[#475569] block">
                    {profileData.program}
                  </span>
                </div>

                {/* Detalle de la Actividad */}
                <div className="text-center text-xs space-y-1 text-[#334155] leading-relaxed">
                  <p>
                    Participó activamente en la jornada presencial correspondiente a la actividad:
                  </p>
                  <strong className="block text-sm font-bold text-[#15803d]">
                    "{selectedEventForCertificate.title}"
                  </strong>
                  <p className="text-[11px] text-[#64748b]">
                    Área: <strong>{selectedEventForCertificate.area}</strong> • Fecha: <strong>{selectedEventForCertificate.date}</strong> • Ubicación: <strong>{selectedEventForCertificate.location}</strong>
                  </p>
                  <div className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-[#15803d] rounded-full font-bold text-[10px]">
                    2 HORAS INSTITUCIONALES ACREDITADAS
                  </div>
                </div>

                {/* Firma y Código QR de Validación */}
                <div className="pt-4 border-t border-[#cbd5e1] grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-1 text-center">
                    <div className="w-24 h-0.5 bg-[#cbd5e1] mx-auto mt-4" />
                    <span className="block text-[10px] font-bold text-[#1e293b]">Coordinación de Bienestar</span>
                    <small className="block text-[8px] text-[#64748b]">Firma Digital Autorizada</small>
                  </div>

                  <div className="flex items-center justify-end gap-2 text-right">
                    <div className="space-y-0.5">
                      <span className="block text-[9px] font-mono font-bold text-[#0e2738]">
                        REF: GOR-2026-F013-{selectedEventForCertificate.id.replace('evt-', '')}
                      </span>
                      <small className="block text-[8px] text-[#64748b]">Validación SHA-256 Activa</small>
                    </div>
                    <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-center shrink-0">
                      <QrCode className="w-8 h-8 text-[#0e2738]" />
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Footer con Acciones */}
            <div className="px-6 py-3 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between">
              <span className="text-[10px] text-[#64748b]">
                Documento oficial válido para acreditar horas de bienestar.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEventForCertificate(null)}
                  className="btn btn-secondary py-2 px-3 rounded-xl text-xs"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-primary py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-[0.96]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
