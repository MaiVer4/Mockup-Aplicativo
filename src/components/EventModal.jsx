import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Check, Calendar, Clock, MapPin, Users, BookOpen } from 'lucide-react';
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
    location: 'Auditorio Mayor - Bloque B',
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
        location: 'Auditorio Mayor - Bloque B',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera del modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#0b1e38] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                {eventToEdit ? 'Editar Ficha Curricular' : 'Registrar Convocatoria Académica'}
              </h3>
              <p className="text-[11px] text-slate-300">
                Parámetros oficiales para la cartelera de extensión y acreditación.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Título */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Título de la Actividad / Convocatoria *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Cátedra Magistral de Interpretación y Ensambles"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
            />
          </div>

          {/* Propósito */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Propósito Pedagógico y Formativo *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe las competencias, objetivos de aprendizaje y fundamentación formativa..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Área y Capacidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Departamento / Facultad Responsable
              </label>
              {currentUser.role === 'admin_area' ? (
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                  Depto. de {currentUser.area} (Asignado por Credencial)
                </div>
              ) : (
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-amber-500 transition-all outline-none bg-white"
                >
                  {AREAS.map(area => (
                    <option key={area} value={area}>Depto. de {area}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Aforo Máximo del Recinto (Cupos)
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Fecha, Horario y Lugar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Fecha Lectiva
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Horario
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="14:00 - 17:00"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Recinto / Aula
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Auditorio Mayor"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Imagen y Selector sugerido */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Imagen de la Ficha
              </label>
              <button
                type="button"
                onClick={handleGenerateImage}
                className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Sugerir imagen temática por IA
              </button>
            </div>

            <div className="flex gap-3 items-center">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              />
              {formData.image && (
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-[#0b1e38] hover:bg-[#143156] border border-amber-400/40 shadow-sm transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>{eventToEdit ? 'Guardar Cambios Curriculares' : 'Registrar Convocatoria'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
