
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Fixed import statement
import DashboardLayout from "@/layouts/DashboardLayout";

const DatabaseTools = () => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const executeQuery = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: sqlQuery,
      });

      if (error) {
        console.error('Error executing query:', error);
        toast({
          title: "Query Error",
          description: error.message,
          variant: "destructive",
        });
        setQueryResult(null);
      } else {
        setQueryResult(data);
        toast({
          title: "Query executed successfully",
          description: "Check the results below.",
        });
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast({
        title: "Unexpected Error",
        description: err.message,
        variant: "destructive",
      });
      setQueryResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClearResults = () => {
    setQueryResult(null);
  };

  // Fixed implementation - DashboardLayout now uses children pattern
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Database Tools</h1>
        <Card className="mb-4">
          <div className="p-4">
            <Label htmlFor="sql-query">SQL Query:</Label>
            <Textarea
              id="sql-query"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="mt-2"
              placeholder="Enter SQL query here..."
            />
            <div className="flex justify-end mt-4 gap-2">
              <Button type="button" variant="secondary" onClick={handleClearResults}>
                Clear Results
              </Button>
              <Button onClick={executeQuery} disabled={loading}>
                {loading ? "Executing..." : "Execute Query"}
              </Button>
            </div>
          </div>
        </Card>

        {queryResult !== null && (
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Query Result:</h2>
              <pre className="bg-gray-100 rounded-md p-2 overflow-auto">
                {JSON.stringify(queryResult, null, 2)}
              </pre>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DatabaseTools;
