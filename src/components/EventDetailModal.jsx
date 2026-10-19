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
  Edit3
} from 'lucide-react';
import { buildDefaultImagePrompt, getSemanticImage } from '../utils/excelHelper';

export default function EventDetailModal({ isOpen, onClose, event: propEvent, onOpenEditModal }) {
  const { 
    currentUser, 
    events,
    registerAttendance,
    publishEvent,
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
  }, [isOpen, event?.id]);

  if (!isOpen || !propEvent || !event) return null;

  const isLearner = currentUser.role === 'aprendiz';
  const isEncargado = currentUser.role === 'admin_area';
  const isAttended = event.attendedByUserIds?.includes(currentUser.id);
  const isEnCurso = event.status === 'en_curso';
  const isPublicado = event.status === 'publicado';
  const isFinalizado = event.status === 'finalizado';
  const isDraft = event.status === 'borrador';
  const hasAssignedDate = Boolean(event.date && !event.isAmbiguous);

  const capacity = event.capacity || 50;
  const attendeesCount = event.attendeesCount || 0;
  const percent = Math.min(100, Math.round((attendeesCount / capacity) * 100));

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
          
          {/* Métricas clave estilo Functional Mockup */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
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

          {/* Flujo RF-08: estados controlados y límites del rol operativo */}
          <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-[11px] font-bold text-[#1e293b]">Ciclo de actividad</h4>
              <span className="hidden sm:inline text-[10px] text-[#64748b] font-medium">Asistencia: publicada + abierta</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] font-bold uppercase tracking-wide">
              <span className={`rounded-lg px-1.5 py-1.5 border ${isDraft ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-white text-[#64748b] border-[#e2e8f0]'}`}>Revisión</span>
              <span className={`rounded-lg px-1.5 py-1.5 border ${isPublicado || isEnCurso || isFinalizado ? 'bg-[#eafaf1] text-[#15803d] border-[#bbf7d0]' : 'bg-white text-[#64748b] border-[#e2e8f0]'}`}>Publicada</span>
              <span className={`rounded-lg px-1.5 py-1.5 border ${isEnCurso ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-white text-[#64748b] border-[#e2e8f0]'}`}>Ventana</span>
              <span className={`rounded-lg px-1.5 py-1.5 border ${isFinalizado ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white text-[#64748b] border-[#e2e8f0]'}`}>Cierre</span>
            </div>
            <p className="text-[10px] text-[#64748b]">El encargado opera el ciclo; el administrador lo supervisa.</p>
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
                  Evento finalizado · Acreditación cerrada
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#f0f9ff] border border-[#bae6fd] text-[#0369a1] text-xs font-medium flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>Programado · Se habilita al iniciar la actividad</span>
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
                    <span className="hidden sm:block text-[10px] text-[#64748b]">
                      Edita el prompt o sube una imagen externa.
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

          {/* Acciones para el Encargado */}
          {isEncargado && (
            <div className="pt-2 border-t border-[#edf0f3] flex items-center gap-2">
              {isDraft && (
                event.isAmbiguous ? (
                  <button
                    type="button"
                    onClick={() => onOpenEditModal && onOpenEditModal(event, { focusDate: true })}
                    className="btn bg-amber-600 hover:bg-amber-700 text-white flex-1 px-3.5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm flex items-center justify-between gap-2 transition-colors cursor-pointer"
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
                      onClick={() => {
                        const success = publishEvent(event.id);
                        if (success) onClose();
                      }}
                      className="btn btn-primary flex-1 px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 group/pub shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white/90" />
                      <span>Publicar Evento</span>
                      <ArrowRight className="w-4 h-4 text-[#c4f246] group-hover/pub:translate-x-0.5 transition-transform" />
                    </button>
                    {onOpenEditModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenEditModal(event);
                        }}
                        className="btn btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1e293b] flex items-center justify-center gap-1.5 border border-[#cbd5e1] hover:border-[#15803d] hover:text-[#15803d] hover:bg-emerald-50/40 transition-colors shrink-0 shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#15803d]" />
                        <span>Editar</span>
                      </button>
                    )}
                  </>
                )
              )}

              {isPublicado && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      startEventAttendance(event.id);
                      onClose();
                    }}
                    className="btn btn-primary flex-1 px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 group/live shadow-2xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Habilitar Asistencia Presencial</span>
                  </button>
                  {onOpenEditModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenEditModal(event);
                      }}
                      className="btn btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1e293b] flex items-center justify-center gap-1.5 border border-[#cbd5e1] hover:border-[#15803d] hover:text-[#15803d] hover:bg-emerald-50/40 transition-colors shrink-0 shadow-2xs"
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
                    className="btn btn-danger flex-1 px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Finalizar Evento</span>
                  </button>
                  {onOpenEditModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenEditModal(event);
                      }}
                      className="btn btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1e293b] flex items-center justify-center gap-1.5 border border-[#cbd5e1] hover:border-[#15803d] hover:text-[#15803d] hover:bg-emerald-50/40 transition-colors shrink-0 shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#15803d]" />
                      <span>Editar</span>
                    </button>
                  )}
                </>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
