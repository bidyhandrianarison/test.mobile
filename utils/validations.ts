/**
 * Validates email format using regex pattern
 * @param email - Email string to validate
 * @returns True if email format is valid, false otherwise
 */
export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
/**
 * Validates password strength
 * @param password - Password string to validate
 * @returns True if password meets minimum requirements (6+ characters), false otherwise
 */
export const validatePassword = (password: string) => {
    return password && password.length >= 6;
  };

/**
 * Validates if image URI is valid (local file or URL)
 * @param imageUri - Image URI to validate
 * @returns True if image URI is valid, false otherwise
 */
export const validateImageUri = (imageUri: string) => {
  if (!imageUri.trim()) return false;
  
  // Accept local file URIs (file://, content://, etc.)
  if (imageUri.startsWith('file://') || imageUri.startsWith('content://')) {
    return true;
  }
  
  // Accept data URIs (base64 encoded images)
  if (imageUri.startsWith('data:image/')) {
    return true;
  }
  
  // Accept HTTP/HTTPS URLs
  if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
    return true;
  }
  
  return false;
};

/**
 * Validates product form fields
 * @param form - Object containing product form fields
 * @returns Object with error messages for each invalid field
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
  if (!validateImageUri(form.image)) errors.image = 'Image requise';
  
  return errors;
};

/**
 * Validates user profile form fields (name, email)
 * @param form - Object containing profile form fields
 * @returns Object with error messages for each invalid field
 */
export const validateProfileForm = (form: { name: string; email: string }) => {
  const errors: { [key: string]: string } = {};
  
  if (!form.name.trim()) errors.name = 'Nom requis';
  if (!form.email.trim()) errors.email = 'Email requis';
  else if (!validateEmail(form.email)) errors.email = 'Email invalide';
  
  return errors;
};