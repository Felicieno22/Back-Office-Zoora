import React, { useState } from 'react';
import { Film, Tv, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../utils/api';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { PageContainer, SectionCard } from '../../components/shared/SharedLayout';
import { PageHeader } from '../../components/shared/PageHeader';

interface ContenuCreateProps {
  isDarkMode: boolean;
  onAddContenu: (contenu: any) => void;
}

export function ContenuCreate({ isDarkMode, onAddContenu }: ContenuCreateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentType, setContentType] = useState<'film' | 'serie'>('film');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    // Champs film
    typeFilm: 'long-metrage',
    muxPlaybackId: '',
    muxAssetId: '',
    duration: '',
    // Champs communs
    thumbnail: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.genre) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation spécifique selon le type
    if (contentType === 'film' && !formData.muxPlaybackId) {
      toast.error('Le Mux Playback ID est obligatoire pour un film');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Création du contenu...");

    try {
      // ÉTAPE 1: Préparer les données générales
      const contenuData = {
        titre: formData.title,
        synopsis: formData.description,
        dateSortie: `${formData.releaseYear}-01-01`,
        sousTitre: formData.genre,
        estSerie: contentType === 'serie',
        // Champs spécifiques aux films (seront ignorés pour les séries)
        ...(contentType === 'film' && {
          typeFilm: formData.typeFilm,
          muxPlaybackId: formData.muxPlaybackId,
          muxAssetId: formData.muxAssetId || undefined,
          duree: formatDuration(parseInt(formData.duration) || 0),
        }),
        miniature: formData.thumbnail || getDefaultThumbnail()
      };

      // Utiliser le nouvel endpoint unifié
      const result = await apiRequest('/api/contenu/complete', {
        method: 'POST',
        data: contenuData
      });

      toast.success(`${contentType === 'film' ? 'Film' : 'Série'} ajouté avec succès !`, { id: toastId });

      // Reset form
      setFormData({
        title: '',
        description: '',
        genre: '',
        releaseYear: new Date().getFullYear(),
        typeFilm: 'long-metrage',
        muxPlaybackId: '',
        muxAssetId: '',
        duration: '',
        thumbnail: ''
      });

      if (onAddContenu) onAddContenu(result);
    } catch (error) {
      console.error('Submit failed:', error);
      toast.error(`Erreur lors de l'ajout du ${contentType}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to convert minutes to HH:mm:ss
  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
  };

  const getDefaultThumbnail = () => {
    return contentType === 'film' 
      ? 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300'
      : 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300';
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Créer un ${contentType === 'film' ? 'film' : 'série'}`}
        subtitle={`Ajoutez un nouveau ${contentType === 'film' ? 'film' : 'série'} à la bibliothèque ZOORA`}
        icon={contentType === 'film' ? Film : Tv}
        isDarkMode={isDarkMode}
      />

      <SectionCard>
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <div className="p-6">
            {/* Sélecteur de type */}
            <div className="mb-6">
              <Label className="text-base font-medium mb-3 block">Type de contenu</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={contentType === 'film' ? 'default' : 'outline'}
                  onClick={() => setContentType('film')}
                  className="flex items-center gap-2"
                >
                  <Film className="h-4 w-4" />
                  Film
                </Button>
                <Button
                  type="button"
                  variant={contentType === 'serie' ? 'default' : 'outline'}
                  onClick={() => setContentType('serie')}
                  className="flex items-center gap-2"
                >
                  <Tv className="h-4 w-4" />
                  Série
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champs communs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Titre du contenu"
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="genre">Genre *</Label>
                  <Select value={formData.genre} onValueChange={(value) => handleChange('genre', value)}>
                    <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                      <SelectValue placeholder="Sélectionner un genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Action">Action</SelectItem>
                      <SelectItem value="Comédie">Comédie</SelectItem>
                      <SelectItem value="Drame">Drame</SelectItem>
                      <SelectItem value="Horreur">Horreur</SelectItem>
                      <SelectItem value="Science-Fiction">Science-Fiction</SelectItem>
                      <SelectItem value="Romance">Romance</SelectItem>
                      <SelectItem value="Thriller">Thriller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="releaseYear">Année de sortie *</Label>
                  <Input
                    id="releaseYear"
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e) => handleChange('releaseYear', parseInt(e.target.value))}
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnail">URL de l'image</Label>
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail}
                    onChange={(e) => handleChange('thumbnail', e.target.value)}
                    placeholder="URL de l'image (optionnel)"
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Synopsis</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Synopsis du contenu"
                  rows={4}
                  className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                />
              </div>

              {/* Champs spécifiques aux films */}
              {contentType === 'film' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="typeFilm">Type de film *</Label>
                      <Select value={formData.typeFilm} onValueChange={(value) => handleChange('typeFilm', value)}>
                        <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                          <SelectValue placeholder="Type de film" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="long-metrage">Long métrage</SelectItem>
                          <SelectItem value="court-metrage">Court métrage</SelectItem>
                          <SelectItem value="moyen-metrage">Moyen métrage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="duration">Durée (minutes) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleChange('duration', e.target.value)}
                        placeholder="Durée en minutes"
                        min="1"
                        className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="muxPlaybackId">Mux Playback ID *</Label>
                      <Input
                        id="muxPlaybackId"
                        value={formData.muxPlaybackId}
                        onChange={(e) => handleChange('muxPlaybackId', e.target.value)}
                        placeholder="Mux Playback ID"
                        className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="muxAssetId">Mux Asset ID</Label>
                      <Input
                        id="muxAssetId"
                        value={formData.muxAssetId}
                        onChange={(e) => handleChange('muxAssetId', e.target.value)}
                        placeholder="Mux Asset ID (optionnel)"
                        className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Créer le {contentType === 'film' ? 'film' : 'série'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </SectionCard>
    </PageContainer>
  );
}
