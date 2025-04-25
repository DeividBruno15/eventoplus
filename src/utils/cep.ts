
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
