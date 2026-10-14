import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Upload, 
  FileSpreadsheet, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Check, 
  RotateCcw, 
  ArrowRight,
  Download,
  Info
} from 'lucide-react';
import { 
  downloadSampleAnnualPlanTemplate, 
  parseMultiSheetExcelFile, 
  processPlanRowsWithAI,
  getSemanticImage 
} from '../utils/excelHelper';
import { DEMO_ANNUAL_PLAN_SHEETS, AREAS, TRIMESTRES } from '../data/mockData';

export default function ExcelUploadView({ onSuccessNavigate }) {
  const { currentUser, importEventsFromAI, addToast } = useApp();

  const [step, setStep] = useState(1); // 1: Carga, 2: Revisión Inteligente, 3: Creados
  const [selectedSheet, setSelectedSheet] = useState(currentUser?.area || 'Cultura');
  const [selectedQuarter, setSelectedQuarter] = useState('Trimestre 4');
  const [processing, setProcessing] = useState(false);
  const [extractedItems, setExtractedItems] = useState([]);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  // Ejecución de inferencia de IA
  const runAiExtraction = (rawRows, nameOfFile = 'Actividades_2026.xlsx') => {
    setFileName(nameOfFile);
    setProcessing(true);

    setTimeout(() => {
      const processed = processPlanRowsWithAI(rawRows, selectedSheet, selectedQuarter);
      setExtractedItems(processed);
      setProcessing(false);
      setStep(2);

      const ambCount = processed.filter(p => p.isAmbiguous).length;
      addToast(
        'Análisis Inteligente Completado',
        `Se identificaron ${processed.length} actividades en el archivo. ${ambCount > 0 ? `${ambCount} requieren fijar fecha exacta.` : 'Listas para revisión.'}`,
        ambCount > 0 ? 'warning' : 'success'
      );
    }, 1100);
  };

  // Carga manual de archivo
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedWorkbook = await parseMultiSheetExcelFile(file);
      const sheetData = parsedWorkbook.sheetsData[selectedSheet] || Object.values(parsedWorkbook.sheetsData)[0];
      
      if (!sheetData || sheetData.length === 0) {
        addToast('Hoja sin registros', `No se encontraron filas en la hoja "${selectedSheet}".`, 'warning');
        return;
      }
      runAiExtraction(sheetData, file.name);
    } catch (err) {
      console.error(err);
      addToast('Error al procesar', 'No se pudo leer el archivo Excel.', 'warning');
    }
  };

  // Carga con 1 Clic usando datos de prueba de la hoja seleccionada
  const handleLoadDemoFile = () => {
    const demoRows = DEMO_ANNUAL_PLAN_SHEETS[selectedSheet] || DEMO_ANNUAL_PLAN_SHEETS['Cultura'];
    runAiExtraction(demoRows, `Plan_Bienestar_2026_${selectedSheet}.xlsx`);
  };

  // Conmutar selección
  const toggleSelect = (tempId) => {
    setExtractedItems(prev => prev.map(item => 
      item.tempId === tempId ? { ...item, selected: !item.selected } : item
    ));
  };

  // Resolver ambigüedad en línea
  const handleResolveAmbiguity = (tempId, newDate) => {
    setExtractedItems(prev => prev.map(item => {
      if (item.tempId === tempId) {
        return {
          ...item,
          date: newDate,
          isAmbiguous: false,
          ambiguityReason: null
        };
      }
      return item;
    }));
    addToast('Fecha Confirmada', 'Se resolvió la ambigüedad. La actividad ya puede publicarse.', 'success');
  };

  // Regenerar imagen
  const handleRegenerateImage = (tempId, area, text) => {
    const newImg = getSemanticImage(area, text);
    setExtractedItems(prev => prev.map(item => 
      item.tempId === tempId ? { ...item, image: newImg } : item
    ));
  };

  // Confirmar e importar hacia estado Borrador
  const handleCommitEvents = () => {
    const selected = extractedItems.filter(i => i.selected);
    if (selected.length === 0) {
      addToast('Selecciona actividades', 'Marca al menos una actividad para incorporar al catálogo.', 'warning');
      return;
    }

    importEventsFromAI(selected);
    setStep(3); // Pasar a pantalla de éxito
  };

  // PASO 3: PANTALLA DE ÉXITO Ergonómica
  if (step === 3) {
    const importedCount = extractedItems.filter(i => i.selected).length;

    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="card-ergonomic p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] flex items-center justify-center mx-auto shadow-2xs">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="text-[11px] font-extrabold tracking-[2px] uppercase text-[#15803d] font-mono">
            PROCESO COMPLETADO
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] font-heading">
            ¡{importedCount} actividades fueron creadas!
          </h2>
          <p className="text-xs text-[#64748b] max-w-md mx-auto leading-relaxed">
            El motor procesó el archivo y generó las propuestas con títulos, metodologías, imágenes temáticas y lugares. Están guardadas como <strong>Borrador</strong> para tu revisión y publicación.
          </p>

          {/* Resumen de propuestas creadas */}
          <div className="border border-[#e2e8f0] rounded-xl overflow-hidden text-left divide-y divide-[#e2e8f0] my-4">
            {extractedItems.filter(i => i.selected).map(item => (
              <div key={item.tempId} className="p-3 flex items-center justify-between gap-3 bg-[#f8fafc]">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={item.image} alt={item.title} className="w-11 h-9 rounded-lg object-cover shrink-0 border border-[#e2e8f0]" />
                  <div className="min-w-0">
                    <strong className="block text-xs text-[#1e293b] font-heading truncate">{item.title}</strong>
                    <small className="text-[10px] text-[#64748b] font-mono">{item.date} • {item.area}</small>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setExtractedItems([]);
                setFileName('');
              }}
              className="btn btn-secondary text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Importar otro archivo</span>
            </button>

            <button
              type="button"
              onClick={onSuccessNavigate}
              className="btn btn-primary text-xs font-bold"
            >
              <span>Revisar eventos en Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Encabezado Principal */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] font-heading tracking-tight">
          Importar desde Excel
        </h1>
        <p className="text-xs md:text-sm text-[#64748b] mt-1">
          Convierte tu programación institucional en eventos listos para publicar mediante análisis inteligente.
        </p>
      </div>

      {/* Indicador de 3 Pasos Ergonómico */}
      <div className="flex items-center justify-center gap-3 py-2">
        <div className={`flex items-center gap-2 text-xs font-bold ${step === 1 ? 'text-[#1e293b]' : 'text-[#64748b]'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            step === 1 ? 'bg-[#15803d] text-white shadow-xs' : 'bg-[#e2e8f0] text-[#64748b]'
          }`}>
            1
          </span>
          <span>Cargar archivo</span>
        </div>
        <i className="w-12 h-px bg-[#cbd5e1]" />
        <div className={`flex items-center gap-2 text-xs font-bold ${step === 2 ? 'text-[#1e293b]' : 'text-[#64748b]'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            step === 2 ? 'bg-[#15803d] text-white shadow-xs' : 'bg-[#e2e8f0] text-[#64748b]'
          }`}>
            2
          </span>
          <span>Revisión inteligente</span>
        </div>
        <i className="w-12 h-px bg-[#cbd5e1]" />
        <div className={`flex items-center gap-2 text-xs font-bold ${step === 3 ? 'text-[#1e293b]' : 'text-[#64748b]'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            step === 3 ? 'bg-[#15803d] text-white shadow-xs' : 'bg-[#e2e8f0] text-[#64748b]'
          }`}>
            3
          </span>
          <span>Revisar creados</span>
        </div>
      </div>

      {/* PASO 1: SUBIR ARCHIVO */}
      {step === 1 && (
        <div className="card-ergonomic p-6 md:p-8 space-y-5">
          
          {/* Parámetros de Hoja y Trimestre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Hoja del Plan Anual (Área)
              </label>
              <select
                value={selectedSheet}
                onChange={(e) => setSelectedSheet(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] text-xs bg-white font-medium text-[#1e293b] focus:outline-none focus:border-[#15803d]"
              >
                {AREAS.map(a => <option key={a} value={a}>Hoja: {a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Filtro por Trimestre
              </label>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] text-xs bg-white font-medium text-[#1e293b] focus:outline-none focus:border-[#15803d]"
              >
                {TRIMESTRES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Intro de subida con icono institucional verde */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] flex items-center justify-center font-black text-lg shrink-0 font-heading">
              X
            </div>
            <div>
              <strong className="block text-sm text-[#1e293b] font-heading font-bold">
                Sube tu programación institucional
              </strong>
              <p className="text-xs text-[#64748b]">
                El modelo identificará automáticamente títulos, propósitos formativos, fechas, lugares e imágenes sugeridas.
              </p>
            </div>
          </div>

          {/* Dropzone Ergonómico */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-[200px] border-2 border-dashed border-[#cbd5e1] hover:border-[#15803d] bg-[#f8fafc] hover:bg-white rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              hidden
            />
            
            <div className="w-14 h-14 rounded-full bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>

            <strong className="text-xs sm:text-sm text-[#1e293b]">
              Arrastra tu archivo aquí o <u className="text-[#15803d]">selecciónalo en tu equipo</u>
            </strong>
            <span className="text-[11px] text-[#64748b] mt-1">
              Formatos admitidos: XLSX multi-hoja, XLS y CSV
            </span>
            <small className="text-[10px] text-[#94a3b8] mt-0.5">
              Tamaño máximo: 10 MB
            </small>
          </div>

          {/* Nota de privacidad */}
          <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between text-xs text-[#475569]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#15803d] shrink-0" />
              <div>
                <strong className="block text-[11px] text-[#1e293b]">Procesamiento seguro e inteligente</strong>
                <small className="text-[10px] text-[#64748b]">Tu archivo se analiza en tu sesión para formular borradores sin alterar tus datos originales.</small>
              </div>
            </div>
            <span className="font-mono text-[9px] font-bold bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2 py-0.5 rounded">
              IA SENA
            </span>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              disabled={processing}
              onClick={handleLoadDemoFile}
              className="btn btn-primary flex-1 py-3 text-xs font-bold"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Analizando información con IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Cargar Plan Demo de {selectedSheet}</span>
                </>
              )}
            </button>
          </div>

          {/* Fila de Plantilla Oficial */}
          <div className="p-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-[#15803d]" />
              <div>
                <strong className="block text-xs text-[#1e293b]">¿No tienes la plantilla oficial?</strong>
                <small className="text-[10px] text-[#64748b]">Descarga el formato recomendado con pestañas para las 6 áreas institucionales.</small>
              </div>
            </div>
            <button
              type="button"
              onClick={downloadSampleAnnualPlanTemplate}
              className="btn btn-secondary text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar plantilla</span>
            </button>
          </div>

        </div>
      )}

      {/* PASO 2: REVISIÓN DE PROPUESTAS GENERADAS */}
      {step === 2 && (
        <div className="card-ergonomic p-6 md:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#15803d] font-mono">
                PASO 2 • REVISIÓN DE INFERENCIAS
              </span>
              <h2 className="text-lg font-bold text-[#1e293b] font-heading">
                Propuestas detectadas en "{fileName}" ({extractedItems.length})
              </h2>
              <p className="text-xs text-[#64748b]">
                Selecciona las actividades que deseas incorporar al catálogo en estado <strong>Borrador</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary text-xs"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleCommitEvents}
                className="btn btn-primary text-xs font-bold"
              >
                <span>Aprobar Seleccionadas ({extractedItems.filter(i => i.selected).length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lista de propuestas con tarjetas ergonómicas */}
          <div className="space-y-3">
            {extractedItems.map(item => (
              <div 
                key={item.tempId}
                className={`p-4 rounded-xl border transition-all ${
                  item.selected 
                    ? 'border-[#86efac] bg-[#f0fdf4]' 
                    : 'border-[#e2e8f0] bg-white opacity-70'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  
                  {/* Checkbox y Contenido */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleSelect(item.tempId)}
                      className="mt-1 w-4 h-4 rounded text-[#15803d] focus:ring-[#15803d]"
                    />

                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-16 h-14 rounded-lg object-cover shrink-0 border border-[#e2e8f0]"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-[#1e293b] font-heading font-bold truncate">
                          {item.title}
                        </strong>
                        <span className="text-[10px] font-mono bg-slate-100 text-[#0e2738] border border-slate-200 px-1.5 py-0.2 rounded font-bold">
                          {item.area}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#475569] mt-0.5 line-clamp-1">
                        {item.purpose}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-[#64748b] font-mono mt-1">
                        <span>Fecha: {item.date}</span>
                        <span>•</span>
                        <span>Horario: {item.schedule}</span>
                        <span>•</span>
                        <span>Lugar: {item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones para resolver ambigüedad o regenerar imagen */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {item.isAmbiguous ? (
                      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[10px] text-amber-900 font-bold">Fecha ambigua:</span>
                        <input
                          type="date"
                          defaultValue="2026-10-25"
                          onChange={(e) => e.target.value && handleResolveAmbiguity(item.tempId, e.target.value)}
                          className="text-[10px] bg-white border border-amber-300 rounded px-1.5 py-0.5"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#15803d] bg-[#eafaf1] border border-[#bbf7d0] px-2 py-0.5 rounded font-bold">
                        Válido ✓
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRegenerateImage(item.tempId, item.area, item.title)}
                      className="btn-ghost text-[10px] text-[#64748b] hover:text-[#1e293b]"
                      title="Regenerar portada temática con IA"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#e2e8f0] flex justify-between items-center">
            <span className="text-xs text-[#64748b]">
              {extractedItems.filter(i => i.selected).length} de {extractedItems.length} seleccionadas
            </span>
            <button
              type="button"
              onClick={handleCommitEvents}
              className="btn btn-primary text-xs font-bold"
            >
              <span>Confirmar y Guardar como Borradores</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
