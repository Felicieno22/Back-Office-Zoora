import React, { useState, useEffect } from 'react';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { FileText, AlignLeft, Calendar, Image, Activity, Globe, Clock, Upload, Save, ArrowLeft, Play } from 'lucide-react';
import { Episode, ContentStatus, MuxStatus } from '../../../types/base';
import { apiRequest } from '../../../utils/api';

interface EpisodesCreateProps {
  isDarkMode?: boolean;
}

export function EpisodesCreate({ isDarkMode = true }: EpisodesCreateProps) {
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
  const [saisons, setSaisons] = useState<Array<{id_saison: number, numero_saison: number, serie: {titre: string}}>>([]);

  // Charger les saisons disponibles
  useEffect(() => {
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
    loadSaisons();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.id_saison === 0) {
      alert('Veuillez sélectionner une saison');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiRequest('/api/episodes', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      alert('Épisode créé avec succès !');
      window.dispatchEvent(new CustomEvent('tabChange', { detail: 'episodes-list' }));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de l\'épisode');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-8 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ThemedButton
            moduleName="episodes"
            variant="secondary"
            onClick={() => window.dispatchEvent(new CustomEvent('tabChange', { detail: 'episodes-list' }))}
            useGradient={true}
            useHoverScale={true}
            useAdvancedShadow={true}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </ThemedButton>
          
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Créer un Épisode
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
              Ajouter un nouvel épisode à une saison
            </p>
          </div>
        </div>

        {/* Form Card */}
        <ThemedCard 
          moduleName="episodes" 
          title="Informations de l'Épisode" 
          className="pt-6"
          hoverable={true}
          useAdvancedHover={true}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <ThemedField
                moduleName="series"
                label="Saison *"
                type="select"
                value={formData.id_saison.toString()}
                onChange={(value: string) => handleChange('id_saison', parseInt(value))}
                options={saisons.map(saison => ({ value: saison.id_saison.toString(), label: `Saison ${saison.numero_saison} - ${saison.serie.titre}` }))}
                placeholder="Sélectionnez une saison"
                required={true}
                icon={Globe}
                useAdvancedFocus={true}
                useModernBorder={true}
              />

              <ThemedField
                moduleName="series"
                label="Numéro d'Épisode *"
                type="number"
                value={formData.numero_episode.toString()}
                onChange={(value: string) => handleChange('numero_episode', parseInt(value) || 1)}
                required={true}
                icon={Calendar}
                useAdvancedFocus={true}
                useModernBorder={true}
              />

              <ThemedField
                moduleName="series"
                label="Titre de l'Épisode *"
                type="text"
                value={formData.titre}
                onChange={(value: string) => handleChange('titre', value)}
                placeholder="Ex: Le Premier Contact"
                required={true}
                icon={FileText}
                useAdvancedFocus={true}
                useModernBorder={true}
              />

              <ThemedField
                moduleName="series"
                label="Synopsis"
                type="textarea"
                value={formData.synopsis}
                onChange={(value: string) => handleChange('synopsis', value)}
                placeholder="Résumé de l'épisode..."
                icon={AlignLeft}
                useAdvancedFocus={true}
                useModernBorder={true}
              />

              <ThemedField
                moduleName="episodes"
                label="Durée (HH:MM:SS)"
                type="text"
                value={formData.duree}
                onChange={(value: string) => handleChange('duree', value)}
                placeholder="00:45:30"
                icon={Clock}
                useAdvancedFocus={true}
                useModernBorder={true}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ThemedField
                  moduleName="episodes"
                  label="MUX Asset ID"
                  type="text"
                  value={formData.mux_asset_id}
                  onChange={(value: string) => handleChange('mux_asset_id', value)}
                  placeholder="asset_..."
                  useAdvancedFocus={true}
                  useModernBorder={true}
                />
                <ThemedField
                  moduleName="episodes"
                  label="MUX Playback ID *"
                  type="text"
                  value={formData.mux_playback_id}
                  onChange={(value: string) => handleChange('mux_playback_id', value)}
                  placeholder="play_..."
                  useAdvancedFocus={true}
                  useModernBorder={true}
                />
              </div>

              <ThemedField
                moduleName="episodes"
                label="URL de l'Affiche MUX"
                type="text"
                value={formData.mux_poster_url}
                onChange={(value: string) => handleChange('mux_poster_url', value)}
                placeholder="https://image.mux.com/..."
                useAdvancedFocus={true}
                useModernBorder={true}
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
                useAdvancedFocus={true}
                useModernBorder={true}
              />

              <ThemedField
                moduleName="episodes"
                label="Date de Sortie"
                type="date"
                value={formData.date_sortie}
                onChange={(value: string) => handleChange('date_sortie', value)}
                useAdvancedFocus={true}
                useModernBorder={true}
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
                useAdvancedFocus={true}
                useModernBorder={true}
              />

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <ThemedButton 
                  moduleName="episodes"
                  type="submit" 
                  variant="primary"
                  disabled={loading}
                  useGradient={true}
                  useHoverScale={true}
                  useAdvancedShadow={true}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Créer l'Épisode
                    </>
                  )}
                </ThemedButton>
                
                <ThemedButton 
                  moduleName="episodes"
                  variant="secondary"
                  onClick={() => window.dispatchEvent(new CustomEvent('tabChange', { detail: 'episodes-list' }))}
                  useGradient={true}
                  useHoverScale={true}
                  useAdvancedShadow={true}
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