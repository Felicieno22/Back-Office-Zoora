import { Search, Bell, User, Moon, Sun, Menu } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface AdminHeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
}

export function AdminHeader({ isDarkMode, onToggleTheme, onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b px-4 lg:px-8 py-4 lg:ml-64 fixed top-0 right-0 left-0 z-40`}>
      <div className="flex items-center justify-between gap-4">
        {/* Bouton hamburger pour mobile */}
        <Button
          variant="ghost"
          size="icon"
          className={`lg:hidden ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <Input
              type="search"
              placeholder="Rechercher..."
              className={`pl-10 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500'}`}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className={isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            onClick={onToggleTheme}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className={`hidden sm:flex ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
            <Bell className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-blue-900 flex items-center justify-center">
            <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}