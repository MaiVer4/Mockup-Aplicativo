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
  EyeOff,
  Shield,
  User,
  Users,
  UserPlus,
  Building2,
  BookOpen,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import FlowStepper from '../components/FlowStepper';
import {
  AREAS,
  TIPOS_DOCUMENTO,
  GENEROS,
  MODALIDADES,
  JORNADAS,
  NIVELES_FORMACION,
  PROGRAMAS_FORMACION,
  CENTROS_FORMACION
} from '../data/mockData';

export default function LoginView() {
  const {
    users,
    login,
    loginWithGoogle,
    loginWithDemoUser,
    registerNewApprentice,
    registerEncargadoViaToken,
    changeUserPassword,
    triggerSimulatedEmail,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register_aprendiz' | 'recovery'
  const [selectedDemoRole, setSelectedDemoRole] = useState('admin_general'); // 'admin_general' | 'admin_area' | 'aprendiz' | 'aprendiz_nuevo'

  // Estados para formulario de login clásico
  const [usernameOrDoc, setUsernameOrDoc] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estados para recuperación de contraseña en 4 etapas
  const [recoveryStep, setRecoveryStep] = useState(0); // 0: Solicitud, 1: Verificación, 2: Nueva Clave, 3: Listo
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Estados para registro nuevo de aprendiz (RF-APR-01 a RF-APR-08)
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    personalEmail: '',
    documentType: 'Cédula de Ciudadanía (CC)',
    documentNumber: '',
    gender: 'Femenino',
    ficha: '',
    modality: 'Presencial',
    program: PROGRAMAS_FORMACION[0] || 'Análisis y Desarrollo de Software (ADSO)',
    jornada: 'Diurna',
    level: 'Tecnólogo',
    trainingCenter: CENTROS_FORMACION[0] || 'SENA Centro de Comercio y Turismo Armenia Quindio',
    phone: '',
    password: '',
    confirmPassword: ''
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

  // Manejar Login con Google (para usuarios ya registrados / Sofia)
  const handleGoogleLogin = (demoUser = null) => {
    loginWithGoogle(demoUser);
  };

  // Manejar Registro con Google (conduce directo al onboarding de 12 campos como nuevo aprendiz)
  const handleRegisterWithGoogle = () => {
    const googleUser = users.find(u => u.id === 'user_aprendiz_nuevo') || users[3];
    loginWithGoogle(googleUser);
    addToast(
      'Google OAuth Autorizado',
      'Acceso con cuenta Google concedido. Completa los 12 datos institucionales para habilitar tu cartelera.',
      'info'
    );
  };

  // Llenar campos de prueba rápidamente para evaluadores
  const handleQuickFillRegister = () => {
    setRegisterData({
      name: 'Carlos Eduardo Ramírez',
      email: 'carlos.ramirez@misena.edu.co',
      personalEmail: 'carlos.edu.ramirez@gmail.com',
      documentType: 'Cédula de Ciudadanía (CC)',
      documentNumber: '1039482910',
      gender: 'Masculino',
      ficha: '2670192',
      modality: 'Presencial',
      program: 'Análisis y Desarrollo de Software (ADSO)',
      jornada: 'Diurna',
      level: 'Tecnólogo',
      trainingCenter: CENTROS_FORMACION[0] || 'SENA Centro de Comercio y Turismo Armenia Quindio',
      phone: '3148920194',
      password: 'Sena2026*',
      confirmPassword: 'Sena2026*'
    });
  };

  const recoverySteps = [
    { id: 'request', label: 'Solicitud', description: 'Correo o Cédula', icon: Mail },
    { id: 'code', label: 'Código', description: 'Verificación', icon: KeyRound },
    { id: 'password', label: 'Nueva Clave', description: 'Seguridad', icon: Lock },
    { id: 'complete', label: 'Listo', description: 'Confirmado', icon: CheckCircle2 }
  ];

  // 1. Enviar Código de Recuperación
  const handleRequestRecoveryCode = (e) => {
    e.preventDefault();
    setRecoveryError('');
    const idVal = recoveryIdentifier.trim();
    if (!idVal) {
      setRecoveryError('Por favor ingresa tu número de documento o correo institucional.');
      return;
    }

    triggerSimulatedEmail({
      to: idVal.includes('@') ? idVal : `${idVal}@misena.edu.co`,
      subject: '[SENA Bienestar] Código de Restablecimiento: SENA-8492',
      body: `Has solicitado restablecer tu contraseña. Tu código temporal de seguridad es: SENA-8492. Válido por 15 minutos en el sistema institucional.`,
      type: 'recuperacion'
    });

    setRecoveryStep(1);
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    addToast(
      'Código de Seguridad Emitido',
      `Se envió el código SENA-8492 a ${idVal}. Revisa el buzón de notificaciones en la barra superior.`,
      'info'
    );
  };

  // 2. Validar Código de Seguridad
  const handleVerifyRecoveryCode = (e) => {
    e.preventDefault();
    setRecoveryError('');
    const codeClean = recoveryCode.trim().toUpperCase().replace(/\s+/g, '');
    if (!codeClean) {
      setRecoveryError('Ingresa el código de seguridad recibido.');
      return;
    }

    if (codeClean === 'SENA-8492' || codeClean === '8492' || codeClean.length >= 4) {
      setRecoveryStep(2);
      addToast('Código Verificado', 'Identidad comprobada. Ahora define tu nueva contraseña.', 'success');
    } else {
      setRecoveryError('Código inválido. Puedes usar el código de prueba "SENA-8492".');
    }
  };

  // 3. Establecer Nueva Contraseña
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setRecoveryError('');

    if (newPassword.length < 6) {
      setRecoveryError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setRecoveryError('Las contraseñas no coinciden. Verifica ambos campos.');
      return;
    }

    // Buscar si existe un usuario con ese documento o correo para actualizarlo en el contexto
    const cleanId = recoveryIdentifier.trim().toLowerCase();
    const matchingUser = users.find(u =>
      (u.documentNumber && u.documentNumber.toLowerCase() === cleanId) ||
      (u.username && u.username.toLowerCase() === cleanId) ||
      (u.email && u.email.toLowerCase() === cleanId)
    );

    if (matchingUser && changeUserPassword) {
      changeUserPassword(matchingUser.id, newPassword);
    }

    setRecoveryStep(3);
    addToast('Contraseña Actualizada', 'Tu nueva contraseña ha sido guardada en la base institucional.', 'success');
  };

  // 4. Finalizar y Volver al Login
  const handleFinishRecovery = () => {
    setUsernameOrDoc(recoveryIdentifier);
    setPassword(newPassword);
    setRecoveryStep(0);
    setRecoveryCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setRecoveryError('');
    setActiveTab('login');
  };

  // Manejar Registro de Aprendiz
  const handleApprenticeRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      addToast('Error en Contraseña', 'Las contraseñas no coinciden.', 'warning');
      return;
    }

    if (!registerData.documentNumber || !registerData.ficha || !(registerData.email || registerData.personalEmail)) {
      addToast('Campos Incompletos', 'Por favor diligencia un correo electrónico y todos los campos obligatorios (*).', 'warning');
      return;
    }

    const res = registerNewApprentice(registerData);
    if (!res.success) {
      addToast('Registro Fallido', res.message, 'warning');
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

        {/* Panel Izquierdo: Banner Institucional Compacto en móviles/tablets (<lg), Completo en desktop (≥lg) */}
        <div className="relative bg-gradient-to-br from-[#0c2f3a] via-[#103a46] to-[#08242e] text-white p-5 sm:p-8 lg:p-12 flex flex-col justify-between overflow-hidden">

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

          {/* Copy Central con Manrope y Micro-Acentos - Visible en pantallas grandes */}
          <div className="relative z-10 my-auto py-8 max-w-lg hidden lg:block">
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

          {/* Footer Izquierdo - Visible en desktop */}
          <div className="relative z-10 hidden lg:flex items-center justify-between text-xs text-[#8baabf] pt-4 border-t border-white/10">
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
                {activeTab === 'register_aprendiz' ? 'Registro de Aprendiz' : 'Inicia sesión'}
              </h2>
              <p className="text-xs text-[#64748b] mt-1">
                {activeTab === 'register_aprendiz'
                  ? 'Crea tu cuenta institucional mediante Google o completando el formulario normativo.'
                  : 'Ingresa con tu cuenta de Google institucional o con tu número de documento.'}
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
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${selectedDemoRole === 'admin_general'
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
                        Supervisión integral de las 6 áreas y reporte consolidado
                      </small>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#15803d] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                {/* Opción 2: Encargada de Cultura */}
                <button
                  type="button"
                  onClick={() => handleSelectDemo('admin_area', 'user_enc_cultura')}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${selectedDemoRole === 'admin_area'
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
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${selectedDemoRole === 'aprendiz'
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
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${selectedDemoRole === 'aprendiz_nuevo'
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
                  type="button"
                  onClick={() => { setActiveTab('login'); setLoginError(''); }}
                  className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${activeTab === 'login'
                    ? 'border-[#15803d] text-[#15803d] font-bold'
                    : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
                    }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Iniciar Sesión</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register_aprendiz'); setLoginError(''); }}
                  className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${activeTab === 'register_aprendiz'
                    ? 'border-[#15803d] text-[#15803d] font-bold'
                    : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
                    }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Registrarse</span>
                </button>
              </div>

              {/* TAB 1: INICIAR SESIÓN */}
              {activeTab === 'login' && (
                <div className="pt-4 space-y-3.5">

                  {/* Botón Google OAuth - Modo Iniciar Sesión (Cuentas Existentes) */}
                  <button
                    type="button"
                    onClick={() => handleGoogleLogin(users.find(u => u.id === 'user_aprendiz_sofia') || users[2])}
                    className="w-full py-3 px-4 rounded-xl border border-[#cbd5e1] bg-white hover:bg-[#f8fafc] text-[#1e293b] font-semibold text-xs flex items-center justify-between gap-3 transition-all shadow-2xs active:scale-[0.96] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white border border-[#e2e8f0] flex items-center justify-center shrink-0 shadow-2xs">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block text-xs font-bold text-[#1e293b]">Google</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#15803d] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  <div className="flex items-center my-2">
                    <div className="flex-1 border-t border-[#e2e8f0]" />
                    <span className="px-3 text-[10px] text-[#64748b] uppercase font-mono">O con documento y contraseña</span>
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
                          placeholder="Ej. 1020495821 o sofia.castillo@misena.edu.co"
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

              {/* TAB 2: REGISTRARSE (EXCLUSIVO APRENDICES) */}
              {activeTab === 'register_aprendiz' && (
                <div className="pt-3.5 space-y-3.5">
                  {/* Banner Exclusivo Aprendiz */}
                  <div className="p-2.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-between text-xs text-[#166534]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#15803d] shrink-0" />
                      <span className="font-semibold text-[11px]">Registro oficial para Aprendices SENA</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleQuickFillRegister}
                      className="text-[10px] font-bold text-[#15803d] hover:underline bg-white px-2 py-0.5 rounded border border-[#bbf7d0]"
                      title="Llena los campos con datos válidos de prueba"
                    >
                      Llenar Demo
                    </button>
                  </div>

                  {/* Método 1: Registrarse mediante Google (Destacado para Nuevos Aprendices) */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#f0fdf4] via-white to-[#ecfdf5] border-2 border-[#86efac] shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#15803d] text-white text-[10px] font-bold tracking-wide">
                        <Sparkles className="w-3 h-3" />
                        NUEVO APRENDIZ
                      </span>
                      <span className="text-[11px] font-semibold text-[#166534]">Paso Rápido 1 de 2</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleRegisterWithGoogle}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-[#16a34a] hover:bg-[#f0fdf4] text-[#14532d] font-bold text-xs flex items-center justify-between gap-2.5 transition-all shadow-xs active:scale-[0.96] group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                        </div>
                        <span className="text-xs font-bold text-[#15803d]">Google</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#15803d] group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>

                    <p className="text-[10px] text-[#475569] leading-tight">
                      Autentica tu correo y el asistente te guiará de inmediato en el registro de tus 12 datos institucionales normativos.
                    </p>
                  </div>

                  {/* Separador */}
                  <div className="flex items-center my-2">
                    <div className="flex-1 border-t border-[#e2e8f0]" />
                    <span className="px-3 text-[10px] text-[#64748b] uppercase font-mono">O diligencia el formulario completo</span>
                    <div className="flex-1 border-t border-[#e2e8f0]" />
                  </div>

                  {/* Método 2: Formulario Completo de Registro Normal */}
                  <form onSubmit={handleApprenticeRegisterSubmit} className="space-y-3">
                    <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3 custom-scrollbar text-xs">

                      {/* Sección 1: Identificación y Contacto */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider block border-b border-[#e2e8f0] pb-1">
                          1. Identificación y Contacto
                        </span>

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
                            <label className="block text-[11px] font-bold text-[#334155] mb-1">Tipo Documento</label>
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
                            <label className="block text-[11px] font-bold text-[#334155] mb-1">Correo electrónico *</label>
                            <input
                              type="email"
                              required={!registerData.personalEmail}
                              placeholder="andres@correo.com"
                              value={registerData.email}
                              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-[#334155] mb-1">Correo SENA (opcional)</label>
                            <input
                              type="email"
                              required={!registerData.email}
                              placeholder="andres@misena.edu.co"
                              value={registerData.personalEmail}
                              onChange={(e) => setRegisterData({ ...registerData, personalEmail: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-[#334155] mb-1">Teléfono *</label>
                            <input
                              type="tel"
                              required
                              placeholder="3128491029"
                              value={registerData.phone}
                              onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-[#334155] mb-1">Género</label>
                            <select
                              value={registerData.gender}
                              onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                              className="w-full px-2 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                            >
                              {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Sección 2: Información Académica SENA */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider block border-b border-[#e2e8f0] pb-1">
                          2. Información Académica SENA
                        </span>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-[#334155] mb-1">Ficha *</label>
                            <input
                              type="text"
                              required
                              placeholder="2670192"
                              value={registerData.ficha}
                              onChange={(e) => setRegisterData({ ...registerData, ficha: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-[#334155] mb-1">Modalidad</label>
                            <select
                              value={registerData.modality}
                              onChange={(e) => setRegisterData({ ...registerData, modality: e.target.value })}
                              className="w-full px-2 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                            >
                              {MODALIDADES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#334155] mb-1">Programa de Formación *</label>
                          <select
                            value={registerData.program}
                            onChange={(e) => setRegisterData({ ...registerData, program: e.target.value })}
                            className="w-full px-2 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                          >
                            {PROGRAMAS_FORMACION.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-[#334155] mb-1">Jornada</label>
                            <select
                              value={registerData.jornada}
                              onChange={(e) => setRegisterData({ ...registerData, jornada: e.target.value })}
                              className="w-full px-2 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                            >
                              {JORNADAS.map(j => <option key={j} value={j}>{j}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-[#334155] mb-1">Nivel de Formación</label>
                            <select
                              value={registerData.level}
                              onChange={(e) => setRegisterData({ ...registerData, level: e.target.value })}
                              className="w-full px-2 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                            >
                              {NIVELES_FORMACION.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#334155] mb-1">Centro de Formación *</label>
                          <select
                            value={registerData.trainingCenter}
                            onChange={(e) => setRegisterData({ ...registerData, trainingCenter: e.target.value })}
                            className="w-full px-2 py-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs text-[#1e293b] focus:bg-white focus:outline-none"
                          >
                            {CENTROS_FORMACION.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Sección 3: Contraseña */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider block border-b border-[#e2e8f0] pb-1">
                          3. Contraseña de Acceso
                        </span>

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
                      </div>

                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2 shadow-xs"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Crear Cuenta de Aprendiz</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: RECUPERACIÓN DE CONTRASEÑA (FLUJO VISUAL DE 4 ETAPAS) */}
              {activeTab === 'recovery' && (
                <div className="pt-4 space-y-4">

                  {/* Encabezado e Indicador de Pasos FlowStepper */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-[#15803d]" />
                        <span className="text-xs font-bold text-[#1e293b]">Recuperación de Contraseña</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('login'); setRecoveryStep(0); setRecoveryError(''); }}
                        className="text-[11px] font-bold text-[#64748b] hover:text-[#1e293b] hover:underline"
                      >
                        Cancelar y volver
                      </button>
                    </div>

                    <FlowStepper
                      steps={recoverySteps}
                      currentStep={recoveryStep}
                      variant="pills"
                    />
                  </div>

                  {/* Mensaje de error general si aplica */}
                  {recoveryError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{recoveryError}</span>
                    </div>
                  )}

                  {/* ETAPA 1: Solicitud de Código */}
                  {recoveryStep === 0 && (
                    <form onSubmit={handleRequestRecoveryCode} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">
                          Número de Documento o Correo Institucional *
                        </label>
                        <div className="relative">
                          <IdCard className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            placeholder="Ej. 1020495821 o usuario@misena.edu.co"
                            value={recoveryIdentifier}
                            onChange={(e) => setRecoveryIdentifier(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
                          />
                        </div>
                        <p className="text-[10px] text-[#64748b] mt-1.5 leading-relaxed">
                          Ingresa el documento registrado en SOFIA Plus / Bienestar o tu correo oficial para recibir el código de verificación temporal.
                        </p>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => { setActiveTab('login'); }}
                          className="btn btn-secondary flex-1 py-2.5 rounded-xl text-xs"
                        >
                          Volver al Inicio
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.96]"
                        >
                          <span>Enviar Código</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ETAPA 2: Verificación de Código de Seguridad */}
                  {recoveryStep === 1 && (
                    <form onSubmit={handleVerifyRecoveryCode} className="space-y-3.5">
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5 text-[11px]">
                            <Mail className="w-3.5 h-3.5 text-amber-700" />
                            Código emitido a {recoveryIdentifier}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setRecoveryCode('SENA-8492');
                              addToast('Código Copiado', 'Código de prueba SENA-8492 ingresado.', 'info');
                            }}
                            className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded border border-amber-300 transition-colors"
                          >
                            Usar Demo: SENA-8492
                          </button>
                        </div>
                        <p className="text-[10px] text-amber-800 leading-tight">
                          Revisa el correo o el buzón global de la aplicación. Tu código tiene una vigencia de 15 minutos.
                        </p>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">
                          Código de Seguridad (6 Caracteres) *
                        </label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            placeholder="SENA-8492"
                            value={recoveryCode}
                            onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-mono font-bold tracking-wider bg-[#f8fafc] text-[#1e293b] focus:bg-white focus:outline-none focus:border-[#15803d]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                        <span>¿No recibiste el mensaje?</span>
                        <button
                          type="button"
                          disabled={resendCooldown > 0}
                          onClick={handleRequestRecoveryCode}
                          className="font-bold text-[#15803d] disabled:text-[#94a3b8] hover:underline transition-colors"
                        >
                          {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar código'}
                        </button>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setRecoveryStep(0)}
                          className="btn btn-secondary flex-1 py-2.5 rounded-xl text-xs"
                        >
                          Atrás
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.96]"
                        >
                          <span>Validar Código</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ETAPA 3: Nueva Contraseña */}
                  {recoveryStep === 2 && (
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">
                          Nueva Contraseña Institucional *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            placeholder="Mínimo 6 caracteres"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] font-mono focus:bg-white focus:outline-none focus:border-[#15803d]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-3 text-[#64748b] hover:text-[#1e293b]"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#334155] mb-1">
                          Confirmar Nueva Contraseña *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            placeholder="Repite la contraseña"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] text-[#1e293b] font-mono focus:bg-white focus:outline-none focus:border-[#15803d]"
                          />
                        </div>
                      </div>

                      {/* Medidor visual de seguridad */}
                      <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-1.5 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${newPassword.length >= 6 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={newPassword.length >= 6 ? 'text-emerald-700 font-semibold' : 'text-[#64748b]'}>
                            Al menos 6 caracteres
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${newPassword && newPassword === confirmNewPassword ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={newPassword && newPassword === confirmNewPassword ? 'text-emerald-700 font-semibold' : 'text-[#64748b]'}>
                            Las contraseñas coinciden
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setRecoveryStep(1)}
                          className="btn btn-secondary flex-1 py-2.5 rounded-xl text-xs"
                        >
                          Atrás
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.96]"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Actualizar Contraseña</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ETAPA 4: Confirmación y Éxito */}
                  {recoveryStep === 3 && (
                    <div className="p-5 rounded-2xl bg-[#f0fdf4] border border-[#86efac] text-[#14532d] space-y-3.5 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#15803d] text-white flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#14532d]">¡Contraseña Actualizada con Éxito!</h3>
                        <p className="text-xs text-[#166534] mt-1 leading-relaxed">
                          La clave institucional de tu cuenta ha sido renovada. Hemos precargado tus datos para que ingreses inmediatamente.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleFinishRecovery}
                        className="btn btn-primary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.96]"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Iniciar Sesión Ahora</span>
                      </button>
                    </div>
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
