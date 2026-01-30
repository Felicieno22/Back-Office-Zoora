import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { ThemedCard } from '../../components/ui/ThemedCard';
import { ThemedIcon } from '../../components/ui/ThemedIcon';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Edit, Calendar, User, Film, Globe, Clock, Users, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../utils/api';
import { PageContainer, SectionCard } from '../../components/shared/SharedLayout';
import { PageHeader } from '../../components/shared/PageHeader';

interface SeriesDetailsProps {
  isDarkMode?: boolean;
}

interface SerieDetails {
  id_contenu: number;
  id_serie: number;
  titre: string;
  synopsis: string;
  dateSortie: string;
  sousTitre: string;
  miniature: string;
  genre: string;
  createur: string;
  acteurs: string;
  pays: string;
  langue: string;
  classification: string;
  nbSaisons: number;
  nbEpisodes: number;
  statut: string;
}

export function SeriesDetails({ isDarkMode = false }: SeriesDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serie, setSerie] = useState<SerieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSerieDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await apiRequest(`/api/series/${id}`);
        
        if (isMounted) {
          if (data) {
            setSerie(data);
            // Pas de toast ici pour éviter les perturbations visuelles
          } else {
            setError('Série non trouvée');
            toast.error('Série non trouvée');
          }
        }
      } catch (error: any) {
        if (isMounted) {
          console.error('Erreur lors du chargement des détails:', error);
          setError(error.message || 'Erreur lors du chargement des détails');
          toast.error(error.message || 'Erreur lors du chargement des détails');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSerieDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleEdit = () => {
    if (serie) {
      navigate(`/series/${serie.id_contenu}/edit`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'publié':
      case 'en_cours':
        return 'bg-green-100 text-green-800';
      case 'brouillon':
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'archivé':
      case 'termine':
        return 'bg-gray-100 text-gray-800';
      case 'annule':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'tout-public':
        return 'bg-green-100 text-green-800';
      case '10':
      case '12':
        return 'bg-yellow-100 text-yellow-800';
      case '16':
      case '18':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des détails...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !serie) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-6">{error || 'Série non trouvée'}</p>
          <ThemedButton onClick={() => navigate('/series')} variant="secondary" moduleName="series" useGradient={true} useHoverScale={true} useAdvancedShadow={true}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </ThemedButton>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={serie.titre}
        subtitle={serie.sousTitre}
        icon={Film}
        isDarkMode={isDarkMode}
      />

      <div className="flex gap-4 mb-6">
        <ThemedButton 
          onClick={() => navigate('/series')} 
          variant="secondary"
          className={isDarkMode ? 'border-gray-700 text-gray-300' : ''}
          moduleName="series"
          useGradient={true}
          useHoverScale={true}
          useAdvancedShadow={true}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </ThemedButton>
        <ThemedButton 
          onClick={handleEdit}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          moduleName="series"
          useGradient={true}
          useHoverScale={true}
          useAdvancedShadow={true}
        >
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </ThemedButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Affiche et informations principales */}
        <div className="lg:col-span-1">
          <SectionCard isDarkMode={isDarkMode}>
            <div className="space-y-4">
              {serie.miniature && (
                <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={serie.miniature} 
                    alt={serie.titre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-poster.jpg';
                    }}
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(serie.statut)}>
                    {serie.statut || 'Brouillon'}
                  </Badge>
                  {serie.classification && (
                    <Badge className={getClassificationColor(serie.classification)}>
                      {serie.classification}
                    </Badge>
                  )}
                </div>

                {serie.genre && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{serie.genre}</span>
                  </div>
                )}

                {serie.dateSortie && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {new Date(serie.dateSortie).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Film className="w-4 h-4" />
                    <span>{serie.nbSaisons} saison(s)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{serie.nbEpisodes} épisode(s)</span>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Informations détaillées */}
        <div className="lg:col-span-2 space-y-6">
          {/* Synopsis */}
          {serie.synopsis && (
            <SectionCard isDarkMode={isDarkMode}>
              <h3 className="text-lg font-semibold mb-3">Synopsis</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {serie.synopsis}
              </p>
            </SectionCard>
          )}

          {/* Informations de production */}
          <SectionCard isDarkMode={isDarkMode}>
            <h3 className="text-lg font-semibold mb-4">Informations de production</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serie.createur && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Créateur</p>
                    <p className="font-medium">{serie.createur}</p>
                  </div>
                </div>
              )}

              {serie.acteurs && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Acteurs principaux</p>
                    <p className="font-medium">{serie.acteurs}</p>
                  </div>
                </div>
              )}

              {serie.pays && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Pays</p>
                    <p className="font-medium">{serie.pays}</p>
                  </div>
                </div>
              )}

              {serie.langue && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Langue</p>
                    <p className="font-medium">{serie.langue}</p>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Métadonnées */}
          <SectionCard isDarkMode={isDarkMode}>
            <h3 className="text-lg font-semibold mb-4">Métadonnées</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">ID Contenu</p>
                <p className="font-mono">{serie.id_contenu}</p>
              </div>
              <div>
                <p className="text-gray-500">ID Série</p>
                <p className="font-mono">{serie.id_serie}</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
}
