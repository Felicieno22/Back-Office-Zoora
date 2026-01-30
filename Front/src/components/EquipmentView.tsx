import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, PackagePlus, Tag, PackageCheck, Plus, List } from 'lucide-react';
import { ThemedCard } from './ui/ThemedCard';
import { ThemedButton } from './ui/ThemedButton';
import { PageContainer } from './shared/SharedLayout';

export function EquipmentView({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Créer un type de matériel',
      description: 'Définir un nouveau type d\'équipement',
      icon: Tag,
      onClick: () => navigate('/admin/production/material-type/create'),
      color: 'blue'
    },
    {
      title: 'Créer un matériel',
      description: 'Ajouter un nouvel équipement à l\'inventaire',
      icon: PackagePlus,
      onClick: () => navigate('/admin/production/material/create'),
      color: 'green'
    },
    {
      title: 'Utiliser un matériel',
      description: 'Enregistrer l\'utilisation d\'un équipement',
      icon: PackageCheck,
      onClick: () => navigate('/admin/production/material-used/create'),
      color: 'purple'
    },
    {
      title: 'Voir les utilisations',
      description: 'Consulter la liste des utilisations de matériel',
      icon: List,
      onClick: () => navigate('/admin/production/material-used/list'),
      color: 'yellow'
    }
  ];

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestion du Matériel</h1>
        <p className="text-muted-foreground mt-2">
          Gérez l'inventaire et l'utilisation du matériel de production
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

      <ThemedCard moduleName="production" title="À propos de la gestion de matériel" subtitle="Comment fonctionne cette section">
        <div className="prose max-w-none">
          <p>
            La gestion de matériel vous permet de maintenir un inventaire complet de votre équipement 
            et de suivre son utilisation dans les différents projets de production.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Créez des types de matériel pour catégoriser vos équipements</li>
            <li>Ajoutez des unités spécifiques avec leurs caractéristiques</li>
            <li>Suivez l'utilisation de chaque équipement dans les projets</li>
            <li>Contrôlez la disponibilité et l'état du matériel</li>
          </ul>
        </div>
      </ThemedCard>
    </PageContainer>
  );
}