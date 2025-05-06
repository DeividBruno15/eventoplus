
export const fetchAddressByCep = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar CEP');
    }
    
    const data = await response.json();
    
    // A API do ViaCEP retorna um campo "erro" quando o CEP não é encontrado
    if (data.erro) {
      return null;
    }
    
    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      zipcode: cleanCep,
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};

// Format CEP with hyphen automatically as user types
export const formatCep = (cep: string): string => {
  // Remove non-digit characters
  const digits = cep.replace(/\D/g, '');
  
  // Apply mask when there are 5 or more digits
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  }
  
  return digits;
};

// This is the function referenced in LocationServiceFields
export const fetchLocationFromCEP = async (cep: string) => {
  try {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return null;

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar CEP');
    }
    
    const data = await response.json();
    
    if (data.erro) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};

// Add the consultarCep function that was missing
export const consultarCep = async (cep: string) => {
  return fetchAddressByCep(cep);
};

// Validate CPF
export const validateCPF = (cpf: string): boolean => {
  // Remove non-digits
  const cleanCpf = cpf.replace(/\D/g, '');
  
  // Check if it has 11 digits
  if (cleanCpf.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cleanCpf)) return false;
  
  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.charAt(9))) return false;
  
  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.charAt(10))) return false;
  
  return true;
};

// Format CPF with dots and dash (000.000.000-00)
export const formatCPF = (cpf: string): string => {
  const digits = cpf.replace(/\D/g, '');
  
  if (digits.length > 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  } else if (digits.length > 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  } else if (digits.length > 3) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  
  return digits;
};
