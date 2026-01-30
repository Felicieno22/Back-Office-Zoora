import React from 'react';
import { useModuleTheme } from '../../config/theme.config';

interface ThemedCardProps {
  moduleName: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  bordered?: boolean;
  hoverable?: boolean;
  // Nouvelles propriétés pour design avancé
  useGradient?: boolean;    // Activer les gradients de fond
  useAdvancedHover?: boolean; // Activer les effets hover avancés
  useModernBorder?: boolean; // Activer les bordures modernes
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  moduleName,
  children,
  title,
  subtitle,
  className = '',
  padding = 'md',
  bordered = true,
  hoverable = false,
  useGradient = false,    // Désactivé par défaut pour éviter les conflits
  useAdvancedHover = true, // Activé par défaut
  useModernBorder = true, // Activé par défaut
}) => {
  const theme = useModuleTheme(moduleName);

  // Gestion des espacements (Padding)
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Style de base avec propriétés avancées
  const borderRadiusClass = theme.colors.borderRadius || 'rounded-lg';
  const transitionClass = theme.colors.transitionDuration || 'duration-200';
  const hoverScaleClass = useAdvancedHover && theme.colors.hoverScale ? theme.colors.hoverScale : '';
  const shadowClass = useAdvancedHover && theme.colors.shadowIntensity ? theme.colors.shadowIntensity : 'hover:shadow-lg';
  const gradientClass = useGradient && theme.colors.gradient ? `bg-gradient-to-br ${theme.colors.gradient}` : '';
  
  const baseClasses = `
    ${borderRadiusClass} transition-all ${transitionClass}
    ${paddingClasses[padding]}
    ${bordered ? 'border-2' : ''}
    ${hoverable ? `${hoverScaleClass} ${shadowClass}` : ''}
    ${gradientClass}
    ${className}
  `;

  // Styles dynamiques via l'attribut style
  const cardStyle: React.CSSProperties = {
    backgroundColor: useGradient ? undefined : theme.colors.background,
    borderColor: bordered ? theme.colors.border : 'transparent',
    color: theme.colors.text,
    boxShadow: useAdvancedHover 
      ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  return (
    <div className={baseClasses} style={cardStyle}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 
              className="text-lg font-semibold mb-1"
              style={{ color: theme.colors.text }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p 
              className="text-sm"
              style={{ color: theme.colors.textSecondary || theme.colors.text }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div>
        {children}
      </div>
    </div>
  );
};

export default ThemedCard;