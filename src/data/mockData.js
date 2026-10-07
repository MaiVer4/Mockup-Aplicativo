// Datos de prueba y configuración inicial del sistema con arquitectura empresarial

export const USERS = [
  {
    id: 'user_admin_gen',
    username: 'admin',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@enterprise.org',
    role: 'admin_general',
    roleLabel: 'Admin Global // Full Access',
    shortRole: 'Admin Global',
    area: null,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    description: 'Acceso irrestricto a todas las divisiones, ingesta de datos, analítica global y operaciones de cierre.'
  },
  {
    id: 'user_admin_musica',
    username: 'admin_musica',
    name: 'Elena Ríos',
    email: 'elena.rios@enterprise.org',
    role: 'admin_area',
    roleLabel: 'Lead // División Música',
    shortRole: 'Lead Música',
    area: 'Música',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    description: 'Control operacional de eventos, quórum y control de asistencia para la vertical de Música.'
  },
  {
    id: 'user_admin_deportes',
    username: 'admin_deportes',
    name: 'Mateo Silva',
    email: 'mateo.silva@enterprise.org',
    role: 'admin_area',
    roleLabel: 'Lead // División Deportes',
    shortRole: 'Lead Deportes',
    area: 'Deportes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Control operacional de eventos, quórum y control de asistencia para la vertical de Deportes.'
  },
  {
    id: 'user_aprendiz',
    username: 'aprendiz',
    name: 'Sofía Castillo',
    email: 'sofia.castillo@associates.org',
    role: 'aprendiz',
    roleLabel: 'Participante // Aprendiz',
    shortRole: 'Aprendiz',
    area: 'General',
    matricula: 'ID-8842',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    description: 'Acceso a la cartelera diaria de eventos publicados y registro de asistencia en tiempo real.'
  }
];

export const AREAS = ['Música', 'Deportes', 'Tecnología', 'Innovación'];

const todayStr = new Date().toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const INITIAL_EVENTS = [
  {
    id: 'evt-101',
    code: 'EVT-101',
    title: 'Ensamble Sinfónico y Práctica Coral Polifónica',
    purpose: 'Desarrollar competencias en lectura a primera vista, ensamble orquestal e interpretación de repertorio clásico latinoamericano.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    area: 'Música',
    date: todayStr,
    time: '14:00 - 17:00',
    location: 'Auditorio Principal (Bloque B)',
    status: 'published', // 'draft' | 'published' | 'closed'
    attendanceEnabled: true,
    attendeesCount: 45,
    capacity: 70,
    attendedByUserIds: ['user_aprendiz'],
    createdAt: '2026-10-01'
  },
  {
    id: 'evt-102',
    code: 'EVT-102',
    title: 'Torneo Interfichas de Futsal y Formación Deportiva',
    purpose: 'Fomentar la cultura de integración corporativa, rendimiento físico, valores cívicos y juego limpio interdepartamental.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    area: 'Deportes',
    date: todayStr,
    time: '15:30 - 18:30',
    location: 'Complejo Deportivo Central',
    status: 'published',
    attendanceEnabled: true,
    attendeesCount: 68,
    capacity: 100,
    attendedByUserIds: [],
    createdAt: '2026-10-02'
  },
  {
    id: 'evt-103',
    code: 'EVT-103',
    title: 'Cátedra de Producción Sonora y Síntesis Modular',
    purpose: 'Instruir a los participantes en fundamentos de procesamiento electroacústico, cadenas de efectos y mezcla en entornos DAW profesionales.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    area: 'Música',
    date: todayStr,
    time: '16:00 - 18:00',
    location: 'Sound Lab 01',
    status: 'published',
    attendanceEnabled: false,
    attendeesCount: 20,
    capacity: 30,
    attendedByUserIds: [],
    createdAt: '2026-10-03'
  },
  {
    id: 'evt-104',
    code: 'EVT-104',
    title: 'Seminario de Biomecánica y Acondicionamiento Físico',
    purpose: 'Analizar la prevención biomecánica de lesiones, periodización del entrenamiento funcional y fisiología del esfuerzo deportivo.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    area: 'Deportes',
    date: yesterdayStr,
    time: '08:00 - 11:00',
    location: 'Pista Atlética Norte',
    status: 'closed',
    attendanceEnabled: false,
    attendeesCount: 52,
    capacity: 55,
    attendedByUserIds: ['user_aprendiz'],
    createdAt: '2026-09-28'
  },
  {
    id: 'evt-105',
    code: 'EVT-105',
    title: 'Coloquio de Creación Musical e Interpretación Solista',
    purpose: 'Crear un espacio de investigación formativa y exposición para composiciones originales y ensambles instrumentales de grado.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    area: 'Música',
    date: tomorrowStr,
    time: '17:00 - 19:30',
    location: 'Sala de Conferencias A',
    status: 'draft',
    attendanceEnabled: false,
    attendeesCount: 0,
    capacity: 80,
    attendedByUserIds: [],
    createdAt: '2026-10-04'
  }
];

export const DEMO_EXCEL_DATA = [
  {
    titulo: 'Concierto Magistral de Cuerdas y Ensambles Barrocos',
    proposito: 'Estimular la disciplina del análisis auditivo histórico y la articulación técnica en violines, violonchelos y laúd.',
    area: 'Música',
    capacidad: 60,
    horario: '10:00 - 12:30',
    lugar: 'Auditorio de Cámara'
  },
  {
    titulo: 'Clínica Corporativa de Tenis de Mesa y Reflejos Motores',
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
    lugar: 'Sala de Notación Digital'
  },
  {
    titulo: 'Jornada de Resistencia Aeróbica y Salud Cardiovascular',
    proposito: 'Promover hábitos saludables de acondicionamiento físico continuado y control de métricas de frecuencia cardíaca.',
    area: 'Deportes',
    capacidad: 50,
    horario: '09:00 - 12:00',
    lugar: 'Circuito Central'
  }
];
