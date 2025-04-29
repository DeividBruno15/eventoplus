
interface PortfolioTabProps {
  portfolio: string[];
}

export const PortfolioTab = ({ portfolio }: PortfolioTabProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {portfolio.map((image, index) => (
        <div key={index} className="aspect-square rounded-md overflow-hidden border border-muted">
          <img 
            src={image} 
            alt={`Portfolio ${index + 1}`} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
};
