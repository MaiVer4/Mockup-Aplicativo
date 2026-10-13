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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-950">
                  Pre-Validación & Exportación Oficial
                </h3>
                <span className="font-mono text-[9px] bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded font-semibold">
                  FORMATO // GOR-F-013
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Verificación de integridad, campos normativos y marcas temporales antes de emitir el reporte.
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
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* Tarjeta de Metadatos del Evento */}
          <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                ACTIVIDAD SELECCIONADA
              </span>
              <span className="font-mono text-[10px] bg-white border border-zinc-200 px-2 py-0.5 rounded text-zinc-700">
                {event.code}
              </span>
            </div>
            <h4 className="text-xs font-bold text-zinc-900">{event.title}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-zinc-600 pt-1 border-t border-zinc-200">
              <div>
                <span className="text-zinc-400 block text-[10px]">Área</span>
                <span className="font-medium text-zinc-800">{event.area}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px]">Fecha</span>
                <span className="font-medium text-zinc-800">{event.date}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px]">Responsable</span>
                <span className="font-medium text-zinc-800">{event.responsibleName}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px]">Total Asistentes</span>
                <span className="font-bold text-emerald-700">{participants.length} acreditados</span>
              </div>
            </div>
          </div>

          {/* Resultado de la Auditoría */}
          {validation.isValid ? (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-emerald-900 text-xs">Auditoría Superada con Éxito</h5>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  El 100% de los registros disponen de nombre completo, tipo y número de documento único, género, ficha y firma temporal digital del servidor.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-rose-900 text-xs">Inconsistencias Detectadas</h5>
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
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] space-y-1">
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
              <span className="font-semibold text-zinc-900 text-xs">
                Previsualización de Filas Oficiales ({participants.length} registros listos)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                FORMATO GOR-F-013
              </span>
            </div>

            <div className="border border-zinc-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-zinc-100 text-zinc-700 font-semibold border-b border-zinc-200">
                  <tr>
                    <th className="p-2 w-8">#</th>
                    <th className="p-2">Aprendiz</th>
                    <th className="p-2">Doc.</th>
                    <th className="p-2">Ficha</th>
                    <th className="p-2">Programa</th>
                    <th className="p-2">Firma Temporal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-600">
                  {participants.slice(0, 4).map((p, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50">
                      <td className="p-2 font-mono text-zinc-400">{idx + 1}</td>
                      <td className="p-2 font-medium text-zinc-900">{p.name}</td>
                      <td className="p-2 font-mono">{p.documentType} {p.documentNumber}</td>
                      <td className="p-2 font-mono">{p.ficha}</td>
                      <td className="p-2 truncate max-w-[150px]">{p.program}</td>
                      <td className="p-2 font-mono text-[10px] text-emerald-700 font-medium whitespace-nowrap">
                        {p.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {participants.length > 4 && (
              <p className="text-[10px] text-zinc-400 mt-1 italic text-center">
                + {participants.length - 4} registros adicionales incluidos en el archivo XLSX final.
              </p>
            )}
          </div>

        </div>

        {/* Pie de modal */}
        <div className="px-5 py-3 border-t border-zinc-200 flex items-center justify-between bg-zinc-50">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleDownload}
            disabled={!validation.isValid}
            className={`btn-tactile px-4 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-colors ${
              validation.isValid
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
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
