import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, Calendar, Clock, MapPin, Users, Sparkles, Building2, AlertTriangle, Upload, Link2, RotateCcw, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { AREAS, TRIMESTRES } from '../data/mockData';
import { getSemanticImage, buildDefaultImagePrompt } from '../utils/excelHelper';

export default function EventModal({ isOpen, onClose, eventToEdit = null, focusDate = false, focusCover = false }) {
  const { currentUser, createEvent, updateEvent, addToast } = useApp();
  const dateInputRef = useRef(null);
  const dateSectionRef = useRef(null);
  const coverSectionRef = useRef(null);
  const generateCoverBtnRef = useRef(null);
  const fileInputRef = useRef(null);
  const [dateAlertTriggered, setDateAlertTriggered] = useState(false);
  const shouldHighlightDate = Boolean(focusDate || dateAlertTriggered);
  const shouldHighlightCover = Boolean(focusCover);

  const [coverMode, setCoverMode] = useState('ai'); // 'ai' | 'external'
  const [externalUrl, setExternalUrl] = useState('');
  const [previewCandidate, setPreviewCandidate] = useState(null); // { url, source, prompt, optionNumber }
  const [seenPreviewUrls, setSeenPreviewUrls] = useState([]);
  const [linkInput, setLinkInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    purpose: '',
    objective: '',
    extendedDescription: '',
    instructions: '',
    links: [],
    area: currentUser.area || 'Cultura',
    quarter: 'Trimestre 4',
    image: '',
    imagePrompt: '',
    imageSource: 'ai',
    date: new Date().toISOString().split('T')[0],
    time: '14:00 - 17:00',
    duration: '3 horas',
    location: 'Centro de Formación - Auditorio Principal',
    capacity: 60
  });

  useEffect(() => {
    setPreviewCandidate(null);
    setDateAlertTriggered(false);
    if (eventToEdit) {
      const initialPrompt = eventToEdit.imagePrompt || buildDefaultImagePrompt(eventToEdit);
      setFormData({
        title: eventToEdit.title,
        code: eventToEdit.code || '',
        purpose: eventToEdit.purpose,
        objective: eventToEdit.objective || '',
        extendedDescription: eventToEdit.extendedDescription || '',
        instructions: eventToEdit.instructions || '',
        links: Array.isArray(eventToEdit.links) ? eventToEdit.links : [],
        area: eventToEdit.area,
        quarter: eventToEdit.quarter || 'Trimestre 4',
        image: eventToEdit.image,
        imagePrompt: initialPrompt,
        imageSource: eventToEdit.imageSource || 'ai',
        date: eventToEdit.isAmbiguous ? '' : (eventToEdit.date || ''),
        time: eventToEdit.time,
        duration: eventToEdit.duration || '3 horas',
        location: eventToEdit.location,
        capacity: eventToEdit.capacity
      });
      setCoverMode(eventToEdit.imageSource === 'external' ? 'external' : 'ai');
      setExternalUrl(
        eventToEdit.imageSource === 'external' && eventToEdit.image && !eventToEdit.image.startsWith('data:')
          ? eventToEdit.image
          : ''
      );
      setSeenPreviewUrls(eventToEdit.image ? [eventToEdit.image] : []);
      setLinkInput('');
    } else {
      const defaultArea = currentUser.area || 'Cultura';
      setFormData({
        title: '',
        code: `ACT-${defaultArea.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 90 + 10)}`,
        purpose: '',
        objective: '',
        extendedDescription: '',
        instructions: '',
        links: [],
        area: defaultArea,
        quarter: 'Trimestre 4',
        image: null,
        imagePrompt: buildDefaultImagePrompt({ title: '', area: defaultArea, purpose: '' }),
        imageSource: 'ai',
        date: new Date().toISOString().split('T')[0],
        time: '14:00 - 17:00',
        duration: '3 horas',
        location: 'Centro de Formación - Auditorio Principal',
        capacity: 60
      });
      setCoverMode('ai');
      setExternalUrl('');
      setSeenPreviewUrls([]);
      setLinkInput('');
    }
  }, [eventToEdit, isOpen, currentUser]);

  useEffect(() => {
    if (!isOpen) return;
    if (shouldHighlightCover) {
      const timer = setTimeout(() => {
        coverSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        generateCoverBtnRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
    if (shouldHighlightDate) {
      const timer = setTimeout(() => {
        dateSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (dateInputRef.current) {
          dateInputRef.current.focus();
          try {
            dateInputRef.current.showPicker?.();
          } catch {
            // Algunos navegadores restringen showPicker fuera de gesto directo; el focus y resaltado visual permanecen activos
          }
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldHighlightDate, shouldHighlightCover, eventToEdit]);

  if (!isOpen) return null;

  const hasAssignedDate = Boolean(formData.date && /^\d{4}-\d{2}-\d{2}$/.test(formData.date.trim()));

  const addLink = (rawLink) => {
    const link = String(rawLink || '').trim();
    if (!link) return;
    setFormData(prev => ({
      ...prev,
      links: [...new Set([...(Array.isArray(prev.links) ? prev.links : []), link])]
    }));
    setLinkInput('');
  };

  const handleLinkPaste = (e) => {
    const pastedLink = e.clipboardData?.getData('text')?.trim();
    if (!pastedLink) return;
    e.preventDefault();
    addLink(pastedLink);
  };

  const removeLink = (linkToRemove) => {
    setFormData(prev => ({
      ...prev,
      links: (prev.links || []).filter(link => link !== linkToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (eventToEdit) {
      updateEvent(eventToEdit.id, formData);
    } else {
      createEvent(formData);
    }
    onClose();
  };

  const handleGenerateImage = () => {
    if (!hasAssignedDate) {
      setDateAlertTriggered(true);
      addToast(
        'Fecha Requerida para Vista Previa',
        'Para generar la vista previa con IA, primero debes definir la Fecha Exacta arriba.',
        'warning'
      );
      dateSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      dateInputRef.current?.focus();
      try {
        dateInputRef.current?.showPicker?.();
      } catch {}
      return;
    }
    setDateAlertTriggered(false);
    const promptToUse = (formData.imagePrompt && formData.imagePrompt.trim())
      || buildDefaultImagePrompt(formData);
    const exclusions = [...seenPreviewUrls, formData.image, previewCandidate?.url].filter(Boolean);
    const suggested = getSemanticImage(formData.area, promptToUse, exclusions);
    const nextOption = (previewCandidate?.optionNumber || 0) + 1;

    setPreviewCandidate({
      url: suggested,
      source: 'ai',
      prompt: promptToUse,
      optionNumber: nextOption
    });
    setSeenPreviewUrls(prev => [...prev, suggested]);
  };

  const handleConfirmPreview = () => {
    if (!previewCandidate?.url) return;
    setFormData(prev => ({
      ...prev,
      image: previewCandidate.url,
      imagePrompt: previewCandidate.prompt || prev.imagePrompt,
      imageSource: previewCandidate.source || 'ai'
    }));
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
          prompt: formData.imagePrompt,
          optionNumber: 1
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyExternalUrl = () => {
    const trimmed = externalUrl.trim();
    if (!trimmed) {
      addToast('URL requerida', 'Ingresa un enlace directo a una imagen válida.', 'warning');
      return;
    }
    setPreviewCandidate({
      url: trimmed,
      source: 'external',
      prompt: formData.imagePrompt,
      optionNumber: 1
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-[#e2e8f0] w-full max-w-xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="px-5 py-3.5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div>
            <h3 className="text-sm font-bold text-[#1e293b]">
              {eventToEdit ? 'Editar Actividad de Bienestar' : 'Crear Nueva Actividad SENA'}
            </h3>
            <p className="text-[11px] text-[#64748b]">
              Parámetros operativos conforme al formato oficial GOR-F-013.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Flujo RF-08: una actividad se revisa y aprueba antes de publicarse */}
        <div className="px-5 py-2.5 border-b border-[#e2e8f0] bg-white">
          <div className="flex items-center justify-between gap-2 text-[9px] font-bold uppercase tracking-wide">
            <span className="text-amber-700">1. Borrador / revisión</span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-500">2. Aprobada</span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-500">3. Publicada</span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-500">4. Ventana activa / cierre</span>
          </div>
          <p className="text-[10px] text-[#64748b] mt-1">
            Guardar conserva la actividad en borrador; la publicación y la apertura de asistencia son pasos separados del Encargado de Área.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto overscroll-contain space-y-3.5 flex flex-col flex-1 text-xs">
          
          {/* Instrucciones y enlaces para el aprendiz */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-3 order-50">
            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">Instrucciones (opcional)</label>
              <textarea
                rows={2}
                placeholder="Indica al aprendiz qué debe preparar o realizar..."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d] resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1 flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5 text-blue-600" /> Enlaces de apoyo (opcional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  onPaste={handleLinkPaste}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink(linkInput); } }}
                  placeholder="Pega un enlace y se agregará automáticamente"
                  className="flex-1 px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d] font-mono"
                />
                <button type="button" onClick={() => addLink(linkInput)} className="px-3 py-2 rounded-xl bg-[#15803d] text-white text-[11px] font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              {formData.links?.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {formData.links.map((link) => (
                    <div key={link} className="flex items-center gap-2 rounded-lg bg-white border border-blue-100 px-2.5 py-1.5">
                      <a href={link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-700 underline truncate flex-1">{link}</a>
                      <button type="button" onClick={() => removeLink(link)} aria-label={`Quitar enlace ${link}`} className="text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Título y Código */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 order-10">
            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Código Oficial
              </label>
              <input
                type="text"
                placeholder="ACT-CUL-01"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d] font-mono"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Nombre de la Actividad *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Taller de Expresión Oral y Declamación"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d] transition-colors font-medium"
              />
            </div>
          </div>

          {/* Área y Trimestre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 order-60">
            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Área de Bienestar
              </label>
              {currentUser.role === 'admin_area' ? (
                <div className="px-3 py-2 rounded-xl bg-[#f8fafc] border border-[#cbd5e1] text-xs font-semibold text-[#1e293b]">
                  {currentUser.area} (Área Asignada)
                </div>
              ) : (
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs font-medium text-[#1e293b] focus:outline-none focus:border-[#15803d] bg-white"
                >
                  {AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Trimestre de Ejecución
              </label>
              <select
                value={formData.quarter}
                onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs font-medium text-[#1e293b] focus:outline-none focus:border-[#15803d] bg-white"
              >
                {TRIMESTRES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Propósito Formativo */}
          <div className="order-20">
            <label className="block text-[11px] font-bold text-[#334155] mb-1">
              Propósito Formativo *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Describa el propósito y alcance formativo para los aprendices..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Objetivo Operativo */}
          <div className="order-80">
            <label className="block text-[11px] font-bold text-[#334155] mb-1">
              Objetivo Operativo (GOR-F-013)
            </label>
            <input
              type="text"
              placeholder="Fortalecer la formación integral e integración biopsicosocial..."
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
            />
          </div>

          {/* Descripción Extendida */}
          <div className="order-90">
            <label className="block text-[11px] font-bold text-[#334155] mb-1">
              Descripción Extendida / Metodología
            </label>
            <textarea
              rows={2}
              placeholder="Detalle operativo para visualización expandida del aprendiz..."
              value={formData.extendedDescription}
              onChange={(e) => setFormData({ ...formData, extendedDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d] transition-colors resize-none"
            />
          </div>

          {/* Alerta contextual cuando se requiere fecha exacta */}
          {shouldHighlightDate && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-2 animate-in fade-in duration-150 order-25">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-bold text-xs">Define la fecha exacta de ejecución</span>
            </div>
          )}

          {/* Parámetros Operativos (Fecha, Horario, Duración, Capacidad) */}
          <div ref={dateSectionRef} className="space-y-2 order-30">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-[#334155]">Ventana de apertura y cierre</span>
              <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2 py-0.5 font-semibold">Participación solo durante la ventana activa</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className={`block text-[11px] font-bold mb-1 ${shouldHighlightDate ? 'text-amber-800' : 'text-[#334155]'}`}>
                Fecha Exacta *
              </label>
              <input
                ref={dateInputRef}
                type="date"
                required
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  if (e.target.value) setDateAlertTriggered(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl border text-xs font-mono text-[#1e293b] focus:outline-none transition-all ${
                  shouldHighlightDate
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/50 focus:border-[#15803d] focus:ring-[#15803d]/30'
                    : 'border-[#cbd5e1] focus:border-[#15803d]'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Horario
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Duración Aprox.
              </label>
              <input
                type="text"
                placeholder="3 horas"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Aforo / Cupos
              </label>
              <input
                type="number"
                min="5"
                max="500"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-mono text-[#1e293b] focus:outline-none focus:border-[#15803d]"
              />
            </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="order-100">
            <label className="block text-[11px] font-bold text-[#334155] mb-1">
              Lugar / Instalaciones
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
            />
          </div>

          {/* Portada de la Actividad (Prompt IA Editable + Imagen Externa) */}
          <div
            ref={coverSectionRef}
            className={`p-3.5 rounded-xl border transition-all space-y-3 order-110 ${
              shouldHighlightCover && !formData.image
                ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/50'
                : formData.image
                ? 'bg-[#f0fdf4] border-[#bbf7d0]'
                : 'bg-[#f8fafc] border-[#cbd5e1]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 shrink-0 ${formData.image ? 'text-[#15803d]' : 'text-amber-600'}`} />
                <div>
                  <span className="font-bold text-xs text-[#1e293b] block">
                    Portada de la Actividad
                  </span>
                  <span className="text-[10px] text-[#64748b] block">
                    Edita el prompt para generar con IA o sube una imagen externa desde tu equipo o URL.
                  </span>
                </div>
              </div>

              {/* Pestañas de Modo: IA vs Imagen Externa */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-[#cbd5e1] self-start sm:self-auto shrink-0">
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

            {coverMode === 'ai' ? (
              <div className="space-y-2 bg-white p-3 rounded-xl border border-[#cbd5e1]/80">
                {dateAlertTriggered && !hasAssignedDate && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in duration-150">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-semibold leading-snug">
                        La portada generada por IA solo se puede generar si la fecha ya fue asignada.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        dateSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        dateInputRef.current?.focus();
                        try {
                          dateInputRef.current?.showPicker?.();
                        } catch {}
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      Asignar Fecha Arriba
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <label className="text-[11px] font-bold text-[#334155]">
                    Prompt de generación de imagen (editable):
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      imagePrompt: buildDefaultImagePrompt(prev)
                    }))}
                    className="text-[10px] font-semibold flex items-center gap-1 text-[#15803d] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Sugerir según título</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={formData.imagePrompt}
                  onChange={(e) => setFormData({ ...formData, imagePrompt: e.target.value })}
                  placeholder="Describe la imagen que deseas generar para esta actividad..."
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] text-xs text-[#1e293b] bg-white focus:outline-none focus:border-[#15803d] transition-colors resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#64748b]">
                    Ej: guitarra, danza, pintura, fútbol, gimnasio, salud, yoga, liderazgo...
                  </span>
                  <button
                    ref={generateCoverBtnRef}
                    type="button"
                    onClick={handleGenerateImage}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs bg-[#15803d] hover:bg-[#166534] text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#15803d]/40"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>
                      {previewCandidate
                        ? 'Generar otra opción'
                        : formData.image
                        ? 'Generar Vista Previa con este Prompt'
                        : 'Generar Vista Previa con IA'}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 bg-white p-3 rounded-xl border border-[#cbd5e1]/80">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-[#f8fafc] border border-dashed border-[#94a3b8]">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#15803d] shrink-0" />
                    <div>
                      <strong className="text-[11px] text-[#1e293b] block">Subir archivo desde tu computador</strong>
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

            {/* VISTA PREVIA INTERACTIVA DE LA IMAGEN GENERADA */}
            {previewCandidate ? (
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
                      ¿Eliges esta imagen o generas otra?
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewCandidate(null)}
                    className="text-[10px] font-semibold text-[#64748b] hover:text-red-600 flex items-center gap-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Descartar</span>
                  </button>
                </div>

                <div className="relative h-36 sm:h-40 w-full rounded-xl overflow-hidden bg-[#0e2738] border border-[#cbd5e1]">
                  <img
                    src={previewCandidate.url}
                    alt="Vista previa de portada generada"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c2f3a]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-2 text-white">
                    <span className="text-[10px] font-medium text-white/90 truncate">
                      {previewCandidate.source === 'ai'
                        ? `Prompt: "${previewCandidate.prompt}"`
                        : 'Imagen externa lista para confirmar'}
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
                      onClick={handleGenerateImage}
                      className="px-3 py-1.5 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#1e293b] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#15803d]" />
                      <span>Generar otra opción</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleConfirmPreview}
                    className="px-3.5 py-1.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Elegir esta portada</span>
                  </button>
                </div>
              </div>
            ) : formData.image ? (
              <div className="relative h-32 w-full rounded-xl overflow-hidden border border-[#bbf7d0] bg-[#0e2738]">
                <img
                  src={formData.image}
                  alt={formData.title || 'Portada seleccionada'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#0e2738]/80 text-white text-[10px] font-semibold backdrop-blur-xs">
                  Portada elegida ✓ · {formData.imageSource === 'external' ? 'Imagen Externa' : `IA (${formData.area})`}
                </div>
              </div>
            ) : (
              <div className="py-2.5 px-3 rounded-lg border border-dashed border-amber-300 bg-white/80 text-center text-[11px] text-amber-900 font-medium">
                Genera una vista previa con IA o carga una imagen externa para elegir la portada (opcional antes de publicar).
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-end gap-2 order-120">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-[#e2e8f0] text-xs font-medium text-[#334155] hover:bg-[#f1f5f9] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#15803d] text-white hover:bg-[#166534] transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5 text-white" />
              <span>{eventToEdit ? 'Guardar Cambios' : 'Registrar en Borrador'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
