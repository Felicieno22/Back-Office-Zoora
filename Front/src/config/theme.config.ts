// themeConfig.ts
// Configuration des thèmes Zoora – STRICTEMENT 3 COULEURS PAR MODULE

export interface ModuleColors {
  primary: string;          // Accent principal (boutons, focus, liens)
  secondary: string;        // Même que primary
  accent: string;           // Même que primary
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;       // Fond principal sombre
  surface: string;          // Cartes, surfaces
  text: string;             // Texte principal
  border: string;           // Bordures subtiles
  textSecondary?: string;   // Texte secondaire / muted
  // Nouvelles propriétés visuelles avancées
  gradient?: string;        // Gradient principal (ex: "from-blue-600 via-purple-600 to-pink-600")
  hoverScale?: string;      // Échelle au hover (ex: "hover:scale-105")
  iconGradient?: string;    // Gradient pour icônes (ex: "from-blue-600 to-blue-400")
  shadowIntensity?: string; // Intensité d'ombre (ex: "hover:shadow-xl")
  borderRadius?: string;    // Rayon de bordure (ex: "rounded-2xl")
  transitionDuration?: string; // Durée de transition (ex: "duration-300")
}

export interface FieldColors {
  label: string;
  input: string;
  inputBorder: string;
  inputFocus: string;
  placeholder: string;
  helper: string;
  error: string;
  disabled: string;
  // Nouvelles propriétés pour champs avancés
  inputGradient?: string;   // Gradient pour inputs spéciaux
  focusScale?: string;      // Échelle au focus
  focusShadow?: string;    // Ombre au focus
}

export interface ModuleTheme {
  name: string;
  colors: ModuleColors;
  fields: FieldColors;
}

// ────────────────────────────────────────────────
// Base fixe Zoora – 3 couleurs strictes
const ZOORA_BASE = {
  background: '#0F172A',      // Fond très sombre
  surface: '#0F172A',
  text: '#F1F5F9',            // Texte clair très lisible
  border: 'rgba(241, 245, 249, 0.18)',          // Bordure subtile
  textSecondary: 'rgba(241, 245, 249, 0.65)',
};

// ────────────────────────────────────────────────
// Configuration par module – TOUJOURS 3 couleurs maximum
export const themeConfig: Record<string, ModuleTheme> = {
  // Thème par défaut (Zoora global)
  default: {
    name: 'Zoora Default',
    colors: {
      ...ZOORA_BASE,
      primary: '#3B82F6',     // Bleu vif signature Zoora
      secondary: '#3B82F6',
      accent: '#3B82F6',
      success: '#3B82F6',
      warning: '#3B82F6',
      error: '#3B82F6',
      info: '#3B82F6',
      // Propriétés visuelles avancées
      gradient: 'from-blue-600 via-purple-600 to-pink-600',
      hoverScale: 'hover:scale-105',
      iconGradient: 'from-blue-600 to-blue-400',
      shadowIntensity: 'hover:shadow-xl',
      borderRadius: 'rounded-2xl',
      transitionDuration: 'duration-300',
    },
    fields: {
      label: '#F1F5F9',
      input: '#0F172A',
      inputBorder: 'rgba(241, 245, 249, 0.18)',
      inputFocus: '#3B82F6',
      placeholder: 'rgba(241, 245, 249, 0.45)',
      helper: 'rgba(241, 245, 249, 0.55)',
      error: '#3B82F6',
      disabled: 'rgba(241, 245, 249, 0.30)',
    },
  },

  // Films – même bleu Zoora
  films: {
    name: 'Films',
    colors: {
      ...ZOORA_BASE,
      primary: '#3B82F6',
      secondary: '#3B82F6',
      accent: '#3B82F6',
      success: '#3B82F6',
      warning: '#3B82F6',
      error: '#3B82F6',
      info: '#3B82F6',
      // Propriétés visuelles avancées
      gradient: 'from-blue-600 via-cyan-600 to-blue-500',
      hoverScale: 'hover:scale-105',
      iconGradient: 'from-blue-600 to-blue-400',
      shadowIntensity: 'hover:shadow-xl',
      borderRadius: 'rounded-2xl',
      transitionDuration: 'duration-300',
    },
    fields: {
      label: '#F1F5F9',
      input: '#0F172A',
      inputBorder: 'rgba(241, 245, 249, 0.18)',
      inputFocus: '#3B82F6',
      placeholder: 'rgba(241, 245, 249, 0.45)',
      helper: 'rgba(241, 245, 249, 0.55)',
      error: '#3B82F6',
      disabled: 'rgba(241, 245, 249, 0.30)',
      // Propriétés avancées pour champs
      focusScale: 'hover:scale-[1.02]',
      focusShadow: 'hover:shadow-lg',
    },
  },

  // Séries – violet très doux
  series: {
    name: 'Séries',
    colors: {
      ...ZOORA_BASE,
      primary: '#6366F1',
      secondary: '#6366F1',
      accent: '#6366F1',
      success: '#6366F1',
      warning: '#6366F1',
      error: '#6366F1',
      info: '#6366F1',
      // Propriétés visuelles avancées
      gradient: 'from-purple-600 via-pink-600 to-indigo-600',
      hoverScale: 'hover:scale-105',
      iconGradient: 'from-purple-600 to-purple-400',
      shadowIntensity: 'hover:shadow-xl',
      borderRadius: 'rounded-2xl',
      transitionDuration: 'duration-300',
    },
    fields: {
      label: '#F1F5F9',
      input: '#0F172A',
      inputBorder: 'rgba(241, 245, 249, 0.18)',
      inputFocus: '#6366F1',
      placeholder: 'rgba(241, 245, 249, 0.45)',
      helper: 'rgba(241, 245, 249, 0.55)',
      error: '#6366F1',
      disabled: 'rgba(241, 245, 249, 0.30)',
      // Propriétés avancées pour champs
      focusScale: 'hover:scale-[1.02]',
      focusShadow: 'hover:shadow-lg',
    },
  },

  // Genres – vert émeraude discret
  genre: {
    name: 'Genres',
    colors: {
      ...ZOORA_BASE,
      primary: '#10B981',
      secondary: '#10B981',
      accent: '#10B981',
      success: '#10B981',
      warning: '#10B981',
      error: '#10B981',
      info: '#10B981',
      // Propriétés visuelles avancées
      gradient: 'from-emerald-600 via-green-600 to-teal-600',
      hoverScale: 'hover:scale-105',
      iconGradient: 'from-emerald-600 to-emerald-400',
      shadowIntensity: 'hover:shadow-xl',
      borderRadius: 'rounded-2xl',
      transitionDuration: 'duration-300',
    },
    fields: {
      label: '#F1F5F9',
      input: '#0F172A',
      inputBorder: 'rgba(241, 245, 249, 0.18)',
      inputFocus: '#10B981',
      placeholder: 'rgba(241, 245, 249, 0.45)',
      helper: 'rgba(241, 245, 249, 0.55)',
      error: '#10B981',
      disabled: 'rgba(241, 245, 249, 0.30)',
      // Propriétés avancées pour champs
      focusScale: 'hover:scale-[1.02]',
      focusShadow: 'hover:shadow-lg',
    },
  },

  // Validation Admin – ambre/orange doux
  validation: {
    name: 'Validation Admin',
    colors: {
      ...ZOORA_BASE,
      primary: '#F59E0B',
      secondary: '#F59E0B',
      accent: '#F59E0B',
      success: '#F59E0B',
      warning: '#F59E0B',
      error: '#F59E0B',
      info: '#F59E0B',
      // Propriétés visuelles avancées
      gradient: 'from-amber-600 via-orange-600 to-yellow-600',
      hoverScale: 'hover:scale-105',
      iconGradient: 'from-amber-600 to-amber-400',
      shadowIntensity: 'hover:shadow-xl',
      borderRadius: 'rounded-2xl',
      transitionDuration: 'duration-300',
    },
    fields: {
      label: '#F1F5F9',
      input: '#0F172A',
      inputBorder: 'rgba(241, 245, 249, 0.18)',
      inputFocus: '#F59E0B',
      placeholder: 'rgba(241, 245, 249, 0.45)',
      helper: 'rgba(241, 245, 249, 0.55)',
      error: '#F59E0B',
      disabled: 'rgba(241, 245, 249, 0.30)',
      // Propriétés avancées pour champs
      focusScale: 'hover:scale-[1.02]',
      focusShadow: 'hover:shadow-lg',
    },
  },

  // Utilisateurs – indigo doux
  utilisateur: {
    name: 'Utilisateurs',
    colors: {
      ...ZOORA_BASE,
      primary: '#8B5CF6',
      secondary: '#8B5CF6',
      accent: '#8B5CF6',
      success: '#8B5CF6',
      warning: '#8B5CF6',
      error: '#8B5CF6',
      info: '#8B5CF6',
      // Propriétés visuelles avancées
      gradient: 'from-violet-600 via-purple-600 to-indigo-600',
      hoverScale: 'hover:scale-105',
      iconGradient: 'from-violet-600 to-violet-400',
      shadowIntensity: 'hover:shadow-xl',
      borderRadius: 'rounded-2xl',
      transitionDuration: 'duration-300',
    },
    fields: {
      label: '#F1F5F9',
      input: '#0F172A',
      inputBorder: 'rgba(241, 245, 249, 0.18)',
      inputFocus: '#8B5CF6',
      placeholder: 'rgba(241, 245, 249, 0.45)',
      helper: 'rgba(241, 245, 249, 0.55)',
      error: '#8B5CF6',
      disabled: 'rgba(241, 245, 249, 0.30)',
      // Propriétés avancées pour champs
      focusScale: 'hover:scale-[1.02]',
      focusShadow: 'hover:shadow-lg',
    },
  },

  // Production – ambre/orange doux
  production: {
    name: 'Production',
    colors: {
      ...ZOORA_BASE,
      primary: '#F59E0B',
      secondary: '#F59E0B',
      accent: '#F59E0B',
      success: '#F59E0B',
      warning: '#F59E0B',
      error: '#F59E0B',
      info: '#F59E0B',
      // Propriétés visuelles avancées
      gradient: 'from-orange-600 via-amber-600 to-yellow-600',
      hoverScale: 'hover:scale-105',
      iconGradient: 'from-orange-600 to-orange-400',
      shadowIntensity: 'hover:shadow-xl',
      borderRadius: 'rounded-2xl',
      transitionDuration: 'duration-300',
    },
    fields: {
      label: '#F1F5F9',
      input: '#0F172A',
      inputBorder: 'rgba(241, 245, 249, 0.18)',
      inputFocus: '#F59E0B',
      placeholder: 'rgba(241, 245, 249, 0.45)',
      helper: 'rgba(241, 245, 249, 0.55)',
      error: '#F59E0B',
      disabled: 'rgba(241, 245, 249, 0.30)',
      // Propriétés avancées pour champs
      focusScale: 'hover:scale-[1.02]',
      focusShadow: 'hover:shadow-lg',
    },
  },

  // Analyse – cyan discret
  analyse: {
    name: 'Analyse',
    colors: {
      ...ZOORA_BASE,
      primary: '#06B6D4',
      secondary: '#06B6D4',
      accent: '#06B6D4',
      success: '#06B6D4',
      warning: '#06B6D4',
      error: '#06B6D4',
      info: '#06B6D4',
      // Propriétés visuelles avancées
      gradient: 'from-cyan-600 via-blue-600 to-teal-600',
      hoverScale: 'hover:scale-105',
      iconGradient: 'from-cyan-600 to-cyan-400',
      shadowIntensity: 'hover:shadow-xl',
      borderRadius: 'rounded-2xl',
      transitionDuration: 'duration-300',
    },
    fields: {
      label: '#F1F5F9',
      input: '#0F172A',
      inputBorder: 'rgba(241, 245, 249, 0.18)',
      inputFocus: '#06B6D4',
      placeholder: 'rgba(241, 245, 249, 0.45)',
      helper: 'rgba(241, 245, 249, 0.55)',
      error: '#06B6D4',
      disabled: 'rgba(241, 245, 249, 0.30)',
      // Propriétés avancées pour champs
      focusScale: 'hover:scale-[1.02]',
      focusShadow: 'hover:shadow-lg',
    },
  },
};

// ────────────────────────────────────────────────
// Hook pour récupérer le thème d’un module avec fallback
export const useModuleTheme = (moduleName: string): ModuleTheme => {
  // Tous les modules inconnus → thème Zoora default
  return themeConfig[moduleName] || themeConfig.default;
};

// ────────────────────────────────────────────────
// Accès rapide aux couleurs et champs
export const getModuleColors = (moduleName: string): ModuleColors =>
  useModuleTheme(moduleName).colors;

export const getFieldColors = (moduleName: string): FieldColors =>
  useModuleTheme(moduleName).fields;

// ────────────────────────────────────────────────
// Classes CSS réutilisables (variables CSS pour rester dans les 3 couleurs)
export const getModuleClasses = () => ({
  label: `text-sm font-bold transition-colors duration-200 mb-1.5 text-[var(--text)]`,
  input: `w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200 outline-none bg-[var(--input)] border-[var(--inputBorder)] focus:border-[var(--inputFocus)] text-[var(--text)]`,
  error: `text-[11px] mt-1 font-bold tracking-tight text-[var(--error)]`,
  helper: `text-[11px] mt-1 opacity-80 font-medium text-[var(--helper)]`,
  card: `rounded-xl border-2 transition-all duration-300 shadow-sm bg-[var(--surface)] border-[var(--border)]`,
  button: `px-6 py-2.5 rounded-lg font-bold text-white transition-all active:scale-95 shadow-md flex items-center justify-center bg-[var(--primary)] hover:bg-[var(--primary)]/90`,
});