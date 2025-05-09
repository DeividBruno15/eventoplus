
const BackgroundEffects = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default BackgroundEffects;
