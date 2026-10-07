import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  Play, 
  Check, 
  Cpu, 
  ArrowRight, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  downloadSampleExcelTemplate, 
  parseExcelFile, 
  processRawRowsWithAI 
} from '../utils/excelHelper';
import { DEMO_EXCEL_DATA } from '../data/mockData';

export default function ExcelUploadView({ onSuccessNavigate }) {
  const { currentUser, importEventsFromAI, addToast } = useApp();

  const [isDragging, setIsDragging] = useState(false);
  const [analyzingState, setAnalyzingState] = useState(null); // null, 'reading', 'ai_processing', 'completed'
  const [extractedItems, setExtractedItems] = useState([]);
  const [fileName, setFileName] = useState('');

  // Simulación del procesamiento de IA
  const runAiExtractionPipeline = (rawRows, nameOfFile = 'archivo.xlsx') => {
    setFileName(nameOfFile);
    setAnalyzingState('reading');

    setTimeout(() => {
      setAnalyzingState('ai_processing');

      setTimeout(() => {
        const forcedArea = currentUser.role === 'admin_area' ? currentUser.area : null;
        const processed = processRawRowsWithAI(rawRows, forcedArea);
        setExtractedItems(processed);
        setAnalyzingState('completed');
        addToast(
          'Extracción completada',
          `Se abstrajeron ${processed.length} eventos estructurados con título, propósito e imagen temática.`,
          'success'
        );
      }, 1400);
    }, 800);
  };

  // Manejo de archivo real
  const handleFileChange = async (file) => {
    if (!file) return;
    try {
      const rows = await parseExcelFile(file);
      if (!rows || rows.length === 0) {
        addToast('Archivo sin filas', 'No se encontraron registros en el documento.', 'warning');
        return;
      }
      runAiExtractionPipeline(rows, file.name);
    } catch (err) {
      console.error(err);
      addToast('Error de lectura', 'No fue posible interpretar el archivo.', 'warning');
    }
  };

  const handleLoadDemo = () => {
    runAiExtractionPipeline(DEMO_EXCEL_DATA, 'Datos_Institucionales_2026.xlsx');
  };

  const handleConfirmImport = () => {
    if (extractedItems.length === 0) return;
    importEventsFromAI(extractedItems);
    setExtractedItems([]);
    setAnalyzingState(null);
    if (onSuccessNavigate) {
      onSuccessNavigate();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              INGESTA // PROCESAMIENTO IA
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">
            Carga de Archivos Excel & Extracción Semántica
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            El modelo analiza los datos tabulares para sintetizar el título, propósito formativo y asignar recursos visuales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadSampleExcelTemplate}
            className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Descargar Plantilla</span>
          </button>

          <button
            onClick={handleLoadDemo}
            className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-950 text-white hover:bg-zinc-800 transition-all shadow-xs"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Cargar Demo (1 Clic)</span>
          </button>
        </div>
      </div>

      {/* Zona Dropzone Minimalista */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFileChange(file);
        }}
        className={`p-8 rounded-xl border border-dashed text-center transition-all flex flex-col items-center justify-center bg-white ${
          isDragging
            ? 'border-zinc-950 bg-zinc-50 scale-[0.99]'
            : 'border-zinc-300 hover:border-zinc-400 shadow-xs'
        }`}
      >
        <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 mb-3">
          <FileSpreadsheet className="w-5 h-5" />
        </div>

        <h3 className="text-sm font-semibold text-zinc-900">
          Arrastra un archivo Excel o examina en tu equipo
        </h3>
        <p className="text-xs text-zinc-500 mt-1 mb-4 font-mono">
          FORMATOS ADMITIDOS: .XLSX, .XLS, .CSV
        </p>

        <label className="btn-tactile cursor-pointer px-4 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors shadow-xs flex items-center gap-1.5">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Examinar Archivo</span>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
        </label>
      </div>

      {/* Visualizador del Pipeline */}
      {analyzingState && (
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-zinc-700 animate-spin" />
              <span className="font-semibold text-zinc-900">Pipeline de Extracción Activo</span>
              <span className="font-mono text-zinc-500 text-[11px]">({fileName})</span>
            </div>

            {analyzingState === 'completed' && (
              <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                EXTRACCIÓN LISTA
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className={`p-3 rounded-lg border text-xs transition-colors ${
              analyzingState === 'reading'
                ? 'bg-zinc-100 border-zinc-900 font-semibold'
                : 'bg-zinc-50/70 border-zinc-200 text-zinc-600'
            }`}>
              <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                <span>01 // PARSEO</span>
                {analyzingState !== 'reading' ? <Check className="w-3.5 h-3.5 text-zinc-900" /> : <RefreshCw className="w-3 h-3 animate-spin" />}
              </div>
              <p className="text-[11px] text-zinc-500">Lectura de filas tabulares</p>
            </div>

            <div className={`p-3 rounded-lg border text-xs transition-colors ${
              analyzingState === 'ai_processing'
                ? 'bg-zinc-100 border-zinc-900 font-semibold'
                : 'bg-zinc-50/70 border-zinc-200 text-zinc-600'
            }`}>
              <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                <span>02 // SEMÁNTICA</span>
                {analyzingState === 'completed' ? <Check className="w-3.5 h-3.5 text-zinc-900" /> : analyzingState === 'ai_processing' ? <Sparkles className="w-3 h-3 text-zinc-900 animate-pulse" /> : null}
              </div>
              <p className="text-[11px] text-zinc-500">Abstracción de título y propósito</p>
            </div>

            <div className={`p-3 rounded-lg border text-xs transition-colors ${
              analyzingState === 'completed'
                ? 'bg-zinc-100 border-zinc-900 font-semibold'
                : 'bg-zinc-50/70 border-zinc-200 text-zinc-600'
            }`}>
              <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                <span>03 // VISUALES</span>
                {analyzingState === 'completed' && <Check className="w-3.5 h-3.5 text-zinc-900" />}
              </div>
              <p className="text-[11px] text-zinc-500">Asignación de imagen y tarjeta</p>
            </div>
          </div>
        </div>
      )}

      {/* Resultados de la Extracción */}
      {extractedItems.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Registros Abstraídos ({extractedItems.length})
              </h3>
            </div>

            <button
              onClick={handleConfirmImport}
              className="btn-tactile px-3 py-1.5 rounded-lg bg-zinc-950 text-white font-medium text-xs hover:bg-zinc-800 transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Confirmar e Importar</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {extractedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs flex gap-3 overflow-hidden"
              >
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-zinc-200"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono text-[9px] text-zinc-700 bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200">
                        {item.area}
                      </span>
                      <span className="font-mono text-[9px] text-emerald-600">
                        CONF: {item.confidenceScore}
                      </span>
                    </div>

                    <h4 className="font-semibold text-zinc-900 text-xs truncate">
                      {item.titulo}
                    </h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                      {item.proposito}
                    </p>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 pt-1.5 border-t border-zinc-100">
                    <span>CAP: {item.capacidad} // {item.horario}</span>
                    <span className="text-zinc-700 font-medium">Borrador</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
