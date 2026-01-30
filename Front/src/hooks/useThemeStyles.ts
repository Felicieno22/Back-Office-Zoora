import { useMemo } from 'react';
import { useModuleTheme, generateCSSVariables, getModuleClasses } from '../config/theme.config';

export const useThemeStyles = (moduleName: string) => {
  const theme = useModuleTheme(moduleName);
  const classes = getModuleClasses(moduleName);

  const cssVariables = useMemo(() => {
    return generateCSSVariables(moduleName);
  }, [moduleName]);

  const inlineStyles = useMemo(() => {
    return {
      // Variables CSS pour l'élément racine
      '--module-primary': theme.colors.primary,
      '--module-secondary': theme.colors.secondary,
      '--module-accent': theme.colors.accent,
      '--module-success': theme.colors.success,
      '--module-warning': theme.colors.warning,
      '--module-error': theme.colors.error,
      '--module-info': theme.colors.info,
      '--module-background': theme.colors.background,
      '--module-surface': theme.colors.surface,
      '--module-text': theme.colors.text,
      '--module-border': theme.colors.border,
      
      // Variables pour les champs
      '--field-label': theme.fields.label,
      '--field-input': theme.fields.input,
      '--field-input-border': theme.fields.inputBorder,
      '--field-input-focus': theme.fields.inputFocus,
      '--field-placeholder': theme.fields.placeholder,
      '--field-helper': theme.fields.helper,
      '--field-error': theme.fields.error,
      '--field-disabled': theme.fields.disabled,
    } as React.CSSProperties;
  }, [theme]);

  const containerStyles = useMemo(() => ({
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    minHeight: '100vh',
    ...inlineStyles,
  }), [theme, inlineStyles]);

  const cardStyles = useMemo(() => ({
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  }), [theme]);

  const headerStyles = useMemo(() => ({
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    padding: '1rem',
    borderBottom: `2px solid ${theme.colors.secondary}`,
  }), [theme]);

  const sidebarStyles = useMemo(() => ({
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: '1px',
    borderStyle: 'solid',
  }), [theme]);

  return {
    theme,
    classes,
    cssVariables,
    inlineStyles,
    containerStyles,
    cardStyles,
    headerStyles,
    sidebarStyles,
    
    // Utilitaires pour les styles dynamiques
    getColor: (colorName: keyof typeof theme.colors) => theme.colors[colorName],
    getFieldColor: (colorName: keyof typeof theme.fields) => theme.fields[colorName],
    
    // Classes CSS prêtes à utiliser
    getButtonClass: (variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' = 'primary') => {
      return classes[variant];
    },
    
    getFieldClass: (type: 'label' | 'input' | 'placeholder' | 'helper' | 'error' | 'disabled' = 'input') => {
      return classes[type];
    },
  };
};

export default useThemeStyles;
