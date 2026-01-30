import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Film, ShieldCheck, ArrowLeft, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface EnhancedVerifyCodeProps {
  onSwitchToLogin: () => void;
  onVerificationSuccess: () => void;
  source?: 'login' | 'register';
}

export function EnhancedVerifyCode({ 
  onSwitchToLogin, 
  onVerificationSuccess,
  source = 'register' 
}: EnhancedVerifyCodeProps) {
  const { verifyAccount } = useAuth();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get token from localStorage
  const verificationToken = localStorage.getItem('verification_token');
  const verificationEmail = localStorage.getItem('verification_email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      toast.error('Veuillez entrer un code à 6 chiffres');
      return;
    }
    
    if (!verificationToken) {
      toast.error('Token de vérification manquant');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await verifyAccount(verificationToken, code);

      if (success) {
        toast.success('✅ Compte activé avec succès!');
        
        if (source === 'register') {
          toast.success('Bienvenue sur ZOORA!');
        } else {
          toast.success('Connexion réussie!');
        }
        
        // Clear verification data
        localStorage.removeItem('verification_token');
        localStorage.removeItem('verification_email');
        
        // Proceed to home
        onVerificationSuccess();
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Code de vérification invalide');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    toast.info('Fonction de renvoi à implémenter');
    // TODO: Implement resend code functionality
  };

  if (!verificationToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-8 text-center">
            <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl text-white mb-2">Token manquant</h2>
            <p className="text-slate-400 mb-6">
              Impossible de vérifier votre compte. Le token de vérification est manquant.
            </p>
            <Button 
              onClick={onSwitchToLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className={`${source === 'register' ? 'bg-green-600' : 'bg-blue-600'} p-3 rounded-2xl mb-4`}>
              {source === 'register' ? (
                <UserCheck className="w-8 h-8 text-white" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-3xl text-white mb-2">
              {source === 'register' ? 'Vérification requise' : 'Vérification'}
            </h1>
            <p className="text-slate-400 text-center">
              Entrez le code à 6 chiffres envoyé à <span className="text-blue-400">{verificationEmail || 'votre email'}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={code}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 6) {
                    setCode(value);
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
              className={`w-full ${source === 'register' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-6 text-lg`}
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Vérification...
                </>
              ) : (
                <>
                  {source === 'register' ? (
                    <>
                      <UserCheck className="w-5 h-5 mr-2" />
                      Vérifier et accéder
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      Vérifier et se connecter
                    </>
                  )}
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
                disabled={isLoading}
              >
                Renvoyer le code
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <Button 
              variant="ghost" 
              onClick={onSwitchToLogin}
              className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {source === 'register' ? 'Recommencer l\'inscription' : 'Retour à la connexion'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}