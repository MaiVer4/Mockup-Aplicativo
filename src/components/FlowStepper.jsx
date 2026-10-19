import React from 'react';
import { Check } from 'lucide-react';

/**
 * FlowStepper: Componente reutilizable para visualizar etapas en flujos largos.
 * Soporta modo horizontal responsivo con badges numéricos, estados completado/activo/pendiente
 * y micro-interacciones pulidas conforme a better-ui y front-interface.
 */
export default function FlowStepper({ steps = [], currentStep = 0, onStepClick = null, className = '' }) {
  if (!steps || steps.length === 0) return null;

  return (
    <nav aria-label="Progreso del flujo" className={`w-full py-2.5 ${className}`}>
      <ol className="flex items-center justify-between w-full relative">
        {/* Barra de progreso de fondo */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#e2e8f0] -z-0 pointer-events-none" />
        
        {/* Barra de progreso activa */}
        <div 
          className="absolute top-4 left-6 h-0.5 bg-[#15803d] -z-0 transition-all duration-300 ease-out pointer-events-none"
          style={{
            width: `${(Math.min(currentStep, steps.length - 1) / (steps.length - 1)) * 100}%`
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isPending = idx > currentStep;
          const isClickable = onStepClick && isCompleted;

          const StepIcon = step.icon;

          return (
            <li 
              key={step.id || idx} 
              className="flex-1 flex flex-col items-center relative z-10 group"
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(idx)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-150 ${
                  isCompleted
                    ? 'bg-[#15803d] text-white shadow-xs cursor-pointer active:scale-[0.96]'
                    : isCurrent
                    ? 'bg-[#0e2738] text-[#c4f246] border-2 border-[#15803d] ring-4 ring-[#15803d]/20 shadow-sm'
                    : 'bg-white text-[#94a3b8] border-2 border-[#cbd5e1] cursor-default'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                ) : StepIcon ? (
                  <StepIcon className="w-4 h-4" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </button>

              <div className="mt-1.5 text-center px-1">
                <span 
                  className={`block text-[11px] leading-tight transition-colors ${
                    isCurrent
                      ? 'font-bold text-[#0e2738]'
                      : isCompleted
                      ? 'font-semibold text-[#15803d]'
                      : 'text-[#64748b] font-medium'
                  }`}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="hidden sm:block text-[9px] text-[#94a3b8] mt-0.5 line-clamp-1">
                    {step.description}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
