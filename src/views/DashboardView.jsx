import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  UserCheck, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  FileSpreadsheet, 
  ExternalLink, 
  Plus, 
  Link as LinkIcon, 
  Shield, 
  ArrowRight, 
  MoreHorizontal, 
  MapPin, 
  Search, 
  Filter, 
  Layers, 
  BarChart3, 
  Award, 
  ShieldCheck, 
  AlertCircle,
  UserPlus
} from 'lucide-react';
import { AREAS } from '../data/mockData';

export default function DashboardView({ onOpenRegisterModal, onNavigateView, onOpenEventDetail }) {
  const { 
    currentUser, 
    events, 
    visibleEvents, 
    users, 
    activeTab, 
    setActiveTab, 
    getApprenticeAuditData,
    toggleUserStatus
  } = useApp();

  const [selectedWeekFilter, setSelectedWeekFilter] = useState('Últimas 5 semanas');
  const [apprenticeSearchDoc, setApprenticeSearchDoc] = useState('');
  const [searchedAuditResult, setSearchedAuditResult] = useState(null);
  
  // Filtros para Gestión de Usuarios (RF-16)
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // Pestañas de supervisión RF-15 para Admin General
  const [adminMetricTab, setAdminMetricTab] = useState(activeTab === 'users' ? 'usuarios' : 'global');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('Todas');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Todos');

  // Sincronizar pestaña si activeTab cambia desde el menú lateral
  useEffect(() => {
    if (activeTab === 'users') {
      setAdminMetricTab('usuarios');
    }
  }, [activeTab]);

  // Filtrar eventos relevantes según el rol
  const relevantEvents = visibleEvents;

  // Filtro dinámico para la tabla de eventos en Visión Global
  const filteredEvents = relevantEvents.filter(evt => {
    const matchesArea = selectedAreaFilter === 'Todas' || evt.area === selectedAreaFilter;
    const matchesStatus = selectedStatusFilter === 'Todos' || evt.status === selectedStatusFilter;
    return matchesArea && matchesStatus;
  });

  // Métricas Consolidadas Globales (RF-15)
  const totalEvents = relevantEvents.length;
  const draftEvents = relevantEvents.filter(e => e.status === 'borrador').length;
  const publishedEvents = relevantEvents.filter(e => e.status === 'publicado').length;
  const inProgressEvents = relevantEvents.filter(e => e.status === 'en_curso').length;
  const finishedEvents = relevantEvents.filter(e => e.status === 'finalizado').length;

  const totalAttendees = relevantEvents.reduce((acc, curr) => acc + (curr.attendeesCount || 0), 0);
  const totalCapacity = relevantEvents.reduce((acc, curr) => acc + (curr.capacity || 50), 0);
  const totalRegisteredLearners = 1248; // Base activa de aprendices con perfil oficial completo
  const attendanceRate = totalCapacity > 0 
    ? Math.min(100, Math.round((totalAttendees / totalCapacity) * 100)) 
    : 84.5;

  const encargadosList = users.filter(u => u.role === 'admin_area');

  // 1. Métricas de cada Encargado (RF-15)
  const encargadosMetrics = encargadosList.map(enc => {
    const encEvents = events.filter(e => e.area === enc.area);
    const encCapacity = encEvents.reduce((acc, curr) => acc + (curr.capacity || 50), 0);
    const encAttendees = encEvents.reduce((acc, curr) => acc + (curr.attendeesCount || 0), 0);
    const avgAttendees = encEvents.length > 0 ? Math.round(encAttendees / encEvents.length) : 0;
    const rate = encCapacity > 0 ? Math.min(100, Math.round((encAttendees / encCapacity) * 100)) : 0;
    const published = encEvents.filter(e => e.status === 'publicado').length;
    const inProgress = encEvents.filter(e => e.status === 'en_curso').length;
    const finished = encEvents.filter(e => e.status === 'finalizado').length;
    const draft = encEvents.filter(e => e.status === 'borrador').length;

    return {
      ...enc,
      totalEvents: encEvents.length,
      published,
      inProgress,
      finished,
      draft,
      totalCapacity: encCapacity,
      totalAttendees: encAttendees,
      avgAttendees,
      complianceRate: rate
    };
  });

  // 2. Métricas de Usuarios de la Plataforma (RF-15)
  const userStats = {
    totalUsers: 1253, // 1249 aprendices + 3 encargados + 1 admin
    totalApprentices: 1249,
    completeApprentices: 1248, // Con perfil institucional diligenciado (RF-01, RF-02)
    incompleteApprentices: 1, // Aprendiz nuevo pendiente de onboarding
    activeEncargados: encargadosList.length,
    activeAdmins: 1,
    uniqueParticipatingApprentices: 892, // Con al menos 1 asistencia confirmada
    participationCoverageRate: Math.round((892 / 1248) * 100), // 71%
    onboardingComplianceRate: ((1248 / 1249) * 100).toFixed(1), // 99.9%
    programsDistribution: [
      { name: 'Análisis y Desarrollo de Software (ADSO)', count: 524, pct: 42 },
      { name: 'Gestión Empresarial', count: 350, pct: 28 },
      { name: 'Contabilización de Operaciones', count: 224, pct: 18 },
      { name: 'Otras Especialidades Técnicas', count: 150, pct: 12 }
    ],
    modalityDistribution: [
      { name: 'Presencial', count: 948, pct: 76 },
      { name: 'Virtual', count: 225, pct: 18 },
      { name: 'Mixta (A Distancia)', count: 75, pct: 6 }
    ]
  };

  // Eventos para la agenda de hoy
  const todayEvents = relevantEvents.slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Encabezado Principal Ergonómico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] font-heading tracking-tight">
            Buenos días, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs md:text-sm text-[#64748b] mt-1">
            {currentUser.role === 'admin_general'
              ? 'Supervisión centralizada de actividades, métricas por área y censo de usuarios.'
              : `Aquí tienes el estado operativo y rendimiento de tus actividades del Área de ${currentUser.area}.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentUser.role === 'admin_general' ? (
            adminMetricTab !== 'usuarios' && activeTab !== 'users' ? (
              <button
                type="button"
                onClick={onOpenRegisterModal}
                className="btn btn-primary"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>Registrar Encargado</span>
              </button>
            ) : null
          ) : (
            <button
              type="button"
              onClick={() => onNavigateView && onNavigateView('upload')}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Crear desde Excel</span>
            </button>
          )}
        </div>
      </div>

      {/* Selector de Pestañas de Métricas (Solo Admin General) */}
      {currentUser.role === 'admin_general' && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e8f0] pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#e8edf3] rounded-xl border border-[#cbd5e1]/60">
            <button
              type="button"
              onClick={() => {
                setAdminMetricTab('global');
                if (activeTab === 'users') setActiveTab('dashboard');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                adminMetricTab === 'global'
                  ? 'bg-white text-[#1e293b] shadow-xs'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              Visión Global y Actividades
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminMetricTab('encargados');
                if (activeTab === 'users') setActiveTab('dashboard');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                adminMetricTab === 'encargados'
                  ? 'bg-white text-[#1e293b] shadow-xs'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              Métricas por Encargado
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminMetricTab('usuarios');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                adminMetricTab === 'usuarios'
                  ? 'bg-white text-[#1e293b] shadow-xs'
                  : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              Censo Demográfico
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#64748b]">
            <span className="w-2 h-2 rounded-full bg-[#15803d] inline-block animate-pulse" />
            <span className="font-medium font-heading">Supervisión en Tiempo Real</span>
          </div>
        </div>
      )}

      {currentUser.role === 'admin_general' && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-xs text-blue-950 block">Rol administrador · supervisión institucional</strong>
            <p className="text-[11px] text-blue-900 mt-0.5 leading-relaxed">
              Esta vista consolida actividades, métricas de encargados, asistencias y usuarios. No publica, abre ni cierra actividades: esas acciones pertenecen al Encargado de Área.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2 text-[10px] font-bold">
              <span className="px-2 py-1 rounded-lg bg-white/80 border border-blue-200 text-blue-800">Ver actividades</span>
              <span className="px-2 py-1 rounded-lg bg-white/80 border border-blue-200 text-blue-800">Métricas por encargado</span>
              <span className="px-2 py-1 rounded-lg bg-white/80 border border-blue-200 text-blue-800">Censo y auditoría</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 1: VISIÓN GLOBAL Y TODAS LAS ACTIVIDADES (RF-15) */}
      {/* ========================================================= */}
      {(currentUser.role !== 'admin_general' || adminMetricTab === 'global') && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Grid de 4 StatCards Ergonómicas Anti-Fatiga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* StatCard 1: Eventos Activos */}
            <div className="card-ergonomic p-5 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center absolute right-4 top-4 border border-blue-100">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#64748b] font-semibold">Eventos activos</div>
              <div className="font-heading text-3xl font-extrabold text-[#1e293b] my-2">
                {publishedEvents + inProgressEvents}
              </div>
              <div className="text-[11px] text-[#64748b] flex items-center gap-1 font-medium">
                <span className="text-[#15803d] font-bold">↗ +18%</span>
                <span>de {totalEvents} actividades totales</span>
              </div>
            </div>

            {/* StatCard 2: Aprendices Registrados */}
            <div className="card-ergonomic p-5 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center absolute right-4 top-4 border border-emerald-100">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#64748b] font-semibold">Aprendices registrados</div>
              <div className="font-heading text-3xl font-extrabold text-[#1e293b] my-2">
                {totalRegisteredLearners.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#64748b] flex items-center gap-1 font-medium">
                <span className="text-[#15803d] font-bold">↗ {userStats.onboardingComplianceRate}%</span>
                <span>perfiles oficiales completos</span>
              </div>
            </div>

            {/* StatCard 3: Asistencias Acreditadas */}
            <div className="card-ergonomic p-5 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center absolute right-4 top-4 border border-purple-100">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#64748b] font-semibold">Asistencias confirmadas</div>
              <div className="font-heading text-3xl font-extrabold text-[#1e293b] my-2">
                {totalAttendees}
              </div>
              <div className="text-[11px] text-[#64748b] flex items-center gap-1 font-medium">
                <span className="text-[#15803d] font-bold">↗ +12%</span>
                <span>con firma digital inmutable</span>
              </div>
            </div>

            {/* StatCard 4: Tasa de Asistencia */}
            <div className="card-ergonomic p-5 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center absolute right-4 top-4 border border-amber-100">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#64748b] font-semibold">Tasa de cumplimiento</div>
              <div className="font-heading text-3xl font-extrabold text-[#1e293b] my-2">
                {attendanceRate}%
              </div>
              <div className="text-[11px] text-[#64748b] flex items-center gap-1 font-medium">
                <span className="text-[#15803d] font-bold">↗ +6,2%</span>
                <span>promedio vs cupo Excel</span>
              </div>
            </div>

          </div>

          {/* Grid de 2 Columnas: Gráfico Comparativo + Agenda de Hoy */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4">
            
            {/* Panel de Gráfico: Asistencias vs Cupo Planificado */}
            <div className="card-ergonomic p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <strong className="text-sm font-heading font-bold text-[#1e293b]">
                    Asistencia vs. Meta Planificada (Excel)
                  </strong>
                  <p className="text-[11px] text-[#64748b]">
                    Comparativo de asistencias efectivas en sala vs. cupo proyectado
                  </p>
                </div>
                <select 
                  value={selectedWeekFilter}
                  onChange={(e) => setSelectedWeekFilter(e.target.value)}
                  className="text-xs text-[#475569] border border-[#cbd5e1] rounded-lg px-2.5 py-1 bg-[#f8fafc] focus:outline-none focus:border-[#15803d]"
                >
                  <option>Últimas 5 semanas</option>
                  <option>Trimestre I</option>
                  <option>Trimestre II</option>
                </select>
              </div>

              {/* Leyenda del Gráfico */}
              <div className="flex items-center justify-end gap-4 text-[11px] text-[#64748b] my-2">
                <span className="flex items-center gap-1.5">
                  <i className="w-2.5 h-2.5 rounded-xs bg-[#cbd5e1] inline-block" />
                  <span>Cupo Planificado (Meta)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="w-2.5 h-2.5 rounded-xs bg-[#15803d] inline-block" />
                  <span>Asistencias Confirmadas</span>
                </span>
              </div>

              {/* Área de Barras con Tonos Calmantes */}
              <div className="h-44 border-b border-[#e2e8f0] pt-2 flex items-end justify-around gap-2 px-4 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_40px,#f1f5f9_41px)]">
                {[
                  { label: 'Sem 1', cap: 80, att: 62 },
                  { label: 'Sem 2', cap: 90, att: 70 },
                  { label: 'Sem 3', cap: 75, att: 58 },
                  { label: 'Sem 4', cap: 100, att: 88 },
                  { label: 'Sem 5', cap: 95, att: 82 }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end flex-1">
                    <div className="flex items-end gap-1.5 h-[80%]">
                      <div 
                        style={{ height: `${item.cap}%` }} 
                        className="w-3.5 bg-[#cbd5e1] rounded-t-md transition-all duration-300 shadow-2xs" 
                        title={`Cupo Planificado (Excel): ${item.cap}`}
                      />
                      <div 
                        style={{ height: `${item.att}%` }} 
                        className="w-3.5 bg-[#15803d] rounded-t-md transition-all duration-300 shadow-2xs" 
                        title={`Asistencias Confirmadas: ${item.att}`}
                      />
                    </div>
                    <span className="text-[10px] text-[#64748b] font-mono font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel de Agenda de Hoy */}
            <div className="card-ergonomic p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <strong className="text-sm font-heading font-bold text-[#1e293b]">
                    Agenda de hoy
                  </strong>
                  <p className="text-[11px] text-[#64748b]">
                    Viernes, 14 de marzo • {todayEvents.length} actividades programadas
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateView && onNavigateView('events')}
                  className="btn-ghost text-xs text-[#475569] hover:text-[#1e293b] cursor-pointer"
                >
                  Ver todos
                </button>
              </div>

              <div className="space-y-2.5 my-auto">
                {todayEvents.map((evt, idx) => (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => onOpenEventDetail && onOpenEventDetail(evt)}
                    className="w-full text-left p-2.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1] hover:shadow-sm transition-all grid grid-cols-[48px_52px_1fr_20px] items-center gap-2.5 group cursor-pointer"
                  >
                    {/* Chip de Hora */}
                    <div className={`h-11 rounded-lg flex flex-col items-center justify-center text-center ${
                      idx === 1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      <strong className="text-xs font-bold font-mono leading-none">
                        {evt.schedule?.split(' - ')[0] || '14:00'}
                      </strong>
                      <small className="text-[8px] font-medium">horas</small>
                    </div>

                    {/* Portada o Indicador de Borrador */}
                    {evt.image ? (
                      <img 
                        src={evt.image} 
                        alt={evt.title} 
                        className="w-[52px] h-11 object-cover rounded-lg border border-[#e2e8f0]"
                      />
                    ) : (
                      <div className="w-[52px] h-11 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] flex items-center justify-center text-[#64748b]" title="Borrador sin portada">
                        <Sparkles className="w-4 h-4 text-[#15803d]" />
                      </div>
                    )}

                    {/* Texto del Evento */}
                    <div className="min-w-0">
                      <strong className="block text-xs text-[#1e293b] font-heading font-bold truncate group-hover:text-[#15803d] transition-colors">
                        {evt.title}
                      </strong>
                      <span className="flex items-center gap-1 text-[10px] text-[#64748b] mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-[#94a3b8] shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </span>
                      <small className="text-[10px] text-[#15803d] font-bold block mt-0.5 font-mono">
                        {evt.attendeesCount || 0} / {evt.capacity || 50} asistentes
                      </small>
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#15803d] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Tabla de Todas las Actividades con Filtros Centralizados (RF-15: Ver todas las actividades) */}
          <div className="card-ergonomic p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#e2e8f0] gap-3">
              <div>
                <strong className="text-sm font-heading font-bold text-[#1e293b]">
                  Supervisión de Actividades Institucionales ({filteredEvents.length})
                </strong>
                <p className="text-[11px] text-[#64748b]">
                  Control de ciclo de vida de 4 estados, asistencia acumulada y cupo planificado en Excel.
                </p>
              </div>

              {/* Filtros rápidos de Área y Estado */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedAreaFilter}
                  onChange={(e) => setSelectedAreaFilter(e.target.value)}
                  className="text-xs text-[#334155] border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 bg-[#f8fafc] focus:outline-none focus:border-[#15803d] font-medium"
                >
                  <option value="Todas">Todas las Áreas</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="text-xs text-[#334155] border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 bg-[#f8fafc] focus:outline-none focus:border-[#15803d] font-medium"
                >
                  <option value="Todos">Todos los Estados</option>
                  <option value="publicado">Publicado</option>
                  <option value="en_curso">En Curso</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="borrador">Borrador</option>
                </select>

                <button
                  type="button"
                  onClick={() => onNavigateView && onNavigateView('events')}
                  className="btn btn-secondary text-xs py-1.5"
                >
                  <span>Ver en Cartelera</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] text-[#475569] bg-[#f8fafc] font-bold uppercase tracking-wider border-b border-[#e2e8f0]">
                    <th className="py-3 px-3">ACTIVIDAD / ÁREA</th>
                    <th className="py-3 px-3">FECHA Y HORA</th>
                    <th className="py-3 px-3">ESTADO</th>
                    <th className="py-3 px-3">ASISTENCIA / CAPACIDAD</th>
                    <th className="py-3 px-3 text-right">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-[#334155]">
                  {filteredEvents.map(evt => {
                    const capacity = evt.capacity || 50;
                    const count = evt.attendeesCount || 0;
                    const percent = Math.min(100, Math.round((count / capacity) * 100));

                    const getStatusBadge = (st) => {
                      switch (st) {
                        case 'publicado':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0]">Publicado</span>;
                        case 'en_curso':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">En Curso</span>;
                        case 'finalizado':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Finalizado</span>;
                        default:
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200">Borrador</span>;
                      }
                    };

                    return (
                      <tr key={evt.id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] bg-slate-100 text-[#475569] px-1.5 py-0.5 rounded border border-[#cbd5e1] font-bold">
                              {evt.area}
                            </span>
                            <span className="font-heading font-bold text-[#1e293b]">{evt.title}</span>
                          </div>
                          <div className="text-[11px] text-[#64748b] mt-0.5">{evt.location}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-[#475569]">
                          {evt.date} • {evt.schedule?.split(' - ')[0] || '14:00'}
                        </td>
                        <td className="py-3 px-3">
                          {getStatusBadge(evt.status)}
                        </td>
                        <td className="py-3 px-3">
                          <div className="w-36 space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <strong className="text-[#1e293b]">{count}</strong>
                              <span className="text-[#64748b]">/ {capacity} meta</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#e2e8f0] overflow-hidden">
                              <div 
                                style={{ width: `${percent}%` }} 
                                className="h-full bg-[#15803d] rounded-full"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onOpenEventDetail && onOpenEventDetail(evt)}
                            className="p-1 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0] cursor-pointer"
                            title="Ver detalle del evento"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 2: MÉTRICAS DE CADA ENCARGADO DE ÁREA (RF-15)    */}
      {/* ========================================================= */}
      {currentUser.role === 'admin_general' && adminMetricTab === 'encargados' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Cabecera de la Sección de Encargados */}
          <div className="p-5 card-ergonomic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1e293b] font-heading">
                  Rendimiento y Desempeño Operativo por Encargado de Área
                </h2>
                <span className="text-[10px] bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2.5 py-0.5 rounded-md font-bold font-heading uppercase tracking-wide">
                  Gestión Operativa
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                Supervisión de actividades creadas vía Excel, tasa de publicación, aforo total convocado y porcentaje de cumplimiento frente al plan oficial.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenInviteModal}
              className="btn btn-primary text-xs shrink-0"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Invitar Nuevo Encargado</span>
            </button>
          </div>

          {/* Tarjetas Resumen de KPIs por Encargado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-ergonomic p-4">
              <span className="text-[11px] text-[#64748b] font-medium block">Encargados Asignados</span>
              <strong className="text-2xl font-extrabold text-[#1e293b] font-heading block my-1">
                {encargadosList.length} Áreas
              </strong>
              <span className="text-[10px] text-[#15803d] font-bold">100% con asignación activa</span>
            </div>

            <div className="card-ergonomic p-4">
              <span className="text-[11px] text-[#64748b] font-medium block">Total Actividades de Áreas</span>
              <strong className="text-2xl font-extrabold text-[#1e293b] font-heading block my-1">
                {events.length} Eventos
              </strong>
              <span className="text-[10px] text-[#64748b]">Cargados vía Excel / Manual</span>
            </div>

            <div className="card-ergonomic p-4">
              <span className="text-[11px] text-[#64748b] font-medium block">Asistencias Convocadas</span>
              <strong className="text-2xl font-extrabold text-[#1e293b] font-heading block my-1">
                {totalAttendees} Aprendices
              </strong>
              <span className="text-[10px] text-[#15803d] font-bold">Acreditados en sala</span>
            </div>

            <div className="card-ergonomic p-4">
              <span className="text-[11px] text-[#64748b] font-medium block">Cumplimiento Promedio</span>
              <strong className="text-2xl font-extrabold text-[#1e293b] font-heading block my-1">
                {attendanceRate}%
              </strong>
              <span className="text-[10px] text-[#15803d] font-bold">↗ Meta institucional superada</span>
            </div>
          </div>

          {/* Tabla Comparativa de Rendimiento por Encargado */}
          <div className="card-ergonomic p-5">
            <div className="pb-3 border-b border-[#e2e8f0]">
              <strong className="text-sm font-heading font-bold text-[#1e293b]">
                Tabla Comparativa de Encargados de Área
              </strong>
              <p className="text-[11px] text-[#64748b]">
                Desglose analítico de actividades gestionadas, estado operativo y tasa de cumplimiento por responsable.
              </p>
            </div>

            {/* Vista Móvil: Tarjetas de Encargados (<sm) */}
            <div className="block sm:hidden space-y-3 mt-3">
              {encargadosMetrics.map(enc => (
                <div key={enc.id} className="p-4 rounded-xl border border-[#e2e8f0] bg-white shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img src={enc.avatar} alt={enc.name} className="w-9 h-9 rounded-lg object-cover border border-[#e2e8f0]" />
                      <div>
                        <strong className="text-xs font-bold text-[#1e293b] font-heading block">{enc.name}</strong>
                        <span className="text-[10px] text-[#15803d] font-bold font-mono">Área: {enc.area}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAreaFilter(enc.area);
                        setAdminMetricTab('global');
                      }}
                      className="btn btn-secondary text-[10px] py-1 px-2 cursor-pointer shrink-0"
                    >
                      <span>Ver</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#f8fafc] p-2.5 rounded-xl border border-[#e2e8f0]">
                    <div>
                      <span className="text-[10px] text-[#64748b] uppercase font-bold block">Actividades</span>
                      <strong className="font-mono text-xs text-[#1e293b]">{enc.totalEvents} creadas</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748b] uppercase font-bold block">Aforo / Cupo</span>
                      <span className="font-mono text-xs text-[#1e293b] font-bold">{enc.totalAttendees} / {enc.totalCapacity}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-[#e2e8f0]/60 flex items-center justify-between">
                      <span className="text-[10px] text-[#64748b] uppercase font-bold">Efectividad</span>
                      <strong className="text-[#15803d] font-mono text-xs">{enc.complianceRate}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-1.5 py-0.5 rounded font-bold">
                      {enc.published} Publicados
                    </span>
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                      {enc.inProgress} En Curso
                    </span>
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-bold">
                      {enc.finished} Fin
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista Desktop / Tablet: Tabla (≥sm) */}
            <div className="hidden sm:block overflow-x-auto mt-3">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] text-[#475569] bg-[#f8fafc] font-bold uppercase tracking-wider border-b border-[#e2e8f0]">
                    <th className="py-3 px-3">ENCARGADO / ÁREA</th>
                    <th className="py-3 px-3">ACTIVIDADES</th>
                    <th className="py-3 px-3">ESTADOS (PUB / CURSO / FIN)</th>
                    <th className="py-3 px-3">AFORO ASISTENTES / CUPO</th>
                    <th className="py-3 px-3">PROMEDIO / ACTIVIDAD</th>
                    <th className="py-3 px-3">TASA DE CUMPLIMIENTO</th>
                    <th className="py-3 px-3 text-right">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-[#334155]">
                  {encargadosMetrics.map(enc => (
                    <tr key={enc.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img src={enc.avatar} alt={enc.name} className="w-8 h-8 rounded-lg object-cover border border-[#e2e8f0]" />
                          <div>
                            <strong className="text-xs font-bold text-[#1e293b] font-heading block">{enc.name}</strong>
                            <span className="text-[10px] text-[#15803d] font-bold font-mono">Área: {enc.area}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-xs text-[#1e293b]">
                        {enc.totalEvents} actividades
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                          <span className="bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-1.5 py-0.5 rounded font-bold" title="Publicados">
                            {enc.published} P
                          </span>
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold" title="En Curso">
                            {enc.inProgress} C
                          </span>
                          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-bold" title="Finalizados">
                            {enc.finished} F
                          </span>
                          {enc.draft > 0 && (
                            <span className="bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded" title="Borradores">
                              {enc.draft} B
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-mono text-xs">
                          <strong className="text-[#1e293b]">{enc.totalAttendees}</strong>
                          <span className="text-[#64748b]"> / {enc.totalCapacity} cupos</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-xs font-medium text-[#475569]">
                        ~{enc.avgAttendees} aprendices
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <strong className="text-[#15803d]">{enc.complianceRate}%</strong>
                            <span className="text-[#64748b]">efectividad</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#e2e8f0] overflow-hidden">
                            <div 
                              style={{ width: `${enc.complianceRate}%` }} 
                              className="h-full bg-[#15803d] rounded-full"
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAreaFilter(enc.area);
                            setAdminMetricTab('global');
                          }}
                          className="btn btn-secondary text-[11px] py-1 px-2.5 cursor-pointer"
                          title={`Filtrar eventos del área de ${enc.area}`}
                        >
                          <span>Ver Actividades</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grid de Tarjetas de Perfil de Encargado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {encargadosMetrics.map(enc => (
              <div key={enc.id} className="p-4 card-ergonomic space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={enc.avatar} alt={enc.name} className="w-9 h-9 rounded-xl object-cover border border-[#e2e8f0]" />
                    <div>
                      <h4 className="font-bold text-xs text-[#1e293b] font-heading">{enc.name}</h4>
                      <span className="font-mono text-[9px] text-[#15803d] font-bold">Líder {enc.area}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#15803d] bg-[#eafaf1] border border-[#bbf7d0] px-2 py-0.5 rounded font-bold">
                    {enc.complianceRate}%
                  </span>
                </div>

                <p className="text-[11px] text-[#475569] leading-relaxed line-clamp-2">
                  {enc.description}
                </p>

                <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#64748b]">Total asistencias en sala:</span>
                  <strong className="text-[#1e293b] font-bold">{enc.totalAttendees}</strong>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 3: MÉTRICAS DE USUARIOS DE LA PLATAFORMA (RF-15) */}
      {/* ========================================================= */}
      {currentUser.role === 'admin_general' && adminMetricTab === 'usuarios' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Cabecera de la Sección de Usuarios */}
          <div className="p-5 card-ergonomic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1e293b] font-heading">
                  Censo Institucional y Métricas de Usuarios de la Plataforma
                </h2>
                <span className="text-[10px] bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2.5 py-0.5 rounded-md font-bold font-heading uppercase tracking-wide">
                  Censo Institucional
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                Supervisión del universo de aprendices, estado de perfiles institucionales activos, directorio de encargados y participaciones auditadas.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-[#64748b] bg-[#f8fafc] px-3 py-1.5 rounded-xl border border-[#e2e8f0] shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse" />
              <span>Regional D.C. • C.E.E.T.</span>
            </div>
          </div>

          {/* Grid de 4 StatCards de Censo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="card-ergonomic p-4 relative">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#1e293b] flex items-center justify-center absolute right-4 top-4 border border-slate-200">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs text-[#64748b] font-semibold">Total Censo Usuarios</span>
              <strong className="text-2xl font-extrabold text-[#1e293b] font-heading block my-1">
                {userStats.totalUsers.toLocaleString()}
              </strong>
              <span className="text-[11px] text-[#64748b]">Aprendices + Encargados + Admin</span>
            </div>

            <div className="card-ergonomic p-4 relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center absolute right-4 top-4 border border-[#bbf7d0]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs text-[#64748b] font-semibold">Perfiles Oficiales Activos</span>
              <strong className="text-2xl font-extrabold text-[#15803d] font-heading block my-1">
                {userStats.completeApprentices.toLocaleString()}
              </strong>
              <span className="text-[11px] text-[#15803d] font-bold">
                ↗ {userStats.onboardingComplianceRate}% con datos completos
              </span>
            </div>

            <div className="card-ergonomic p-4 relative">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center absolute right-4 top-4 border border-amber-200">
                <AlertCircle className="w-4 h-4" />
              </div>
              <span className="text-xs text-[#64748b] font-semibold">Onboarding Pendiente</span>
              <strong className="text-2xl font-extrabold text-amber-700 font-heading block my-1">
                {userStats.incompleteApprentices}
              </strong>
              <span className="text-[11px] text-amber-700 font-medium">
                Bloqueo preventivo en primer ingreso
              </span>
            </div>

            <div className="card-ergonomic p-4 relative">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center absolute right-4 top-4 border border-blue-100">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs text-[#64748b] font-semibold">Aprendices Participantes</span>
              <strong className="text-2xl font-extrabold text-blue-700 font-heading block my-1">
                {userStats.uniqueParticipatingApprentices}
              </strong>
              <span className="text-[11px] text-[#64748b]">
                {userStats.participationCoverageRate}% con asistencia acreditada
              </span>
            </div>

          </div>

          {/* Grid de 2 Paneles: Distribución por Programa y Modalidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Panel 1: Distribución por Programa de Formación */}
            <div className="card-ergonomic p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                <div>
                  <h4 className="text-xs font-bold text-[#1e293b] font-heading uppercase tracking-wide">
                    Distribución por Programa de Formación
                  </h4>
                  <p className="text-[11px] text-[#64748b]">
                    Población de aprendices adscritos al Centro de Formación
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#15803d] font-bold">100% Titulada</span>
              </div>

              <div className="space-y-3 pt-1">
                {userStats.programsDistribution.map((prog, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#334155] font-medium truncate">{prog.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <strong className="text-[#1e293b]">{prog.count}</strong>
                        <span className="text-[#64748b] text-[10px]">({prog.pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
                      <div 
                        style={{ width: `${prog.pct}%` }} 
                        className={`h-full rounded-full ${
                          idx === 0 ? 'bg-[#15803d]' : idx === 1 ? 'bg-blue-600' : idx === 2 ? 'bg-purple-600' : 'bg-slate-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 2: Distribución por Modalidad de Formación */}
            <div className="card-ergonomic p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                <div>
                  <h4 className="text-xs font-bold text-[#1e293b] font-heading uppercase tracking-wide">
                    Distribución por Modalidad y Cobertura
                  </h4>
                  <p className="text-[11px] text-[#64748b]">
                    Canal de asistencia presencial y virtual oficial
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#15803d] font-bold">Activo</span>
              </div>

              <div className="space-y-3 pt-1">
                {userStats.modalityDistribution.map((mod, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#334155] font-medium">{mod.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <strong className="text-[#1e293b]">{mod.count}</strong>
                        <span className="text-[#64748b] text-[10px]">({mod.pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
                      <div 
                        style={{ width: `${mod.pct}%` }} 
                        className="h-full bg-[#15803d] rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] mt-3 flex items-center justify-between text-[11px]">
                <span className="text-[#64748b]">Nivel Tecnólogo: <strong className="text-[#1e293b]">68%</strong></span>
                <span className="text-[#64748b]">Nivel Técnico: <strong className="text-[#1e293b]">32%</strong></span>
              </div>
            </div>

          </div>

          {/* Tarjeta de Enlace Rápido hacia Gestión de Aprendices y Encargados */}
          <div className="card-ergonomic p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#f8fafc] to-[#eafaf1] border border-[#bbf7d0]">
            <div>
              <h3 className="text-sm font-bold text-[#14532d] font-heading flex items-center gap-2">
                <Users className="w-4 h-4 text-[#15803d]" />
                <span>¿Deseas gestionar aprendices o asignar encargados?</span>
              </h3>
              <p className="text-xs text-[#166534] mt-0.5">
                Accede a los módulos dedicados de Gestión de Aprendices y Directorio de Encargados de Área.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateView && onNavigateView('aprendices')}
              className="btn btn-primary text-xs py-2 px-4 shrink-0 shadow-sm self-start sm:self-auto cursor-pointer"
            >
              <span>Ir a Gestión de Aprendices ➔</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
