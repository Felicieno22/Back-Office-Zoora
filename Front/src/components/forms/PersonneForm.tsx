/**
 * PersonneForm - Ajouter/Éditer une personne (acteur, réalisateur, etc.)
 * Single Responsibility: Formulaire pour gérer les personnes
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Personne, PersonneFormData } from '../../types/admin';
import { formatPersonneForApi } from '../../utils/adminMappers';
import { apiRequest } from '../../utils/api';
import { dropdownDataService, useConstantData, Poste } from '../../services/dropdownDataService';

interface PersonneFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Personne;
}

export function PersonneForm({
  isOpen,
  onClose,
  onSuccess,
  editData,
}: PersonneFormProps) {
  const [formData, setFormData] = useState<PersonneFormData>({
    nom: '',
    prenom: '',
    nationalite: '',
    date_naissance: '',
  });
  const [loading, setLoading] = useState(false);

  // Utiliser le cache pour les postes
  const { data: postes, loading: postesLoading } = useConstantData<Poste>(
    () => dropdownDataService.getPostes()
  );

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          nom: editData.nom,
          prenom: editData.prenom,
          nationalite: editData.nationalite || '',
          date_naissance: editData.date_naissance || '',
        });
      } else {
        setFormData({
          nom: '',
          prenom: '',
          nationalite: '',
          date_naissance: '',
        });
      }
    }
  }, [isOpen, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.prenom) {
      toast.error('Nom et prénom sont obligatoires');
      return;
    }

    setLoading(true);
    try {
      const apiData = formatPersonneForApi(formData);
      
      if (editData) {
        await apiRequest(`/api/personne/${editData.id}`, {
          method: 'PUT',
          body: JSON.stringify(apiData),
        });
        toast.success('Personne mise à jour ✓');
      } else {
        await apiRequest('/api/personne', {
          method: 'POST',
          body: JSON.stringify(apiData),
        });
        toast.success('Personne ajoutée ✓');
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
            {editData ? 'Éditer personne' : 'Ajouter une personne'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              placeholder="Ex: Dupont"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            />
          </div>

          {/* Prénom */}
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              placeholder="Ex: Jean"
              value={formData.prenom}
              onChange={(e) =>
                setFormData({ ...formData, prenom: e.target.value })
              }
            />
          </div>

          {/* Nationalité */}
          <div className="space-y-2">
            <Label htmlFor="nationalite">Nationalité</Label>
            <Input
              id="nationalite"
              placeholder="Ex: France"
              value={formData.nationalite}
              onChange={(e) =>
                setFormData({ ...formData, nationalite: e.target.value })
              }
            />
          </div>

          {/* Date de naissance */}
          <div className="space-y-2">
            <Label htmlFor="date">Date de naissance</Label>
            <Input
              id="date"
              type="date"
              value={formData.date_naissance}
              onChange={(e) =>
                setFormData({ ...formData, date_naissance: e.target.value })
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
