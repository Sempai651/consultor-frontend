// Validación de cédula ecuatoriana
export const validateEcuadorianId = (ci: string): boolean => {
  if (!ci || ci.length !== 10) return false;
  
  // Validar que solo sean números
  if (!/^\d+$/.test(ci)) return false;
  
  const digits = ci.split('').map(Number);
  const province = digits[0] * 10 + digits[1];
  if (province < 1 || province > 24) return false;
  
  const lastDigit = digits[9];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let num = digits[i];
    if (i % 2 === 0) {
      num *= 2;
      if (num > 9) num -= 9;
    }
    sum += num;
  }
  
  const calculatedDigit = (Math.ceil(sum / 10) * 10 - sum) % 10;
  return lastDigit === calculatedDigit;
};

export const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const getPasswordError = (password: string): string => {
  if (!password) return 'La contraseña es requerida';
  if (password.length < 8) return 'Mínimo 8 caracteres';
  if (!/[a-z]/.test(password)) return 'Debe tener una letra minúscula';
  if (!/[A-Z]/.test(password)) return 'Debe tener una letra mayúscula';
  if (!/\d/.test(password)) return 'Debe tener un número';
  if (!/[@$!%*?&]/.test(password)) return 'Debe tener un carácter especial (@$!%*?&)';
  return '';
};

export const getCiError = (ci: string): string => {
  if (!ci) return 'La cédula es requerida';
  if (ci.length !== 10) return 'La cédula debe tener 10 dígitos';
  if (!/^\d+$/.test(ci)) return 'Solo se permiten números';
  if (!validateEcuadorianId(ci)) return 'Cédula ecuatoriana inválida';
  return '';
};