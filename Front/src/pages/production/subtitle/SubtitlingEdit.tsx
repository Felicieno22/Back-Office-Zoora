import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Film, Tv, Globe, Link, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest, getContenus, getEpisodes } from '../../../utils/api';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { PageContainer } from '../../../components/shared/SharedLayout';

export function SubtitlingEdit({ isDarkMode }: { isDarkMode: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idContenu: '',
    idEpisode: '',
    langue: '',
    urlFichier: '',
    estForce: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [contenus, setContenus] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDropdownData();
    loadSubtitlingData();
  }, []);

  const loadDropdownData = async () => {
    try {
      const [contenusData, episodesData] = await Promise.all([
        getContenus(),
        getEpisodes()
      ]);

      setContenus(contenusData);
      setEpisodes(episodesData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

  const loadSubtitlingData = async () => {
    try {
      setIsLoading(true);
      const subtitlingData = await apiRequest(`/api/soustitrages/${id}`, { method: 'GET' });
      
      setFormData({
        idContenu: subtitlingData.idContenu ? String(subtitlingData.idContenu) : '',
        idEpisode: subtitlingData.idEpisode ? String(subtitlingData.idEpisode) : '',
        langue: subtitlingData.langue || '',
        urlFichier: subtitlingData.urlFichier || '',
        estForce: Boolean(subtitlingData.estForce)
      });
    } catch (error) {
      console.error('Erreur chargement sous-titrage:', error);
      toast.error('Erreur lors du chargement des données du sous-titrage');
      navigate('/admin/production/subtitles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.idContenu && !formData.idEpisode) {
      newErrors.idContenu = 'Un contenu ou un épisode doit être sélectionné';
    }
    
    if (!formData.langue.trim()) {
      newErrors.langue = 'La langue est requise';
    }
    
    if (!formData.urlFichier.trim()) {
      newErrors.url_fichier = 'L\'URL du fichier est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        idContenu: formData.idContenu ? Number(formData.idContenu) : null,
        idEpisode: formData.idEpisode ? Number(formData.idEpisode) : null,
        langue: formData.langue,
        urlFichier: formData.urlFichier,
        estForce: formData.estForce
      };

      await apiRequest(`/api/soustitres/${id}`, {
        method: 'PUT',
        data: payload
      });

      toast.success('Sous-titrage mis à jour avec succès !');
      navigate('/admin/production/subtitles');
    } catch (error) {
      console.error('Erreur mise à jour sous-titrage:', error);
      toast.error('Erreur lors de la mise à jour du sous-titrage');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-sm text-muted-foreground">Chargement des données...</p>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center gap-4 mb-6">
        <ThemedButton 
          moduleName="production"
          variant="secondary"
          onClick={() => navigate('/admin/production/subtitles')}
          useGradient={true}
          useHoverScale={true}
          useAdvancedShadow={true}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
        </ThemedButton>
      </div>

      <ThemedCard
        moduleName="production"
        hoverable={true}
        useAdvancedHover={true}
      >
        <h1 className="text-2xl font-bold mb-2">Modifier le sous-titrage</h1>
        <p className="text-sm text-gray-600 mb-4">Mettez à jour les informations du fichier de sous-titres</p>
      </ThemedCard>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <ThemedCard 
          moduleName="production" 
          title="Détails du sous-titrage" 
          subtitle="Informations sur le fichier de sous-titres"
          hoverable={true}
          useAdvancedHover={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ThemedField
              moduleName="production"
              label="Contenu"
              type="select"
              value={formData.idContenu}
              onChange={(value) => {
                handleChange('idContenu', value);
                // Clear episode if content is selected
                if (value) handleChange('idEpisode', '');
              }}
              placeholder="Sélectionnez un contenu (optionnel)"
              options={contenus.map(c => ({ 
                value: String(c.id), 
                label: c.titre || c.nom,
                key: c.id ? `contenu-${c.id}` : `contenu-${Math.random()}` // ✅ Clé unique
              }))}
              icon={Film}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Épisode"
              type="select"
              value={formData.idEpisode}
              onChange={(value) => {
                handleChange('idEpisode', value);
                // Clear content if episode is selected (as per constraint)
                if (value) handleChange('idContenu', '');
              }}
              placeholder="Sélectionnez un épisode (optionnel)"
              options={episodes.map(e => ({ 
                value: String(e.id), 
                label: `${e.nom} - ${e.saison_numero}x${e.numero}`,
                key: e.id ? `episode-${e.id}` : `episode-${Math.random()}` // ✅ Clé unique
              }))}
              icon={Tv}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Langue *"
              type="text"
              value={formData.langue}
              onChange={(value) => handleChange('langue', value)}
              placeholder="Ex: fr, en, es"
              icon={Globe}
              error={errors.langue}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="URL du fichier *"
              type="url"
              value={formData.urlFichier}
              onChange={(value) => handleChange('urlFichier', value)}
              placeholder="https://example.com/subtitles.vtt"
              icon={Link}
              error={errors.url_fichier}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.estForce}
                  onChange={(e) => handleChange('estForce', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Sous-titres forcés</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Les sous-titres seront toujours affichés</p>
            </div>
          </div>
        </ThemedCard>

        <div className="flex justify-end gap-3 pt-4">
          <ThemedButton
            moduleName="production"
            variant="secondary"
            type="button"
            onClick={() => navigate('/admin/production/subtitles')}
            useGradient={true}
            useHoverScale={true}
            useAdvancedShadow={true}
          >
            Annuler
          </ThemedButton>
          <ThemedButton
            moduleName="production"
            variant="primary"
            type="submit"
            useGradient={true}
            useHoverScale={true}
            useAdvancedShadow={true}
          >
            <Save className="w-4 h-4 mr-2" />
            Mettre à jour
          </ThemedButton>
        </div>
      </form>
    </PageContainer>
  );
}