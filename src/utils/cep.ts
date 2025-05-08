
/**
 * Function to validate and format CEP (Brazilian postal code)
 */
export const formatCep = (cep: string): string => {
  // Remove non-digit characters
  cep = cep.replace(/\D/g, '');
  
  // Format CEP as 00000-000
  if (cep.length > 5) {
    cep = `${cep.substring(0, 5)}-${cep.substring(5, 8)}`;
  }
  
  return cep;
};

/**
 * Function to format CPF (Brazilian individual taxpayer registry)
 */
export const formatCPF = (cpf: string): string => {
  // Remove non-digit characters
  cpf = cpf.replace(/\D/g, '');
  
  // Format CPF as 000.000.000-00
  if (cpf.length > 9) {
    cpf = `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
  } else if (cpf.length > 6) {
    cpf = `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6)}`;
  } else if (cpf.length > 3) {
    cpf = `${cpf.substring(0, 3)}.${cpf.substring(3)}`;
  }
  
  return cpf;
};

/**
 * Function to validate CPF
 */
export const validateCPF = (cpf: string): boolean => {
  // Remove any non-digit character
  cpf = cpf.replace(/\D/g, '');
  
  // CPF must have 11 digits
  if (cpf.length !== 11) {
    return false;
  }
  
  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  
  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = sum % 11;
  let checkDigit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cpf.charAt(9)) !== checkDigit1) {
    return false;
  }
  
  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  let checkDigit2 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cpf.charAt(10)) !== checkDigit2) {
    return false;
  }
  
  return true;
};

/**
 * Function to query a CEP and return address data
 */
export const consultarCep = async (cep: string): Promise<{
  street: string;
  neighborhood: string;
  city: string;
  state: string;
} | null> => {
  try {
    // Remove non-digit characters for API request
    const cleanCep = cep.replace(/\D/g, '');
    
    // Call ViaCEP API
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return null;
    }
    
    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || ''
    };
  } catch (error) {
    console.error('Error consulting CEP:', error);
    return null;
  }
};

/**
 * Alternative name for consultarCep to maintain compatibility with existing code
 */
export const fetchAddressByCep = consultarCep;

/**
 * Function to fetch location data from CEP
 */
export const fetchLocationFromCEP = async (cep: string) => {
  try {
    // Remove non-digit characters for API request
    const cleanCep = cep.replace(/\D/g, '');
    
    // Call ViaCEP API
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching location from CEP:', error);
    return null;
  }
};
