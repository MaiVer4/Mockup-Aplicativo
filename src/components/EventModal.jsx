import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, Calendar, Clock, MapPin, Users, Sparkles } from 'lucide-react';
import { AREAS } from '../data/mockData';
import { getSemanticImage } from '../utils/excelHelper';

export default function EventModal({ isOpen, onClose, eventToEdit = null }) {
  const { currentUser, createEvent, updateEvent } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    purpose: '',
    area: currentUser.area || 'Música',
    image: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00 - 17:00',
    location: 'Auditorio Principal',
    capacity: 50
  });

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title,
        purpose: eventToEdit.purpose,
        area: eventToEdit.area,
        image: eventToEdit.image,
        date: eventToEdit.date,
        time: eventToEdit.time,
        location: eventToEdit.location,
        capacity: eventToEdit.capacity
      });
    } else {
      const defaultArea = currentUser.area || 'Música';
      setFormData({
        title: '',
        purpose: '',
        area: defaultArea,
        image: getSemanticImage(defaultArea, ''),
        date: new Date().toISOString().split('T')[0],
        time: '14:00 - 17:00',
        location: 'Auditorio Principal',
        capacity: 50
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-zinc-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950">
              {eventToEdit ? 'Editar Evento' : 'Crear Nuevo Evento'}
            </h3>
            <p className="text-[11px] text-zinc-500">
              Ingresa los parámetros operacionales del evento.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
          {/* Título */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-700 mb-1">
              Título del Evento *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Taller de Producción Sonora"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-zinc-900 transition-colors"
            />
          </div>

          {/* Propósito */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-700 mb-1">
              Propósito / Objetivo *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe el objetivo y alcance formativo del evento..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-zinc-900 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Área y Capacidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                Área / División
              </label>
              {currentUser.role === 'admin_area' ? (
                <div className="px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700">
                  {currentUser.area} (Restringido por rol)
                </div>
              ) : (
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 focus:outline-none focus:border-zinc-900 bg-white"
                >
                  {AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                Capacidad Máxima (Cupos)
              </label>
              <div className="relative">
                <Users className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* Fecha, Horario y Lugar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                Fecha
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-zinc-200 text-xs font-mono focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                Horario
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="14:00 - 17:00"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-zinc-200 text-xs font-mono focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                Lugar
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Auditorio B"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* Imagen y Sugerencia IA */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-medium text-zinc-700">
                URL de Imagen
              </label>
              <button
                type="button"
                onClick={handleGenerateImage}
                className="text-[11px] text-zinc-700 hover:text-zinc-950 font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-zinc-600" />
                <span>Sugerir por IA</span>
              </button>
            </div>

            <div className="flex gap-2.5 items-center">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-zinc-900"
              />
              {formData.image && (
                <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 border border-zinc-200">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-tactile px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-zinc-950 hover:bg-zinc-800 shadow-xs transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{eventToEdit ? 'Guardar Cambios' : 'Crear Evento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
