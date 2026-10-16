import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  UserPlus, 
  Search, 
  Trash2, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  IdCard, 
  Mail, 
  Phone, 
  Building2, 
  BookOpen, 
  Filter 
} from 'lucide-react';
import { PROGRAMAS_FORMACION } from '../data/mockData';

export default function LearnersManagementView({ onOpenCreateModal }) {
  const { users, toggleUserStatus, deleteApprentice, getApprenticeAuditData } = useApp();

  const [activeTab, setActiveTab] = useState('listado'); // 'listado' o 'consulta'
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Estado para el modal de confirmación de eliminación
  const [apprenticeToDelete, setApprenticeToDelete] = useState(null);

  // Consulta por documento
  const [apprenticeSearchDoc, setApprenticeSearchDoc] = useState('');
  const [searchedAuditResult, setSearchedAuditResult] = useState(null);

  // Filtrar exclusivamente aprendices
  const apprentices = users.filter(u => u.role === 'aprendiz');

  const filteredApprentices = apprentices.filter(apr => {
    if (statusFilter !== 'ALL' && apr.status !== statusFilter) return false;
    if (programFilter !== 'ALL' && apr.program !== programFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = apr.name?.toLowerCase().includes(term);
      const matchEmail = apr.email?.toLowerCase().includes(term);
      const matchDoc = apr.documentNumber?.toLowerCase().includes(term);
      const matchFicha = apr.ficha?.toLowerCase().includes(term);
      if (!matchName && !matchEmail && !matchDoc && !matchFicha) return false;
    }
    return true;
  });

  // Métricas rápidas
  const totalCount = apprentices.length;
  const presencialCount = apprentices.filter(a => a.modality === 'Presencial').length;
  const virtualCount = apprentices.filter(a => a.modality === 'Virtual').length;
  const activeCount = apprentices.filter(a => a.status !== 'inactivo').length;

  const handleConfirmDelete = () => {
    if (apprenticeToDelete) {
      deleteApprentice(apprenticeToDelete.id);
      setApprenticeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] font-heading tracking-tight">
              Gestión de Aprendices
            </h1>
            <span className="text-[10px] bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2.5 py-0.5 rounded-md font-bold font-heading uppercase tracking-wide">
              Comunidad Titulada
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#64748b] mt-1">
            Administración de cuentas de aprendices, altas manuales, control de accesos y revocaciones del sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="btn btn-primary text-xs py-2 px-4 shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
        >
          <UserPlus className="w-4 h-4 text-white" />
          <span>+ Crear Aprendiz</span>
        </button>
      </div>

      {/* 2. Métricas Clave de Aprendices */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-2xs">
          <span className="text-[10px] text-[#64748b] font-mono block uppercase font-bold">TOTAL APRENDICES</span>
          <strong className="text-2xl font-extrabold text-[#1e293b] font-heading block mt-0.5">{totalCount}</strong>
          <small className="text-[10px] text-[#64748b]">Registrados en plataforma</small>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-2xs">
          <span className="text-[10px] text-[#64748b] font-mono block uppercase font-bold">CUENTAS ACTIVAS</span>
          <strong className="text-2xl font-extrabold text-[#15803d] font-heading block mt-0.5">{activeCount}</strong>
          <small className="text-[10px] text-[#15803d] font-semibold">Habilitados para asistencia</small>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-2xs">
          <span className="text-[10px] text-[#64748b] font-mono block uppercase font-bold">MODALIDAD PRESENCIAL</span>
          <strong className="text-2xl font-extrabold text-[#0c2f3a] font-heading block mt-0.5">{presencialCount}</strong>
          <small className="text-[10px] text-[#64748b]">Jornadas diurna y nocturna</small>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-2xs">
          <span className="text-[10px] text-[#64748b] font-mono block uppercase font-bold">MODALIDAD VIRTUAL</span>
          <strong className="text-2xl font-extrabold text-slate-700 font-heading block mt-0.5">{virtualCount}</strong>
          <small className="text-[10px] text-[#64748b]">Formación a distancia</small>
        </div>
      </div>

      {/* 3. Sub-Pestañas de Aprendices */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e8f0] pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#e8edf3] rounded-xl border border-[#cbd5e1]/60">
          <button
            type="button"
            onClick={() => setActiveTab('listado')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              activeTab === 'listado'
                ? 'bg-white text-[#1e293b] shadow-xs'
                : 'text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            Directorio de Aprendices ({apprentices.length})
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('consulta')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              activeTab === 'consulta'
                ? 'bg-white text-[#1e293b] shadow-xs'
                : 'text-[#64748b] hover:text-[#1e293b]'
            }`}
          >
            Consulta Individual de Asistencias
          </button>
        </div>

        <div className="text-[11px] font-mono text-[#64748b]">
          Mostrando <strong>{filteredApprentices.length}</strong> de {totalCount} aprendices
        </div>
      </div>

      {/* 4. CONTENIDO: PESTAÑA DIRECTORIO Y TABLA */}
      {activeTab === 'listado' && (
        <div className="card-ergonomic p-5 space-y-4 animate-in fade-in duration-150">
          
          {/* Barra de Filtros y Búsqueda */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-[#e2e8f0] gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, documento, ficha o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
                />
              </div>

              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none max-w-xs truncate"
              >
                <option value="ALL">Todos los Programas</option>
                {PROGRAMAS_FORMACION.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="activo">Solo Activos</option>
                <option value="inactivo">Solo Inactivos</option>
              </select>
            </div>
          </div>

          {/* Vista Móvil: Tarjetas (<sm) */}
          <div className="block sm:hidden divide-y divide-[#e2e8f0] rounded-xl border border-[#e2e8f0] overflow-hidden bg-white">
            {filteredApprentices.map(apr => (
              <div key={apr.id} className="p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={apr.avatar} 
                      alt={apr.name} 
                      className="w-9 h-9 rounded-xl object-cover border border-[#e2e8f0] shrink-0" 
                    />
                    <div>
                      <strong className="text-xs text-[#1e293b] font-heading block">{apr.name}</strong>
                      <span className="text-[10px] text-[#64748b] font-mono">{apr.documentType || 'CC'} {apr.documentNumber}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                    apr.status === 'inactivo'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {apr.status === 'inactivo' ? 'Inactivo' : 'Activo'}
                  </span>
                </div>

                <div className="text-[11px] text-[#475569] space-y-0.5 bg-[#f8fafc] p-2 rounded-lg">
                  <div>Ficha: <strong className="font-mono text-[#15803d]">{apr.ficha || 'Sin ficha'}</strong></div>
                  <div className="truncate text-[#64748b]">{apr.program}</div>
                  <div className="text-[10px] font-mono text-[#64748b]">{apr.email}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <button
                    type="button"
                    onClick={() => toggleUserStatus(apr.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                      apr.status === 'inactivo'
                        ? 'bg-[#15803d] text-white hover:bg-[#166534]'
                        : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-[#475569] border border-[#cbd5e1]'
                    }`}
                  >
                    {apr.status === 'inactivo' ? 'Habilitar' : 'Desactivar'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setApprenticeToDelete(apr)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 text-[10px] font-bold flex items-center gap-1 transition-colors"
                    title="Eliminar cuenta de aprendiz"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredApprentices.length === 0 && (
              <div className="p-8 text-center text-xs text-[#64748b]">
                No se encontraron aprendices con los filtros seleccionados.
              </div>
            )}
          </div>

          {/* Vista Desktop / Tablet: Tabla (≥sm) */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-[#e2e8f0]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-[#64748b] text-[10px] font-mono uppercase font-bold border-b border-[#e2e8f0]">
                  <th className="py-2.5 px-3">APRENDIZ / IDENTIDAD</th>
                  <th className="py-2.5 px-3">DOCUMENTO</th>
                  <th className="py-2.5 px-3">FICHA & PROGRAMA</th>
                  <th className="py-2.5 px-3">MODALIDAD</th>
                  <th className="py-2.5 px-3">ESTADO</th>
                  <th className="py-2.5 px-3 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {filteredApprentices.map(apr => (
                  <tr key={apr.id} className="hover:bg-[#f8fafc] transition-colors">
                    
                    {/* Nombre y avatar */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={apr.avatar} 
                          alt={apr.name} 
                          className="w-8 h-8 rounded-xl object-cover border border-[#e2e8f0] shrink-0" 
                        />
                        <div className="min-w-0">
                          <strong className="text-xs text-[#1e293b] font-heading block truncate">{apr.name}</strong>
                          <span className="text-[10px] text-[#64748b] font-mono truncate block">{apr.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Documento */}
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#334155] whitespace-nowrap">
                      <span className="text-[#64748b] text-[10px] block">{apr.documentType || 'CC'}</span>
                      <span className="font-semibold">{apr.documentNumber}</span>
                    </td>

                    {/* Ficha & Programa */}
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] font-bold bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-1.5 py-0.2 rounded inline-block">
                        Ficha {apr.ficha || '2670192'}
                      </span>
                      <p className="text-[11px] text-[#475569] truncate max-w-[200px] mt-0.5" title={apr.program}>
                        {apr.program}
                      </p>
                    </td>

                    {/* Modalidad */}
                    <td className="py-2.5 px-3 text-[#334155]">
                      <span className="text-xs font-medium block">{apr.modality || 'Presencial'}</span>
                      <small className="text-[10px] text-[#64748b]">{apr.jornada || 'Diurna'}</small>
                    </td>

                    {/* Estado */}
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        apr.status === 'inactivo'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {apr.status === 'inactivo' ? 'Inactivo' : 'Activo'}
                      </span>
                    </td>

                    {/* Acciones: Toggle Estado y Eliminar */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(apr.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                            apr.status === 'inactivo'
                              ? 'bg-[#15803d] hover:bg-[#166534] text-white'
                              : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-[#475569] border border-[#cbd5e1]'
                          }`}
                        >
                          {apr.status === 'inactivo' ? 'Habilitar' : 'Desactivar'}
                        </button>

                        <button
                          type="button"
                          onClick={() => setApprenticeToDelete(apr)}
                          className="p-1 rounded-lg text-[#94a3b8] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar cuenta de aprendiz"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {filteredApprentices.length === 0 && (
              <div className="p-8 text-center text-xs text-[#64748b]">
                No se encontraron aprendices con los filtros seleccionados.
              </div>
            )}
          </div>

        </div>
      )}

      {/* 5. CONTENIDO: PESTAÑA CONSULTA POR DOCUMENTO */}
      {activeTab === 'consulta' && (
        <div className="card-ergonomic p-5 space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
            <div>
              <h3 className="text-sm font-bold text-[#1e293b] font-heading">
                Consulta Individual de Asistencias por Documento
              </h3>
              <p className="text-xs text-[#64748b] mt-0.5">
                Búsqueda rápida del historial de participación y asistencias por número de documento del aprendiz.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Documento aprendiz (ej. 1020495821)"
                  value={apprenticeSearchDoc}
                  onChange={(e) => setApprenticeSearchDoc(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d] w-64 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const res = getApprenticeAuditData(apprenticeSearchDoc.trim());
                  setSearchedAuditResult(res);
                }}
                className="btn btn-secondary text-xs py-1.5 cursor-pointer"
              >
                Consultar
              </button>
            </div>
          </div>

          {searchedAuditResult && (
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] font-bold flex items-center justify-center text-xs font-mono">
                    {searchedAuditResult.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <strong className="text-xs text-[#1e293b] font-heading block">{searchedAuditResult.name}</strong>
                    <span className="text-[10px] text-[#64748b] font-mono">Ficha: {searchedAuditResult.ficha} • Doc: {searchedAuditResult.documentNumber}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0]">
                  Total Asistencias: {searchedAuditResult.history?.length || 0}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="text-[#64748b] border-b border-[#e2e8f0]">
                      <th className="py-2 px-2">EVENTO</th>
                      <th className="py-2 px-2">TIPO REGISTRO</th>
                      <th className="py-2 px-2">FECHA Y HORA REGISTRADA</th>
                      <th className="py-2 px-2">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {searchedAuditResult.history?.map((h, i) => (
                      <tr key={i} className="text-[#334155]">
                        <td className="py-2 px-2 font-medium">{h.title}</td>
                        <td className="py-2 px-2 font-mono text-[#15803d]">{h.recordType}</td>
                        <td className="py-2 px-2 font-mono text-[#64748b]">{h.timestamp}</td>
                        <td className="py-2 px-2">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Acreditado
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {apprenticeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] w-full max-w-md p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#1e293b] font-heading">
                ¿Eliminar cuenta de aprendiz?
              </h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Estás a punto de eliminar a <strong>{apprenticeToDelete.name}</strong> (Doc: {apprenticeToDelete.documentNumber}). Esta acción revocará de inmediato sus credenciales y accesos al portal.
              </p>
              <p className="text-[11px] text-[#94a3b8] italic pt-1">
                Nota: Las actas oficiales de asistencia históricas conservarán su registro inmutable de participación.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => setApprenticeToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#334155] hover:bg-[#f1f5f9] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn btn-danger px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmar Eliminación</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
