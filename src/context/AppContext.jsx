import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS, INITIAL_EVENTS } from '../data/mockData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

const STORAGE_KEY = 'eventflow_mockup_events_v1';
const USER_STORAGE_KEY = 'eventflow_mockup_user_v1';

export function AppProvider({ children }) {
  // Estado de usuario actual
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUserId = localStorage.getItem(USER_STORAGE_KEY);
      const found = USERS.find(u => u.id === savedUserId);
      return found || USERS[0]; // Admin General por defecto
    } catch {
      return USERS[0];
    }
  });

  // Estado de eventos con persistencia en localStorage
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error al cargar eventos de localStorage', e);
    }
    return INITIAL_EVENTS;
  });

  // Pestaña / Vista activa
  const [activeTab, setActiveTab] = useState(() => {
    return currentUser.role === 'aprendiz' ? 'apprentice' : 'dashboard';
  });

  // Notificaciones Toast
  const [toasts, setToasts] = useState([]);

  // Sincronizar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Error al persistir eventos', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, currentUser.id);
    } catch (e) {
      console.error('Error al persistir usuario', e);
    }
  }, [currentUser]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cambiar usuario / rol
  const switchUser = (userId) => {
    const selected = USERS.find(u => u.id === userId);
    if (selected) {
      setCurrentUser(selected);
      // Redirigir según el rol
      if (selected.role === 'aprendiz') {
        setActiveTab('apprentice');
      } else {
        if (activeTab === 'apprentice') {
          setActiveTab('dashboard');
        }
      }
      addToast(
        'Perfil cambiado',
        `Ahora estás navegando como: ${selected.name} (${selected.roleLabel})`,
        'info'
      );
    }
  };

  // Acciones sobre eventos

  // 1. Publicar / Despublicar evento
  const togglePublishEvent = (eventId) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        const isCurrentlyPublished = evt.status === 'published';
        const newStatus = isCurrentlyPublished ? 'draft' : 'published';
        addToast(
          isCurrentlyPublished ? 'Evento despublicado' : 'Evento publicado con éxito',
          `El evento "${evt.title}" ahora está en estado: ${newStatus === 'published' ? 'Publicado' : 'Borrador'}`,
          newStatus === 'published' ? 'success' : 'warning'
        );
        return {
          ...evt,
          status: newStatus,
          // Si se pasa a borrador, deshabilitamos asistencia
          attendanceEnabled: newStatus === 'published' ? evt.attendanceEnabled : false
        };
      }
      return evt;
    }));
  };

  // 2. Habilitar / Deshabilitar asistencia
  const toggleAttendance = (eventId) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        if (evt.status !== 'published') {
          addToast(
            'Atención',
            'Primero debes publicar el evento para poder habilitar la toma de asistencia.',
            'warning'
          );
          return evt;
        }
        const nextState = !evt.attendanceEnabled;
        addToast(
          nextState ? 'Asistencia Habilitada' : 'Asistencia Pausada',
          nextState
            ? `Los aprendices ya pueden marcar su asistencia en "${evt.title}".`
            : `Se ha cerrado la toma de asistencia para "${evt.title}".`,
          nextState ? 'success' : 'info'
        );
        return {
          ...evt,
          attendanceEnabled: nextState
        };
      }
      return evt;
    }));
  };

  // 3. Cerrar evento (Finalizar)
  const closeEvent = (eventId) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        addToast(
          'Evento Cerrado',
          `El evento "${evt.title}" ha sido finalizado. Las métricas finales han quedado registradas.`,
          'info'
        );
        return {
          ...evt,
          status: 'closed',
          attendanceEnabled: false
        };
      }
      return evt;
    }));
  };

  // 4. Editar evento
  const updateEvent = (eventId, updatedData) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        addToast(
          'Evento Actualizado',
          `Se guardaron los cambios del evento "${updatedData.title || evt.title}".`,
          'success'
        );
        return { ...evt, ...updatedData };
      }
      return evt;
    }));
  };

  // 5. Crear nuevo evento manual
  const createEvent = (newEventData) => {
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: newEventData.title || 'Nuevo Evento',
      purpose: newEventData.purpose || 'Propósito del evento',
      image: newEventData.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      area: newEventData.area || (currentUser.area || 'Música'),
      date: newEventData.date || new Date().toISOString().split('T')[0],
      time: newEventData.time || '10:00 - 12:00',
      location: newEventData.location || 'Instalaciones Principales',
      status: 'draft',
      attendanceEnabled: false,
      attendeesCount: 0,
      capacity: Number(newEventData.capacity) || 50,
      attendedByUserIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setEvents(prev => [newEvent, ...prev]);
    addToast('Evento Creado', `Se ha creado "${newEvent.title}" en modo Borrador.`, 'success');
    return newEvent;
  };

  // 6. Importar lista de eventos generados por la IA / Excel
  const importEventsFromAI = (extractedEvents) => {
    const formatted = extractedEvents.map((item, index) => ({
      id: `evt-ai-${Date.now()}-${index}`,
      title: item.titulo,
      purpose: item.proposito,
      image: item.imagen,
      area: item.area,
      date: item.fecha || new Date().toISOString().split('T')[0],
      time: item.horario || '14:00 - 17:00',
      location: item.lugar || 'Auditorio / Canchas',
      status: 'draft', // Siempre nacen en borrador para revisión
      attendanceEnabled: false,
      attendeesCount: 0,
      capacity: Number(item.capacidad) || 50,
      attendedByUserIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    }));

    setEvents(prev => [...formatted, ...prev]);
    addToast(
      'Eventos importados con éxito',
      `Se crearon ${formatted.length} nuevos eventos listos para ser publicados y gestionados.`,
      'success'
    );
  };

  // 7. Registro de asistencia por parte de un Aprendiz
  const registerAttendance = (eventId) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        const alreadyAttended = evt.attendedByUserIds.includes(currentUser.id);
        if (alreadyAttended) {
          // Si ya asistió, cancelar asistencia (simulación)
          addToast(
            'Asistencia Cancelada',
            `Has cancelado tu registro en "${evt.title}".`,
            'info'
          );
          return {
            ...evt,
            attendeesCount: Math.max(0, evt.attendeesCount - 1),
            attendedByUserIds: evt.attendedByUserIds.filter(id => id !== currentUser.id)
          };
        } else {
          // Registrar asistencia
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.75 }
            });
          } catch {}

          addToast(
            '¡Asistencia Registrada! 🎉',
            `Tu asistencia para "${evt.title}" ha quedado confirmada en el sistema.`,
            'success'
          );
          return {
            ...evt,
            attendeesCount: evt.attendeesCount + 1,
            attendedByUserIds: [...evt.attendedByUserIds, currentUser.id]
          };
        }
      }
      return evt;
    }));
  };

  // 8. Restablecer datos a estado inicial
  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setEvents(INITIAL_EVENTS);
    setCurrentUser(USERS[0]);
    setActiveTab('dashboard');
    addToast(
      'Sistema Reiniciado',
      'Se han restaurado los datos y perfiles predeterminados del mockup.',
      'info'
    );
  };

  // Filtrado de eventos según permisos del rol actual
  const visibleEvents = events.filter(evt => {
    if (currentUser.role === 'admin_general') return true;
    if (currentUser.role === 'admin_area') return evt.area === currentUser.area;
    if (currentUser.role === 'aprendiz') {
      // Aprendiz: solo eventos de hoy que estén publicados o con asistencia abierta
      const todayStr = new Date().toISOString().split('T')[0];
      return evt.date === todayStr && (evt.status === 'published' || evt.status === 'closed');
    }
    return true;
  });

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users: USERS,
        switchUser,
        events,
        visibleEvents,
        activeTab,
        setActiveTab,
        togglePublishEvent,
        toggleAttendance,
        closeEvent,
        updateEvent,
        createEvent,
        importEventsFromAI,
        registerAttendance,
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
