import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  UserPlus, 
  GraduationCap, 
  Sparkles, 
  IdCard, 
  Mail, 
  Lock, 
  Phone, 
  Building2, 
  BookOpen, 
  Check 
} from 'lucide-react';
import { 
  TIPOS_DOCUMENTO, 
  GENEROS, 
  MODALIDADES, 
  JORNADAS, 
  NIVELES_FORMACION, 
  PROGRAMAS_FORMACION, 
  CENTROS_FORMACION 
} from '../data/mockData';

export default function CreateApprenticeModal({ isOpen, onClose }) {
  const { createApprenticeByAdmin } = useApp();

  const initialForm = {
    name: '',
    documentType: 'Cédula de Ciudadanía (CC)',
    documentNumber: '',
    email: '',
    personalEmail: '',
    password: '',
    gender: 'Femenino',
    ficha: '',
    modality: 'Presencial',
    program: PROGRAMAS_FORMACION[0] || 'Análisis y Desarrollo de Software (ADSO)',
    jornada: 'Diurna',
    level: 'Tecnólogo',
    trainingCenter: CENTROS_FORMACION[0] || 'Centro de Electricidad, Electrónica y Telecomunicaciones',
    phone: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickFill = () => {
    const randomNum = Math.floor(Math.random() * 900000 + 100000);
    const randomFicha = Math.floor(Math.random() * 80000 + 2600000);
    setFormData({
      name: 'Laura Valentina Gómez Ramos',
      documentType: 'Cédula de Ciudadanía (CC)',
      documentNumber: `10${randomNum}`,
      email: `laura.gomez${randomNum.toString().slice(0, 3)}@sena.edu.co`,
      personalEmail: `lauragomez.${randomNum.toString().slice(0, 3)}@gmail.com`,
      password: 'Sena2026*',
      gender: 'Femenino',
      ficha: `${randomFicha}`,
      modality: 'Presencial',
      program: 'Análisis y Desarrollo de Software (ADSO)',
      jornada: 'Diurna',
      level: 'Tecnólogo',
      trainingCenter: 'Centro de Electricidad, Electrónica y Telecomunicaciones',
      phone: '3158920491'
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.documentNumber.trim() || !formData.email.trim() || !formData.ficha.trim()) {
      setError('Por favor complete todos los campos obligatorios (*).');
      return;
    }

    const res = createApprenticeByAdmin(formData);
    if (!res.success) {
      setError(res.message);
      return;
    }

    setFormData(initialForm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-[#e2e8f0] w-full max-w-2xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh]">
        
        {/* Cabecera */}
        <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eafaf1] text-[#15803d] flex items-center justify-center border border-[#bbf7d0] shadow-2xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1e293b] font-heading">
                  Crear Nuevo Aprendiz SENA
                </h3>
                <span className="text-[10px] bg-[#eafaf1] text-[#15803d] border border-[#bbf7d0] px-2 py-0.5 rounded-md font-bold font-heading">
                  RF-01
                </span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Alta directa en el sistema institucional con perfil homologado para registro de asistencias.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-2.5 py-1 rounded-lg border border-[#cbd5e1] text-[11px] font-semibold text-[#475569] hover:bg-[#eafaf1] hover:text-[#15803d] hover:border-[#bbf7d0] transition-colors flex items-center gap-1 cursor-pointer"
              title="Llenar con datos demo válidos"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#15803d]" />
              <span className="hidden sm:inline">Auto-Llenar Demo</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Bloque 1: Identificación y Nombres */}
          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3">
            <h4 className="font-bold text-[#1e293b] text-xs font-heading">
              1. Identificación del Aprendiz
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ej. Laura Valentina Gómez Ramos"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Tipo de Documento *
                </label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
                >
                  {TIPOS_DOCUMENTO.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Número de Documento *
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  required
                  placeholder="Ej. 1020495821"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] font-mono focus:outline-none focus:border-[#15803d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Género
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
                >
                  {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Ej. 3128491029"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] font-mono focus:outline-none focus:border-[#15803d]"
                />
              </div>
            </div>
          </div>

          {/* Bloque 2: Credenciales de Acceso */}
          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3">
            <h4 className="font-bold text-[#1e293b] text-xs font-heading">
              2. Credenciales y Notificación Institucional
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Correo Electrónico SENA *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ejemplo@sena.edu.co"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Contraseña Inicial *
                </label>
                <input
                  type="text"
                  name="password"
                  required
                  placeholder="Sena2026*"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] font-mono focus:outline-none focus:border-[#15803d]"
                />
              </div>
            </div>
          </div>

          {/* Bloque 3: Datos Académicos */}
          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3">
            <h4 className="font-bold text-[#1e293b] text-xs font-heading">
              3. Ficha y Programa de Formación
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Ficha / Grupo *
                </label>
                <input
                  type="text"
                  name="ficha"
                  required
                  placeholder="Ej. 2670192"
                  value={formData.ficha}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] font-mono focus:outline-none focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Modalidad
                </label>
                <select
                  name="modality"
                  value={formData.modality}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
                >
                  {MODALIDADES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Programa de Formación
              </label>
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
              >
                {PROGRAMAS_FORMACION.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Jornada
                </label>
                <select
                  name="jornada"
                  value={formData.jornada}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
                >
                  {JORNADAS.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Nivel de Formación
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
                >
                  {NIVELES_FORMACION.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#334155] mb-1">
                Centro de Formación
              </label>
              <select
                name="trainingCenter"
                value={formData.trainingCenter}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-white text-xs text-[#1e293b] focus:outline-none focus:border-[#15803d]"
              >
                {CENTROS_FORMACION.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Pie del modal */}
          <div className="pt-2 flex items-center justify-between border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#334155] hover:bg-[#f1f5f9] transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-primary px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Crear Aprendiz en Plataforma</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
