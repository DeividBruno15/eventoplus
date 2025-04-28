
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

// Format CEP with hyphen
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
