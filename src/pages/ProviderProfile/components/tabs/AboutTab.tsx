
interface AboutTabProps {
  tagline: string;
  description: string;
}

export const AboutTab = ({ tagline, description }: AboutTabProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-2">{tagline}</h2>
      <p className="text-gray-700 mb-6">
        {description}
      </p>
      
      <h3 className="font-semibold mb-3">Informações de contato</h3>
      <div className="space-y-2 text-gray-700">
        <p>Email: contato@anafotografia.com</p>
        <p>Telefone: (11) 98765-4321</p>
        <p>Website: www.anafotografia.com</p>
      </div>
    </>
  );
};
