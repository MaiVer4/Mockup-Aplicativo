import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Download,
  Clock,
  Users
} from 'lucide-react';
import { 
  validateParticipantsBeforeExport, 
  exportOfficialSenaAttendanceSheet 
} from '../utils/excelHelper';

export default function ExportValidationModal({ isOpen, onClose, event }) {
  const { getEventParticipants, addToast } = useApp();

  if (!isOpen || !event) return null;

  const participants = getEventParticipants(event.id);
  const validation = validateParticipantsBeforeExport(participants);

  const handleDownload = () => {
    if (participants.length === 0) {
      addToast('Sin Asistentes', 'No hay aprendices registrados para exportar.', 'warning');
      return;
    }

    exportOfficialSenaAttendanceSheet(event, participants);
    addToast(
      'Exportación Generada con Éxito',
      `Se ha descargado la plantilla oficial GOR-F-013 con ${participants.length} registros auditados.`,
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#eafaf1] text-[#15803d] flex items-center justify-center border border-[#bbf7d0] shadow-xs">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1e293b] font-heading">
                  Pre-Validación & Exportación Oficial
                </h3>
                <span className="text-[10px] bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2 py-0.5 rounded-md font-bold font-heading">
                  FORMATO GOR-F-013
                </span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Verificación de integridad, campos normativos y marcas temporales antes de emitir el reporte.
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
        <div className="p-5 overflow-y-auto overscroll-contain space-y-4 text-xs flex-1">
          
          {/* Tarjeta de Metadatos del Evento */}
          <div className="p-4 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#64748b] uppercase tracking-wider font-bold">
                ACTIVIDAD SELECCIONADA
              </span>
              <span className="font-mono text-[10px] bg-white border border-[#cbd5e1] px-2 py-0.5 rounded-lg text-[#1e293b] font-semibold">
                {event.code}
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#1e293b] font-heading">{event.title}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#475569] pt-2 border-t border-[#e2e8f0]">
              <div>
                <span className="text-[#64748b] block text-[10px]">Área</span>
                <span className="font-medium text-[#1e293b]">{event.area}</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[10px]">Fecha</span>
                <span className="font-medium text-[#1e293b]">{event.date}</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[10px]">Responsable</span>
                <span className="font-medium text-[#1e293b]">{event.responsibleName}</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[10px]">Total Asistentes</span>
                <span className="font-bold text-[#15803d]">{participants.length} acreditados</span>
              </div>
            </div>
          </div>

          {/* Resultado de la Auditoría */}
          {validation.isValid ? (
            <div className="p-4 rounded-2xl bg-[#eafaf1] border border-[#bbf7d0] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-[#14532d] text-xs font-heading">Auditoría Superada con Éxito</h5>
                <p className="text-[11px] text-[#166534] mt-0.5 leading-relaxed">
                  El 100% de los registros disponen de nombre completo, tipo y número de documento único, género, ficha y firma temporal digital del servidor.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-rose-900 text-xs font-heading">Inconsistencias Detectadas</h5>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-rose-700">
                  {validation.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Advertencias Menores si existen */}
          {validation.warnings.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] space-y-1">
              <span className="font-bold block">Observaciones no bloqueantes:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-amber-700">
                {validation.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Previsualización de Muestra */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#1e293b] text-xs font-heading">
                Previsualización de Filas Oficiales ({participants.length} registros listos)
              </span>
              <span className="text-[10px] text-[#64748b] font-mono font-bold">
                FORMATO GOR-F-013
              </span>
            </div>

            <div className="border border-[#e2e8f0] rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-[#f8fafc] text-[#475569] font-bold border-b border-[#e2e8f0]">
                  <tr>
                    <th className="p-2.5 w-8">#</th>
                    <th className="p-2.5">Aprendiz</th>
                    <th className="p-2.5">Doc.</th>
                    <th className="p-2.5">Ficha</th>
                    <th className="p-2.5">Programa</th>
                    <th className="p-2.5">Firma Temporal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-[#334155]">
                  {participants.slice(0, 4).map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="p-2.5 font-mono text-[#64748b]">{idx + 1}</td>
                      <td className="p-2.5 font-semibold text-[#1e293b]">{p.name}</td>
                      <td className="p-2.5 font-mono text-[#475569]">{p.documentType} {p.documentNumber}</td>
                      <td className="p-2.5 font-mono text-[#475569]">{p.ficha}</td>
                      <td className="p-2.5 truncate max-w-[150px]">{p.program}</td>
                      <td className="p-2.5 font-mono text-[10px] text-[#15803d] font-semibold whitespace-nowrap">
                        {p.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {participants.length > 4 && (
              <p className="text-[10px] text-[#64748b] mt-1.5 italic text-center">
                + {participants.length - 4} registros adicionales incluidos en el archivo XLSX final.
              </p>
            )}
          </div>

        </div>

        {/* Pie de modal */}
        <div className="px-5 py-3.5 border-t border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#334155] hover:bg-[#f1f5f9] transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleDownload}
            disabled={!validation.isValid}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-colors ${
              validation.isValid
                ? 'bg-[#15803d] text-white hover:bg-[#166534]'
                : 'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed border border-[#e2e8f0]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Formato GOR-F-013 (.xlsx)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
