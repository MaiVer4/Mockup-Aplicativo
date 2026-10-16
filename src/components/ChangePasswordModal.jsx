import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, KeyRound, Eye, EyeOff, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { currentUser, changeUserPassword } = useApp();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage('Por favor completa todos los campos.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage('La nueva contraseña debe ser diferente a la contraseña actual.');
      return;
    }

    const res = changeUserPassword(currentPassword, newPassword);
    if (res.success) {
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }, 1500);
    } else {
      setErrorMessage(res.message || 'Error al actualizar la contraseña.');
    }
  };

  const handleClose = () => {
    setErrorMessage('');
    setSuccessMessage(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0e2738]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-[#e2e8f0] w-full max-w-md overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15803d] text-white flex items-center justify-center shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e293b] font-heading">
                Cambiar Contraseña
              </h3>
              <p className="text-[11px] text-[#64748b]">
                Actualiza tu clave de acceso institucional
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
          
          {/* Alerta de Error */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Alerta de Éxito */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">¡Contraseña modificada con éxito! Cerrando...</span>
            </div>
          )}

          {/* Información institucional del usuario */}
          <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-between text-[11px] text-[#166534]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803d] shrink-0" />
              <span>Usuario: <strong>{currentUser?.email}</strong></span>
            </div>
            <span className="font-mono text-[10px] font-bold bg-[#eafaf1] text-[#15803d] px-2 py-0.5 rounded">
              {currentUser?.shortRole || 'Encargado'}
            </span>
          </div>

          {/* Campo: Contraseña Actual */}
          <div>
            <label className="block text-[11px] font-bold text-[#334155] mb-1">
              Contraseña Actual *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                placeholder="Ingresa tu clave actual o provisional"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] font-mono focus:bg-white focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-[#94a3b8] hover:text-[#1e293b]"
                tabIndex={-1}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Campo: Nueva Contraseña */}
          <div>
            <label className="block text-[11px] font-bold text-[#334155] mb-1">
              Nueva Contraseña *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
              <input
                type={showNew ? 'text' : 'password'}
                required
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] font-mono focus:bg-white focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-[#94a3b8] hover:text-[#1e293b]"
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Campo: Confirmar Nueva Contraseña */}
          <div>
            <label className="block text-[11px] font-bold text-[#334155] mb-1">
              Confirmar Nueva Contraseña *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                placeholder="Repite la nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] font-mono focus:bg-white focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-[#94a3b8] hover:text-[#1e293b]"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={successMessage}
              className="btn btn-primary text-xs font-bold"
            >
              Actualizar Contraseña
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
