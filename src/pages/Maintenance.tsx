
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Wrench, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Maintenance = () => {
  const [countdown, setCountdown] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  // Simulação de contagem regressiva - defina a data final de manutenção
  useEffect(() => {
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 2); // Manutenção de 2 horas (exemplo)
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / 1000));
      setCountdown(diff);
      
      if (diff <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um e-mail válido",
        variant: "destructive"
      });
      return;
    }
    
    // Aqui você implementaria a lógica real para registrar o e-mail
    console.log("Inscrever email:", email);
    setIsSubscribed(true);
    toast({
      title: "Sucesso",
      description: "Você será notificado quando o sistema voltar ao ar",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/30),transparent_70%)]"></div>
      </div>
      
      <main className="flex-grow flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-xl shadow-lg border border-border overflow-hidden"
          >
            <div className="p-8 md:p-10 space-y-8">
              <div className="space-y-3">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6"
                >
                  <Wrench className="h-8 w-8 text-primary" />
                </motion.div>
                
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  Estamos em manutenção
                </h1>
                
                <p className="text-muted-foreground text-lg">
                  Estamos trabalhando para melhorar sua experiência. 
                  O sistema estará de volta em breve.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Tempo estimado para conclusão</h3>
                  </div>
                  <div className="mt-3 flex items-center justify-center">
                    <div className="text-2xl md:text-4xl font-mono font-semibold text-primary">
                      {formatTime(countdown)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">O que estamos fazendo?</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2">
                      <ArrowRight className="h-5 w-5 flex-shrink-0 text-primary" />
                      <span>Melhorando o desempenho do sistema</span>
                    </li>
                    <li className="flex gap-2">
                      <ArrowRight className="h-5 w-5 flex-shrink-0 text-primary" />
                      <span>Atualizando para novas funcionalidades</span>
                    </li>
                    <li className="flex gap-2">
                      <ArrowRight className="h-5 w-5 flex-shrink-0 text-primary" />
                      <span>Reforçando medidas de segurança</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border-t border-border pt-6">
                  {!isSubscribed ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="font-medium">Seja notificado quando voltarmos</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Informe seu e-mail para receber um aviso quando o sistema estiver online.
                      </p>
                      <form onSubmit={handleSubscribe} className="flex gap-2 mt-2">
                        <input
                          type="email"
                          placeholder="Seu e-mail"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button type="submit">
                          Notifique-me
                        </Button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-secondary/10 p-4 rounded-lg text-center"
                    >
                      <p className="font-medium text-secondary">
                        Obrigado! Você será notificado quando a manutenção terminar.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span>Caso precise de suporte urgente, entre em contato com nossa equipe.</span>
              </div>
              <Button variant="outline" onClick={() => window.location.href = 'mailto:suporte@eventoplusconect.com'}>
                Contato de emergência
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Maintenance;
