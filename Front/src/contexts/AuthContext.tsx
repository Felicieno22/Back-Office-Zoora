import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiRequest } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresVerification?: boolean; verificationToken?: string }>;
  register: (name: string, email: string, password: string, role: string) => Promise<any>;
  verifyAccount: (token: string, code: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Verify token and get user profile
      apiRequest('/api/auth/me')
        .then((userData) => {
          setUser({
            id: userData.id?.toString() || userData.idUtilisateur?.toString(),
            email: userData.email,
            name: userData.nom || userData.prenom || 'User',
            role: userData.role || 'user',
          });
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; requiresVerification?: boolean; verificationToken?: string }> => {
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.access_token) {
        // Save tokens
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);

        // Set user data
        setUser({
          id: response.user.id?.toString() || response.user.idUtilisateur?.toString(),
          email: response.user.email,
          name: response.user.nom || response.user.prenom || 'User',
          role: response.user.role || 'user',
        });
        
        return { success: true };
      }
      return { success: false };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if it's a verification error
      if (error.message?.includes('verify your email') && error.verificationToken) {
        return { 
          success: false, 
          requiresVerification: true, 
          verificationToken: error.verificationToken 
        };
      }
      
      return { success: false };
    }
  };

  const verifyAccount = async (token: string, code: string): Promise<boolean> => {
    try {
      const response = await apiRequest('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          code: code.trim(),
        }),
      });
      
      // If backend returns tokens, authenticate immediately
      if (response?.access_token) {
        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }

        if (response.user) {
          setUser({
            id: response.user.id?.toString() || response.user.idUtilisateur?.toString(),
            email: response.user.email,
            name: response.user.nom || response.user.prenom || 'User',
            role: response.user.role || 'user',
          });
        } else {
          // Fallback: fetch profile
          try {
            const userData = await apiRequest('/api/auth/me');
            setUser({
              id: userData.id?.toString() || userData.idUtilisateur?.toString(),
              email: userData.email,
              name: userData.nom || userData.prenom || 'User',
              role: userData.role || 'user',
            });
          } catch {
            // ignore
          }
        }
      }

      if (response?.message) {
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Verification error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, dateNaissance: string, role: string): Promise<boolean> => {
    try {
      const [prenom, ...nomParts] = name.split(' ');
      const nom = nomParts.join(' ') || prenom;

      // Map role string to role ID (correspondance avec la base de données)
      const roleMap: { [key: string]: number } = {
        'admin': 4,      // ID 4 = admin
        'moderator': 5,  // ID 5 = moderator  
        'user': 6,       // ID 6 = user (pas de 'editor')
      };
      const id_role = roleMap[role] || 4; // Default to admin

      const payload = {
        email,
        password,
        nom,
        prenom,
        dateNaissance,
        id_role,
      };

      console.log('📤 Envoi des données au backend:', payload);

      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Réponse backend:', response);

      if (response) {
        // Registration successful - return full response including verification token
        return response;
      }
      return false;
    } catch (error: any) {
      console.error('❌ Erreur register:', error);
      return false;
    }
  };

  const logout = () => {
    // Call logout API
    apiRequest('/api/auth/logout', { method: 'POST' }).catch(() => {});
    
    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Clear user state
    setUser(null);
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, verifyAccount, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
