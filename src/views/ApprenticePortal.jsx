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
  History,
  Check,
  UserCheck
} from 'lucide-react';
import EventDetailModal from '../components/EventDetailModal';

export default function ApprenticePortal() {
  const { 
    currentUser, 
    visibleEvents, 
    events, 
    registerPreAttendance, 
    registerAttendance, 
    activeTab, 
    setActiveTab,
    addToast 
  } = useApp();

  const [currentSection, setCurrentSection] = useState('billboard'); // 'billboard' | 'history' | 'profile'
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

  // Historial de asistencias personales
  const myHistory = events.filter(evt => {
    const pre = evt.preattendedByUserIds?.includes(currentUser.id);
    const att = evt.attendedByUserIds?.includes(currentUser.id);
    return pre || att;
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
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setCurrentSection('billboard')}
            className={`text-xs md:text-sm font-heading font-bold transition-all relative py-2 ${
              currentSection === 'billboard'
                ? 'text-[#15803d] border-b-2 border-[#15803d]'
                : 'text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            Eventos de hoy
          </button>

          <button
            type="button"
            onClick={() => setCurrentSection('history')}
            className={`text-xs md:text-sm font-heading font-bold transition-all relative py-2 ${
              currentSection === 'history'
                ? 'text-[#15803d] border-b-2 border-[#15803d]'
                : 'text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            <span>Mis asistencias</span>
            {myHistory.length > 0 && (
              <span className="ml-2 text-[10px] bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-1.5 py-0.2 rounded-full font-mono">
                {myHistory.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentSection('profile')}
            className={`text-xs md:text-sm font-heading font-bold transition-all relative py-2 ${
              currentSection === 'profile'
                ? 'text-[#15803d] border-b-2 border-[#15803d]'
                : 'text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            Mi Perfil
          </button>
        </div>

        <div className="text-[11px] text-[#64748b] font-medium hidden sm:block">
          Regional Distrito Capital • Complejo Paloquemao
        </div>
      </div>

      {/* SECCIÓN 1: CARTELERA Y EXPERIENCIA PRINCIPAL */}
      {currentSection === 'billboard' && (
        <div className="space-y-6">
          
          {/* Banner de Bienvenida Institucional Ergonómico (verde petróleo cálido) */}
          <div className="rounded-3xl bg-gradient-to-r from-[#0c2f39] via-[#103a46] to-[#08262f] text-white p-7 md:p-9 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg border border-[#1a4a58]">
            
            <div className="relative z-10 max-w-lg space-y-2">
              <span className="text-[10px] font-extrabold tracking-[1.8px] text-[#c4f246] uppercase font-mono">
                VIERNES, 14 DE MARZO DE 2026
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight">
                Hay experiencias esperando por ti.
              </h1>
              <p className="text-xs md:text-sm text-[#bfd3df] leading-relaxed">
                Explora las actividades de Bienestar al Aprendiz, preasiste hasta 1 hora antes y acredita tu asistencia en 1 clic.
              </p>
            </div>

            {/* Tarjeta de Calendario Flotante con contraste suave */}
            <div className="relative z-10 w-24 h-28 bg-[#f8fafc] border border-[#cbd5e1] rounded-2xl text-[#1e293b] flex flex-col items-center justify-center shadow-lg shrink-0 self-end sm:self-auto">
              <small className="text-[#15803d] text-[10px] font-extrabold tracking-wider">MAR</small>
              <strong className="text-4xl font-extrabold font-heading leading-tight text-[#1e293b]">14</strong>
              <span className="text-[9px] text-[#64748b] font-semibold">Viernes</span>
            </div>

            {/* Círculo visual decorativo suave */}
            <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full border-[50px] border-white/[0.03] pointer-events-none" />
          </div>

          {/* Grid de 6 Áreas de Bienestar con tonos pastel relajantes */}
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {stitchAreas.map((areaItem) => {
                const IconComponent = areaItem.icon;
                const isSelected = filterArea === areaItem.name;

                return (
                  <button
                    key={areaItem.name}
                    type="button"
                    onClick={() => setFilterArea(isSelected ? 'ALL' : areaItem.name)}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 group ${
                      isSelected 
                        ? 'border-[#15803d] bg-white ring-2 ring-[#15803d]/30 shadow-xs' 
                        : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:shadow-2xs'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${areaItem.bg} ${areaItem.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#1e293b] leading-tight">
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
                  const hasPreattended = evt.preattendedByUserIds?.includes(currentUser.id);
                  const hasAttended = evt.attendedByUserIds?.includes(currentUser.id);
                  const isInProgress = evt.status === 'en_curso';

                  return (
                    <article 
                      key={evt.id}
                      className="grid grid-cols-1 sm:grid-cols-[43%_57%] card-ergonomic overflow-hidden min-h-[300px]"
                    >
                      {/* Portada a la izquierda con Time Chip */}
                      <div className="relative min-h-[180px] sm:min-h-full">
                        <img 
                          src={evt.image || 'https://images.unsplash.com/photo-1598588436316-1e65ffcffc0a?w=400&auto=format&fit=crop&q=80'} 
                          alt={evt.title} 
                          className="w-full h-full object-cover"
                        />
                        {/* Area Badge */}
                        <span className="absolute top-3 left-3 bg-[#0e2738]/85 text-white backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-[9px] font-bold border border-white/10">
                          {evt.area}
                        </span>
                        {/* Time Chip flotante en la foto */}
                        <div className="absolute left-3 bottom-3 bg-white/95 text-[#1e293b] rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-md border border-[#cbd5e1]/60">
                          <Clock className="w-3.5 h-3.5 text-[#15803d]" />
                          <strong className="text-xs font-bold font-mono">
                            {evt.schedule?.split(' - ')[0] || '14:00'}
                          </strong>
                          <small className="text-[8px] text-[#64748b] font-semibold">horas</small>
                        </div>
                      </div>

                      {/* Cuerpo de la tarjeta */}
                      <div className="p-5 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="font-heading font-extrabold text-[#1e293b] text-base line-clamp-2">
                            {evt.title}
                          </h3>
                          <p className="text-[#475569] text-xs line-clamp-2 mt-1 leading-relaxed">
                            {evt.purpose}
                          </p>
                        </div>

                        {/* Ubicación */}
                        <div className="pt-2 border-t border-[#e2e8f0] flex items-center gap-2 text-[11px] text-[#64748b]">
                          <MapPin className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>

                        {/* Avatares de confirmados */}
                        <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
                          <div className="flex -space-x-1.5">
                            <span className="w-6 h-6 rounded-full bg-[#eafaf1] text-[#15803d] border-2 border-white flex items-center justify-center font-bold text-[9px]">AM</span>
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 border-2 border-white flex items-center justify-center font-bold text-[9px]">JS</span>
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 border-2 border-white flex items-center justify-center font-bold text-[8px]">
                              +{(evt.preattendanceCount || 10) - 2}
                            </span>
                          </div>
                          <span>{evt.preattendanceCount || 15} aprendices asistirán</span>
                        </div>

                        {/* Botón de Acción Dual */}
                        <div>
                          {hasAttended ? (
                            <button
                              type="button"
                              disabled
                              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] flex items-center justify-center gap-2 cursor-default shadow-2xs"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
                              <span>Asistencia Confirmada ✓</span>
                            </button>
                          ) : isInProgress ? (
                            <button
                              type="button"
                              onClick={() => registerAttendance(evt.id)}
                              className="btn btn-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                            >
                              <Sparkles className="w-4 h-4 text-white" />
                              <span>Confirmar Asistencia Presencial (1 Clic)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => registerPreAttendance(evt.id)}
                              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                                hasPreattended
                                  ? 'bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                                  : 'btn btn-secondary'
                              }`}
                            >
                              {hasPreattended ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Preasistencia Registrada (Cancelar)</span>
                                </>
                              ) : (
                                <>
                                  <span>Registrar Preasistencia</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </>
                              )}
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
                Al preasistir o confirmar, ayudas a los organizadores a preparar los cupos, materiales y refrigerios para una mejor experiencia comunitaria.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* SECCIÓN 2: HISTORIAL DE ASISTENCIAS */}
      {currentSection === 'history' && (
        <div className="p-6 card-ergonomic space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#1e293b] font-heading">
              Historial Personal de Participaciones ({myHistory.length})
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              Certificación de actividades en las que has reservado cupo o acreditado asistencia presencial.
            </p>
          </div>

          {myHistory.length === 0 ? (
            <div className="p-12 text-center border border-[#e2e8f0] rounded-xl space-y-2">
              <History className="w-8 h-8 text-[#94a3b8] mx-auto stroke-1" />
              <p className="text-xs text-[#64748b]">Aún no has registrado preasistencia o asistencia en ningún evento.</p>
            </div>
          ) : (
            <div className="border border-[#e2e8f0] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#f8fafc] text-[#475569] font-bold border-b border-[#e2e8f0]">
                  <tr>
                    <th className="p-3">Código</th>
                    <th className="p-3">Actividad</th>
                    <th className="p-3">Área</th>
                    <th className="p-3">Fecha Programada</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Firma Digital</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-[#334155]">
                  {myHistory.map(evt => {
                    const attended = evt.attendedByUserIds?.includes(currentUser.id);

                    return (
                      <tr key={evt.id} className="hover:bg-[#f8fafc]">
                        <td className="p-3 font-mono text-[11px] font-bold text-[#1e293b]">{evt.code}</td>
                        <td className="p-3 font-medium text-[#1e293b]">{evt.title}</td>
                        <td className="p-3 font-mono text-[11px] text-[#475569]">{evt.area}</td>
                        <td className="p-3 font-mono text-[11px] text-[#475569]">{evt.date}</td>
                        <td className="p-3">
                          {attended ? (
                            <span className="font-mono text-[10px] bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2 py-0.5 rounded font-bold">
                              Asistió (Certificado)
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd] px-2 py-0.5 rounded font-bold">
                              Preasistió (Reservado)
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-[10px] text-[#64748b]">
                          {attended ? `${evt.date} 14:05:12` : 'Pendiente firma presencial'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECCIÓN 3: CONFIGURACIÓN Y PERFIL INSTITUCIONAL */}
      {currentSection === 'profile' && (
        <div className="p-6 card-ergonomic space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
            <div>
              <h2 className="text-base font-bold text-[#1e293b] font-heading">
                Información del Aprendiz & Política de Actualización Mensual
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Para preservar la trazabilidad de actas oficiales, cada campo institucional solo puede actualizarse una vez al mes.
              </p>
            </div>
            <span className="font-mono text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-bold">
              BLOQUEO MENSUAL ACTIVO
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#475569] leading-relaxed">
            <strong>Política SENA:</strong> Las asistencias registradas previamente conservan una instantánea histórica de los datos con los que te uniste. Los cambios que realices aplicarán únicamente a futuros eventos.
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
              <input type="text" defaultValue={currentUser.ficha || '2687140'} className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] font-mono text-[#1e293b]" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">Teléfono de Contacto</label>
              <input type="tel" defaultValue={currentUser.phone || '3157849201'} className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-[#1e293b]" />
            </div>
          </div>

          <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#64748b]">
              Próxima edición permitida: <strong>2026-11-01</strong>
            </span>
            <button
              type="button"
              onClick={() => addToast('Edición Mensual', 'Se registraron los cambios permitidos para este mes.', 'success')}
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
