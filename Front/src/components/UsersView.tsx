import { UserPlus, Mail, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const users = [
  { id: 1, name: "Marie Dubois", email: "marie.dubois@email.com", role: "Admin", status: "Actif", joined: "2024-01-15" },
  { id: 2, name: "Pierre Martin", email: "pierre.martin@email.com", role: "Utilisateur", status: "Actif", joined: "2024-02-20" },
  { id: 3, name: "Sophie Laurent", email: "sophie.laurent@email.com", role: "Utilisateur", status: "Actif", joined: "2024-03-10" },
  { id: 4, name: "Jean Dupont", email: "jean.dupont@email.com", role: "Modérateur", status: "Actif", joined: "2024-01-28" },
  { id: 5, name: "Claire Bernard", email: "claire.bernard@email.com", role: "Utilisateur", status: "Inactif", joined: "2023-12-05" },
  { id: 6, name: "Lucas Petit", email: "lucas.petit@email.com", role: "Utilisateur", status: "Actif", joined: "2024-03-25" },
];

interface UsersViewProps {
  isDarkMode: boolean;
}

export function UsersView({ isDarkMode }: UsersViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Gestion des Utilisateurs</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Gérer les utilisateurs de la plateforme</p>
        </div>
        <Button className="bg-blue-900 hover:bg-blue-800 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </div>

      <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Utilisateurs ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={isDarkMode ? 'border-gray-800' : 'border-gray-200'}>
                  <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Utilisateur</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Email</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Rôle</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Statut</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Date d'inscription</TableHead>
                  <TableHead className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-right`}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className={isDarkMode ? 'border-gray-800' : 'border-gray-200'}>
                    <TableCell className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      <div className="flex items-center gap-2">
                        <Mail className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      <div className="flex items-center gap-2">
                        <Shield className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        {user.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          user.status === "Actif" 
                            ? "bg-green-600/20 text-green-500 hover:bg-green-600/20"
                            : "bg-gray-600/20 text-gray-500 hover:bg-gray-600/20"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{user.joined}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm" className={isDarkMode ? 'text-gray-400 hover:text-red-500' : 'text-gray-600 hover:text-red-500'}>
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}