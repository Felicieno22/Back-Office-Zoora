import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Upload, Loader2, ArrowLeft, Globe, Languages, ShieldCheck, Clock, Plus, Save, FileText, AlignLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../utils/api';
import { ThemedCard } from '../../components/ui/ThemedCard';
import { ThemedField } from '../../components/ui/ThemedField';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { ThemedIcon } from '../../components/ui/ThemedIcon';
import { PageContainer } from '../../components/shared/SharedLayout';
import { dropdownDataService, useConstantData, Genre } from '../../services/dropdownDataService';

export function FilmsCreate({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Récupération des genres (avec mise en cache via useConstantData)
  const { data: genres, loading: genresLoading } = useConstantData<Genre>(
    () => dropdownDataService.getGenres()
  );

  const [formData, setFormData] = useState({
    titre: '',
    synopsis: '',
    dateSortie: new Date().toISOString().split('T')[0],
    sousTitre: '',
    typeFilm: 'long-metrage',
    muxPlaybackId: '',
    muxAssetId: '',
    duree: '', // Saisie en minutes par l'utilisateur
    miniature: '',
    genre: '',
    realisateur: '',
    acteurs: '',
    pays: '',
    langue: '',
    classification: 'tout-public',
    muxStatus: 'preparing'
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper pour transformer les minutes en format DTO 'HH:mm:ss'
  const formatDurationToDTO = (mins: string) => {
    const totalMinutes = parseInt(mins) || 0;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation minimale côté client
    if (!formData.titre || !formData.muxPlaybackId) {
      toast.error('Le titre et le Playback ID sont obligatoires');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Création du film...");

    try {
      const payload = {
        ...formData,
        duree: formatDurationToDTO(formData.duree), // Conversion conforme à CreateFilmDto
      };

      // POST /films (admin + moderator uniquement)
      await apiRequest('/api/films', {
        method: 'POST',
        data: payload
      });

      toast.success('Film ajouté au catalogue !', { id: toastId });
      navigate('/admin/films');
    } catch (error) {
      console.error('Erreur creation:', error);
      toast.error('Erreur lors de la création du film', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="flex items-center gap-4 mb-6">
        <ThemedButton 
          moduleName="films"
          variant="secondary"
          onClick={() => navigate('/admin/films')} 
          useGradient={true}
          useHoverScale={true}
          useAdvancedShadow={true}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
        </ThemedButton>
      </div>

      <ThemedCard
        moduleName="films"
        hoverable={true}
        useAdvancedHover={true}
      >
        <div className="flex items-center gap-4 mb-6">
          <ThemedIcon 
            moduleName="films" 
            icon={Film} 
            size="lg" 
            variant="gradient"
            useHover={true}
          />
          <div>
            <h1 className="text-2xl font-bold mb-2">Ajouter un nouveau film</h1>
            <p className="text-sm text-gray-600">Remplissez les informations pour publier une œuvre sur la plateforme</p>
          </div>
        </div>
      </ThemedCard>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
        {/* SECTION 1 : INFORMATIONS DE BASE */}
        <ThemedCard 
          moduleName="films" 
          title="Informations Générales" 
          subtitle="Informations de base sur le film"
          hoverable={true}
          useAdvancedHover={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ThemedField
              moduleName="films"
              label="Titre du film *"
              type="text"
              value={formData.titre}
              onChange={(value) => handleChange('titre', value)}
              placeholder="Ex: Le Titan"
              required
              icon={FileText}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="films"
              label="Genre"
              type="select"
              value={formData.genre}
              onChange={(value) => handleChange('genre', value)}
              placeholder={genresLoading ? "Chargement..." : "Sélectionner un genre"}
              options={genres?.map((g) => ({ value: g.nom, label: g.nom })) || []}
              icon={Globe}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="films"
              label="Type de métrage"
              type="select"
              value={formData.typeFilm}
              onChange={(value) => handleChange('typeFilm', value)}
              options={[
                { value: 'long-metrage', label: 'Long-métrage' },
                { value: 'court-metrage', label: 'Court-métrage' },
                { value: 'moyen-metrage', label: 'Moyen-métrage' }
              ]}
              icon={Film}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="films"
              label="Date de sortie"
              type="date"
              value={formData.dateSortie}
              onChange={(value) => handleChange('dateSortie', value)}
              icon={Clock}
              useAdvancedFocus={true}
              useModernBorder={true}
            />
          </div>

          <div className="mt-6">
            <ThemedField
              moduleName="films"
              label="Synopsis"
              type="textarea"
              value={formData.synopsis}
              onChange={(value) => handleChange('synopsis', value)}
              placeholder="Décrivez l'histoire du film..."
              icon={AlignLeft}
              rows={4}
              useAdvancedFocus={true}
              useModernBorder={true}
            />
          </div>
        </ThemedCard>

        {/* SECTION 2 : TECHNIQUE & MÉDIA */}
        <ThemedCard 
          moduleName="films" 
          title="Média & Mux" 
          subtitle="Paramètres techniques et média"
          hoverable={true}
          useAdvancedHover={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ThemedField
              moduleName="films"
              label="Durée (en minutes)"
              type="number"
              value={formData.duree}
              onChange={(value) => handleChange('duree', value)}
              placeholder="Ex: 125"
              icon={Clock}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="films"
              label="Mux Playback ID *"
              type="text"
              value={formData.muxPlaybackId}
              onChange={(value) => handleChange('muxPlaybackId', value)}
              placeholder="ID de lecture Mux"
              required
              className="md:col-span-2"
              icon={Film}
              useAdvancedFocus={true}
              useModernBorder={true}
            />
          </div>

          <div className="mt-6">
            <ThemedField
              moduleName="films"
              label="URL de la miniature (Poster)"
              type="url"
              value={formData.miniature}
              onChange={(value) => handleChange('miniature', value)}
              placeholder="https://image-url.com/poster.jpg"
              icon={Upload}
              useAdvancedFocus={true}
              useModernBorder={true}
            />
          </div>
        </ThemedCard>

        {/* SECTION 3 : PRODUCTION & CLASSIFICATION */}
        <ThemedCard 
          moduleName="films" 
          title="Production & Classification" 
          subtitle="Informations sur la production et classification"
          hoverable={true}
          useAdvancedHover={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <Globe className="w-4 h-4" /> <span>Pays & Langue</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ThemedField
                    moduleName="films"
                    label="Pays"
                    type="text"
                    value={formData.pays}
                    onChange={(value) => handleChange('pays', value)}
                    placeholder="Pays (ex: France)"
                    icon={Globe}
                    useAdvancedFocus={true}
                    useModernBorder={true}
                  />
                  <ThemedField
                    moduleName="films"
                    label="Langue"
                    type="text"
                    value={formData.langue}
                    onChange={(value) => handleChange('langue', value)}
                    placeholder="Langue"
                    icon={Languages}
                    useAdvancedFocus={true}
                    useModernBorder={true}
                  />
                </div>
              </div>
              <ThemedField
                moduleName="films"
                label="Réalisateur"
                type="text"
                value={formData.realisateur}
                onChange={(value) => handleChange('realisateur', value)}
                placeholder="Nom du réalisateur"
                icon={Film}
                useAdvancedFocus={true}
                useModernBorder={true}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <ShieldCheck className="w-4 h-4" /> <span>Classification</span>
                </div>
                <ThemedField
                  moduleName="films"
                  label="Classification"
                  type="select"
                  value={formData.classification}
                  onChange={(value) => handleChange('classification', value)}
                  options={[
                    { value: 'tout-public', label: 'Tout Public' },
                    { value: 'interdit-12', label: 'Interdit -12 ans' },
                    { value: 'interdit-16', label: 'Interdit -16 ans' },
                    { value: 'interdit-18', label: 'Interdit -18 ans' }
                  ]}
                  icon={ShieldCheck}
                  useAdvancedFocus={true}
                  useModernBorder={true}
                />
              </div>
              <ThemedField
                moduleName="films"
                label="Acteurs"
                type="text"
                value={formData.acteurs}
                onChange={(value) => handleChange('acteurs', value)}
                placeholder="Jean Dupont, Marie Curie..."
                icon={Film}
                useAdvancedFocus={true}
                useModernBorder={true}
              />
            </div>
          </div>
        </ThemedCard>

        {/* BOUTONS D'ACTION */}
        <div className="flex justify-end gap-3 pt-4">
          <ThemedButton
            moduleName="films"
            variant="secondary"
            type="button"
            onClick={() => navigate('/admin/films')}
            useGradient={true}
            useHoverScale={true}
            useAdvancedShadow={true}
          >
            Annuler
          </ThemedButton>
          <ThemedButton
            moduleName="films"
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            useGradient={true}
            useHoverScale={true}
            useAdvancedShadow={true}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Publier le film
          </ThemedButton>
        </div>
      </form>
    </PageContainer>
  );
}