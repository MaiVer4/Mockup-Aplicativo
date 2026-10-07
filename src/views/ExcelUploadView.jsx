import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Sparkles, 
  Download, 
  PlayCircle, 
  CheckCircle2, 
  Cpu, 
  ArrowRight, 
  Check, 
  RefreshCw, 
  BookOpen,
  Award
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

  // Simulación del procesamiento de IA con pasos visuales
  const runAiExtractionPipeline = (rawRows, nameOfFile = 'planilla_curricular.xlsx') => {
    setFileName(nameOfFile);
    setAnalyzingState('reading');

    setTimeout(() => {
      setAnalyzingState('ai_processing');

      setTimeout(() => {
        // Ejecutar extracción semántica
        const forcedArea = currentUser.role === 'admin_area' ? currentUser.area : null;
        const processed = processRawRowsWithAI(rawRows, forcedArea);
        setExtractedItems(processed);
        setAnalyzingState('completed');
        addToast(
          'Análisis Curricular Completado',
          `El modelo de IA abstrajo con éxito ${processed.length} convocatorias estructuradas con título, propósito pedagógico e imagen temática.`,
          'success'
        );
      }, 1600);
    }, 900);
  };

  // Manejo de archivo real
  const handleFileChange = async (file) => {
    if (!file) return;
    try {
      const rows = await parseExcelFile(file);
      if (!rows || rows.length === 0) {
        addToast('Planilla vacía', 'No se encontraron registros tabulares en el archivo Excel.', 'warning');
        return;
      }
      runAiExtractionPipeline(rows, file.name);
    } catch (err) {
      console.error(err);
      addToast('Error de lectura', 'Hubo un inconveniente al leer la planilla. Intenta con el formato oficial.', 'warning');
    }
  };

  // Cargar demo instantáneo con 1 clic
  const handleLoadDemo = () => {
    runAiExtractionPipeline(DEMO_EXCEL_DATA, 'Planilla_Curricular_2026.xlsx');
  };

  // Confirmar importación de eventos hacia el catálogo general
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
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Encabezado Académico */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/90 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0b1e38] text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Procesamiento Curricular con IA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0b1e38] tracking-tight">
            Carga de Planilla Excel & Abstracción de Convocatorias
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Carga la planilla de eventos de tu facultad o departamento. El modelo semántico abstraerá el título, propósito formativo y generará las fichas curriculares automáticamente.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={downloadSampleExcelTemplate}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm bg-white"
            title="Descargar formato Excel oficial"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Descargar Planilla Oficial</span>
          </button>

          <button
            onClick={handleLoadDemo}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0b1e38] text-amber-300 hover:bg-[#143156] border border-amber-400/40 shadow-sm transition-all"
            title="Cargar registros académicos de prueba"
          >
            <PlayCircle className="w-4 h-4 text-amber-400" />
            <span>Cargar Planilla Demo</span>
          </button>
        </div>
      </div>

      {/* Zona de Arrastrar y Soltar (Dropzone Académica) */}
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
        className={`p-10 rounded-3xl border-2 border-dashed text-center transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${
          isDragging
            ? 'border-amber-500 bg-amber-50/60 scale-[0.99]'
            : 'border-slate-300 bg-white hover:border-[#0b1e38] hover:bg-slate-50/60 shadow-sm'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0b1e38] to-[#173d63] flex items-center justify-center text-amber-400 shadow-lg shadow-[#0b1e38]/20 mb-4 ring-4 ring-slate-100">
          <FileSpreadsheet className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-serif font-bold text-[#0b1e38]">
          Arrastra tu planilla Excel aquí o examina en tu equipo
        </h3>
        <p className="text-xs text-slate-500 max-w-md mt-1 mb-5 leading-relaxed">
          Formatos admitidos: <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-mono">.xlsx</code>, <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-mono">.xls</code> o <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-mono">.csv</code>. El modelo identificará columnas de título, propósito, aforo y horario.
        </p>

        <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#0b1e38] text-amber-300 border border-amber-400/40 text-xs font-bold hover:bg-[#143156] transition-colors shadow-sm flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-amber-400" />
          <span>Examinar Archivos Locales</span>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
        </label>
      </div>

      {/* Visualizador del Proceso Semántico de IA */}
      {analyzingState && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0b1e38]/5 border border-[#0b1e38]/15 flex items-center justify-center text-[#0b1e38]">
                <Cpu className="w-5 h-5 animate-spin text-amber-700" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#0b1e38]">
                  Motor de Abstracción Curricular
                </h4>
                <p className="text-xs text-slate-500">
                  Planilla procesada: <span className="font-mono font-semibold text-slate-700">{fileName}</span>
                </p>
              </div>
            </div>

            {analyzingState === 'completed' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Abstracción Finalizada
              </span>
            )}
          </div>

          {/* Stepper del Análisis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Paso 1 */}
            <div className={`p-4 rounded-xl border transition-all ${
              analyzingState === 'reading'
                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>1. Lectura Tabular</span>
                {analyzingState !== 'reading' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                )}
              </div>
              <p className="text-[11px] text-slate-500">Mapeo de filas curriculares y validación de campos.</p>
            </div>

            {/* Paso 2 */}
            <div className={`p-4 rounded-xl border transition-all ${
              analyzingState === 'ai_processing'
                ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20'
                : analyzingState === 'completed'
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-50/50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>2. Inferencia Semántica</span>
                {analyzingState === 'completed' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : analyzingState === 'ai_processing' ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                ) : null}
              </div>
              <p className="text-[11px] text-slate-500">Extracción de Título y Propósito Pedagógico.</p>
            </div>

            {/* Paso 3 */}
            <div className={`p-4 rounded-xl border transition-all ${
              analyzingState === 'completed'
                ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-50/50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>3. Ficha Curricular</span>
                {analyzingState === 'completed' && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-[11px] text-slate-500">Asignación de imagen temática y ficha de extensión.</p>
            </div>
          </div>
        </div>
      )}

      {/* Resultados de la Extracción */}
      {extractedItems.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-[#0b1e38]">
                Convocatorias Extraídas ({extractedItems.length})
              </h3>
              <p className="text-xs text-slate-500">
                Verifica las fichas antes de incorporarlas en modo Borrador al catálogo curricular.
              </p>
            </div>

            <button
              onClick={handleConfirmImport}
              className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all flex items-center gap-2"
            >
              <span>Incorporar al Catálogo Oficial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extractedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex gap-4 overflow-hidden"
              >
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-200 shadow-sm"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.area === 'Música'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        Depto. {item.area}
                      </span>
                      <span className="text-[10px] text-amber-800 font-bold font-mono">
                        Validación IA: {item.confidenceScore}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-[#0b1e38] text-sm mt-1 line-clamp-1">
                      {item.titulo}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.proposito}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Aforo: {item.capacidad} | {item.horario}</span>
                    <span className="text-amber-700 font-bold">Listo para borrador</span>
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
