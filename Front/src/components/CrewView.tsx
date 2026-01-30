import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Briefcase, Plus, List } from 'lucide-react';
import { ThemedCard } from './ui/ThemedCard';
import { ThemedButton } from './ui/ThemedButton';
import { PageContainer } from './shared/SharedLayout';

export function CrewView({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Créer une personne',
      description: 'Ajouter un nouveau membre à l\'équipe',
      icon: UserPlus,
      onClick: () => navigate('/admin/production/personne/create'),
      color: 'blue'
    },
    {
      title: 'Créer une participation',
      description: 'Associer une personne à un contenu',
      icon: Briefcase,
      onClick: () => navigate('/admin/production/participation/create'),
      color: 'green'
    },
    {
      title: 'Voir toutes les participations',
      description: 'Consulter la liste des participations',
      icon: List,
      onClick: () => navigate('/admin/production/participation/list'),
      color: 'purple'
    }
  ];

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestion de l'Équipage & Casting</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les membres de l'équipe et leurs participations aux projets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <ThemedCard moduleName="production" title="À propos de la gestion d'équipage" subtitle="Comment fonctionne cette section">
        <div className="prose max-w-none">
          <p>
            La gestion d'équipage vous permet de maintenir un annuaire des membres de votre équipe 
            et de suivre leurs participations aux différents projets de production.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Créez des profils pour chaque membre de l'équipe</li>
            <li>Associez les personnes aux contenus selon leur rôle</li>
            <li>Suivez les attributions et responsabilités</li>
          </ul>
        </div>
      </ThemedCard>
    </PageContainer>
  );
}