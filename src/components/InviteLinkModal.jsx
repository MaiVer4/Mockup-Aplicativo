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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
              <Link className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-950">
                  Enlaces Exclusivos de Registro // Encargados
                </h3>
                <span className="font-mono text-[9px] bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded font-semibold">
                  SEGURIDAD // ENLACES ACTIVOS
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Los administradores de área solo acceden mediante invitación multiuso generada por el Admin General.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
          
          {/* Generador de nuevo enlace */}
          <form onSubmit={handleCreate} className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Asignar Área Institucional SENA
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900 font-medium"
              >
                {AREAS.map(a => <option key={a} value={a}>Área: {a}</option>)}
              </select>
            </div>

            <button
              type="submit"
              className="btn-tactile w-full sm:w-auto px-4 py-2 mt-auto rounded-lg text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generar Nuevo Enlace</span>
            </button>
          </form>

          {/* Listado de Enlaces Activos */}
          <div>
            <h4 className="font-bold text-zinc-900 text-xs mb-2">
              Enlaces Vigentes en la Plataforma ({inviteLinks.length})
            </h4>

            <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200">
              {inviteLinks.map(link => {
                const isCopied = copiedId === link.id;
                const isRevoked = link.status === 'revoked';

                return (
                  <div key={link.id} className="p-3.5 bg-white hover:bg-zinc-50/50 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-950 text-xs">
                          Área: {link.area}
                        </span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                          isRevoked 
                            ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {isRevoked ? 'REVOCADO' : 'ACTIVO // MULTIUSO'}
                        </span>
                      </div>

                      <span className="text-[10px] text-zinc-400 font-mono">
                        Creado: {link.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-zinc-100 p-2 rounded-lg font-mono text-[11px] text-zinc-600 truncate">
                      <span className="truncate flex-1">{link.url}</span>
                      <button
                        onClick={() => handleCopy(link)}
                        disabled={isRevoked}
                        className="px-2 py-1 rounded bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-700 font-sans text-[10px] font-medium inline-flex items-center gap-1 shrink-0 transition-colors"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-zinc-500">
                        Usos acumulados: <strong className="text-zinc-800 font-mono">{link.usesCount || 0}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        {!isRevoked && (
                          <>
                            <button
                              onClick={() => handleSimulateRegistration(link)}
                              className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 hover:underline"
                            >
                              <UserPlus className="w-3 h-3" />
                              <span>Simular Registro con este enlace</span>
                            </button>

                            <button
                              onClick={() => revokeInviteLink(link.id)}
                              className="text-[11px] text-rose-600 hover:text-rose-700 font-medium hover:underline"
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
        <div className="px-5 py-3 border-t border-zinc-200 flex justify-end bg-zinc-50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
