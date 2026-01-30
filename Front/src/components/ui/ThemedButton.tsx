import React from 'react';
import { useModuleTheme, getModuleClasses } from '../../config/theme.config';

interface ThemedButtonProps {
  moduleName: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  // Nouvelles propriétés pour design avancé
  useGradient?: boolean;    // Activer les gradients
  useHoverScale?: boolean;  // Activer l'effet de scale au hover
  useAdvancedShadow?: boolean; // Activer les ombres avancées
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  moduleName,
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  icon,
  title,
  useGradient = true,     // Activer les gradients par défaut
  useHoverScale = true,   // Activer le scale au hover par défaut
  useAdvancedShadow = true, // Activer les ombres avancées par défaut
}) => {
  const theme = useModuleTheme(moduleName);
  const classes = getModuleClasses();

  // Tailles standardisées
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  // On récupère la couleur exacte selon la variante choisie
  const buttonColor = theme.colors[variant] || theme.colors.primary;
  
  // Classes CSS dynamiques basées sur le thème
  const gradientClass = useGradient && theme.colors.gradient ? `bg-gradient-to-r ${theme.colors.gradient}` : '';
  const hoverScaleClass = useHoverScale && theme.colors.hoverScale ? theme.colors.hoverScale : '';
  const shadowClass = useAdvancedShadow && theme.colors.shadowIntensity ? theme.colors.shadowIntensity : 'hover:shadow-md';
  const borderRadiusClass = theme.colors.borderRadius || 'rounded-lg';
  const transitionClass = theme.colors.transitionDuration || 'duration-200';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      style={{ 
        // Utiliser le gradient si activé, sinon la couleur unie
        ...(useGradient ? {} : { backgroundColor: buttonColor, borderColor: buttonColor })
      }}
      className={`
        inline-flex items-center justify-center font-bold border-2 text-white
        ${borderRadiusClass}
        ${gradientClass}
        ${hoverScaleClass}
        ${shadowClass}
        transition-all ${transitionClass}
        active:scale-95 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        icon && <span className="mr-2 inline-flex items-center">{icon}</span>
      )}
      
      <span className="truncate">{children}</span>
    </button>
  );
};

export default ThemedButton;