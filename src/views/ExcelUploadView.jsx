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
  AlertCircle,
  FileCheck,
  Music,
  Trophy
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
  const runAiExtractionPipeline = (rawRows, nameOfFile = 'archivo_subido.xlsx') => {
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
          'Análisis completado',
          `El modelo de IA abstrajo con éxito ${processed.length} eventos estructurados con título, propósito e imagen temática.`,
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
        addToast('Archivo vacío', 'No se encontraron filas con datos en el archivo Excel.', 'warning');
        return;
      }
      runAiExtractionPipeline(rows, file.name);
    } catch (err) {
      console.error(err);
      addToast('Error de lectura', 'Hubo un inconveniente al leer el archivo. Intenta con la plantilla de ejemplo.', 'warning');
    }
  };

  // Cargar demo instantáneo con 1 clic
  const handleLoadDemo = () => {
    runAiExtractionPipeline(DEMO_EXCEL_DATA, 'Datos_Institucionales_2026.xlsx');
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
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Pipeline Inteligente
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Carga de Excel & Abstracción de Eventos por IA
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sube un archivo de hojas de cálculo. Nuestro modelo analizará el contenido tabular para abstraer título, propósito y generar tarjetas de eventos con imágenes automáticas.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={downloadSampleExcelTemplate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            title="Descargar plantilla Excel formateada"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Descargar Plantilla .xlsx</span>
          </button>

          <button
            onClick={handleLoadDemo}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all"
            title="Cargar eventos demo sin requerir archivo local"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Cargar Demo con 1 Clic</span>
          </button>
        </div>
      </div>

      {/* Zona de Arrastrar y Soltar (Dropzone) */}
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
            ? 'border-indigo-500 bg-indigo-50/70 scale-[0.99]'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/50 shadow-sm'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 mb-4 ring-4 ring-emerald-50">
          <FileSpreadsheet className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-slate-800">
          Arrastra tu archivo Excel aquí o haz clic para explorar
        </h3>
        <p className="text-xs text-slate-500 max-w-md mt-1 mb-5">
          Formatos compatibles: <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-700">.xlsx</code>, <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-700">.xls</code> o <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-700">.csv</code>. El modelo procesará automáticamente las columnas.
        </p>

        <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-md flex items-center gap-2">
          <UploadCloud className="w-4 h-4" />
          <span>Examinar en mi Equipo</span>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
        </label>
      </div>

      {/* Visualizador del Proceso del Modelo de IA */}
      {analyzingState && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Cpu className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Flujo de Análisis por Modelo de IA
                </h4>
                <p className="text-xs text-slate-500">
                  Archivo objetivo: <span className="font-mono font-semibold text-slate-700">{fileName}</span>
                </p>
              </div>
            </div>

            {analyzingState === 'completed' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Abstracción Concluida
              </span>
            )}
          </div>

          {/* Stepper del Análisis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Paso 1 */}
            <div className={`p-4 rounded-xl border transition-all ${
              analyzingState === 'reading'
                ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>1. Parseo Tabular</span>
                {analyzingState !== 'reading' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                )}
              </div>
              <p className="text-[11px] text-slate-500">Lectura de cabeceras, celdas y mapeo de datos.</p>
            </div>

            {/* Paso 2 */}
            <div className={`p-4 rounded-xl border transition-all ${
              analyzingState === 'ai_processing'
                ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500/20'
                : analyzingState === 'completed'
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-50/50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>2. Inferencia Semántica</span>
                {analyzingState === 'completed' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : analyzingState === 'ai_processing' ? (
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-bounce" />
                ) : null}
              </div>
              <p className="text-[11px] text-slate-500">Abstracción puntual de Título y Propósito formativo.</p>
            </div>

            {/* Paso 3 */}
            <div className={`p-4 rounded-xl border transition-all ${
              analyzingState === 'completed'
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-50/50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>3. Generación Visual</span>
                {analyzingState === 'completed' && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-[11px] text-slate-500">Asignación de imagen temática y tarjetas de evento.</p>
            </div>
          </div>
        </div>
      )}

      {/* Resultados de la Extracción: Tarjetas de Eventos Generadas */}
      {extractedItems.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Eventos Abstraídos ({extractedItems.length})
              </h3>
              <p className="text-xs text-slate-500">
                Revisa la información extraída antes de incorporarla al catálogo general en modo Borrador.
              </p>
            </div>

            <button
              onClick={handleConfirmImport}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2"
            >
              <span>Confirmar e Importar al Catálogo</span>
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
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.area === 'Música'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {item.area}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold font-mono">
                        Confianza IA: {item.confidenceScore}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1">
                      {item.titulo}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {item.proposito}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Cupo: {item.capacidad} | {item.horario}</span>
                    <span className="text-indigo-600 font-semibold">Listo para borrador</span>
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
