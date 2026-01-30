import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Film } from 'lucide-react';
import { toast } from 'sonner';
import { dropdownDataService, useConstantData, Role } from '../../services/dropdownDataService';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export function Register({ onSwitchToLogin }: RegisterProps) {
  console.log('Register component mounted');
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  // Utiliser le hook pour les rôles avec cache
  const { data: availableRoles, loading: rolesLoading, error: rolesError } = useConstantData<Role>(
    () => dropdownDataService.getRoles()
  );

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setDebugLogs(prev => [...prev, logMessage]);
  };

  // Effet pour gérer les erreurs de chargement
  useEffect(() => {
    if (rolesError) {
      addLog('❌ Erreur chargement des rôles');
      toast.error('Impossible de charger les rôles disponibles');
    }
  }, [rolesError]);

  // Effet pour sélectionner le premier rôle par défaut quand les rôles sont chargés
  useEffect(() => {
    if (availableRoles && availableRoles.length > 0 && !role) {
      setRole(availableRoles[0].idRole.toString());
      addLog(`🎯 Rôle par défaut sélectionné: ${availableRoles[0].nom} (ID: ${availableRoles[0].idRole})`);
    }
  }, [availableRoles, role]);

  console.log('Register state:', { name, email, password, confirmPassword, role, isLoading });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addLog('📝 Formulaire soumis!');
    addLog(`Données: ${name}, ${email}, ${dateNaissance}, ${role}`);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addLog('❌ Email invalide');
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }
    addLog('✅ Email valide');

    // Date of birth validation
    if (!dateNaissance) {
      addLog('❌ Date de naissance manquante');
      toast.error('Veuillez entrer votre date de naissance');
      return;
    }
    addLog('✅ Date de naissance fournie');

    const birthDate = new Date(dateNaissance);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const isBeforeBirthday = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate());
    const actualAge = isBeforeBirthday ? age - 1 : age;

    // Check if birth date is not in the future
    if (birthDate > today) {
      addLog('❌ Date de naissance dans le futur');
      toast.error('La date de naissance ne peut pas être dans le futur');
      return;
    }
    addLog('✅ Date de naissance valide (pas dans le futur)');

    // Check if user is at least 16 years old
    if (actualAge < 16) {
      addLog(`❌ L'utilisateur a ${actualAge} ans (minimum 16 ans requis)`);
      toast.error('Vous devez avoir au moins 16 ans pour créer un compte');
      return;
    }
    addLog(`✅ L'utilisateur a ${actualAge} ans (minimum 16 ans)`);

    // Password match check
    if (password !== confirmPassword) {
      addLog('❌ Mots de passe différents');
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    addLog('✅ Mots de passe identiques');

    // Password complexity check
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      addLog('❌ Mot de passe trop faible');
      addLog('Requis: 8+ car., 1 majuscule, 1 chiffre, 1 spécial');
      toast.error('Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial');
      return;
    }
    addLog('✅ Mot de passe valide');

    addLog('⏳ Appel API en cours...');
    setIsLoading(true);

    try {
      const response = await register(name, email, password, dateNaissance, role);
      addLog(`✅ Réponse API: ${response ? 'Succès' : 'Échec'}`);

      if (response && typeof response === 'object' && response.verificationToken) {
        addLog('✅ Compte créé! Redirection vers vérification...');
        toast.success('Compte créé avec succès ! Vérifiez votre email pour le code de vérification.');

        
        // Store token and redirect to verification
        localStorage.setItem('verification_token', response.verificationToken);
        localStorage.setItem('verification_email', email);
        localStorage.setItem('verification_source', 'register');
        window.dispatchEvent(new CustomEvent('authViewChange', { detail: 'verify' }));
      } else if (response === true) {
        addLog('✅ Compte créé! Vérifiez votre email');
        toast.success('Compte créé avec succès ! Vérifiez votre email pour activer votre compte.');
        setTimeout(() => {
          addLog('➡️ Redirection vers login...');
          onSwitchToLogin();
        }, 2000);
      } else {
        addLog('❌ Échec création compte');
        toast.error('Erreur lors de la création du compte');
      }
    } catch (error: any) {
      addLog(`❌ Erreur: ${error.message || 'Inconnue'}`);
      console.error('Register error:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
      addLog('✅ Terminé');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 p-3 rounded-2xl mb-4">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl text-white mb-2">ZOORA Admin</h1>
            <p className="text-slate-400">Créez votre compte administrateur</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">Nom complet</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={name}
                autoComplete="name"
                onChange={(e) => {
                  console.log('Name changed:', e.target.value);
                  setName(e.target.value);
                }}
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@zoora.com"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateNaissance" className="text-slate-200">Date de naissance</Label>
              <Input
                id="dateNaissance"
                name="dateNaissance"
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                required
                max={new Date().toISOString().split('T')[0]}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-400">Vous devez avoir au moins 16 ans</p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Rôle</Label>
              {rolesLoading ? (
                <div className="bg-slate-800/50 border-slate-700 text-white p-2 rounded text-sm">
                  Chargement des rôles...
                </div>
              ) : availableRoles && availableRoles.length > 0 ? (
                <Select value={role} onValueChange={setRole} disabled={rolesLoading}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {availableRoles.map((roleItem: Role) => (
                      <SelectItem 
                        key={roleItem.idRole} 
                        value={roleItem.idRole.toString()} 
                        className="text-white"
                      >
                        {roleItem.nom}
                        {roleItem.descript && (
                          <span className="text-slate-400 text-xs ml-2">
                            - {roleItem.descript}
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-red-900/20 border border-red-700 text-red-300 p-2 rounded text-sm">
                  Aucun rôle disponible
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                autoComplete="new-password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-200">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
              onClick={() => addLog('👆 Bouton cliqué!')}
            >
              {isLoading ? 'Création...' : 'Créer le compte'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Déjà un compte ?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Se connecter
              </button>
            </p>
          </div>

          {/* Panneau de debug */}
          {debugLogs.length > 0 && (
            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 max-h-64 overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-slate-300">🔍 Logs de débogage</p>
                <button 
                  onClick={() => setDebugLogs([])} 
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Effacer
                </button>
              </div>
              <div className="space-y-1">
                {debugLogs.map((log, index) => (
                  <p key={index} className="text-xs text-slate-400 font-mono">{log}</p>
                ))}
              </div>
            </div>
          )}

          {/* Aide mot de passe */}
          <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
            <p className="text-xs text-blue-300 mb-1 font-semibold">ℹ️ Critères du mot de passe:</p>
            <ul className="text-xs text-blue-400 space-y-1">
              <li>• Au moins 8 caractères</li>
              <li>• Au moins 1 majuscule (A-Z)</li>
              <li>• Au moins 1 chiffre (0-9)</li>
              <li>• Au moins 1 caractère spécial (!@#$%...)</li>
            </ul>
            <p className="text-xs text-green-400 mt-2">✅ Exemple: <code className="bg-slate-800 px-1 rounded">Test@123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
