
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortfolioTab } from './tabs/PortfolioTab';
import { AboutTab } from './tabs/AboutTab';
import { ServicesTab } from './tabs/ServicesTab';
import { ReviewsTab } from './tabs/ReviewsTab';

interface Provider {
  id: string;
  name: string;
  tagline: string;
  description: string;
  services: string[];
  rating: number;
  reviewCount: number;
  portfolio: string[];
  reviews: Array<{
    id: string;
    name: string;
    rating: number;
    date: string;
    comment: string;
    userImage: string;
  }>;
}

interface ProviderContentProps {
  provider: Provider;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ProviderContent = ({ provider, activeTab, setActiveTab }: ProviderContentProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-muted overflow-hidden">
        {/* Tabs Navigation */}
        <Tabs defaultValue="portfolio" className="w-full">
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none bg-transparent border-b">
              <TabsTrigger 
                value="portfolio" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Portfólio
              </TabsTrigger>
              <TabsTrigger 
                value="sobre" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Sobre
              </TabsTrigger>
              <TabsTrigger 
                value="servicos" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Serviços
              </TabsTrigger>
              <TabsTrigger 
                value="avaliacoes" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Avaliações
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="p-6">
            <PortfolioTab portfolio={provider.portfolio} />
          </TabsContent>
          
          {/* About Tab */}
          <TabsContent value="sobre" className="p-6">
            <AboutTab 
              tagline={provider.tagline} 
              description={provider.description} 
            />
          </TabsContent>
          
          {/* Services Tab */}
          <TabsContent value="servicos" className="p-6">
            <ServicesTab 
              services={provider.services}
              providerId={provider.id}
            />
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="avaliacoes" className="p-6">
            <ReviewsTab 
              reviews={provider.reviews}
              rating={provider.rating}
              reviewCount={provider.reviewCount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
