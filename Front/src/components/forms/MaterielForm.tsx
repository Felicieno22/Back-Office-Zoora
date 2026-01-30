/**
 * MaterielForm - Ajouter/Éditer du matériel
 * Single Responsibility: Formulaire pour gérer l'équipement
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Materiel, MaterielFormData, ETATS_MATERIEL } from '../../types/admin';
import { mapFrontendFormToBackend, mapBackendMaterielToFrontend, FrontendMateriel } from '../../utils/materielMappers';
import { apiRequest } from '../../utils/api';
import { dropdownDataService, useConstantData, TypeMateriel } from '../../services/dropdownDataService';

interface MaterielFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: FrontendMateriel;
}

export function MaterielForm({
  isOpen,
  onClose,
  onSuccess,
  editData,
}: MaterielFormProps) {
  const [formData, setFormData] = useState<MaterielFormData>({
    designation: '',
    idTypeMateriel: '',
    numero_serie: '',
    etat: 'Bon',
  });
  const [loading, setLoading] = useState(false);

  // Utiliser le cache pour les types de matériel
  const { data: typesMateriel, loading: typesLoading } = useConstantData<TypeMateriel>(
    () => dropdownDataService.getTypesMateriel()
  );

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          designation: editData.designation,
          idTypeMateriel: editData.idTypeMateriel,
          numero_serie: editData.numero_serie || '',
          etat: editData.etat || 'Bon',
        });
      } else {
        setFormData({
          designation: '',
          idTypeMateriel: '',
          numero_serie: '',
          etat: 'Bon',
        });
      }
    }
  }, [isOpen, editData]);

  const loadTypesMateriel = async () => {
    try {
      const response = await apiRequest('/type-materiel');
      setTypesMateriel(response?.data || response || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.designation || !formData.idTypeMateriel) {
      toast.error('Désignation et type sont obligatoires');
      return;
    }

    setLoading(true);
    try {
      const apiData = mapFrontendFormToBackend(formData);
      
      if (editData) {
        await apiRequest(`/materiels/${editData.id}`, {
          method: 'PUT',
          data: apiData,
        });
        toast.success('Matériel mis à jour ✓');
      } else {
        await apiRequest('/materiels', {
          method: 'POST',
          data: apiData,
        });
        toast.success('Matériel ajouté ✓');
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
            {editData ? 'Éditer matériel' : 'Ajouter du matériel'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Désignation */}
          <div className="space-y-2">
            <Label htmlFor="designation">Désignation *</Label>
            <Input
              id="designation"
              placeholder="Ex: Caméra Canon 5D"
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
            />
          </div>

          {/* Type matériel */}
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              value={formData.idTypeMateriel}
              onValueChange={(value) =>
                setFormData({ ...formData, idTypeMateriel: value })
              }
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {typesMateriel.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Numéro de série */}
          <div className="space-y-2">
            <Label htmlFor="serie">Numéro de série</Label>
            <Input
              id="serie"
              placeholder="Ex: SN123456"
              value={formData.numero_serie}
              onChange={(e) =>
                setFormData({ ...formData, numero_serie: e.target.value })
              }
            />
          </div>

          {/* État */}
          <div className="space-y-2">
            <Label htmlFor="etat">État</Label>
            <Select
              value={formData.etat}
              onValueChange={(value) =>
                setFormData({ ...formData, etat: value })
              }
            >
              <SelectTrigger id="etat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ETATS_MATERIEL.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
