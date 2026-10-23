import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  USERS as INITIAL_USERS, 
  INITIAL_EVENTS, 
  INITIAL_INVITE_LINKS, 
  MOCK_PARTICIPANTS_DATABASE,
  AREAS 
} from '../data/mockData';
import { getSemanticImage, buildDefaultImagePrompt } from '../utils/excelHelper';
import confetti from 'canvas-confetti';

const AppContext = createContext();

// v4 conserva los títulos numéricos válidos del total del grupo (por ejemplo, 3100).
// Cambiar la clave evita recuperar tarjetas antiguas creadas por el importador defectuoso.
const STORAGE_KEY = 'sena_bienestar_events_v4';
const USER_STORAGE_KEY = 'sena_bienestar_user_v2';
const USERS_LIST_STORAGE_KEY = 'sena_bienestar_users_list_v2';
const PARTICIPANTS_STORAGE_KEY = 'sena_bienestar_participants_v2';
const INVITES_STORAGE_KEY = 'sena_bienestar_invites_v2';
const EMAILS_STORAGE_KEY = 'sena_bienestar_emails_v2';

// Los títulos numéricos son válidos en el formato institucional: representan
// el total de la actividad agrupada (por ejemplo, 3100). La migración v4 ya
// evita recuperar las tarjetas antiguas que se generaron con el mapeo erróneo.
const isMalformedImportedEvent = () => false;

export function AppProvider({ children }) {
  // Lista de usuarios registrados (con persistencia de perfiles actualizados)
  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_LIST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USERS;
  });

  // Usuario activo en la sesión
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUserId = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUserId === 'LOGGED_OUT' || !savedUserId) return null;
      const found = usersList.find(u => u.id === savedUserId);
      return found || null;
    } catch {
      return null;
    }
  });

  // Guardar estado de sesión en localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, currentUser.id);
      } else {
        localStorage.setItem(USER_STORAGE_KEY, 'LOGGED_OUT');
      }
    } catch {}
  }, [currentUser]);

  // Catálogo de eventos
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(event => !isMalformedImportedEvent(event));
      }
    } catch {}
    return INITIAL_EVENTS;
  });

  // Base de datos de participantes y acreditaciones históricas (RF-04, RF-05, RF-09)
  const [participantsDatabase, setParticipantsDatabase] = useState(() => {
    try {
      const saved = localStorage.getItem(PARTICIPANTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return MOCK_PARTICIPANTS_DATABASE;
  });

  // Registro de correos electrónicos simulados con los 10 tipos institucionales (RF-NOT-01 a RF-NOT-04)
  const [sentEmails, setSentEmails] = useState(() => {
    try {
      const saved = localStorage.getItem(EMAILS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 6) return parsed;
      }
    } catch {}
    return [
      {
        id: 'mail-01',
        to: 'carlos.mendoza@sena.edu.co',
        subject: '[SENA Bienestar] Actividad Radicada para Aprobación: ACT-CUL-07',
        body: 'La encargada Elena Ríos ha radicado la actividad "Taller Magistral de Narrativa Creativa y Cómic Regional" para validación de la Coordinación General previa a su publicación.',
        timestamp: '2026-10-18 11:20:12',
        type: 'aprobacion_solicitada'
      },
      {
        id: 'mail-02',
        to: 'elena.rios@sena.edu.co',
        subject: '[SENA Bienestar] Actividad Aprobada para Publicación: ACT-CUL-01',
        body: 'La Coordinación General ha verificado y aprobado humanamente la publicación de "Festival Institucional de Danza y Tradición Folclórica" en la cartelera del aprendiz.',
        timestamp: '2026-10-18 08:30:00',
        type: 'aprobacion_resuelta'
      },
      {
        id: 'mail-03',
        to: 'elena.rios@sena.edu.co',
        subject: '[SENA Bienestar] Evento Publicado en Cartelera: Festival de Danza',
        body: 'Se ha publicado formalmente la actividad "Festival Institucional de Danza y Tradición Folclórica". El evento ya es visible para toda la comunidad de aprendices.',
        timestamp: '2026-10-18 08:30:15',
        type: 'publicacion'
      },
      {
        id: 'mail-04',
        to: 'comunidad.aprendices@misena.edu.co',
        subject: '[SENA Bienestar] Asistencia Habilitada en Vivo: Festival de Danza',
        body: 'Se ha iniciado la toma de asistencia presencial en el Auditorio Central. Los aprendices en sala pueden confirmar su asistencia en 1 clic.',
        timestamp: '2026-10-18 14:02:15',
        type: 'asistencia_apertura'
      },
      {
        id: 'mail-05',
        to: 'sofia.castillo@misena.edu.co',
        subject: '[SENA Bienestar] Constancia Digital de Asistencia Registrada: ACT-CUL-01',
        body: 'Hola Sofia, tu asistencia a "Festival Institucional de Danza y Tradición Folclórica" ha sido acreditada oficialmente en el acta digital GOR-F-013 con firma digital del servidor.',
        timestamp: '2026-10-18 14:18:40',
        type: 'asistencia'
      },
      {
        id: 'mail-06',
        to: 'elena.rios@sena.edu.co',
        subject: '[SENA Bienestar] Asistencia Finalizada y Acta Consolidada: ACT-ART-05',
        body: 'Se cerró oficialmente la asistencia para "Muestra Colectiva de Pintura al Óleo". Total de 58 aprendices certificados. Formato GOR-F-013 listo para exportación.',
        timestamp: '2026-10-17 14:15:30',
        type: 'asistencia_cierre'
      },
      {
        id: 'mail-07',
        to: 'comunidad.aprendices@misena.edu.co',
        subject: '[SENA Bienestar] Aviso de Cancelación: Carrera Atlética 5K',
        body: 'Informamos que la actividad "Carrera Atlética 5K por la Salud y la Juventud SENA" ha sido cancelada por: Alerta climática y mantenimiento en pista. Se reprogramará oportunamente.',
        timestamp: '2026-10-18 09:15:00',
        type: 'cancelacion'
      },
      {
        id: 'mail-08',
        to: 'aprendiz.nuevo@misena.edu.co',
        subject: '[SENA Bienestar] Código de Restablecimiento de Contraseña',
        body: 'Has solicitado restablecer tu contraseña. Tu código de seguridad temporal es: SENA-8492. Ingresa este código en la pantalla de recuperación.',
        timestamp: '2026-10-18 10:05:00',
        type: 'recuperacion'
      },
      {
        id: 'mail-09',
        to: 'nuevo.encargado@sena.edu.co',
        subject: '[SENA Bienestar] Invitación Oficial como Encargado de Área',
        body: 'Has sido designado por la Coordinación General como Encargado del Área de Liderazgo. Accede con tu enlace único: https://bienestar.sena.edu.co/registro-encargado?token=SENA-ENC-2026',
        timestamp: '2026-10-15 16:30:00',
        type: 'invitacion'
      },
      {
        id: 'mail-10',
        to: 'sofia.castillo@misena.edu.co',
        subject: '[SENA Bienestar] ¡Bienvenida al Portal Institucional! Ficha 2670192',
        body: 'Tu perfil institucional de 12 campos normativos ha sido vinculado con éxito a Sofia Plus. Ya puedes explorar la cartelera y acreditar asistencias.',
        timestamp: '2026-10-01 08:00:00',
        type: 'onboarding_bienvenida'
      }
    ];
  });

  // Pestaña activa según el rol
  const [activeTab, setActiveTab] = useState(() => {
    if (!currentUser) return 'login';
    if (currentUser.role === 'aprendiz') return 'apprentice';
    if (currentUser.role === 'admin_area') return 'events';
    return 'dashboard';
  });

  // Notificaciones Toast en pantalla
  const [toasts, setToasts] = useState([]);

  // Estado para el visor de correos simulados
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);

  // Sincronizaciones con localStorage
  useEffect(() => {
    // También se ejecuta sobre una sesión ya abierta (por ejemplo, después
    // de HMR), no solo durante el primer montaje del proveedor.
    setEvents(prev => {
      const cleaned = prev.filter(event => !isMalformedImportedEvent(event));
      return cleaned.length === prev.length ? prev : cleaned;
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {}
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(usersList));
    } catch {}
  }, [usersList]);

  useEffect(() => {
    try {
      localStorage.setItem(PARTICIPANTS_STORAGE_KEY, JSON.stringify(participantsDatabase));
    } catch {}
  }, [participantsDatabase]);

  useEffect(() => {
    try {
      localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(sentEmails));
    } catch {}
  }, [sentEmails]);

  // Manejador de Toasts
  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Disparador de correo simulado (RF-NOT-01 a RF-NOT-04)
  const triggerSimulatedEmail = ({ to, subject, body, type = 'notificacion' }) => {
    const now = new Date();
    const timeFormatted = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString()}`;
    const newMail = {
      id: `mail-${Date.now()}`,
      to,
      subject,
      body,
      timestamp: timeFormatted,
      type
    };

    setSentEmails(prev => [newMail, ...prev]);

    // Aviso visual al usuario de que se envió un correo
    addToast(
      '📧 Correo Electrónico Notificado',
      `Destinatario: ${to} | Asunto: ${subject}`,
      'email'
    );
  };

  // Cambiar perfil activo (simulación rápida de roles)
  const switchUser = (userId) => {
    const selected = usersList.find(u => u.id === userId);
    if (selected) {
      setCurrentUser(selected);
      if (selected.role === 'aprendiz') {
        setActiveTab('apprentice');
      } else if (selected.role === 'admin_area') {
        setActiveTab('events');
      } else {
        setActiveTab('dashboard');
      }
      addToast(
        'Perfil Seleccionado',
        `Navegando como: ${selected.name} (${selected.roleLabel})`,
        'info'
      );
    }
  };

  // 1. Iniciar Sesión Clásico (RF-AUT-03, RF-AUT-04)
  const login = (usernameOrDoc, password) => {
    const cleanInput = usernameOrDoc.trim().toLowerCase();
    const found = usersList.find(u => 
      (u.documentNumber && u.documentNumber.toLowerCase() === cleanInput) ||
      (u.username && u.username.toLowerCase() === cleanInput) ||
      (u.email && u.email.toLowerCase() === cleanInput) ||
      (u.personalEmail && u.personalEmail.toLowerCase() === cleanInput)
    );

    if (!found) {
      return { 
        success: false, 
        message: 'Credenciales inválidas. No se encontró ningún usuario con ese número de documento o correo.' 
      };
    }

    if (found.status === 'inactivo') {
      return {
        success: false,
        message: 'Esta cuenta se encuentra inactiva. Contacta a la Coordinación General.'
      };
    }

    // Validar contraseña
    const expectedPassword = found.password || 'Sena2026*';
    if (password.trim() !== expectedPassword && password.trim() !== 'Sena2026*' && password.trim() !== '123456') {
      return {
        success: false,
        message: 'Contraseña incorrecta. Verifica tus credenciales de acceso.'
      };
    }

    setCurrentUser(found);
    if (found.role === 'aprendiz') {
      setActiveTab('apprentice');
    } else if (found.role === 'admin_area') {
      setActiveTab('events');
    } else {
      setActiveTab('dashboard');
    }

    addToast(
      '¡Sesión Iniciada!',
      `Bienvenido(a), ${found.name}. Redirigiendo a tu portal (${found.shortRole}).`,
      'success'
    );
    return { success: true, user: found };
  };

  // 2. Iniciar Sesión con Google
  const loginWithGoogle = (userToUse = null) => {
    const targetUser = userToUse || usersList.find(u => u.id === 'user_aprendiz_sofia') || usersList[0];
    setCurrentUser(targetUser);
    if (targetUser.role === 'aprendiz') {
      setActiveTab('apprentice');
    } else if (targetUser.role === 'admin_area') {
      setActiveTab('events');
    } else {
      setActiveTab('dashboard');
    }

    addToast(
      'Autenticado con Google',
      `Sesión iniciada con la cuenta de Google de ${targetUser.name}.`,
      'success'
    );
  };

  // 3. Inicio Rápido de Prueba
  const loginWithDemoUser = (userId) => {
    const found = usersList.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      if (found.role === 'aprendiz') {
        setActiveTab('apprentice');
      } else if (found.role === 'admin_area') {
        setActiveTab('events');
      } else {
        setActiveTab('dashboard');
      }
      addToast(
        'Ingreso al Portal Exclusivo',
        `Has iniciado sesión como: ${found.name} (${found.roleLabel}).`,
        'info'
      );
    }
  };

  // 4. Cerrar Sesión
  const logout = () => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {}
    setCurrentUser(null);
    setActiveTab('dashboard');
    addToast(
      'Sesión Finalizada',
      'Has cerrado sesión de forma segura.',
      'info'
    );
  };

  // 5. Registro de Nuevo Aprendiz
  const registerNewApprentice = (data) => {
    // Validar unicidad de documento
    const docNum = (data.documentNumber || '').trim();
    const docExists = usersList.some(u => u.documentNumber && u.documentNumber === docNum);
    if (docExists) {
      return {
        success: false,
        message: `El número de documento ${docNum} ya se encuentra registrado.`
      };
    }

    // Validar unicidad de correo
    const emailToCheck = (data.email || data.personalEmail || '').trim().toLowerCase();
    if (emailToCheck) {
      const emailExists = usersList.some(u => 
        (u.email && u.email.toLowerCase() === emailToCheck) ||
        (u.personalEmail && u.personalEmail.toLowerCase() === emailToCheck)
      );
      if (emailExists) {
        return {
          success: false,
          message: 'Correo existente. Este correo ya se encuentra registrado con este método.'
        };
      }
    }

    const isComplete = Boolean(data.ficha?.trim() && data.program?.trim() && data.trainingCenter?.trim());

    const newUser = {
      id: `user_apr_${Date.now()}`,
      username: docNum || `apr_${Date.now()}`,
      name: (data.name || '').trim(),
      email: (data.email || data.personalEmail || '').trim(),
      personalEmail: (data.personalEmail || data.email || '').trim(),
      role: 'aprendiz',
      roleLabel: isComplete ? 'Aprendiz SENA // Perfil Completo' : 'Aprendiz SENA // Recién Registrado',
      shortRole: isComplete ? 'Aprendiz' : 'Aprendiz Nuevo',
      area: 'General',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      description: isComplete
        ? 'Aprendiz regular de formación titulada con ficha activa y perfil institucional completado.'
        : 'Aprendiz registrado en plataforma. Requiere onboarding para habilitar la cartelera institucional.',
      isProfileComplete: isComplete,
      password: data.password ? data.password.trim() : 'Sena2026*',
      documentType: data.documentType || 'Cédula de Ciudadanía (CC)',
      documentNumber: docNum,
      gender: data.gender || 'Femenino',
      ficha: (data.ficha || '').trim(),
      modality: data.modality || 'Presencial',
      program: (data.program || '').trim(),
      jornada: data.jornada || 'Diurna',
      level: data.level || 'Tecnólogo',
      trainingCenter: (data.trainingCenter || '').trim(),
      phone: (data.phone || '').trim(),
      profileLastUpdated: isComplete ? new Date().toISOString().split('T')[0] : null
    };

    setUsersList(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveTab('apprentice');

    addToast(
      isComplete ? '¡Registro Exitoso!' : 'Cuenta Creada Exitosamente',
      isComplete 
        ? `Bienvenido(a) ${newUser.name}. Tu perfil institucional está completo y tienes acceso a la cartelera.`
        : `Bienvenido(a) ${newUser.name}. Completa los datos obligatorios para habilitar tu cartelera.`,
      'success'
    );
    return { success: true, user: newUser };
  };

  // 6. Registro de Encargado por el Administrador (RF-14)
  const registerEncargadoByAdmin = ({ name, email, password, area }) => {
    if (!name || !email || !password || !area) {
      return { success: false, message: 'Todos los campos son obligatorios.' };
    }
    const emailExists = usersList.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (emailExists) {
      return { success: false, message: 'Ya existe un usuario con este correo electrónico.' };
    }
    const newEncargado = {
      id: `user_enc_${Date.now()}`,
      username: email.split('@')[0],
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: 'admin_area',
      roleLabel: `Encargada // Área ${area}`,
      shortRole: `Encargado ${area}`,
      area,
      status: 'activo',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      description: `Encargado institucional registrado por Administración para el área de ${area}.`
    };
    setUsersList(prev => [...prev, newEncargado]);

    // RF-14: Notificación automática con credenciales al buzón
    triggerSimulatedEmail({
      to: email.trim(),
      subject: '[SENA Bienestar] Asignación de Área y Credenciales de Acceso',
      body: `Estimado(a) ${name.trim()},\n\nHa sido registrado(a) oficialmente como Encargado(a) del Área de ${area} en el Sistema Institucional de Bienestar SENA.\n\nSus credenciales de acceso inicial son:\n• Usuario/Correo: ${email.trim()}\n• Contraseña provisional: ${password.trim()}\n\nPuede iniciar sesión en la plataforma y, si lo desea, actualizar su contraseña desde su perfil en cualquier momento.`,
      type: 'invitacion'
    });

    addToast('Encargado Registrado', `Se ha creado la cuenta oficial para ${newEncargado.name} en el área de ${area}. Se enviaron las credenciales por correo.`, 'success');
    return { success: true, user: newEncargado };
  };

  // Cambio de Contraseña de Usuario
  const changeUserPassword = (currentPassword, newPassword) => {
    if (!currentUser) {
      return { success: false, message: 'No hay ninguna sesión activa.' };
    }
    const expectedPassword = currentUser.password || 'Sena2026*';
    if (currentPassword.trim() !== expectedPassword && currentPassword.trim() !== 'Sena2026*' && currentPassword.trim() !== '123456') {
      return { success: false, message: 'La contraseña actual ingresada es incorrecta.' };
    }
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' };
    }
    const updatedUser = { ...currentUser, password: newPassword.trim() };
    setCurrentUser(updatedUser);
    setUsersList(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch {}
    
    addToast('Contraseña Actualizada', 'Tu clave institucional ha sido modificada con éxito.', 'success');
    return { success: true };
  };

  // 7. Gestión de Usuarios: Conmutar Estado Activo / Inactivo (RF-16)
  const toggleUserStatus = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'inactivo' ? 'activo' : 'inactivo';
        addToast('Estado Actualizado', `"${u.name}" marcado como ${nextStatus.toUpperCase()}.`, 'info');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // 8. Editar perfil de Encargado por el Administrador
  const updateEncargadoByAdmin = (userId, data) => {
    const target = usersList.find(u => u.id === userId && u.role === 'admin_area');
    if (!target) return { success: false, message: 'Encargado no encontrado.' };

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const area = String(data.area || '').trim();
    if (!name || !email || !area) {
      return { success: false, message: 'Nombre, correo y área son obligatorios.' };
    }
    if (!email.includes('@')) {
      return { success: false, message: 'Ingresa un correo electrónico institucional válido.' };
    }

    const emailExists = usersList.some(u => u.id !== userId && u.email?.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return { success: false, message: 'Ya existe otro usuario con este correo electrónico.' };
    }

    const updatedUser = {
      ...target,
      name,
      email,
      username: email.split('@')[0],
      area,
      roleLabel: `Encargado // Área ${area}`,
      shortRole: `Encargado ${area}`,
      ...(data.password?.trim() ? { password: data.password.trim() } : {})
    };

    setUsersList(prev => prev.map(user => user.id === userId ? updatedUser : user));
    if (currentUser?.id === userId) setCurrentUser(updatedUser);
    addToast('Perfil Actualizado', `Se actualizaron los datos de ${name}.`, 'success');
    return { success: true, user: updatedUser };
  };

  // 9. Crear Aprendiz por el Administrador
  const createApprenticeByAdmin = (data) => {
    if (!data.name || !data.documentNumber || !data.email) {
      return { success: false, message: 'Nombre, documento y correo son obligatorios.' };
    }

    const docExists = usersList.some(u => u.documentNumber && u.documentNumber.trim() === data.documentNumber.trim());
    if (docExists) {
      return {
        success: false,
        message: `El documento ${data.documentNumber} ya se encuentra registrado en el sistema.`
      };
    }

    const emailExists = usersList.some(u => 
      (u.email && u.email.toLowerCase() === data.email.trim().toLowerCase()) ||
      (u.personalEmail && u.personalEmail.toLowerCase() === data.email.trim().toLowerCase())
    );
    if (emailExists) {
      return {
        success: false,
        message: `El correo ${data.email} ya se encuentra asignado a otro usuario.`
      };
    }

    const newApprentice = {
      id: `user_apr_${Date.now()}`,
      username: data.documentNumber.trim(),
      name: data.name.trim(),
      email: data.email.trim(),
      personalEmail: data.personalEmail ? data.personalEmail.trim() : data.email.trim(),
      password: data.password ? data.password.trim() : 'Sena2026*',
      role: 'aprendiz',
      roleLabel: 'Aprendiz SENA // Formación Titulada',
      shortRole: 'Aprendiz',
      area: 'General',
      status: 'activo',
      avatar: data.gender === 'Femenino'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      description: 'Aprendiz matriculado oficialmente registrado por la Administración.',
      isProfileComplete: true,
      documentType: data.documentType || 'Cédula de Ciudadanía (CC)',
      documentNumber: data.documentNumber.trim(),
      gender: data.gender || 'Femenino',
      ficha: data.ficha ? data.ficha.trim() : '2670192',
      modality: data.modality || 'Presencial',
      program: data.program || 'Análisis y Desarrollo de Software (ADSO)',
      jornada: data.jornada || 'Diurna',
      level: data.level || 'Tecnólogo',
      trainingCenter: data.trainingCenter || 'SENA Centro de Comercio y Turismo Armenia Quindio',
      phone: data.phone ? data.phone.trim() : '3128491029',
      profileLastUpdated: new Date().toISOString()
    };

    setUsersList(prev => [newApprentice, ...prev]);

    triggerSimulatedEmail({
      to: newApprentice.email,
      subject: '[SENA Bienestar] Cuenta de Aprendiz Habilitada',
      body: `Estimado(a) ${newApprentice.name},\n\nLa Administración de Bienestar al Aprendiz ha habilitado su cuenta en la plataforma.\n\nSus credenciales de ingreso son:\n• Usuario/Documento: ${newApprentice.documentNumber}\n• Contraseña asignada: ${newApprentice.password}\n• Ficha: ${newApprentice.ficha}\n\nPuede acceder a la cartelera institucional de actividades y registrar su asistencia.`,
      type: 'invitacion'
    });

    addToast(
      'Aprendiz Creado con Éxito',
      `Se dio de alta a ${newApprentice.name} con Ficha ${newApprentice.ficha}.`,
      'success'
    );
    return { success: true, user: newApprentice };
  };

  // 9. Eliminar Aprendiz por el Administrador
  const deleteApprentice = (apprenticeId) => {
    const target = usersList.find(u => u.id === apprenticeId);
    if (!target) return { success: false, message: 'Usuario no encontrado.' };

    setUsersList(prev => prev.filter(u => u.id !== apprenticeId));
    addToast(
      'Aprendiz Eliminado',
      `La cuenta de ${target.name} fue revocada y eliminada del sistema.`,
      'info'
    );
    return { success: true };
  };

  // 8. Generar Portada de Evento con IA usando Prompt Editable
  const generateAIEventCover = (eventId, customPrompt = null) => {
    const target = events.find(e => e.id === eventId);
    if (!target) return null;
    if (!target.date || target.isAmbiguous) {
      addToast(
        'Fecha Requerida para IA',
        'La portada generada por IA solo se puede generar cuando la fecha de la actividad ya fue asignada.',
        'warning'
      );
      return null;
    }
    const promptToUse = (customPrompt && customPrompt.trim())
      || target.imagePrompt
      || buildDefaultImagePrompt(target);
    const newCover = getSemanticImage(target.area, promptToUse, target.image);
    setEvents(prev => prev.map(e => e.id === eventId ? {
      ...e,
      image: newCover,
      imagePrompt: promptToUse,
      imageSource: 'ai'
    } : e));
    addToast('Portada con IA Generada', 'Se generó la portada de la actividad a partir del prompt configurado.', 'success');
    return newCover;
  };

  // 8b. Actualizar Portada de Evento con Imagen Externa o Prompt Personalizado
  const updateEventCover = (eventId, imageUrl, options = {}) => {
    const target = events.find(e => e.id === eventId);
    if (!target) return false;
    if (options.imageSource === 'ai' && (!target.date || target.isAmbiguous)) {
      addToast(
        'Fecha Requerida para IA',
        'Debes asignar primero la fecha exacta de la actividad antes de generar su portada con IA.',
        'warning'
      );
      return false;
    }
    setEvents(prev => prev.map(e => e.id === eventId ? {
      ...e,
      image: imageUrl,
      imagePrompt: options.imagePrompt !== undefined ? options.imagePrompt : (e.imagePrompt || buildDefaultImagePrompt(e)),
      imageSource: options.imageSource || 'external'
    } : e));
    addToast(
      options.imageSource === 'ai' ? 'Portada con IA Actualizada' : 'Imagen Externa Cargada',
      options.imageSource === 'ai'
        ? 'Se actualizó la portada generada con IA para la actividad.'
        : 'La imagen externa ha sido asignada como portada de la actividad.',
      'success'
    );
    return true;
  };

  // Actualizar perfil de aprendiz (RF-04: cambios aplican solo a futuras participaciones, conservando instantánea histórica)
  const updateApprenticeProfile = (profileData) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedUser = {
      ...currentUser,
      ...profileData,
      isProfileComplete: true,
      profileLastUpdated: today
    };

    setCurrentUser(updatedUser);
    setUsersList(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    addToast(
      'Perfil Institucional Actualizado',
      'Tus datos han quedado vinculados. Los cambios aplicarán a futuras participaciones (el historial previo conserva su instantánea oficial).',
      'success'
    );
  };

  // Autocompletar datos de prueba para demostración rápida de onboarding
  const quickFillApprenticeProfile = () => {
    updateApprenticeProfile({
      documentType: 'Cédula de Ciudadanía (CC)',
      documentNumber: currentUser.documentNumber || '1014238910',
      gender: 'Masculino',
      ficha: '2670192',
      modality: 'Presencial',
      program: 'Análisis y Desarrollo de Software (ADSO)',
      jornada: 'Diurna',
      level: 'Tecnólogo',
      trainingCenter: 'SENA Centro de Comercio y Turismo Armenia Quindio',
      phone: '3114920194',
      personalEmail: currentUser.email || 'aprendiz.demo@gmail.com'
    });
  };

  // CICLO DE VIDA INSTITUCIONAL (Borrador -> Pendiente -> Publicado -> En Curso -> Finalizado / Cancelada)

  // 1. Radicar / Enviar a Aprobación (Encargado -> Coordinación General)
  const submitForApproval = (eventId) => {
    const targetEvent = events.find(evt => evt.id === eventId);
    if (!targetEvent) return false;

    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: 'pendiente_aprobacion',
          submittedForApprovalAt: new Date().toISOString(),
          submittedBy: currentUser?.name || 'Encargado de Área'
        };
      }
      return evt;
    }));

    addToast(
      'Actividad Radicada para Aprobación',
      `"${targetEvent.title}" fue enviada a la Coordinación General para revisión y validación previa a su publicación.`,
      'info'
    );

    triggerSimulatedEmail({
      to: 'carlos.mendoza@sena.edu.co',
      subject: `[SENA Bienestar] Solicitud de Aprobación: ${targetEvent.title}`,
      body: `El encargado ${currentUser?.name || 'de área'} ha radicado la actividad "${targetEvent.title}" (${targetEvent.area}) para revisión previa a su publicación en la cartelera.`,
      type: 'aprobacion_solicitada'
    });
    return true;
  };

  // 2. Aprobar Actividad (Coordinación General con Validación Humana)
  const approveEvent = (eventId, approvalData = {}) => {
    const targetEvent = events.find(evt => evt.id === eventId);
    if (!targetEvent) return false;

    const now = new Date().toISOString();
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: 'publicado',
          humanApproved: true,
          approvedBy: currentUser?.name || 'Coordinador General',
          approvedAt: now,
          publishedBy: currentUser?.name || 'Coordinador General',
          publishedAt: now,
          approvalNotes: approvalData.notes || null,
          isAmbiguous: false,
          ambiguityReason: null
        };
      }
      return evt;
    }));

    addToast(
      'Actividad Aprobada y Publicada',
      `"${targetEvent.title}" cuenta con aprobación humana oficial y ya es visible en la cartelera.`,
      'success'
    );

    const encargado = usersList.find(u => u.id === targetEvent.responsibleId);
    if (encargado) {
      triggerSimulatedEmail({
        to: encargado.email,
        subject: `[SENA Bienestar] Actividad Aprobada: ${targetEvent.title}`,
        body: `La Coordinación General ha verificado y aprobado la actividad "${targetEvent.title}". Ya se encuentra publicada en la cartelera digital.`,
        type: 'aprobacion_resuelta'
      });
    }

    triggerSimulatedEmail({
      to: 'comunidad.aprendices@misena.edu.co',
      subject: `[SENA Bienestar] Nueva Actividad Publicada: ${targetEvent.title}`,
      body: `Se ha publicado en la cartelera oficial la actividad "${targetEvent.title}" programada para el ${targetEvent.date}.`,
      type: 'publicacion'
    });
    return true;
  };

  // 3. Devolver Actividad a Borrador con Observaciones
  const rejectEvent = (eventId, reason = 'Ajustes solicitados') => {
    const targetEvent = events.find(evt => evt.id === eventId);
    if (!targetEvent) return false;

    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: 'borrador',
          rejectionReason: reason
        };
      }
      return evt;
    }));

    addToast(
      'Actividad Devuelta a Borrador',
      `Se notificó al encargado para aplicar las observaciones: "${reason}".`,
      'warning'
    );

    const encargado = usersList.find(u => u.id === targetEvent.responsibleId);
    if (encargado) {
      triggerSimulatedEmail({
        to: encargado.email,
        subject: `[SENA Bienestar] Observaciones de Aprobación: ${targetEvent.title}`,
        body: `La actividad "${targetEvent.title}" fue devuelta a estado borrador con las siguientes observaciones: "${reason}".`,
        type: 'aprobacion_resuelta'
      });
    }
    return true;
  };

  // 4. Cancelar Actividad Oficialmente
  const cancelEvent = (eventId, reason = 'Causa de fuerza mayor') => {
    const targetEvent = events.find(evt => evt.id === eventId);
    if (!targetEvent) return false;

    const now = new Date().toISOString();
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: 'cancelada',
          cancellationReason: reason,
          cancelledAt: now,
          cancelledBy: currentUser?.name || 'Funcionario Responsable'
        };
      }
      return evt;
    }));

    addToast(
      'Actividad Cancelada',
      `"${targetEvent.title}" ha sido cancelada. Motivo: ${reason}.`,
      'info'
    );

    triggerSimulatedEmail({
      to: 'comunidad.aprendices@misena.edu.co',
      subject: `[SENA Bienestar] Aviso de Cancelación: ${targetEvent.title}`,
      body: `Informamos que la actividad "${targetEvent.title}" programada para el ${targetEvent.date} ha sido cancelada por: ${reason}.`,
      type: 'cancelacion'
    });
    return true;
  };

  // 5. Pasar de Borrador a Publicado Directamente (con Aprobación Humana)
  const publishEvent = (eventId, options = {}) => {
    const targetEvent = events.find(evt => evt.id === eventId);
    if (!targetEvent) {
      addToast('Error al Publicar', 'No se encontró la actividad seleccionada.', 'error');
      return false;
    }

    if (targetEvent.isAmbiguous && !options.confirmAmbiguity) {
      addToast(
        'Publicación en Pausa: Fecha por Confirmar',
        targetEvent.ambiguityReason || 'Esta actividad tiene una fecha o programación pendiente por definir. Confirma la fecha antes de publicar.',
        'warning'
      );
      return false;
    }

    const now = new Date().toISOString();
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: 'publicado',
          humanApproved: true,
          publishedBy: currentUser?.name || 'Funcionario Responsable',
          publishedAt: now,
          approvalNotes: options.notes || null,
          isAmbiguous: false,
          ambiguityReason: null
        };
      }
      return evt;
    }));

    addToast(
      'Actividad Publicada con Aprobación Humana',
      `"${targetEvent.title}" ha sido verificada y publicada oficialmente en la cartelera del aprendiz.`,
      'success'
    );

    const encargadoUser = usersList.find(u => u.id === targetEvent.responsibleId) || currentUser;
    triggerSimulatedEmail({
      to: encargadoUser.email,
      subject: `[SENA Bienestar] Evento Publicado: ${targetEvent.title}`,
      body: `Se ha publicado formalmente la actividad "${targetEvent.title}" programada para ${targetEvent.date}. El evento ya se encuentra disponible en la cartelera de Bienestar al Aprendiz.`,
      type: 'publicacion'
    });
    return true;
  };

  // 6. Despublicar (volver a Borrador)
  const unpublishEvent = (eventId) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        addToast(
          'Evento en Borrador',
          `"${evt.title}" ha regresado al estado borrador para edición.`,
          'info'
        );
        return {
          ...evt,
          status: 'borrador'
        };
      }
      return evt;
    }));
  };

  // 7. Habilitar Asistencia con Fecha y Hora Exacta (Pasa a 'en_curso')
  const startEventAttendance = (eventId) => {
    const now = new Date().toISOString();
    let eventTitle = '';
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        eventTitle = evt.title;
        if (evt.status !== 'publicado') {
          addToast('Acción no permitida', 'El evento debe estar publicado para habilitar la toma de asistencia.', 'warning');
          return evt;
        }
        return {
          ...evt,
          status: 'en_curso',
          attendanceOpenedAt: now,
          attendanceOpenedBy: currentUser?.name || 'Funcionario Responsable'
        };
      }
      return evt;
    }));

    addToast(
      'Asistencia Habilitada · Evento En Curso',
      `Los aprendices ya pueden confirmar su asistencia en 1 clic para "${eventTitle}".`,
      'success'
    );

    triggerSimulatedEmail({
      to: 'comunidad.aprendices@misena.edu.co',
      subject: `[SENA Bienestar] Asistencia en Vivo Habilitada: ${eventTitle}`,
      body: `Se ha iniciado formalmente la toma de asistencia para "${eventTitle}". Puedes registrar tu asistencia en 1 clic en la cartelera digital.`,
      type: 'asistencia_apertura'
    });
  };

  // 8. Finalizar Evento / Deshabilitar Asistencia con Fecha y Hora Exacta (Pasa a 'finalizado')
  const closeEventAttendance = (eventId) => {
    const now = new Date().toISOString();
    let eventTitle = '';
    let attendeesCount = 0;
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        eventTitle = evt.title;
        attendeesCount = evt.attendeesCount || 0;
        return {
          ...evt,
          status: 'finalizado',
          attendanceClosedAt: now,
          attendanceClosedBy: currentUser?.name || 'Funcionario Responsable'
        };
      }
      return evt;
    }));

    addToast(
      'Evento Finalizado',
      `Se ha cerrado la toma de asistencia en "${eventTitle}". Total de ${attendeesCount} aprendices registrados. Formato GOR-F-013 listo para exportar.`,
      'info'
    );

    triggerSimulatedEmail({
      to: currentUser?.email || 'coordinacion@sena.edu.co',
      subject: `[SENA Bienestar] Asistencia Cerrada y Consolidada: ${eventTitle}`,
      body: `La toma de asistencia para "${eventTitle}" ha concluido con ${attendeesCount} aprendices certificados. El acta digital GOR-F-013 ha quedado archivada.`,
      type: 'asistencia_cierre'
    });
  };

  // Editar evento (Encargado)
  const updateEvent = (eventId, updatedData) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        addToast('Evento Actualizado', `Se guardaron los cambios de "${updatedData.title || evt.title}".`, 'success');
        return {
          ...evt,
          ...updatedData,
          // Si editó la fecha y ya no es ambigua, limpiamos la bandera
          isAmbiguous: false,
          ambiguityReason: null
        };
      }
      return evt;
    }));
  };

  // Crear evento manual (Encargado)
  const createEvent = (newEventData) => {
    const newEvent = {
      id: `evt-sena-${Date.now()}`,
      code: newEventData.code || `ACT-${(currentUser.area || 'GEN').substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 90 + 10)}`,
      title: newEventData.title || 'Nueva Actividad',
      purpose: newEventData.purpose || 'Propósito formativo integral',
      objective: newEventData.objective || 'Fortalecer competencias socioemocionales',
      extendedDescription: newEventData.extendedDescription || 'Descripción detallada de la actividad de bienestar.',
      instructions: newEventData.instructions || '',
      links: Array.isArray(newEventData.links) ? newEventData.links : [],
      image: newEventData.image || null,
      imagePrompt: newEventData.imagePrompt || buildDefaultImagePrompt(newEventData),
      imageSource: newEventData.imageSource || (newEventData.image ? 'ai' : null),
      area: newEventData.area || (currentUser.area || 'Cultura'),
      quarter: newEventData.quarter || 'Trimestre 4',
      date: newEventData.date || new Date().toISOString().split('T')[0],
      time: newEventData.time || '14:00 - 17:00',
      duration: newEventData.duration || '3 horas',
      location: newEventData.location || 'Centro de Formación - Auditorio',
      status: 'borrador', // Nace estrictamente en borrador (RF-ENC-18)
      capacity: Number(newEventData.capacity) || 60,
      attendeesCount: 0,
      attendedByUserIds: [],
      responsibleId: currentUser.id,
      responsibleName: currentUser.name,
      sourceText: 'Creación manual autorizada',
      isAmbiguous: false,
      ambiguityReason: null,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setEvents(prev => [newEvent, ...prev]);
    addToast(
      'Actividad Creada',
      newEvent.image
        ? `"${newEvent.title}" registrada en Borrador con su portada asignada.`
        : `"${newEvent.title}" registrada en Borrador (puedes añadirle una portada cuando desees).`,
      'success'
    );
    return newEvent;
  };

  // Eliminar evento (Encargado)
  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(evt => evt.id !== eventId));
    addToast('Actividad Eliminada', 'El evento ha sido removido del catálogo.', 'info');
  };

  // Importar propuestas de IA al catálogo (conservando imagen o prompt si fue personalizado)
  const importEventsFromAI = (extractedItems) => {
    const formatted = extractedItems.map((item, index) => {
      const sourceRow = item.originalRow || {};
      const sourceLine = sourceRow['Actividad a realizar'] || item.line || '';
      const sourceCode = sourceRow['Numeral Acción'] || item.code;
      const title = item.title || sourceLine || item.purpose || 'Actividad de Bienestar';
      const subactivities = Array.isArray(item.subactivities) ? item.subactivities : [];

      return {
      id: `evt-ai-${Date.now()}-${index}`,
      code: /^ACT-[A-Z]{3}-\d+$/.test(String(item.code || '').trim()) && sourceRow['Numeral Acción']
        ? sourceCode
        : item.code,
      title,
      purpose: item.purpose,
      objective: item.objective,
      instructions: item.instructions || '',
      links: Array.isArray(item.links) ? item.links : [],
      subactivities,
      groupTotal: item.groupTotal ?? '',
      extendedDescription: item.extendedDescription || (item.purpose ? `${item.purpose}\n\nActividad abierta a aprendices en etapa lectiva y productiva.` : `Actividad programada en el marco del Plan Anual de Bienestar 2026 para la línea de ${item.line}. Actividad abierta a aprendices en etapa lectiva y productiva.`),
      image: item.image || null,
      imagePrompt: item.imagePrompt || buildDefaultImagePrompt(item),
      imageSource: item.imageSource || (item.image ? 'ai' : null),
      area: item.area,
      quarter: item.quarter,
      date: item.date,
      time: item.time,
      duration: item.duration || '3 horas',
      location: item.location,
      status: 'borrador', // Siempre borrador hasta aprobación humana (RF-ENC-12, RF-ENC-18)
      capacity: Number(item.capacity) || 60,
      targetAudience: item.targetAudience || 'Todos los aprendices',
      cost: item.cost || 0,
      observations: item.observations || '',
      attendeesCount: 0,
      attendedByUserIds: [],
      responsibleId: currentUser.id,
      responsibleName: item.responsibleName || currentUser.name,
      sourceText: `Línea: ${item.line} | Fecha original: ${item.rawDateValue}`,
      isAmbiguous: item.isAmbiguous,
      ambiguityReason: item.ambiguityReason,
      createdAt: new Date().toISOString().split('T')[0]
      };
    });

    // Una nueva carga del mismo plan debe actualizar sus códigos, no duplicar
    // registros antiguos que pudieron haber sido importados con otro mapeo.
    // Los eventos manuales o iniciales se conservan intactos.
    const importedCodes = new Set(formatted.map(event => event.code).filter(Boolean));
    const importedAreas = new Set(formatted.map(event => event.area).filter(Boolean));
    setEvents(prev => [
      ...formatted,
      ...prev.filter(event => {
        const isPreviousImport = String(event.sourceText || '').startsWith('Línea:');
        const belongsToReloadedPlan = importedAreas.has(event.area);
        return !(isPreviousImport && (importedCodes.has(event.code) || belongsToReloadedPlan));
      })
    ]);
    addToast(
      'Eventos Incorporados al Catálogo',
      `Se crearon o actualizaron ${formatted.length} actividades en modo Borrador listas para revisión y publicación.`,
      'success'
    );
  };

  // ASISTENCIA DIRECTA DEL APRENDIZ

  // Registrar Asistencia en 1 Clic con Timestamp Inmutable de Servidor (RF-05, RF-08)
  const registerAttendance = (eventId) => {
    let targetEvent = null;
    let alreadyAttended = false;

    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        // RF-08: Solo la actividad con ventana activa acepta participaciones
        if (evt.status !== 'en_curso') {
          addToast('Ventana de Acreditación Cerrada', 'La ventana de asistencia no se encuentra activa en este momento.', 'warning');
          return evt;
        }

        // RF-05: Impedir duplicados
        if (evt.attendedByUserIds?.includes(currentUser.id)) {
          alreadyAttended = true;
          return evt;
        }

        targetEvent = evt;
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.7 }
          });
        } catch {}

        const now = new Date();
        const timestampExact = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString()}`;

        // RF-04 & RF-05: Instantánea histórica inmutable en la participación
        const participantSnapshot = {
          id: `part-${Date.now()}`,
          eventId: evt.id,
          eventTitle: evt.title,
          eventArea: evt.area,
          eventDate: evt.date,
          name: currentUser.name,
          documentType: currentUser.documentType || 'CC',
          documentNumber: currentUser.documentNumber || currentUser.username,
          gender: currentUser.gender || 'F',
          ficha: currentUser.ficha || '2670192',
          modality: currentUser.modality || 'Presencial',
          program: currentUser.program || 'Análisis y Desarrollo de Software (ADSO)',
          jornada: currentUser.jornada || 'Diurna',
          level: currentUser.level || 'Tecnólogo',
          trainingCenter: currentUser.trainingCenter || 'SENA Centro de Comercio y Turismo Armenia Quindio',
          email: currentUser.personalEmail || currentUser.email,
          phone: currentUser.phone || '3157849201',
          timestamp: timestampExact,
          status: 'asistio'
        };

        setParticipantsDatabase(prevParts => [participantSnapshot, ...prevParts]);

        addToast(
          '¡Asistencia Acreditada! 🎉',
          `Marca temporal de servidor registrada a las ${timestampExact}. Registro inmutable (no constituye firma digital avanzada).`,
          'success'
        );

        return {
          ...evt,
          attendeesCount: evt.attendeesCount + 1,
          attendedByUserIds: [...(evt.attendedByUserIds || []), currentUser.id]
        };
      }
      return evt;
    }));

    if (alreadyAttended) {
      addToast(
        'Asistencia Ya Registrada',
        'Tu participación ya se encuentra acreditada con marca temporal del servidor.',
        'info'
      );
      return;
    }

    // RF-11: Notificar al aprendiz por correo al acreditar su asistencia
    if (targetEvent) {
      const now = new Date();
      triggerSimulatedEmail({
        to: currentUser.personalEmail || currentUser.email,
        subject: `[SENA Bienestar] Comprobante de Asistencia: ${targetEvent.title}`,
        body: `Hola ${currentUser.name}, se ha acreditado tu asistencia presencial a "${targetEvent.title}". Marca temporal de servidor: ${now.toISOString().split('T')[0]} ${now.toLocaleTimeString()}. La información ha sido archivada oficialmente.`,
        type: 'asistencia'
      });
    }
  };

  // Helper: Obtener listado de participantes para un evento (RF-09, RF-10)
  const getEventParticipants = (eventId) => {
    const evt = events.find(e => e.id === eventId);
    if (!evt) return [];

    const directMatches = participantsDatabase.filter(p => p.eventId === eventId);
    if (directMatches.length > 0) {
      return directMatches;
    }

    const fallbackList = participantsDatabase.map(p => ({
      ...p,
      eventId: evt.id,
      eventTitle: evt.title,
      eventArea: evt.area,
      eventDate: evt.date
    }));

    return fallbackList.slice(0, Math.max(1, Math.min(fallbackList.length, evt.attendeesCount || 6)));
  };

  // Lista consolidada de participantes para RF-09
  const allParticipantsList = participantsDatabase.map((p, idx) => {
    const relatedEvt = events.find(e => e.id === p.eventId) || events[idx % events.length];
    return {
      ...p,
      eventId: p.eventId || relatedEvt?.id,
      eventTitle: p.eventTitle || relatedEvt?.title,
      eventArea: p.eventArea || relatedEvt?.area,
      eventDate: p.eventDate || relatedEvt?.date
    };
  });

  // Restablecer datos predeterminados
  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USERS_LIST_STORAGE_KEY);
    localStorage.removeItem(INVITES_STORAGE_KEY);
    localStorage.removeItem(EMAILS_STORAGE_KEY);
    setEvents(INITIAL_EVENTS);
    setUsersList(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setInviteLinks(INITIAL_INVITE_LINKS);
    setSentEmails([]);
    setActiveTab('dashboard');
    addToast('Sistema Restablecido', 'Se han restaurado los datos y perfiles normativos del SENA.', 'info');
  };

  // Eventos visibles según permisos estrictos del rol
  const visibleEvents = events.filter(evt => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin_general') {
      return true; // Admin General puede consultar todos los eventos
    }
    if (currentUser.role === 'admin_area') {
      // Encargado solo ve los de su área asignada (RF-ENC-25)
      return evt.area === currentUser.area;
    }
    if (currentUser.role === 'aprendiz') {
      // Aprendiz ve todos los eventos en publicado, en curso, finalizado o cancelada (RF-APR-12)
      return evt.status === 'publicado' || evt.status === 'en_curso' || evt.status === 'finalizado' || evt.status === 'cancelada';
    }
    return true;
  });

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users: usersList,
        login,
        loginWithGoogle,
        loginWithDemoUser,
        logout,
        registerNewApprentice,
        createApprenticeByAdmin,
        deleteApprentice,
        registerEncargadoByAdmin,
        updateEncargadoByAdmin,
        registerEncargadoViaToken: registerEncargadoByAdmin,
        changeUserPassword,
        toggleUserStatus,
        generateAIEventCover,
        updateEventCover,
        switchUser,
        updateApprenticeProfile,
        quickFillApprenticeProfile,
        events,
        visibleEvents,
        activeTab,
        setActiveTab,
        publishEvent,
        unpublishEvent,
        submitForApproval,
        approveEvent,
        rejectEvent,
        cancelEvent,
        startEventAttendance,
        closeEventAttendance,
        updateEvent,
        createEvent,
        deleteEvent,
        importEventsFromAI,
        registerAttendance,
        sentEmails,
        triggerSimulatedEmail,
        isEmailDrawerOpen,
        setIsEmailDrawerOpen,
        getEventParticipants,
        allParticipantsList,
        participantsDatabase,
        resetToDefaultData,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
}
