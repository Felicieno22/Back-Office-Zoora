import React from 'react';
import { useState, useEffect } from 'react';
import { Loader2, History, User, Activity } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { toast } from 'sonner';
import { PageContainer, SectionCard } from './shared/SharedLayout';
import { PageHeader } from './shared/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface AuditLog {
    idLog: number;
    action: string;
    details: string;
    dateLog: string;
    utilisateur: {
        idUtilisateur: number;
        nom: string;
        email: string;
    };
}

interface AuditLogsViewProps {
    isDarkMode: boolean;
}

export function AuditLogsView({ isDarkMode }: AuditLogsViewProps) {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const data = await apiRequest('/admin/audit-logs');
            setLogs(data);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
            toast.error('Erreur lors du chargement des logs');
        } finally {
            setLoading(false);
        }
    };

    const getActionBadge = (action: string) => {
        const actionStyles: Record<string, string> = {
            'APPROVE_CONTENU': 'bg-green-600/20 text-green-500',
            'REJECT_CONTENU': 'bg-red-600/20 text-red-500',
            'DELETE_CONTENU': 'bg-orange-600/20 text-orange-500',
            'APPROVE_SAISON': 'bg-green-600/20 text-green-500',
            'APPROVE_EPISODE': 'bg-green-600/20 text-green-500',
            'LOGIN': 'bg-blue-600/20 text-blue-500',
            'REGISTER': 'bg-purple-600/20 text-purple-500',
        };

        return (
            <Badge className={`${actionStyles[action] || 'bg-gray-600/20 text-gray-500'} hover:${actionStyles[action]}`}>
                {action}
            </Badge>
        );
    };

    return (
        <PageContainer>
            <PageHeader
                title="Journal d'Audit"
                subtitle="Historique des actions administratives et événements système"
                icon={Activity}
                isDarkMode={isDarkMode}
            />

            <SectionCard isDarkMode={isDarkMode} padding="p-0 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                    <History className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Événements Récents
                    </h3>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'bg-gray-50/50'}>
                                <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600 font-semibold'}>Date</TableHead>
                                <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600 font-semibold'}>Utilisateur</TableHead>
                                <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600 font-semibold'}>Action</TableHead>
                                <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600 font-semibold'}>Détails</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log: AuditLog) => (
                                <TableRow key={log.idLog} className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/30' : 'hover:bg-gray-50'}>
                                    <TableCell className={`whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{new Date(log.dateLog).toLocaleDateString('fr-FR')}</span>
                                            <span className="text-xs text-gray-500">{new Date(log.dateLog).toLocaleTimeString('fr-FR')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                <User className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{log.utilisateur?.nom}</span>
                                                <span className="text-xs text-gray-500">{log.utilisateur?.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getActionBadge(log.action)}
                                    </TableCell>
                                    <TableCell className={`max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {log.details}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </SectionCard>
        </PageContainer>
    );
}
