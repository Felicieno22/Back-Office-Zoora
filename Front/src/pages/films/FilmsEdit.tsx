import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Film, Upload, Loader2, ArrowLeft, Globe, Languages, ShieldCheck, Clock, Save, Users, FileText, AlignLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../utils/api';
import { ThemedCard } from '../../components/ui/ThemedCard';
import { ThemedField } from '../../components/ui/ThemedField';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { ThemedIcon } from '../../components/ui/ThemedIcon';
import { PageContainer } from '../../components/shared/SharedLayout';
import { dropdownDataService, useConstantData, Genre } from '../../services/dropdownDataService';

export function FilmsEdit({ isDarkMode }: { isDarkMode: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cache pour les genres
  const { data: genres, loading: genresLoading } = useConstantData<Genre>(
    () => dropdownDataService.getGenres()
  );

  const [formData, setFormData] = useState({
    titre: '',
    synopsis: '',
    dateSortie: '',
    sousTitre: '',
    typeFilm: 'long-metrage',
    muxPlaybackId: '',
    muxAssetId: '',
    duree: '', // Minutes pour l'UI
    miniature: '',
    genre: '',
    realisateur: '',
    acteurs: '',
    pays: '',
    langue: '',
    classification: 'tout-public',
    muxStatus: 'preparing'
  });

  // 1. Charger les données via l'endpoint spécifique d'édition
  useEffect(() => {
    const fetchFilmData = async () => {
      try {
        // Utilisation de ton endpoint : GET /films/edit/:id
        const film = await apiRequest(`/api/films/edit/${id}`, { method: 'GET' });
        
        // Conversion de la durée 'HH:mm:ss' (Backend) vers Minutes (Frontend)
        let durationInMinutes = "0";
        if (film.duree && typeof film.duree === 'string' && film.duree.includes(':')) {
          const [h, m] = film.duree.split(':');
          durationInMinutes = (parseInt(h) * 60 + parseInt(m)).toString();
        } else if (typeof film.duree === 'number') {
          durationInMinutes = film.duree.toString();
        }

        setFormData({
          ...film,
          duree: durationInMinutes,
          dateSortie: film.dateSortie ? film.dateSortie.split('T')[0] : '',
          // S'assurer que les acteurs sont une chaîne pour le champ texte
          acteurs: Array.isArray(film.acteurs) ? film.acteurs.join(', ') : (film.acteurs || '')
        });
      } catch (error) {
        toast.error("Erreur lors de la récupération des données du film");
        navigate('/admin/films');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchFilmData();
  }, [id, navigate]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 2. Formater la durée pour le UpdateFilmDto (HH:mm:ss)
  const formatDurationToDTO = (mins: string) => {
    const totalMinutes = parseInt(mins) || 0;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Mise à jour en cours...");

    try {
      const payload = {
        ...formData,
        duree: formatDurationToDTO(formData.duree),
        // On renvoie l'ID dans le payload si ton DTO l'exige
      };

      // Utilisation de ton endpoint : PUT /films/:id
      await apiRequest(`/api/films/${id}`, {
        method: 'PUT',
        data: payload
      });

      toast.success('Film mis à jour avec succès !', { id: toastId });
      navigate('/admin/films');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold mb-2">Modifier : {formData.titre}</h1>
            <p className="text-sm text-gray-600">Mise à jour des métadonnées et fichiers média</p>
          </div>
        </div>
      </ThemedCard>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BLOC 1 : GÉNÉRAL */}
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
              label="Titre du film"
              type="text"
              value={formData.titre}
              onChange={(value) => handleChange('titre', value)}
              required
              icon={FileText}
            />
            <ThemedField
              moduleName="films"
              label="Genre"
              type="select"
              value={formData.genre}
              onChange={(value) => handleChange('genre', value)}
              placeholder={genresLoading ? "Chargement..." : "Choisir un genre"}
              options={genres?.map((g) => ({ value: g.nom, label: g.nom })) || []}
              icon={Globe}
            />
          </div>
          <div className="mt-4">
            <ThemedField
              moduleName="films"
              label="Synopsis"
              type="textarea"
              value={formData.synopsis}
              onChange={(value) => handleChange('synopsis', value)}
              icon={AlignLeft}
              rows={4}
            />
          </div>
        </ThemedCard>

        {/* BLOC 2 : TECHNIQUE & MUX */}
        <ThemedCard moduleName="films" title="Configuration Mux & Durée" subtitle="Paramètres techniques et média">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ThemedField
              moduleName="films"
              label="Durée (minutes)"
              type="number"
              value={formData.duree}
              onChange={(value) => handleChange('duree', value)}
              icon={Clock}
            />
            <ThemedField
              moduleName="films"
              label="Mux Playback ID"
              type="text"
              value={formData.muxPlaybackId}
              onChange={(value) => handleChange('muxPlaybackId', value)}
              required
              className="md:col-span-2"
              icon={Film}
            />
          </div>
        </ThemedCard>

        {/* BLOC 3 : CASTING & INFOS */}
        <ThemedCard moduleName="films" title="Casting & Informations" subtitle="Informations sur la production">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ThemedField
                moduleName="films"
                label="Réalisateur"
                type="text"
                value={formData.realisateur}
                onChange={(value) => handleChange('realisateur', value)}
                icon={Film}
              />
              <ThemedField
                moduleName="films"
                label="Acteurs (séparés par des virgules)"
                type="text"
                value={formData.acteurs}
                onChange={(value) => handleChange('acteurs', value)}
                placeholder="Acteur 1, Acteur 2..."
                icon={Users}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" /> <span>Pays & Langue</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ThemedField
                    moduleName="films"
                    label="Pays"
                    type="text"
                    value={formData.pays}
                    onChange={(value) => handleChange('pays', value)}
                    placeholder="Pays"
                    icon={Globe}
                  />
                  <ThemedField
                    moduleName="films"
                    label="Langue"
                    type="text"
                    value={formData.langue}
                    onChange={(value) => handleChange('langue', value)}
                    placeholder="Langue"
                    icon={Languages}
                  />
                </div>
              </div>
              <ThemedField
                moduleName="films"
                label="Classification"
                type="select"
                value={formData.classification}
                onChange={(value) => handleChange('classification', value)}
                options={[
                  { value: 'tout-public', label: 'Tout Public' },
                  { value: 'interdit-12', label: 'Interdit -12' },
                  { value: 'interdit-16', label: 'Interdit -16' },
                  { value: 'interdit-18', label: 'Interdit -18' }
                ]}
                icon={ShieldCheck}
              />
            </div>
          </div>
        </ThemedCard>

        {/* ACTIONS FINALES */}
        <div className="flex justify-end gap-3 pt-6">
          <ThemedButton
            moduleName="films"
            variant="secondary"
            type="button"
            onClick={() => navigate('/admin/films')}
            disabled={isSubmitting}
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
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> 
                Enregistrer les modifications
              </>
            )}
          </ThemedButton>
        </div>
      </form>
    </PageContainer>
  );
}