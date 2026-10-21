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
  Info,
  SlidersHorizontal,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Users,
  MapPin,
  Calendar,
  Clock,
  LayoutGrid,
  Table as TableIcon,
  Tag,
  DollarSign,
  FileText
} from 'lucide-react';
import { 
  downloadSampleAnnualPlanTemplate, 
  parseMultiSheetExcelFile, 
  processPlanRowsWithAI
} from '../utils/excelHelper';
import { DEMO_ANNUAL_PLAN_SHEETS, AREAS, TRIMESTRES } from '../data/mockData';

const normalizeSheetLabel = (value = '') => String(value)
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]/g, '');

const sheetBelongsToArea = (sheetName = '', area = '') => {
  const sheet = normalizeSheetLabel(sheetName);
  const normalizedArea = normalizeSheetLabel(area);
  return sheet === normalizedArea
    || sheet.includes(normalizedArea)
    || (normalizedArea === 'actividadfisica' && sheet.includes('actividadf'));
};

export default function ExcelUploadView({ onSuccessNavigate }) {
  const { currentUser, importEventsFromAI, addToast } = useApp();

  const [step, setStep] = useState(1); // 1: Carga, 2: Revisión Inteligente, 3: Creados
  const [selectedSheet, setSelectedSheet] = useState(currentUser?.area || 'Cultura');
  const [selectedQuarter, setSelectedQuarter] = useState('all'); // 'all': Todo el Plan Anual
  const [processing, setProcessing] = useState(false);
  const [extractedItems, setExtractedItems] = useState([]);
  const [fileName, setFileName] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [step2QuarterFilter, setStep2QuarterFilter] = useState('ALL');
  const fileInputRef = useRef(null);

  // Estado para libros Excel reales multi-hoja y mapeo semántico
  const [parsedWorkbook, setParsedWorkbook] = useState(null);
  const [currentSheetData, setCurrentSheetData] = useState(null);
  const [activeColumnMap, setActiveColumnMap] = useState({});
  const [isColumnMappingOpen, setIsColumnMappingOpen] = useState(false);

  // Ejecución de inferencia y extracción de actividades
  const runAiExtraction = (sheetOrRows, nameOfFile = 'Actividades_2026.xlsx', sheetName = 'Cultura', customMap = null) => {
    setFileName(nameOfFile);
    setProcessing(true);

    setTimeout(() => {
      const processed = processPlanRowsWithAI(sheetOrRows, sheetName, selectedQuarter, customMap);
      setExtractedItems(processed);
      setProcessing(false);
      setStep(2);

      const ambCount = processed.filter(p => p.isAmbiguous).length;
      addToast(
        'Análisis de Actividades Completado',
        `Se reconocieron ${processed.length} actividades reales en "${sheetName}". ${ambCount > 0 ? `${ambCount} requieren fijar fecha exacta.` : 'Todas verificadas.'}`,
        ambCount > 0 ? 'warning' : 'success'
      );
    }, 750);
  };

  // Carga manual de archivo Excel real (.xlsx, .xls, .csv)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProcessing(true);
      const parsed = await parseMultiSheetExcelFile(file);
      setParsedWorkbook(parsed);

      let targetSheet = parsed.sheetNames.find(s => sheetBelongsToArea(s, selectedSheet)) ||
                        parsed.sheetNames.find(s => parsed.sheetsData[s]?.activitiesCount > 0) ||
                        parsed.sheetNames[0];

      setSelectedSheet(targetSheet);
      const sheetData = parsed.sheetsData[targetSheet];

      if (!sheetData || sheetData.activitiesCount === 0) {
        setProcessing(false);
        addToast(
          'Hoja sin actividades', 
          `No se detectaron actividades en la hoja "${targetSheet}". Por favor selecciona otra hoja del libro.`, 
          'warning'
        );
        return;
      }

      setCurrentSheetData(sheetData);
      setActiveColumnMap(sheetData.columnMap || {});
      runAiExtraction(sheetData, file.name, targetSheet, sheetData.columnMap);
    } catch (err) {
      console.error(err);
      setProcessing(false);
      addToast('Error al procesar', 'No se pudo leer el archivo Excel. Verifica el formato de tabla.', 'warning');
    }
  };

  // Cambio de hoja en archivo cargado
  const handleSwitchSheet = (newSheetName) => {
    if (!parsedWorkbook || !parsedWorkbook.sheetsData[newSheetName]) return;
    setSelectedSheet(newSheetName);
    const sheetData = parsedWorkbook.sheetsData[newSheetName];
    setCurrentSheetData(sheetData);
    setActiveColumnMap(sheetData.columnMap || {});
    runAiExtraction(sheetData, parsedWorkbook.fileName, newSheetName, sheetData.columnMap);
  };

  // Actualizar re-mapeo manual de columnas
  const handleUpdateColumnMapping = (field, newColName) => {
    const updatedMap = { ...activeColumnMap, [field]: newColName };
    setActiveColumnMap(updatedMap);
    if (currentSheetData) {
      const reprocessed = processPlanRowsWithAI(currentSheetData, selectedSheet, selectedQuarter, updatedMap);
      setExtractedItems(reprocessed);
      addToast('Mapeo actualizado', `La columna "${newColName}" ahora define ${field}.`, 'success');
    }
  };

  // Carga con 1 Clic usando datos de prueba de la plantilla oficial
  const handleLoadDemoFile = () => {
    const demoRows = DEMO_ANNUAL_PLAN_SHEETS[selectedSheet] || DEMO_ANNUAL_PLAN_SHEETS['Cultura'];
    setParsedWorkbook(null);
    setCurrentSheetData(null);
    setActiveColumnMap({
      title: 'Evento / Actividad',
      line: 'Línea de Acción',
      capacity: 'Aprendices Estimados',
      date: 'Mes / Fecha Programada',
      responsible: 'Responsable Sugerido'
    });
    runAiExtraction(demoRows, `Plan_Bienestar_2026_${selectedSheet}.xlsx`, selectedSheet);
  };

  // Carga Plan Anual General Multi-Área con Fichas
  const handleLoadGeneralPlanDemo = () => {
    const allRows = [];
    Object.entries(DEMO_ANNUAL_PLAN_SHEETS).forEach(([areaName, rows]) => {
      rows.forEach(r => {
        allRows.push({
          ...r,
          'Área': areaName,
          'Población Objetivo': 'Fichas ADSO 2824123, 2824124 y Gestión Empresarial',
          'Horario': '14:00 - 17:00'
        });
      });
    });
    setParsedWorkbook(null);
    setCurrentSheetData(null);
    setActiveColumnMap({
      title: 'Evento / Actividad',
      area: 'Área',
      line: 'Línea de Acción',
      capacity: 'Aprendices Estimados',
      date: 'Mes / Fecha Programada',
      responsible: 'Responsable Sugerido',
      targetAudience: 'Población Objetivo',
      time: 'Horario'
    });
    runAiExtraction(allRows, 'Plan_General_Bienestar_SENA_2026.xlsx', 'Plan General');
  };

  const displayedItems = extractedItems.filter(i => step2QuarterFilter === 'ALL' || i.quarter === step2QuarterFilter);
  const allSelected = displayedItems.length > 0 && displayedItems.every(i => i.selected);

  // Conmutar selección individual
  const toggleSelect = (tempId) => {
    setExtractedItems(prev => prev.map(item => 
      item.tempId === tempId ? { ...item, selected: !item.selected } : item
    ));
  };

  // Seleccionar todas / Deseleccionar todas (sobre la vista filtrada)
  const toggleSelectAll = () => {
    const displayedIds = new Set(displayedItems.map(i => i.tempId));
    setExtractedItems(prev => prev.map(item => 
      displayedIds.has(item.tempId) ? { ...item, selected: !allSelected } : item
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

  // Confirmar e incorporar hacia estado Borrador en catálogo
  const handleCommitEvents = () => {
    const selected = extractedItems.filter(i => i.selected);
    if (selected.length === 0) {
      addToast('Selecciona actividades', 'Marca al menos una actividad para incorporar al catálogo.', 'warning');
      return;
    }

    importEventsFromAI(selected);
    setStep(3); // Pasar a pantalla de éxito
  };

  // PASO 3: PANTALLA DE ÉXITO
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
            ¡{importedCount} actividades reales creadas!
          </h2>
          <p className="text-xs text-[#64748b] max-w-md mx-auto leading-relaxed">
            Las actividades reales de tu archivo fueron reconocidas e incorporadas como <strong>Borrador</strong>. Puedes editarlas, asignarlas o publicarlas en la cartelera cuando desees.
          </p>

          {/* Resumen de propuestas creadas */}
          <div className="border border-[#e2e8f0] rounded-xl overflow-hidden text-left divide-y divide-[#e2e8f0] my-4 max-h-72 overflow-y-auto">
            {extractedItems.filter(i => i.selected).map(item => (
              <div key={item.tempId} className="p-3 flex items-center justify-between gap-3 bg-[#f8fafc]">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={item.image} alt={item.title} className="w-11 h-9 rounded-lg object-cover shrink-0 border border-[#e2e8f0]" />
                  <div className="min-w-0">
                    <strong className="block text-xs text-[#1e293b] font-heading truncate">{item.title}</strong>
                    <small className="text-[10px] text-[#64748b] font-mono">{item.date} • {item.area} • Cupo: {item.capacity} • {item.targetAudience}</small>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setExtractedItems([]);
                setFileName('');
                setParsedWorkbook(null);
                setCurrentSheetData(null);
              }}
              className="btn btn-secondary text-xs w-full sm:w-auto justify-center py-2.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Importar otro archivo</span>
            </button>

            <button
              type="button"
              onClick={onSuccessNavigate}
              className="btn btn-primary text-xs font-bold w-full sm:w-auto justify-center py-2.5"
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
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Encabezado Principal */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] font-heading tracking-tight">
          Importar Plan desde Excel
        </h1>
        <p className="text-xs md:text-sm text-[#64748b] mt-1">
          Reconoce automáticamente las actividades reales de tu archivo institucional: autodescubrimiento de cabeceras, celdas combinadas y mapeo semántico.
        </p>
      </div>

      {/* Indicador de 3 Pasos */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 px-1 max-w-full overflow-hidden">
        <div className={`flex items-center gap-1.5 sm:gap-2 text-xs font-bold shrink-0 ${step === 1 ? 'text-[#1e293b]' : 'text-[#64748b]'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
            step === 1 ? 'bg-[#15803d] text-white shadow-xs' : 'bg-[#e2e8f0] text-[#64748b]'
          }`}>
            1
          </span>
          <span className={step === 1 ? 'inline' : 'hidden sm:inline'}>Cargar archivo</span>
        </div>
        <i className="w-6 sm:w-12 h-px bg-[#cbd5e1] shrink-0" />
        <div className={`flex items-center gap-1.5 sm:gap-2 text-xs font-bold shrink-0 ${step === 2 ? 'text-[#1e293b]' : 'text-[#64748b]'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
            step === 2 ? 'bg-[#15803d] text-white shadow-xs' : 'bg-[#e2e8f0] text-[#64748b]'
          }`}>
            2
          </span>
          <span className={step === 2 ? 'inline' : 'hidden sm:inline'}>Revisión inteligente</span>
        </div>
        <i className="w-6 sm:w-12 h-px bg-[#cbd5e1] shrink-0" />
        <div className={`flex items-center gap-1.5 sm:gap-2 text-xs font-bold shrink-0 ${step === 3 ? 'text-[#1e293b]' : 'text-[#64748b]'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
            step === 3 ? 'bg-[#15803d] text-white shadow-xs' : 'bg-[#e2e8f0] text-[#64748b]'
          }`}>
            3
          </span>
          <span className={step === 3 ? 'inline' : 'hidden sm:inline'}>Revisar creados</span>
        </div>
      </div>

      {/* PASO 1: SUBIR ARCHIVO */}
      {step === 1 && (
        <div className="card-ergonomic p-6 md:p-8 space-y-5">
          
          {/* Parámetros de Hoja y Trimestre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Área / Categoría Institucional (por defecto)
              </label>
              <select
                value={selectedSheet}
                onChange={(e) => setSelectedSheet(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] text-xs bg-white font-medium text-[#1e293b] focus:outline-none focus:border-[#15803d]"
              >
                {AREAS.map(a => <option key={a} value={a}>Área: {a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Vigencia y Alcance del Plan
              </label>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] text-xs bg-white font-medium text-[#1e293b] focus:outline-none focus:border-[#15803d]"
              >
                <option value="all">📅 Todo el Plan Anual (Trimestres 1 a 4)</option>
                <option value="Trimestre 1">Trimestre 1 (T1)</option>
                <option value="Trimestre 2">Trimestre 2 (T2)</option>
                <option value="Trimestre 3">Trimestre 3 (T3)</option>
                <option value="Trimestre 4">Trimestre 4 (T4)</option>
              </select>
            </div>
          </div>

          {/* Banner de pestañas si ya se cargó un libro multi-hoja */}
          {parsedWorkbook && parsedWorkbook.sheetNames.length > 1 && (
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1e293b] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#15803d]" />
                  <span>Pestañas detectadas en "{parsedWorkbook.fileName}":</span>
                </span>
                <span className="text-[10px] text-[#64748b] font-mono">Selecciona una para procesar</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {parsedWorkbook.sheetNames.map(sName => {
                  const count = parsedWorkbook.sheetsData[sName]?.activitiesCount || 0;
                  const isActive = sName === selectedSheet;
                  return (
                    <button
                      key={sName}
                      type="button"
                      onClick={() => handleSwitchSheet(sName)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isActive 
                          ? 'bg-[#15803d] text-white shadow-xs' 
                          : 'bg-white text-[#475569] border border-[#cbd5e1] hover:border-[#15803d]'
                      }`}
                    >
                      <span>{sName}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#e2e8f0] text-[#334155]'
                      }`}>
                        {count} actividades
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Intro de subida */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] flex items-center justify-center font-black text-lg shrink-0 font-heading">
              X
            </div>
            <div>
              <strong className="block text-sm text-[#1e293b] font-heading font-bold">
                Carga tu archivo Excel institucional
              </strong>
              <p className="text-xs text-[#64748b]">
                El motor analiza la estructura real, tolera membretes o escudos superiores, propaga celdas combinadas y respeta la redacción literal de tus objetivos y descripciones.
              </p>
            </div>
          </div>

          {/* Dropzone Ergonómico */}
          <div
            onClick={() => !processing && fileInputRef.current?.click()}
            className={`w-full min-h-[190px] border-2 border-dashed ${
              processing
                ? 'border-[#15803d] bg-emerald-50/20 cursor-wait'
                : 'border-[#cbd5e1] hover:border-[#15803d] bg-[#f8fafc] hover:bg-white cursor-pointer'
            } rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all group`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              hidden
              disabled={processing}
            />

            {processing ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-2.5">
                <div className="w-14 h-14 rounded-full bg-[#eafaf1] border border-[#bbf7d0] flex items-center justify-center shadow-xs">
                  <div className="w-6 h-6 rounded-full border-2 border-[#15803d] border-t-transparent animate-spin" />
                </div>
                <strong className="text-sm font-bold text-[#1e293b]">
                  Procesando documento, por favor espere...
                </strong>
                <span className="text-[11px] text-[#64748b]">
                  Analizando estructura de filas, fechas y aprendices convocados
                </span>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>

                <strong className="text-xs sm:text-sm text-[#1e293b]">
                  Arrastra tu archivo aquí o <u className="text-[#15803d]">selecciónalo en tu equipo</u>
                </strong>
                <span className="text-[11px] text-[#64748b] mt-1">
                  Admite formatos reales del SENA: XLSX multi-hoja, XLS y CSV
                </span>
                <small className="text-[10px] text-[#94a3b8] mt-0.5">
                  Propagación de celdas combinadas y descarte automático de totales/firmas
                </small>
              </>
            )}
          </div>

          {/* Nota de análisis inteligente */}
          <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between text-xs text-[#475569]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#15803d] shrink-0" />
              <div>
                <strong className="block text-[11px] text-[#1e293b]">Reconocimiento automático de actividades reales</strong>
                <small className="text-[10px] text-[#64748b]">Extrae denominación, fechas, cupos, metas, responsables y fichas convocadas directamente de tus filas.</small>
              </div>
            </div>
            <span className="font-mono text-[9px] font-bold bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2 py-0.5 rounded">
              IA SENA
            </span>
          </div>

          {/* Botón de acción y prueba rápida */}
          <div className="pt-2">
            <button
              type="button"
              disabled={processing}
              onClick={handleLoadDemoFile}
              className="btn btn-secondary w-full py-3 text-xs font-bold justify-center"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-[#15803d] border-t-transparent animate-spin" />
                  <span>Analizando archivo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#15803d]" />
                  <span>Probar con Plan Anual Demo de {selectedSheet}</span>
                </>
              )}
            </button>
          </div>

          {/* Descargar Plantilla Oficial */}
          <div className="p-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-[#15803d] shrink-0" />
              <div>
                <strong className="block text-xs text-[#1e293b]">¿Deseas la plantilla oficial del SENA?</strong>
                <small className="text-[10px] text-[#64748b]">Descarga el libro con pestañas para las 6 áreas institucionales y campos estándar.</small>
              </div>
            </div>
            <button
              type="button"
              onClick={downloadSampleAnnualPlanTemplate}
              className="btn btn-secondary text-xs w-full sm:w-auto justify-center shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar plantilla oficial</span>
            </button>
          </div>

        </div>
      )}

      {/* PASO 2: REVISIÓN DE ACTIVIDADES REALES EXTRAÍDAS */}
      {step === 2 && (
        <div className="card-ergonomic p-6 md:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#15803d] font-mono">
                PASO 2 • REVISIÓN DE ACTIVIDADES REALES
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1e293b] font-heading">
                Actividades reconocidas en "{fileName}" ({extractedItems.length})
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Verifica las actividades extraídas de tu Excel. Puedes alternar entre vista de tarjetas o tabla de datos crudos.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary text-xs flex-1 sm:flex-none justify-center py-2"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleCommitEvents}
                className="btn btn-primary text-xs font-bold flex-1 sm:flex-none justify-center py-2 shadow-xs"
              >
                <span>Aprobar ({extractedItems.filter(i => i.selected).length})</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* BARRA DE MAPEO SEMÁNTICO Y AJUSTE DE COLUMNAS */}
          <div className="rounded-xl border border-[#cbd5e1] bg-[#f8fafc] overflow-hidden">
            <div className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#f1f4f8]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#1e293b] flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#15803d]" />
                  <span>Columnas Mapeadas:</span>
                </span>
                <span className="text-[10px] bg-white border border-[#cbd5e1] text-[#334155] px-2 py-0.5 rounded font-mono">
                  🏷️ Actividad: <strong>{activeColumnMap.title || 'Auto'}</strong>
                </span>
                <span className="text-[10px] bg-white border border-[#cbd5e1] text-[#334155] px-2 py-0.5 rounded font-mono">
                  📅 Fecha: <strong>{activeColumnMap.date || 'Auto'}</strong>
                </span>
                <span className="text-[10px] bg-white border border-[#cbd5e1] text-[#334155] px-2 py-0.5 rounded font-mono">
                  👥 Cupo: <strong>{activeColumnMap.capacity || 'Auto'}</strong>
                </span>
                {activeColumnMap.line && (
                  <span className="text-[10px] bg-white border border-[#cbd5e1] text-[#334155] px-2 py-0.5 rounded font-mono hidden md:inline">
                    🎯 Línea: <strong>{activeColumnMap.line}</strong>
                  </span>
                )}
              </div>

              {currentSheetData && currentSheetData.headers && currentSheetData.headers.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsColumnMappingOpen(!isColumnMappingOpen)}
                  className="btn-ghost text-xs text-[#15803d] font-bold flex items-center gap-1 hover:underline ml-auto"
                >
                  <span>{isColumnMappingOpen ? 'Cerrar ajuste' : 'Ajustar mapeo de columnas'}</span>
                  {isColumnMappingOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* Panel Desplegable para Ajustar Mapeo Manualmente */}
            {isColumnMappingOpen && currentSheetData && currentSheetData.headers && (
              <div className="p-4 bg-white border-t border-[#e2e8f0] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">
                    Columna de Actividad / Nombre:
                  </label>
                  <select
                    value={activeColumnMap.title || ''}
                    onChange={(e) => handleUpdateColumnMapping('title', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#cbd5e1] text-xs bg-white text-[#1e293b]"
                  >
                    {currentSheetData.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">
                    Columna de Fecha / Mes:
                  </label>
                  <select
                    value={activeColumnMap.date || ''}
                    onChange={(e) => handleUpdateColumnMapping('date', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#cbd5e1] text-xs bg-white text-[#1e293b]"
                  >
                    <option value="">-- Sin columna / Fecha sugerida --</option>
                    {currentSheetData.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">
                    Columna de Cupo / Capacidad:
                  </label>
                  <select
                    value={activeColumnMap.capacity || ''}
                    onChange={(e) => handleUpdateColumnMapping('capacity', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#cbd5e1] text-xs bg-white text-[#1e293b]"
                  >
                    <option value="">-- Sin columna / 50 estándar --</option>
                    {currentSheetData.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">
                    Columna de Descripción / Propósito:
                  </label>
                  <select
                    value={activeColumnMap.description || ''}
                    onChange={(e) => handleUpdateColumnMapping('description', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#cbd5e1] text-xs bg-white text-[#1e293b]"
                  >
                    <option value="">-- Sin columna / Redacción asistida --</option>
                    {currentSheetData.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">
                    Columna de Población / Fichas:
                  </label>
                  <select
                    value={activeColumnMap.targetAudience || ''}
                    onChange={(e) => handleUpdateColumnMapping('targetAudience', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#cbd5e1] text-xs bg-white text-[#1e293b]"
                  >
                    <option value="">-- Sin columna / Todos los aprendices --</option>
                    {currentSheetData.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">
                    Columna de Responsable / Facilitador:
                  </label>
                  <select
                    value={activeColumnMap.responsible || ''}
                    onChange={(e) => handleUpdateColumnMapping('responsible', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#cbd5e1] text-xs bg-white text-[#1e293b]"
                  >
                    <option value="">-- Sin columna / Coordinación de Área --</option>
                    {currentSheetData.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* BARRA DE HERRAMIENTAS: SELECCIÓN MASIVA, FILTRO TRIMESTRAL Y VISTAS */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 pb-1 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-xs font-semibold text-[#15803d] hover:text-[#166534] flex items-center gap-1.5 cursor-pointer"
              >
                {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-[#64748b]" />}
                <span>{allSelected ? 'Deseleccionar vista' : 'Seleccionar vista'}</span>
              </button>

              <span className="text-xs text-[#64748b]">
                <strong>{extractedItems.filter(i => i.selected).length}</strong> de {extractedItems.length} seleccionadas
              </span>
            </div>

            {/* Filtro rápido por Trimestre */}
            <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl border border-[#cbd5e1] overflow-x-auto">
              <span className="text-[10px] font-bold text-[#64748b] px-1.5 uppercase font-mono">Trimestre:</span>
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'Trimestre 1', label: 'T1' },
                { id: 'Trimestre 2', label: 'T2' },
                { id: 'Trimestre 3', label: 'T3' },
                { id: 'Trimestre 4', label: 'T4' }
              ].map(q => {
                const count = q.id === 'ALL' ? extractedItems.length : extractedItems.filter(i => i.quarter === q.id).length;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setStep2QuarterFilter(q.id)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      step2QuarterFilter === q.id
                        ? 'bg-white text-[#15803d] shadow-2xs border border-[#cbd5e1]'
                        : 'text-[#64748b] hover:text-[#1e293b]'
                    }`}
                  >
                    <span>{q.label}</span>
                    <span className="text-[9px] font-mono opacity-80">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Selector de Modo de Vista */}
            <div className="flex items-center bg-[#f1f5f9] p-1 rounded-xl border border-[#cbd5e1] self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'cards' 
                    ? 'bg-white text-[#15803d] shadow-2xs' 
                    : 'text-[#64748b] hover:text-[#1e293b]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Tarjetas</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'table' 
                    ? 'bg-white text-[#15803d] shadow-2xs' 
                    : 'text-[#64748b] hover:text-[#1e293b]'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Tabla</span>
              </button>
            </div>
          </div>

          {/* MODO 1: VISTA DE TARJETAS ENRIQUECIDAS */}
          {viewMode === 'cards' && (
            <div className="space-y-3">
              {displayedItems.map(item => (
                <div 
                  key={item.tempId}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    item.selected 
                      ? 'border-[#86efac] bg-[#f0fdf4]' 
                      : 'border-[#e2e8f0] bg-white opacity-75'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                    
                    {/* Checkbox y Contenido */}
                    <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0 w-full">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleSelect(item.tempId)}
                        className="mt-1 w-4 h-4 rounded text-[#15803d] focus:ring-[#15803d] shrink-0"
                      />

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <strong className="text-xs text-[#1e293b] font-heading font-bold truncate max-w-full">
                            {item.title}
                          </strong>
                          <span className="text-[10px] font-mono bg-slate-100 text-[#0e2738] border border-slate-200 px-1.5 py-0.2 rounded font-bold shrink-0">
                            {item.area}
                          </span>
                          <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded font-bold shrink-0">
                            {item.quarter || 'Plan Anual'}
                          </span>
                          {item.code && (
                            <span className="text-[10px] font-mono text-[#64748b] bg-white px-1.5 py-0.2 rounded border border-[#e2e8f0]">
                              {item.code}
                            </span>
                          )}
                          {item.groupTotal !== '' && item.groupTotal !== undefined && (
                            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Total: {item.groupTotal}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-[#475569] leading-snug whitespace-pre-line">
                          {item.subactivities?.length > 0 && (
                            <div className="mt-1.5 rounded-lg border border-blue-100 bg-blue-50/60 px-2.5 py-2">
                              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">Subactividad</p>
                              <ul className="space-y-0.5 text-[11px] text-[#475569]">
                                {item.subactivities.map((subactivity, subIndex) => (
                                  <li key={`${item.tempId}-sub-${subIndex}`} className="flex gap-1.5">
                                    <span className="text-blue-500">•</span>
                                    <span>{subactivity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-[#64748b] font-mono pt-0.5">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-[#e2e8f0] shrink-0 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#15803d]" />
                            <span>{item.date}</span>
                          </span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-[#e2e8f0] shrink-0 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#64748b]" />
                            <span>{item.time || '14:00 - 17:00'}</span>
                          </span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-[#e2e8f0] shrink-0 flex items-center gap-1">
                            <Users className="w-3 h-3 text-[#15803d]" />
                            <span>Cupo: {item.capacity}</span>
                          </span>
                          {item.targetAudience && item.targetAudience !== 'Todos los aprendices' && (
                            <span className="bg-white px-1.5 py-0.5 rounded border border-[#e2e8f0] truncate max-w-[220px] flex items-center gap-1" title={item.targetAudience}>
                              <Tag className="w-3 h-3 text-blue-600" />
                              <span className="truncate">{item.targetAudience}</span>
                            </span>
                          )}
                          <span className="bg-white px-1.5 py-0.5 rounded border border-[#e2e8f0] truncate max-w-[200px] flex items-center gap-1" title={item.location}>
                            <MapPin className="w-3 h-3 text-rose-500" />
                            <span className="truncate">{item.location}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Acciones para resolver ambigüedad */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-[#e2e8f0]/80 shrink-0">
                      {item.isAmbiguous ? (
                        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg flex-1 sm:flex-none">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="text-[10px] text-amber-900 font-bold shrink-0">Fijar Fecha:</span>
                          <input
                            type="date"
                            defaultValue={item.date || '2026-10-25'}
                            onChange={(e) => e.target.value && handleResolveAmbiguity(item.tempId, e.target.value)}
                            className="text-[10px] bg-white border border-amber-300 rounded px-1.5 py-0.5 w-full sm:w-auto font-mono"
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#15803d] bg-[#eafaf1] border border-[#bbf7d0] px-2 py-0.5 rounded font-bold shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Fecha Válida</span>
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MODO 2: VISTA TABLA DE DATOS REALES DE EXCEL */}
          {viewMode === 'table' && (
            <div className="card-ergonomic p-0 overflow-hidden border border-[#cbd5e1] rounded-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-[#cbd5e1] text-[#475569] font-mono text-[11px]">
                      <th className="py-2.5 px-3 w-10 text-center">SEL</th>
                      <th className="py-2.5 px-3">CÓDIGO</th>
                      <th className="py-2.5 px-3 min-w-[220px]">ACTIVIDAD REAL</th>
                      <th className="py-2.5 px-3">ÁREA</th>
                      <th className="py-2.5 px-3 min-w-[110px]">TRIMESTRE</th>
                      <th className="py-2.5 px-3 min-w-[160px]">LÍNEA DE ACCIÓN</th>
                      <th className="py-2.5 px-3 min-w-[140px]">FECHA PROGRAMADA</th>
                      <th className="py-2.5 px-3 text-center">CUPO</th>
                      <th className="py-2.5 px-3 min-w-[150px]">POBLACIÓN / FICHAS</th>
                      <th className="py-2.5 px-3 min-w-[150px]">RESPONSABLE</th>
                      <th className="py-2.5 px-3 min-w-[160px]">LUGAR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0] bg-white">
                    {displayedItems.map((item, idx) => (
                      <tr 
                        key={item.tempId}
                        className={`hover:bg-[#f8fafc] transition-colors ${item.selected ? 'bg-[#f0fdf4]/50' : 'opacity-70'}`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleSelect(item.tempId)}
                            className="w-4 h-4 rounded text-[#15803d] focus:ring-[#15803d]"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-[#64748b]">
                          {item.code}
                        </td>
                        <td className="py-2.5 px-3">
                          <strong className="block text-[#1e293b] font-heading">{item.title}</strong>
                          {item.groupTotal !== '' && item.groupTotal !== undefined && (
                            <span className="text-[10px] text-emerald-700">Total: {item.groupTotal}</span>
                          )}
                          {item.subactivities?.length > 0 && (
                            <span className="block text-[10px] text-blue-700 line-clamp-1">
                              Subactividad: {item.subactivity || item.subactivities.join(' · ')}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-mono bg-slate-100 text-[#0e2738] border border-slate-200 px-1.5 py-0.2 rounded font-bold whitespace-nowrap">
                            {item.area}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                            {item.quarter || 'Plan Anual'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-[#475569]">
                          {item.line}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">
                          {item.isAmbiguous ? (
                            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 p-1 rounded">
                              <input
                                type="date"
                                defaultValue={item.date || '2026-10-25'}
                                onChange={(e) => e.target.value && handleResolveAmbiguity(item.tempId, e.target.value)}
                                className="text-[10px] bg-white border border-amber-300 rounded px-1 py-0.5 font-mono"
                              />
                            </div>
                          ) : (
                            <span className="text-[#15803d] font-bold">{item.date}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-[#1e293b]">
                          {item.capacity}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-[#64748b]">
                          {item.targetAudience}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-[#334155]">
                          {item.responsibleName}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-[#64748b]">
                          {item.location}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-[#e2e8f0] flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs text-[#64748b] text-center sm:text-left">
              <strong>{extractedItems.filter(i => i.selected).length}</strong> de {extractedItems.length} actividades seleccionadas para incorporar
            </span>
            <button
              type="button"
              onClick={handleCommitEvents}
              className="btn btn-primary text-xs font-bold w-full sm:w-auto justify-center py-2.5 px-5 shadow-xs cursor-pointer"
            >
              <span>Confirmar y Guardar como Borradores</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
