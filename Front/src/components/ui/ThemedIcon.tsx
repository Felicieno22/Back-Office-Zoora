import React from 'react';
import { useModuleTheme } from '../../config/theme.config';
import { LucideIcon } from 'lucide-react';

interface ThemedIconProps {
  moduleName: string;
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient' | 'solid';
  className?: string;
  onClick?: () => void;
  title?: string;
  useHover?: boolean;
}

export const ThemedIcon: React.FC<ThemedIconProps> = ({
  moduleName,
  icon: Icon,
  size = 'md',
  variant = 'gradient',
  className = '',
  onClick,
  title,
  useHover = true,
}) => {
  const theme = useModuleTheme(moduleName);
  
  // Tailles des icônes et conteneurs
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6' },
    lg: { container: 'w-14 h-14', icon: 'w-7 h-7' },
    xl: { container: 'w-16 h-16', icon: 'w-8 h-8' },
  };

  const currentSize = sizes[size];
  const borderRadiusClass = theme.colors.borderRadius || 'rounded-xl';
  const transitionClass = theme.colors.transitionDuration || 'duration-300';
  const hoverScaleClass = useHover && theme.colors.hoverScale ? theme.colors.hoverScale : '';

  // Classes selon la variante
  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return `bg-gradient-to-br ${theme.colors.iconGradient || theme.colors.gradient || 'from-blue-600 to-blue-400'}`;
      case 'solid':
        return '';
      default:
        return `bg-gradient-to-br ${theme.colors.iconGradient || theme.colors.gradient || 'from-blue-600 to-blue-400'}`;
    }
  };

  const containerClasses = `
    ${currentSize.container} ${borderRadiusClass}
    flex items-center justify-center
    transition-all ${transitionClass}
    ${hoverScaleClass}
    ${useHover ? 'cursor-pointer' : ''}
    ${getVariantClasses()}
    ${className}
  `;

  const iconElement = (
    <div className={containerClasses} onClick={onClick} title={title}>
      <Icon className={`${currentSize.icon} text-white`} />
    </div>
  );

  return iconElement;
};

export default ThemedIcon;
