import React, { useState, useEffect } from 'react';
import { Tv, Upload, Loader2, ArrowLeft, AlignLeft, Calendar, Globe, User, Users, Hash, Star, Play, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../utils/api';
import { PageContainer, SectionCard } from '../../components/shared/SharedLayout';
import { ThemedCard } from '../../components/ui/ThemedCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemedField } from '../../components/ui/ThemedField';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { ThemedIcon } from '../../components/ui/ThemedIcon';

interface SeriesEditProps {
  isDarkMode: boolean;
}

interface SerieData {
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

export function SeriesEdit({ isDarkMode }: SeriesEditProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<SerieData>({
    titre: '',
    synopsis: '',
    dateSortie: new Date().toISOString().split('T')[0],
    sousTitre: '',
    miniature: '',
    genre: '',
    createur: '',
    acteurs: '',
    pays: '',
    langue: '',
    classification: 'tout-public',
    nbSaisons: 1,
    nbEpisodes: 0,
    statut: 'en_cours'
  });

  // Options pour les selects
  const genreOptions = [
    { value: 'Drame', label: 'Drame' },
    { value: 'Comédie', label: 'Comédie' },
    { value: 'Science-Fiction', label: 'Science-Fiction' },
    { value: 'Thriller', label: 'Thriller' },
    { value: 'Crime', label: 'Crime' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Historique', label: 'Historique' },
    { value: 'Action', label: 'Action' },
  ];

  const classificationOptions = [
    { value: 'tout-public', label: 'Tout public' },
    { value: '10-12', label: '10-12 ans' },
    { value: '13-16', label: '13-16 ans' },
    { value: '16+', label: '16 ans et plus' },
    { value: 'interdit', label: 'Interdit' },
  ];

  const statutOptions = [
    { value: 'en_cours', label: 'En cours' },
    { value: 'termine', label: 'Terminé' },
    { value: 'en_pause', label: 'En pause' },
    { value: 'annule', label: 'Annulé' },
  ];

  // Charger les données de la série
  useEffect(() => {
    const fetchSerie = async () => {
      if (!id) return;
      
      try {
        const data = await apiRequest(`/api/series/management/edit/${id}`);
        if (data) {
          setFormData({
            titre: data.titre || '',
            synopsis: data.synopsis || '',
            dateSortie: data.dateSortie || new Date().toISOString().split('T')[0],
            sousTitre: data.sousTitre || '',
            miniature: data.miniature || '',
            genre: data.genre || '',
            createur: data.createur || '',
            acteurs: data.acteurs || '',
            pays: data.pays || '',
            langue: data.langue || '',
            classification: data.classification || 'tout-public',
            nbSaisons: data.nbSaisons || 1,
            nbEpisodes: data.nbEpisodes || 0,
            statut: data.statut || 'en_cours'
          });
        }
      } catch (error) {
        console.error('Failed to fetch series:', error);
        toast.error('Erreur lors du chargement de la série');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSerie();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.titre) {
      newErrors.titre = 'Le titre est obligatoire';
    }
    if (!formData.dateSortie) {
      newErrors.dateSortie = 'La date de sortie est requise';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }
    
    setIsSubmitting(true);
    const toastId = toast.loading("Mise à jour de la série...");

    try {
      const seriesData = {
        titre: formData.titre.trim(),
        synopsis: formData.synopsis.trim(),
        dateSortie: formData.dateSortie,
        sousTitre: formData.sousTitre.trim(),
        miniature: formData.miniature.trim(),
        genre: formData.genre.trim(),
        createur: formData.createur.trim(),
        acteurs: formData.acteurs.trim(),
        pays: formData.pays.trim(),
        langue: formData.langue.trim(),
        classification: formData.classification,
        nbSaisons: formData.nbSaisons,
        nbEpisodes: formData.nbEpisodes,
        statut: formData.statut
      };

      const result = await apiRequest(`/api/series/${id}`, {
        method: 'PUT',
        data: seriesData
      });

      toast.success('Série mise à jour avec succès !', { id: toastId });
      navigate('/series');

    } catch (error) {
      console.error('Failed to update series:', error);
      toast.error('Erreur lors de la mise à jour de la série', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof SerieData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </PageContainer>
    );
  }

  // Configuration des champs pour la première rangée
  const textFields = [
    {
      name: 'titre' as keyof SerieData,
      label: 'Titre *',
      type: 'text' as const,
      placeholder: 'Le titre de la série',
      icon: Tv,
      required: true,
      error: errors.titre
    },
    {
      name: 'createur' as keyof SerieData,
      label: 'Créateur',
      type: 'text' as const,
      placeholder: 'Nom du créateur',
      icon: User,
      error: errors.createur
    },
    {
      name: 'acteurs' as keyof SerieData,
      label: 'Acteurs',
      type: 'text' as const,
      placeholder: 'Acteur 1, Acteur 2, Acteur 3',
      icon: Users,
      error: errors.acteurs
    },
    {
      name: 'pays' as keyof SerieData,
      label: 'Pays',
      type: 'text' as const,
      placeholder: 'États-Unis',
      icon: Globe,
      error: errors.pays
    },
    {
      name: 'langue' as keyof SerieData,
      label: 'Langue',
      type: 'text' as const,
      placeholder: 'Anglais',
      icon: Volume2,
      error: errors.langue
    }
  ];

  const selectFields = [
    {
      name: 'genre' as keyof SerieData,
      label: 'Genre',
      type: 'select' as const,
      placeholder: 'Sélectionner un genre',
      icon: Star,
      options: genreOptions,
      error: errors.genre
    }
  ];

  const dateFields = [
    {
      name: 'dateSortie' as keyof SerieData,
      label: 'Date de sortie *',
      type: 'date' as const,
      required: true,
      icon: Calendar,
      error: errors.dateSortie
    }
  ];

  // Configuration des champs numériques
  const numberFields = [
    {
      name: 'nbSaisons' as keyof SerieData,
      label: 'Nombre de saisons',
      type: 'number' as const,
      icon: Play,
      error: errors.nbSaisons
    },
    {
      name: 'nbEpisodes' as keyof SerieData,
      label: 'Nombre d\'épisodes',
      type: 'number' as const,
      icon: Play,
      error: errors.nbEpisodes
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Modifier une série"
        subtitle="Mettez à jour les informations de la série"
        icon={Tv}
        isDarkMode={isDarkMode}
      />

      <ThemedCard 
        moduleName="series" 
        title="Modification d'une série" 
        subtitle="Mettez à jour les informations de la série"
        hoverable={true}
        useAdvancedHover={true}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ThemedField
              moduleName="series"
              label="Titre *"
              type="text"
              value={formData.titre}
              onChange={(value) => {
                handleChange('titre', value);
                if (errors.titre) setErrors(prev => ({...prev, titre: ''}));
              }}
              placeholder="Le titre de la série"
              required={true}
              icon={Tv}
              error={errors.titre}
            />

            <ThemedField
              moduleName="series"
              label="Genre"
              type="select"
              value={formData.genre}
              onChange={(value) => {
                handleChange('genre', value);
                if (errors.genre) setErrors(prev => ({...prev, genre: ''}));
              }}
              placeholder="Sélectionner un genre"
              icon={Star}
              options={genreOptions}
              error={errors.genre}
            />

            <ThemedField
              moduleName="series"
              label="Créateur"
              type="text"
              value={formData.createur}
              onChange={(value) => {
                handleChange('createur', value);
                if (errors.createur) setErrors(prev => ({...prev, createur: ''}));
              }}
              placeholder="Nom du créateur"
              icon={User}
              error={errors.createur}
            />

            <ThemedField
              moduleName="series"
              label="Acteurs"
              type="text"
              value={formData.acteurs}
              onChange={(value) => {
                handleChange('acteurs', value);
                if (errors.acteurs) setErrors(prev => ({...prev, acteurs: ''}));
              }}
              placeholder="Acteur 1, Acteur 2, Acteur 3"
              icon={Users}
              error={errors.acteurs}
            />

            <ThemedField
              moduleName="series"
              label="Date de sortie *"
              type="date"
              value={formData.dateSortie}
              onChange={(value) => {
                handleChange('dateSortie', value);
                if (errors.dateSortie) setErrors(prev => ({...prev, dateSortie: ''}));
              }}
              required={true}
              icon={Calendar}
              error={errors.dateSortie}
            />

            <ThemedField
              moduleName="series"
              label="Pays"
              type="text"
              value={formData.pays}
              onChange={(value) => {
                handleChange('pays', value);
                if (errors.pays) setErrors(prev => ({...prev, pays: ''}));
              }}
              placeholder="États-Unis"
              icon={Globe}
              error={errors.pays}
            />

            <ThemedField
              moduleName="series"
              label="Langue"
              type="text"
              value={formData.langue}
              onChange={(value) => {
                handleChange('langue', value);
                if (errors.langue) setErrors(prev => ({...prev, langue: ''}));
              }}
              placeholder="Anglais"
              icon={Volume2}
              error={errors.langue}
            />
          </div>

          <ThemedField
            moduleName="series"
            label="Synopsis"
            type="textarea"
            value={formData.synopsis}
            onChange={(value) => {
              handleChange('synopsis', value);
              if (errors.synopsis) setErrors(prev => ({...prev, synopsis: ''}));
            }}
            placeholder="Synopsis de la série..."
            rows={4}
            icon={AlignLeft}
            error={errors.synopsis}
          />

          <ThemedField
            moduleName="series"
            label="Sous-titre"
            type="text"
            value={formData.sousTitre}
            onChange={(value) => {
              handleChange('sousTitre', value);
              if (errors.sousTitre) setErrors(prev => ({...prev, sousTitre: ''}));
            }}
            placeholder="Sous-titre de la série"
            icon={AlignLeft}
            error={errors.sousTitre}
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold tracking-wide text-violet-600">
                URL de l'affiche
              </label>
              <div className="flex gap-2">
                <ThemedField
                  moduleName="series"
                  label=""
                  type="text"
                  value={formData.miniature}
                  onChange={(value) => {
                    handleChange('miniature', value);
                    if (errors.miniature) setErrors(prev => ({...prev, miniature: ''}));
                  }}
                  placeholder="https://example.com/poster.jpg"
                  icon={Upload}
                  error={errors.miniature}
                />
                <ThemedButton
                  moduleName="series"
                  variant="primary"
                  size="md"
                  onClick={() => {}}
                  useGradient={true}
                  useHoverScale={true}
                  useAdvancedShadow={true}
                >
                  <Upload className="w-4 h-4" />
                </ThemedButton>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ThemedField
              moduleName="series"
              label="Classification"
              type="select"
              value={formData.classification}
              onChange={(value) => {
                handleChange('classification', value);
                if (errors.classification) setErrors(prev => ({...prev, classification: ''}));
              }}
              placeholder="Classification"
              icon={Hash}
              options={classificationOptions}
              error={errors.classification}
            />

            <ThemedField
              moduleName="series"
              label="Nombre de saisons"
              type="number"
              value={String(formData.nbSaisons)}
              onChange={(value) => {
                handleChange('nbSaisons', Number(value) || 0);
                if (errors.nbSaisons) setErrors(prev => ({...prev, nbSaisons: ''}));
              }}
              icon={Play}
              error={errors.nbSaisons}
            />

            <ThemedField
              moduleName="series"
              label="Nombre d'épisodes"
              type="number"
              value={String(formData.nbEpisodes)}
              onChange={(value) => {
                handleChange('nbEpisodes', Number(value) || 0);
                if (errors.nbEpisodes) setErrors(prev => ({...prev, nbEpisodes: ''}));
              }}
              icon={Play}
              error={errors.nbEpisodes}
            />

            <ThemedField
              moduleName="series"
              label="Statut"
              type="select"
              value={formData.statut}
              onChange={(value) => {
                handleChange('statut', value);
                if (errors.statut) setErrors(prev => ({...prev, statut: ''}));
              }}
              placeholder="Statut"
              icon={Star}
              options={statutOptions}
              error={errors.statut}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <ThemedButton
              moduleName="series"
              variant="secondary"
              type="button"
              onClick={() => navigate('/admin/series')}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </ThemedButton>
            
            <ThemedButton
              moduleName="series"
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Mettre à jour la série
            </ThemedButton>
          </div>
        </form>
      </ThemedCard>
    </PageContainer>
  );
}