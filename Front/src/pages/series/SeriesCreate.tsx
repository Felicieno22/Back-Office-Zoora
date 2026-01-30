import React, { useState } from 'react';
import { Tv, Upload, Loader2, AlignLeft, Calendar, Globe, User, Users, Hash, Star, Play, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../utils/api';
import { PageContainer, SectionCard } from '../../components/shared/SharedLayout';
import { ThemedCard } from '../../components/ui/ThemedCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { ThemedField } from '../../components/ui/ThemedField';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { ThemedIcon } from '../../components/ui/ThemedIcon';

interface SeriesCreateProps {
  isDarkMode: boolean;
  onAddSerie?: (serie: any) => void;
}

interface SeriesFormData {
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

export function SeriesCreate({ isDarkMode, onAddSerie }: SeriesCreateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<SeriesFormData>({ 
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
    statut: 'en_cours',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.titre.trim()) {
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
    const toastId = toast.loading('Création de la série...');

    try {
      const seriesData = {
        ...formData,
        titre: formData.titre.trim(),
        synopsis: formData.synopsis.trim() || undefined,
        // ... reste de ton mapping original ...
      };

      console.log('Données envoyées au backend:', seriesData); // Debug

      const result = await apiRequest('/api/series', { // Ajusté selon ton controller
        method: 'POST',
        data: seriesData,
      });

      toast.success('Série créée avec succès !', { id: toastId });

      // Reset form
      setFormData({ 
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
        statut: 'en_cours',
      });

      onAddSerie?.(result);
    } catch (err: any) {
      // --- CAPTURE DE L'ERREUR SERVEUR ---
      const serverError = err.response?.data?.message || err.message || 'Erreur serveur';
      toast.error(Array.isArray(serverError) ? serverError[0] : serverError, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof SeriesFormData>(
    field: K,
    value: SeriesFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Options pour les selects
  const genreOptions = [
    { value: 'Science-Fiction', label: 'Science-Fiction' },
    { value: 'Drame', label: 'Drame' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Thriller', label: 'Thriller' },
    { value: 'Horreur', label: 'Horreur' },
    { value: 'Comédie', label: 'Comédie' },
    { value: 'Action', label: 'Action' },
  ];

  const classificationOptions = [
    { value: 'tout-public', label: 'Tout public' },
    { value: '10', label: '10 ans et +' },
    { value: '12', label: '12 ans et +' },
    { value: '16', label: '16 ans et +' },
    { value: '18', label: '18 ans et +' },
  ];

  const statutOptions = [
    { value: 'en_cours', label: 'En cours' },
    { value: 'terminee', label: 'Terminée' },
    { value: 'en_pause', label: 'En pause' },
    { value: 'annulee', label: 'Annulée' },
  ];

  // Configuration des champs pour la première rangée
  const basicFields = [
    {
      name: 'titre' as keyof SeriesFormData,
      label: 'Titre *',
      type: 'text' as const,
      placeholder: 'Stranger Things',
      icon: Tv,
      required: true,
      error: errors.titre
    },
    {
      name: 'sousTitre' as keyof SeriesFormData,
      label: 'Sous-titre *',
      type: 'text' as const,
      placeholder: 'Les mondes parallèles existent',
      icon: AlignLeft,
      required: true,
      error: errors.sousTitre
    },
    {
      name: 'genre' as keyof SeriesFormData,
      label: 'Genre *',
      type: 'select' as const,
      placeholder: 'Choisir un genre',
      icon: Star,
      required: true,
      options: genreOptions,
      error: errors.genre
    },
    {
      name: 'createur' as keyof SeriesFormData,
      label: 'Créateur(s)',
      type: 'text' as const,
      placeholder: 'Duffer Brothers',
      icon: User,
      error: errors.createur
    },
    {
      name: 'acteurs' as keyof SeriesFormData,
      label: 'Acteurs principaux',
      type: 'text' as const,
      placeholder: 'Millie Bobby Brown, Finn Wolfhard, ...',
      icon: Users,
      error: errors.acteurs
    },
    {
      name: 'dateSortie' as keyof SeriesFormData,
      label: 'Date de sortie',
      type: 'date' as const,
      icon: Calendar,
      error: errors.dateSortie
    }
  ];

  // Configuration des champs pour la deuxième rangée
  const secondaryFields = [
    {
      name: 'pays' as keyof SeriesFormData,
      label: "Pays d'origine",
      type: 'text' as const,
      placeholder: 'États-Unis',
      icon: Globe,
      error: errors.pays
    },
    {
      name: 'langue' as keyof SeriesFormData,
      label: 'Langue originale',
      type: 'text' as const,
      placeholder: 'Anglais',
      icon: Volume2,
      error: errors.langue
    },
    {
      name: 'classification' as keyof SeriesFormData,
      label: 'Classification',
      type: 'select' as const,
      placeholder: 'Classification',
      icon: Hash,
      options: classificationOptions,
      error: errors.classification
    }
  ];

  // Configuration des champs pour la troisième rangée
  const numberFields = [
    {
      name: 'nbSaisons' as keyof SeriesFormData,
      label: 'Nombre de saisons',
      type: 'number' as const,
      icon: Play,
      error: errors.nbSaisons
    },
    {
      name: 'nbEpisodes' as keyof SeriesFormData,
      label: 'Nombre d\'épisodes',
      type: 'number' as const,
      icon: Play,
      error: errors.nbEpisodes
    },
    {
      name: 'statut' as keyof SeriesFormData,
      label: 'Statut',
      type: 'select' as const,
      placeholder: 'Statut',
      icon: Star,
      options: statutOptions,
      error: errors.statut
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Créer une série"
        subtitle="Ajoutez une nouvelle série à la bibliothèque"
        icon={Tv}
        isDarkMode={isDarkMode}
      />

      <ThemedCard 
        moduleName="series" 
        title="Création d'une nouvelle série" 
        subtitle="Remplissez les informations de la série à créer"
        hoverable={true}
        useAdvancedHover={true}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {basicFields.map((field) => (
              <ThemedField
                key={field.name}
                moduleName="series"
                label={field.label}
                type={field.type}
                value={String(formData[field.name])}
                onChange={(value) => {
                  updateField(field.name, value as any);
                  if (errors[field.name]) setErrors(prev => ({...prev, [field.name]: ''}));
                }}
                placeholder={field.placeholder}
                required={field.required}
                icon={field.icon}
                options={field.options}
                error={field.error}
                useAdvancedFocus={true}
                useModernBorder={true}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {secondaryFields.map((field) => (
              <ThemedField
                key={field.name}
                moduleName="series"
                label={field.label}
                type={field.type}
                value={String(formData[field.name])}
                onChange={(value) => {
                  updateField(field.name, value as any);
                  if (errors[field.name]) setErrors(prev => ({...prev, [field.name]: ''}));
                }}
                placeholder={field.placeholder}
                icon={field.icon}
                options={field.options}
                error={field.error}
                useAdvancedFocus={true}
                useModernBorder={true}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {numberFields.map((field) => (
              <ThemedField
                key={field.name}
                moduleName="series"
                label={field.label}
                type={field.type}
                value={String(formData[field.name])}
                onChange={(value) => {
                  updateField(field.name, field.type === 'number' ? Number(value) || (field.name === 'nbSaisons' ? 1 : 0) : value);
                  if (errors[field.name]) setErrors(prev => ({...prev, [field.name]: ''}));
                }}
                icon={field.icon}
                options={field.options}
                error={field.error}
                useAdvancedFocus={true}
                useModernBorder={true}
              />
            ))}
          </div>

          <ThemedField
            moduleName="series"
            label="Synopsis"
            type="textarea"
            value={formData.synopsis}
            onChange={(value) => {
              updateField('synopsis', value);
              if (errors.synopsis) setErrors(prev => ({...prev, synopsis: ''}));
            }}
            placeholder="Quand un jeune garçon disparaît..."
            rows={4}
            icon={AlignLeft}
            useAdvancedFocus={true}
            useModernBorder={true}
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold tracking-wide text-violet-600">
                URL de la miniature
              </label>
              <div className="flex gap-2">
                <ThemedField
                  moduleName="series"
                  label=""
                  type="text"
                  value={formData.miniature}
                  onChange={(value) => {
                    updateField('miniature', value);
                    if (errors.miniature) setErrors(prev => ({...prev, miniature: ''}));
                  }}
                  placeholder="https://..."
                  icon={Upload}
                  error={errors.miniature}
                  useAdvancedFocus={true}
                  useModernBorder={true}
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
                  <Upload className="h-4 w-4" />
                </ThemedButton>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <ThemedButton
              moduleName="series"
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer la série
            </ThemedButton>

            <ThemedButton
              moduleName="series"
              variant="secondary"
              type="button"
              onClick={() => {
                // Reset logic
                setFormData({
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
                  statut: 'en_cours',
                });
                setErrors({});
              }}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              Réinitialiser
            </ThemedButton>
          </div>
        </form>
      </ThemedCard>
    </PageContainer>
  );
}