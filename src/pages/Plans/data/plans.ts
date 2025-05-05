
import { Plan } from "../types";

export const providerPlans: Plan[] = [
  {
    id: "provider-essential",
    name: "Essencial",
    description: "Ideal para começar",
    price: 0,
    benefits: [
      "Perfil público básico",
      "1 serviço ativo",
      "Suporte via FAQ",
      "Avaliações de clientes", 
      "Acesso limitado às oportunidades"
    ],
    features: [
      "Perfil público básico",
      "1 serviço ativo",
      "Suporte via FAQ",
      "Avaliações de clientes", 
      "Acesso limitado às oportunidades"
    ],
    featured: false
  },
  {
    id: "provider-professional",
    name: "Profissional",
    description: "Para profissionais em crescimento",
    price: 14.90,
    benefits: [
      "Até 5 serviços ativos",
      "Prioridade no ranking de busca",
      "Métricas básicas (visitas, contatos)",
      "Suporte via chat comercial"
    ],
    features: [
      "Até 5 serviços ativos",
      "Prioridade no ranking de busca",
      "Métricas básicas (visitas, contatos)",
      "Suporte via chat comercial"
    ],
    featured: true
  },
  {
    id: "provider-premium",
    name: "Premium",
    description: "Recursos completos para seu negócio",
    price: 29.90,
    benefits: [
      "Serviços ilimitados",
      "Destaque nas categorias",
      "Painel completo de performance",
      "Agendamento com cliente",
      "Suporte prioritário + grupo exclusivo no WhatsApp"
    ],
    features: [
      "Serviços ilimitados",
      "Destaque nas categorias",
      "Painel completo de performance",
      "Agendamento com cliente",
      "Suporte prioritário + grupo exclusivo no WhatsApp"
    ],
    featured: false
  }
];

export const contractorPlans: Plan[] = [
  {
    id: "contractor-discover",
    name: "Descubra",
    description: "Comece a explorar",
    price: 0,
    benefits: [
      "Busca ilimitada",
      "Favoritar perfis",
      "Avaliar prestadores",
      "Histórico básico"
    ],
    features: [
      "Busca ilimitada",
      "Favoritar perfis",
      "Avaliar prestadores",
      "Histórico básico"
    ],
    featured: false
  },
  {
    id: "contractor-connect",
    name: "Conecta",
    description: "Conecte-se com profissionais",
    price: 14.90,
    benefits: [
      "Contato direto sem limite",
      "Briefings personalizados",
      "Agendamento e lembretes",
      "Suporte via chat"
    ],
    features: [
      "Contato direto sem limite",
      "Briefings personalizados",
      "Agendamento e lembretes",
      "Suporte via chat"
    ],
    featured: true
  },
  {
    id: "contractor-management",
    name: "Gestão",
    description: "Controle total dos seus projetos",
    price: 29.90,
    benefits: [
      "Histórico completo com exportação",
      "Requisições múltiplas",
      "Dashboard de controle",
      "Suporte premium + atendimento exclusivo"
    ],
    features: [
      "Histórico completo com exportação",
      "Requisições múltiplas",
      "Dashboard de controle",
      "Suporte premium + atendimento exclusivo"
    ],
    featured: false
  }
];

export const advertiserPlans: Plan[] = [
  {
    id: "advertiser-basic",
    name: "Básico",
    description: "Ideal para começar a anunciar locais",
    price: 19.90,
    benefits: [
      "1 local anunciado",
      "Fotos do espaço",
      "Descrição detalhada",
      "Suporte via FAQ"
    ],
    features: [
      "1 local anunciado",
      "Fotos do espaço",
      "Descrição detalhada",
      "Suporte via FAQ"
    ],
    featured: false
  },
  {
    id: "advertiser-premium",
    name: "Premium",
    description: "Para anunciantes profissionais",
    price: 39.90,
    benefits: [
      "Até 5 locais anunciados",
      "Destaque nas buscas",
      "Estatísticas de visualização",
      "Suporte prioritário",
      "Selo de verificação"
    ],
    features: [
      "Até 5 locais anunciados",
      "Destaque nas buscas",
      "Estatísticas de visualização",
      "Suporte prioritário",
      "Selo de verificação"
    ],
    featured: true
  },
  {
    id: "advertiser-enterprise",
    name: "Enterprise",
    description: "Potencialize seus anúncios",
    price: 79.90,
    benefits: [
      "Locais ilimitados",
      "Destaque máximo",
      "Estatísticas completas",
      "Suporte VIP",
      "Integração com calendário",
      "Agendamento automático"
    ],
    features: [
      "Locais ilimitados",
      "Destaque máximo",
      "Estatísticas completas",
      "Suporte VIP",
      "Integração com calendário",
      "Agendamento automático"
    ],
    featured: false
  }
];
