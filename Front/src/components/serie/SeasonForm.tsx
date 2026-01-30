/**
 * SeasonForm - Formulaire de création/édition Saison
 * Single Responsibility: Formulaire pour Saison
 * Open/Closed: Extensible pour édition future
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SeasonFormProps, SeasonFormData, Saison } from '../../types/base';
import { CONTENT_STATUS_OPTIONS, VALIDATION_MESSAGES } from '../../constants/base';
import { formatSeasonForApi } from '../../utils/baseMappers';
import { useApi } from '../../hooks/useApi';
import { apiRequest } from '../../utils/api';

export function SeasonForm({
  serieId,
  isOpen,
  onClose,
  onSuccess,
  onError,
  isDarkMode = false
}: SeasonFormProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<SeasonFormData>({
    id_serie: serieId,
    numero_saison: 1,
    titre: '',
    synopsis: '',
    miniature: '',
    date_sortie: '',
    statut: 'en_attente'
  });

  const handleChange = (field: keyof SeasonFormData, value: any) => {
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

    if (!formData.numero_saison || formData.numero_saison <= 0) {
      newErrors.numero_saison = VALIDATION_MESSAGES.SEASON_NUMBER_MIN;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const apiData = formatSeasonForApi(formData);
      const response = await apiRequest('/api/seasons', { method: 'POST', data: apiData });
      
      onSuccess?.(response.data as Saison);
      setFormData({
        id_serie: serieId,
        numero_saison: 1,
        titre: '',
        synopsis: '',
        miniature: '',
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
      <DialogContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <DialogHeader>
          <DialogTitle>Ajouter une saison</DialogTitle>
          <DialogDescription>
            Créez une nouvelle saison pour cette série
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Numéro Saison */}
          <div>
            <Label htmlFor="numero_saison">Numéro de saison *</Label>
            <Input
              id="numero_saison"
              type="number"
              min="1"
              value={formData.numero_saison}
              onChange={(e) => handleChange('numero_saison', parseInt(e.target.value))}
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
            />
            {errors.numero_saison && (
              <p className="text-red-500 text-sm mt-1">{errors.numero_saison}</p>
            )}
          </div>

          {/* Titre */}
          <div>
            <Label htmlFor="titre">Titre</Label>
            <Input
              id="titre"
              value={formData.titre || ''}
              onChange={(e) => handleChange('titre', e.target.value)}
              placeholder="Ex: Les Origines"
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
            />
          </div>

          {/* Synopsis */}
          <div>
            <Label htmlFor="synopsis">Synopsis</Label>
            <Textarea
              id="synopsis"
              value={formData.synopsis || ''}
              onChange={(e) => handleChange('synopsis', e.target.value)}
              placeholder="Description de la saison..."
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
              rows={3}
            />
          </div>

          {/* Date de sortie */}
          <div>
            <Label htmlFor="date_sortie">Date de sortie</Label>
            <Input
              id="date_sortie"
              type="date"
              value={formData.date_sortie || ''}
              onChange={(e) => handleChange('date_sortie', e.target.value)}
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
            />
          </div>

          {/* Miniature */}
          <div>
            <Label htmlFor="miniature">URL Miniature</Label>
            <Input
              id="miniature"
              type="url"
              value={formData.miniature || ''}
              onChange={(e) => handleChange('miniature', e.target.value)}
              placeholder="https://..."
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
            />
          </div>

          {/* Statut */}
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
