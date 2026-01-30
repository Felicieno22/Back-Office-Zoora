import { useState, useEffect } from 'react';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { Badge } from '../../../components/ui/badge';
import { Search, Plus, Play, Clock, Edit, Trash2, Globe, FileText, AlignLeft } from 'lucide-react';
import { Episode } from '../../../types/base';
import { apiRequest, getEpisodes } from '../../../utils/api';

interface EpisodesListProps {
  isDarkMode?: boolean;
}

export function EpisodesList({ isDarkMode = true }: EpisodesListProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  useEffect(() => {
    filterEpisodes();
  }, [episodes, searchTerm]);

  const fetchEpisodes = async () => {
    try {
      setLoading(true);
      // getEpisodes garantit un tableau
      const data = await getEpisodes();
      setEpisodes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des épisodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEpisodes = () => {
    if (!searchTerm) {
      setFilteredEpisodes(episodes);
      return;
    }
    
    const filtered = episodes.filter(episode =>
      episode.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      episode.numero_episode.toString().includes(searchTerm)
    );
    setFilteredEpisodes(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approuve': return 'bg-green-500';
      case 'en_attente': return 'bg-yellow-500';
      case 'rejete': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEdit = (episodeId: number) => {
    window.dispatchEvent(new CustomEvent('tabChange', { detail: `episodes-edit-${episodeId}` }));
  };

  const handleDelete = async (episodeId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet épisode ?')) return;
    
    try {
      await apiRequest(`/api/episodes/${episodeId}`, { method: 'DELETE' });
      fetchEpisodes();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className={`p-8 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-8 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Gestion des Épisodes
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
              Liste de tous les épisodes des saisons
            </p>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <ThemedField
                moduleName="episodes"
                label="Recherche"
                type="text"
                value={searchTerm}
                onChange={(value: string) => setSearchTerm(value)}
                placeholder="Rechercher un épisode..."
                icon={Search}
                useAdvancedFocus={true}
                useModernBorder={true}
              />
            </div>
            
            <ThemedButton 
              moduleName="episodes"
              variant="primary"
              onClick={() => window.dispatchEvent(new CustomEvent('tabChange', { detail: 'episodes-create' }))}
              icon={<Plus size={16} />}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              Ajouter Épisode
            </ThemedButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ThemedCard moduleName="episodes" className="p-6">
            <div className="flex items-center">
              <Play className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {episodes.length}
                </p>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Épisodes</p>
              </div>
            </div>
          </ThemedCard>
          
          <ThemedCard moduleName="episodes" className="p-6">
            <div className="flex items-center">
              <Play className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'} mr-3`} />
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {episodes.filter(e => e.statut === 'approuve').length}
                </p>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Publiés</p>
              </div>
            </div>
          </ThemedCard>
          
          <ThemedCard moduleName="episodes" className="p-6">
            <div className="flex items-center">
              <Clock className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} mr-3`} />
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {episodes.reduce((acc, e) => acc + (e.duree ? 1 : 0), 0)}
                </p>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Avec Durée</p>
              </div>
            </div>
          </ThemedCard>
        </div>

        {/* Episodes Grid */}
        {filteredEpisodes.length === 0 ? (
          <ThemedCard moduleName="episodes" className="p-12 text-center">
            <Play className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Aucun épisode trouvé
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              {searchTerm ? 'Aucun épisode ne correspond à votre recherche.' : 'Commencez par ajouter un épisode.'}
            </p>
            {!searchTerm && (
              <ThemedButton 
                moduleName="episodes"
                onClick={() => window.dispatchEvent(new CustomEvent('tabChange', { detail: 'episodes-create' }))}
                variant="primary"
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un épisode
              </ThemedButton>
            )}
          </ThemedCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEpisodes.map((episode) => (
              <ThemedCard 
                key={episode.id_episode} 
                moduleName="episodes"
                className={`pb-3 ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'hover:shadow-lg'} transition-all`}
              >
                <div className="flex justify-between items-start">
                  <div className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Épisode {episode.numero_episode}
                  </div>
                  <Badge className={getStatusColor(episode.statut)}>
                    {episode.statut === 'approuve' ? 'Publié' : 
                     episode.statut === 'en_attente' ? 'En attente' : 
                     episode.statut === 'rejete' ? 'Rejeté' : 'Inconnu'}
                  </Badge>
                </div>
                <p className={`text-sm mt-2 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {episode.titre}
                </p>
                
                {episode.synopsis && (
                  <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {episode.synopsis}
                  </p>
                )}
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {episode.duree || 'N/A'}
                    </span>
                  </div>
                  
                  {episode.date_sortie && (
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(episode.date_sortie).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <ThemedButton 
                    moduleName="episodes"
                    onClick={() => handleEdit(episode.id_episode)}
                    variant="secondary"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </ThemedButton>
                  <ThemedButton 
                    moduleName="episodes"
                    onClick={() => handleDelete(episode.id_episode)}
                    variant="error"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </ThemedButton>
                </div>
              </ThemedCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}