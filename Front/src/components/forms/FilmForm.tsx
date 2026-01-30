import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface FilmFormData {
  titre: string;
  synopsis: string;
  dateSortie: string;
  sousTitre: string;
  typeFilm: string;
  muxAssetId: string;
  muxPlaybackId: string;
  duree: string;
  miniature: string;
  genre: string;
  realisateur: string;
  acteurs: string;
  pays: string;
  langue: string;
  classification: string;
}

interface FilmFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (film: FilmFormData) => void;
  film?: FilmFormData | null;
  isDarkMode: boolean;
}

export function FilmForm({ open, onClose, onSave, film, isDarkMode }: FilmFormProps) {
  const [formData, setFormData] = useState<FilmFormData>({
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
    if (film) {
      setFormData(film);
    } else {
      setFormData({
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
    }
  }, [film, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />
      <div className={`relative ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {film ? "Modifier le Film" : "Ajouter un Nouveau Film"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Informations principales */}
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Informations principales</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titre" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Titre *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateSortie" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Date de sortie *</Label>
                <Input
                  id="dateSortie"
                  type="date"
                  value={formData.dateSortie}
                  onChange={(e) => setFormData({ ...formData, dateSortie: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sousTitre" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Sous-titre</Label>
              <Input
                id="sousTitre"
                value={formData.sousTitre}
                onChange={(e) => setFormData({ ...formData, sousTitre: e.target.value })}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                placeholder="Sous-titre optionnel"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="synopsis" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Synopsis *</Label>
              <Textarea
                id="synopsis"
                value={formData.synopsis}
                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                className={`min-h-24 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              />
            </div>
          </div>

          {/* Section 2: Informations techniques */}
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Informations techniques</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="typeFilm" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Type de film *</Label>
                <select
                  id="typeFilm"
                  value={formData.typeFilm}
                  onChange={(e) => setFormData({ ...formData, typeFilm: e.target.value })}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  required
                >
                  <option value="long-metrage">Long métrage</option>
                  <option value="court-metrage">Court métrage</option>
                  <option value="moyen-metrage">Moyen métrage</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duree" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Durée (minutes) *</Label>
                <Input
                  id="duree"
                  type="number"
                  value={formData.duree}
                  onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                  placeholder="148"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Genre *</Label>
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
                  <option value="Science-Fiction">Science-Fiction</option>
                  <option value="Horreur">Horreur</option>
                  <option value="Romance">Romance</option>
                  <option value="Comédie">Comédie</option>
                  <option value="Drame">Drame</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Animation">Animation</option>
                  <option value="Documentaire">Documentaire</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="muxAssetId" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Mux Asset ID</Label>
                <Input
                  id="muxAssetId"
                  value={formData.muxAssetId}
                  onChange={(e) => setFormData({ ...formData, muxAssetId: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                  placeholder="mux_asset_12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="muxPlaybackId" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Mux Playback ID *</Label>
                <Input
                  id="muxPlaybackId"
                  value={formData.muxPlaybackId}
                  onChange={(e) => setFormData({ ...formData, muxPlaybackId: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                  placeholder="mux_playback_12345"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="miniature" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>URL de la miniature</Label>
              <Input
                id="miniature"
                value={formData.miniature}
                onChange={(e) => setFormData({ ...formData, miniature: e.target.value })}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                placeholder="https://example.com/poster.jpg"
              />
            </div>
          </div>

          {/* Section 3: Équipe et métadonnées */}
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Équipe et métadonnées</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="realisateur" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Réalisateur</Label>
                <Input
                  id="realisateur"
                  value={formData.realisateur}
                  onChange={(e) => setFormData({ ...formData, realisateur: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                  placeholder="Christopher Nolan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="acteurs" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Acteurs</Label>
                <Input
                  id="acteurs"
                  value={formData.acteurs}
                  onChange={(e) => setFormData({ ...formData, acteurs: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                  placeholder="Leonardo DiCaprio, Marion Cotillard, Tom Hardy"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pays" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Pays</Label>
                <Input
                  id="pays"
                  value={formData.pays}
                  onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                  placeholder="États-Unis"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="langue" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Langue</Label>
                <Input
                  id="langue"
                  value={formData.langue}
                  onChange={(e) => setFormData({ ...formData, langue: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                  placeholder="Anglais"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classification" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Classification</Label>
                <select
                  id="classification"
                  value={formData.classification}
                  onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="">Classification</option>
                  <option value="tout-public">Tout public</option>
                  <option value="-10">-10 ans</option>
                  <option value="-12">-12 ans</option>
                  <option value="-16">-16 ans</option>
                  <option value="-18">-18 ans</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className={isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white">
              {film ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
