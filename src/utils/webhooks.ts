
/**
 * Funções de utilidade para integração com webhooks externos
 */

/**
 * Envia dados para um webhook externo
 * @param url URL do webhook
 * @param data Dados a serem enviados
 * @returns Resposta do webhook ou null em caso de erro
 */
export const sendToWebhook = async (url: string, data: any): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Webhook response not OK: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error sending data to webhook:", error);
    return null;
  }
};

/**
 * Formata os dados de evento para envio ao webhook do n8n
 * @param event Objeto do evento
 * @returns Objeto formatado para o webhook
 */
export const formatEventForWebhook = (event: any) => {
  return {
    evento_id: event.id,
    nome: event.name,
    data: event.event_date,
    tipo_servico: event.service_type || '',
    local: event.location || '',
    descricao: event.description || '',
    status: event.status || 'published',
    criado_em: new Date().toISOString(),
  };
};
