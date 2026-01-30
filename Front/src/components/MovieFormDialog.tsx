import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Movie } from "../types/movie";

interface MovieFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (movie: Omit<Movie, "id">) => void;
  movie?: Movie | null;
  isDarkMode: boolean;
}

export function MovieFormDialog({ open, onClose, onSave, movie, isDarkMode }: MovieFormDialogProps) {
  const [formData, setFormData] = useState({
    titre: "",
    synopsis: "",
    dateSortie: "",
    sousTitre: "",
    typeFilm: "long-metrage",
    muxAssetId: "",
    muxPlaybackId: "",
    duree: "",
    miniature: "",
    genre: "",
    realisateur: "",
    acteurs: "",
    pays: "",
    langue: "",
    classification: "",
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        description: movie.description,
        thumbnail: movie.thumbnail,
        duration: movie.duration,
        year: movie.year,
        genre: movie.genre,
        rating: movie.rating,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        thumbnail: "",
        duration: "",
        year: new Date().getFullYear(),
        genre: "",
        rating: "",
      });
    }
  }, [movie, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />
      <div className={`relative ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            {movie ? "Modifier le Film" : "Ajouter un Nouveau Film"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Genre</Label>
              <select
                id="genre"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
                required
              >
                <option value="">Sélectionner un genre</option>
                <option value="Action">Action</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Horror">Horreur</option>
                <option value="Romance">Romance</option>
                <option value="Comedy">Comédie</option>
                <option value="Drama">Drame</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`min-h-24 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>URL de l'Image</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
              placeholder="https://..."
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Année</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Durée</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                placeholder="2h 15m"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Classification</Label>
              <select
                id="rating"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
                required
              >
                <option value="">Rating</option>
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
                <option value="NC-17">NC-17</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className={isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white">
              {movie ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}