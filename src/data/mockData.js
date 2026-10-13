// Datos maestros, catálogos institucionales y configuración inicial del sistema SENA Bienestar al Aprendiz

export const AREAS = [
  'Cultura',
  'Prevención',
  'Habilidades',
  'Actividad Física',
  'Arte',
  'Liderazgo'
];

export const TRIMESTRES = [
  'Trimestre 1',
  'Trimestre 2',
  'Trimestre 3',
  'Trimestre 4'
];

export const TIPOS_DOCUMENTO = [
  'Cédula de Ciudadanía (CC)',
  'Tarjeta de Identidad (TI)',
  'Cédula de Extranjería (CE)',
  'Permiso por Protección Temporal (PPT)',
  'Pasaporte'
];

export const GENEROS = [
  'Femenino',
  'Masculino',
  'Otro',
  'Prefiero no reportar'
];

export const MODALIDADES = [
  'Presencial',
  'Virtual',
  'A Distancia / Mixta'
];

export const JORNADAS = [
  'Diurna',
  'Nocturna',
  'Mixta',
  'Madrugada',
  'Fines de semana'
];

export const NIVELES_FORMACION = [
  'Tecnólogo',
  'Técnico',
  'Operario',
  'Auxiliar',
  'Especialización Tecnológica'
];

export const PROGRAMAS_FORMACION = [
  'Análisis y Desarrollo de Software (ADSO)',
  'Gestión Empresarial',
  'Animación Digital 3D',
  'Contabilización de Operaciones Comerciales y Financieras',
  'Diseño e Integración Multimedia',
  'Mantenimiento Mecatrónico de Automotores',
  'Gestión de Redes de Datos',
  'Cocina y Gastronomía Colombiana'
];

export const CENTROS_FORMACION = [
  'Centro de Servicios Financieros - Regional Distrito Capital',
  'Centro de Gestión de Mercados, Logística y TIC - Regional Distrito Capital',
  'Centro de Electricidad, Electrónica y Telecomunicaciones - Regional Distrito Capital',
  'Centro de Biotecnología Agropecuaria - Regional Cundinamarca',
  'Centro Metalmecánico - Regional Distrito Capital',
  'Centro de Tecnologías para la Construcción y la Madera - Regional Distrito Capital'
];

// Usuarios representativos de los 3 roles
export const USERS = [
  {
    id: 'user_admin_gen',
    username: 'carlos.mendoza',
    name: 'Ing. Carlos Mendoza',
    email: 'carlos.mendoza@sena.edu.co',
    role: 'admin_general',
    roleLabel: 'Coordinación // Admin General',
    shortRole: 'Admin General',
    area: null,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    description: 'Supervisión de métricas consolidadas, gestión de encargados y generación de enlaces de invitación exclusivos. (No crea eventos ni exporta reportes).'
  },
  {
    id: 'user_enc_cultura',
    username: 'elena.rios',
    name: 'Elena Ríos',
    email: 'elena.rios@sena.edu.co',
    role: 'admin_area',
    roleLabel: 'Encargada // Área Cultura',
    shortRole: 'Encargada Cultura',
    area: 'Cultura',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    description: 'Gestión operacional, carga del plan anual Excel con IA, habilitación de asistencia y exportación oficial GOR-F-013 de Cultura.'
  },
  {
    id: 'user_enc_deportes',
    username: 'mateo.silva',
    name: 'Lic. Mateo Silva',
    email: 'mateo.silva@sena.edu.co',
    role: 'admin_area',
    roleLabel: 'Encargado // Actividad Física',
    shortRole: 'Encargado Act. Física',
    area: 'Actividad Física',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Gestión de torneos, acondicionamiento físico, toma de asistencia y exportación oficial GOR-F-013 de Actividad Física.'
  },
  {
    id: 'user_enc_prevencion',
    username: 'patricia.gomez',
    name: 'Dra. Patricia Gómez',
    email: 'patricia.gomez@sena.edu.co',
    role: 'admin_area',
    roleLabel: 'Encargada // Prevención y Salud',
    shortRole: 'Encargada Prevención',
    area: 'Prevención',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    description: 'Campañas de prevención de adicciones, salud integral y bienestar biopsicosocial.'
  },
  {
    id: 'user_aprendiz_sofia',
    username: '1020495821', // Cédula como usuario según RF-AUT-03
    name: 'Sofía Castillo',
    email: 'sofia.castillo@misena.edu.co',
    personalEmail: 'sofia.castillo.per@gmail.com',
    role: 'aprendiz',
    roleLabel: 'Aprendiz SENA // Perfil Completo',
    shortRole: 'Aprendiz',
    area: 'General',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    description: 'Aprendiz regular de formación titulada con ficha activa y perfil institucional completado.',
    isProfileComplete: true,
    documentType: 'Cédula de Ciudadanía (CC)',
    documentNumber: '1020495821',
    gender: 'Femenino',
    ficha: '2670192',
    modality: 'Presencial',
    program: 'Análisis y Desarrollo de Software (ADSO)',
    jornada: 'Diurna',
    level: 'Tecnólogo',
    trainingCenter: 'Centro de Servicios Financieros - Regional Distrito Capital',
    phone: '3157849201',
    profileLastUpdated: '2026-10-01'
  },
  {
    id: 'user_aprendiz_nuevo',
    username: '1014238910',
    name: 'Juan Pablo Duarte',
    email: 'juan.pablo.duarte@gmail.com',
    personalEmail: 'juan.pablo.duarte@gmail.com',
    role: 'aprendiz',
    roleLabel: 'Aprendiz SENA // Nuevo Ingreso (Sin Perfil)',
    shortRole: 'Aprendiz Nuevo',
    area: 'General',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    description: 'Aprendiz recién registrado con Google o credenciales básicas. Bloqueado hasta completar onboarding institucional.',
    isProfileComplete: false,
    documentType: '',
    documentNumber: '1014238910',
    gender: '',
    ficha: '',
    modality: '',
    program: '',
    jornada: '',
    level: '',
    trainingCenter: '',
    phone: '',
    profileLastUpdated: null
  }
];

// Participantes simulados para la exportación y visualización del listado oficial SENA
export const MOCK_PARTICIPANTS_DATABASE = [
  {
    id: 'part-01',
    name: 'Sofía Castillo',
    documentType: 'CC',
    documentNumber: '1020495821',
    gender: 'F',
    ficha: '2670192',
    modality: 'Presencial',
    program: 'Análisis y Desarrollo de Software (ADSO)',
    jornada: 'Diurna',
    level: 'Tecnólogo',
    trainingCenter: 'Centro de Servicios Financieros',
    email: 'sofia.castillo@misena.edu.co',
    phone: '3157849201',
    timestamp: '2026-10-13 14:05:12',
    status: 'asistio'
  },
  {
    id: 'part-02',
    name: 'Camilo Andrés Rodríguez',
    documentType: 'CC',
    documentNumber: '1018493021',
    gender: 'M',
    ficha: '2670192',
    modality: 'Presencial',
    program: 'Análisis y Desarrollo de Software (ADSO)',
    jornada: 'Diurna',
    level: 'Tecnólogo',
    trainingCenter: 'Centro de Servicios Financieros',
    email: 'camilo.rodriguez@misena.edu.co',
    phone: '3104928174',
    timestamp: '2026-10-13 14:06:40',
    status: 'asistio'
  },
  {
    id: 'part-03',
    name: 'Mariana Valentina Pérez',
    documentType: 'TI',
    documentNumber: '1082910394',
    gender: 'F',
    ficha: '2548910',
    modality: 'Presencial',
    program: 'Gestión Empresarial',
    jornada: 'Diurna',
    level: 'Tecnólogo',
    trainingCenter: 'Centro de Servicios Financieros',
    email: 'mariana.perez@misena.edu.co',
    phone: '3209182390',
    timestamp: '2026-10-13 14:08:15',
    status: 'asistio'
  },
  {
    id: 'part-04',
    name: 'David Santiago Morales',
    documentType: 'CC',
    documentNumber: '1032849102',
    gender: 'M',
    ficha: '2670192',
    modality: 'Presencial',
    program: 'Análisis y Desarrollo de Software (ADSO)',
    jornada: 'Diurna',
    level: 'Tecnólogo',
    trainingCenter: 'Centro de Servicios Financieros',
    email: 'david.morales@misena.edu.co',
    phone: '3119284710',
    timestamp: '2026-10-13 14:10:02',
    status: 'asistio'
  },
  {
    id: 'part-05',
    name: 'Laura Jimena Beltrán',
    documentType: 'CC',
    documentNumber: '1014892019',
    gender: 'F',
    ficha: '2718920',
    modality: 'Presencial',
    program: 'Contabilización de Operaciones Comerciales',
    jornada: 'Nocturna',
    level: 'Técnico',
    trainingCenter: 'Centro de Servicios Financieros',
    email: 'laura.beltran@misena.edu.co',
    phone: '3148920194',
    timestamp: '2026-10-13 14:12:33',
    status: 'asistio'
  },
  {
    id: 'part-06',
    name: 'Brayan Estiven Gómez',
    documentType: 'PPT',
    documentNumber: '92840192',
    gender: 'M',
    ficha: '2670192',
    modality: 'Presencial',
    program: 'Análisis y Desarrollo de Software (ADSO)',
    jornada: 'Diurna',
    level: 'Tecnólogo',
    trainingCenter: 'Centro de Servicios Financieros',
    email: 'brayan.gomez@misena.edu.co',
    phone: '3169284012',
    timestamp: '2026-10-13 14:15:50',
    status: 'asistio'
  },
  {
    id: 'part-07',
    name: 'Paula Andrea Muñoz',
    documentType: 'CC',
    documentNumber: '1029481902',
    gender: 'F',
    ficha: '2548910',
    modality: 'Presencial',
    program: 'Gestión Empresarial',
    jornada: 'Diurna',
    level: 'Tecnólogo',
    trainingCenter: 'Centro de Servicios Financieros',
    email: 'paula.munoz@misena.edu.co',
    phone: '3128491029',
    timestamp: '2026-10-13 14:18:22',
    status: 'asistio'
  },
  {
    id: 'part-08',
    name: 'Sebastián Vargas Cruz',
    documentType: 'CC',
    documentNumber: '1019284756',
    gender: 'M',
    ficha: '2829102',
    modality: 'Virtual',
    program: 'Animación Digital 3D',
    jornada: 'Mixta',
    level: 'Tecnólogo',
    trainingCenter: 'Centro de Gestión de Mercados',
    email: 'sebastian.vargas@misena.edu.co',
    phone: '3179283019',
    timestamp: '2026-10-13 14:20:10',
    status: 'asistio'
  }
];

const todayStr = new Date().toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

// Eventos estructurados según ciclo de vida de 4 estados y contexto SENA
export const INITIAL_EVENTS = [
  {
    id: 'evt-sena-201',
    code: 'ACT-CUL-01',
    title: 'Festival Institucional de Danza y Tradición Folclórica',
    purpose: 'Promover la identidad cultural y la integración comunitaria de los aprendices mediante muestras de danza tradicional colombiana.',
    objective: 'Fomentar el sentido de pertenencia y expresión corporal en la comunidad educativa.',
    extendedDescription: 'Espacio de integración donde las diferentes fichas presentarán coreografías representativas de las cinco regiones naturales de Colombia. Se contará con acompañamiento de jurados invitados de la Secretaría de Cultura y premiación a las tres mejores presentaciones.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    area: 'Cultura',
    quarter: 'Trimestre 4',
    date: todayStr,
    time: '14:00 - 17:00',
    duration: '3 horas',
    location: 'Auditorio Central - Bloque A',
    status: 'en_curso', // Estado 3: En curso (asistencia abierta ahora)
    capacity: 120,
    preattendanceCount: 48,
    attendeesCount: 36,
    preattendedByUserIds: ['user_aprendiz_sofia'],
    attendedByUserIds: ['user_aprendiz_sofia'],
    responsibleId: 'user_enc_cultura',
    responsibleName: 'Elena Ríos',
    sourceText: 'Hoja Cultura Fila 14: Danza y Folclor Regional. Cupo estimado 120.',
    isAmbiguous: false,
    ambiguityReason: null,
    createdAt: '2026-10-01'
  },
  {
    id: 'evt-sena-202',
    code: 'ACT-DEP-02',
    title: 'Torneo Interfichas de Voleibol Mixto y Salud Física',
    purpose: 'Estimular hábitos de vida activa, disciplina deportiva y trabajo colaborativo entre aprendices de diferentes áreas.',
    objective: 'Desarrollar competencias de integración e higiene postural en jornadas deportivas.',
    extendedDescription: 'Campeonato relámpago con 12 equipos mixtos inscritos. Cada equipo cuenta con 6 integrantes en cancha y 2 suplentes. Las eliminatorias se jugarán en dos tiempos de 15 puntos por set.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    area: 'Actividad Física',
    quarter: 'Trimestre 4',
    date: todayStr,
    time: '16:00 - 19:00',
    duration: '3 horas',
    location: 'Polideportivo Cubierto - Cancha 1',
    status: 'publicado', // Estado 2: Publicado (permite Preasistencia)
    capacity: 90,
    preattendanceCount: 22,
    attendeesCount: 0,
    preattendedByUserIds: ['user_aprendiz_sofia'],
    attendedByUserIds: [],
    responsibleId: 'user_enc_deportes',
    responsibleName: 'Lic. Mateo Silva',
    sourceText: 'Hoja Actividad F Fila 08: Voleibol Interfichas. Cupo 90.',
    isAmbiguous: false,
    ambiguityReason: null,
    createdAt: '2026-10-02'
  },
  {
    id: 'evt-sena-203',
    code: 'ACT-PREV-03',
    title: 'Jornada Integral de Salud Mental y Manejo del Estrés',
    purpose: 'Brindar herramientas prácticas de autorregulación emocional, resiliencia y prevención del agotamiento académico a aprendices en formación.',
    objective: 'Fortalecer habilidades para la vida y mitigar factores de deserción temprana.',
    extendedDescription: 'Sesiones simultáneas con profesionales en psicología clínica y neuropsicología. Talleres vivenciales de respiración diafragmática, reestructuración cognitiva y primeros auxilios psicológicos comunitarios.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    area: 'Prevención',
    quarter: 'Trimestre 4',
    date: tomorrowStr,
    time: '09:00 - 12:00',
    duration: '3 horas',
    location: 'Aulas Múltiples 301 y 302',
    status: 'publicado',
    capacity: 75,
    preattendanceCount: 31,
    attendeesCount: 0,
    preattendedByUserIds: [],
    attendedByUserIds: [],
    responsibleId: 'user_enc_prevencion',
    responsibleName: 'Dra. Patricia Gómez',
    sourceText: 'Hoja Prevención Fila 19: Salud Mental Integral. Cupo 75.',
    isAmbiguous: false,
    ambiguityReason: null,
    createdAt: '2026-10-04'
  },
  {
    id: 'evt-sena-204',
    code: 'ACT-HAB-04',
    title: 'Bootcamp de Comunicación Asertiva y Negociación Ética',
    purpose: 'Perfeccionar las habilidades comunicativas y de resolución no violenta de conflictos en equipos multidisciplinarios.',
    objective: 'Potenciar la empleabilidad mediante comunicación verbal y no verbal efectiva.',
    extendedDescription: 'Simulación de mesas de concertación y debates guiados bajo el método de negociación de Harvard. Aplicable a aprendices de etapas electiva y productiva.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    area: 'Habilidades',
    quarter: 'Trimestre 4',
    date: todayStr,
    time: '10:00 - 13:00',
    duration: '3 horas',
    location: 'Sala de Conferencias B',
    status: 'borrador', // Estado 1: Borrador (apenas extraído de Excel / pendiente publicación)
    capacity: 60,
    preattendanceCount: 0,
    attendeesCount: 0,
    preattendedByUserIds: [],
    attendedByUserIds: [],
    responsibleId: 'user_enc_cultura',
    responsibleName: 'Elena Ríos',
    sourceText: 'Hoja Habilidades Fila 05: Oratoria y Liderazgo. Fechas a confirmar.',
    isAmbiguous: true,
    ambiguityReason: 'Texto fuente indica "Según programación de voceros". Requiere fijar fecha definitiva antes de publicar.',
    createdAt: '2026-10-05'
  },
  {
    id: 'evt-sena-205',
    code: 'ACT-ART-05',
    title: 'Muestra Colectiva de Pintura al Óleo y Expresión Gráfica',
    purpose: 'Exponer los trabajos artísticos elaborados en los talleres semestrales de artes plásticas del centro de formación.',
    objective: 'Generar espacios de visibilización para el talento gráfico y plástico de los aprendices.',
    extendedDescription: 'Galería abierta en el pasillo central del centro de formación con más de 40 lienzos expuestos. Clausura con entrega de certificados y bitácora de asistencia archivada.',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
    area: 'Arte',
    quarter: 'Trimestre 3',
    date: yesterdayStr,
    time: '08:00 - 14:00',
    duration: '6 horas',
    location: 'Plazoleta de las Banderas',
    status: 'finalizado', // Estado 4: Finalizado (cerrado, listo para exportar GOR-F-013)
    capacity: 80,
    preattendanceCount: 65,
    attendeesCount: 58,
    preattendedByUserIds: ['user_aprendiz_sofia'],
    attendedByUserIds: ['user_aprendiz_sofia'],
    responsibleId: 'user_enc_cultura',
    responsibleName: 'Elena Ríos',
    sourceText: 'Hoja Arte Fila 12: Muestra colectiva de fin de ciclo.',
    isAmbiguous: false,
    ambiguityReason: null,
    createdAt: '2026-09-28'
  },
  {
    id: 'evt-sena-206',
    code: 'ACT-LID-06',
    title: 'Cumbre de Voceros y Representantes de Ficha 2026',
    purpose: 'Consolidar la mesa de concertación de aprendices líderes para canalizar propuestas de mejora institucional.',
    objective: 'Empoderar el liderazgo juvenil y la participación democrática en el SENA.',
    extendedDescription: 'Encuentro con la dirección de centro, coordinadores académicos y representantes estudiantiles para evaluar el cronograma de actividades y bienestar institucional.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
    area: 'Liderazgo',
    quarter: 'Trimestre 4',
    date: tomorrowStr,
    time: '14:00 - 18:00',
    duration: '4 horas',
    location: 'Auditorio Mayor Bloque C',
    status: 'publicado',
    capacity: 100,
    preattendanceCount: 42,
    attendeesCount: 0,
    preattendedByUserIds: [],
    attendedByUserIds: [],
    responsibleId: 'user_enc_cultura',
    responsibleName: 'Elena Ríos',
    sourceText: 'Hoja Liderazgo Fila 02: Encuentro General de Voceros.',
    isAmbiguous: false,
    ambiguityReason: null,
    createdAt: '2026-10-06'
  }
];

// Enlaces de invitación exclusivos activos para Administradores de Área (RF-ADM-03, RF-ENC-01)
export const INITIAL_INVITE_LINKS = [
  {
    id: 'inv-link-01',
    code: 'SENA-ENC-CULTURA-2026',
    area: 'Cultura',
    url: 'https://bienestar.sena.edu.co/registro-encargado?token=SENA-ENC-CULTURA-2026',
    createdBy: 'Ing. Carlos Mendoza',
    createdAt: '2026-10-10',
    usesCount: 1,
    status: 'active'
  },
  {
    id: 'inv-link-02',
    code: 'SENA-ENC-DEPORTES-2026',
    area: 'Actividad Física',
    url: 'https://bienestar.sena.edu.co/registro-encargado?token=SENA-ENC-DEPORTES-2026',
    createdBy: 'Ing. Carlos Mendoza',
    createdAt: '2026-10-10',
    usesCount: 1,
    status: 'active'
  },
  {
    id: 'inv-link-03',
    code: 'SENA-ENC-PREVENCION-2026',
    area: 'Prevención',
    url: 'https://bienestar.sena.edu.co/registro-encargado?token=SENA-ENC-PREVENCION-2026',
    createdBy: 'Ing. Carlos Mendoza',
    createdAt: '2026-10-12',
    usesCount: 1,
    status: 'active'
  }
];

// Datos demo del Plan Anual de Actividades (simulación de Actividades 2026.xlsx con sus 6 hojas)
export const DEMO_ANNUAL_PLAN_SHEETS = {
  'Cultura': [
    {
      codigo: 'CUL-01',
      linea: 'Expresión Artística y Danza',
      evento: 'Taller de Iniciación a la Salsa Caleña y Ritmos Afro',
      aprendicesEstimados: 50,
      costo: 350000,
      responsable: 'Elena Ríos',
      mesFecha: '2026-10-20',
      trimestre: 'Trimestre 4',
      esAmbiguo: false,
      motivoAmbiguedad: ''
    },
    {
      codigo: 'CUL-02',
      linea: 'Patrimonio y Memoria',
      evento: 'Visita Guiada y Recorrido Histórico al Museo Nacional',
      aprendicesEstimados: 40,
      costo: 420000,
      responsable: 'Elena Ríos',
      mesFecha: 'Por solicitud de centros',
      trimestre: 'Trimestre 4',
      esAmbiguo: true,
      motivoAmbiguedad: 'Texto indica "Por solicitud de centros". Requiere fecha y hora exacta acordada.'
    },
    {
      codigo: 'CUL-03',
      linea: 'Literatura y Oralidad',
      evento: 'Concurso de Declamación Poética y Stand Up Pedagógico',
      aprendicesEstimados: 65,
      costo: 280000,
      responsable: 'Elena Ríos',
      mesFecha: '2026-11-05',
      trimestre: 'Trimestre 4',
      esAmbiguo: false,
      motivoAmbiguedad: ''
    }
  ],
  'Actividad Física': [
    {
      codigo: 'DEP-01',
      linea: 'Torneos y Campeonatos',
      evento: 'Campeonato Relámpago de Tenis de Mesa y Coordinación',
      aprendicesEstimados: 32,
      costo: 180000,
      responsable: 'Mateo Silva',
      mesFecha: '2026-10-25',
      trimestre: 'Trimestre 4',
      esAmbiguo: false,
      motivoAmbiguedad: ''
    },
    {
      codigo: 'DEP-02',
      linea: 'Acondicionamiento y Salud',
      evento: 'Circuito Cardio-Funcional y Pruebas Antropométricas',
      aprendicesEstimados: 75,
      costo: 220000,
      responsable: 'Mateo Silva',
      mesFecha: 'Todo el mes de noviembre',
      trimestre: 'Trimestre 4',
      esAmbiguo: true,
      motivoAmbiguedad: 'Texto indica "Todo el mes de noviembre". Debe definirse una fecha/ventana puntual antes de publicar.'
    }
  ],
  'Prevención': [
    {
      codigo: 'PREV-01',
      linea: 'Salud Integral y Vida Sana',
      evento: 'Campaña de Tamizaje Visual y Donación de Sangre Cruz Roja',
      aprendicesEstimados: 120,
      costo: 0,
      responsable: 'Patricia Gómez',
      mesFecha: '2026-10-28',
      trimestre: 'Trimestre 4',
      esAmbiguo: false,
      motivoAmbiguedad: ''
    },
    {
      codigo: 'PREV-02',
      linea: 'Salud Mental y Convivencia',
      evento: 'Taller de Manejo de Duelo y Pérdidas Significativas',
      aprendicesEstimados: 45,
      costo: 300000,
      responsable: 'Patricia Gómez',
      mesFecha: 'Según programación',
      trimestre: 'Trimestre 4',
      esAmbiguo: true,
      motivoAmbiguedad: 'Texto indica "Según programación". Bloqueado para publicación directa hasta asignar fecha.'
    }
  ],
  'Habilidades': [
    {
      codigo: 'HAB-01',
      linea: 'Habilidades Blandas para el Empleo',
      evento: 'Simulación de Entrevista de Trabajo en Inglés y Marca Personal',
      aprendicesEstimados: 60,
      costo: 150000,
      responsable: 'Elena Ríos',
      mesFecha: '2026-11-12',
      trimestre: 'Trimestre 4',
      esAmbiguo: false,
      motivoAmbiguedad: ''
    }
  ],
  'Arte': [
    {
      codigo: 'ART-01',
      linea: 'Artes Plásticas y Visuales',
      evento: 'Taller de Ilustración Digital y Creación de Fanzines',
      aprendicesEstimados: 35,
      costo: 210000,
      responsable: 'Elena Ríos',
      mesFecha: '2026-11-18',
      trimestre: 'Trimestre 4',
      esAmbiguo: false,
      motivoAmbiguedad: ''
    }
  ],
  'Liderazgo': [
    {
      codigo: 'LID-01',
      linea: 'Participación y Ciudadanía',
      evento: 'Mesa Redonda sobre Democracia y Derechos Humanos en el SENA',
      aprendicesEstimados: 80,
      costo: 190000,
      responsable: 'Carlos Mendoza',
      mesFecha: '2026-11-20',
      trimestre: 'Trimestre 4',
      esAmbiguo: false,
      motivoAmbiguedad: ''
    }
  ]
};
