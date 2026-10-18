import * as XLSX from 'xlsx';
import { DEMO_ANNUAL_PLAN_SHEETS, AREAS } from '../data/mockData.js';

// Banco de recursos visuales representativos según las 6 áreas del SENA Bienestar
const SENA_THEMATIC_IMAGES = {
  'Cultura': [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80'
  ],
  'Actividad Física': [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80'
  ],
  'Prevención': [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&auto=format&fit=crop&q=80'
  ],
  'Habilidades': [
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=80'
  ],
  'Arte': [
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80'
  ],
  'Liderazgo': [
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80'
  ],
  'General': [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80'
  ]
};

// Generador de imagen contextual según área y título
export function getSemanticImage(area = '', text = '') {
  const pool = SENA_THEMATIC_IMAGES[area] || SENA_THEMATIC_IMAGES['General'];
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

// Normalizador de texto para comparaciones semánticas difusas
function normalizeSearchText(str = '') {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Sinónimos institucionales de columnas utilizados en planes del SENA
const COLUMN_SYNONYMS = {
  title: [
    'evento / actividad', 'nombre de la actividad', 'nombre actividad', 'actividad', 
    'evento', 'titulo', 'título', 'denominacion', 'denominación', 'tema', 
    'acciones', 'descripcion', 'descripción', 'taller', 'jornada', 'encuentro', 
    'charla', 'accion a desarrollar', 'actividades a desarrollar', 'nombre'
  ],
  date: [
    'mes / fecha programada', 'fecha programada', 'fecha estimada', 'fecha de ejecucion', 
    'fecha de realización', 'fecha realizacion', 'fecha', 'mes', 'cronograma', 
    'calendario', 'programacion', 'programación', 'periodo', 'período', 'dia', 'día',
    'fecha de inicio', 'fecha inicio'
  ],
  capacity: [
    'aprendices estimados', 'cupos estimados', 'cupo', 'capacidad', 'cobertura', 
    'meta', 'aprendices', 'participantes', 'aforo', 'asistentes', 'cantidad', 
    'numero de aprendices', 'cupos'
  ],
  line: [
    'línea de acción', 'linea de accion', 'linea', 'línea', 'dimension', 'dimensión', 
    'eje', 'componente', 'tematica', 'temática', 'enfoque', 'area tematica'
  ],
  responsible: [
    'responsable sugerido', 'responsable', 'lider', 'líder', 'facilitador', 
    'encargado', 'instructor', 'orientador', 'apoyo', 'responsable del evento'
  ],
  location: [
    'lugar sugerido', 'lugar', 'ubicacion', 'ubicación', 'sitio', 'escenario', 
    'ambiente', 'espacio', 'sala', 'instalaciones'
  ],
  area: [
    'área', 'area', 'categoria', 'categoría', 'seccion', 'sección', 
    'coordinacion', 'coordinación', 'dependencia'
  ],
  quarter: [
    'trimestre de ejecucion', 'trimestre de ejecución', 'trimestre', 'cuatrimestre', 'fase', 'periodo academico', 'periodo', 'trim'
  ],
  code: [
    'código', 'codigo', 'cod', 'id', 'consecutivo', 'item', 'n°', 'num', 'numero'
  ],
  description: [
    'descripcion', 'descripción', 'detalle', 'descripcion de la actividad', 
    'alcance', 'metodologia', 'metodología', 'justificacion', 'justificación', 
    'contenido', 'temario', 'resumen'
  ],
  objective: [
    'objetivo', 'objetivo general', 'objetivos', 'proposito', 'propósito', 
    'finalidad', 'meta formativa', 'logro esperado'
  ],
  targetAudience: [
    'poblacion objetivo', 'población objetivo', 'dirigido a', 'fichas', 
    'aprendices convocados', 'programa', 'poblacion', 'destinatarios', 
    'fichas convocadas', 'beneficiarios', 'grupo', 'poblacion beneficiaria'
  ],
  cost: [
    'costo estimado (cop)', 'costo estimado', 'costo', 'presupuesto', 
    'inversion', 'inversión', 'valor', 'recursos'
  ],
  time: [
    'horario', 'hora', 'hora inicio', 'hora de realizacion', 
    'franja horaria', 'jornada', 'duracion', 'duración'
  ],
  observations: [
    'observaciones', 'observacion', 'notas', 'comentarios', 'requisitos'
  ]
};

// Asignación de columna a campo según sinónimos
export function matchColumnField(headerName = '') {
  const norm = normalizeSearchText(headerName);
  if (!norm) return null;

  // 1. Coincidencia exacta prioritaria
  for (const [field, synonyms] of Object.entries(COLUMN_SYNONYMS)) {
    if (synonyms.some(syn => norm === syn)) {
      return field;
    }
  }

  // 2. Coincidencia por inclusión: el encabezado del usuario contiene un sinónimo completo
  // Ordenamos por longitud descendente para que 'nombre de la actividad' gane sobre 'nombre'
  for (const [field, synonyms] of Object.entries(COLUMN_SYNONYMS)) {
    const sorted = [...synonyms].sort((a, b) => b.length - a.length);
    for (const syn of sorted) {
      if (norm.includes(syn)) {
        return field;
      }
    }
  }

  return null;
}

// Analizador y limpiador de fechas reales de Excel con evaluación RF-06
export function parseSmartDate(cellValue) {
  if (cellValue === null || cellValue === undefined || cellValue === '') {
    return {
      dateStr: '2026-10-25',
      isAmbiguous: true,
      ambiguityReason: 'Fecha no especificada en el archivo fuente (RF-06).'
    };
  }

  // 1. Si ya es una instancia de Date de JavaScript
  if (cellValue instanceof Date && !isNaN(cellValue.getTime())) {
    const year = cellValue.getFullYear();
    const month = String(cellValue.getMonth() + 1).padStart(2, '0');
    const day = String(cellValue.getDate()).padStart(2, '0');
    return {
      dateStr: `${year}-${month}-${day}`,
      isAmbiguous: false,
      ambiguityReason: null
    };
  }

  // 2. Si es número serial de Excel (ej: 45678)
  if (typeof cellValue === 'number' && cellValue > 25569 && cellValue < 60000) {
    const jsDate = new Date(Math.round((cellValue - 25569) * 86400 * 1000));
    const year = jsDate.getUTCFullYear();
    const month = String(jsDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(jsDate.getUTCDate()).padStart(2, '0');
    return {
      dateStr: `${year}-${month}-${day}`,
      isAmbiguous: false,
      ambiguityReason: null
    };
  }

  const str = String(cellValue).trim();
  const norm = normalizeSearchText(str);

  // 3. Expresiones ambiguas institucionales (RF-06)
  const ambiguousKeywords = [
    'por solicitud', 'todo el mes', 'segun programacion', 'por definir', 
    'pendiente', 'a convenir', 'permanente', 'durante el trimestre', 
    'semana 1', 'semana 2', 'semana 3', 'semana 4', 'a demanda', 
    'convenido', 'rango', 'flexible', 'continuo'
  ];

  for (const kw of ambiguousKeywords) {
    if (norm.includes(kw)) {
      return {
        dateStr: '2026-10-25',
        isAmbiguous: true,
        ambiguityReason: `Expresión ambigua detectada ("${str}"). Bloqueada para publicación hasta decisión humana (RF-06).`
      };
    }
  }

  // 4. Formato estándar YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return {
      dateStr: `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`,
      isAmbiguous: false,
      ambiguityReason: null
    };
  }

  // 5. Formato latino DD/MM/YYYY o DD-MM-YYYY
  const latMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (latMatch) {
    const [, d, m, y] = latMatch;
    return {
      dateStr: `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`,
      isAmbiguous: false,
      ambiguityReason: null
    };
  }

  // 6. Meses en español (ej: "15 de Octubre", "Octubre 2026", "Noviembre")
  const spanishMonths = {
    'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
    'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
    'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
  };

  for (const [mName, mNum] of Object.entries(spanishMonths)) {
    if (norm.includes(mName)) {
      // Buscar si tiene día especificado (1 a 31)
      const dayMatch = norm.match(/\b([1-9]|[12][0-9]|3[01])\b/);
      if (dayMatch) {
        const day = dayMatch[1].padStart(2, '0');
        return {
          dateStr: `2026-${mNum}-${day}`,
          isAmbiguous: false,
          ambiguityReason: null
        };
      }
      // Si solo tiene el mes, sugerir día 15 y marcar como ambigua para fijar día
      return {
        dateStr: `2026-${mNum}-15`,
        isAmbiguous: true,
        ambiguityReason: `Solo se especificó el mes ("${str}"). Fija el día exacto de la actividad.`
      };
    }
  }

  return {
    dateStr: '2026-10-25',
    isAmbiguous: true,
    ambiguityReason: `Formato de fecha no normalizado ("${str}"). Requiere validar fecha exacta.`
  };
}

// Extractor numérico inteligente para cupo/capacidad
export function parseSmartCapacity(cellValue) {
  if (typeof cellValue === 'number' && !isNaN(cellValue) && cellValue > 0) {
    return Math.round(cellValue);
  }
  if (cellValue) {
    const matches = String(cellValue).match(/\d+/);
    if (matches) {
      const num = parseInt(matches[0], 10);
      if (num > 0) return num;
    }
  }
  return 50; // Capacidad estándar institucional si no se especificó
}

// Detección automática de cabecera y filas reales en matriz 2D
export function detectHeaderAndRows(matrix = []) {
  if (!matrix || matrix.length === 0) {
    return { headerRowIndex: 0, headers: [], columnMap: {}, validRows: [] };
  }

  // 1. Escanear las primeras 15 filas buscando la cabecera con mayor puntuación
  let bestRowIndex = 0;
  let maxScore = -1;

  const maxScan = Math.min(matrix.length, 15);
  for (let r = 0; r < maxScan; r++) {
    const row = matrix[r] || [];
    let score = 0;
    
    row.forEach(cell => {
      const field = matchColumnField(String(cell));
      if (field) {
        score += (field === 'title' ? 3 : 1);
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestRowIndex = r;
    }
  }

  // 2. Extraer nombres de cabecera
  const headerCells = matrix[bestRowIndex] || [];
  const headers = headerCells.map((c, idx) => {
    const str = String(c).trim();
    return str || `Columna_${idx + 1}`;
  });

  // 3. Establecer el mapeo de columnas automático
  const columnMap = {};
  headers.forEach((h, idx) => {
    const matchedField = matchColumnField(h);
    if (matchedField && !columnMap[matchedField]) {
      columnMap[matchedField] = h;
    }
  });

  // Si no se encontró columna de título explícita, usar la primera columna con texto
  if (!columnMap.title && headers.length > 0) {
    columnMap.title = headers[0];
  }

  // 4. Filtrar filas de datos omitiendo totales, subtotales, notas y firmas
  const validRows = [];
  const invalidStarters = [
    'total', 'subtotal', 'suma', 'observaci', 'firma', 'elaboro', 
    'reviso', 'aprobo', 'coordinador', 'convenciones', 'nota:', 
    'responsable:', 'meta total', 'presupuesto total'
  ];

  for (let r = bestRowIndex + 1; r < matrix.length; r++) {
    const rowCells = matrix[r] || [];
    // Verificar si la fila está completamente vacía
    const hasAnyContent = rowCells.some(c => c !== null && c !== undefined && String(c).trim() !== '');
    if (!hasAnyContent) continue;

    // Convertir fila a objeto con nombres de columnas
    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = rowCells[idx] !== undefined ? rowCells[idx] : '';
    });

    // Validar celda de título
    const titleVal = columnMap.title ? rowObj[columnMap.title] : rowCells[0];
    const normTitle = normalizeSearchText(titleVal);

    if (!normTitle) continue; // Fila sin nombre de actividad

    const isGarbage = invalidStarters.some(prefix => normTitle.startsWith(prefix) || normTitle === prefix);
    if (isGarbage) continue;

    validRows.push(rowObj);
  }

  // 5. Propagación jerárquica (Forward-Fill) para columnas de Área, Línea y Trimestre
  let currentArea = '';
  let currentLine = '';
  let currentQuarter = '';

  validRows.forEach(row => {
    if (columnMap.area && row[columnMap.area] && String(row[columnMap.area]).trim() !== '') {
      currentArea = String(row[columnMap.area]).trim();
    } else if (columnMap.area && currentArea && (!row[columnMap.area] || String(row[columnMap.area]).trim() === '')) {
      row[columnMap.area] = currentArea;
    }

    if (columnMap.line && row[columnMap.line] && String(row[columnMap.line]).trim() !== '') {
      currentLine = String(row[columnMap.line]).trim();
    } else if (columnMap.line && currentLine && (!row[columnMap.line] || String(row[columnMap.line]).trim() === '')) {
      row[columnMap.line] = currentLine;
    }

    if (columnMap.quarter && row[columnMap.quarter] && String(row[columnMap.quarter]).trim() !== '') {
      currentQuarter = String(row[columnMap.quarter]).trim();
    } else if (columnMap.quarter && currentQuarter && (!row[columnMap.quarter] || String(row[columnMap.quarter]).trim() === '')) {
      row[columnMap.quarter] = currentQuarter;
    }
  });

  return {
    headerRowIndex: bestRowIndex,
    headers,
    columnMap,
    validRows,
    rawRows: validRows
  };
}

// Detección de expresiones ambiguas según RF-06 (compatibilidad)
export function checkIsAmbiguousDate(dateString = '') {
  const result = parseSmartDate(dateString);
  return { isAmbiguous: result.isAmbiguous, reason: result.ambiguityReason };
}

// 1. Descargar la Plantilla Oficial del Plan Anual SENA (multi-hoja: Cultura, Prevención, etc.)
export function downloadSampleAnnualPlanTemplate() {
  const workbook = XLSX.utils.book_new();

  Object.entries(DEMO_ANNUAL_PLAN_SHEETS).forEach(([sheetName, rows]) => {
    const formattedData = rows.map((r, i) => ({
      'Código': r.codigo || `ACT-${sheetName.substring(0, 3).toUpperCase()}-${i + 1}`,
      'Línea de Acción': r.linea,
      'Evento / Actividad': r.evento,
      'Trimestre': r.trimestre || 'Trimestre 4',
      'Aprendices Estimados': r.aprendicesEstimados,
      'Costo Estimado (COP)': r.costo,
      'Responsable Sugerido': r.responsable,
      'Mes / Fecha Programada': r.mesFecha,
      'Observaciones': r.esAmbiguo ? r.motivoAmbiguedad : 'Programación regular aprobada'
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    worksheet['!cols'] = [
      { wch: 12 }, // Código
      { wch: 30 }, // Línea
      { wch: 45 }, // Evento
      { wch: 14 }, // Trimestre
      { wch: 22 }, // Aprendices
      { wch: 20 }, // Costo
      { wch: 22 }, // Responsable
      { wch: 28 }, // Mes/Fecha
      { wch: 35 }  // Observaciones
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  XLSX.writeFile(workbook, 'Plan_Anual_Bienestar_SENA_2026.xlsx');
}

// 2. Parsear archivo Excel multi-hoja con auto-descubrimiento inteligente de encabezados
export async function parseMultiSheetExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        const resultBySheet = {};

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];

          // 1. Propagar automáticamente celdas combinadas institucionales (!merges)
          if (worksheet['!merges'] && Array.isArray(worksheet['!merges'])) {
            worksheet['!merges'].forEach(range => {
              const startAddress = XLSX.utils.encode_cell(range.s);
              const startCell = worksheet[startAddress];
              if (startCell && startCell.v !== undefined) {
                for (let R = range.s.r; R <= range.e.r; ++R) {
                  for (let C = range.s.c; C <= range.e.c; ++C) {
                    if (R === range.s.r && C === range.s.c) continue;
                    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                    worksheet[cellAddress] = { ...startCell };
                  }
                }
              }
            });
          }

          // 2. Leer matriz cruda de celdas con encabezados dinámicos
          const matrix = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', blankrows: false });
          
          if (matrix && matrix.length > 0) {
            const detected = detectHeaderAndRows(matrix);
            resultBySheet[sheetName] = {
              rawRows: detected.validRows,
              headers: detected.headers,
              columnMap: detected.columnMap,
              activitiesCount: detected.validRows.length,
              headerRowIndex: detected.headerRowIndex
            };
          }
        });

        resolve({
          fileName: file.name,
          sheetNames: workbook.SheetNames,
          sheetsData: resultBySheet
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

// Normalizador institucional de trimestre a partir del texto explícito del documento o fecha
export function normalizeQuarter(rawQuarter, dateStr = '') {
  if (rawQuarter !== undefined && rawQuarter !== null && String(rawQuarter).trim() !== '') {
    const qStr = String(rawQuarter).toLowerCase().trim();
    if (qStr === '1' || qStr === 't1' || qStr === 'i' || qStr.includes('trimestre 1') || qStr.includes('1 trimestre') || qStr.includes('primer')) {
      return 'Trimestre 1';
    }
    if (qStr === '2' || qStr === 't2' || qStr === 'ii' || qStr.includes('trimestre 2') || qStr.includes('2 trimestre') || qStr.includes('segundo')) {
      return 'Trimestre 2';
    }
    if (qStr === '3' || qStr === 't3' || qStr === 'iii' || qStr.includes('trimestre 3') || qStr.includes('3 trimestre') || qStr.includes('tercer')) {
      return 'Trimestre 3';
    }
    if (qStr === '4' || qStr === 't4' || qStr === 'iv' || qStr.includes('trimestre 4') || qStr.includes('4 trimestre') || qStr.includes('cuarto')) {
      return 'Trimestre 4';
    }
    if (qStr.includes('anual') || qStr.includes('ano') || qStr.includes('año')) {
      return 'Vigencia Anual';
    }
  }

  // Deducción por mes de la fecha si no vino columna explícita
  if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const month = parseInt(dateStr.split('-')[1], 10);
    if (month >= 1 && month <= 3) return 'Trimestre 1';
    if (month >= 4 && month <= 6) return 'Trimestre 2';
    if (month >= 7 && month <= 9) return 'Trimestre 3';
    if (month >= 10 && month <= 12) return 'Trimestre 4';
  }

  return 'Trimestre 1';
}

// 3. Procesamiento semántico del modelo de IA sobre filas del Plan Anual
export function processPlanRowsWithAI(rawRowsOrSheetData, area = 'Cultura', quarterFilter = 'all', customColumnMap = null) {
  // Manejar tanto el formato nuevo de sheetData como arrays directos de filas
  const rows = Array.isArray(rawRowsOrSheetData) 
    ? rawRowsOrSheetData 
    : (rawRowsOrSheetData?.rawRows || rawRowsOrSheetData?.validRows || []);
  
  const columnMap = customColumnMap || rawRowsOrSheetData?.columnMap || {};

  const mapped = rows.map((row, index) => {
    // 1. Título real de la actividad
    const title = (
      (columnMap.title && row[columnMap.title]) ||
      row['Evento / Actividad'] || row['Evento'] || row['Titulo'] || row['Actividad'] || 
      row['Nombre'] || row['Nombre de la Actividad'] || row.evento || `Actividad ${index + 1}`
    ).toString().trim();

    // 2. Línea de acción formativa
    const line = (
      (columnMap.line && row[columnMap.line]) ||
      row['Línea de Acción'] || row['Linea'] || row.linea || 'Formación y Bienestar Integral'
    ).toString().trim();

    // 3. Área institucional (detección en cascada)
    let assignedArea = area;
    const rowArea = columnMap.area ? row[columnMap.area] : (row['Área'] || row['Area'] || row.area);
    if (rowArea) {
      const normArea = normalizeSearchText(rowArea);
      const matchedArea = AREAS.find(a => normalizeSearchText(a) === normArea || normArea.includes(normalizeSearchText(a)));
      if (matchedArea) assignedArea = matchedArea;
    }

    // 4. Código oficial
    const code = (
      (columnMap.code && row[columnMap.code]) ||
      row['Código'] || row['Codigo'] || row.codigo || 
      `ACT-${assignedArea.substring(0, 3).toUpperCase()}-${String(index + 1).padStart(2, '0')}`
    ).toString().trim();

    // 5. Capacidad / Cupo proyectado
    const rawCapacity = columnMap.capacity ? row[columnMap.capacity] : (row['Aprendices Estimados'] || row['Capacidad'] || row['Cupo'] || row.aprendicesEstimados);
    const estimatedCapacity = parseSmartCapacity(rawCapacity);

    // 6. Fecha y evaluación de ambigüedad (RF-06)
    const rawDateValue = columnMap.date ? row[columnMap.date] : (row['Mes / Fecha Programada'] || row['Fecha'] || row['Mes'] || row.mesFecha);
    const dateParsed = parseSmartDate(rawDateValue);

    // 7. Trimestre explícito extraído de la fila
    const rawQuarterValue = (columnMap.quarter && row[columnMap.quarter]) || row['Trimestre'] || row['Periodo'] || row.trimestre;
    const explicitQuarter = normalizeQuarter(rawQuarterValue, dateParsed.dateStr);

    // 8. Responsable
    const responsible = (
      (columnMap.responsible && row[columnMap.responsible]) ||
      row['Responsable Sugerido'] || row['Responsable'] || row.responsable || 'Coordinación de Área'
    ).toString().trim();

    // 9. Lugar
    const location = (
      (columnMap.location && row[columnMap.location]) ||
      row['Lugar Sugerido'] || row['Lugar'] || row.location || 'Centro de Formación - Auditorio / Ambientes de Bienestar'
    ).toString().trim();

    // 10. Propósito y Objetivo (Prioridad al texto real del Excel)
    const rawPurpose = (
      (columnMap.description && row[columnMap.description]) ||
      row['Descripción'] || row['Descripcion'] || row['Detalle'] || row['Metodología'] || row['Metodologia'] || row['Justificación'] || ''
    ).toString().trim();

    const rawObjective = (
      (columnMap.objective && row[columnMap.objective]) ||
      row['Objetivo'] || row['Objetivo General'] || row['Propósito'] || row['Proposito'] || ''
    ).toString().trim();

    const purpose = rawPurpose || `Fomentar el desarrollo integral y el bienestar de los aprendices en la línea de ${line}, facilitando espacios de participación activa y convivencia comunitaria.`;
    const objective = rawObjective || `Desarrollar competencias socioemocionales e incentivar la integración y permanencia de las fichas de formación en el centro.`;

    // 11. Población objetivo / Fichas convocadas
    const targetAudience = (
      (columnMap.targetAudience && row[columnMap.targetAudience]) ||
      row['Población Objetivo'] || row['Poblacion Objetivo'] || row['Dirigido a'] || row['Fichas'] || row['Programa'] || 'Todos los aprendices'
    ).toString().trim();

    // 12. Costo / Presupuesto
    const cost = (columnMap.cost && row[columnMap.cost]) || row['Costo Estimado (COP)'] || row['Costo'] || row['Presupuesto'] || 0;

    // 13. Observaciones
    const observations = (
      (columnMap.observations && row[columnMap.observations]) ||
      row['Observaciones'] || row['Observacion'] || row['Notas'] || ''
    ).toString().trim();

    // 14. Horario real
    const rawTime = (
      (columnMap.time && row[columnMap.time]) ||
      row['Horario'] || row['Hora'] || row['Jornada'] || ''
    ).toString().trim();
    const time = rawTime || '14:00 - 17:00';

    const image = getSemanticImage(assignedArea, title + ' ' + line);

    return {
      tempId: `prop-${Date.now()}-${index}`,
      code,
      title,
      area: assignedArea,
      quarter: explicitQuarter,
      line,
      purpose,
      objective,
      targetAudience,
      cost,
      observations,
      capacity: estimatedCapacity,
      date: dateParsed.dateStr,
      rawDateValue: rawDateValue !== undefined ? String(rawDateValue) : '',
      isAmbiguous: dateParsed.isAmbiguous,
      ambiguityReason: dateParsed.ambiguityReason,
      responsibleName: responsible,
      image,
      duration: '3 horas',
      time,
      location,
      status: 'borrador', // Nace siempre en borrador para revisión humana
      selected: true,
      confidenceScore: dateParsed.isAmbiguous ? 82 : 99,
      originalRow: row // Preservar fila completa para auditoría celda a celda
    };
  });

  // Si se seleccionó un filtro de trimestre específico (diferente de 'all'), filtrar
  if (quarterFilter && quarterFilter !== 'all' && quarterFilter !== 'ALL') {
    return mapped.filter(item => item.quarter === quarterFilter);
  }

  return mapped;
}

// 4. Validación de inconsistencias pre-exportación
export function validateParticipantsBeforeExport(participantsList = []) {
  const errors = [];
  const warnings = [];

  if (participantsList.length === 0) {
    errors.push('No hay aprendices registrados en la lista de asistencia.');
    return { isValid: false, errors, warnings };
  }

  const seenDocuments = new Set();
  const seenEmails = new Set();

  participantsList.forEach((p, idx) => {
    const rowNum = idx + 1;
    // Obligatorios
    if (!p.name || p.name.trim() === '') {
      errors.push(`Fila ${rowNum}: El nombre del aprendiz es obligatorio.`);
    }
    if (!p.documentNumber || p.documentNumber.trim() === '') {
      errors.push(`Fila ${rowNum}: Número de documento faltante.`);
    } else {
      if (seenDocuments.has(p.documentNumber)) {
        errors.push(`Fila ${rowNum}: Documento duplicado (${p.documentNumber}).`);
      }
      seenDocuments.add(p.documentNumber);
    }
    if (!p.ficha || p.ficha.trim() === '') {
      warnings.push(`Fila ${rowNum}: Aprendiz ${p.name} no tiene número de ficha/grupo asignado.`);
    }
    if (!p.timestamp || p.timestamp.trim() === '') {
      errors.push(`Fila ${rowNum}: Registro sin firma temporal (timestamp de servidor).`);
    }
    if (p.email && seenEmails.has(p.email)) {
      warnings.push(`Fila ${rowNum}: Correo electrónico repetido (${p.email}).`);
    }
    if (p.email) seenEmails.add(p.email);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// 5. Exportar a XLSX compatible con la plantilla oficial SENA (Formato GOR-F-013 / Listado ejemplo.xlsx)
export function exportOfficialSenaAttendanceSheet(event, participantsList = []) {
  const workbook = XLSX.utils.book_new();

  // Matriz de celdas con la cabecera institucional estricta
  const rows = [
    ['SERVICIO NACIONAL DE APRENDIZAJE - SENA'],
    ['FORMATO DE CONTROL DE PARTICIPACIÓN EN ACTIVIDADES DE BIENESTAR AL APRENDIZ (GOR-F-013)'],
    ['SISTEMA INTEGRADO DE GESTIÓN // VERSIÓN OFICIAL 2.0'],
    [],
    ['Ciudad y Fecha:', `Armenia Quindío, ${event.date || new Date().toISOString().split('T')[0]}`, '', 'Regional:', 'Quindío', '', 'Centro de Formación:', 'SENA Centro de Comercio y Turismo Armenia Quindio'],
    ['Objetivo Estratégico:', 'Fortalecer el bienestar integral, la permanencia y el liderazgo biopsicosocial de los aprendices en su formación profesional.'],
    ['Objetivo Operativo:', event.objective || 'Estimular la participación ciudadana y la sana convivencia en la comunidad educativa.'],
    ['Nombre de la Actividad:', event.title, '', 'Área de Bienestar:', event.area, '', 'Código Oficial:', event.code || 'ACT-SENA-01'],
    ['Propósito:', event.purpose || 'Integración e incentivo formativo.'],
    ['Responsable Asignado:', event.responsibleName || 'Coordinador de Área', '', 'Aforo / Cupo Estimado:', event.capacity || 50, '', 'Total Asistentes:', participantsList.length],
    [],
    // Encabezado de la tabla de participantes oficial
    [
      'No.',
      'Nombres y Apellidos',
      'Tipo Doc.',
      'Número de Documento',
      'Género',
      'Ficha',
      'Modalidad',
      'Programa de Formación',
      'Jornada',
      'Nivel de Formación',
      'Centro de Formación / Lugar',
      'Correo Electrónico',
      'Teléfono',
      'Firma Manuscrita (Opcional)',
      'Firma Temporal Digital (Timestamp Servidor)'
    ]
  ];

  // Agregar filas de participantes
  participantsList.forEach((p, index) => {
    rows.push([
      index + 1,
      p.name || 'Aprendiz Registrado',
      p.documentType || 'CC',
      p.documentNumber || 'N/A',
      p.gender || 'N/R',
      p.ficha || 'N/A',
      p.modality || 'Presencial',
      p.program || 'Formación Titulada',
      p.jornada || 'Diurna',
      p.level || 'Tecnólogo',
      p.trainingCenter || 'SENA Centro de Comercio y Turismo Armenia Quindio',
      p.email || 'aprendiz@misena.edu.co',
      p.phone || 'N/A',
      '[Digital / Conforme]',
      p.timestamp || `${new Date().toISOString().split('T')[0]} 14:00:00`
    ]);
  });

  // Convertir a hoja de cálculo
  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Configurar anchos de columna institucionales
  worksheet['!cols'] = [
    { wch: 6 },  // No.
    { wch: 32 }, // Nombres y Apellidos
    { wch: 10 }, // Tipo Doc
    { wch: 18 }, // No. Documento
    { wch: 10 }, // Género
    { wch: 20 }, // Ficha
    { wch: 15 }, // Modalidad
    { wch: 35 }, // Programa
    { wch: 14 }, // Jornada
    { wch: 16 }, // Nivel
    { wch: 35 }, // Centro
    { wch: 30 }, // Correo
    { wch: 15 }, // Teléfono
    { wch: 22 }, // Firma
    { wch: 28 }  // Firma Temporal Digital
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Formato GOR-F-013');

  const fileName = `Asistencia_SENA_${(event.code || 'EVENTO').replace(/[^a-zA-Z0-9_-]/g, '_')}_${event.date || '2026'}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
