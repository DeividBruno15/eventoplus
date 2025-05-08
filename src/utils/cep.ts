
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
