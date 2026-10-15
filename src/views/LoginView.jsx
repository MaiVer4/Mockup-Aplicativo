import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  IdCard, 
  Mail, 
  Phone, 
  KeyRound,
  LogIn,
  Eye,
  Shield,
  User,
  Users
} from 'lucide-react';
import { AREAS, TIPOS_DOCUMENTO, PROGRAMAS_FORMACION, CENTROS_FORMACION } from '../data/mockData';

export default function LoginView() {
  const { 
    users, 
    login, 
    loginWithGoogle, 
    loginWithDemoUser, 
    registerNewApprentice, 
    registerEncargadoViaToken,
    triggerSimulatedEmail,
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register_aprendiz' | 'token_encargado' | 'recovery'
  const [selectedDemoRole, setSelectedDemoRole] = useState('admin_general'); // 'admin_general' | 'admin_area' | 'aprendiz' | 'aprendiz_nuevo'

  // Estados para formulario de login clásico
  const [usernameOrDoc, setUsernameOrDoc] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estados para recuperación de contraseña
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // Estados para registro nuevo de aprendiz
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    personalEmail: '',
    documentType: 'Cédula de Ciudadanía (CC)',
    documentNumber: '',
    password: '',
    confirmPassword: ''
  });

  // Estados para registro de encargado con token exclusivo
  const [tokenInput, setTokenInput] = useState('');
  const [encargadoRegisterData, setEncargadoRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    area: 'Cultura'
  });

  // Manejar Login Clásico
  const handleClassicLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!usernameOrDoc.trim() || !password.trim()) {
      setLoginError('Por favor ingresa tu número de documento o correo y contraseña.');
      return;
    }

    const result = login(usernameOrDoc.trim(), password.trim());
    if (!result.success) {
      setLoginError(result.message || 'Credenciales incorrectas. Verifica tu número de documento o correo y contraseña.');
    }
  };

  // Manejar Login con Google
  const handleGoogleLogin = (demoUser = null) => {
    loginWithGoogle(demoUser);
  };

  // Manejar Recuperación de Contraseña
  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;

    triggerSimulatedEmail({
      to: recoveryEmail.trim(),
      subject: '[SENA Bienestar] Restablecimiento de Contraseña',
      body: 'Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace de seguridad para ingresar tu nueva clave temporal: https://bienestar.sena.edu.co/reset-password?token=TEMP-9842',
      type: 'recuperacion'
    });

    setRecoverySuccess(true);
    addToast('Correo de Recuperación Enviado', `Se enviaron instrucciones a ${recoveryEmail}.`, 'success');
  };

  // Manejar Registro de Aprendiz
  const handleApprenticeRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      addToast('Error en Contraseña', 'Las contraseñas no coinciden.', 'warning');
      return;
    }

    const res = registerNewApprentice(registerData);
    if (!res.success) {
      addToast('Registro Fallido', res.message, 'warning');
    }
  };

  // Manejar Registro de Encargado con Enlace Exclusivo
  const handleEncargadoTokenSubmit = (e) => {
    e.preventDefault();
    const res = registerEncargadoViaToken(tokenInput, encargadoRegisterData);
    if (!res.success) {
      addToast('Token Inválido', res.message, 'warning');
    }
  };

  const handleSelectDemo = (roleKey, userId) => {
    setSelectedDemoRole(roleKey);
    loginWithDemoUser(userId);
  };

  return (
    <div className="min-h-screen bg-[#edf2f7] py-6 sm:py-12 px-3 sm:px-6 flex items-center justify-center antialiased">
      
      {/* Contenedor Unificado Ergonómico Anti-Fatiga */}
      <div className="w-full max-w-6xl bg-white rounded-3xl border border-[#cbd5e1] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        
        {/* Panel Izquierdo: Visual Orgánico en Verde Petróleo Calmante (no negro puro) */}
        <div className="relative bg-gradient-to-br from-[#0c2f3a] via-[#103a46] to-[#08242e] text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden min-h-[440px] lg:min-h-full">
          
          {/* Cabecera Superior Izquierda */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="logo-wrap">
              <div className="logo-mark logo-dark">
                <span>S</span>
              </div>
              <div className="logo-type text-white">
                <strong>Bienestar SENA</strong>
                <small className="text-[#c4f246]">Gestión y Acreditación</small>
              </div>
            </div>
            <span className="text-xs text-[#a2bdce] font-medium hidden sm:inline-block">
              Regional D.C. • C.E.E.T.
            </span>
          </div>

          {/* Copy Central con Manrope y Micro-Acentos */}
          <div className="relative z-10 my-auto py-8 max-w-lg">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-[11px] font-bold text-[#c4f246] tracking-wide mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SISTEMA INSTITUCIONAL DE BIENESTAR</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight font-heading text-white">
              Convierte información<br />
              <span className="text-[#c4f246]">en experiencias.</span>
            </h1>
            
            <p className="mt-4 text-[#bfd3df] text-sm md:text-base leading-relaxed">
              Centraliza la programación trimestral, automatiza la ingesta de actividades y acredita la asistencia de la comunidad educativa de forma ágil y transparente.
            </p>

            {/* Tarjeta Informativa de Confianza */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/15">
              <div className="flex -space-x-2">
                <span className="w-8 h-8 rounded-full bg-[#15803d] text-white border-2 border-[#103a46] flex items-center justify-center font-bold text-[10px]">SA</span>
                <span className="w-8 h-8 rounded-full bg-[#0284c7] text-white border-2 border-[#103a46] flex items-center justify-center font-bold text-[10px]">LM</span>
                <span className="w-8 h-8 rounded-full bg-[#ea580c] text-white border-2 border-[#103a46] flex items-center justify-center font-bold text-[10px]">CR</span>
                <span className="w-8 h-8 rounded-full bg-[#0f2935] text-[#c4f246] border-2 border-[#103a46] flex items-center justify-center font-bold text-[9px]">+2.4k</span>
              </div>
              <div>
                <strong className="block text-sm text-white font-heading font-bold">+2.400</strong>
                <small className="text-[#9cb7c7] text-xs">aprendices conectados y acreditados</small>
              </div>
            </div>
          </div>

          {/* Footer Izquierdo */}
          <div className="relative z-10 flex items-center justify-between text-xs text-[#8baabf] pt-4 border-t border-white/10">
            <span>Dirección de Formación Profesional</span>
            <span>Versión 2026.10</span>
          </div>

          {/* Decoraciones visuales atenuadas para no cansar la vista */}
          <div className="visual-orb orb-one" />
          <div className="visual-orb orb-two" />
          <div className="visual-grid" />
        </div>

        {/* Panel Derecho: Superficie Ergonómica Suave (tonos cálidos, no blanco puro clínico) */}
        <div className="flex items-center justify-center p-6 sm:p-10 md:p-12 bg-[#ffffff]">
          <div className="w-full max-w-md space-y-6">
            
            {/* Encabezado del Formulario */}
            <div>
              <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#15803d] mb-1">
                ACCESO INSTITUCIONAL
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b] font-heading tracking-tight">
                Inicia sesión
              </h2>
              <p className="text-xs text-[#64748b] mt-1">
                Ingresa con tu perfil de demostración en 1 clic o digita tus credenciales.
              </p>
            </div>

            {/* Selector Rápido de Roles Ergonómico */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block">
                1. Acceso Rápido por Perfil (1 Clic)
              </span>
              <div className="grid grid-cols-1 gap-2">
                
                {/* Opción 1: Admin General */}
                <button
                  type="button"
                  onClick={() => handleSelectDemo('admin_general', 'user_admin_gen')}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                    selectedDemoRole === 'admin_general'
                      ? 'border-[#15803d] bg-[#f0fdf4] shadow-xs'
                      : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0e2738] text-[#c4f246] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs text-[#1e293b] font-heading font-bold">
                        Admin General (Coordinación)
                      </strong>
                      <small className="text-[#64748b] text-[11px]">
                        Supervisión de las 6 áreas y enlaces de invitación
                      </small>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#15803d] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                {/* Opción 2: Encargada de Cultura */}
                <button
                  type="button"
                  onClick={() => handleSelectDemo('admin_area', 'user_enc_cultura')}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                    selectedDemoRole === 'admin_area'
                      ? 'border-[#15803d] bg-[#f0fdf4] shadow-xs'
                      : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#fef3c7] text-[#b45309] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs text-[#1e293b] font-heading font-bold">
                        Admin de Área (Cultura)
                      </strong>
                      <small className="text-[#64748b] text-[11px]">
                        Carga Excel IA, ciclo de 4 estados y formato GOR-F-013
                      </small>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#15803d] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                {/* Opción 3: Aprendiz Sofia */}
                <button
                  type="button"
                  onClick={() => handleSelectDemo('aprendiz', 'user_aprendiz_sofia')}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                    selectedDemoRole === 'aprendiz'
                      ? 'border-[#15803d] bg-[#f0fdf4] shadow-xs'
                      : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#0369a1] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs text-[#1e293b] font-heading font-bold">
                        Aprendiz SENA (Sofia Arango)
                      </strong>
                      <small className="text-[#64748b] text-[11px]">
                        Cartelera de actividades y acreditación presencial en 1 clic
                      </small>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#15803d] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                {/* Opción 4: Aprendiz Nuevo (Prueba Onboarding) */}
                <button
                  type="button"
                  onClick={() => handleSelectDemo('aprendiz_nuevo', 'user_aprendiz_nuevo')}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                    selectedDemoRole === 'aprendiz_nuevo'
                      ? 'border-[#15803d] bg-[#f0fdf4] shadow-xs'
                      : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ffedd5] text-[#c2410c] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs text-[#1e293b] font-heading font-bold">
                        Aprendiz Nuevo (Sin Onboarding)
                      </strong>
                      <small className="text-[#64748b] text-[11px]">
                        Prueba el bloqueo de registro inicial de 12 campos
                      </small>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#15803d] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

              </div>
            </div>

            {/* Pestañas de Acceso / Registro */}
            <div className="pt-1">
              <div className="flex border-b border-[#e2e8f0] text-xs font-semibold">
                <button
                  onClick={() => { setActiveTab('login'); setLoginError(''); }}
                  className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                    activeTab === 'login'
                      ? 'border-[#15803d] text-[#15803d] font-bold'
                      : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  Credenciales
                </button>
                <button
                  onClick={() => { setActiveTab('register_aprendiz'); setLoginError(''); }}
                  className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                    activeTab === 'register_aprendiz'
                      ? 'border-[#15803d] text-[#15803d] font-bold'
                      : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  Nuevo Aprendiz
                </button>
                <button
                  onClick={() => { setActiveTab('token_encargado'); setLoginError(''); }}
                  className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                    activeTab === 'token_encargado'
                      ? 'border-[#15803d] text-[#15803d] font-bold'
                      : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
                  }`}
                >
                  Enlace Encargado
                </button>
              </div>

              {/* TAB 1: LOGIN CLÁSICO */}
              {activeTab === 'login' && (
                <div className="pt-4 space-y-3.5">
                  
                  {/* Botón Google OAuth */}
                  <button
                    type="button"
                    onClick={() => handleGoogleLogin(users[3])}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#cbd5e1] bg-white hover:bg-[#f8fafc] text-[#334155] font-semibold text-xs flex items-center justify-center gap-3 transition-colors shadow-2xs"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continuar con Cuenta Institucional Google</span>
                  </button>

                  <div className="flex items-center my-2">
                    <div className="flex-1 border-t border-[#e2e8f0]" />
                    <span className="px-3 text-[10px] text-[#64748b] uppercase font-mono">O con documento</span>
                    <div className="flex-1 border-t border-[#e2e8f0]" />
                  </div>

                  <form onSubmit={handleClassicLogin} className="space-y-3">
                    {loginError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-[#334155] mb-1">
                        Cédula / Documento o Correo SENA
                      </label>
                      <div className="relative">
                        <IdCard className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Ej. 1020495821 o carlos.mendoza@sena.edu.co"
                          value={usernameOrDoc}
                          onChange={(e) => setUsernameOrDoc(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-[#334155]">
                          Contraseña
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveTab('recovery')}
                          className="text-[11px] text-[#15803d] hover:underline font-bold"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <span>Ingresar a la Plataforma</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: REGISTRO APRENDIZ */}
              {activeTab === 'register_aprendiz' && (
                <div className="pt-4 space-y-3">
                  <form onSubmit={handleApprenticeRegisterSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#334155] mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Andrés Felipe Moreno"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">Tipo Doc.</label>
                        <select
                          value={registerData.documentType}
                          onChange={(e) => setRegisterData({ ...registerData, documentType: e.target.value })}
                          className="w-full px-2 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                        >
                          {TIPOS_DOCUMENTO.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">N° Documento *</label>
                        <input
                          type="text"
                          required
                          placeholder="1092837461"
                          value={registerData.documentNumber}
                          onChange={(e) => setRegisterData({ ...registerData, documentNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">Correo SENA *</label>
                        <input
                          type="email"
                          required
                          placeholder="andres@sena.edu.co"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">Correo Personal</label>
                        <input
                          type="email"
                          placeholder="andres@gmail.com"
                          value={registerData.personalEmail}
                          onChange={(e) => setRegisterData({ ...registerData, personalEmail: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">Contraseña *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] font-mono focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">Confirmar *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] font-mono focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <span>Crear Cuenta de Aprendiz</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: TOKEN ENCARGADO */}
              {activeTab === 'token_encargado' && (
                <div className="pt-4 space-y-3">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <strong>Registro Exclusivo de Encargado:</strong> Ingresa el token de invitación emitido por el Administrador General para vincular tu área asignada.
                  </div>

                  <form onSubmit={handleEncargadoTokenSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#334155] mb-1">Token de Invitación *</label>
                      <input
                        type="text"
                        required
                        placeholder="SENA-ENC-CULTURA-2026"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs font-mono font-bold text-[#1e293b] focus:bg-white focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#334155] mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Lic. Fernando Gómez"
                        value={encargadoRegisterData.name}
                        onChange={(e) => setEncargadoRegisterData({ ...encargadoRegisterData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#334155] mb-1">Correo SENA *</label>
                      <input
                        type="email"
                        required
                        placeholder="fernando.gomez@sena.edu.co"
                        value={encargadoRegisterData.email}
                        onChange={(e) => setEncargadoRegisterData({ ...encargadoRegisterData, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">Área Asignada</label>
                        <select
                          value={encargadoRegisterData.area}
                          onChange={(e) => setEncargadoRegisterData({ ...encargadoRegisterData, area: e.target.value })}
                          className="w-full px-2 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                        >
                          {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">Contraseña *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={encargadoRegisterData.password}
                          onChange={(e) => setEncargadoRegisterData({ ...encargadoRegisterData, password: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs font-mono text-[#1e293b] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-200" />
                      <span>Activar Cuenta de Encargado</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: RECUPERACIÓN */}
              {activeTab === 'recovery' && (
                <div className="pt-4 space-y-3">
                  {recoverySuccess ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Instrucciones Emitidas</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Revisa tu bandeja de entrada en <strong>{recoveryEmail}</strong> o el buzón de notificaciones automáticas en la barra superior.
                      </p>
                      <button
                        onClick={() => { setActiveTab('login'); setRecoverySuccess(false); }}
                        className="btn btn-sena px-3 py-1.5 rounded-lg text-xs font-bold transition-all mt-2"
                      >
                        Volver a Iniciar Sesión
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRecoverySubmit} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">
                          Correo Institucional o Personal Registrado
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="aprendiz@sena.edu.co"
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('login')}
                          className="btn btn-secondary flex-1 py-2 rounded-xl text-xs"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary flex-1 py-2 rounded-xl text-xs font-bold"
                        >
                          Enviar Enlace
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>

            {/* Nota de Demostración con contraste suave */}
            <div className="rounded-xl p-3 bg-[#f1f5f9] text-[#64748b] text-xs flex items-center gap-2.5 border border-[#e2e8f0]">
              <Sparkles className="w-4 h-4 text-[#15803d] shrink-0" />
              <span>Acceso de demostración institucional activo. No requieres credenciales externas.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
