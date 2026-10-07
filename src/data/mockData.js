// Datos de prueba y configuración inicial del sistema

export const USERS = [
  {
    id: 'user_admin_gen',
    username: 'admin',
    name: 'Ing. Carlos Mendoza',
    email: 'carlos.mendoza@institucion.edu',
    role: 'admin_general',
    roleLabel: 'Administrador General',
    area: null,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    description: 'Acceso irrestricto a todas las áreas, gestión global y analíticas consolidadas.'
  },
  {
    id: 'user_admin_musica',
    username: 'admin_musica',
    name: 'Prof. Elena Ríos',
    email: 'elena.musica@institucion.edu',
    role: 'admin_area',
    roleLabel: 'Coordinador de Área: Música',
    area: 'Música',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    description: 'Gestión exclusiva de eventos, asistencias y métricas del área de Música.'
  },
  {
    id: 'user_admin_deportes',
    username: 'admin_deportes',
    name: 'Lic. Mateo Silva',
    email: 'mateo.deportes@institucion.edu',
    role: 'admin_area',
    roleLabel: 'Coordinador de Área: Deportes',
    area: 'Deportes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Gestión exclusiva de eventos, asistencias y métricas del área de Deportes.'
  },
  {
    id: 'user_aprendiz',
    username: 'aprendiz',
    name: 'Sofía Castillo',
    email: 'sofia.aprendiz@estudiantes.edu',
    role: 'aprendiz',
    roleLabel: 'Aprendiz / Estudiante',
    area: 'General',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    description: 'Visualiza eventos publicados para la fecha actual y confirma su asistencia.'
  }
];

export const AREAS = ['Música', 'Deportes', 'Tecnología', 'Arte y Cultura'];

const todayStr = new Date().toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const INITIAL_EVENTS = [
  {
    id: 'evt-101',
    title: 'Ensamble Sinfónico y Batuta Joven',
    purpose: 'Promover la interpretación musical instrumental y el desarrollo acústico de agrupaciones corales y orquestales en formación.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    area: 'Música',
    date: todayStr,
    time: '14:00 - 17:00',
    location: 'Auditorio Principal - Bloque B',
    status: 'published', // 'draft' | 'published' | 'closed'
    attendanceEnabled: true,
    attendeesCount: 45,
    capacity: 70,
    attendedByUserIds: ['user_aprendiz'],
    createdAt: '2026-10-01'
  },
  {
    id: 'evt-102',
    title: 'Torneo Interfichas de Futsal y Voleibol Mixto',
    purpose: 'Fomentar la integración estudiantil, la sana convivencia y la actividad física a través de encuentros deportivos simultáneos.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    area: 'Deportes',
    date: todayStr,
    time: '15:30 - 18:30',
    location: 'Polideportivo Central',
    status: 'published',
    attendanceEnabled: true,
    attendeesCount: 68,
    capacity: 100,
    attendedByUserIds: [],
    createdAt: '2026-10-02'
  },
  {
    id: 'evt-103',
    title: 'Taller de Producción Sonora y Sintetizadores',
    purpose: 'Instruir a los participantes en técnicas de mezcla básica, síntesis analógica y masterización de pistas en entornos DAW.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    area: 'Música',
    date: todayStr,
    time: '16:00 - 18:00',
    location: 'Laboratorio de Audio 1',
    status: 'published',
    attendanceEnabled: false, // Asistencia aún no abierta
    attendeesCount: 20,
    capacity: 30,
    attendedByUserIds: [],
    createdAt: '2026-10-03'
  },
  {
    id: 'evt-104',
    title: 'Clínica de Acondicionamiento y Calistenia',
    purpose: 'Capacitación teórico-práctica en prevención de lesiones musculares, biomecánica del ejercicio y rutinas funcionales de alta intensidad.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    area: 'Deportes',
    date: yesterdayStr,
    time: '08:00 - 11:00',
    location: 'Pista de Atletismo Norte',
    status: 'closed', // Evento cerrado
    attendanceEnabled: false,
    attendeesCount: 52,
    capacity: 55,
    attendedByUserIds: ['user_aprendiz'],
    createdAt: '2026-09-28'
  },
  {
    id: 'evt-105',
    title: 'Festival Acústico de Cantautores y Solistas',
    purpose: 'Espacio para visibilizar las composiciones originales de los aprendices, estimulando la autoría lírica y armonía musical.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    area: 'Música',
    date: tomorrowStr,
    time: '17:00 - 19:30',
    location: 'Plazoleta de Eventos',
    status: 'draft', // Borrador pendiente de publicar
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
    titulo: 'Concierto de Cuerdas y Ensambles Acústicos',
    proposito: 'Estimular la sensibilidad auditiva y la ejecución coordinada de violines, violonchelos y guitarras clásicas.',
    area: 'Música',
    capacidad: 60,
    horario: '10:00 - 12:30',
    lugar: 'Sala de Cámara Musical'
  },
  {
    titulo: 'Campeonato Relámpago de Tenis de Mesa',
    proposito: 'Desarrollar reflejos rápidos, coordinación ojo-mano y camaradería a través de cuadros de eliminación directa.',
    area: 'Deportes',
    capacidad: 40,
    horario: '14:00 - 17:00',
    lugar: 'Gimnasio Cubierto A'
  },
  {
    titulo: 'Seminario de Armonía Moderna y Composición Jazz',
    proposito: 'Brindar herramientas teóricas para la progresión de acordes, escalas modales y arreglos orquestales contemporáneos.',
    area: 'Música',
    capacidad: 45,
    horario: '15:00 - 18:00',
    lugar: 'Aula Magna de Música'
  },
  {
    titulo: 'Jornada Recreativa de Voleibol de Playa y Resistencia',
    proposito: 'Ejercitar la fuerza muscular y movilidad en terreno de arena con dinámicas grupales y juego limpio.',
    area: 'Deportes',
    capacidad: 50,
    horario: '09:00 - 12:00',
    lugar: 'Canchas de Arena Sur'
  }
];
