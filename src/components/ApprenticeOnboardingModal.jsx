import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  UserCheck, 
  BookOpen, 
  Building2, 
  IdCard,
  Phone,
  Mail
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

export default function ApprenticeOnboardingModal() {
  const { currentUser, updateApprenticeProfile, quickFillApprenticeProfile } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    personalEmail: currentUser.personalEmail || currentUser.email || '',
    email: currentUser.email || '',
    documentType: currentUser.documentType || 'Cédula de Ciudadanía (CC)',
    documentNumber: currentUser.documentNumber || currentUser.username || '',
    gender: currentUser.gender || 'Femenino',
    ficha: currentUser.ficha || '2670192',
    modality: currentUser.modality || 'Presencial',
    program: currentUser.program || PROGRAMAS_FORMACION[0],
    jornada: currentUser.jornada || 'Diurna',
    level: currentUser.level || 'Tecnólogo',
    trainingCenter: currentUser.trainingCenter || CENTROS_FORMACION[0],
    phone: currentUser.phone || '3128491029'
  });

  // Solo se muestra si el usuario actual es un Aprendiz con perfil incompleto (RF-APR-02, RF-APR-08)
  if (currentUser.role !== 'aprendiz' || currentUser.isProfileComplete) {
    return null;
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.documentNumber || !formData.ficha || !formData.personalEmail) {
      return;
    }
    updateApprenticeProfile(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Cabecera institucional de bloqueo */}
        <div className="p-5 border-b border-zinc-200 bg-amber-50/70">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-bold uppercase">
                  REGISTRO OBLIGATORIO // PRIMER INGRESO
                </span>
                <span className="text-[10px] text-amber-700 font-medium">Bloqueo de Primer Ingreso</span>
              </div>
              <h2 className="text-base font-bold text-zinc-950 mt-1">
                Completa tu Perfil Institucional SENA
              </h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                Para garantizar la validez legal del registro de asistencia y la firma temporal inmutable, debes diligenciar tus datos oficiales antes de acceder a la cartelera.
              </p>
            </div>
          </div>
        </div>

        {/* Formulario de los 12 campos normativos */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nombres y Apellidos */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Nombres y Apellidos *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre completo"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-zinc-900"
              />
            </div>

            {/* Correo Personal (Obligatorio) */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Correo Personal (Obligatorio) *
              </label>
              <input
                type="email"
                name="personalEmail"
                required
                value={formData.personalEmail}
                onChange={handleChange}
                placeholder="ejemplo@gmail.com"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-zinc-900"
              />
            </div>

            {/* Correo Institucional Misena (Opcional) */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Correo Institucional Misena (Opcional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="usuario@misena.edu.co"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-zinc-900"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Teléfono de Contacto *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="3101234567"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-zinc-900"
              />
            </div>

            {/* Tipo de Documento */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Tipo de Documento *
              </label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900"
              >
                {TIPOS_DOCUMENTO.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Número de Documento (Cédula) */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Número de Documento (Cédula) *
              </label>
              <input
                type="text"
                name="documentNumber"
                required
                value={formData.documentNumber}
                onChange={handleChange}
                placeholder="1014238910"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-zinc-900"
              />
            </div>

            {/* Género */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Género *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900"
              >
                {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Número de Ficha o Grupo */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Número de Ficha o Grupo *
              </label>
              <input
                type="text"
                name="ficha"
                required
                value={formData.ficha}
                onChange={handleChange}
                placeholder="Ej. 2670192"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-zinc-900 font-mono font-medium"
              />
            </div>

            {/* Modalidad de Formación */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Modalidad de Formación *
              </label>
              <select
                name="modality"
                value={formData.modality}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900"
              >
                {MODALIDADES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Jornada */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Jornada *
              </label>
              <select
                name="jornada"
                value={formData.jornada}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900"
              >
                {JORNADAS.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>

            {/* Nivel de Formación */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Nivel de Formación *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900"
              >
                {NIVELES_FORMACION.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Programa de Formación */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Programa de Formación *
              </label>
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900"
              >
                {PROGRAMAS_FORMACION.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Centro de Formación */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Centro de Formación / Sede *
              </label>
              <select
                name="trainingCenter"
                value={formData.trainingCenter}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:border-zinc-900"
              >
                {CENTROS_FORMACION.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={quickFillApprenticeProfile}
              className="btn-tactile text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-lg inline-flex items-center gap-1.5 font-medium transition-colors w-full sm:w-auto justify-center"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autocompletar con Datos de Prueba SENA</span>
            </button>

            <button
              type="submit"
              className="btn-tactile text-xs bg-zinc-950 text-white hover:bg-zinc-800 px-5 py-2 rounded-lg font-medium inline-flex items-center gap-2 shadow-xs transition-colors w-full sm:w-auto justify-center"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Guardar Perfil y Desbloquear Cartelera</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
