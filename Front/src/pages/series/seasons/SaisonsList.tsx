import { useState, useEffect } from 'react';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { Search, Plus, Calendar, Play, Edit, Trash2, Eye, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Saison } from '../../../types/base';
import { apiRequest, getSaisons } from '../../../utils/api';

interface SaisonsListProps {
  isDarkMode?: boolean;
}

export function SaisonsList({ isDarkMode = true }: SaisonsListProps) {
  const [saisons, setSaisons] = useState<Saison[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSaisons, setFilteredSaisons] = useState<Saison[]>([]);

  useEffect(() => {
    fetchSaisons();
  }, []);

  useEffect(() => {
    filterSaisons();
  }, [saisons, searchTerm]);

  const fetchSaisons = async () => {
    try {
      setLoading(true);
      // getSaisons garantit un tableau
      const data = await getSaisons();
      setSaisons(data);
    } catch (error) {
      console.error('Erreur lors du chargement des saisons:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSaisons = () => {
    if (!searchTerm) {
      setFilteredSaisons(saisons);
      return;
    }
    
    const filtered = saisons.filter(saison =>
      saison.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      saison.numero_saison.toString().includes(searchTerm)
    );
    setFilteredSaisons(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approuve': return 'bg-green-500';
      case 'en_attente': return 'bg-yellow-500';
      case 'rejete': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddEpisode = (saisonId: number) => {
    // Rediriger vers la page de création d'épisode
    window.dispatchEvent(new CustomEvent('tabChange', { detail: `episodes-create-${saisonId}` }));
  };

  const handleEdit = (saisonId: number) => {
    // Rediriger vers la page d'édition
    window.dispatchEvent(new CustomEvent('tabChange', { detail: `saisons-edit-${saisonId}` }));
  };

  const handleDelete = async (saisonId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette saison ?')) return;
    
    try {
      await apiRequest(`/api/seasons/${saisonId}`, { method: 'DELETE' });
      fetchSaisons(); // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Gestion des Saisons
            </h1>
            <p className="mt-2">
              Liste de toutes les saisons des séries
            </p>
          </div>
          
          <div className="flex gap-3">
            <ThemedField
              moduleName="series"
              label="Rechercher"
              type="text"
              placeholder="Rechercher une saison..."
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              icon={Search}
              className="w-64"
              useAdvancedFocus={true}
              useModernBorder={true}
            />
            
            <ThemedButton 
              moduleName="series"
              variant="primary"
              onClick={() => window.dispatchEvent(new CustomEvent('tabChange', { detail: 'saisons-create' }))}
              icon={<Plus size={16} />}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              Ajouter Saison
            </ThemedButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ThemedCard 
            moduleName="series"
            hoverable={true}
            useAdvancedHover={true}
          >
            <div className="p-6">
              <div className="flex items-center">
                <ThemedIcon 
                  moduleName="series" 
                  icon={Calendar} 
                  size="lg" 
                  variant="gradient"
                  useHover={false}
                />
                <div className="ml-3">
                  <p className="text-2xl font-bold">
                    {saisons.length}
                  </p>
                  <p>Total Saisons</p>
                </div>
              </div>
            </div>
          </ThemedCard>
          
          <ThemedCard 
            moduleName="series"
            hoverable={true}
            useAdvancedHover={true}
          >
            <div className="p-6">
              <div className="flex items-center">
                <ThemedIcon 
                  moduleName="series" 
                  icon={Play} 
                  size="lg" 
                  variant="gradient"
                  useHover={false}
                />
                <div className="ml-3">
                  <p className="text-2xl font-bold">
                    {saisons.filter(s => s.statut === 'approuve').length}
                  </p>
                  <p>Publiées</p>
                </div>
              </div>
            </div>
          </ThemedCard>
          
          <ThemedCard 
            moduleName="series"
            hoverable={true}
            useAdvancedHover={true}
          >
            <div className="p-6">
              <div className="flex items-center">
                <ThemedIcon 
                  moduleName="series" 
                  icon={Clock} 
                  size="lg" 
                  variant="gradient"
                  useHover={false}
                />
                <div className="ml-3">
                  <p className="text-2xl font-bold">
                    {saisons.filter(s => s.statut === 'en_attente').length}
                  </p>
                  <p>En Attente</p>
                </div>
              </div>
            </div>
          </ThemedCard>
        </div>

        {/* Saisons Grid */}
        {filteredSaisons.length === 0 ? (
          <ThemedCard 
            moduleName="series" 
            title="Aucune saison trouvée"
            subtitle={searchTerm ? 'Aucune saison ne correspond à votre recherche.' : 'Commencez par ajouter une saison.'}
            className="p-12 text-center"
            hoverable={true}
            useAdvancedHover={true}
          >
            <Calendar className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Aucune saison trouvée
            </h3>
            <p>
              {searchTerm ? 'Aucune saison ne correspond à votre recherche.' : 'Commencez par ajouter une saison.'}
            </p>
            {!searchTerm && (
              <ThemedButton 
                moduleName="series"
                variant="primary"
                onClick={() => window.dispatchEvent(new CustomEvent('tabChange', { detail: 'saisons-create' }))}
                icon={<Plus size={16} />}
                className="mt-4"
              >
                Créer une saison
              </ThemedButton>
            )}
          </ThemedCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSaisons.map((saison) => (
              <ThemedCard 
                key={saison.id_saison} 
                title={`Saison ${saison.numero_saison}${saison.titre ? ` - ${saison.titre}` : ''}`}
                subtitle={saison.synopsis || undefined}
                className="transition-all cursor-pointer"
                moduleName="series"
              >
                <div className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="text-lg font-bold">
                      Saison {saison.numero_saison}
                      {saison.titre && ` - ${saison.titre}`}
                    </div>
                    <div className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${saison.statut === 'approuve' ? 'bg-green-100 text-green-800' : saison.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' : saison.statut === 'rejete' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {saison.statut === 'approuve' ? 'Publiée' : 
                       saison.statut === 'en_attente' ? 'En attente' : 
                       saison.statut === 'rejete' ? 'Rejetée' : 'Inconnu'}
                    </div>
                  </div>
                  {saison.synopsis && (
                    <p className="text-sm mt-2 line-clamp-2">
                      {saison.synopsis}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm">
                    {saison.episodes?.length || 0} épisodes
                  </span>
                  {saison.date_sortie && (
                    <span className="text-sm">
                      {new Date(saison.date_sortie).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <ThemedButton 
                    moduleName="series"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAddEpisode(saison.id_saison)}
                    icon={<Plus size={14} />}
                  >
                    Épisode
                  </ThemedButton>
                  <ThemedButton 
                    moduleName="series"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(saison.id_saison)}
                    icon={<Edit size={14} />}
                  >
                    Modifier
                  </ThemedButton>
                  <ThemedButton 
                    moduleName="series"
                    variant="error"
                    size="sm"
                    onClick={() => handleDelete(saison.id_saison)}
                    icon={<Trash2 size={14} />}
                  >
                    Supprimer
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