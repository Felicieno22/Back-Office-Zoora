import React, { useState } from 'react';
import { getFieldColors, useModuleTheme } from '../../config/theme.config';
import { LucideIcon } from 'lucide-react';

interface ThemedFieldProps {
  moduleName: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'url';
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: LucideIcon;
  options?: { value: string; label: string; key?: string }[];
  className?: string;
  rows?: number;
  // Nouvelles propriétés pour design avancé
  useAdvancedFocus?: boolean; // Activer les effets de focus avancés
  useModernBorder?: boolean;  // Activer les bordures modernes
}

export const ThemedField: React.FC<ThemedFieldProps> = ({
  moduleName,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  helper,
  error,
  disabled = false,
  required = false,
  icon: Icon,
  options,
  className = '',
  rows = 4,
  useAdvancedFocus = true, // Activé par défaut
  useModernBorder = true,   // Activé par défaut
}) => {
  const theme = useModuleTheme(moduleName);
  const fieldColors = getFieldColors(moduleName);
  const [isFocused, setIsFocused] = useState(false);

  // Style dynamique pour l'input avec effets avancés
  const borderRadiusClass = theme.colors.borderRadius || 'rounded-lg';
  const transitionClass = theme.colors.transitionDuration || 'duration-200';
  const focusScaleClass = useAdvancedFocus && fieldColors.focusScale ? fieldColors.focusScale : '';
  const focusShadowClass = useAdvancedFocus && fieldColors.focusShadow ? fieldColors.focusShadow : 'hover:shadow-lg';
  
  const inputStyle: React.CSSProperties = {
    backgroundColor: fieldColors.input,
    color: 'inherit',
    borderColor: error 
      ? fieldColors.error 
      : (isFocused ? fieldColors.inputFocus : fieldColors.inputBorder),
    boxShadow: isFocused ? `0 0 0 3px ${fieldColors.inputFocus}25` : 'none',
  };

  const baseInputClasses = `
    w-full px-4 py-2.5 ${borderRadiusClass} border-2 transition-all ${transitionClass} outline-none
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-opacity-80'}
    ${focusScaleClass}
    ${focusShadowClass}
    ${Icon ? 'pl-11' : ''}
    ${className}
  `;

  const renderInput = () => {
    const commonProps = {
      value: value ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => 
        onChange?.(e.target.value),
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      disabled,
      placeholder,
      className: baseInputClasses,
      style: inputStyle,
    };

    if (type === 'select') {
      return (
        <select {...commonProps} className={`${baseInputClasses} appearance-none cursor-pointer`}>
          <option value="" disabled>{placeholder || `Sélectionner...`}</option>
          {options?.map((opt) => (
            <option key={opt.key || opt.value} value={opt.value} className="text-gray-900">{opt.label}</option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return <textarea {...commonProps} rows={rows} className={`${baseInputClasses} resize-none`} />;
    }

    return <input type={type} {...commonProps} />;
  };

  return (
    <div className="flex flex-col space-y-1.5 w-full group">
      {/* Label avec changement de couleur au focus */}
      <label 
        className="text-sm font-bold tracking-tight transition-colors duration-200 ml-1"
        style={{ color: isFocused ? fieldColors.inputFocus : fieldColors.label }}
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {/* Container de l'Input */}
      <div className="relative flex items-center">
        {Icon && (
          <div 
            className="absolute left-3.5 transition-colors duration-200 pointer-events-none z-10"
            style={{ color: isFocused ? fieldColors.inputFocus : fieldColors.placeholder }}
          >
            <Icon size={19} strokeWidth={2.5} />
          </div>
        )}
        
        {renderInput()}

        {/* Flèche personnalisée pour le select */}
        {type === 'select' && (
          <div className="absolute right-3 pointer-events-none opacity-50" style={{ color: fieldColors.label }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {/* Message d'erreur ou Helper text */}
      {(error || helper) && (
        <p 
          className="text-[11px] font-bold px-1 transition-all"
          style={{ color: error ? fieldColors.error : fieldColors.helper }}
        >
          {error || helper}
        </p>
      )}
    </div>
  );
};

export default ThemedField;