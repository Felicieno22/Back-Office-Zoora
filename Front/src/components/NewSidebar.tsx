import { Film, Tv, CheckCircle2, Users, UserCog, Wrench, BarChart3, Settings, LogOut, Menu, X, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function NewSidebar({ activeTab, onTabChange, isDarkMode, isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: 'home',
      label: 'Accueil',
      icon: Home,
      subItems: []
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      subItems: []
    },
    {
      id: 'films',
      label: 'Films',
      icon: Film,
      subItems: [
        { id: 'films-create', label: 'Créer un film' },
        { id: 'films-list', label: 'Liste des films' },
        { id: 'films-dashboard', label: 'Dashboard films' }
      ]
    },
    {
      id: 'series',
      label: 'Séries',
      icon: Tv,
      subItems: [
        { id: 'series-create', label: 'Créer une série' },
        { id: 'series-list', label: 'Liste des séries' },
        { id: 'series-dashboard', label: 'Dashboard séries' }
      ]
    },
    {
      id: 'validation',
      label: 'Validation Admin',
      icon: CheckCircle2,
      subItems: [
        { id: 'validation-list', label: 'Liste à valider' }
      ]
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      subItems: []
    },
    {
      id: 'crew',
      label: 'Équipages',
      icon: UserCog,
      subItems: []
    },
    {
      id: 'equipment',
      label: 'Matériel',
      icon: Wrench,
      subItems: []
    },
    {
      id: 'analytics',
      label: 'Analyses',
      icon: BarChart3,
      subItems: []
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      subItems: []
    }
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-50
        ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-200'}
        border-r transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ZOORA
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name}
                </p>
                <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (item.subItems.length === 0) {
                        onTabChange(item.id);
                        if (window.innerWidth < 1024) onClose();
                      } else {
                        onTabChange(item.subItems[0].id);
                        if (window.innerWidth < 1024) onClose();
                      }
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${activeTab === item.id || activeTab.startsWith(item.id + '-')
                        ? isDarkMode 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-500 text-white'
                        : isDarkMode
                          ? 'text-gray-400 hover:bg-slate-900 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                  
                  {/* Sub Items */}
                  {item.subItems.length > 0 && activeTab.startsWith(item.id) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            onTabChange(subItem.id);
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors
                            ${activeTab === subItem.id
                              ? isDarkMode
                                ? 'bg-slate-800 text-blue-400'
                                : 'bg-gray-100 text-blue-600'
                              : isDarkMode
                                ? 'text-gray-500 hover:bg-slate-900 hover:text-gray-300'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }
                          `}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{subItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isDarkMode
                  ? 'text-red-400 hover:bg-red-950 hover:text-red-300'
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                }
              `}
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}