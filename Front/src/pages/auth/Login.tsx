import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Film } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export function Login({ onSwitchToRegister }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      toast.success('Connexion réussie !');
    } else {
      toast.error('Email ou mot de passe incorrect');
    }
    
    setIsLoading(false);
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
            <p className="text-slate-400">Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
            <p className="text-xs text-slate-400 mb-2">Comptes de test :</p>
            <p className="text-xs text-slate-300">Admin: admin@zoora.com / admin123</p>
            <p className="text-xs text-slate-300">Modo: modo@zoora.com / modo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
