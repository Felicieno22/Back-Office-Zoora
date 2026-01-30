import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Film, ShieldCheck, ArrowLeft, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedRegisterProps {
  onSwitchToLogin: () => void;
  onVerificationSuccess: () => void;
}

export function EnhancedRegister({ onSwitchToLogin, onVerificationSuccess }: EnhancedRegisterProps) {
  const { register, verifyAccount } = useAuth();
  const [step, setStep] = useState<'form' | 'verification'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateNaissance: '',
    password: '',
    confirmPassword: '',
    role: 'editor'
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    if (!formData.dateNaissance) {
      toast.error('Veuillez entrer votre date de naissance');
      return;
    }

    const birthDate = new Date(formData.dateNaissance);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const isBeforeBirthday = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate());
    const actualAge = isBeforeBirthday ? age - 1 : age;

    if (birthDate > today) {
      toast.error('La date de naissance ne peut pas être dans le futur');
      return;
    }

    if (actualAge < 16) {
      toast.error('Vous devez avoir au moins 16 ans pour créer un compte');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial');
      return;
    }

    setIsLoading(true);

    try {
      const response = await register(
        formData.name, 
        formData.email, 
        formData.password, 
        formData.dateNaissance, 
        formData.role
      );

      if (response && typeof response === 'object' && response.verificationToken) {
        // Account created with verification token
        setVerificationToken(response.verificationToken);
        localStorage.setItem('verification_token', response.verificationToken);
        localStorage.setItem('verification_email', formData.email);
        setStep('verification');
        toast.success('Compte créé avec succès ! Veuillez entrer le code de vérification.');
      } else if (response === true) {
        // Account created without verification (already verified)
        toast.success('Compte créé avec succès !');
        onVerificationSuccess();
      } else {
        toast.error('Erreur lors de la création du compte');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Veuillez entrer un code à 6 chiffres');
      return;
    }
    
    if (!verificationToken) {
      toast.error('Token de vérification manquant');
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const success = await verifyAccount(verificationToken, verificationCode);

      if (success) {
        toast.success('✅ Compte activé avec succès!');
        toast.success('Bienvenue sur ZOORA!');
        
        // Clear verification data
        localStorage.removeItem('verification_token');
        localStorage.removeItem('verification_email');
        
        // Proceed to home
        onVerificationSuccess();
      } else {
        toast.error('Code de vérification invalide');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Code de vérification invalide');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = () => {
    toast.info('Fonction de renvoi à implémenter');
    // TODO: Implement resend code functionality
  };

  const handleBackToForm = () => {
    setStep('form');
    setVerificationCode('');
    setVerificationToken(null);
    localStorage.removeItem('verification_token');
    localStorage.removeItem('verification_email');
  };

  // Verification step
  if (step === 'verification') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-green-600 p-3 rounded-2xl mb-4">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl text-white mb-2">Vérification requise</h1>
              <p className="text-slate-400 text-center">
                Entrez le code à 6 chiffres envoyé à <span className="text-blue-400">{formData.email}</span>
              </p>
            </div>

            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="verificationCode" className="text-slate-200">
                  Code de vérification
                </Label>
                <Input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length <= 6) {
                      setVerificationCode(value);
                    }
                  }}
                  required
                  autoFocus
                  className="bg-slate-800/50 border-slate-700 text-white text-center text-2xl tracking-widest placeholder:text-slate-500"
                  autoComplete="one-time-code"
                />
                <p className="text-sm text-slate-500">
                  Entrez le code à 6 chiffres reçu par email
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                disabled={isVerifying || verificationCode.length !== 6}
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Vérification...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Vérifier et accéder
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Vous n'avez pas reçu de code?{' '}
                <button
                  onClick={handleResendCode}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  disabled={isVerifying}
                >
                  Renvoyer le code
                </button>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <Button 
                variant="ghost" 
                onClick={handleBackToForm}
                className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Modifier les informations
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Registration form step
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
                value={formData.name}
                autoComplete="name"
                onChange={(e) => handleInputChange('name', e.target.value)}
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
                value={formData.email}
                autoComplete="email"
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                value={formData.dateNaissance}
                onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                required
                max={new Date().toISOString().split('T')[0]}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-400">Vous devez avoir au moins 16 ans</p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Rôle</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="admin" className="text-white">Administrateur</SelectItem>
                  <SelectItem value="moderator" className="text-white">Modérateur</SelectItem>
                  <SelectItem value="editor" className="text-white">Éditeur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                autoComplete="new-password"
                onChange={(e) => handleInputChange('password', e.target.value)}
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
                value={formData.confirmPassword}
                autoComplete="new-password"
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
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

          <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Flux professionnel :</p>
            <p className="text-xs text-slate-300">1. Inscription</p>
            <p className="text-xs text-slate-300">2. Vérification (si nécessaire)</p>
            <p className="text-xs text-slate-300">3. Accueil direct</p>
          </div>
        </div>
      </div>
    </div>
  );
}