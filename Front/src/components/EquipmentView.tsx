import { useState } from "react";
import { Edit, Trash2, Upload, FileDown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SubNavigation } from "./SubNavigation";
import { toast } from "sonner";

export interface Equipment {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  status: "available" | "in-use" | "maintenance";
  purchaseDate: string;
}

interface EquipmentViewProps {
  isDarkMode: boolean;
}

const initialEquipment: Equipment[] = [
  { id: "1", name: "Caméra RED KOMODO 6K", type: "Caméra", brand: "RED Digital Cinema", model: "KOMODO 6K", status: "available", purchaseDate: "2023-01-15" },
  { id: "2", name: "Sony Alpha 7S III", type: "Caméra", brand: "Sony", model: "A7S III", status: "in-use", purchaseDate: "2023-03-20" },
  { id: "3", name: "DJI Ronin 2", type: "Stabilisateur", brand: "DJI", model: "Ronin 2", status: "available", purchaseDate: "2023-02-10" },
  { id: "4", name: "ARRI SkyPanel S60", type: "Éclairage", brand: "ARRI", model: "SkyPanel S60-C", status: "maintenance", purchaseDate: "2022-11-05" },
  { id: "5", name: "Sennheiser MKH 416", type: "Microphone", brand: "Sennheiser", model: "MKH 416", status: "available", purchaseDate: "2023-04-12" },
];

export function EquipmentView({ isDarkMode }: EquipmentViewProps) {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [activeSubTab, setActiveSubTab] = useState("list");
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    brand: "",
    model: "",
    status: "available" as Equipment["status"],
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const subTabs = [
    { id: "create", label: "Création" },
    { id: "list", label: "Liste" },
    { id: "import", label: "Import CSV" },
  ];

  const handleEdit = (item: Equipment) => {
    setEditingEquipment(item);
    setFormData({
      name: item.name,
      type: item.type,
      brand: item.brand,
      model: item.model,
      status: item.status,
      purchaseDate: item.purchaseDate,
    });
    setActiveSubTab("create");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEquipment) {
      setEquipment(equipment.map(e => e.id === editingEquipment.id ? { ...e, ...formData } : e));
    } else {
      const newEquipment: Equipment = {
        ...formData,
        id: (equipment.length + 1).toString(),
      };
      setEquipment([...equipment, newEquipment]);
    }
    resetForm();
    setActiveSubTab("list");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      brand: "",
      model: "",
      status: "available",
      purchaseDate: new Date().toISOString().split('T')[0],
    });
    setEditingEquipment(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce matériel ?")) {
      setEquipment(equipment.filter(e => e.id !== id));
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
      const newEquipment: Equipment[] = [];

      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [name, type, brand, model, status, purchaseDate] = line.split(',').map(s => s.trim());
        if (name && type && brand && model && status && purchaseDate) {
          // Validate status
          const validStatus = ["available", "in-use", "maintenance"];
          const equipmentStatus = validStatus.includes(status) ? status as Equipment["status"] : "available";
          
          newEquipment.push({
            id: (equipment.length + newEquipment.length + 1).toString(),
            name,
            type,
            brand,
            model,
            status: equipmentStatus,
            purchaseDate,
          });
        }
      }

      if (newEquipment.length > 0) {
        setEquipment([...equipment, ...newEquipment]);
        toast.success(`${newEquipment.length} matériel(s) importé(s) avec succès`);
        setActiveSubTab("list");
      } else {
        toast.error("Aucune donnée valide trouvée dans le fichier CSV");
      }
    };

    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const downloadCSVTemplate = () => {
    const csvContent = "Nom,Type,Marque,Modèle,Statut,Date d'achat\nCanon EOS R5,Caméra,Canon,EOS R5,available,2024-01-15\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_materiel.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Modèle CSV téléchargé");
  };

  const getStatusBadge = (status: Equipment["status"]) => {
    const styles = {
      available: "bg-green-600/20 text-green-500",
      "in-use": "bg-blue-600/20 text-blue-500",
      maintenance: "bg-orange-600/20 text-orange-500",
    };
    const labels = {
      available: "Disponible",
      "in-use": "En utilisation",
      maintenance: "Maintenance",
    };
    return (
      <Badge className={`${styles[status]} hover:${styles[status]}`}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Gestion du Matériel</h2>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Gérer l'équipement de production</p>
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
              {editingEquipment ? "Modifier le matériel" : "Créer un nouveau matériel"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Nom du matériel</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}
                  placeholder="Ex: Caméra RED KOMODO 6K"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}
                    placeholder="Ex: Caméra, Éclairage..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Marque</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}
                    placeholder="Ex: Sony, RED..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Modèle</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}
                  placeholder="Ex: A7S III"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Statut</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Equipment["status"] })}>
                    <SelectTrigger className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="in-use">En utilisation</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Date d'achat</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  Annuler
                </Button>
                <Button type="submit" className="flex-1 bg-blue-900 hover:bg-blue-800 text-white">
                  {editingEquipment ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {activeSubTab === "list" && (
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Liste du Matériel ({equipment.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={isDarkMode ? 'border-gray-800' : 'border-gray-200'}>
                    <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Nom</TableHead>
                    <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Type</TableHead>
                    <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Marque</TableHead>
                    <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Modèle</TableHead>
                    <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Statut</TableHead>
                    <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Date d'achat</TableHead>
                    <TableHead className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-right`}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipment.map((item) => (
                    <TableRow key={item.id} className={isDarkMode ? 'border-gray-800' : 'border-gray-200'}>
                      <TableCell className={isDarkMode ? 'text-white' : 'text-gray-900'}>{item.name}</TableCell>
                      <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{item.type}</TableCell>
                      <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{item.brand}</TableCell>
                      <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{item.model}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {new Date(item.purchaseDate).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className={isDarkMode ? 'text-gray-400 hover:text-red-500' : 'text-gray-600 hover:text-red-500'}
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
              Importer du matériel via CSV
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
                <li>• Nom</li>
                <li>• Type</li>
                <li>• Marque</li>
                <li>• Modèle</li>
                <li>• Statut (available, in-use, ou maintenance)</li>
                <li>• Date d'achat (format: YYYY-MM-DD)</li>
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