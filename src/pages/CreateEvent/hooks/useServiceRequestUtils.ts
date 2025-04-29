
import { ServiceRequest } from '@/types/events';
import { Json } from '@/integrations/supabase/types';

/**
 * Hook providing utility functions for service request data
 */
export const useServiceRequestUtils = () => {
  /**
   * Parses service requests from JSON database format to typed objects
   * @param jsonData The JSON data from the database
   * @returns Array of typed ServiceRequest objects
   */
  const parseServiceRequests = (jsonData: Json): ServiceRequest[] => {
    if (Array.isArray(jsonData)) {
      return jsonData.map(item => {
        if (typeof item === 'object' && item !== null) {
          const jsonObj = item as Record<string, Json>;
          return {
            category: typeof jsonObj.category === 'string' ? jsonObj.category : '',
            count: typeof jsonObj.count === 'number' ? jsonObj.count : 0,
            price: typeof jsonObj.price === 'number' ? jsonObj.price : 0,
            filled: typeof jsonObj.filled === 'number' ? jsonObj.filled : 0
          };
        }
        return { category: '', count: 0, price: 0, filled: 0 };
      });
    }
    return [];
  };

  /**
   * Prepares service requests for database storage
   * @param requests Array of service requests
   * @returns JSON formatted service requests ready for database storage
   */
  const prepareServiceRequestsForStorage = (requests: ServiceRequest[] | undefined): Json => {
    if (!requests || !Array.isArray(requests)) return [];
    
    // Ensure all price fields are numbers
    const preparedRequests = requests.map(req => ({
      ...req,
      price: req.price ? Number(req.price) : 0
    }));
    
    return preparedRequests as unknown as Json;
  };

  return {
    parseServiceRequests,
    prepareServiceRequestsForStorage
  };
};
