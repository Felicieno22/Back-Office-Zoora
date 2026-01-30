/**
 * ParticipationForm - Ajouter/Éditer une participation (crew member)
 * Single Responsibility: Formulaire pour gérer les équipages
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Participation, ParticipationFormData, POSTES } from '../../types/admin';
import { formatParticipationForApi } from '../../utils/adminMappers';
import { apiRequest } from '../../utils/api';

interface ParticipationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Participation;
  contentId?: string;
}

export function ParticipationForm({
  isOpen,
  onClose,
  onSuccess,
  editData,
  contentId,
}: ParticipationFormProps) {
  const [formData, setFormData] = useState<ParticipationFormData>({
    idPersonne: '',
    idPoste: '',
    detail_fonction: '',
    ordre_affichage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [personnes, setPersonnes] = useState<any[]>([]);
  const [postes, setPostes] = useState<any[]>([]);

  // Charger les personnes et postes au montage
  useEffect(() => {
    if (isOpen) {
      loadPersonnesAndPostes();
      if (editData) {
        setFormData({
          idPersonne: editData.idPersonne,
          idPoste: editData.idPoste,
          detail_fonction: editData.detail_fonction || '',
          ordre_affichage: editData.ordre_affichage || 0,
        });
      } else {
        setFormData({
          idPersonne: '',
          idPoste: '',
          detail_fonction: '',
          ordre_affichage: 0,
        });
      }
    }
  }, [isOpen, editData]);

  const loadPersonnesAndPostes = async () => {
    try {
      const [personnesRes, postesRes] = await Promise.all([
        apiRequest('/api/personnes'),
        apiRequest('/api/postes'),
      ]);
      setPersonnes(personnesRes?.data || []);
      setPostes(postesRes?.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.idPersonne || !formData.idPoste) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const apiData = formatParticipationForApi(formData);
      
      if (editData) {
        await apiRequest(`/api/participation/${editData.id}`, {
          method: 'PUT',
          body: JSON.stringify(apiData),
        });
        toast.success('Participation mise à jour ✓');
      } else {
        await apiRequest('/api/participation', {
          method: 'POST',
          body: JSON.stringify({
            ...apiData,
            idContenu: contentId,
          }),
        });
        toast.success('Participation ajoutée ✓');
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
            {editData ? 'Éditer participation' : 'Ajouter une participation'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personne */}
          <div className="space-y-2">
            <Label htmlFor="personne">Personne *</Label>
            <Select
              value={formData.idPersonne}
              onValueChange={(value) =>
                setFormData({ ...formData, idPersonne: value })
              }
            >
              <SelectTrigger id="personne">
                <SelectValue placeholder="Sélectionner une personne" />
              </SelectTrigger>
              <SelectContent>
                {personnes.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nom} {p.prenom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Poste */}
          <div className="space-y-2">
            <Label htmlFor="poste">Poste *</Label>
            <Select
              value={formData.idPoste}
              onValueChange={(value) =>
                setFormData({ ...formData, idPoste: value })
              }
            >
              <SelectTrigger id="poste">
                <SelectValue placeholder="Sélectionner un poste" />
              </SelectTrigger>
              <SelectContent>
                {postes.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Détail fonction */}
          <div className="space-y-2">
            <Label htmlFor="detail">Détail fonction</Label>
            <Input
              id="detail"
              placeholder="Ex: Directeur de la photographie"
              value={formData.detail_fonction}
              onChange={(e) =>
                setFormData({ ...formData, detail_fonction: e.target.value })
              }
            />
          </div>

          {/* Ordre affichage */}
          <div className="space-y-2">
            <Label htmlFor="ordre">Ordre d'affichage</Label>
            <Input
              id="ordre"
              type="number"
              min="0"
              value={formData.ordre_affichage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ordre_affichage: parseInt(e.target.value) || 0,
                })
              }
            />
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
