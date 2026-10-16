import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, Calendar, Clock, MapPin, Users, Sparkles, Building2 } from 'lucide-react';
import { AREAS, TRIMESTRES } from '../data/mockData';
import { getSemanticImage } from '../utils/excelHelper';

export default function EventModal({ isOpen, onClose, eventToEdit = null }) {
  const { currentUser, createEvent, updateEvent } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    purpose: '',
    objective: '',
    extendedDescription: '',
    area: currentUser.area || 'Cultura',
    quarter: 'Trimestre 4',
    image: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00 - 17:00',
    duration: '3 horas',
    location: 'Centro de Formación - Auditorio Principal',
    capacity: 60
  });

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title,
        code: eventToEdit.code || '',
        purpose: eventToEdit.purpose,
        objective: eventToEdit.objective || '',
        extendedDescription: eventToEdit.extendedDescription || '',
        area: eventToEdit.area,
        quarter: eventToEdit.quarter || 'Trimestre 4',
        image: eventToEdit.image,
        date: eventToEdit.date,
        time: eventToEdit.time,
        duration: eventToEdit.duration || '3 horas',
        location: eventToEdit.location,
        capacity: eventToEdit.capacity
      });
    } else {
      const defaultArea = currentUser.area || 'Cultura';
      setFormData({
        title: '',
        code: `ACT-${defaultArea.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 90 + 10)}`,
        purpose: '',
        objective: '',
        extendedDescription: '',
        area: defaultArea,
        quarter: 'Trimestre 4',
        image: getSemanticImage(defaultArea, ''),
        date: new Date().toISOString().split('T')[0],
        time: '14:00 - 17:00',
        duration: '3 horas',
        location: 'Centro de Formación - Auditorio Principal',
        capacity: 60
      });
    }
  }, [eventToEdit, isOpen, currentUser]);

  if (!isOpen) return null;

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
    const suggested = getSemanticImage(formData.area, formData.title + ' ' + formData.purpose);
    setFormData(prev => ({ ...prev, image: suggested }));
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto overscroll-contain space-y-3.5 flex-1 text-xs">
          
          {/* Título y Código */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
          </div>

          {/* Área y Trimestre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <div>
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
          <div>
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
          <div>
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

          {/* Parámetros Operativos (Fecha, Horario, Duración, Capacidad) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Fecha Exacta *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-mono text-[#1e293b] focus:outline-none focus:border-[#15803d]"
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

          {/* Ubicación */}
          <div>
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

          {/* Imagen de Portada IA */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-[#334155]">
                Imagen de Portada
              </label>
              <button
                type="button"
                onClick={handleGenerateImage}
                className="text-[10px] text-[#15803d] hover:text-[#166534] font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>Regenerar con IA Temática</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={formData.image}
                alt="Preview"
                className="w-16 h-12 rounded-xl object-cover border border-[#cbd5e1] shrink-0"
              />
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-[11px] font-mono text-[#475569] focus:outline-none focus:border-[#15803d]"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-end gap-2">
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
