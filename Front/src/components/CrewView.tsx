import { useState } from "react";
import { Edit, Trash2, Upload, FileDown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { SubNavigation } from "./SubNavigation";
import { toast } from "sonner@2.0.3";

export interface CrewMember {
  id: string;
  name: string;
  address: string;
  contentPlayed: string;
  roles: string;
}

interface CrewViewProps {
  isDarkMode: boolean;
}

const initialCrew: CrewMember[] = [
  { 
    id: "1", 
    name: "Jean Dupont", 
    address: "12 Rue de la Paix, 75002 Paris",
    contentPlayed: "Neon Shadows, The Last Horizon",
    roles: "Réalisateur, Producteur"
  },
  { 
    id: "2", 
    name: "Marie Martin", 
    address: "45 Avenue des Champs-Élysées, 75008 Paris",
    contentPlayed: "Whispers in the Dark, Summer in Paris",
    roles: "Directrice de la photographie"
  },
  { 
    id: "3", 
    name: "Pierre Leblanc", 
    address: "78 Boulevard Saint-Germain, 75005 Paris",
    contentPlayed: "The Perfect Heist, Echoes of Silence",
    roles: "Monteur en chef"
  },
  { 
    id: "4", 
    name: "Sophie Bernard", 
    address: "23 Rue de Rivoli, 75001 Paris",
    contentPlayed: "Velocity, Quantum Paradox",
    roles: "Chef décorateur, Designer de production"
  },
];

export function CrewView({ isDarkMode }: CrewViewProps) {
  const [crew, setCrew] = useState<CrewMember[]>(initialCrew);
  const [activeSubTab, setActiveSubTab] = useState("list");
  const [editingMember, setEditingMember] = useState<CrewMember | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contentPlayed: "",
    roles: "",
  });

  const subTabs = [
    { id: "create", label: "Création" },
    { id: "list", label: "Liste" },
    { id: "import", label: "Import CSV" },
  ];

  const handleEdit = (member: CrewMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      address: member.address,
      contentPlayed: member.contentPlayed,
      roles: member.roles,
    });
    setActiveSubTab("create");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setCrew(crew.map(m => m.id === editingMember.id ? { ...m, ...formData } : m));
      toast.success("Membre mis à jour avec succès");
    } else {
      const newMember: CrewMember = {
        ...formData,
        id: (crew.length + 1).toString(),
      };
      setCrew([...crew, newMember]);
      toast.success("Membre ajouté avec succès");
    }
    resetForm();
    setActiveSubTab("list");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      contentPlayed: "",
      roles: "",
    });
    setEditingMember(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce membre de l'équipage ?")) {
      setCrew(crew.filter(m => m.id !== id));
      toast.success("Membre supprimé avec succès");
    }
  };

  const handleCancel = () => {
    resetForm();
    setActiveSubTab("list");
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const newMembers: CrewMember[] = [];

      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [name, address, contentPlayed, roles] = line.split(',').map(s => s.trim());
        if (name && address && contentPlayed && roles) {
          newMembers.push({
            id: (crew.length + newMembers.length + 1).toString(),
            name,
            address,
            contentPlayed,
            roles,
          });
        }
      }

      if (newMembers.length > 0) {
        setCrew([...crew, ...newMembers]);
        toast.success(`${newMembers.length} membre(s) importé(s) avec succès`);
        setActiveSubTab("list");
      } else {
        toast.error("Aucune donnée valide trouvée dans le fichier CSV");
      }
    };

    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const downloadCSVTemplate = () => {
    const csvContent = "Nom complet,Adresse,Contenu joué,Rôles\nJohn Doe,123 Rue Example Paris,Film 1 Film 2,Acteur Réalisateur\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_equipage.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Modèle CSV téléchargé");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Gestion des Équipages</h2>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Gérer les membres de l'équipe de production</p>
      </div>

      <SubNavigation 
        tabs={subTabs}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        isDarkMode={isDarkMode}
      />

      {activeSubTab === "create" && (
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {editingMember ? "Modifier le membre" : "Créer un nouveau membre"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Nom complet *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}
                    placeholder="Ex: Jean Dupont"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Adresse *
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}
                    placeholder="Ex: 12 Rue de la Paix, 75002 Paris"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentPlayed" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Contenu joué *
                </Label>
                <Textarea
                  id="contentPlayed"
                  value={formData.contentPlayed}
                  onChange={(e) => setFormData({ ...formData, contentPlayed: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}
                  placeholder="Ex: Neon Shadows, The Last Horizon, Whispers in the Dark"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roles" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Rôles *
                </Label>
                <Input
                  id="roles"
                  value={formData.roles}
                  onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}
                  placeholder="Ex: Réalisateur, Producteur, Acteur"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel} 
                  className={`flex-1 ${isDarkMode ? 'border-gray-700 text-gray-300' : ''}`}
                >
                  Annuler
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  {editingMember ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {activeSubTab === "list" && (
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              Liste des Équipages ({crew.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-200'}>
                    <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Nom complet</TableHead>
                    <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Adresse</TableHead>
                    <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Contenu joué</TableHead>
                    <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Rôles</TableHead>
                    <TableHead className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-right`}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crew.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Aucun membre trouvé
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    crew.map((member) => (
                      <TableRow 
                        key={member.id} 
                        className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/30' : 'border-gray-200 hover:bg-gray-50'}
                      >
                        <TableCell className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          {member.name}
                        </TableCell>
                        <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {member.address}
                        </TableCell>
                        <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {member.contentPlayed}
                        </TableCell>
                        <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {member.roles}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className={isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900'}
                              onClick={() => handleEdit(member)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className={isDarkMode ? 'text-gray-400 hover:text-red-500 hover:bg-gray-800' : 'text-gray-600 hover:text-red-500'}
                              onClick={() => handleDelete(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSubTab === "import" && (
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              Importer des membres via CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>
              <h3 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Format du fichier CSV
              </h3>
              <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Le fichier CSV doit contenir les colonnes suivantes dans cet ordre :
              </p>
              <ul className={`text-sm space-y-1 mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Nom complet</li>
                <li>• Adresse</li>
                <li>• Contenu joué</li>
                <li>• Rôles</li>
              </ul>
              <Button 
                type="button" 
                variant="outline"
                onClick={downloadCSVTemplate}
                className={isDarkMode ? 'border-gray-700 text-gray-300' : ''}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Télécharger le modèle CSV
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="csvFile" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Sélectionner un fichier CSV
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}
                />
                <Upload className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Format accepté : .csv uniquement
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
