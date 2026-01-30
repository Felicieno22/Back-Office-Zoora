import React, { useState, useEffect } from 'react';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { ThemedCard } from '../../components/ui/ThemedCard';
import { ThemedField } from '../../components/ui/ThemedField';
import { ThemedIcon } from '../../components/ui/ThemedIcon';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, Edit, Trash2, Image, Link, Calendar, Wifi, AlertCircle } from 'lucide-react';
import { Carousel } from '../../types/carousel';
import { apiRequest, getCarrousels } from '../../utils/api';
import { CarouselFormDialog } from '../../components/forms/CarouselFormDialog';
import { toast } from 'sonner';
import { isValidResponse, handleDataResponse, ERROR_MESSAGES, handleApiError } from '../../utils/errorHandler';

interface CarouselListProps {
  isDarkMode?: boolean;
}

export function CarouselList({ isDarkMode = true }: CarouselListProps) {
  const [carrousels, setCarrousels] = useState<Carousel[]>([]);
  const [filteredCarrousels, setFilteredCarrousels] = useState<Carousel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCarousel, setSelectedCarousel] = useState<Carousel | null>(null);

  // Load carrousels
  useEffect(() => {
    fetchCarrousels();
  }, []);

  // Filter carrousels
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCarrousels(carrousels);
    } else {
      const filtered = carrousels.filter(carousel =>
        carousel.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        carousel.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        carousel.lien_url.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCarrousels(filtered);
    }
  }, [carrousels, searchTerm]);

  const fetchCarrousels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // getCarrousels garantit un tableau
      const data = await getCarrousels();
      
      // Process API response - it may include joined content data
      let carouselsData: Carousel[] = [];
      
      if (data.length > 0 && data[0].carrousels) {
        // Handle joined response structure: [{ carrousels: {...}, contenu: {...} }]
        carouselsData = data.map(item => ({
          ...item.carrousels,
          contenu: item.contenu
        }));
      } else {
        // Handle direct carousel array response
        carouselsData = data;
      }
      
      setCarrousels(carouselsData);
      if (carouselsData.length > 0) {
        toast.success('Carrousels chargés avec succès');
      } else {
        console.log('No carrousels data available from backend');
      }
    } catch (error: any) {
      console.error('Error fetching carrousels:', error);
      
      const apiError = handleApiError(error);
      setError(apiError.message);
      
      // Only show toast for actual errors, not missing data
      if (apiError.code !== 'NOT_FOUND') {
        toast.error(apiError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (carousel: Carousel) => {
    setSelectedCarousel(carousel);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce carousel ?')) return;

    try {
      await apiRequest(`/api/carrousels/${id}`, { method: 'DELETE' });
      toast.success('Carousel supprimé avec succès!');
      fetchCarrousels(); // Refresh list
    } catch (error: any) {
      console.error('Error deleting carousel:', error);
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    }
  };

  const handleSuccess = () => {
    fetchCarrousels();
    setEditModalOpen(false);
    setSelectedCarousel(null);
  };

  const getStatusColor = (status: string) => {
    return status === 'actif' ? 'bg-green-500' : 'bg-red-500';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className={`p-8 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'} min-h-screen`}>
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
              Gestion des Carrousels
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
              Gérez vos carrousels promotionnels
            </p>
          </div>
          
          <div className="flex gap-3">
            <ThemedField
              moduleName="carrousels"
              label=""
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(value: string) => setSearchTerm(value)}
              icon={Search}
              useAdvancedFocus={true}
              useModernBorder={true}
            />
            
            <ThemedButton 
              moduleName="carrousels"
              onClick={() => {
                setSelectedCarousel(null);
                setEditModalOpen(true);
              }}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter Carousel
            </ThemedButton>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium">Erreur de connexion</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
              <button 
                onClick={fetchCarrousels}
                className="mt-2 text-sm text-red-300 hover:text-white underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ThemedCard 
            moduleName="carrousels"
            hoverable={true}
            useAdvancedHover={true}
          >
            <div className="p-6">
              <div className="flex items-center">
                <ThemedIcon 
                  moduleName="carrousels" 
                  icon={Image} 
                  size="lg" 
                  variant="gradient"
                  useHover={false}
                />
                <div className="ml-3">
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {carrousels.length}
                  </p>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total</p>
                </div>
              </div>
            </div>
          </ThemedCard>
          
          <ThemedCard 
            moduleName="carrousels"
            hoverable={true}
            useAdvancedHover={true}
          >
            <div className="p-6">
              <div className="flex items-center">
                <ThemedIcon 
                  moduleName="carrousels" 
                  icon={Image} 
                  size="lg" 
                  variant="gradient"
                  useHover={false}
                />
                <div className="ml-3">
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {carrousels.filter(c => c.statut === 'actif').length}
                  </p>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Actifs</p>
                </div>
              </div>
            </div>
          </ThemedCard>
          
          <ThemedCard 
            moduleName="carrousels"
            hoverable={true}
            useAdvancedHover={true}
          >
            <div className="p-6">
              <div className="flex items-center">
                <ThemedIcon 
                  moduleName="carrousels" 
                  icon={Image} 
                  size="lg" 
                  variant="gradient"
                  useHover={false}
                />
                <div className="ml-3">
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {carrousels.filter(c => c.statut === 'inactif').length}
                  </p>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Inactifs</p>
                </div>
              </div>
            </div>
          </ThemedCard>
          
          <ThemedCard 
            moduleName="carrousels"
            hoverable={true}
            useAdvancedHover={true}
          >
            <div className="p-6">
              <div className="flex items-center">
                <ThemedIcon 
                  moduleName="carrousels" 
                  icon={Link} 
                  size="lg" 
                  variant="gradient"
                  useHover={false}
                />
                <div className="ml-3">
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {carrousels.filter(c => c.id_contenu).length}
                  </p>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Avec contenu</p>
                </div>
              </div>
            </div>
          </ThemedCard>
        </div>

        {/* Carrousels Grid */}
        {filteredCarrousels.length === 0 && !loading ? (
          <ThemedCard 
            moduleName="carrousels"
            className={isDarkMode ? 'bg-slate-900 border-slate-800' : ''}
            hoverable={true}
            useAdvancedHover={true}
          >
            <div className="p-12 text-center">
              <Image className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {error ? 'Impossible de charger les carrousels' : 'Aucun carousel trouvé'}
              </h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {error 
                  ? 'Le serveur ne répond pas ou n\'a pas encore de données.' 
                  : (searchTerm ? 'Aucun carousel ne correspond à votre recherche.' : 'Commencez par créer un carousel.')
                }
              </p>
              {!searchTerm && !error && (
                <ThemedButton 
                  moduleName="carrousels"
                  onClick={() => {
                    setSelectedCarousel(null);
                    setEditModalOpen(true);
                  }}
                  useGradient={true}
                  useHoverScale={true}
                  useAdvancedShadow={true}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un carousel
                </ThemedButton>
              )}
              {error && (
                <div className="mt-4 flex flex-col gap-2">
                  <ThemedButton 
                    moduleName="carrousels"
                    onClick={fetchCarrousels}
                    useGradient={true}
                    useHoverScale={true}
                    useAdvancedShadow={true}
                  >
                    <Wifi className="w-4 h-4 mr-2" />
                    Réessayer
                  </ThemedButton>
                </div>
              )}
            </div>
          </ThemedCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCarrousels.map((carousel) => (
              <ThemedCard 
                key={carousel.id_carrousel}
                moduleName="carrousels"
                className={`${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'hover:shadow-lg'} transition-all`}
                hoverable={true}
                useAdvancedHover={true}
              >
                <div className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {carousel.titre}
                    </div>
                    <Badge className={getStatusColor(carousel.statut)}>
                      {carousel.statut === 'actif' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  {carousel.description && (
                    <p className={`text-sm mt-2 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {carousel.description}
                    </p>
                  )}
                </div>
                
                <div>
                  {/* Image Preview */}
                  <div className={`mb-4 rounded-lg overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                    {carousel.image_url ? (
                      <img 
                        src={carousel.image_url} 
                        alt={carousel.titre}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className={`w-full h-32 flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                        <Image className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    {carousel.lienUrl && (
                      <div className="flex items-center gap-2">
                        <Link className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <a 
                          href={carousel.lienUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                          Voir le lien
                        </a>
                      </div>
                    )}
                    {carousel.date_debut && (
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {carousel.date_debut ? formatDate(carousel.date_debut) : 'N/A'} → 
                          {carousel.date_fin ? formatDate(carousel.date_fin) : 'N/A'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <ThemedButton 
                      moduleName="carrousels"
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleEdit(carousel)}
                      className={isDarkMode ? 'border-slate-700 text-white hover:bg-slate-800' : ''}
                      useGradient={true}
                      useHoverScale={true}
                      useAdvancedShadow={true}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </ThemedButton>
                    <ThemedButton 
                      moduleName="carrousels"
                      size="sm" 
                      variant="error"
                      onClick={() => handleDelete(carousel.id_carrousel)}
                      className={`${isDarkMode ? 'border-red-800 text-red-400 hover:bg-red-950' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
                      useGradient={true}
                      useHoverScale={true}
                      useAdvancedShadow={true}
                    >
                      <Trash2 className="w-4 h-4" />
                    </ThemedButton>
                  </div>
                </div>
              </ThemedCard>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <CarouselFormDialog
        carousel={selectedCarousel}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCarousel(null);
        }}
        onSuccess={handleSuccess}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}