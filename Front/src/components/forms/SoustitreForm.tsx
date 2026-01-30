/**
 * SoustitreForm - Ajouter/Éditer un sous-titre
 * Single Responsibility: Formulaire pour gérer les sous-titres
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { Soustitrage, SoustitrageFormData } from '../../types/admin';
import { formatSoustitrageForApi } from '../../utils/adminMappers';
import { apiRequest } from '../../utils/api';
import { dropdownDataService, useConstantData, Language } from '../../services/dropdownDataService';

interface SoustitreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Soustitrage;
  contentId?: string;
}

export function SoustitreForm({
  isOpen,
  onClose,
  onSuccess,
  editData,
  contentId,
}: SoustitreFormProps) {
  const [formData, setFormData] = useState<SoustitrageFormData>({
    idLangue: '',
    url_fichier: '',
    est_force: false,
  });
  const [loading, setLoading] = useState(false);

  // Utiliser le cache pour les langues
  const { data: langues, loading: languesLoading } = useConstantData<Language>(
    () => dropdownDataService.getLanguages()
  );

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          idLangue: editData.idLangue,
          url_fichier: editData.url_fichier,
          est_force: editData.est_force || false,
        });
      } else {
        setFormData({
          idLangue: '',
          url_fichier: '',
          est_force: false,
        });
      }
    }
  }, [isOpen, editData]);

  const loadLangues = async () => {
    try {
      const response = await apiRequest('/api/languages');
      setLangues(response?.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des langues:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.idLangue || !formData.url_fichier) {
      toast.error('Langue et URL du fichier sont obligatoires');
      return;
    }

    setLoading(true);
    try {
      const apiData = formatSoustitrageForApi(formData);
      
      if (editData) {
        await apiRequest(`/api/soustitrage/${editData.id}`, {
          method: 'PUT',
          body: JSON.stringify(apiData),
        });
        toast.success('Sous-titre mis à jour ✓');
      } else {
        await apiRequest('/api/soustitrage', {
          method: 'POST',
          body: JSON.stringify({
            ...apiData,
            idContenu: contentId,
          }),
        });
        toast.success('Sous-titre ajouté ✓');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Éditer sous-titre' : 'Ajouter un sous-titre'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Langue */}
          <div className="space-y-2">
            <Label htmlFor="langue">Langue *</Label>
            <select
              id="langue"
              value={formData.idLangue}
              onChange={(e) =>
                setFormData({ ...formData, idLangue: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Sélectionner une langue</option>
              {langues.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nom}
                </option>
              ))}
            </select>
          </div>

          {/* URL fichier */}
          <div className="space-y-2">
            <Label htmlFor="url">URL du fichier *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/subtitle.vtt"
              value={formData.url_fichier}
              onChange={(e) =>
                setFormData({ ...formData, url_fichier: e.target.value })
              }
            />
          </div>

          {/* Est forcé */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="force"
              checked={formData.est_force}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, est_force: checked as boolean })
              }
            />
            <Label htmlFor="force" className="font-normal cursor-pointer">
              Forcer l'affichage du sous-titre
            </Label>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'En cours...' : editData ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
