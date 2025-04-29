
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ProviderProfileHeader } from './components/ProviderProfileHeader';
import { ProviderContent } from './components/ProviderContent';

const ProviderProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('portfolio');
  
  // Mock data for provider profile - in a real app, you would fetch this data from an API
  const provider = {
    id: id || '1',
    name: 'Ana Fotografia',
    tagline: 'Capturando momentos especiais com arte e sensibilidade',
    description: 'Com mais de 10 anos de experiência em fotografia para eventos, oferecemos serviços de alta qualidade para casamentos, aniversários, formaturas e eventos corporativos. Nossa equipe é especializada em capturar momentos únicos e emocionantes de forma natural e artística.',
    services: ['Fotografia', 'Filmagem', 'Álbum digital', 'Cabine de fotos'],
    rating: 4.8,
    reviewCount: 42,
    city: 'São Paulo, SP',
    coverImage: '/placeholder.svg',
    profileImage: '/placeholder.svg',
    portfolio: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg'
    ],
    reviews: [
      {
        id: '1',
        name: 'Mariana Costa',
        rating: 5,
        date: '12/10/2023',
        comment: 'Excelente trabalho! As fotos do nosso casamento ficaram perfeitas, capturando todas as emoções do dia. Super recomendo!',
        userImage: '/placeholder.svg'
      },
      {
        id: '2',
        name: 'Ricardo Almeida',
        rating: 4,
        date: '05/09/2023',
        comment: 'Muito profissional e atenciosa. As fotos do evento corporativo ficaram ótimas e foram entregues antes do prazo.',
        userImage: '/placeholder.svg'
      },
      {
        id: '3',
        name: 'Juliana Santos',
        rating: 5,
        date: '22/08/2023',
        comment: 'Ana e sua equipe são incríveis! Conseguiram capturar momentos que nem sabíamos que estavam acontecendo. Resultado final surpreendente!',
        userImage: '/placeholder.svg'
      }
    ]
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="flex-grow">
        <ProviderProfileHeader provider={provider} />
        <ProviderContent provider={provider} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <Footer />
    </div>
  );
};

export default ProviderProfile;
