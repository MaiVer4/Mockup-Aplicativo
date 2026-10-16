import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Calendar 
} from 'lucide-react';
import { AREAS } from '../data/mockData';

export default function EncargadosView({ onOpenRegisterModal }) {
  const { users, toggleUserStatus, events } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('ALL');

  const encargados = users.filter(u => u.role === 'admin_area');

  const filteredEncargados = encargados.filter(enc => {
    if (selectedArea !== 'ALL' && enc.area !== selectedArea) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = enc.name?.toLowerCase().includes(term);
      const matchEmail = enc.email?.toLowerCase().includes(term);
      const matchArea = enc.area?.toLowerCase().includes(term);
      if (!matchName && !matchEmail && !matchArea) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] font-heading tracking-tight">
              Encargados de Área
            </h1>
            <span className="text-[10px] bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2.5 py-0.5 rounded-md font-bold font-heading uppercase tracking-wide">
              Personal Autorizado • RF-14
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#64748b] mt-1">
            Directorio institucional de encargados asignados por la Coordinación para la gestión y publicación de actividades.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRegisterModal}
          className="btn btn-primary text-xs py-2 px-4 shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
        >
          <UserPlus className="w-4 h-4 text-white" />
          <span>+ Registrar Encargado</span>
        </button>
      </div>

      {/* Métricas de Cobertura */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-2xs">
          <span className="text-[10px] text-[#64748b] font-mono block uppercase font-bold">TOTAL ENCARGADOS</span>
          <strong className="text-2xl font-extrabold text-[#1e293b] font-heading block mt-0.5">{encargados.length}</strong>
          <small className="text-[10px] text-[#64748b]">Líderes de área asignados</small>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-2xs">
          <span className="text-[10px] text-[#64748b] font-mono block uppercase font-bold">ÁREAS BIENESTAR</span>
          <strong className="text-2xl font-extrabold text-[#15803d] font-heading block mt-0.5">6 de 6</strong>
          <small className="text-[10px] text-[#15803d] font-semibold">100% Cobertura institucional</small>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-2xs">
          <span className="text-[10px] text-[#64748b] font-mono block uppercase font-bold">CUENTAS ACTIVAS</span>
          <strong className="text-2xl font-extrabold text-[#0c2f3a] font-heading block mt-0.5">
            {encargados.filter(e => e.status !== 'inactivo').length}
          </strong>
          <small className="text-[10px] text-[#64748b]">Habilitados para publicar</small>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-2xs">
          <span className="text-[10px] text-[#64748b] font-mono block uppercase font-bold">REGISTRO OFICIAL</span>
          <strong className="text-2xl font-extrabold text-slate-700 font-heading block mt-0.5">RF-14</strong>
          <small className="text-[10px] text-[#64748b]">Emisión directa por Admin</small>
        </div>
      </div>

      {/* Directorio de Tarjetas */}
      <div className="card-ergonomic p-5 space-y-4">
        
        {/* Barra de Búsqueda y Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#e2e8f0] gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar encargado por nombre, área o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
              />
            </div>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none"
            >
              <option value="ALL">Todas las Áreas</option>
              {AREAS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de Tarjetas de Encargados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEncargados.map(enc => {
            const areaEventsCount = events.filter(e => e.area === enc.area).length;

            return (
              <div 
                key={enc.id} 
                className="p-4 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] space-y-3 hover:border-[#15803d]/40 hover:bg-white transition-all shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <img 
                    src={enc.avatar} 
                    alt={enc.name} 
                    className="w-11 h-11 rounded-2xl object-cover border border-[#cbd5e1] shrink-0" 
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#1e293b] font-heading truncate">{enc.name}</h4>
                    <span className="font-mono text-[10px] text-[#15803d] bg-[#eafaf1] border border-[#bbf7d0] px-2 py-0.5 rounded-md font-bold inline-block mt-0.5">
                      Área: {enc.area}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-[#475569] pt-2 border-t border-[#e2e8f0]/80">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                    <span className="truncate font-mono text-[10px]">{enc.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                    <span className="text-[10px]">Actividades del Área: <strong>{areaEventsCount}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#e2e8f0]/60">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                    enc.status === 'inactivo' ? 'text-rose-600' : 'text-[#15803d]'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      enc.status === 'inactivo' ? 'bg-rose-500' : 'bg-[#15803d]'
                    }`} />
                    {enc.status === 'inactivo' ? 'Inactivo' : 'Activo'}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleUserStatus(enc.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                      enc.status === 'inactivo'
                        ? 'bg-[#15803d] text-white hover:bg-[#166534]'
                        : 'bg-white border border-[#cbd5e1] text-[#475569] hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    {enc.status === 'inactivo' ? 'Habilitar' : 'Desactivar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
