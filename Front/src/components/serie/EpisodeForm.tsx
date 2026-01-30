/**
 * EpisodeForm - Formulaire de création/édition Episode
 * Single Responsibility: Formulaire pour Episode
 * Différent de SeasonForm: champs spécifiques Mux
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { EpisodeFormProps, EpisodeFormData, Episode } from '../../types/base';
import { CONTENT_STATUS_OPTIONS, MUX_STATUS_OPTIONS, VALIDATION_MESSAGES } from '../../constants/base';
import { formatEpisodeForApi } from '../../utils/baseMappers';
import { useApi } from '../../hooks/useApi';
import { apiRequest } from '../../utils/api';

export function EpisodeForm({
  seasonId,
  isOpen,
  onClose,
  onSuccess,
  onError,
  isDarkMode = false
}: EpisodeFormProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<EpisodeFormData>({
    id_saison: seasonId,
    numero_episode: 1,
    titre: '',
    synopsis: '',
    duree: '00:00:00',
    mux_asset_id: '',
    mux_playback_id: '',
    mux_status: 'preparing',
    mux_poster_url: '',
    date_sortie: '',
    statut: 'en_attente'
  });

  const handleChange = (field: keyof EpisodeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.numero_episode || formData.numero_episode <= 0) {
      newErrors.numero_episode = VALIDATION_MESSAGES.EPISODE_NUMBER_MIN;
    }
    if (!formData.titre) {
      newErrors.titre = VALIDATION_MESSAGES.TITLE_REQUIRED;
    }
    if (!formData.mux_playback_id) {
      newErrors.mux_playback_id = VALIDATION_MESSAGES.MUX_PLAYBACK_ID_REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const apiData = formatEpisodeForApi(formData);
      const response = await apiRequest('/api/episodes', { method: 'POST', data: apiData });
      
      onSuccess?.(response.data as Episode);
      setFormData({
        id_saison: seasonId,
        numero_episode: 1,
        titre: '',
        synopsis: '',
        duree: '00:00:00',
        mux_asset_id: '',
        mux_playback_id: '',
        mux_status: 'preparing',
        mux_poster_url: '',
        date_sortie: '',
        statut: 'en_attente'
      });
      onClose();
    } catch (error: any) {
      onError?.(error.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : ''} max-h-96 overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>Ajouter un épisode</DialogTitle>
          <DialogDescription>
            Créez un nouvel épisode pour cette saison
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Numéro Episode */}
          <div>
            <Label htmlFor="numero_episode">Numéro d'épisode *</Label>
            <Input
              id="numero_episode"
              type="number"
              min="1"
              value={formData.numero_episode}
              onChange={(e) => handleChange('numero_episode', parseInt(e.target.value))}
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
            />
            {errors.numero_episode && (
              <p className="text-red-500 text-sm mt-1">{errors.numero_episode}</p>
            )}
          </div>

          {/* Titre */}
          <div>
            <Label htmlFor="titre">Titre *</Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => handleChange('titre', e.target.value)}
              placeholder="Titre de l'épisode"
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
            />
            {errors.titre && (
              <p className="text-red-500 text-sm mt-1">{errors.titre}</p>
            )}
          </div>

          {/* Synopsis */}
          <div>
            <Label htmlFor="synopsis">Synopsis</Label>
            <Textarea
              id="synopsis"
              value={formData.synopsis || ''}
              onChange={(e) => handleChange('synopsis', e.target.value)}
              placeholder="Description de l'épisode..."
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
              rows={2}
            />
          </div>

          {/* Durée */}
          <div>
            <Label htmlFor="duree">Durée (HH:mm:ss)</Label>
            <Input
              id="duree"
              value={formData.duree}
              onChange={(e) => handleChange('duree', e.target.value)}
              placeholder="00:45:30"
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
            />
          </div>

          {/* Mux Playback ID */}
          <div>
            <Label htmlFor="mux_playback_id">Mux Playback ID *</Label>
            <Input
              id="mux_playback_id"
              value={formData.mux_playback_id}
              onChange={(e) => handleChange('mux_playback_id', e.target.value)}
              placeholder="ID de lecture Mux"
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
            />
            {errors.mux_playback_id && (
              <p className="text-red-500 text-sm mt-1">{errors.mux_playback_id}</p>
            )}
          </div>

          {/* Mux Asset ID */}
          <div>
            <Label htmlFor="mux_asset_id">Mux Asset ID</Label>
            <Input
              id="mux_asset_id"
              value={formData.mux_asset_id || ''}
              onChange={(e) => handleChange('mux_asset_id', e.target.value)}
              placeholder="ID de ressource Mux (optionnel)"
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
            />
          </div>

          {/* Mux Status */}
          <div>
            <Label htmlFor="mux_status">Statut Mux</Label>
            <Select value={formData.mux_status} onValueChange={(value: any) => handleChange('mux_status', value)}>
              <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MUX_STATUS_OPTIONS.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statut Content */}
          <div>
            <Label htmlFor="statut">Statut *</Label>
            <Select value={formData.statut} onValueChange={(value: any) => handleChange('statut', value)}>
              <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_STATUS_OPTIONS.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
