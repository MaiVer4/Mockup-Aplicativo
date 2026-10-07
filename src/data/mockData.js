// Datos de prueba y configuración inicial del sistema con identidad académica

export const USERS = [
  {
    id: 'user_admin_gen',
    username: 'admin',
    name: 'Dr. Carlos Mendoza',
    email: 'carlos.mendoza@universidad.edu',
    role: 'admin_general',
    roleLabel: 'Decanatura General / Dirección de Extensión',
    shortRole: 'Decanatura',
    area: null,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    description: 'Autoridad institucional con supervisión de todas las facultades, validación curricular y analítica consolidada.'
  },
  {
    id: 'user_admin_musica',
    username: 'admin_musica',
    name: 'Mtra. Elena Ríos',
    email: 'elena.musica@universidad.edu',
    role: 'admin_area',
    roleLabel: 'Dirección del Depto. de Música',
    shortRole: 'Depto. Música',
    area: 'Música',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    description: 'Gestión académica de cátedras, ensambles y registro de asistencia en el área musical.'
  },
  {
    id: 'user_admin_deportes',
    username: 'admin_deportes',
    name: 'Lic. Mateo Silva',
    email: 'mateo.deportes@universidad.edu',
    role: 'admin_area',
    roleLabel: 'Dirección del Depto. de Deportes y Bienestar',
    shortRole: 'Depto. Deportes',
    area: 'Deportes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Coordinación de torneos interfichas, actividades físicas y asistencia estudiantil deportiva.'
  },
  {
    id: 'user_aprendiz',
    username: 'aprendiz',
    name: 'Sofía Castillo',
    email: 'sofia.castillo@estudiantes.edu',
    role: 'aprendiz',
    roleLabel: 'Estudiante / Aprendiz Matriculado',
    shortRole: 'Estudiante',
    area: 'General',
    matricula: 'MAT-2026-8842',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    description: 'Consulta de la agenda académica del día y acreditación de asistencia a convocatorias habilitadas.'
  }
];

export const AREAS = ['Música', 'Deportes', 'Tecnología', 'Arte y Humanidades'];

const todayStr = new Date().toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const INITIAL_EVENTS = [
  {
    id: 'evt-101',
    code: 'MUS-2026-101',
    title: 'Ensamble Sinfónico y Práctica Coral Polifónica',
    purpose: 'Desarrollar competencias en lectura a primera vista, ensamble orquestal e interpretación de repertorio clásico latinoamericano.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    area: 'Música',
    faculty: 'Facultad de Artes y Música',
    date: todayStr,
    time: '14:00 - 17:00',
    location: 'Auditorio Mayor - Bloque Académico B',
    status: 'published', // 'draft' | 'published' | 'closed'
    attendanceEnabled: true,
    attendeesCount: 45,
    capacity: 70,
    attendedByUserIds: ['user_aprendiz'],
    createdAt: '2026-10-01'
  },
  {
    id: 'evt-102',
    code: 'DEP-2026-102',
    title: 'Torneo Interdepartamental de Futsal y Formación Deportiva',
    purpose: 'Fomentar la cultura de integración comunitaria, rendimiento físico, valores cívicos y juego limpio inter-carreras.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    area: 'Deportes',
    faculty: 'Departamento de Bienestar y Deportes',
    date: todayStr,
    time: '15:30 - 18:30',
    location: 'Polideportivo del Campus Central',
    status: 'published',
    attendanceEnabled: true,
    attendeesCount: 68,
    capacity: 100,
    attendedByUserIds: [],
    createdAt: '2026-10-02'
  },
  {
    id: 'evt-103',
    code: 'MUS-2026-103',
    title: 'Cátedra Abierta de Producción Sonora y Síntesis Modular',
    purpose: 'Instruir a los estudiantes en fundamentos de procesamiento electroacústico, cadenas de efectos y mezcla en entornos DAW profesionales.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    area: 'Música',
    faculty: 'Facultad de Artes y Música',
    date: todayStr,
    time: '16:00 - 18:00',
    location: 'Laboratorio de Acústica y Sonido 1',
    status: 'published',
    attendanceEnabled: false, // Asistencia aún no abierta por el docente
    attendeesCount: 20,
    capacity: 30,
    attendedByUserIds: [],
    createdAt: '2026-10-03'
  },
  {
    id: 'evt-104',
    code: 'DEP-2026-104',
    title: 'Seminario Teórico-Práctico de Biomecánica y Acondicionamiento',
    purpose: 'Analizar la prevención biomecánica de lesiones, periodización del entrenamiento funcional y fisiología del esfuerzo deportivo.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    area: 'Deportes',
    faculty: 'Departamento de Bienestar y Deportes',
    date: yesterdayStr,
    time: '08:00 - 11:00',
    location: 'Pista de Atletismo - Sede Norte',
    status: 'closed', // Acta cerrada
    attendanceEnabled: false,
    attendeesCount: 52,
    capacity: 55,
    attendedByUserIds: ['user_aprendiz'],
    createdAt: '2026-09-28'
  },
  {
    id: 'evt-105',
    code: 'MUS-2026-105',
    title: 'Coloquio de Creación Musical e Interpretación Solista',
    purpose: 'Crear un espacio de investigación formativa y exposición para composiciones originales y ensambles instrumentales de grado.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    area: 'Música',
    faculty: 'Facultad de Artes y Música',
    date: tomorrowStr,
    time: '17:00 - 19:30',
    location: 'Aula Magna de Humanidades',
    status: 'draft', // Borrador curricular pendiente de publicación
    attendanceEnabled: false,
    attendeesCount: 0,
    capacity: 80,
    attendedByUserIds: [],
    createdAt: '2026-10-04'
  }
];

// Datos demo predefinidos listos para la simulación de extracción por IA
export const DEMO_EXCEL_DATA = [
  {
    titulo: 'Concierto Magistral de Cuerdas y Ensambles Barrocos',
    proposito: 'Estimular la disciplina del análisis auditivo histórico y la articulación técnica en violines, violonchelos y laúd.',
    area: 'Música',
    capacidad: 60,
    horario: '10:00 - 12:30',
    lugar: 'Sala de Cámara de Bellas Artes'
  },
  {
    titulo: 'Clínica Universitaria de Tenis de Mesa y Reflejos Motores',
    proposito: 'Desarrollar rapidez perceptiva, toma de decisiones bajo presión y coordinación neuromuscular mediante partidos cronometrados.',
    area: 'Deportes',
    capacidad: 40,
    horario: '14:00 - 17:00',
    lugar: 'Pabellón Polideportivo A'
  },
  {
    titulo: 'Taller de Armonía Modal Avanzada y Arreglos Orquestales',
    proposito: 'Capacitar a los compositores en rearmonización funcional, cadencias contemporáneas y estructuración de partituras.',
    area: 'Música',
    capacidad: 45,
    horario: '15:00 - 18:00',
    lugar: 'Laboratorio de Notación y Composición'
  },
  {
    titulo: 'Jornada de Resistencia Aeróbica y Salud Cardiovascular',
    proposito: 'Promover hábitos saludables de acondicionamiento físico continuado y control de métricas de frecuencia cardíaca.',
    area: 'Deportes',
    capacidad: 50,
    horario: '09:00 - 12:00',
    lugar: 'Circuito de Pista Verde'
  }
];
