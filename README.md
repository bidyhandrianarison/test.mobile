# 📱 Application de Gestion de Catalogue Produits

Une application mobile React Native moderne construite avec Expo pour la gestion et la navigation d'un catalogue de produits. L'application propose une authentification utilisateur, une gestion complète des produits, des filtres avancés et une interface utilisateur personnalisée avec des boutons d'action flottants.

## 🎯 Vue d'ensemble du Projet

Cette application offre une solution complète pour la gestion de catalogue de produits avec des fonctionnalités comme :
- **🔐 Authentification Utilisateur** : Connexion/inscription sécurisée avec validation de formulaires
- **📦 Gestion de Produits** : Ajouter, modifier, supprimer et visualiser des produits
- **🔍 Recherche & Filtrage Avancé** : Trouver rapidement des produits avec plusieurs options de filtres
- **📸 Upload d'Images** : Capture de photos et sélection depuis la galerie
- **🎨 Interface Personnalisée** : Design moderne avec barre d'onglets personnalisée et bouton d'action flottant
- **📱 Design Responsive** : Fonctionne parfaitement sur différentes tailles d'écrans
- **🌍 Localisation Française** : Interface entièrement en français

## 🚀 Démarrage Rapide

### Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (v6 ou supérieur)
- [Git](https://git-scm.com/)
- [Yarn](https://yarnpkg.com/) (recommandé) ou npm

### Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd test.mobile
   ```

2. **Installer les dépendances**
   ```bash
   yarn install
   # ou
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   yarn start
   # ou
   npx expo start
   ```

4. **Exécuter sur votre appareil**
   - Installez l'application **Expo Go** sur votre téléphone
   - Scannez le code QR affiché dans le terminal
   - Ou appuyez sur `a` pour l'émulateur Android ou `i` pour le simulateur iOS

### Scripts Disponibles

```bash
yarn start          # Démarrer le serveur de développement Expo
yarn android        # Démarrer sur l'émulateur Android
yarn ios           # Démarrer sur le simulateur iOS
yarn web           # Démarrer la version web
yarn test          # Exécuter les tests
```

## 🏗️ Architecture de l'Application

### Structure des Dossiers

```
test.mobile/
├── App.tsx                    # Point d'entrée principal de l'application
├── app.json                  # Configuration Expo
├── package.json              # Dépendances et scripts
├── tsconfig.json             # Configuration TypeScript
├── assets/                   # Images, polices et fichiers statiques
├── components/               # Composants UI réutilisables
│   ├── FormInput/            # Composant de saisie de formulaire
│   │   ├── index.tsx
│   │   └── styles.ts
│   ├── ProductItem/          # Composant de carte produit
│   │   ├── index.tsx
│   │   └── styles.ts
│   ├── ImagePickerField.tsx  # Sélecteur d'images avec caméra/galerie
│   ├── FilterModal.tsx       # Modal de filtres avancés
│   ├── LoadingSpinner.tsx    # Indicateur de chargement
│   └── ...
├── contexts/                 # Providers React Context
│   ├── AuthContext.tsx       # Gestion de l'état d'authentification
│   └── ProductContext.tsx    # Gestion des données produits
├── navigation/               # Configuration de navigation
│   └── RootNavigator.tsx     # Configuration de navigation principale
├── screens/                  # Écrans de l'application
│   ├── LoginScreen.tsx       # Authentification utilisateur
│   ├── SignupScreen.tsx      # Inscription utilisateur
│   ├── HomeScreen.tsx        # Catalogue de produits
│   ├── AddProductScreen.tsx  # Création de produit
│   ├── ProductEditScreen.tsx # Modification de produit
│   ├── ProductDetailScreen.tsx # Détails du produit
│   ├── ProfileScreen.tsx     # Profil utilisateur
│   └── EditProfileScreen.tsx # Modification du profil
├── services/                 # Appels API et services externes
│   ├── authService.ts        # Service d'authentification
│   └── productService.ts     # Service de gestion des produits
├── utils/                    # Fonctions utilitaires
│   ├── validations.ts        # Validation de formulaires
│   └── translations.ts       # Système de traductions françaises
├── constants/                # Constantes et thèmes de l'application
│   └── Colors.ts            # Palette de couleurs
├── data/                     # Données mockées
│   ├── products.json        # Données de produits
│   └── users.js             # Données utilisateurs
└── types/                    # Définitions de types TypeScript
    └── index.ts             # Types principaux
```

### Technologies Clés

- **React Native 0.79.4** - Développement mobile cross-platform
- **Expo SDK 53** - Plateforme de développement et outils
- **TypeScript 5.8** - JavaScript avec typage statique
- **React Navigation 7** - Bibliothèque de navigation
- **React Context** - Gestion d'état
- **React Native Elements** - Bibliothèque de composants UI
- **Expo Image Picker** - Gestion des images et caméra
- **AsyncStorage** - Stockage local persistant

## ✨ Fonctionnalités Principales

### 🔐 Système d'Authentification
- **Connexion/Inscription Sécurisée** : Authentification par email et mot de passe
- **Validation de Formulaires** : Validation en temps réel avec messages d'erreur conviviaux
- **Gestion de Session** : État de connexion persistant avec AsyncStorage
- **Redirection Automatique** : Navigation automatique basée sur le statut d'authentification
- **Gestion d'Erreurs** : Messages d'erreur localisés en français

### 📦 Gestion de Produits
- **Opérations CRUD** : Créer, lire, modifier et supprimer des produits
- **Détails de Produits** : Informations riches avec badges de statut
- **Support d'Images** : Gestion d'images avec Expo Image Picker
- **Produits Spécifiques à l'Utilisateur** : Les produits sont associés aux utilisateurs authentifiés
- **Upload d'Images** : Capture de photos et sélection depuis la galerie

### 🔍 Recherche & Filtrage
- **Recherche Avancée** : Recherche par nom, description, catégorie ou vendeur
- **Modal de Filtres** : Plusieurs options de filtres (catégorie, fourchette de prix, statut)
- **Pagination** : Chargement efficace de grandes listes de produits
- **Résultats en Temps Réel** : Résultats de recherche instantanés

### 🎨 Composants UI Personnalisés
- **Bouton d'Action Flottant** : Accès rapide pour ajouter de nouveaux produits
- **Barre d'Onglets Personnalisée** : Navigation par onglets avec design central
- **Badges de Statut** : Indicateurs visuels pour le statut des produits
- **États de Chargement** : Indicateurs de chargement fluides
- **Gestion d'Erreurs** : Messages d'erreur conviviaux et récupération

### 📱 Design Responsive
- **Cross-platform** : Fonctionne sur iOS, Android et Web
- **Support Safe Area** : Gestion appropriée des encoches et barres de statut
- **Layout Adaptatif** : Design responsive pour différentes tailles d'écrans
- **Optimisé Tactile** : Optimisé pour l'interaction mobile

## 🛠️ Choix Techniques

### Pourquoi Expo ?
- **Développement Rapide** : Configuration et workflow de développement rapides
- **Cross-platform** : Code unique pour iOS, Android et Web
- **Écosystème Riche** : Accès aux fonctionnalités natives via Expo SDK
- **Déploiement Facile** : Processus de build et déploiement simple
- **Mises à Jour OTA** : Mettre à jour l'app sans approbation de l'app store
- **Gestion des Permissions** : Configuration automatique des permissions

### Pourquoi React Context au lieu de Redux ?
- **Simplicité** : Plus facile à comprendre et implémenter pour les petites applications
- **Intégré** : Aucune dépendance supplémentaire requise
- **Performance** : Suffisant pour les besoins de gestion d'état de l'application
- **Support TypeScript** : Excellente intégration TypeScript
- **Courbe d'Apprentissage** : Plus facile pour les développeurs nouveaux dans la gestion d'état

### Pourquoi React Navigation ?
- **Performance Native** : Utilise les composants de navigation natifs
- **Type Safety** : Excellent support TypeScript
- **Flexibilité** : Supporte les patterns de navigation complexes
- **Développement Actif** : Bien maintenu avec des mises à jour régulières
- **Communauté** : Grande communauté et documentation extensive

### Pourquoi TypeScript ?
- **Type Safety** : Détecter les erreurs à la compilation
- **Meilleur Support IDE** : Autocomplétion et refactoring améliorés
- **Documentation** : Les types servent de documentation inline
- **Maintenabilité** : Plus facile de maintenir et refactoriser le code
- **Collaboration d'Équipe** : Meilleure compréhension du code entre les membres

### Pourquoi Expo Image Picker ?
- **Fonctionnalités Complètes** : Capture de photos et sélection de galerie
- **Permissions Automatiques** : Gestion automatique des permissions
- **Cross-platform** : Fonctionne sur iOS et Android
- **Édition d'Images** : Recadrage et ajustement intégrés
- **Performance** : Optimisé pour les appareils mobiles

## 🧩 Composants Majeurs

### Composants d'Authentification

#### `AuthContext.tsx`
Gère l'état d'authentification utilisateur et fournit les fonctionnalités de connexion/déconnexion.

```typescript
// Fonctionnalités clés :
- Gestion de session utilisateur
- Persistance AsyncStorage
- États de chargement et d'erreur
- Intégration validation de formulaires
- Gestion d'erreurs sans exceptions
```

#### `LoginScreen.tsx` & `SignupScreen.tsx`
Écrans d'authentification utilisateur avec validation de formulaires complète et gestion d'erreurs.

```typescript
// Fonctionnalités :
- Validation de formulaires en temps réel
- Messages d'erreur conviviaux
- États de chargement pendant l'authentification
- Redirection automatique après connexion
- Interface entièrement en français
```

### Composants de Gestion de Produits

#### `ProductContext.tsx`
Gestion centralisée des données produits avec opérations CRUD et filtrage spécifique à l'utilisateur.

```typescript
// Méthodes clés :
- fetchProducts(): Charger tous les produits
- addProduct(): Créer un nouveau produit
- updateProduct(): Modifier un produit existant
- deleteProduct(): Supprimer un produit
- getUserProducts(): Filtrer par utilisateur
- searchProducts(): Fonctionnalité de recherche
```

#### `ProductItem/index.tsx`
Composant de carte produit réutilisable avec badges de statut et boutons d'action.

```typescript
// Fonctionnalités :
- Affichage d'image de produit
- Indicateurs de badge de statut
- Boutons d'action (modifier/supprimer)
- Layout responsive
- Retour tactile
- Gestion des images locales
```

#### `ProductDetailScreen.tsx`
Vue détaillée du produit avec informations complètes et capacités d'édition.

```typescript
// Fonctionnalités :
- Informations complètes du produit
- Support de galerie d'images
- Actions modifier/supprimer
- Gestion de statut
- Actions spécifiques à l'utilisateur
- Confirmation de suppression
```

### Composants UI

#### `ImagePickerField.tsx`
Composant de sélection d'images avec support caméra et galerie.

```typescript
// Fonctionnalités :
- Capture de photos avec l'appareil photo
- Sélection depuis la galerie
- Édition et recadrage d'images
- Aperçu en temps réel
- Suppression sécurisée avec confirmation
- Gestion des permissions
```

#### `CustomTabBar`
Navigation par onglets personnalisée avec bouton d'action flottant et design d'encoche central.

```typescript
// Fonctionnalités :
- Bouton d'action flottant pour ajout rapide
- Design d'encoche SVG personnalisé
- Animations fluides
- Styling spécifique à la plateforme
- Visibilité conditionnelle du bouton flottant
```

#### `FilterModal.tsx`
Interface de filtrage avancée avec plusieurs options de filtres.

```typescript
// Options de filtres :
- Sélection de catégorie
- Curseur de fourchette de prix
- Filtres de statut
- Intégration de recherche
- Fonctionnalité de réinitialisation
- Interface en français
```

#### `ErrorMessage.tsx`
Composant d'affichage d'erreur réutilisable avec différents types de messages.

```typescript
// Types de messages :
- Erreur (rouge)
- Avertissement (orange)
- Information (bleu)
- Fonctionnalité de fermeture automatique
```

## 📱 Test de l'Application

### Test sur Appareil Physique

1. **Installer Expo Go**
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Se connecter au serveur de développement**
   ```bash
   yarn start
   ```

3. **Scanner le Code QR**
   - iOS: Utiliser l'application Appareil photo
   - Android: Utiliser l'application Expo Go

### Test sur Émulateur

#### Émulateur Android
```bash
# Démarrer l'émulateur Android d'abord, puis :
yarn android
```

#### Simulateur iOS (macOS uniquement)
```bash
# Démarrer le simulateur iOS d'abord, puis :
yarn ios
```

### Test Web
```bash
yarn web
```

## 🔧 Workflow de Développement

### Bonnes Pratiques de Structure de Code

1. **Organisation des Composants**
   - Garder les composants petits et focalisés
   - Utiliser des interfaces TypeScript pour les props
   - Implémenter des boundaries d'erreur appropriées
   - Extraire les styles pour les composants complexes

2. **Gestion d'État**
   - Utiliser Context pour l'état global
   - État local pour les données spécifiques aux composants
   - États de chargement et d'erreur appropriés
   - Gestion d'erreurs sans exceptions

3. **Navigation**
   - Navigation type-safe avec TypeScript
   - Organisation appropriée des écrans
   - Guards d'authentification
   - Gestion des paramètres de navigation

4. **Gestion d'Erreurs**
   - Boundaries d'erreur complets
   - Messages d'erreur conviviaux
   - Logging d'erreur approprié
   - Récupération d'erreur

### Qualité de Code

- **TypeScript** : Vérification de types stricte activée
- **ESLint** : Linting et formatage de code
- **Jest** : Framework de tests unitaires
- **Prettier** : Formatage de code
- **Structure Modulaire** : Organisation en dossiers par fonctionnalité

## 🚀 Améliorations Futures

### Fonctionnalités Planifiées

- [ ] **Notifications Push** : Mises à jour de produits en temps réel
- [ ] **Support Hors Ligne** : Architecture offline-first avec synchronisation
- [ ] **Optimisation d'Images** : Chargement différé et compression
- [ ] **Analytics Avancés** : Suivi du comportement utilisateur
- [ ] **Fonctionnalités Sociales** : Partage de produits et commentaires
- [ ] **Intégration de Paiement** : Achats in-app
- [ ] **Support Multi-langues** : Internationalisation
- [ ] **Mode Sombre** : Capacité de changement de thème

### Améliorations Techniques

- [ ] **Optimisation de Performance** : Utilisation de React.memo et useMemo
- [ ] **Couverture de Tests** : Tests unitaires et d'intégration complets
- [ ] **Pipeline CI/CD** : Tests et déploiement automatisés
- [ ] **Code Splitting** : Chargement différé des écrans
- [ ] **Optimisation de Bundle** : Réduction de la taille de l'app
- [ ] **Accessibilité** : Support des lecteurs d'écran

### Améliorations d'Architecture

- [ ] **Intégration API** : Remplacer les données mockées par un vrai backend
- [ ] **Stratégie de Cache** : Implémenter un cache de données approprié
- [ ] **Persistance d'État** : Capacités hors ligne améliorées
- [ ] **Monitoring d'Erreurs** : Reporting de crashes et analytics
- [ ] **Monitoring de Performance** : Suivi de performance de l'app

## 🤝 Contribution

1. Fork le repository
2. Créer une branche de fonctionnalité (`git checkout -b feature/fonctionnalite-incroyable`)
3. Commiter vos changements (`git commit -m 'Ajouter une fonctionnalité incroyable'`)
4. Pousser vers la branche (`git push origin feature/fonctionnalite-incroyable`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence 0BSD - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour le support et les questions :
- Créer une issue dans le repository
- Consulter la [documentation Expo](https://docs.expo.dev/)
- Revoir la [documentation React Native](https://reactnative.dev/)

---

**Construit avec ❤️ en utilisant React Native et Expo** 