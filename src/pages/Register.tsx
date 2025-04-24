
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

const Register = () => {
  const [userType, setUserType] = useState<'contratante' | 'prestador'>('contratante');
  const [personType, setPersonType] = useState<'fisica' | 'juridica'>('fisica');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [document, setDocument] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Service categories
  const serviceCategories = [
    'Buffet', 'DJ', 'Fotografia', 'Decoração', 'Iluminação', 'Segurança',
    'Banda', 'Bartender', 'Aluguel de Móveis', 'Lembrancinhas', 'Convites'
  ];
  
  // Get user type from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'contratante' || type === 'prestador') {
      setUserType(type);
    }
  }, [location]);
  
  const handleServiceToggle = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(item => item !== service));
    } else {
      if (selectedServices.length < 3) {
        setSelectedServices([...selectedServices, service]);
      }
    }
  };
  
  const handleNextStep = () => {
    setStep(step + 1);
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard after successful registration
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Crie sua conta</CardTitle>
            <CardDescription>
              Preencha os dados para se cadastrar na plataforma
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as 'contratante' | 'prestador')} className="mb-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="contratante">Sou Contratante</TabsTrigger>
                <TabsTrigger value="prestador">Sou Prestador</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="label">Nome completo</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="label">E-mail</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="label">Senha</label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="label">Confirme a senha</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="button" onClick={handleNextStep} className="w-full bg-primary">
                      Continuar
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <div className="mb-6">
                    <label className="label">Tipo de pessoa</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        className={`p-4 border rounded-md text-center ${
                          personType === 'fisica' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted'
                        }`}
                        onClick={() => setPersonType('fisica')}
                      >
                        Pessoa Física
                      </button>
                      <button
                        type="button"
                        className={`p-4 border rounded-md text-center ${
                          personType === 'juridica' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted'
                        }`}
                        onClick={() => setPersonType('juridica')}
                      >
                        Pessoa Jurídica
                      </button>
                    </div>
                  </div>
                  
                  {personType === 'juridica' && (
                    <div>
                      <label htmlFor="companyName" className="label">Nome da empresa</label>
                      <input
                        id="companyName"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="input"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="document" className="label">
                      {personType === 'fisica' ? 'CPF' : 'CNPJ'}
                    </label>
                    <input
                      id="document"
                      type="text"
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="label">Endereço</label>
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="label">Cidade</label>
                      <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="label">Estado</label>
                      <input
                        id="state"
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                  
                  {userType === 'prestador' && step === 2 && (
                    <div>
                      <label className="label">Selecione até 3 categorias de serviços</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {serviceCategories.map((service) => (
                          <button
                            key={service}
                            type="button"
                            onClick={() => handleServiceToggle(service)}
                            disabled={!selectedServices.includes(service) && selectedServices.length >= 3}
                            className={`p-2 text-sm border rounded-md ${
                              selectedServices.includes(service)
                                ? 'bg-primary text-white'
                                : selectedServices.length >= 3 && !selectedServices.includes(service)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'hover:bg-primary/5'
                            }`}
                          >
                            {service}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Selecionados: {selectedServices.length}/3
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      Voltar
                    </Button>
                    <Button type="submit" className="bg-primary" disabled={isLoading}>
                      {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou cadastre-se com</span>
              </div>
            </div>
            
            <Button type="button" variant="outline" className="w-full">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Cadastrar com Google
            </Button>
          </CardContent>
          
          <CardFooter className="text-center">
            <div className="w-full text-sm">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
