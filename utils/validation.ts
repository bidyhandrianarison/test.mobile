export const validateEmail = (email:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password:string) => {
    return password && password.length >= 6;
  };

  /**
   * Valide les champs d'un formulaire produit
   * @param form - objet contenant les champs du produit
   * @returns objet d'erreurs par champ
   */
  export const validateProductForm = (form: {
    name: string;
    description: string;
    price: string;
    stock: string;
    category: string;
    vendeurs: string;
    image: string;
  }) => {
    const errors: { [key: string]: string } = {};
    if (!form.name.trim()) errors.name = 'Nom requis';
    if (!form.description.trim()) errors.description = 'Description requise';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errors.price = 'Prix invalide';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) errors.stock = 'Stock invalide';
    if (!form.category.trim()) errors.category = 'Catégorie requise';
    if (!form.vendeurs.trim()) errors.vendeurs = 'Vendeur requis';
    if (!form.image.trim()) errors.image = 'Image requise';
    return errors;
  };

  /**
   * Valide les champs du profil utilisateur (nom, email)
   * @param form - objet contenant les champs du profil
   * @returns objet d'erreurs par champ
   */
  export const validateProfileForm = (form: { name: string; email: string }) => {
    const errors: { [key: string]: string } = {};
    if (!form.name.trim()) errors.name = 'Le nom est requis';
    if (!form.email.trim()) errors.email = "L'email est requis";
    else if (!validateEmail(form.email)) errors.email = "Email invalide";
    return errors;
  };