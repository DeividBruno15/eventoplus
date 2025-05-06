
const MissionVision = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Nossa Missão</h2>
        <p className="text-gray-700 leading-relaxed">
          Simplificar a organização de eventos através de uma plataforma que conecte 
          contratantes, prestadores de serviços e espaços de forma intuitiva e eficiente, 
          garantindo experiências memoráveis e resultados excepcionais para todos os envolvidos.
        </p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Nossa Visão</h2>
        <p className="text-gray-700 leading-relaxed">
          Ser a plataforma líder no mercado de eventos, reconhecida pela excelência, 
          inovação e por transformar a maneira como as pessoas organizam, oferecem e 
          executam seus eventos em todo o Brasil.
        </p>
      </div>
    </div>
  );
};

export default MissionVision;
