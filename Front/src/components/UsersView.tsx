import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Shield, Loader2, Trash2, Edit2, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { apiRequest } from '../utils/api';
import { toast } from 'sonner';
import { PageContainer, SectionCard } from './shared/SharedLayout';
import { PageHeader } from './shared/PageHeader';
import { ActionButtons } from './shared/ActionButtons';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface User {
  idUtilisateur: number;
  nom: string;
  email: string;
  id_role: number;
  estActif: boolean;
  telephone: string;
}

interface UsersViewProps {
  isDarkMode: boolean;
}

export function UsersView({ isDarkMode }: UsersViewProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await apiRequest('/api/users');
      setUsers(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (roleId: number) => {
    const roles: Record<number, { label: string, color: string }> = {
      1: { label: 'Admin', color: 'bg-purple-600/20 text-purple-500' },
      2: { label: 'Utilisateur', color: 'bg-blue-600/20 text-blue-500' },
      3: { label: 'Modérateur', color: 'bg-green-600/20 text-green-500' },
    };
    const role = roles[roleId] || { label: 'Inconnu', color: 'bg-gray-600/20 text-gray-500' };
    return <Badge className={`${role.color} hover:${role.color}`}>{role.label}</Badge>;
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await apiRequest(`/users/${user.idUtilisateur}`, {
        method: 'PATCH',
        data: { estActif: !user.estActif }
      });
      setUsers((prev: User[]) => prev.map((u: User) => u.idUtilisateur === user.idUtilisateur ? { ...u, estActif: !u.estActif } : u));
      toast.success('Statut mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await apiRequest(`/users/${id}`, { method: 'DELETE' });
      setUsers((prev: User[]) => prev.filter((u: User) => u.idUtilisateur !== id));
      toast.success('Utilisateur supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Gestion des Utilisateurs"
        subtitle="Administrer les accès et les rôles de la plateforme"
        icon={Users}
        isDarkMode={isDarkMode}
        rightElement={
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 h-11 px-6">
            <UserPlus className="w-4 h-4 mr-2" />
            Nouvel Utilisateur
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SectionCard isDarkMode={isDarkMode} padding="p-6">
          <div className="flex flex-col gap-1">
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Utilisateurs
            </p>
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {users.length}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard isDarkMode={isDarkMode} padding="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'bg-gray-50/50'}>
              <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600 font-semibold'}>Utilisateur</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600 font-semibold'}>Rôle</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600 font-semibold'}>Statut</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600 font-semibold'}>Téléphone</TableHead>
              <TableHead className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600 font-semibold'} text-right`}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.idUtilisateur} className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/30' : 'hover:bg-gray-50'}>
                <TableCell>
                  <div className="flex flex-col py-1">
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.nom}</span>
                    <span className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.id_role)}
                </TableCell>
                <TableCell>
                  <Badge className={`rounded-full px-3 ${user.estActif
                    ? 'bg-green-600/10 text-green-500 border-green-600/20'
                    : 'bg-red-600/10 text-red-500 border-red-600/20'
                    }`}>
                    {user.estActif ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {user.telephone || '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                      onClick={() => handleToggleStatus(user)}
                      title={user.estActif ? 'Désactiver' : 'Activer'}
                    >
                      <Shield className={`w-4 h-4 ${user.estActif ? 'text-orange-500' : 'text-blue-500'}`} />
                    </Button>
                    <ActionButtons
                      isDarkMode={isDarkMode}
                      onDelete={() => handleDeleteUser(user.idUtilisateur)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </PageContainer>
  );
}