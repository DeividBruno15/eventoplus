
import { Plan } from "../types";

export const providerPlans: Plan[] = [
  {
    name: "Essencial",
    description: "Ideal para começar",
    price: 0,
    benefits: [
      "Perfil público básico",
      "1 serviço ativo",
      "Suporte via FAQ",
      "Avaliações de clientes", 
      "Acesso limitado às oportunidades"
    ]
  },
  {
    name: "Profissional",
    description: "Para profissionais em crescimento",
    price: 14.90,
    benefits: [
      "Até 5 serviços ativos",
      "Prioridade no ranking de busca",
      "Métricas básicas (visitas, contatos)",
      "Suporte via chat comercial"
    ]
  },
  {
    name: "Premium",
    description: "Recursos completos para seu negócio",
    price: 29.90,
    benefits: [
      "Serviços ilimitados",
      "Destaque nas categorias",
      "Painel completo de performance",
      "Agendamento com cliente",
      "Suporte prioritário + grupo exclusivo no WhatsApp"
    ]
  }
];

export const contractorPlans: Plan[] = [
  {
    name: "Descubra",
    description: "Comece a explorar",
    price: 0,
    benefits: [
      "Busca ilimitada",
      "Favoritar perfis",
      "Avaliar prestadores",
      "Histórico básico"
    ]
  },
  {
    name: "Conecta",
    description: "Conecte-se com profissionais",
    price: 14.90,
    benefits: [
      "Contato direto sem limite",
      "Briefings personalizados",
      "Agendamento e lembretes",
      "Suporte via chat"
    ]
  },
  {
    name: "Gestão",
    description: "Controle total dos seus projetos",
    price: 29.90,
    benefits: [
      "Histórico completo com exportação",
      "Requisições múltiplas",
      "Dashboard de controle",
      "Suporte premium + atendimento exclusivo"
    ]
  }
];
