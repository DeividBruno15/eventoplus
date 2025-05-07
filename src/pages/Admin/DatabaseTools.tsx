
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { exportDatabaseData, importDatabaseData } from '@/utils/dataExport';
import { AlertCircle, Download, Upload, Check } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';

const DatabaseTools = () => {
  const { user } = useAuth();
  const [selectedTables, setSelectedTables] = useState<string[]>([
    'service_categories',
    'user_profiles',
    'provider_services',
    'events',
    'event_applications'
  ]);
  const [includeIds, setIncludeIds] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Verificar se é administrador (este é um exemplo simples, você deve ter uma lógica mais robusta)
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const availableTables = [
    'service_categories',
    'user_profiles',
    'provider_services',
    'events',
    'event_applications',
    'user_companies',
    'user_venues',
    'venue_ratings',
    'conversations',
    'chat_messages',
  ];
  
  const handleTableSelection = (table: string) => {
    setSelectedTables(prev => 
      prev.includes(table)
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };
  
  const handleExport = async () => {
    if (selectedTables.length === 0) {
      toast.error('Selecione pelo menos uma tabela para exportar');
      return;
    }
    
    setExporting(true);
    try {
      const result = await exportDatabaseData({ 
        tables: selectedTables,
        includeIds
      });
      
      if (result.success) {
        toast.success('Dados exportados com sucesso');
      } else {
        toast.error('Erro ao exportar dados');
      }
    } catch (error) {
      toast.error('Erro ao exportar dados');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setImporting(true);
    try {
      const fileContent = await file.text();
      const jsonData = JSON.parse(fileContent);
      
      const result = await importDatabaseData(jsonData);
      
      if (result.success) {
        toast.success('Dados importados com sucesso');
      } else {
        toast.error('Erro ao importar dados');
      }
    } catch (error) {
      toast.error('Erro ao processar arquivo JSON');
      console.error(error);
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Ferramentas de Banco de Dados</h1>
      
      <Tabs defaultValue="export">
        <TabsList className="mb-6">
          <TabsTrigger value="export">Exportar Dados</TabsTrigger>
          <TabsTrigger value="import">Importar Dados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Exportar Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-muted-foreground text-sm mb-4">
                  Selecione as tabelas que deseja exportar. Os dados serão baixados como um arquivo JSON.
                </p>
                
                <div className="flex items-center mb-4">
                  <Checkbox
                    id="include-ids"
                    checked={includeIds}
                    onCheckedChange={(checked) => setIncludeIds(!!checked)}
                  />
                  <Label htmlFor="include-ids" className="ml-2">
                    Incluir IDs (use apenas se for importar para o mesmo banco)
                  </Label>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {availableTables.map(table => (
                    <div key={table} className="flex items-center">
                      <Checkbox
                        id={table}
                        checked={selectedTables.includes(table)}
                        onCheckedChange={() => handleTableSelection(table)}
                      />
                      <Label htmlFor={table} className="ml-2">
                        {table}
                      </Label>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleExport}
                    disabled={exporting || selectedTables.length === 0}
                    className="flex items-center"
                  >
                    {exporting ? (
                      <>Exportando...</>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar Dados
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Importar Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <AlertCircle className="text-amber-500 h-5 w-5 mr-2" />
                  <p className="text-sm font-medium">
                    Atenção: A importação de dados pode substituir ou duplicar dados existentes.
                  </p>
                </div>
                
                <p className="text-muted-foreground text-sm mb-6">
                  Selecione um arquivo JSON exportado anteriormente para importar os dados.
                </p>
                
                <div className="flex flex-col">
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <div className="space-y-2 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Clique para selecionar o arquivo JSON
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Apenas arquivos JSON são suportados
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="application/json"
                      onChange={handleImport}
                      disabled={importing}
                      className="hidden"
                    />
                  </label>
                  
                  {importing && (
                    <div className="mt-4 p-3 bg-primary/5 rounded flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                      <span>Importando dados...</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseTools;
