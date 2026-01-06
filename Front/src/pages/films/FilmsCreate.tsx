import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card } from '../../components/ui/card';
import { Film, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FilmsCreateProps {
  isDarkMode: boolean;
  onAddMovie: (movie: any) => void;
}

export function FilmsCreate({ isDarkMode, onAddMovie }: FilmsCreateProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    score: 0,
    rating: 'PG-13',
    duration: '',
    director: '',
    cast: '',
    thumbnail: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.genre || !formData.director) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onAddMovie({
      ...formData,
      year: formData.releaseYear,
      cast: formData.cast.split(',').map(s => s.trim()),
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1758592670606-096a0fc94aed?w=300&h=450&fit=crop'
    });

    toast.success('Film ajouté avec succès !');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      genre: '',
      releaseYear: new Date().getFullYear(),
      score: 0,
      rating: 'PG-13',
      duration: '',
      director: '',
      cast: '',
      thumbnail: ''
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
          <Film className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Créer un film
          </h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Ajoutez un nouveau film à la bibliothèque ZOORA
          </p>
        </div>
      </div>

      <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Titre *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Le titre du film"
                required
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Genre *
              </Label>
              <Select value={formData.genre} onValueChange={(value) => handleChange('genre', value)}>
                <SelectTrigger className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                  <SelectValue placeholder="Sélectionner un genre" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <SelectItem value="Action">Action</SelectItem>
                  <SelectItem value="Aventure">Aventure</SelectItem>
                  <SelectItem value="Comédie">Comédie</SelectItem>
                  <SelectItem value="Drame">Drame</SelectItem>
                  <SelectItem value="Science-Fiction">Science-Fiction</SelectItem>
                  <SelectItem value="Thriller">Thriller</SelectItem>
                  <SelectItem value="Horreur">Horreur</SelectItem>
                  <SelectItem value="Romance">Romance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="director" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Réalisateur *
              </Label>
              <Input
                id="director"
                value={formData.director}
                onChange={(e) => handleChange('director', e.target.value)}
                placeholder="Nom du réalisateur"
                required
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseYear" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Année de sortie
              </Label>
              <Input
                id="releaseYear"
                type="number"
                value={formData.releaseYear}
                onChange={(e) => handleChange('releaseYear', parseInt(e.target.value))}
                min="1900"
                max={new Date().getFullYear() + 5}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Durée (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder="120"
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="score" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Note (0-10)
              </Label>
              <Input
                id="score"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.score}
                onChange={(e) => handleChange('score', parseFloat(e.target.value))}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Classification
              </Label>
              <Select value={formData.rating} onValueChange={(value) => handleChange('rating', value)}>
                <SelectTrigger className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                  <SelectValue placeholder="Sélectionner une classification" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <SelectItem value="G">G</SelectItem>
                  <SelectItem value="PG">PG</SelectItem>
                  <SelectItem value="PG-13">PG-13</SelectItem>
                  <SelectItem value="R">R</SelectItem>
                  <SelectItem value="NC-17">NC-17</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Synopsis du film..."
              rows={4}
              className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cast" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
              Acteurs principaux (séparés par des virgules)
            </Label>
            <Input
              id="cast"
              value={formData.cast}
              onChange={(e) => handleChange('cast', e.target.value)}
              placeholder="Tom Hanks, Morgan Freeman, Brad Pitt"
              className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
              URL de l'affiche
            </Label>
            <div className="flex gap-2">
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => handleChange('thumbnail', e.target.value)}
                placeholder="https://example.com/poster.jpg"
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
              />
              <Button type="button" variant="outline" className={isDarkMode ? 'border-gray-700' : ''}>
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Ajouter le film
            </Button>
            <Button type="button" variant="outline" className={isDarkMode ? 'border-gray-700 text-gray-300' : ''}>
              Réinitialiser
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}