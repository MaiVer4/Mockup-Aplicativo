import React from 'react';
import { Inbox, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * EmptyState: Componente estándar para estados vacíos y de error en todos los módulos.
 * Sigue la regla better-ui de escala en active, óptima legibilidad y jerarquía institucional.
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No hay datos disponibles',
  description = 'No se encontraron elementos para el criterio o filtro seleccionado.',
  actionLabel = null,
  onAction = null,
  isError = false,
  className = ''
}) {
  return (
    <div 
      className={`p-8 sm:p-12 text-center rounded-2xl border transition-all flex flex-col items-center justify-center space-y-3 ${
        isError
          ? 'bg-rose-50/70 border-rose-200 text-rose-900'
          : 'bg-white border-[#e2e8f0] text-[#1e293b]'
      } ${className}`}
    >
      <div 
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
          isError 
            ? 'bg-rose-100 text-rose-600' 
            : 'bg-[#f1f5f9] text-[#64748b]'
        }`}
      >
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>

      <div className="max-w-sm space-y-1">
        <h4 className="text-sm font-bold font-heading">
          {title}
        </h4>
        <p className={`text-xs leading-relaxed ${isError ? 'text-rose-700' : 'text-[#64748b]'}`}>
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.96] ${
            isError
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
              : 'bg-[#0e2738] hover:bg-[#1e293b] text-white shadow-xs'
          }`}
        >
          {isError && <RefreshCw className="w-3.5 h-3.5" />}
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
