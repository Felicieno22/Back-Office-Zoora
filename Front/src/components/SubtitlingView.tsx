import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FilePlus, FileSearch, Plus, List } from 'lucide-react';
import { ThemedCard } from './ui/ThemedCard';
import { ThemedButton } from './ui/ThemedButton';
import { PageContainer } from './shared/SharedLayout';

export function SubtitlingView({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Créer un sous-titrage',
      description: 'Ajouter des sous-titres pour un contenu',
      icon: FilePlus,
      onClick: () => navigate('/admin/production/subtitles/create'),
      color: 'blue'
    },
    {
      title: 'Voir tous les sous-titres',
      description: 'Consulter la liste des sous-titrages',
      icon: FileSearch,
      onClick: () => navigate('/admin/production/subtitles/list'),
      color: 'green'
    }
  ];

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestion des Sous-titres</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les fichiers de sous-titres pour les contenus multimédias
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <div 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={action.onClick}
          >
            <ThemedCard moduleName="production">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-500`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                </div>
              </div>
            </ThemedCard>
          </div>
        ))}
      </div>

      <ThemedCard moduleName="production" title="À propos de la gestion de sous-titres" subtitle="Comment fonctionne cette section">
        <div className="prose max-w-none">
          <p>
            La gestion de sous-titres vous permet d'associer des fichiers de sous-titres 
            aux contenus multimédias pour améliorer l'accessibilité.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Ajoutez des sous-titres pour différentes langues</li>
            <li>Spécifiez les sous-titres comme "forcés" si nécessaire</li>
            <li>Associez les sous-titres à des contenus ou épisodes spécifiques</li>
            <li>Gérez les fichiers de sous-titres externes</li>
          </ul>
        </div>
      </ThemedCard>
    </PageContainer>
  );
}