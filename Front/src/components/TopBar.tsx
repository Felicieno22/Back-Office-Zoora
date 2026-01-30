import { Bell, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-gray-900 border-b border-gray-800 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <h2 className="text-white">{title}</h2>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-10 w-64 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white text-sm">Admin</p>
              <p className="text-gray-400 text-xs">Administrateur</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
