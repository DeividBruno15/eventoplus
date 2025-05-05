
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
    id: "advertiser-divulgue",
    name: "Divulgue",
    description: "Para quem está começando",
    price: 0,
    benefits: [
      "Cadastro de 1 local com fotos, descrição e localização",
      "Aparecimento no diretório básico de locais",
      "Recebimento de até 3 leads por mês",
      "Estatísticas simples (visualizações do local)",
      "Visibilidade geográfica limitada (prioriza buscas locais)"
    ],
    features: [
      "Cadastro de 1 local com fotos, descrição e localização",
      "Aparecimento no diretório básico de locais",
      "Recebimento de até 3 leads por mês",
      "Estatísticas simples (visualizações do local)",
      "Visibilidade geográfica limitada (prioriza buscas locais)"
    ],
    featured: false
  },
  {
    id: "advertiser-alcance",
    name: "Alcance",
    description: "Para quem busca mais visibilidade",
    price: 14.90,
    benefits: [
      "Cadastro de até 5 locais",
      "Destaque intermediário nas buscas por espaço",
      "Leads ilimitados (via formulário ou contato direto)",
      "Visibilidade segmentada por categoria de evento",
      "Estatísticas completas (cliques, leads e perfil de quem visualizou)",
      "Suporte via e-mail"
    ],
    features: [
      "Cadastro de até 5 locais",
      "Destaque intermediário nas buscas por espaço",
      "Leads ilimitados (via formulário ou contato direto)",
      "Visibilidade segmentada por categoria de evento",
      "Estatísticas completas (cliques, leads e perfil de quem visualizou)",
      "Suporte via e-mail"
    ],
    featured: true
  },
  {
    id: "advertiser-vitrine",
    name: "Vitrine",
    description: "Para quem quer ocupar o topo das buscas",
    price: 29.90,
    benefits: [
      "Locais ilimitados",
      "Posição de destaque nas buscas com selo 'Espaço em destaque'",
      "Exibição em páginas de eventos compatíveis",
      "Adição de vídeos e tours virtuais no perfil do local",
      "Insights de comportamento dos organizadores (quem viu, clicou, etc)",
      "Suporte prioritário + consultoria mensal de otimização"
    ],
    features: [
      "Locais ilimitados",
      "Posição de destaque nas buscas com selo 'Espaço em destaque'",
      "Exibição em páginas de eventos compatíveis",
      "Adição de vídeos e tours virtuais no perfil do local",
      "Insights de comportamento dos organizadores (quem viu, clicou, etc)",
      "Suporte prioritário + consultoria mensal de otimização"
    ],
    featured: false
  }
];
