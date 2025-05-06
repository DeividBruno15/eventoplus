
const TeamMember = ({ name, role, initials }) => {
  return (
    <div className="text-center">
      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
        {initials}
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-500">{role}</p>
    </div>
  );
};

const TeamSection = () => {
  const team = [
    { name: "Lucas Pereira", role: "CEO & Fundador", initials: "LP" },
    { name: "Mariana Costa", role: "CTO", initials: "MC" },
    { name: "Rafael Santos", role: "Head de Operações", initials: "RS" }
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-center">Nosso Time</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
