import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Film, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedLoginProps {
  onSwitchToRegister: () => void;
  onVerificationSuccess: () => void;
}

export function EnhancedLogin({ onSwitchToRegister, onVerificationSuccess }: EnhancedLoginProps) {
  const { login, verifyAccount } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Connexion réussie !');
        // User is already verified, proceed to home
        onVerificationSuccess();
      } else if (result.requiresVerification && result.verificationToken) {
        // Account requires verification
        setRequiresVerification(true);
        setVerificationToken(result.verificationToken);
        localStorage.setItem('verification_token', result.verificationToken);
        localStorage.setItem('verification_email', email);
        toast.info('Compte non vérifié. Veuillez entrer le code de vérification.');
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
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
        toast.success('✅ Compte vérifié avec succès!');
        toast.success('Accès en cours...');

        // Clear verification data
        localStorage.removeItem('verification_token');
        localStorage.removeItem('verification_email');

        // If verify returned tokens, we are authenticated; otherwise fallback to login
        const token = localStorage.getItem('access_token');
        if (token) {
          onVerificationSuccess();
          return;
        }

        const loginResult = await login(email, password);
        if (loginResult.success) {
          onVerificationSuccess();
        } else {
          toast.error('Erreur lors de la connexion après vérification');
        }
      } else {
        toast.error('Code de vérification invalide');
      }
    } catch (error) {
      toast.error('Erreur de vérification');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = () => {
    toast.info('Fonction de renvoi à implémenter');
    // TODO: Implement resend code functionality
  };

  const handleBackToLogin = () => {
    setRequiresVerification(false);
    setVerificationCode('');
    setVerificationToken(null);
    localStorage.removeItem('verification_token');
    localStorage.removeItem('verification_email');
  };

  // Verification form
  if (requiresVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-blue-600 p-3 rounded-2xl mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl text-white mb-2">Vérification requise</h1>
              <p className="text-slate-400 text-center">
                Entrez le code à 6 chiffres envoyé à <span className="text-blue-400">{email}</span>
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
                    // Only allow numbers
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
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
                    Vérifier et se connecter
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
                onClick={handleBackToLogin}
                className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ← Retour à la connexion
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 p-3 rounded-2xl mb-4">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl text-white mb-2">ZOORA Admin</h1>
            <p className="text-slate-400">Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@zoora.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Pas de compte ?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Créer un compte
              </button>
            </p>
          </div>

          <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Nouveau flux d'authentification :</p>
            <p className="text-xs text-slate-300">1. Connexion</p>
            <p className="text-xs text-slate-300">2. Vérification (si nécessaire)</p>
            <p className="text-xs text-slate-300">3. Accueil</p>
          </div>
        </div>
      </div>
    </div>
  );
}