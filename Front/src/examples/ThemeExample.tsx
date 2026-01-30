import React, { useState } from 'react';
import ThemedField from '../components/ui/ThemedField';
import ThemedButton from '../components/ui/ThemedButton';
import ThemedCard from '../components/ui/ThemedCard';
import { useThemeStyles } from '../hooks/useThemeStyles';

const ThemeExample: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState('films');
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    genre: '',
    date: '',
  });

  const themeStyles = useThemeStyles(selectedModule);

  const modules = [
    { value: 'films', label: '🎬 Films' },
    { value: 'series', label: '📺 Séries' },
    { value: 'genre', label: '🎭 Genres' },
    { value: 'validation', label: '✅ Validation' },
    { value: 'carrousels', label: '🎠 Carrousels' },
    { value: 'utilisateur', label: '👤 Utilisateurs' },
    { value: 'production', label: '🎥 Production' },
    { value: 'analyse', label: '📊 Analyse' },
  ];

  const genreOptions = [
    { value: 'action', label: 'Action' },
    { value: 'comedy', label: 'Comédie' },
    { value: 'drama', label: 'Drame' },
    { value: 'horror', label: 'Horreur' },
    { value: 'sci-fi', label: 'Science-Fiction' },
  ];

  return (
    <div style={themeStyles.containerStyles} className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div style={themeStyles.headerStyles} className="rounded-lg">
          <h1 className="text-2xl font-bold mb-2">🎨 Système de Thèmes Zoora</h1>
          <p className="opacity-90">Configuration des couleurs par module</p>
        </div>

        {/* Sélecteur de Module */}
        <ThemedCard
          moduleName={selectedModule}
          title="Sélection du Module"
          subtitle="Choisissez un module pour voir son thème"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modules.map((module) => (
              <ThemedButton
                key={module.value}
                moduleName="films"
                variant={selectedModule === module.value ? 'primary' : 'secondary'}
                onClick={() => setSelectedModule(module.value)}
                className="w-full"
              >
                {module.label}
              </ThemedButton>
            ))}
          </div>
        </ThemedCard>

        {/* Formulaire d'Exemple */}
        <div className="grid md:grid-cols-2 gap-8">
          <ThemedCard
            moduleName={selectedModule}
            title="Formulaire Thémé"
            subtitle="Champs avec le thème du module sélectionné"
          >
            <div className="space-y-4">
              <ThemedField
                moduleName={selectedModule}
                label="Titre"
                value={formData.titre}
                onChange={(value) => setFormData({ ...formData, titre: value })}
                placeholder="Entrez le titre..."
                helper="Le titre principal du contenu"
              />

              <ThemedField
                moduleName={selectedModule}
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Description détaillée..."
                helper="Décrivez le contenu en détail"
              />

              <ThemedField
                moduleName={selectedModule}
                label="Genre"
                type="select"
                value={formData.genre}
                onChange={(value) => setFormData({ ...formData, genre: value })}
                options={genreOptions}
                helper="Sélectionnez le genre approprié"
              />

              <ThemedField
                moduleName={selectedModule}
                label="Date de sortie"
                type="date"
                value={formData.date}
                onChange={(value) => setFormData({ ...formData, date: value })}
                helper="Date de publication prévue"
              />

              <div className="flex gap-2 pt-4">
                <ThemedButton
                  moduleName={selectedModule}
                  variant="primary"
                  type="submit"
                >
                  Enregistrer
                </ThemedButton>
                
                <ThemedButton
                  moduleName={selectedModule}
                  variant="secondary"
                  onClick={() => setFormData({ titre: '', description: '', genre: '', date: '' })}
                >
                  Réinitialiser
                </ThemedButton>
              </div>
            </div>
          </ThemedCard>

          {/* Palette de Couleurs */}
          <ThemedCard
            moduleName={selectedModule}
            title="Palette de Couleurs"
            subtitle="Couleurs du thème actuel"
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2" style={{ color: themeStyles.theme.colors.primary }}>
                  Couleurs Principales
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(themeStyles.theme.colors).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: value }}
                      />
                      <span className="text-sm capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2" style={{ color: themeStyles.theme.colors.primary }}>
                  Couleurs des Champs
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(themeStyles.theme.fields).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: value }}
                      />
                      <span className="text-sm capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ThemedCard>
        </div>

        {/* Boutons Variants */}
        <ThemedCard
          moduleName={selectedModule}
          title="Variants de Boutons"
          subtitle="Différents styles de boutons avec le thème"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ThemedButton moduleName={selectedModule} variant="primary">
              Primary
            </ThemedButton>
            <ThemedButton moduleName={selectedModule} variant="secondary">
              Secondary
            </ThemedButton>
            <ThemedButton moduleName={selectedModule} variant="accent">
              Accent
            </ThemedButton>
            <ThemedButton moduleName={selectedModule} variant="success">
              Success
            </ThemedButton>
            <ThemedButton moduleName={selectedModule} variant="warning">
              Warning
            </ThemedButton>
            <ThemedButton moduleName={selectedModule} variant="error">
              Error
            </ThemedButton>
            <ThemedButton moduleName={selectedModule} variant="info">
              Info
            </ThemedButton>
            <ThemedButton moduleName={selectedModule} variant="primary" disabled>
              Disabled
            </ThemedButton>
          </div>
        </ThemedCard>

        {/* Informations du Module */}
        <ThemedCard
          moduleName={selectedModule}
          title="Informations du Module"
          subtitle="Détails du thème actuel"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2" style={{ color: themeStyles.theme.colors.primary }}>
                Configuration
              </h4>
              <div className="space-y-1 text-sm">
                <p><strong>Nom:</strong> {themeStyles.theme.name}</p>
                <p><strong>Module:</strong> {selectedModule}</p>
                <p><strong>Couleur Primaire:</strong> {themeStyles.theme.colors.primary}</p>
                <p><strong>Couleur Secondaire:</strong> {themeStyles.theme.colors.secondary}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2" style={{ color: themeStyles.theme.colors.primary }}>
                Classes CSS Disponibles
              </h4>
              <div className="space-y-1 text-xs font-mono">
                <p>text-[{themeStyles.theme.colors.primary}]</p>
                <p>bg-[{themeStyles.theme.colors.primary}]</p>
                <p>border-[{themeStyles.theme.colors.primary}]</p>
                <p>focus:border-[{themeStyles.theme.fields.inputFocus}]</p>
              </div>
            </div>
          </div>
        </ThemedCard>
      </div>
    </div>
  );
};

export default ThemeExample;
