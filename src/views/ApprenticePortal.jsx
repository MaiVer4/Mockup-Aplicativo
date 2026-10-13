import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Check, 
  Sparkles, 
  QrCode, 
  History, 
  IdCard, 
  User, 
  ShieldCheck,
  Heart,
  Dumbbell,
  Palette,
  Brain,
  Award,
  Wallet,
  ExternalLink,
  Maximize2,
  X
} from 'lucide-react';
import EventDetailModal from '../components/EventDetailModal';

export default function ApprenticePortal() {
  const { 
    currentUser, 
    events, 
    registerPreAttendance, 
    registerAttendance, 
    activeTab, 
    setActiveTab, 
    updateApprenticeProfile, 
    addToast 
  } = useApp();

  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('ALL');
  const [isQrExpanded, setIsQrExpanded] = useState(false);

  // Sub-sección activa para el aprendiz
  const currentSection = activeTab === 'history' ? 'history' : (activeTab === 'profile' ? 'profile' : 'billboard');

  // El aprendiz ve eventos en publicado, en_curso o finalizado
  const apprenticeAvailableEvents = events.filter(evt => {
    return evt.status === 'publicado' || evt.status === 'en_curso' || evt.status === 'finalizado';
  });

  const filteredEvents = apprenticeAvailableEvents.filter(evt => {
    const matchesSearch = 
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.code && evt.code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesArea = filterArea === 'ALL' || evt.area === filterArea;
    return matchesSearch && matchesArea;
  });

  // Historial de asistencias personales
  const myHistory = events.filter(evt => {
    const pre = evt.preattendedByUserIds?.includes(currentUser.id);
    const att = evt.attendedByUserIds?.includes(currentUser.id);
    return pre || att;
  });

  // Configuración de las 6 Áreas de Bienestar según la pantalla de Stitch
  const stitchAreas = [
    { name: 'Actividad Física', label: 'Deporte y Recreación', icon: Dumbbell, color: 'text-[#16a34a]', bg: 'bg-[#eaf7ec]' },
    { name: 'Prevención', label: 'Salud Integral', icon: Heart, color: 'text-[#2563eb]', bg: 'bg-[#ebf3fe]' },
    { name: 'Cultura', label: 'Cultura y Arte', icon: Palette, color: 'text-[#ea580c]', bg: 'bg-[#fef2e8]' },
    { name: 'Habilidades', label: 'Apoyo Psicosocial', icon: Brain, color: 'text-[#059669]', bg: 'bg-[#e8f8f0]' },
    { name: 'Liderazgo', label: 'Liderazgo y Mentoría', icon: Award, color: 'text-[#0891b2]', bg: 'bg-[#e6f7f8]' },
    { name: 'Arte', label: 'Apoyos Económicos', icon: Wallet, color: 'text-[#9333ea]', bg: 'bg-[#f3e8ff]' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* 1. Header Secundario del Aprendiz: Navegación de Pestañas estilo Functional Mockup */}
      <div className="flex items-center justify-between border-b border-[#e6eaf0] pb-2">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('apprentice')}
            className={`text-xs md:text-sm font-heading font-bold transition-all relative py-2 ${
              currentSection === 'billboard'
                ? 'text-[#1b3657] border-b-2 border-[#b6df48]'
                : 'text-[#7b899a] hover:text-[#1b3657]'
            }`}
          >
            Eventos de hoy
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`text-xs md:text-sm font-heading font-bold transition-all relative py-2 ${
              currentSection === 'history'
                ? 'text-[#1b3657] border-b-2 border-[#b6df48]'
                : 'text-[#7b899a] hover:text-[#1b3657]'
            }`}
          >
            <span>Mis asistencias</span>
            {myHistory.length > 0 && (
              <span className="ml-2 text-[10px] bg-[#eaf7ec] text-[#16a34a] px-1.5 py-0.2 rounded-full font-mono">
                {myHistory.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`text-xs md:text-sm font-heading font-bold transition-all relative py-2 ${
              currentSection === 'profile'
                ? 'text-[#1b3657] border-b-2 border-[#b6df48]'
                : 'text-[#7b899a] hover:text-[#1b3657]'
            }`}
          >
            Mi Carnet & Perfil
          </button>
        </div>

        <div className="text-[11px] text-[#718098] hidden sm:block">
          Regional Distrito Capital • Complejo Paloquemao
        </div>
      </div>

      {/* SECCIÓN 1: CARTELERA Y EXPERIENCIA PRINCIPAL */}
      {currentSection === 'billboard' && (
        <div className="space-y-6">
          
          {/* Banner de Bienvenida Institucional estilo Functional Mockup */}
          <div className="rounded-3xl bg-[#143255] text-white p-7 md:p-9 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
            
            <div className="relative z-10 max-w-lg space-y-2">
              <span className="text-[10px] font-extrabold tracking-[1.8px] text-[#c9f45a] uppercase font-mono">
                VIERNES, 14 DE MARZO DE 2026
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight">
                Hay experiencias esperando por ti.
              </h1>
              <p className="text-xs md:text-sm text-[#b8c7d8] leading-relaxed">
                Explora las actividades de Bienestar al Aprendiz, preasiste hasta 1 hora antes y acredita tu asistencia en 1 clic.
              </p>
            </div>

            {/* Tarjeta de Calendario Flotante estilo Functional Mockup */}
            <div className="relative z-10 w-24 h-28 bg-white rounded-2xl text-[#183554] flex flex-col items-center justify-center shadow-xl shrink-0 self-end sm:self-auto">
              <small className="text-[#7b922e] text-[10px] font-extrabold tracking-wider">MAR</small>
              <strong className="text-4xl font-extrabold font-heading leading-tight text-[#142b4d]">14</strong>
              <span className="text-[9px] text-[#8793a1] font-semibold">Viernes</span>
            </div>

            {/* Círculo visual decorativo */}
            <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full border-[50px] border-white/[0.04] pointer-events-none" />
          </div>

          {/* Carnet Digital de Aprendiz de Stitch */}
          <div className="bg-gradient-to-r from-[#063b59] to-[#022538] rounded-2xl p-5 md:p-6 text-white shadow-lg border border-[#0e4b6d] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tracking-wider text-[#9ae6b4] uppercase flex items-center gap-1.5 font-mono">
                    <IdCard className="w-4 h-4 text-[#c9f45a]" />
                    CARNET DIGITAL APRENDIZ
                  </span>
                  <span className="bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-ping" />
                    Aprendiz Activo
                  </span>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-bold font-heading text-white">
                    {currentUser.name}
                  </h3>
                  <p className="text-xs text-[#cbd5e1] mt-0.5">
                    {currentUser.program || 'Análisis y Desarrollo de Software (ADSO)'} • Ficha {currentUser.ficha || '2687140'}
                  </p>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">
                    {currentUser.trainingCenter || 'C.E.E.T. - Complejo Paloquemao'} • Jornada Diurna
                  </p>
                </div>

                <div className="pt-2 text-[10px] text-[#94a3b8] font-mono flex items-center gap-4">
                  <span>Identificación: CC {currentUser.documentNumber || '1.020.884.***'}</span>
                  <span>SENA 2026</span>
                </div>
              </div>

              {/* QR Code Container estilo Stitch */}
              <div className="bg-white p-3 rounded-xl flex flex-col items-center justify-center text-zinc-900 shadow-md shrink-0 self-center sm:self-auto">
                <QrCode className="w-14 h-14 text-zinc-900" />
                <button
                  type="button"
                  onClick={() => setIsQrExpanded(true)}
                  className="mt-1 text-[9px] font-bold text-[#16a34a] flex items-center gap-1 hover:underline"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Ampliar</span>
                </button>
              </div>

            </div>
          </div>

          {/* Grid de 6 Áreas de Bienestar estilo Stitch */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-heading font-bold text-[#1d3655]">
                Áreas de Bienestar al Aprendiz
              </strong>
              {filterArea !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setFilterArea('ALL')}
                  className="text-xs text-[#16a34a] font-bold hover:underline"
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
                        ? 'border-[#16a34a] bg-white ring-2 ring-[#16a34a]/30 shadow-xs' 
                        : 'border-[#e4e8ee] bg-white hover:border-[#cbd5e1] hover:shadow-2xs'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${areaItem.bg} ${areaItem.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#203754] leading-tight">
                      {areaItem.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Banner de Convocatoria estilo Stitch */}
          <div className="rounded-2xl p-4 bg-[#e8f8ec] border border-[#bbf7d0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#166534] bg-white/70 px-2 py-0.5 rounded-md font-mono">
                CONVOCATORIA II - 2026 • Cierra en 4 días
              </span>
              <strong className="block text-xs md:text-sm text-[#14532d] font-heading font-bold">
                Apoyos de Sostenimiento y Transporte
              </strong>
              <p className="text-[11px] text-[#166534]">
                Postúlate al beneficio institucional de sostenimiento mensual regular o FIC en tu centro.
              </p>
            </div>
            <button
              type="button"
              onClick={() => addToast('Convocatoria Institucional', 'Redirigiendo al formulario de postulación de apoyos de sostenimiento.', 'info')}
              className="text-xs font-bold text-[#166534] bg-white hover:bg-[#f0fdf4] px-3.5 py-2 rounded-xl border border-[#86efac] transition-all whitespace-nowrap self-end sm:self-auto shadow-2xs"
            >
              Consultar requisitos y radicar →
            </button>
          </div>

          {/* Grid de Eventos Disponibles estilo Functional Mockup (`learner-card`) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-sm font-heading font-bold text-[#1d3655]">
                  Eventos disponibles hoy
                </strong>
                <span className="text-xs text-[#718098] ml-2">
                  ({filteredEvents.length} actividades programadas)
                </span>
              </div>
              <div className="text-xs text-[#7a899a]">
                <span className="text-[#365677] font-bold">24°</span> Jornada agradable
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#e4e8ee] space-y-2">
                <Calendar className="w-8 h-8 text-[#8ba2be] mx-auto stroke-1" />
                <p className="text-xs font-bold text-[#203754]">No hay actividades en esta área para hoy</p>
                <button
                  type="button"
                  onClick={() => setFilterArea('ALL')}
                  className="text-xs text-[#16a34a] font-bold hover:underline"
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
                      className="grid grid-cols-1 sm:grid-cols-[43%_57%] bg-white border border-[#e0e6ec] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all min-h-[300px]"
                    >
                      {/* Portada a la izquierda con Time Chip estilo Functional Mockup */}
                      <div className="relative min-h-[180px] sm:min-h-full">
                        <img 
                          src={evt.image || 'https://images.unsplash.com/photo-1598588436316-1e65ffcffc0a?w=400&auto=format&fit=crop&q=80'} 
                          alt={evt.title} 
                          className="w-full h-full object-cover"
                        />
                        {/* Area Badge */}
                        <span className="absolute top-3 left-3 bg-[#0d2139]/80 text-white backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-[9px] font-bold">
                          {evt.area}
                        </span>
                        {/* Time Chip flotante en la foto */}
                        <div className="absolute left-3 bottom-3 bg-white text-[#1b3c61] rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-md">
                          <Clock className="w-3.5 h-3.5 text-[#1b3c61]" />
                          <strong className="text-xs font-bold font-mono">
                            {evt.schedule?.split(' - ')[0] || '14:00'}
                          </strong>
                          <small className="text-[8px] text-[#8593a2] font-semibold">horas</small>
                        </div>
                      </div>

                      {/* Cuerpo de la tarjeta */}
                      <div className="p-5 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="font-heading font-extrabold text-[#1c3554] text-base line-clamp-2">
                            {evt.title}
                          </h3>
                          <p className="text-[#78879a] text-xs line-clamp-2 mt-1 leading-relaxed">
                            {evt.purpose}
                          </p>
                        </div>

                        {/* Ubicación */}
                        <div className="pt-2 border-t border-[#edf0f3] flex items-center gap-2 text-[11px] text-[#69819a]">
                          <MapPin className="w-3.5 h-3.5 text-[#7f8da0] shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>

                        {/* Avatares de confirmados */}
                        <div className="flex items-center gap-2 text-[11px] text-[#8290a1]">
                          <div className="flex -space-x-1.5">
                            <span className="w-6 h-6 rounded-full bg-[#c9f45a] text-[#142b4d] border-2 border-white flex items-center justify-center font-bold text-[9px]">AM</span>
                            <span className="w-6 h-6 rounded-full bg-[#2d4c70] text-white border-2 border-white flex items-center justify-center font-bold text-[9px]">JS</span>
                            <span className="w-6 h-6 rounded-full bg-[#183a65] text-[#c9f45a] border-2 border-white flex items-center justify-center font-bold text-[8px]">
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
                              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#eaf7ec] text-[#16a34a] border border-[#bbf7d0] flex items-center justify-center gap-2 cursor-default"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                              <span>Asistencia Confirmada ✓</span>
                            </button>
                          ) : isInProgress ? (
                            <button
                              type="button"
                              onClick={() => registerAttendance(evt.id)}
                              className="btn btn-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                            >
                              <Sparkles className="w-4 h-4 text-[#10233f]" />
                              <span>Confirmar Asistencia Presencial (1 Clic)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => registerPreAttendance(evt.id)}
                              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                                hasPreattended
                                  ? 'bg-[#edf4fc] text-[#245486] border border-[#bfdbfe] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
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

          {/* Consejo Institucional estilo Functional Mockup */}
          <div className="p-4 rounded-2xl bg-[#edf3f7] border border-[#e2eaf2] flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#c9f45a] text-[#163253] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs font-heading font-bold text-[#2a425e]">
                Tu asistencia cuenta
              </strong>
              <p className="text-[11px] text-[#78889a] mt-0.5">
                Al preasistir o confirmar, ayudas a los organizadores a preparar los cupos, materiales y refrigerios para una mejor experiencia comunitaria.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* SECCIÓN 2: HISTORIAL DE ASISTENCIAS */}
      {currentSection === 'history' && (
        <div className="p-6 rounded-2xl bg-white border border-[#e4e8ee] shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#142b4d] font-heading">
              Historial Personal de Participaciones ({myHistory.length})
            </h2>
            <p className="text-xs text-[#718098] mt-0.5">
              Certificación de actividades en las que has reservado cupo o acreditado asistencia presencial.
            </p>
          </div>

          {myHistory.length === 0 ? (
            <div className="p-12 text-center border border-[#edf0f3] rounded-xl space-y-2">
              <History className="w-8 h-8 text-[#8ba2be] mx-auto stroke-1" />
              <p className="text-xs text-[#64758b]">Aún no has registrado preasistencia o asistencia en ningún evento.</p>
            </div>
          ) : (
            <div className="border border-[#e4e8ee] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#f8fafc] text-[#718098] font-bold border-b border-[#e4e8ee]">
                  <tr>
                    <th className="p-3">Código</th>
                    <th className="p-3">Actividad</th>
                    <th className="p-3">Área</th>
                    <th className="p-3">Fecha Programada</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Firma Digital</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f3] text-[#64758b]">
                  {myHistory.map(evt => {
                    const attended = evt.attendedByUserIds?.includes(currentUser.id);

                    return (
                      <tr key={evt.id} className="hover:bg-[#fafbfc]">
                        <td className="p-3 font-mono text-[11px] font-bold text-[#142b4d]">{evt.code}</td>
                        <td className="p-3 font-medium text-[#142b4d]">{evt.title}</td>
                        <td className="p-3 font-mono text-[11px]">{evt.area}</td>
                        <td className="p-3 font-mono text-[11px]">{evt.date}</td>
                        <td className="p-3">
                          {attended ? (
                            <span className="font-mono text-[10px] bg-[#eaf7ec] text-[#16a34a] px-2 py-0.5 rounded font-bold">
                              Asistió (Certificado)
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] bg-[#edf4fc] text-[#245486] px-2 py-0.5 rounded font-bold">
                              Preasistió (Reservado)
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-[10px] text-[#8492a5]">
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
        <div className="p-6 rounded-2xl bg-white border border-[#e4e8ee] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf0f3]">
            <div>
              <h2 className="text-base font-bold text-[#142b4d] font-heading">
                Información del Aprendiz & Política de Actualización Mensual
              </h2>
              <p className="text-xs text-[#718098] mt-0.5">
                Para preservar la trazabilidad de actas oficiales, cada campo institucional solo puede actualizarse una vez al mes.
              </p>
            </div>
            <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-bold">
              BLOQUEO MENSUAL ACTIVO
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#64758b] leading-relaxed">
            <strong>Política SENA:</strong> Las asistencias registradas previamente conservan una instantánea histórica de los datos con los que te uniste. Los cambios que realices aplicarán únicamente a futuros eventos.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#314865] mb-1">Nombre Completo</label>
              <input type="text" readOnly value={currentUser.name} className="w-full px-3 py-2 rounded-xl border border-[#dbe1e9] bg-[#f1f5f9] text-[#64758b] cursor-not-allowed" />
              <span className="text-[10px] text-[#8492a5] mt-0.5 block">Vinculado a documento de identidad oficial.</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#314865] mb-1">Cédula / Documento</label>
              <input type="text" readOnly value={`${currentUser.documentType || 'CC'} ${currentUser.documentNumber || currentUser.username}`} className="w-full px-3 py-2 rounded-xl border border-[#dbe1e9] bg-[#f1f5f9] text-[#64758b] font-mono cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#314865] mb-1">Ficha de Formación</label>
              <input type="text" defaultValue={currentUser.ficha || '2687140'} className="w-full px-3 py-2 rounded-xl border border-[#dbe1e9] font-mono text-[#203754]" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#314865] mb-1">Teléfono de Contacto</label>
              <input type="tel" defaultValue={currentUser.phone || '3157849201'} className="w-full px-3 py-2 rounded-xl border border-[#dbe1e9] text-[#203754]" />
            </div>
          </div>

          <div className="pt-3 border-t border-[#edf0f3] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#8492a5]">
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

      {/* Modal QR Ampliado */}
      {isQrExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09182b]/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsQrExpanded(false)}
              className="absolute right-3 top-3 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-[#eaf7ec] text-[#16a34a] flex items-center justify-center mx-auto">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[#142b4d] text-base">Carnet Digital • Código QR</h3>
              <p className="text-xs text-[#718098] mt-0.5">Presenta este código en los lectores de acceso del centro.</p>
            </div>
            <div className="p-4 bg-white border border-[#e2e8f0] rounded-xl flex justify-center">
              <QrCode className="w-44 h-44 text-zinc-900" />
            </div>
            <p className="text-[11px] font-mono text-[#8492a5]">
              {currentUser.name} • {currentUser.documentNumber || currentUser.username}
            </p>
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
