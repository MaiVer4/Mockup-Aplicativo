import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, ShieldCheck, Mail, Lock, User, Layers } from 'lucide-react';
import { AREAS } from '../data/mockData';

export default function RegisterEncargadoModal({ isOpen, onClose }) {
  const { registerEncargadoByAdmin, addToast } = useApp();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    area: 'Cultura'
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Ingresa un correo electrónico institucional válido.');
      return;
    }

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const result = registerEncargadoByAdmin({
      name: fullName,
      email: formData.email.trim(),
      password: formData.password.trim(),
      area: formData.area
    });

    if (result.success) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        area: 'Cultura'
      });
      onClose();
    } else {
      setError(result.message || 'Error al registrar el encargado.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-[#e2e8f0] w-full max-w-lg overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15803d] text-white flex items-center justify-center shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e293b] font-heading">
                Registrar Encargado de Área
              </h3>
              <p className="text-[11px] text-[#64748b]">
                Asignación de credenciales operativas directas por el Administrador.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Nombres
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Mateo"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Apellidos
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Silva Gómez"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#334155] mb-1">
              Correo Electrónico Institucional
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="ejemplo.encargado@sena.edu.co"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#334155] mb-1">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#334155] mb-1">
              Área de Bienestar al Aprendiz Asignada
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
              >
                {AREAS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f0f9ff] border border-[#bae6fd] text-[#0369a1] text-[11px] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0284c7] shrink-0" />
            <span>El sistema notificará automáticamente al encargado por correo con estas credenciales de acceso inicial y podrá cambiar su clave al ingresar.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary text-xs py-2 px-4"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary text-xs py-2 px-4 font-bold"
            >
              Registrar Encargado
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
