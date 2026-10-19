import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Check,
  Play,
  Pause,
  FileSpreadsheet,
  ArrowRight,
  AlertTriangle,
  Upload,
  Link2,
  RotateCcw,
  Image as ImageIcon,
  Edit3,
  ShieldCheck,
  Ban,
  AlertCircle,
  Send,
  MessageSquare,
  Lock,
  FileCheck2
} from 'lucide-react';
import FlowStepper from './FlowStepper';
import HumanApprovalModal from './HumanApprovalModal';
import { buildDefaultImagePrompt, getSemanticImage } from '../utils/excelHelper';

export default function EventDetailModal({ isOpen, onClose, event: propEvent, onOpenEditModal }) {
  const { 
    currentUser, 
    events,
    registerAttendance,
    publishEvent,
    submitForApproval,
    approveEvent,
    rejectEvent,
    cancelEvent,
    startEventAttendance,
    closeEventAttendance,
    updateEventCover,
    addToast
  } = useApp();

  const fileInputRef = useRef(null);
  const promptInputRef = useRef(null);
  const [coverMode, setCoverMode] = useState('ai'); // 'ai' | 'external'
  const [promptText, setPromptText] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [previewCandidate, setPreviewCandidate] = useState(null); // { url, source, prompt, optionNumber }
  const [seenPreviewUrls, setSeenPreviewUrls] = useState([]);
  const [dateAlertTriggered, setDateAlertTriggered] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const event = (propEvent && events.find(e => e.id === propEvent.id)) || propEvent;

  useEffect(() => {
    if (!isOpen || !event) return;
    setPromptText(event.imagePrompt || buildDefaultImagePrompt(event));
    setExternalUrl(
      event.imageSource === 'external' && event.image && !event.image.startsWith('data:')
        ? event.image
        : ''
    );
    setCoverMode(event.imageSource === 'external' ? 'external' : 'ai');
    setPreviewCandidate(null);
    setSeenPreviewUrls(event.image ? [event.image] : []);
    setDateAlertTriggered(false);
    setIsApprovalModalOpen(false);
    setIsCancelModalOpen(false);
    setIsRejectModalOpen(false);
    setCancelReason('');
    setRejectReason('');
  }, [isOpen, event?.id]);

  if (!isOpen || !propEvent || !event) return null;

  const isAdminGeneral = currentUser.role === 'admin_general';
  const isLearner = currentUser.role === 'aprendiz';
  const isEncargado = currentUser.role === 'admin_area';
  const isAttended = event.attendedByUserIds?.includes(currentUser.id);
  const isEnCurso = event.status === 'en_curso';
  const isPublicado = event.status === 'publicado';
  const isFinalizado = event.status === 'finalizado';
  const isDraft = event.status === 'borrador';
  const isPendiente = event.status === 'pendiente_aprobacion';
  const isCancelada = event.status === 'cancelada';
  const hasAssignedDate = Boolean(event.date && !event.isAmbiguous);

  const capacity = event.capacity || 50;
  const attendeesCount = event.attendeesCount || 0;
  const percent = Math.min(100, Math.round((attendeesCount / capacity) * 100));

  const lifecycleSteps = [
    { id: 'borrador', label: 'Borrador' },
    { id: 'pendiente_aprobacion', label: 'Revisión' },
    { id: 'publicado', label: 'Publicado' },
    { id: 'en_curso', label: 'En Curso' },
    { id: 'finalizado', label: 'Finalizado' }
  ];

  const getLifecycleStepIndex = (st) => {
    switch (st) {
      case 'borrador': return 0;
      case 'pendiente_aprobacion': return 1;
      case 'publicado': return 2;
      case 'en_curso': return 3;
      case 'finalizado': return 4;
      default: return 0;
    }
  };

  const handleOpenApproval = () => {
    if (!event.image) {
      addToast('Portada Requerida', 'Se requiere asignar una portada antes de publicar la actividad.', 'warning');
      return;
    }
    if (!hasAssignedDate) {
      addToast('Fecha Requerida', 'Debes fijar una fecha definitiva antes de publicar la actividad.', 'warning');
      return;
    }
    setIsApprovalModalOpen(true);
  };

  const handleConfirmHumanApproval = (eventId, approvalData) => {
    approveEvent(eventId, approvalData);
    setIsApprovalModalOpen(false);
    onClose();
  };

  const handleSubmitToApprovalFlow = () => {
    if (!event.image) {
      addToast('Portada Requerida', 'Se requiere asignar una portada antes de enviar a revisión.', 'warning');
      return;
    }
    if (!hasAssignedDate) {
      addToast('Fecha Requerida', 'Debes fijar una fecha definitiva antes de enviar a revisión.', 'warning');
      return;
    }
    submitForApproval(event.id);
    onClose();
  };

  const handleConfirmCancelEvent = (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      addToast('Motivo Requerido', 'Indica el motivo normativo para cancelar la actividad.', 'warning');
      return;
    }
    cancelEvent(event.id, cancelReason.trim());
    setIsCancelModalOpen(false);
    setCancelReason('');
    onClose();
  };

  const handleConfirmRejectEvent = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      addToast('Observaciones Requeridas', 'Ingresa los motivos o ajustes requeridos para el encargado.', 'warning');
      return;
    }
    rejectEvent(event.id, rejectReason.trim());
    setIsRejectModalOpen(false);
    setRejectReason('');
    onClose();
  };

  const handleGeneratePreview = () => {
    if (!hasAssignedDate) {
      setDateAlertTriggered(true);
      addToast(
        'Fecha Requerida para Vista Previa',
        'La portada generada por IA solo se puede generar si la fecha de la actividad ya fue asignada.',
        'warning'
      );
      return;
    }
    setDateAlertTriggered(false);
    const effectivePrompt = (promptText && promptText.trim())
      ? promptText.trim()
      : buildDefaultImagePrompt(event);
    const exclusions = [...seenPreviewUrls, event.image, previewCandidate?.url].filter(Boolean);
    const candidateUrl = getSemanticImage(event.area, effectivePrompt, exclusions);
    const nextOption = (previewCandidate?.optionNumber || 0) + 1;

    setPreviewCandidate({
      url: candidateUrl,
      source: 'ai',
      prompt: effectivePrompt,
      optionNumber: nextOption
    });
    setSeenPreviewUrls(prev => [...prev, candidateUrl]);
  };

  const handleConfirmPreview = () => {
    if (!previewCandidate?.url) return;
    updateEventCover(event.id, previewCandidate.url, {
      imageSource: previewCandidate.source || 'ai',
      imagePrompt: previewCandidate.prompt || promptText
    });
    setPreviewCandidate(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Formato no válido', 'Selecciona un archivo de imagen (.JPG, .PNG, .WEBP).', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === 'string') {
        setPreviewCandidate({
          url: dataUrl,
          source: 'external',
          prompt: promptText,
          optionNumber: 1
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyExternalUrl = () => {
    const trimmed = externalUrl.trim();
    if (!trimmed) {
      addToast('URL requerida', 'Ingresa o pega un enlace directo a una imagen válida.', 'warning');
      return;
    }
    setPreviewCandidate({
      url: trimmed,
      source: 'external',
      prompt: promptText,
      optionNumber: 1
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-[#e2e8f0] w-full max-w-2xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh] relative">
        
        {/* Botón Cerrar flotante con blur */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0e2738]/80 hover:bg-[#0e2738] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero de Portada o Cabecera de Borrador sin Portada */}
        <div className="relative h-44 sm:h-60 w-full overflow-hidden shrink-0 bg-gradient-to-br from-[#0c2f3a] via-[#103a46] to-[#08242e]">
          {event.image ? (
            <>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c2f3a]/95 via-[#0c2f3a]/40 to-transparent" />
            </>
          ) : (
            <div className="absolute top-4 left-4 sm:top-5 sm:left-6 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[10px] font-bold text-[#c4f246]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isEncargado && !isFinalizado
                  ? 'Sin portada asignada · Puedes añadirla abajo con Prompt IA o imagen externa'
                  : 'Actividad Institucional de Bienestar al Aprendiz'}
              </span>
            </div>
          )}
          
          <div className="absolute bottom-3 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 text-white space-y-1 sm:space-y-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="bg-[#c4f246] text-[#0e2738] text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-lg font-mono">
                {event.area}
              </span>
              <span className="bg-white/20 text-white backdrop-blur-xs text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-lg">
                {event.quarter || 'Trimestre 4'}
              </span>
              {isEnCurso && (
                <span className="bg-[#15803d] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-lg animate-pulse">
                  EN CURSO
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold font-heading text-white tracking-tight line-clamp-2">
              {event.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-1">
              {event.purpose}
            </p>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs flex-1">

          {/* ESTADO 1: BANNER DE ACTIVIDAD CANCELADA (Item 5) */}
          {isCancelada && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Ban className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs font-heading font-extrabold text-rose-950 uppercase tracking-wide">
                    Actividad Cancelada Oficialmente
                  </strong>
                  <span className="text-[10px] text-rose-800">
                    Cancelada el {event.cancelledAt ? new Date(event.cancelledAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recientemente'} por {event.cancelledBy || 'Administración'}.
                  </span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/90 border border-rose-200 text-rose-950 text-xs font-medium">
                <span className="font-bold text-[11px] block text-rose-900 mb-0.5">Motivo Normativo de Cancelación:</span>
                <p className="leading-relaxed">{event.cancellationReason || 'Cancelada por fuerza mayor o ajuste en la programación trimestral.'}</p>
              </div>
            </div>
          )}

          {/* ESTADO 2: STEPPER VISUAL DE CICLO DE VIDA (Item 13) */}
          {!isCancelada && (
            <div className="space-y-2 p-3 sm:p-3.5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#475569] uppercase tracking-wider text-[10px]">
                  Ciclo de Vida Institucional
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  isEnCurso ? 'bg-emerald-100 text-[#15803d]' :
                  isPendiente ? 'bg-amber-100 text-amber-800' :
                  isPublicado ? 'bg-sky-100 text-sky-800' :
                  isFinalizado ? 'bg-slate-200 text-slate-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {event.status === 'borrador' ? '1. Borrador Operativo' :
                   event.status === 'pendiente_aprobacion' ? '2. Pendiente de Aprobación' :
                   event.status === 'publicado' ? '3. Publicada en Cartelera' :
                   event.status === 'en_curso' ? '4. Asistencia Habilitada' :
                   '5. Finalizada y Acreditada'}
                </span>
              </div>
              <FlowStepper
                steps={lifecycleSteps}
                currentStep={getLifecycleStepIndex(event.status)}
                variant="pills"
              />
            </div>
          )}

          {/* ESTADO 3: ALERTA DE ACTIVIDAD PENDIENTE DE APROBACIÓN (Item 10) */}
          {isPendiente && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-bold font-heading">Revisión Normativa en Proceso</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Esta actividad ha sido cargada y configurada por el Encargado de Área y se encuentra esperando el dictamen de validación de Coordinación General antes de su publicación oficial a los aprendices.
              </p>
            </div>
          )}

          {/* CERTIFICACIÓN DE APROBACIÓN HUMANA (Item 4) */}
          {event.humanApproved && (
            <div className="p-3 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-[#14532d] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-[#15803d] shrink-0" />
                <div>
                  <span className="text-xs font-bold block">Aprobación Humana Verificada ✓</span>
                  <span className="text-[10px] text-[#166534]">
                    Certificada conforme a normativa por {event.approvedBy || event.publishedBy || 'Coordinación General'} el {event.approvedAt ? new Date(event.approvedAt).toLocaleDateString('es-CO') : 'Recientemente'}.
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#15803d] text-white text-[9px] font-extrabold uppercase font-mono">
                Acta Válida
              </span>
            </div>
          )}

          {/* PANEL DE CONTROL DE ASISTENCIA Y AFORO CON FECHA Y HORA EXACTA (Item 2) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#f8fafc] border border-[#cbd5e1] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#15803d]" />
                <span className="text-xs font-bold text-[#1e293b]">Control Oficial de Asistencia y Aforo</span>
              </div>
              {isEnCurso ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-[#15803d] text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse" />
                  ASISTENCIA HABILITADA
                </span>
              ) : isFinalizado ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                  <Lock className="w-3 h-3 text-slate-500" />
                  ASISTENCIA CERRADA
                </span>
              ) : isCancelada ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                  <Ban className="w-3 h-3 text-rose-500" />
                  CANCELADA
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 font-medium">Programada para {event.date}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-[#e2e8f0]">
                <span className="text-[10px] text-[#64748b] block font-semibold">Apertura Oficial</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#15803d]" />
                  <span className="font-mono text-[11px] font-bold text-[#1e293b]">
                    {event.attendanceOpenedAt
                      ? new Date(event.attendanceOpenedAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
                      : (isEnCurso ? `${event.date} • ${event.schedule || '14:00'}` : 'No iniciada aún')}
                  </span>
                </div>
                {event.attendanceOpenedBy && (
                  <span className="text-[9px] text-[#64748b] block mt-0.5 truncate">Por: {event.attendanceOpenedBy}</span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#e2e8f0]">
                <span className="text-[10px] text-[#64748b] block font-semibold">Cierre de Lista</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Lock className="w-3.5 h-3.5 text-[#64748b]" />
                  <span className="font-mono text-[11px] font-bold text-[#1e293b]">
                    {event.attendanceClosedAt
                      ? new Date(event.attendanceClosedAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
                      : (isEnCurso ? 'En curso (esperando cierre)' : isFinalizado ? `${event.date} • 18:00` : isCancelada ? 'Cancelada sin apertura' : 'Pendiente de inicio')}
                  </span>
                </div>
                {event.attendanceClosedBy && (
                  <span className="text-[9px] text-[#64748b] block mt-0.5 truncate">Por: {event.attendanceClosedBy}</span>
                )}
              </div>
            </div>
          </div>
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#64748b] font-mono block">
                ASISTENTES
              </span>
              <strong className="text-xl sm:text-2xl font-extrabold text-[#1e293b] font-heading block mt-0.5 sm:mt-1">
                {attendeesCount}
              </strong>
              <small className="text-[#64748b] text-[9px] sm:text-[10px] truncate block">asistencias en sala</small>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#64748b] font-mono block">
                CAPACIDAD
              </span>
              <strong className="text-xl sm:text-2xl font-extrabold text-[#1e293b] font-heading block mt-0.5 sm:mt-1">
                {capacity}
              </strong>
              <small className="text-[#64748b] text-[9px] sm:text-[10px] truncate block">aforo oficial</small>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#eafaf1] border border-[#bbf7d0]">
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#15803d] font-mono block">
                OCUPACIÓN
              </span>
              <strong className="text-xl sm:text-2xl font-extrabold text-[#15803d] font-heading block mt-0.5 sm:mt-1">
                {percent}%
              </strong>
              <small className="text-[#15803d] text-[9px] sm:text-[10px] truncate block">meta alcanzada</small>
            </div>
          </div>

          {/* Información y Parámetros con Iconos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#64748b] shrink-0" />
              <div>
                <small className="text-[10px] text-[#64748b] block">Fecha y Horario</small>
                <strong className="text-xs text-[#334155] font-mono block">{event.date} • {event.schedule || '14:00'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#64748b] shrink-0" />
              <div className="truncate">
                <small className="text-[10px] text-[#64748b] block">Ubicación</small>
                <strong className="text-xs text-[#334155] block truncate">{event.location}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#64748b] shrink-0" />
              <div>
                <small className="text-[10px] text-[#64748b] block">Responsable</small>
                <strong className="text-xs text-[#334155] block">Bienestar • {event.area}</strong>
              </div>
            </div>
          </div>

          {/* Descripción Extendida y Metodología */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#1e293b] font-heading">
              Metodología y Objetivos Formativos
            </h4>
            <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#334155] leading-relaxed text-xs">
              {event.extendedDescription || event.purpose}
            </div>
          </div>

          {/* Acciones para el Aprendiz */}
          {isLearner && (
            <div className="pt-2 border-t border-[#e2e8f0]">
              {isAttended ? (
                <div className="p-3.5 rounded-xl bg-[#eafaf1] border border-[#bbf7d0] text-[#15803d] font-bold flex items-center justify-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tu asistencia presencial está certificada en acta con firma digital</span>
                </div>
              ) : isEnCurso ? (
                <button
                  type="button"
                  onClick={() => {
                    registerAttendance(event.id);
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm bg-[#15803d] text-white hover:bg-[#166534] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Confirmar Asistencia Presencial</span>
                </button>
              ) : isFinalizado ? (
                <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] text-center text-xs font-semibold">
                  Evento finalizado · Acreditación presencial cerrada
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#f0f9ff] border border-[#bae6fd] text-[#0369a1] text-xs font-medium flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>Programado · La acreditación presencial se habilitará al iniciar la actividad</span>
                </div>
              )}
            </div>
          )}

          {/* Alerta de Ambigüedad para el Encargado */}
          {isEncargado && isDraft && event.isAmbiguous && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-bold text-xs">Fecha pendiente de confirmación</span>
                </div>
                {onOpenEditModal && (
                  <button
                    type="button"
                    onClick={() => onOpenEditModal(event, { focusDate: true })}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Editar Fecha Exacta
                  </button>
                )}
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {event.ambiguityReason || 'Esta actividad proviene del plan de bienestar con programación tentativa. Confirma la fecha para proceder a publicarla en la cartelera oficial.'}
              </p>
            </div>
          )}

          {/* Gestión de Portada (Prompt IA Editable + Carga de Imagen Externa en Borrador, Publicado o En Curso) */}
          {isEncargado && !isFinalizado && (
            <div className={`p-3.5 sm:p-4 rounded-xl border space-y-3 ${event.image ? 'bg-[#f0fdf4] border-[#bbf7d0]' : 'bg-[#f8fafc] border-[#cbd5e1]'}`}>
              {/* Cabecera y selector de modo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#15803d]" />
                  <div>
                    <span className="font-bold text-xs block text-[#1e293b]">
                      {event.image ? 'Portada de la Actividad Asignada' : 'Portada de la Actividad'}
                    </span>
                    <span className="text-[10px] text-[#64748b] block">
                      Edita el prompt para generar con IA o sube una imagen externa desde tu equipo o URL.
                    </span>
                  </div>
                </div>

                {/* Pestañas de Modo: IA vs Imagen Externa */}
                <div className="flex items-center bg-white/90 p-1 rounded-xl border border-[#cbd5e1] self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setCoverMode('ai')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      coverMode === 'ai'
                        ? 'bg-[#15803d] text-white shadow-2xs'
                        : 'text-[#64748b] hover:text-[#1e293b]'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Prompt IA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverMode('external')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      coverMode === 'external'
                        ? 'bg-[#15803d] text-white shadow-2xs'
                        : 'text-[#64748b] hover:text-[#1e293b]'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Imagen Externa</span>
                  </button>
                </div>
              </div>

              {/* MODO 1: PROMPT DE IA EDITABLE */}
              {coverMode === 'ai' && (
                <div className="space-y-2 bg-white p-3 rounded-xl border border-[#cbd5e1]/80">
                  {dateAlertTriggered && !hasAssignedDate && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in duration-150">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-semibold leading-snug">
                          La portada generada por IA solo se puede generar si la fecha de la actividad ya fue asignada.
                        </span>
                      </div>
                      {onOpenEditModal && (
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(event, { focusDate: true })}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                        >
                          Asignar Fecha Primero
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] font-bold text-[#334155] flex items-center gap-1.5">
                      <span>Prompt de generación de imagen (editable):</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setPromptText(buildDefaultImagePrompt(event))}
                      className="text-[10px] font-semibold flex items-center gap-1 text-[#15803d] hover:underline cursor-pointer"
                      title="Restaurar prompt sugerido por defecto"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restaurar sugerido</span>
                    </button>
                  </div>

                  <textarea
                    ref={promptInputRef}
                    rows={2}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Describe la imagen que deseas generar para esta actividad..."
                    className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] text-xs text-[#1e293b] bg-white focus:outline-none focus:border-[#15803d] transition-colors resize-none leading-relaxed"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                    <span className="text-[10px] text-[#64748b]">
                      Palabras clave reconocidas: música, danza, pintura, fútbol, gimnasio, salud, yoga, liderazgo, tecnología...
                    </span>
                    <button
                      type="button"
                      onClick={handleGeneratePreview}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs bg-[#15803d] hover:bg-[#166534] text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#15803d]/40"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                      <span>
                        {previewCandidate
                          ? 'Generar otra opción'
                          : event.image
                          ? 'Generar Vista Previa con este Prompt'
                          : 'Generar Vista Previa con IA'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* MODO 2: CARGAR IMAGEN EXTERNA (ARCHIVO LOCAL O URL) */}
              {coverMode === 'external' && (
                <div className="space-y-3 bg-white p-3 rounded-xl border border-[#cbd5e1]/80">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Subir archivo desde el equipo */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-[#f8fafc] border border-dashed border-[#94a3b8]">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#15803d] shrink-0" />
                      <div>
                        <strong className="text-[11px] text-[#1e293b] block">Subir imagen desde tu computador</strong>
                        <small className="text-[10px] text-[#64748b]">Formatos admitidos: JPG, PNG, WEBP</small>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#0e2738] hover:bg-[#1e293b] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Seleccionar Archivo</span>
                    </button>
                  </div>

                  {/* O pegar enlace URL */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#334155] flex items-center gap-1">
                      <Link2 className="w-3.5 h-3.5 text-[#64748b]" />
                      <span>O pegar enlace URL directo de una imagen externa:</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                        placeholder="https://ejemplo.com/imagen-evento.jpg"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[#cbd5e1] text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d] font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleApplyExternalUrl}
                        className="px-3 py-1.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                      >
                        Previsualizar URL
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VISTA PREVIA INTERACTIVA DE LA IMAGEN GENERADA / CARGADA */}
              {previewCandidate && (
                <div className="p-3 rounded-xl bg-white border-2 border-[#15803d] shadow-md space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] text-[10px] font-extrabold">
                        <Sparkles className="w-3 h-3" />
                        {previewCandidate.source === 'external'
                          ? 'Vista Previa · Imagen Externa'
                          : `Vista Previa IA · Opción #${previewCandidate.optionNumber}`}
                      </span>
                      <span className="text-[10px] text-[#64748b] font-medium">
                        ¿Deseas usar esta imagen como portada o generar otra?
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewCandidate(null)}
                      className="text-[10px] font-semibold text-[#64748b] hover:text-red-600 flex items-center gap-0.5 cursor-pointer"
                      title="Descartar vista previa"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Descartar</span>
                    </button>
                  </div>

                  <div className="relative h-40 sm:h-48 w-full rounded-xl overflow-hidden bg-[#0e2738] border border-[#cbd5e1]">
                    <img
                      src={previewCandidate.url}
                      alt="Vista previa de portada generada"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c2f3a]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 text-white">
                      <span className="text-[10px] font-medium text-white/90 truncate">
                        {previewCandidate.source === 'ai'
                          ? `Prompt: "${previewCandidate.prompt}"`
                          : 'Imagen externa lista para aplicar'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-[#0e2738] text-[9px] font-extrabold shrink-0">
                        VISTA PREVIA
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-0.5">
                    {previewCandidate.source === 'ai' && (
                      <button
                        type="button"
                        onClick={handleGeneratePreview}
                        className="px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#1e293b] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#15803d]" />
                        <span>Generar otra opción</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleConfirmPreview}
                      className="px-3.5 py-2 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Elegir esta portada</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACCIONES INSTITUCIONALES POR ROL (Item 4, 5, 8, 10) */}
          
          {/* Si está cancelada: Estado informativo inmutable */}
          {isCancelada && (
            <div className="pt-3 border-t border-[#edf0f3] flex items-center justify-between text-xs text-rose-800 bg-rose-50/50 p-3 rounded-xl border border-rose-200">
              <span className="font-semibold flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-600" />
                Actividad cancelada normativamente. El registro de asistencia ha sido archivado.
              </span>
              <span className="text-[10px] uppercase font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                Sin Acciones
              </span>
            </div>
          )}

          {/* ACCIONES DEL ADMINISTRADOR GENERAL (Supervisión y Dictamen) */}
          {!isCancelada && isAdminGeneral && (
            <div className="pt-3 border-t border-[#edf0f3] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#0e2738] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
                  Acciones de Coordinación General
                </span>
                <span className="text-[10px] text-[#64748b] font-normal lowercase">Área de Supervisión Integral</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isPendiente && (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenApproval}
                      className="btn btn-primary flex-1 min-w-[180px] py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.96]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#c4f246]" />
                      <span>Aprobar y Publicar en Cartelera</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsRejectModalOpen(true)}
                      className="btn bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-[0.96]"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-700" />
                      <span>Solicitar Ajustes</span>
                    </button>
                  </>
                )}

                {isPublicado && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        startEventAttendance(event.id);
                        onClose();
                      }}
                      className="btn btn-primary flex-1 py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.96]"
                    >
                      <Play className="w-3.5 h-3.5 text-[#c4f246]" />
                      <span>Habilitar Asistencia Presencial</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCancelModalOpen(true)}
                      className="btn bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-[0.96]"
                    >
                      <Ban className="w-4 h-4 text-rose-600" />
                      <span>Cancelar Actividad</span>
                    </button>
                  </>
                )}

                {isEnCurso && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        closeEventAttendance(event.id);
                        onClose();
                      }}
                      className="btn btn-danger flex-1 py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.96]"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Finalizar Evento</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCancelModalOpen(true)}
                      className="btn bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-[0.96]"
                    >
                      <Ban className="w-4 h-4 text-rose-600" />
                      <span>Cancelar Actividad</span>
                    </button>
                  </>
                )}

                {onOpenEditModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenEditModal(event);
                    }}
                    className="btn btn-secondary py-2.5 px-3.5 rounded-xl text-xs font-semibold text-[#1e293b] flex items-center justify-center gap-1.5 border border-[#cbd5e1] hover:border-[#15803d] hover:text-[#15803d] transition-colors shrink-0 active:scale-[0.96]"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#15803d]" />
                    <span>Editar Ficha</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ACCIONES DEL ENCARGADO DE ÁREA (Operación y Asistencia) */}
          {!isCancelada && isEncargado && (
            <div className="pt-3 border-t border-[#edf0f3] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#0e2738] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#15803d]" />
                  Acciones de Gestión Operativa ({event.area})
                </span>
                <span className="text-[10px] text-[#64748b] font-normal lowercase">Área de Responsabilidad</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isDraft && (
                  event.isAmbiguous ? (
                    <button
                      type="button"
                      onClick={() => onOpenEditModal && onOpenEditModal(event, { focusDate: true })}
                      className="btn bg-amber-600 hover:bg-amber-700 text-white flex-1 px-3.5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm flex items-center justify-between gap-2 transition-colors cursor-pointer active:scale-[0.96]"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                          <Calendar className="w-3.5 h-3.5" />
                        </span>
                        <span className="truncate">Fijar Fecha Exacta en Editor</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleSubmitToApprovalFlow}
                        className="btn bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-[0.96]"
                        title="Enviar a Coordinación General para dictamen normativo"
                      >
                        <Send className="w-3.5 h-3.5 text-sky-700" />
                        <span>Enviar a Revisión</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenApproval}
                        className="btn btn-primary flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 group/pub shadow-2xs active:scale-[0.96]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white/90" />
                        <span>Publicar con Certificación</span>
                        <ArrowRight className="w-4 h-4 text-[#c4f246] group-hover/pub:translate-x-0.5 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsCancelModalOpen(true)}
                        className="btn bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors active:scale-[0.96]"
                      >
                        <Ban className="w-3.5 h-3.5 text-rose-600" />
                        <span>Cancelar</span>
                      </button>

                      {onOpenEditModal && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenEditModal(event);
                          }}
                          className="btn btn-secondary px-3 py-2.5 rounded-xl text-xs font-semibold text-[#1e293b] flex items-center justify-center gap-1.5 border border-[#cbd5e1] hover:border-[#15803d] hover:text-[#15803d] hover:bg-emerald-50/40 transition-colors shrink-0 shadow-2xs active:scale-[0.96]"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#15803d]" />
                          <span>Editar</span>
                        </button>
                      )}
                    </>
                  )
                )}

                {isPendiente && (
                  <div className="w-full flex items-center justify-between gap-2">
                    <span className="text-[11px] text-amber-800 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 flex-1">
                      Esperando aprobación de Coordinación General. Puedes editar la información si necesitas corregir parámetros.
                    </span>
                    {onOpenEditModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenEditModal(event);
                        }}
                        className="btn btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1e293b] flex items-center justify-center gap-1.5 border border-[#cbd5e1] hover:border-[#15803d] shrink-0"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#15803d]" />
                        <span>Editar</span>
                      </button>
                    )}
                  </div>
                )}

                {isPublicado && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        startEventAttendance(event.id);
                        onClose();
                      }}
                      className="btn btn-primary flex-1 py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 group/live shadow-2xs active:scale-[0.96]"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Habilitar Asistencia Presencial</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCancelModalOpen(true)}
                      className="btn bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors active:scale-[0.96]"
                    >
                      <Ban className="w-3.5 h-3.5 text-rose-600" />
                      <span>Cancelar</span>
                    </button>

                    {onOpenEditModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenEditModal(event);
                        }}
                        className="btn btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1e293b] flex items-center justify-center gap-1.5 border border-[#cbd5e1] hover:border-[#15803d] hover:text-[#15803d] hover:bg-emerald-50/40 transition-colors shrink-0 shadow-2xs active:scale-[0.96]"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#15803d]" />
                        <span>Editar</span>
                      </button>
                    )}
                  </>
                )}

                {isEnCurso && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        closeEventAttendance(event.id);
                        onClose();
                      }}
                      className="btn btn-danger flex-1 py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-2xs active:scale-[0.96]"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Finalizar Evento y Cerrar Lista</span>
                    </button>

                    {onOpenEditModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenEditModal(event);
                        }}
                        className="btn btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1e293b] flex items-center justify-center gap-1.5 border border-[#cbd5e1] hover:border-[#15803d] hover:text-[#15803d] hover:bg-emerald-50/40 transition-colors shrink-0 shadow-2xs active:scale-[0.96]"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#15803d]" />
                        <span>Editar</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MODAL DE APROBACIÓN HUMANA CERTIFICADA (Item 4) */}
      <HumanApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        event={event}
        onConfirmApproval={handleConfirmHumanApproval}
      />

      {/* MODAL DE CANCELACIÓN NORMATIVA DE ACTIVIDAD (Item 5) */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] w-full max-w-md p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <div className="flex items-center gap-2.5 text-rose-700">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                  <Ban className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#1e293b]">Cancelar Actividad Oficial</h3>
                  <span className="text-[11px] text-[#64748b]">Procedimiento normativo institucional</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="text-[#64748b] hover:text-[#1e293b]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              La cancelación suspende la actividad en la cartelera, anula las asistencias presenciales y notifica automáticamente al buzón de la comunidad educativa.
            </p>

            <form onSubmit={handleConfirmCancelEvent} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Motivo Normativo de la Cancelación *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ej. Suspensión por mantenimiento de infraestructura en polideportivo o reasignación de formador..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="btn btn-secondary flex-1 py-2.5 rounded-xl text-xs"
                >
                  Regresar
                </button>
                <button
                  type="submit"
                  className="btn btn-danger flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.96]"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Confirmar Cancelación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE SOLICITUD DE AJUSTES / RECHAZO (Item 10) */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] w-full max-w-md p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <div className="flex items-center gap-2.5 text-amber-700">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#1e293b]">Solicitar Ajustes al Encargado</h3>
                  <span className="text-[11px] text-[#64748b]">Dictamen previo a publicación</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="text-[#64748b] hover:text-[#1e293b]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              La actividad regresará a estado de borrador y se emitirá una notificación de dictamen al encargado de {event.area} con tus observaciones.
            </p>

            <form onSubmit={handleConfirmRejectEvent} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Observaciones y Parámetros a Corregir *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ej. Ajustar el aforo oficial conforme al salón 302 o complementar la metodología formativa..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="btn btn-secondary flex-1 py-2.5 rounded-xl text-xs"
                >
                  Regresar
                </button>
                <button
                  type="submit"
                  className="btn bg-amber-600 hover:bg-amber-700 text-white flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.96]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Observaciones</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
