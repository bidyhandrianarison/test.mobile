/**
 * Centralized translation system for French text strings
 * All user-facing text should be defined here and imported where needed
 */

export const translations = {
  // Authentication
  auth: {
    login: 'Connexion',
    signIn: 'Se connecter',
    signUp: 'S\'inscrire',
    createAccount: 'Créer un compte',
    email: 'Email',
    password: 'Mot de passe',
    username: 'Nom d\'utilisateur',
    noAccount: 'Vous n\'avez pas de compte ?',
    createAccountLink: 'Créer un compte',
    haveAccount: 'Vous avez déjà un compte ?',
    signInLink: 'Se connecter',
    signInToManage: 'Connectez-vous à votre compte pour gérer vos produits',
    joinToManage: 'Rejoignez-nous pour gérer vos produits',
  },

  // Validation messages
  validation: {
    emailRequired: 'Email requis',
    emailInvalid: 'Email invalide',
    emailFormat: 'Format d\'email invalide',
    passwordRequired: 'Mot de passe requis',
    passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
    usernameRequired: 'Nom d\'utilisateur requis',
    usernameTooShort: 'Nom d\'utilisateur trop court (minimum 3 caractères)',
    imageRequired: 'Image requise (URL)',
    nameRequired: 'Nom requis',
    descriptionRequired: 'Description requise',
    priceRequired: 'Prix requis',
    stockRequired: 'Stock requis',
  },

  // Error messages
  errors: {
    networkError: 'Erreur réseau. Vérifiez votre connexion internet et réessayez.',
    emailAlreadyInUse: 'Cet email est déjà utilisé. Utilisez un autre email ou connectez-vous.',
    emailNotFound: 'Aucun compte trouvé avec cet email. Inscrivez-vous ou vérifiez votre email.',
    wrongPassword: 'Mot de passe incorrect. Vérifiez votre mot de passe et réessayez.',
    weakPassword: 'Le mot de passe doit contenir au moins 6 caractères.',
    usernameTaken: 'Ce nom d\'utilisateur est déjà pris. Choisissez un autre nom d\'utilisateur.',
    invalidCredentials: 'Email ou mot de passe incorrect. Vérifiez vos identifiants.',
    signupFailed: 'Impossible de créer le compte. Réessayez.',
    unknownError: 'Une erreur inconnue s\'est produite.',
    somethingWentWrong: 'Quelque chose s\'est mal passé. Réessayez.',
    addProductError: 'Impossible d\'ajouter le produit',
    updateProductError: 'Impossible de mettre à jour le produit',
    permissionRequired: 'Permission requise',
    galleryPermission: 'Autorisez l\'accès à la galerie pour choisir une image.',
  },

  // Navigation
  navigation: {
    home: 'Accueil',
    profile: 'Profil',
    products: 'Produits',
    addProduct: 'Ajouter un produit',
    editProduct: 'Modifier le produit',
    productDetail: 'Détail du produit',
    editProfile: 'Modifier le profil',
  },

  // Loading states
  loading: {
    loading: 'Chargement...',
    saving: 'Enregistrement...',
    updating: 'Mise à jour...',
    deleting: 'Suppression...',
  },

  // Product management
  products: {
    allProducts: 'Tous les produits',
    activeProducts: 'Produits actifs',
    inactiveProducts: 'Produits inactifs',
    averagePrice: 'Prix moyen',
    categories: 'Catégories',
    totalValue: 'Valeur totale',
    noProducts: 'Aucun produit à afficher',
    noProductsSubtitle: 'Ajoutez un produit ou modifiez vos filtres pour voir des résultats.',
    startAddingProducts: 'Commencez par ajouter votre premier produit pour voir vos statistiques !',
    youHaveCreated: 'Vous avez créé un total de',
    product: 'produit',
    products: 'produits',
    youHaventCreated: 'Vous n\'avez pas encore créé de produits',
    yourCategories: 'Vos catégories :',
    productAdded: 'Produit ajouté avec succès',
    productUpdated: 'Produit mis à jour avec succès',
    productDeleted: 'Produit supprimé avec succès',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
    units: 'unités',
    createdBy: 'Créé par',
    createdAt: 'Créé le',
    details: 'Détails du produit',
    lowStock: 'Stock faible',
  },

  // Product form
  productForm: {
    productName: 'Nom du produit',
    productDescription: 'Description du produit',
    price: 'Prix',
    stock: 'Stock',
    category: 'Catégorie',
    seller: 'Vendeur',
    productImage: 'Image du produit',
    selectImage: 'Sélectionner une image',
    addProduct: 'Ajouter un produit',
    saveChanges: 'Enregistrer les modifications',
  },

  // Search and filters
  search: {
    searchProducts: 'Rechercher des produits',
    searchResults: 'Résultats pour',
    noResults: 'Aucun résultat trouvé',
    noResultsSubtitle: 'Essayez de modifier vos critères de recherche',
    filters: 'Filtres',
    category: 'Catégorie',
    seller: 'Vendeur',
    price: 'Prix',
    min: 'Min',
    max: 'Max',
    activeOnly: 'Actifs uniquement',
    applyFilters: 'Appliquer les filtres',
    reset: 'Réinitialiser',
    activeFilters: 'filtre appliqué',
    activeFiltersPlural: 'filtres appliqués',
  },

  // Pagination
  pagination: {
    previous: 'Précédent',
    next: 'Suivant',
    page: 'Page',
    of: 'sur',
  },

  // Profile
  profile: {
    welcome: 'Bienvenue',
    discoverProducts: 'Découvrez nos produits',
    logout: 'Déconnexion',
    logoutConfirm: 'Voulez-vous vraiment vous déconnecter ?',
    cancel: 'Annuler',
    editProfile: 'Modifier le profil',
  },

  // Status and actions
  status: {
    active: 'Actif',
    inactive: 'Inactif',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    close: 'Fermer',
  },

  // Common
  common: {
    error: 'Erreur',
    success: 'Succès',
    info: 'Information',
    warning: 'Attention',
    ok: 'OK',
    yes: 'Oui',
    no: 'Non',
    retry: 'Réessayer',
    unknown: 'Inconnu',
  },
};

/**
 * Helper function to get translation with optional pluralization
 */
export const t = (key: string, params?: Record<string, string | number>): string => {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  if (typeof value === 'string') {
    if (params) {
      return Object.entries(params).reduce((str, [key, val]) => {
        return str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val));
      }, value);
    }
    return value;
  }
  
  console.warn(`Translation value is not a string: ${key}`);
  return key;
};

/**
 * Helper function for pluralization
 */
export const pluralize = (singular: string, plural: string, count: number): string => {
  return count === 1 ? singular : plural;
};

export default translations; 