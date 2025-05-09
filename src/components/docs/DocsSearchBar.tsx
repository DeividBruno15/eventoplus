
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, File, BookOpen, HelpCircle, Laptop, Workflow, MessageSquare, Settings, Users } from 'lucide-react';
import { cn, debounce, normalizeString } from '@/lib/utils';

interface DocPage {
  title: string;
  path: string;
  keywords: string[];
  category: string;
  icon: keyof typeof icons;
}

// Define the icons used in search results
const icons = {
  file: <File className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />,
  help: <HelpCircle className="h-4 w-4" />,
  computer: <Laptop className="h-4 w-4" />,
  workflow: <Workflow className="h-4 w-4" />,
  message: <MessageSquare className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
  users: <Users className="h-4 w-4" />,
};

// Simulated documentation pages
const docPages: DocPage[] = [
  {
    title: 'Guia de Início',
    path: '/docs/getting-started',
    keywords: ['começar', 'início', 'primeiros passos', 'tutorial'],
    category: 'Guias',
    icon: 'book'
  },
  {
    title: 'Criação de Eventos',
    path: '/docs/creating-events',
    keywords: ['criar', 'evento', 'organizar', 'festa'],
    category: 'Guias',
    icon: 'workflow'
  },
  {
    title: 'Locais para Eventos',
    path: '/docs/venues',
    keywords: ['local', 'espaço', 'salão', 'buffet'],
    category: 'Funcionalidades',
    icon: 'file'
  },
  {
    title: 'Prestadores de Serviços',
    path: '/docs/providers',
    keywords: ['prestador', 'serviço', 'buffet', 'músicos'],
    category: 'Funcionalidades',
    icon: 'users'
  },
  {
    title: 'Configurações',
    path: '/docs/settings',
    keywords: ['configurar', 'perfil', 'conta', 'privacidade'],
    category: 'Suporte',
    icon: 'settings'
  },
  {
    title: 'Chat',
    path: '/docs/chat',
    keywords: ['mensagem', 'conversar', 'comunicação', 'contato'],
    category: 'Funcionalidades',
    icon: 'message'
  },
  {
    title: 'FAQ',
    path: '/docs/faq',
    keywords: ['perguntas', 'frequentes', 'dúvidas', 'ajuda'],
    category: 'Suporte',
    icon: 'help'
  }
];

export const DocsSearchBar = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<DocPage[]>([]);
  const navigate = useNavigate();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Effect for keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search function wrapped with debounce for performance
  const debouncedSearch = debounce((term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    const normalizedSearchTerm = normalizeString(term);

    const matchedPages = docPages.filter(page => {
      // Check title match
      if (normalizeString(page.title).includes(normalizedSearchTerm)) {
        return true;
      }
      
      // Check keywords match
      return page.keywords.some(keyword => 
        normalizeString(keyword).includes(normalizedSearchTerm)
      );
    });

    setResults(matchedPages);
  }, 200);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle selection of search result
  const handleSelect = (page: DocPage) => {
    navigate(page.path);
    setOpen(false);
  };

  return (
    <div className="w-full sm:max-w-[400px] md:max-w-[500px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            size="sm"
            className="w-full justify-between text-muted-foreground border-dashed gap-1"
            onClick={() => setOpen(true)}
          >
            <div className="flex items-center">
              <Search className="mr-2 h-3.5 w-3.5" />
              <span>Pesquisar na documentação...</span>
            </div>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-xs font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              value={searchTerm}
              onValueChange={handleSearchChange}
              placeholder="Pesquisar artigos, guias e tutoriais..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              {results.length > 0 && (
                <CommandGroup heading="Resultados">
                  {results.map((page) => (
                    <CommandItem 
                      key={page.path}
                      value={page.title}
                      onSelect={() => handleSelect(page)}
                      className="flex items-center gap-2"
                    >
                      <div className={cn(
                        "mr-2 flex h-6 w-6 items-center justify-center rounded-md border",
                        page.category === 'Guias' ? "bg-blue-50 border-blue-200" :
                        page.category === 'Funcionalidades' ? "bg-green-50 border-green-200" :
                        "bg-amber-50 border-amber-200"
                      )}>
                        {icons[page.icon]}
                      </div>
                      <div className="flex flex-col">
                        <span>{page.title}</span>
                        <span className="text-xs text-muted-foreground">{page.category}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {!searchTerm && (
                <CommandGroup heading="Documentos populares">
                  {docPages.slice(0, 3).map((page) => (
                    <CommandItem 
                      key={page.path}
                      onSelect={() => handleSelect(page)}
                      className="flex items-center gap-2"
                    >
                      <div className={cn(
                        "mr-2 flex h-6 w-6 items-center justify-center rounded-md border",
                        page.category === 'Guias' ? "bg-blue-50 border-blue-200" :
                        page.category === 'Funcionalidades' ? "bg-green-50 border-green-200" :
                        "bg-amber-50 border-amber-200"
                      )}>
                        {icons[page.icon]}
                      </div>
                      {page.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DocsSearchBar;
