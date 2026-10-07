import * as XLSX from 'xlsx';
import { DEMO_EXCEL_DATA } from '../data/mockData';

// Banco de imágenes temáticas de alta calidad para asignar dinámicamente según semántica
const THEMATIC_IMAGES = {
  musica: [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80'
  ],
  deportes: [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80'
  ],
  tecnologia: [
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=80'
  ],
  general: [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80'
  ]
};

// Obtener imagen aleatoria según contexto
export function getSemanticImage(area = '', text = '') {
  const normalized = (area + ' ' + text).toLowerCase();
  let pool = THEMATIC_IMAGES.general;

  if (normalized.includes('músic') || normalized.includes('sonor') || normalized.includes('canto') || normalized.includes('concierto') || normalized.includes('orquesta') || normalized.includes('batería')) {
    pool = THEMATIC_IMAGES.musica;
  } else if (normalized.includes('deport') || normalized.includes('futsal') || normalized.includes('atlet') || normalized.includes('volei') || normalized.includes('tenis') || normalized.includes('carrera') || normalized.includes('fútbol')) {
    pool = THEMATIC_IMAGES.deportes;
  } else if (normalized.includes('tecno') || normalized.includes('código') || normalized.includes('software') || normalized.includes('ia')) {
    pool = THEMATIC_IMAGES.tecnologia;
  }

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

// Descargar plantilla Excel real en el navegador
export function downloadSampleExcelTemplate() {
  const data = [
    {
      'Titulo': 'Taller de Iniciación al Jazz y Saxofón',
      'Proposito': 'Aprender técnicas de improvisación y ensamble de viento en acordes menores.',
      'Area': 'Música',
      'Capacidad': 40,
      'Horario': '14:00 - 16:30',
      'Lugar': 'Sala Acústica 2'
    },
    {
      'Titulo': 'Torneo Cuadrangular de Baloncesto Universitario',
      'Proposito': 'Desarrollar jugadas ofensivas y trabajo en equipo inter-programas.',
      'Area': 'Deportes',
      'Capacidad': 80,
      'Horario': '16:00 - 19:00',
      'Lugar': 'Coliseo Deportivo'
    },
    {
      'Titulo': 'Festival de Canción Inédita y Poesía Rítmica',
      'Proposito': 'Incentivar la creación literaria y melódica de los jóvenes creadores.',
      'Area': 'Música',
      'Capacidad': 65,
      'Horario': '15:00 - 18:00',
      'Lugar': 'Teatro al Aire Libre'
    },
    {
      'Titulo': 'Reto de Resistencia Crossfit y Circuito Funcional',
      'Proposito': 'Medir el rendimiento físico integral a través de estaciones de fuerza y agilidad.',
      'Area': 'Deportes',
      'Capacidad': 50,
      'Horario': '08:00 - 10:30',
      'Lugar': 'Zona Verde Central'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Eventos');

  // Anchos de columna automáticos
  worksheet['!cols'] = [
    { wch: 45 }, // Titulo
    { wch: 60 }, // Proposito
    { wch: 15 }, // Area
    { wch: 12 }, // Capacidad
    { wch: 18 }, // Horario
    { wch: 25 }  // Lugar
  ];

  XLSX.writeFile(workbook, 'Plantilla_Eventos_Institucionales.xlsx');
}

// Procesar archivo Excel/CSV subido por el usuario
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

// Modelo de análisis y abstracción de IA (Simulado con procesamiento de texto y semántica)
export function processRawRowsWithAI(rawRows, forcedArea = null) {
  const todayStr = new Date().toISOString().split('T')[0];

  return rawRows.map((row, index) => {
    // Normalizar claves sin importar mayúsculas o tildes
    const keys = Object.keys(row);
    const findVal = (terms) => {
      for (const key of keys) {
        const normKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (terms.some(t => normKey.includes(t))) {
          return row[key];
        }
      }
      return '';
    };

    const titulo = findVal(['titul', 'nombre', 'evento', 'actividad']) || `Evento Institucional #${index + 1}`;
    const proposito = findVal(['proposit', 'objetiv', 'descripcion', 'resumen', 'finalidad']) ||
      'Fomentar la participación activa, formación integral y convivencia entre todos los miembros de la comunidad.';
    
    let area = forcedArea || findVal(['area', 'categoria', 'departamento', 'disciplina']);
    if (!area) {
      // Inferencia semántica por IA
      const text = (titulo + ' ' + proposito).toLowerCase();
      if (text.includes('músic') || text.includes('cancion') || text.includes('sonid') || text.includes('instrument')) {
        area = 'Música';
      } else if (text.includes('deport') || text.includes('futbol') || text.includes('resistencia') || text.includes('torneo')) {
        area = 'Deportes';
      } else {
        area = 'Música';
      }
    }

    const capacidad = Number(findVal(['capacida', 'cupo', 'aforo', 'asistent'])) || (40 + (index * 15) % 60);
    const horario = findVal(['horari', 'hora', 'tiempo']) || '14:00 - 17:00';
    const lugar = findVal(['lugar', 'ubicacion', 'sitio', 'espacio']) || 'Instalaciones Principales';

    return {
      titulo,
      proposito,
      area,
      capacidad,
      horario,
      lugar,
      fecha: todayStr,
      imagen: getSemanticImage(area, titulo + ' ' + proposito),
      // Metadata del análisis
      confidenceScore: Math.floor(92 + Math.random() * 7) + '%',
      aiSummary: `Abstraído exitosamente: Título estructurado, propósito identificado con categoría ${area}.`
    };
  });
}
