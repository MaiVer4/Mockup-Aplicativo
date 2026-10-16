import * as XLSX from 'xlsx';
import { DEMO_ANNUAL_PLAN_SHEETS, AREAS } from '../data/mockData';

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

// Detección de expresiones ambiguas según RF-06
export function checkIsAmbiguousDate(dateString = '') {
  if (!dateString || typeof dateString !== 'string') {
    return { isAmbiguous: true, reason: 'Fecha no especificada en el archivo fuente.' };
  }
  const normalized = dateString.toLowerCase().trim();
  if (
    normalized.includes('por solicitud') ||
    normalized.includes('todo el mes') ||
    normalized.includes('según programación') ||
    normalized.includes('segun programacion') ||
    normalized.includes('por definir') ||
    normalized.includes('pendiente') ||
    normalized.includes('a convenir') ||
    normalized.includes('rango')
  ) {
    return {
      isAmbiguous: true,
      reason: `Expresión ambigua detectada ("${dateString}"). Bloqueada para publicación hasta decisión humana.`
    };
  }

  // Verificar si es formato fecha YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(normalized)) {
    return {
      isAmbiguous: true,
      reason: `Formato de fecha no normalizado ("${dateString}"). Requiere validación de fecha y hora exacta.`
    };
  }

  return { isAmbiguous: false, reason: null };
}

// 1. Descargar la Plantilla Oficial del Plan Anual SENA (multi-hoja: Cultura, Prevención, etc.)
export function downloadSampleAnnualPlanTemplate() {
  const workbook = XLSX.utils.book_new();

  Object.entries(DEMO_ANNUAL_PLAN_SHEETS).forEach(([sheetName, rows]) => {
    const formattedData = rows.map((r, i) => ({
      'Código': r.codigo || `ACT-${sheetName.substring(0, 3).toUpperCase()}-${i + 1}`,
      'Línea de Acción': r.linea,
      'Evento / Actividad': r.evento,
      'Trimestre': r.trimestre,
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

// 2. Parsear archivo Excel multi-hoja cargado por el Encargado
export async function parseMultiSheetExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const resultBySheet = {};

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          if (rawRows && rawRows.length > 0) {
            resultBySheet[sheetName] = rawRows;
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

// 3. Procesamiento semántico del modelo de IA sobre filas del Plan Anual
export function processPlanRowsWithAI(rawRows, area = 'Cultura', quarter = 'Trimestre 4') {
  return rawRows.map((row, index) => {
    const title = row['Evento / Actividad'] || row['Evento'] || row['Titulo'] || row['Actividad'] || row.evento || `Actividad ${index + 1}`;
    const code = row['Código'] || row['Codigo'] || row.codigo || `ACT-${area.substring(0, 3).toUpperCase()}-${index + 1}`;
    const line = row['Línea de Acción'] || row['Linea'] || row.linea || 'Formación y Bienestar Integral';
    const estimatedCapacity = Number(row['Aprendices Estimados'] || row['Capacidad'] || row['Cupo'] || row.aprendicesEstimados || 60);
    const dateValue = String(row['Mes / Fecha Programada'] || row['Fecha'] || row['Mes'] || row.mesFecha || '');
    const responsible = row['Responsable Sugerido'] || row['Responsable'] || row.responsable || 'Coordinación de Área';

    // Evaluación de ambigüedad
    let isAmbiguous = false;
    let ambiguityReason = null;
    if (typeof row.esAmbiguo === 'boolean') {
      isAmbiguous = row.esAmbiguo;
      ambiguityReason = row.motivoAmbiguedad || (isAmbiguous ? 'Fecha o datos pendientes de confirmación.' : null);
    } else {
      const ambiguityCheck = checkIsAmbiguousDate(dateValue);
      isAmbiguous = ambiguityCheck.isAmbiguous;
      ambiguityReason = ambiguityCheck.reason;
    }

    // Síntesis de propósito formativo y objetivo según el contexto
    const purpose = `Fomentar el desarrollo integral y el bienestar de los aprendices en la línea de ${line}, facilitando espacios de participación y convivencia.`;
    const objective = `Desarrollar competencias socioemocionales e incentivar la integración de las fichas de formación en el centro.`;

    const image = getSemanticImage(area, title + ' ' + line);

    return {
      tempId: `prop-${Date.now()}-${index}`,
      code,
      title,
      area,
      quarter: row['Trimestre'] || row.trimestre || quarter,
      line,
      purpose,
      objective,
      capacity: estimatedCapacity,
      date: isAmbiguous ? (dateValue && /^\d{4}-\d{2}-\d{2}$/.test(dateValue) ? dateValue : '2026-10-25') : dateValue,
      rawDateValue: dateValue,
      isAmbiguous,
      ambiguityReason,
      responsibleName: responsible,
      image,
      duration: '3 horas',
      time: '14:00 - 17:00',
      location: 'Centro de Formación - Auditorio / Canchas',
      status: 'borrador', // Nace siempre en borrador
      selected: true,
      confidenceScore: isAmbiguous ? 76 : 98
    };
  });
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
    ['Ciudad y Fecha:', `Bogotá D.C., ${event.date || new Date().toISOString().split('T')[0]}`, '', 'Regional:', 'Distrito Capital', '', 'Centro de Formación:', 'Centro de Servicios Financieros'],
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
      'Número Ficha / Grupo',
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
      p.trainingCenter || 'Centro de Servicios Financieros',
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
