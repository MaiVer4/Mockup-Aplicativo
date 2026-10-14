import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Link, 
  Copy, 
  Check, 
  Plus, 
  ShieldCheck, 
  UserPlus, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { AREAS } from '../data/mockData';

export default function InviteLinkModal({ isOpen, onClose }) {
  const { 
    inviteLinks, 
    generateInviteLink, 
    revokeInviteLink, 
    switchUser, 
    users, 
    addToast 
  } = useApp();

  const [selectedArea, setSelectedArea] = useState('Cultura');
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    addToast('Enlace Copiado', 'URL de invitación copiada al portapapeles.', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    generateInviteLink(selectedArea);
  };

  const handleSimulateRegistration = (link) => {
    // Buscar si ya existe un encargado para esa área o usar el más afín
    const enc = users.find(u => u.role === 'admin_area' && u.area === link.area) || users.find(u => u.role === 'admin_area');
    if (enc) {
      switchUser(enc.id);
      addToast(
        'Simulación de Registro Exitosa',
        `Has ingresado como ${enc.name} mediante el enlace exclusivo de ${link.area}.`,
        'success'
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0e2738] text-[#c4f246] flex items-center justify-center shadow-xs">
              <Link className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1e293b] font-heading">
                  Enlaces Exclusivos de Registro // Encargados
                </h3>
                <span className="font-mono text-[9px] bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-1.5 py-0.5 rounded-lg font-bold">
                  SEGURIDAD // ENLACES ACTIVOS
                </span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Los administradores de área solo acceden mediante invitación multiuso generada por el Admin General.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 overflow-y-auto overscroll-contain space-y-5 text-xs flex-1">
          
          {/* Generador de nuevo enlace */}
          <form onSubmit={handleCreate} className="p-4 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Asignar Área Institucional SENA
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs bg-white text-[#1e293b] focus:outline-none focus:border-[#15803d] font-medium"
              >
                {AREAS.map(a => <option key={a} value={a}>Área: {a}</option>)}
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2.5 mt-auto rounded-xl text-xs font-semibold bg-[#15803d] text-white hover:bg-[#166534] transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generar Nuevo Enlace</span>
            </button>
          </form>

          {/* Listado de Enlaces Activos */}
          <div>
            <h4 className="font-bold text-[#1e293b] text-xs mb-2.5 font-heading">
              Enlaces Vigentes en la Plataforma ({inviteLinks.length})
            </h4>

            <div className="border border-[#e2e8f0] rounded-2xl overflow-hidden divide-y divide-[#e2e8f0]">
              {inviteLinks.map(link => {
                const isCopied = copiedId === link.id;
                const isRevoked = link.status === 'revoked';

                return (
                  <div key={link.id} className="p-4 bg-white hover:bg-[#f8fafc] transition-colors space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1e293b] text-xs">
                          Área: {link.area}
                        </span>
                        <span className={`font-mono text-[9px] px-2 py-0.5 rounded-lg font-bold border ${
                          isRevoked 
                            ? 'bg-rose-50 text-rose-700 border-rose-200' 
                            : 'bg-[#eafaf1] text-[#15803d] border-[#bbf7d0]'
                        }`}>
                          {isRevoked ? 'REVOCADO' : 'ACTIVO // MULTIUSO'}
                        </span>
                      </div>

                      <span className="text-[10px] text-[#64748b] font-mono">
                        Creado: {link.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#f8fafc] p-2.5 rounded-xl border border-[#e2e8f0] font-mono text-[11px] text-[#334155] truncate">
                      <span className="truncate flex-1">{link.url}</span>
                      <button
                        onClick={() => handleCopy(link)}
                        disabled={isRevoked}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#cbd5e1] hover:border-[#94a3b8] text-[#1e293b] font-sans text-[10px] font-semibold inline-flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-[#15803d]" /> : <Copy className="w-3 h-3 text-[#64748b]" />}
                        <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-[#64748b]">
                        Usos acumulados: <strong className="text-[#1e293b] font-mono">{link.usesCount || 0}</strong>
                      </span>

                      <div className="flex items-center gap-3">
                        {!isRevoked && (
                          <>
                            <button
                              onClick={() => handleSimulateRegistration(link)}
                              className="text-[11px] text-[#15803d] hover:text-[#166534] font-semibold inline-flex items-center gap-1 hover:underline"
                            >
                              <UserPlus className="w-3 h-3" />
                              <span>Simular Registro con este enlace</span>
                            </button>

                            <button
                              onClick={() => revokeInviteLink(link.id)}
                              className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold hover:underline"
                            >
                              Revocar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Pie de modal */}
        <div className="px-5 py-3 border-t border-[#e2e8f0] flex justify-end bg-[#f8fafc]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#334155] hover:bg-[#f1f5f9] transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
