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
  Clock
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
        'Análisis Inteligente Completado',
        `Se reconocieron ${processed.length} actividades reales en la hoja "${sheetName}". ${ambCount > 0 ? `${ambCount} requieren fijar fecha exacta.` : 'Todas listas para revisión.'}`,
        ambCount > 0 ? 'warning' : 'success'
      );
    }, 850);
  };

  // Carga manual de archivo Excel real (.xlsx, .xls, .csv)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProcessing(true);
      const parsed = await parseMultiSheetExcelFile(file);
      setParsedWorkbook(parsed);

      // Determinar la mejor hoja a usar
      // 1. Hoja con nombre de área del usuario
      // 2. Primera hoja que tenga actividades detectadas
      // 3. Primera hoja del libro
      let targetSheet = parsed.sheetNames.find(s => s.toLowerCase().includes(selectedSheet.toLowerCase())) ||
                        parsed.sheetNames.find(s => parsed.sheetsData[s]?.activitiesCount > 0) ||
                        parsed.sheetNames[0];

      setSelectedSheet(targetSheet);
      const sheetData = parsed.sheetsData[targetSheet];

      if (!sheetData || sheetData.activitiesCount === 0) {
        setProcessing(false);
        addToast(
          'Hoja sin actividades', 
          `No se detectaron filas con actividades en la hoja "${targetSheet}". Por favor selecciona otra hoja.`, 
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
      addToast('Error al procesar', 'No se pudo leer el archivo Excel. Verifica que tenga un formato de tabla válido.', 'warning');
    }
  };

  // Cambio de hoja en archivo Excel real cargado
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

  // Conmutar selección individual
  const toggleSelect = (tempId) => {
    setExtractedItems(prev => prev.map(item => 
      item.tempId === tempId ? { ...item, selected: !item.selected } : item
    ));
  };

  // Seleccionar todas / Deseleccionar todas
  const toggleSelectAll = () => {
    const allSelected = extractedItems.every(i => i.selected);
    setExtractedItems(prev => prev.map(item => ({ ...item, selected: !allSelected })));
  };

  // Resolver ambigüedad en línea (RF-06)
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

  // Regenerar imagen contextual con IA
  const handleRegenerateImage = (tempId, area, text) => {
    const newImg = getSemanticImage(area, text);
    setExtractedItems(prev => prev.map(item => 
      item.tempId === tempId ? { ...item, image: newImg } : item
    ));
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
                    <small className="text-[10px] text-[#64748b] font-mono">{item.date} • {item.area} • Cupo: {item.capacity}</small>
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

  const allSelected = extractedItems.length > 0 && extractedItems.every(i => i.selected);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Encabezado Principal */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] font-heading tracking-tight">
          Importar Plan desde Excel
        </h1>
        <p className="text-xs md:text-sm text-[#64748b] mt-1">
          Reconoce automáticamente las actividades reales de tu archivo institucional mediante auto-detección de cabeceras y mapeo semántico.
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
                Área / Categoría Institucional
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
                Trimestre de Ejecución
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
                El motor analiza la estructura real del archivo, detecta encabezados omitiendo membretes institucionales superiores e interpreta actividades reales, fechas, cupos y lugares.
              </p>
            </div>
          </div>

          {/* Dropzone Ergonómico */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-[190px] border-2 border-dashed border-[#cbd5e1] hover:border-[#15803d] bg-[#f8fafc] hover:bg-white rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all group"
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
              Admite formatos reales: XLSX multi-hoja, XLS y CSV
            </span>
            <small className="text-[10px] text-[#94a3b8] mt-0.5">
              Tolerancia automática a encabezados en filas 2 a 10 y membretes SENA
            </small>
          </div>

          {/* Nota de análisis inteligente */}
          <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between text-xs text-[#475569]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#15803d] shrink-0" />
              <div>
                <strong className="block text-[11px] text-[#1e293b]">Reconocimiento automático de actividades reales</strong>
                <small className="text-[10px] text-[#64748b]">Filtra filas de totales, firmas y notas, extrayendo solo las acciones formativas genuinas.</small>
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
                  <span>Analizando información del archivo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Probar con Plan Demo de {selectedSheet}</span>
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
              <span>Descargar plantilla</span>
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
                Verifica las actividades del archivo. Puedes resolver fechas ambiguas antes de crear los borradores.
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
              </div>

              {currentSheetData && currentSheetData.headers && currentSheetData.headers.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsColumnMappingOpen(!isColumnMappingOpen)}
                  className="btn-ghost text-xs text-[#15803d] font-bold flex items-center gap-1 hover:underline ml-auto"
                >
                  <span>{isColumnMappingOpen ? 'Cerrar ajuste' : 'Ajustar mapeo'}</span>
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
              </div>
            )}
          </div>

          {/* Barra de Selección Masiva */}
          <div className="flex items-center justify-between gap-2 pt-1 pb-1">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-xs font-semibold text-[#15803d] hover:text-[#166534] flex items-center gap-1.5"
            >
              {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-[#64748b]" />}
              <span>{allSelected ? 'Deseleccionar todas' : 'Seleccionar todas'}</span>
            </button>

            <span className="text-xs text-[#64748b]">
              <strong>{extractedItems.filter(i => i.selected).length}</strong> de {extractedItems.length} seleccionadas
            </span>
          </div>

          {/* Lista de propuestas con tarjetas enriquecidas */}
          <div className="space-y-3">
            {extractedItems.map(item => (
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

                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-14 h-12 sm:w-16 sm:h-14 rounded-lg object-cover shrink-0 border border-[#e2e8f0]"
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <strong className="text-xs text-[#1e293b] font-heading font-bold truncate max-w-full">
                          {item.title}
                        </strong>
                        <span className="text-[10px] font-mono bg-slate-100 text-[#0e2738] border border-slate-200 px-1.5 py-0.2 rounded font-bold shrink-0">
                          {item.area}
                        </span>
                        {item.code && (
                          <span className="text-[10px] font-mono text-[#64748b] bg-white px-1.5 py-0.2 rounded border border-[#e2e8f0]">
                            {item.code}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#475569] line-clamp-2 sm:line-clamp-1 leading-snug">
                        {item.purpose}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-[#64748b] font-mono pt-0.5">
                        <span className="bg-white px-1.5 py-0.5 rounded border border-[#e2e8f0] shrink-0 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#15803d]" />
                          <span>{item.date}</span>
                        </span>
                        <span className="bg-white px-1.5 py-0.5 rounded border border-[#e2e8f0] shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#64748b]" />
                          <span>{item.time || item.duration || '14:00 - 17:00'}</span>
                        </span>
                        <span className="bg-white px-1.5 py-0.5 rounded border border-[#e2e8f0] shrink-0 flex items-center gap-1">
                          <Users className="w-3 h-3 text-[#15803d]" />
                          <span>Cupo: {item.capacity}</span>
                        </span>
                        <span className="bg-white px-1.5 py-0.5 rounded border border-[#e2e8f0] truncate max-w-[200px] sm:max-w-xs flex items-center gap-1" title={item.location}>
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span className="truncate">{item.location}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones para resolver ambigüedad o regenerar imagen */}
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

                    <button
                      type="button"
                      onClick={() => handleRegenerateImage(item.tempId, item.area, item.title)}
                      className="btn-ghost text-[10px] text-[#64748b] hover:text-[#1e293b] p-1.5 rounded-lg border border-[#e2e8f0] bg-white shrink-0"
                      title="Regenerar portada temática con IA"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#15803d]" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#e2e8f0] flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs text-[#64748b] text-center sm:text-left">
              <strong>{extractedItems.filter(i => i.selected).length}</strong> de {extractedItems.length} actividades seleccionadas para incorporar
            </span>
            <button
              type="button"
              onClick={handleCommitEvents}
              className="btn btn-primary text-xs font-bold w-full sm:w-auto justify-center py-2.5 px-5 shadow-xs"
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
