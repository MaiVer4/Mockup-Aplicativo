import React, { useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

/**
 * MaintenanceView - Estilo "Sin Conexión a Internet"
 * Pantalla completa sobria y directa inspirada en las pantallas de "Sin Conexión"
 * de los navegadores modernos, con animación fluida de búsqueda de señal.
 *
 * @param {Function} onClose - Callback opcional para volver a la app durante pruebas.
 */
export default function MaintenanceView({ onClose }) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleRetry = () => {
    setIsRetrying(true);
    setStatusMessage('Comprobando conexión con el servidor...');

    setTimeout(() => {
      setIsRetrying(false);
      setStatusMessage('El servidor sigue en mantenimiento. Intenta de nuevo en unos momentos.');
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between items-center px-6 py-12 relative overflow-hidden select-none">
      {/* Fondo ambiental tenue */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-800/20 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Espacio superior */}
      <div className="w-full max-w-md flex justify-center">
        <span className="text-[11px] font-mono tracking-wider uppercase text-slate-600">
          EventFlow • Servicio Fuera de Línea
        </span>
      </div>

      {/* Bloque Central: Icono Offline Animado + Mensaje */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto my-auto">
        
        {/* ============================================================
            ANIMACIÓN ESTILO "SIN CONEXIÓN":
            Icono WifiOff con ondas de búsqueda de señal pulsantes a 60 FPS
           ============================================================ */}
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center" aria-hidden="true">
          {/* Ondas pulsantes de señal buscando conexión */}
          <div className="absolute inset-0 rounded-full border border-slate-700/40 animate-signal-ping" />
          <div className="absolute inset-2 rounded-full border border-slate-600/30 animate-signal-ping-delayed" />

          {/* Caja contenedora del icono */}
          <div className="relative z-10 w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl shadow-black/40 animate-float-subtle">
            <WifiOff className="w-9 h-9 text-slate-400 stroke-[1.75]" />
          </div>
        </div>

        {/* Título Mandatorio */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-2.5">
          Plataforma en mantenimiento
        </h1>

        {/* Mensaje estilo error de conexión */}
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
          No es posible conectar con el servidor en este momento. Estamos realizando labores de mantenimiento programado.
        </p>

        {/* Código de error estilo navegador (ERR_DISCONNECTED) */}
        <div className="px-3 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-500 font-mono text-xs mb-8">
          ERR_PLATFORM_UNDER_MAINTENANCE
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium text-sm transition-all duration-150 disabled:opacity-60 shadow-lg shadow-indigo-600/25"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Buscando señal...' : 'Reintentar conexión'}</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-mono transition-colors"
            >
              Volver a la aplicación
            </button>
          )}
        </div>

        {/* Feedback interactivo de reintento */}
        {statusMessage && (
          <p className="mt-4 text-xs font-mono text-amber-400/90 animate-fadeIn">
            {statusMessage}
          </p>
        )}
      </div>

      {/* Pie de página sutil estilo navegador */}
      <div className="w-full max-w-md text-center text-xs text-slate-600 font-mono">
        Comprueba tu conexión o espera a que finalicen las tareas técnicas.
      </div>
    </div>
  );
}
