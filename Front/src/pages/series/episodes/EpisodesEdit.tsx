import React, { useState, useEffect } from 'react';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { FileText, AlignLeft, Calendar, Image, Activity, Globe, Clock, Save, ArrowLeft, Play } from 'lucide-react';
import { Episode, ContentStatus, MuxStatus } from '../../../types/base';
import { apiRequest } from '../../../utils/api';

interface EpisodesEditProps {
  isDarkMode?: boolean;
  episodeId?: number;
}

export function EpisodesEdit({ isDarkMode = true, episodeId }: EpisodesEditProps) {
  const [formData, setFormData] = useState({
    id_saison: 0,
    numero_episode: 1,
    titre: '',
    synopsis: '',
    duree: '',
    mux_asset_id: '',
    mux_playback_id: '',
    mux_status: 'preparing' as MuxStatus,
    mux_poster_url: '',
    date_sortie: '',
    statut: 'en_attente' as ContentStatus
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [saisons, setSaisons] = useState<Array<{id_saison: number, numero_saison: number, serie: {titre: string}}>>([]);

  // Charger les données de l'épisode
  useEffect(() => {
    if (episodeId) {
      loadEpisodeData();
    }
    loadSaisons();
  }, [episodeId]);

  const loadEpisodeData = async () => {
    try {
      setLoadingData(true);
      const episode = await apiRequest(`/episodes/${episodeId}`);
      setFormData({
        id_saison: episode.id_saison,
        numero_episode: episode.numero_episode,
        titre: episode.titre,
        synopsis: episode.synopsis || '',
        duree: episode.duree || '',
        mux_asset_id: episode.mux_asset_id || '',
        mux_playback_id: episode.mux_playback_id,
        mux_status: episode.mux_status,
        mux_poster_url: episode.mux_poster_url || '',
        date_sortie: episode.date_sortie || '',
        statut: episode.statut
      });
    } catch (error) {
      console.error('Erreur lors du chargement de l\'épisode:', error);
      alert('Erreur lors du chargement de l\'épisode');
    } finally {
      setLoadingData(false);
    }
  };

  const loadSaisons = async () => {
    try {
      const data = await apiRequest('/api/seasons');
      if (Array.isArray(data)) {
        setSaisons(data.map((s: any) => ({ 
          id_saison: s.id_saison, 
          numero_saison: s.numero_saison,
          serie: { titre: s.serie?.titre || 'Série inconnue' }
        })));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des saisons:', error);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!episodeId) {
      alert('ID d\'épisode invalide');
      return;
    }

    setLoading(true);
    
    try {
      await apiRequest(`/episodes/${episodeId}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      
      alert('Épisode mis à jour avec succès !');
      window.dispatchEvent(new CustomEvent('tabChange', { detail: 'episodes-list' }));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour de l\'épisode');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ThemedButton
            moduleName="episodes"
            variant="secondary"
            onClick={() => window.dispatchEvent(new CustomEvent('tabChange', { detail: 'episodes-list' }))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </ThemedButton>
          
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Modifier l'Épisode
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
              Éditer les informations de l'épisode #{episodeId}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <ThemedCard moduleName="episodes" title="Informations de l'Épisode" className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
              <ThemedField
                moduleName="episodes"
                label="Saison *"
                type="select"
                value={formData.id_saison.toString()}
                onChange={(value: string) => handleChange('id_saison', parseInt(value))}
                options={saisons.map(saison => ({ value: saison.id_saison.toString(), label: `Saison ${saison.numero_saison} - ${saison.serie.titre}` }))}
                placeholder="Sélectionnez une saison"
                disabled={true}
                icon={Globe}
              />
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                La saison ne peut pas être modifiée après création
              </p>

              <ThemedField
                moduleName="episodes"
                label="Numéro d'Épisode *"
                type="number"
                value={formData.numero_episode.toString()}
                onChange={(value: string) => handleChange('numero_episode', parseInt(value) || 1)}
                required={true}
                icon={Calendar}
              />

              <ThemedField
                moduleName="episodes"
                label="Titre de l'Épisode *"
                type="text"
                value={formData.titre}
                onChange={(value: string) => handleChange('titre', value)}
                placeholder="Ex: Le Premier Contact"
                required={true}
                icon={FileText}
              />

              <ThemedField
                moduleName="episodes"
                label="Synopsis"
                type="textarea"
                value={formData.synopsis}
                onChange={(value: string) => handleChange('synopsis', value)}
                placeholder="Résumé de l'épisode..."
                rows={4}
                icon={AlignLeft}
              />

              <ThemedField
                moduleName="episodes"
                label="Durée (HH:MM:SS)"
                type="text"
                value={formData.duree}
                onChange={(value: string) => handleChange('duree', value)}
                placeholder="00:45:30"
                icon={Clock}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ThemedField
                  moduleName="episodes"
                  label="MUX Asset ID"
                  type="text"
                  value={formData.mux_asset_id}
                  onChange={(value: string) => handleChange('mux_asset_id', value)}
                  placeholder="asset_..."
                />
                <ThemedField
                  moduleName="episodes"
                  label="MUX Playback ID *"
                  type="text"
                  value={formData.mux_playback_id}
                  onChange={(value: string) => handleChange('mux_playback_id', value)}
                  placeholder="play_..."
                  required={true}
                />
              </div>

              <ThemedField
                moduleName="episodes"
                label="URL de l'Affiche MUX"
                type="text"
                value={formData.mux_poster_url}
                onChange={(value: string) => handleChange('mux_poster_url', value)}
                placeholder="https://image.mux.com/..."
              />

              <ThemedField
                moduleName="episodes"
                label="Statut MUX"
                type="select"
                value={formData.mux_status}
                onChange={(value: string) => handleChange('mux_status', value as MuxStatus)}
                options={[
                  { value: 'preparing', label: 'Préparation' },
                  { value: 'ready', label: 'Prêt' },
                  { value: 'errored', label: 'Erreur' },
                  { value: 'deleted', label: 'Supprimé' }
                ]}
              />

              <ThemedField
                moduleName="episodes"
                label="Date de Sortie"
                type="date"
                value={formData.date_sortie}
                onChange={(value: string) => handleChange('date_sortie', value)}
              />

              <ThemedField
                moduleName="episodes"
                label="Statut"
                type="select"
                value={formData.statut}
                onChange={(value: string) => handleChange('statut', value as ContentStatus)}
                options={[
                  { value: 'en_attente', label: 'En Attente' },
                  { value: 'approuve', label: 'Approuvé' },
                  { value: 'rejete', label: 'Rejeté' }
                ]}
              />

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <ThemedButton 
                  moduleName="episodes"
                  type="submit" 
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer les Modifications
                    </>
                  )}
                </ThemedButton>
                
                <ThemedButton 
                  moduleName="episodes"
                  variant="secondary"
                  onClick={() => window.dispatchEvent(new CustomEvent('tabChange', { detail: 'episodes-list' }))}
                >
                  Annuler
                </ThemedButton>
              </div>
            </form>
          </ThemedCard>
      </div>
    </div>
  );
}