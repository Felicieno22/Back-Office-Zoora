import { Film, Tv, CheckCircle2, Users, UserCog, Wrench, BarChart3, Settings, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';

interface HomeViewProps {
  isDarkMode: boolean;
  onNavigate: (tab: string) => void;
  moviesCount: number;
  seriesCount: number;
}

export function HomeView({ isDarkMode, onNavigate, moviesCount, seriesCount }: HomeViewProps) {
  const { user } = useAuth();

  const handleModuleClick = (moduleId: string) => {
    onNavigate(moduleId);
    // Fermer le sidebar mobile si ouvert
    if (window.innerWidth < 1024) {
      window.scrollTo(0, 0);
    }
  };

  const modules = [
    {
      id: 'films-dashboard',
      title: 'Films',
      description: `Gérer ${moviesCount} films`,
      icon: Film,
      gradient: 'from-blue-600 to-blue-400',
      stats: `${moviesCount} films`,
      color: 'bg-blue-600'
    },
    {
      id: 'series-dashboard',
      title: 'Séries',
      description: `Gérer ${seriesCount} séries`,
      icon: Tv,
      gradient: 'from-purple-600 to-purple-400',
      stats: `${seriesCount} séries`,
      color: 'bg-purple-600'
    },
    {
      id: 'validation-list',
      title: 'Validation Admin',
      description: 'Valider les contenus soumis',
      icon: CheckCircle2,
      gradient: 'from-orange-600 to-orange-400',
      stats: '5 en attente',
      color: 'bg-orange-600'
    },
    {
      id: 'users',
      title: 'Utilisateurs',
      description: 'Gérer les utilisateurs',
      icon: Users,
      gradient: 'from-green-600 to-green-400',
      stats: '6 utilisateurs',
      color: 'bg-green-600'
    },
    {
      id: 'crew',
      title: 'Équipages',
      description: 'Gérer les équipes de production',
      icon: UserCog,
      gradient: 'from-cyan-600 to-cyan-400',
      stats: 'Équipes créatives',
      color: 'bg-cyan-600'
    },
    {
      id: 'equipment',
      title: 'Matériels',
      description: 'Gérer l\'équipement',
      icon: Wrench,
      gradient: 'from-indigo-600 to-indigo-400',
      stats: 'Inventaire',
      color: 'bg-indigo-600'
    },
    {
      id: 'analytics',
      title: 'Analytiques',
      description: 'Statistiques et rapports',
      icon: BarChart3,
      gradient: 'from-pink-600 to-pink-400',
      stats: 'Performances',
      color: 'bg-pink-600'
    },
    {
      id: 'settings',
      title: 'Paramètres',
      description: 'Configuration du système',
      icon: Settings,
      gradient: 'from-gray-600 to-gray-400',
      stats: 'Configuration',
      color: 'bg-gray-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className={`${isDarkMode ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900' : 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'} p-8 md:p-12`}>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl text-white mb-3">
              Bienvenue sur ZOORA Admin
            </h1>
            <p className="text-blue-100 text-lg mb-2">
              Bonjour, {user?.name} 👋
            </p>
            <p className="text-blue-200 max-w-2xl">
              Gérez votre plateforme de streaming en toute simplicité. Accédez rapidement à tous vos modules ci-dessous.
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-600/10">
              <Film className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Films</p>
              <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{moviesCount}</p>
            </div>
          </div>
        </Card>
        
        <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-600/10">
              <Tv className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Séries</p>
              <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{seriesCount}</p>
            </div>
          </div>
        </Card>
        
        <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-600/10">
              <CheckCircle2 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>En Attente</p>
              <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>5</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className={`text-2xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Modules de Gestion
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module) => (
            <Card
              key={module.id}
              className={`
                group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl
                ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'}
              `}
              onClick={() => handleModuleClick(module.id)}
            >
              <div className="p-6">
                {/* Icon with gradient background */}
                <div className={`
                  w-14 h-14 rounded-xl bg-gradient-to-br ${module.gradient}
                  flex items-center justify-center mb-4
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <module.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Content */}
                <h3 className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {module.title}
                </h3>
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {module.description}
                </p>
                
                {/* Stats badge */}
                <div className={`
                  inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full
                  ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}
                `}>
                  {module.stats}
                </div>
                
                {/* Hover arrow */}
                <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Accéder
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className={`text-2xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Activités Récentes
        </h2>
        
        <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="space-y-4">
            {[
              { action: 'Nouveau film ajouté', title: 'Inception', time: 'Il y a 2 heures', icon: Film, color: 'text-blue-600' },
              { action: 'Série mise à jour', title: 'Breaking Bad', time: 'Il y a 5 heures', icon: Tv, color: 'text-purple-600' },
              { action: 'Contenu validé', title: 'The Matrix', time: 'Il y a 1 jour', icon: CheckCircle2, color: 'text-green-600' },
            ].map((activity, index) => (
              <div key={index} className={`flex items-center gap-4 pb-4 ${index !== 2 ? `border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}` : ''}`}>
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {activity.action}: <span className="font-medium">{activity.title}</span>
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}