import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Carousel, CarouselFormData } from '../../types/carousel';
import { apiRequest } from '../../utils/api';
import { toast } from 'sonner';

interface CarouselFormDialogProps {
  carousel?: Carousel;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (carousel: Carousel) => void;
  isDarkMode?: boolean;
}

export function CarouselFormDialog({ 
  carousel, 
  isOpen, 
  onClose, 
  onSuccess, 
  isDarkMode = true 
}: CarouselFormDialogProps) {
  const isEditing = !!carousel;
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState<Array<{id_contenu: number, titre: string}>>([]);

  const [formData, setFormData] = useState<CarouselFormData>({
    titre: carousel?.titre || '',
    description: carousel?.description || '',
    imageUrl: carousel?.imageUrl || '',
    lienUrl: carousel?.lienUrl || '',
    ordreAffichage: carousel?.ordreAffichage || 999,
    statut: carousel?.statut || 'actif',
    dateDebut: carousel?.dateDebut || '',
    dateFin: carousel?.dateFin || '',
    idContenu: carousel?.idContenu
  });

  // Load contents for dropdown
  useEffect(() => {
    const loadContents = async () => {
      try {
        const data = await apiRequest('/api/contenu', { method: 'GET' });
        if (Array.isArray(data)) {
          setContents(data.map((c: any) => ({ 
            id_contenu: c.idContenu, 
            titre: c.titre 
          })));
        }
      } catch (error) {
        console.error('Error loading contents:', error);
      }
    };
    
    if (isOpen) {
      loadContents();
    }
  }, [isOpen]);

  // Reset form when dialog opens/closes or carousel changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        titre: carousel?.titre || '',
        description: carousel?.description || '',
        imageUrl: carousel?.imageUrl || '',
        lienUrl: carousel?.lienUrl || '',
        ordreAffichage: carousel?.ordreAffichage || 999,
        statut: carousel?.statut || 'actif',
        dateDebut: carousel?.dateDebut || '',
        dateFin: carousel?.dateFin || '',
        idContenu: carousel?.idContenu
      });
    }
  }, [carousel, isOpen]);

  const handleChange = (field: keyof CarouselFormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.titre.trim()) {
      return 'Le titre est obligatoire';
    }
    if (!formData.image_url.trim()) {
      return 'L\'URL de l\'image est obligatoire';
    }
    if (!formData.lien_url.trim()) {
      return 'L\'URL du lien est obligatoire';
    }
    
    // Validate dates coherence (like DB constraint)
    if (formData.date_debut && formData.date_fin) {
      if (new Date(formData.date_debut) > new Date(formData.date_fin)) {
        return 'La date de début doit être antérieure à la date de fin';
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      const url = isEditing 
        ? `/api/carrousels/${carousel.idCarrousel}` 
        : '/api/carrousels';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await apiRequest(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Ensure ordreAffichage is a number
          ordreAffichage: Number(formData.ordreAffichage),
          // Ensure idContenu is either a number or null
          idContenu: formData.idContenu || null
        }),
      });

      if (response) {
        toast.success(isEditing 
          ? 'Carousel mis à jour avec succès!' 
          : 'Carousel créé avec succès!'
        );
        // Handle API response - it might include joined content data
        const processedResponse = response.carrousels || response.data || response;
        onSuccess?.(processedResponse);
        onClose();
      }
    } catch (error: any) {
      console.error('Form error:', error);
      toast.error(error.message || 'Erreur lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={isDarkMode ? 'bg-slate-900 text-white border-slate-700' : 'bg-white'}
      >
        <DialogHeader>
          <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            {isEditing ? 'Modifier le Carousel' : 'Créer un Carousel'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="titre" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
              Titre *
            </Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => handleChange('titre', e.target.value)}
              placeholder="Titre du carousel"
              className={isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : ''}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description du carousel"
              rows={3}
              className={isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : ''}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
              URL de l'Image *
            </Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : ''}
              required
            />
          </div>

          {/* Link URL */}
          <div className="space-y-2">
            <Label htmlFor="lien_url" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
              URL du Lien *
            </Label>
            <Input
              id="lienUrl"
              value={formData.lienUrl}
              onChange={(e) => handleChange('lienUrl', e.target.value)}
              placeholder="https://example.com/page"
              className={isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : ''}
              required
            />
          </div>

          {/* Display Order */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ordre_affichage" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Ordre d'affichage
              </Label>
              <Input
                id="ordreAffichage"
                type="number"
                value={formData.ordreAffichage}
                onChange={(e) => handleChange('ordreAffichage', parseInt(e.target.value) || 999)}
                className={isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : ''}
                min="0"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Statut
              </Label>
              <Select 
                value={formData.statut} 
                onValueChange={(value) => handleChange('statut', value as 'actif' | 'inactif')}
              >
                <SelectTrigger className={isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_debut" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Date de début
              </Label>
              <Input
                id="dateDebut"
                type="date"
                value={formData.dateDebut}
                onChange={(e) => handleChange('dateDebut', e.target.value)}
                className={isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_fin" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Date de fin
              </Label>
              <Input
                id="dateFin"
                type="date"
                value={formData.dateFin}
                onChange={(e) => handleChange('dateFin', e.target.value)}
                className={isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
            </div>
          </div>

          {/* Content Association */}
          <div className="space-y-2">
            <Label htmlFor="id_contenu" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
              Contenu associé
            </Label>
            <Select 
              value={formData.idContenu?.toString() || ''} 
              onValueChange={(value) => handleChange('idContenu', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger className={isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                <SelectValue placeholder="Sélectionnez un contenu (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun contenu</SelectItem>
                {contents.map(content => (
                  <SelectItem key={content.id_contenu} value={content.id_contenu.toString()}>
                    {content.titre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              className={isDarkMode ? 'border-slate-700 text-white hover:bg-slate-800' : ''}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}