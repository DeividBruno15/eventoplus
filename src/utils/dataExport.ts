
import { supabase } from '@/integrations/supabase/client';

interface ExportOptions {
  tables: string[];
  includeIds?: boolean;
}

export const exportDatabaseData = async (options: ExportOptions) => {
  const { tables, includeIds = false } = options;
  const exportData: Record<string, any[]> = {};
  
  try {
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*');
      
      if (error) {
        console.error(`Error exporting data from table ${table}:`, error);
        throw error;
      }
      
      if (data) {
        if (!includeIds) {
          // Remove IDs para evitar conflitos de importação
          data.forEach(item => {
            if ('id' in item && typeof item.id === 'string') {
              delete item.id;
            }
          });
        }
        
        exportData[table] = data;
      }
    }
    
    // Converter para JSON e criar download
    const jsonData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Criar link para download
    const a = document.createElement('a');
    a.href = url;
    a.download = `database_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Limpar
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    return { success: true };
  } catch (error) {
    console.error('Error exporting database data:', error);
    return { success: false, error };
  }
};

export const importDatabaseData = async (jsonData: Record<string, any[]>) => {
  try {
    const tables = Object.keys(jsonData);
    
    for (const table of tables) {
      const data = jsonData[table];
      
      if (data && data.length > 0) {
        const { error } = await supabase.from(table).insert(data);
        
        if (error) {
          console.error(`Error importing data to table ${table}:`, error);
          throw error;
        }
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error importing database data:', error);
    return { success: false, error };
  }
};
