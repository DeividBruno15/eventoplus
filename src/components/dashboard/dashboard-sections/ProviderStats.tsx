
import { Card, CardContent } from "@/components/ui/card";

export const ProviderStats = () => {
  const stats = [
    { title: "Solicitações", value: "15", change: "+4", status: "positive" },
    { title: "Taxa de Conversão", value: "68%", change: "+2.5%", status: "positive" },
    { title: "Avaliação", value: "4.8", change: "0", status: "neutral" },
    { title: "Tempo de Resposta", value: "2h", change: "-30min", status: "positive" }
  ];

  return (
    <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
            <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.title}
            </p>
            <div className={`text-xs mt-1 md:mt-2 flex items-center ${
              stat.status === 'positive' ? 'text-green-500' : 
              stat.status === 'negative' ? 'text-red-500' : 'text-gray-500'
            }`}>
              {stat.status === 'positive' ? '↑' : 
               stat.status === 'negative' ? '↓' : '•'} {stat.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
