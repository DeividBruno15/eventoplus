
# Evento+ - Plataforma de Eventos

## Visão Geral

Evento+ é uma plataforma que conecta organizadores de eventos com prestadores de serviços e locais para realização de eventos. A plataforma facilita a criação, divulgação e gestão de eventos, além de permitir que prestadores de serviços se candidatem a oportunidades.

## Funcionalidades Principais

- Registro e autenticação de usuários (contratantes, prestadores, anunciantes)
- Criação e gestão de eventos
- Candidatura a eventos por prestadores de serviços
- Anúncio de locais para eventos
- Troca de mensagens entre usuários
- Sistema de avaliações
- Painel administrativo
- Versão mobile-first para futura conversão em app nativo

## Tecnologias Utilizadas

- **Frontend:** React, Vite, TypeScript, TailwindCSS, ShadcnUI
- **Backend:** Supabase (Banco de dados PostgreSQL, Autenticação, Armazenamento)
- **Mobile:** Estrutura compatível com CapacitorJS para futuro app nativo

## Estrutura do Projeto

```
/
├── public/            # Arquivos estáticos
├── src/
│   ├── components/    # Componentes reutilizáveis
│   ├── hooks/         # Hooks personalizados
│   ├── layouts/       # Layouts da aplicação
│   ├── lib/           # Utilitários e funções auxiliares
│   ├── pages/         # Páginas da aplicação
│   ├── types/         # Definições de tipos TypeScript
│   ├── utils/         # Funções utilitárias
│   ├── App.tsx        # Componente raiz da aplicação
│   └── main.tsx       # Ponto de entrada da aplicação
├── capacitor.config.ts # Configuração para CapacitorJS
└── package.json       # Dependências do projeto
```

## Versão Mobile

O projeto está preparado para ser convertido em um aplicativo móvel nativo usando CapacitorJS. A versão mobile mantém todas as funcionalidades da plataforma web, mas com uma interface otimizada para dispositivos móveis.

### Características da Versão Mobile:

- Navegação inferior (bottom tabs)
- Interface otimizada para toque
- Splash screen
- Notificações push
- Layout responsivo

## Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

### Construir para Produção

```
npm run build
```

### Preparação para Capacitor (App Nativo)

1. Construa o projeto:
   ```
   npm run build
   ```

2. Inicialize Capacitor:
   ```
   npx cap init
   ```

3. Adicione as plataformas desejadas:
   ```
   npx cap add android
   npx cap add ios
   ```

4. Sincronize o projeto:
   ```
   npx cap sync
   ```

5. Abra o projeto na IDE nativa:
   ```
   npx cap open android
   npx cap open ios
   ```

## Funcionalidades Futuras

- Integração com pagamentos
- Sistema de assinaturas
- Módulo de relatórios avançados
- Integração com calendários externos
- Recursos de marketing para eventos
