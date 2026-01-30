import React from 'react';
import { ThemedCard } from '../ui/ThemedCard';
import { ThemedButton } from '../ui/ThemedButton';
import { ThemedField } from '../ui/ThemedField';
import { ThemedIcon } from '../ui/ThemedIcon';
import { Film, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

// Exemple d'utilisation des composants thématiques avancés
export const AdvancedThemedExample: React.FC<{ moduleName: string }> = ({ moduleName }) => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold mb-6">Exemple de Design Avancé - Module: {moduleName}</h2>
      
      {/* Carte avec effets hover avancés */}
      <ThemedCard 
        moduleName={moduleName} 
        title="Carte Moderne" 
        subtitle="Avec gradients et effets hover"
        hoverable={true}
        useAdvancedHover={true}
        className="overflow-hidden"
      >
        <div className="space-y-4">
          <p className="text-sm opacity-80">
            Cette carte utilise les nouvelles propriétés visuelles du thème :
            gradients, effets de scale, ombres avancées et bordures modernes.
          </p>
          
          {/* Icône avec fond gradient */}
          <div className="flex items-center gap-4">
            <ThemedIcon 
              moduleName={moduleName} 
              icon={Film} 
              size="lg" 
              variant="gradient"
              useHover={true}
            />
            <div>
              <h3 className="font-semibold">Icône Thématique</h3>
              <p className="text-sm opacity-70">Avec fond gradient et effet hover</p>
            </div>
          </div>
        </div>
      </ThemedCard>

      {/* Boutons avec gradients */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ThemedButton 
          moduleName={moduleName}
          variant="primary"
          useGradient={true}
          useHoverScale={true}
          useAdvancedShadow={true}
          icon={<Plus className="w-4 h-4" />}
        >
          Nouveau
        </ThemedButton>
        
        <ThemedButton 
          moduleName={moduleName}
          variant="secondary"
          useGradient={true}
          useHoverScale={true}
          useAdvancedShadow={true}
          icon={<Edit className="w-4 h-4" />}
        >
          Modifier
        </ThemedButton>
        
        <ThemedButton 
          moduleName={moduleName}
          variant="error"
          useGradient={true}
          useHoverScale={true}
          useAdvancedShadow={true}
          icon={<Trash2 className="w-4 h-4" />}
        >
          Supprimer
        </ThemedButton>
      </div>

      {/* Champs avec effets focus avancés */}
      <ThemedCard 
        moduleName={moduleName} 
        title="Champs de Formulaire Avancés"
        useAdvancedHover={true}
      >
        <div className="space-y-4">
          <ThemedField
            moduleName={moduleName}
            label="Recherche avec icône"
            type="text"
            placeholder="Rechercher un film..."
            icon={Search}
            useAdvancedFocus={true}
            useModernBorder={true}
          />
          
          <ThemedField
            moduleName={moduleName}
            label="Email"
            type="email"
            placeholder="exemple@email.com"
            useAdvancedFocus={true}
            useModernBorder={true}
            helper="Utilisez votre email professionnel"
          />
          
          <ThemedField
            moduleName={moduleName}
            label="Description"
            type="textarea"
            placeholder="Décrivez le contenu..."
            rows={3}
            useAdvancedFocus={true}
            useModernBorder={true}
          />
        </div>
      </ThemedCard>

      {/* Grille d'icônes thématiques */}
      <ThemedCard 
        moduleName={moduleName} 
        title="Icônes Thématiques"
        useAdvancedHover={true}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <ThemedIcon moduleName={moduleName} icon={Film} size="lg" variant="gradient" />
            <p className="text-xs font-medium">Films</p>
          </div>
          <div className="text-center space-y-2">
            <ThemedIcon moduleName={moduleName} icon={Search} size="lg" variant="gradient" />
            <p className="text-xs font-medium">Recherche</p>
          </div>
          <div className="text-center space-y-2">
            <ThemedIcon moduleName={moduleName} icon={Edit} size="lg" variant="gradient" />
            <p className="text-xs font-medium">Édition</p>
          </div>
          <div className="text-center space-y-2">
            <ThemedIcon moduleName={moduleName} icon={Eye} size="lg" variant="gradient" />
            <p className="text-xs font-medium">Aperçu</p>
          </div>
        </div>
      </ThemedCard>
    </div>
  );
};

export default AdvancedThemedExample;
