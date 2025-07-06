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
  
  if (!form.name.trim()) errors.name = 'Name required';
  if (!form.description.trim()) errors.description = 'Description required';
  if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errors.price = 'Invalid price';
  if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) errors.stock = 'Invalid stock';
  if (!form.category.trim()) errors.category = 'Category required';
  if (!form.vendeurs.trim()) errors.vendeurs = 'Vendor required';
  if (!form.image.trim()) errors.image = 'Image required';
  
  return errors;
};

/**
 * Validates user profile form fields (name, email)
 * @param form - Object containing profile form fields
 * @returns Object with error messages for each invalid field
 */
export const validateProfileForm = (form: { name: string; email: string }) => {
  const errors: { [key: string]: string } = {};
  
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!validateEmail(form.email)) errors.email = 'Invalid email';
  
  return errors;
};