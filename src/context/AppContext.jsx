import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  USERS as INITIAL_USERS, 
  INITIAL_EVENTS, 
  INITIAL_INVITE_LINKS, 
  MOCK_PARTICIPANTS_DATABASE,
  AREAS 
} from '../data/mockData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

const STORAGE_KEY = 'sena_bienestar_events_v2';
const USER_STORAGE_KEY = 'sena_bienestar_user_v2';
const USERS_LIST_STORAGE_KEY = 'sena_bienestar_users_list_v2';
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

  // Enlaces de invitación exclusivos para encargados (RF-ADM-03)
  const [inviteLinks, setInviteLinks] = useState(() => {
    try {
      const saved = localStorage.getItem(INVITES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_INVITE_LINKS;
  });

  // Registro de correos electrónicos simulados (RF-NOT-01 a RF-NOT-04)
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
      localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(inviteLinks));
    } catch {}
  }, [inviteLinks]);

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
    const docExists = usersList.some(u => u.documentNumber && u.documentNumber === data.documentNumber.trim());
    if (docExists) {
      return {
        success: false,
        message: `El número de documento ${data.documentNumber} ya se encuentra registrado.`
      };
    }

    // Validar unicidad de correo
    const emailExists = usersList.some(u => 
      (u.email && u.email.toLowerCase() === data.personalEmail.trim().toLowerCase()) ||
      (u.personalEmail && u.personalEmail.toLowerCase() === data.personalEmail.trim().toLowerCase())
    );
    if (emailExists) {
      return {
        success: false,
        message: 'Correo existente. Este correo ya se encuentra registrado con este método.'
      };
    }

    const newUser = {
      id: `user_apr_${Date.now()}`,
      username: data.documentNumber.trim(),
      name: data.name.trim(),
      email: data.email || data.personalEmail.trim(),
      personalEmail: data.personalEmail.trim(),
      role: 'aprendiz',
      roleLabel: 'Aprendiz SENA // Recién Registrado',
      shortRole: 'Aprendiz Nuevo',
      area: 'General',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      description: 'Aprendiz registrado en plataforma. Requiere onboarding para habilitar la cartelera institucional.',
      isProfileComplete: false,
      documentType: data.documentType,
      documentNumber: data.documentNumber.trim(),
      gender: '',
      ficha: '',
      modality: '',
      program: '',
      jornada: '',
      level: '',
      trainingCenter: '',
      phone: '',
      profileLastUpdated: null
    };

    setUsersList(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveTab('apprentice');

    addToast(
      'Cuenta Creada Exitosamente',
      `Bienvenido(a) ${newUser.name}. Completa los datos obligatorios para habilitar tu cartelera.`,
      'success'
    );
    return { success: true, user: newUser };
  };

  // 6. Registro de Encargado vía Token Exclusivo
  const registerEncargadoViaToken = (token, data) => {
    const validLink = inviteLinks.find(l => 
      l.code.trim().toUpperCase() === token.trim().toUpperCase() && 
      l.status === 'active'
    );

    if (!validLink) {
      return {
        success: false,
        message: 'El enlace o token ingresado no es válido o fue revocado por el Administrador General.'
      };
    }

    // Incrementar contador de usos del enlace
    setInviteLinks(prev => prev.map(l => l.id === validLink.id ? { ...l, usesCount: (l.usesCount || 0) + 1 } : l));

    const newEncargado = {
      id: `user_enc_${Date.now()}`,
      username: data.email.split('@')[0],
      name: data.name.trim(),
      email: data.email.trim(),
      role: 'admin_area',
      roleLabel: `Encargado // Área ${data.area || validLink.area}`,
      shortRole: `Encargado ${data.area || validLink.area}`,
      area: data.area || validLink.area,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      description: `Administrador de área registrado vía token exclusivo ${validLink.code}. Control operativo de ${data.area || validLink.area}.`
    };

    setUsersList(prev => [...prev, newEncargado]);
    setCurrentUser(newEncargado);
    setActiveTab('events');

    addToast(
      'Token Validado con Éxito',
      `Cuenta activada para el área de ${newEncargado.area}. Ya puedes gestionar tus eventos y cargar el plan anual.`,
      'success'
    );
    return { success: true, user: newEncargado };
  };

  // Actualizar perfil de aprendiz (RF-APR-02, RF-APR-03, RF-APR-08)
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
      'Tus datos han quedado vinculados correctamente y tu perfil institucional está activo.',
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
      trainingCenter: 'Centro de Servicios Financieros - Regional Distrito Capital',
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
      extendedDescription: `Actividad programada en el marco del Plan Anual de Bienestar 2026 para la línea de ${item.line}. Actividad abierta a aprendices en etapa lectiva y productiva.`,
      image: item.image,
      area: item.area,
      quarter: item.quarter,
      date: item.date,
      time: item.time,
      duration: item.duration,
      location: item.location,
      status: 'borrador', // Siempre borrador hasta aprobación humana (RF-ENC-12, RF-ENC-18)
      capacity: Number(item.capacity) || 60,
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

  // Registrar Asistencia en 1 Clic con Timestamp Inmutable (RF-APR-18 a RF-APR-21, RF-NOT-02)
  const registerAttendance = (eventId) => {
    let targetEvent = null;
    let alreadyAttended = false;

    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        if (evt.status !== 'en_curso') {
          addToast('Asistencia Inactiva', 'El encargado aún no ha habilitado la toma de asistencia para este evento.', 'warning');
          return evt;
        }

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

        addToast(
          '¡Asistencia Registrada Exitosamente! 🎉',
          `Firma digital registrada a las ${timestampExact}. Registro inmutable en el sistema.`,
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
        'Tu asistencia ya se encuentra acreditada con marca temporal inmutable. No es necesario repetir el registro.',
        'info'
      );
      return;
    }

    // RF-NOT-02: Notificar al aprendiz por correo al asistir
    if (targetEvent) {
      const now = new Date();
      triggerSimulatedEmail({
        to: currentUser.personalEmail || currentUser.email,
        subject: `[SENA Bienestar] Comprobante de Asistencia: ${targetEvent.title}`,
        body: `Hola ${currentUser.name}, se ha certificado tu asistencia presencial a "${targetEvent.title}". Marca temporal digital: ${now.toISOString().split('T')[0]} ${now.toLocaleTimeString()}. Este registro será incluido en el formato oficial GOR-F-013.`,
        type: 'asistencia'
      });
    }
  };

  // ENLACES EXCLUSIVOS DE REGISTRO PARA ENCARGADOS (RF-ADM-03, RF-ENC-01)
  const generateInviteLink = (area = 'Cultura') => {
    const token = `SENA-ENC-${area.substring(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newLink = {
      id: `inv-link-${Date.now()}`,
      code: token,
      area,
      url: `https://bienestar.sena.edu.co/registro-encargado?token=${token}`,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString().split('T')[0],
      usesCount: 0,
      status: 'active'
    };

    setInviteLinks(prev => [newLink, ...prev]);
    addToast('Enlace Exclusivo Generado', `Enlace de invitación creado para el área de ${area}.`, 'success');
    return newLink;
  };

  const revokeInviteLink = (linkId) => {
    setInviteLinks(prev => prev.map(l => l.id === linkId ? { ...l, status: 'revoked' } : l));
    addToast('Enlace Revocado', 'El enlace ha sido desactivado y no permitirá nuevos registros.', 'info');
  };

  // Helper: Obtener listado de participantes para un evento (para consulta y exportación GOR-F-013)
  const getEventParticipants = (eventId) => {
    const evt = events.find(e => e.id === eventId);
    if (!evt) return [];

    // Tomamos los participantes de prueba base
    let participants = [...MOCK_PARTICIPANTS_DATABASE];

    // Si Sofía Castillo (o el usuario actual) asistió, asegurarse de que esté en la lista
    if (evt.attendedByUserIds?.includes('user_aprendiz_sofia')) {
      const exists = participants.some(p => p.documentNumber === '1020495821');
      if (!exists) {
        participants.unshift({
          id: 'part-sofia',
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
          timestamp: `${evt.date} 14:05:12`,
          status: 'asistio'
        });
      }
    }

    // Ajustar número según el conteo de asistentes del evento
    return participants.slice(0, Math.max(1, Math.min(participants.length, evt.attendeesCount || 8)));
  };

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
        registerEncargadoViaToken,
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
        inviteLinks,
        generateInviteLink,
        revokeInviteLink,
        sentEmails,
        triggerSimulatedEmail,
        isEmailDrawerOpen,
        setIsEmailDrawerOpen,
        getEventParticipants,
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
