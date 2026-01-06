# ZOORA - Back Office d'Administration

## 📋 Vue d'ensemble

ZOORA est un back office d'administration moderne pour une plateforme de streaming de films et séries, construit avec React, TypeScript et Tailwind CSS. L'interface est inspirée de Netflix avec un design épuré en mode sombre/clair.

## ✨ Fonctionnalités

### 🔐 Authentification
- **Login** : Connexion avec email et mot de passe
- **Register** : Création de compte avec sélection de rôle (Admin, Modérateur, Éditeur)
- Comptes de test disponibles :
  - Admin: `admin@zoora.com` / `admin123`
  - Modérateur: `modo@zoora.com` / `modo123`

### 📊 Dashboard Principal
- Vue d'ensemble avec statistiques clés
- Graphiques de vues par jour
- Graphiques de revenus
- Top contenus de la semaine
- Activité récente

### 🎬 Gestion des Films
- **Créer un film** : Formulaire complet avec tous les champs (titre, genre, réalisateur, année, note, etc.)
- **Liste des films** : Tableau avec recherche et filtrage par genre
- **Dashboard films** : Statistiques détaillées, graphiques par genre, année, distribution des notes

### 📺 Gestion des Séries
- **Créer une série** : Formulaire avec gestion des saisons et épisodes
- **Liste des séries** : Tableau avec filtres par genre et statut (En cours, Terminée, En pause)
- **Dashboard séries** : Statistiques, répartition par genre et statut

### ✅ Validation Admin
- **Liste à valider** : Contenus soumis en attente de validation
- **Filtres avancés** : Par date (aujourd'hui, cette semaine, ce mois), genre, et type
- **Actions** : Approuver ou rejeter les contenus

### 👥 Autres Sections
- **Utilisateurs** : Gestion des utilisateurs de la plateforme
- **Équipages** : Gestion des équipes de production
- **Matériel** : Gestion de l'équipement
- **Analyses** : Statistiques avancées
- **Paramètres** : Configuration de l'application

## 📁 Structure du Projet

```
/
├── contexts/
│   └── AuthContext.tsx          # Contexte d'authentification
├── pages/
│   ├── auth/
│   │   ├── Login.tsx            # Page de connexion
│   │   └── Register.tsx         # Page d'inscription
│   ├── dashboard/
│   │   └── DashboardView.tsx    # Vue dashboard principal
│   ├── films/
│   │   ├── FilmsCreate.tsx      # Création de films
│   │   ├── FilmsList.tsx        # Liste des films
│   │   └── FilmsDashboard.tsx   # Dashboard films
│   ├── series/
│   │   ├── SeriesCreate.tsx     # Création de séries
│   │   ├── SeriesList.tsx       # Liste des séries
│   │   └── SeriesDashboard.tsx  # Dashboard séries
│   └── validation/
│       └── ValidationList.tsx    # Liste de validation
├── components/
│   ├── NewSidebar.tsx           # Sidebar de navigation
│   ├── AdminHeader.tsx          # Header avec toggle theme
│   ├── UsersView.tsx            # Vue utilisateurs
│   ├── CrewView.tsx             # Vue équipages
│   ├── EquipmentView.tsx        # Vue matériel
│   ├── AnalyticsView.tsx        # Vue analyses
│   ├── SettingsView.tsx         # Vue paramètres
│   └── ui/                      # Composants UI réutilisables
├── data/
│   ├── movies.ts                # Données mock des films
│   └── series.ts                # Données mock des séries
├── types/
│   └── movie.ts                 # Types TypeScript
└── App.tsx                      # Composant principal
```

## 🎨 Design

- **Thème sombre/clair** : Toggle disponible dans le header
- **Couleurs principales** : Bleu sombre (#1e3a8a) et violet (#8b5cf6)
- **Sidebar collapsible** : Navigation responsive sur mobile
- **Composants UI** : Bibliothèque de composants réutilisables (shadcn/ui)

## 🚀 Utilisation

### Navigation

La sidebar contient les sections suivantes :
- Dashboard
- Films (avec sous-menu)
  - Créer un film
  - Liste des films
  - Dashboard films
- Séries (avec sous-menu)
  - Créer une série
  - Liste des séries
  - Dashboard séries
- Validation Admin
  - Liste à valider
- Utilisateurs
- Équipages
- Matériel
- Analyses
- Paramètres

### Gestion des Contenus

#### Films
1. Cliquez sur "Films" dans la sidebar
2. Sélectionnez "Créer un film" pour ajouter un nouveau film
3. Remplissez le formulaire et cliquez sur "Ajouter le film"
4. Consultez la liste dans "Liste des films"
5. Visualisez les statistiques dans "Dashboard films"

#### Séries
1. Cliquez sur "Séries" dans la sidebar
2. Sélectionnez "Créer une série"
3. Remplissez le formulaire avec les détails (saisons, épisodes, statut)
4. Consultez et filtrez dans "Liste des séries"
5. Analysez les données dans "Dashboard séries"

#### Validation
1. Allez dans "Validation Admin" > "Liste à valider"
2. Utilisez les filtres pour trier les contenus
3. Approuvez ou rejetez les contenus en attente

## 🔧 Technologies

- **React 18** : Framework UI
- **TypeScript** : Typage statique
- **Tailwind CSS v4** : Styling
- **Recharts** : Graphiques et visualisations
- **Lucide React** : Icônes
- **Sonner** : Notifications toast
- **shadcn/ui** : Composants UI

## 📝 Notes

- Les données sont stockées en local (pas de backend)
- Les graphiques utilisent des données mockées
- L'authentification est simulée (pas de vraie API)
- Idéal pour un prototype ou une démo

## 🎯 Prochaines Étapes

- Intégration avec un backend réel (Supabase, Firebase, etc.)
- Upload d'images pour les affiches
- Gestion avancée des permissions par rôle
- Export de données en CSV/PDF
- Recherche globale dans toute l'application
- Notifications en temps réel

---

Développé avec ❤️ pour ZOORA
