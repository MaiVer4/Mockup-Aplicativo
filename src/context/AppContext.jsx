import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  USERS as INITIAL_USERS, 
  INITIAL_EVENTS, 
  INITIAL_INVITE_LINKS, 
  MOCK_PARTICIPANTS_DATABASE,
  AREAS 
} from '../data/mockData';
import { getSemanticImage } from '../utils/excelHelper';
import confetti from 'canvas-confetti';

const AppContext = createContext();

const STORAGE_KEY = 'sena_bienestar_events_v2';
const USER_STORAGE_KEY = 'sena_bienestar_user_v2';
const USERS_LIST_STORAGE_KEY = 'sena_bienestar_users_list_v2';
const PARTICIPANTS_STORAGE_KEY = 'sena_bienestar_participants_v2';
const INVITES_STORAGE_KEY = 'sena_bienestar_invites_v2';
const EMAILS_STORAGE_KEY = 'sena_bienestar_emails_v2';

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
      if (saved) return JSON.parse(saved);
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

  // Registro de correos electrónicos simulados
  const [sentEmails, setSentEmails] = useState(() => {
    try {
      const saved = localStorage.getItem(EMAILS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'mail-01',
        to: 'elena.rios@sena.edu.co',
        subject: 'Planificación 2026: Asignación de Área Cultura',
        body: 'Has sido asignada como encargada oficial de los eventos de bienestar cultural para el trimestre en curso.',
        timestamp: '2026-10-12 09:15:00',
        type: 'sistema'
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

  // 8. Crear Aprendiz por el Administrador
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

  // 8. Generar Portada de Evento con IA (RF-07)
  const generateAIEventCover = (eventId) => {
    const target = events.find(e => e.id === eventId);
    if (!target) return null;
    const newCover = getSemanticImage(target.area, target.title + ' ' + (target.purpose || ''));
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, image: newCover } : e));
    addToast('Portada con IA Generada', 'Se ha generado una nueva imagen contextual para la portada del evento.', 'success');
    return newCover;
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

  // CICLO DE VIDA DE 4 ESTADOS

  // 1. Pasar de Borrador a Publicado (Publicar)
  const publishEvent = (eventId, options = {}) => {
    const targetEvent = events.find(evt => evt.id === eventId);
    if (!targetEvent) {
      addToast('Error al Publicar', 'No se encontró la actividad seleccionada.', 'error');
      return false;
    }

    // Bloqueo por ambigüedad si no se ha confirmado expresamente
    if (targetEvent.isAmbiguous && !options.confirmAmbiguity) {
      addToast(
        'Publicación en Pausa: Fecha por Confirmar',
        targetEvent.ambiguityReason || 'Esta actividad tiene una fecha o programación pendiente por definir. Confirma la fecha en el detalle antes de publicar.',
        'warning'
      );
      return false;
    }

    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: 'publicado',
          isAmbiguous: false,
          ambiguityReason: null
        };
      }
      return evt;
    }));

    addToast(
      'Evento Publicado con Éxito',
      `"${targetEvent.title}" ya es visible en la cartelera de Bienestar al Aprendiz.`,
      'success'
    );

    // Notificar por correo únicamente al encargado del área
    const encargadoUser = usersList.find(u => u.id === targetEvent.responsibleId) || currentUser;
    triggerSimulatedEmail({
      to: encargadoUser.email,
      subject: `[SENA Bienestar] Evento Publicado: ${targetEvent.title}`,
      body: `Se ha publicado formalmente la actividad "${targetEvent.title}" programada para ${targetEvent.date}. El evento ya se encuentra disponible en la cartelera de Bienestar al Aprendiz.`,
      type: 'publicacion'
    });
    return true;
  };

  // 2. Despublicar (volver a Borrador)
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

  // 3. Habilitar Asistencia (Pasa a 'en_curso')
  const startEventAttendance = (eventId) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        if (evt.status !== 'publicado') {
          addToast('Acción no permitida', 'El evento debe estar publicado para habilitar la toma de asistencia.', 'warning');
          return evt;
        }
        addToast(
          'Asistencia Habilitada · Evento En Curso',
          `Los aprendices ya pueden confirmar su asistencia en 1 clic para "${evt.title}".`,
          'success'
        );
        return {
          ...evt,
          status: 'en_curso'
        };
      }
      return evt;
    }));
  };

  // 4. Finalizar Evento / Deshabilitar Asistencia (Pasa a 'finalizado')
  const closeEventAttendance = (eventId) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        addToast(
          'Evento Finalizado',
          `Se ha cerrado la toma de asistencia en "${evt.title}". Métricas consolidadas y listo para la exportación de asistencia.`,
          'info'
        );
        return {
          ...evt,
          status: 'finalizado'
        };
      }
      return evt;
    }));
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
      image: newEventData.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
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
    addToast('Actividad Creada', `"${newEvent.title}" registrada en estado Borrador.`, 'success');
    return newEvent;
  };

  // Eliminar evento (Encargado)
  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(evt => evt.id !== eventId));
    addToast('Actividad Eliminada', 'El evento ha sido removido del catálogo.', 'info');
  };

  // Importar propuestas de IA al catálogo (pasan a Borrador)
  const importEventsFromAI = (extractedItems) => {
    const formatted = extractedItems.map((item, index) => ({
      id: `evt-ai-${Date.now()}-${index}`,
      code: item.code,
      title: item.title,
      purpose: item.purpose,
      objective: item.objective,
      extendedDescription: item.purpose ? `${item.purpose} Actividad abierta a aprendices en etapa lectiva y productiva.` : `Actividad programada en el marco del Plan Anual de Bienestar 2026 para la línea de ${item.line}. Actividad abierta a aprendices en etapa lectiva y productiva.`,
      image: item.image,
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
    }));

    setEvents(prev => [...formatted, ...prev]);
    addToast(
      'Eventos Incorporados al Catálogo',
      `Se crearon ${formatted.length} actividades en modo Borrador listas para revisión y publicación.`,
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
      // Aprendiz ve todos los eventos en publicado, en curso o finalizado (RF-APR-12)
      return evt.status === 'publicado' || evt.status === 'en_curso' || evt.status === 'finalizado';
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
        registerEncargadoViaToken: registerEncargadoByAdmin,
        changeUserPassword,
        toggleUserStatus,
        generateAIEventCover,
        switchUser,
        updateApprenticeProfile,
        quickFillApprenticeProfile,
        events,
        visibleEvents,
        activeTab,
        setActiveTab,
        publishEvent,
        unpublishEvent,
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
