import { Save, Globe, Bell, Shield, Database, Mail, Palette, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface SettingsViewProps {
  isDarkMode: boolean;
}

export function SettingsView({ isDarkMode }: SettingsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Paramètres</h2>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
          Configuration de la plateforme ZOORA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres Généraux */}
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Globe className="h-5 w-5" />
              Paramètres Généraux
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Configuration de base de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Nom de la plateforme
              </Label>
              <Input
                id="siteName"
                defaultValue="ZOORA"
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                URL de la plateforme
              </Label>
              <Input
                id="siteUrl"
                defaultValue="https://zoora.com"
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Langue par défaut
              </Label>
              <select
                id="language"
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                  isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Gérer les notifications de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Notifications email
                </Label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Recevoir des emails pour les événements importants
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Nouveaux utilisateurs
                </Label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Notification lors d'une nouvelle inscription
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Nouveaux films
                </Label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Notification lors de l'ajout d'un film
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Rapports hebdomadaires
                </Label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Recevoir un rapport d'activité chaque semaine
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Paramètres de sécurité et authentification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Authentification à deux facteurs
                </Label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Activer la 2FA pour plus de sécurité
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Sessions multiples
                </Label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Autoriser plusieurs connexions simultanées
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Délai d'expiration de session (minutes)
              </Label>
              <Input
                id="sessionTimeout"
                type="number"
                defaultValue="30"
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuration Email */}
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Mail className="h-5 w-5" />
              Configuration Email
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Paramètres du serveur SMTP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Hôte SMTP
              </Label>
              <Input
                id="smtpHost"
                placeholder="smtp.example.com"
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpPort" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Port
                </Label>
                <Input
                  id="smtpPort"
                  type="number"
                  defaultValue="587"
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpEncryption" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Chiffrement
                </Label>
                <select
                  id="smtpEncryption"
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                    isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">Aucun</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpFrom" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Email expéditeur
              </Label>
              <Input
                id="smtpFrom"
                type="email"
                placeholder="noreply@zoora.com"
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Apparence */}
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Palette className="h-5 w-5" />
              Apparence
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Personnalisation de l'interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Mode sombre par défaut
                </Label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Activer le thème sombre au chargement
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryColor" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Couleur principale
              </Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  defaultValue="#1e3a8a"
                  className={`w-20 h-10 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
                />
                <Input
                  value="#1e3a8a"
                  readOnly
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                URL du logo
              </Label>
              <Input
                id="logoUrl"
                placeholder="https://..."
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Gestion des Utilisateurs */}
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Users className="h-5 w-5" />
              Gestion des Utilisateurs
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Paramètres d'inscription et de compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Inscription publique
                </Label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Autoriser les nouvelles inscriptions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Vérification email
                </Label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Exiger la vérification de l'email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxUsers" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Limite d'utilisateurs
              </Label>
              <Input
                id="maxUsers"
                type="number"
                defaultValue="10000"
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sauvegarde & Base de données */}
        <Card className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Database className="h-5 w-5" />
              Sauvegarde & Base de données
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Gestion des sauvegardes et de la base de données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Sauvegarde automatique
                </Label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Créer une sauvegarde automatique quotidienne
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className={isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}>
                <Database className="h-4 w-4 mr-2" />
                Exporter les données
              </Button>
              <Button variant="outline" className={isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}>
                <Database className="h-4 w-4 mr-2" />
                Importer les données
              </Button>
              <Button variant="outline" className={isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}>
                <Database className="h-4 w-4 mr-2" />
                Créer une sauvegarde
              </Button>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Dernière sauvegarde :</strong> 22 novembre 2024 à 14:30
              </p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Taille de la base de données : 245 MB
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton de sauvegarde global */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className={isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}>
          Réinitialiser
        </Button>
        <Button className="bg-blue-900 hover:bg-blue-800 text-white">
          <Save className="h-4 w-4 mr-2" />
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}