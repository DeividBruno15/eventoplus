
import { useState, useMemo } from 'react';

/**
 * Hook to combine multiple loading states into a single submitting state
 */
export const useSubmittingState = (loadingStates: boolean[]) => {
  return useMemo(() => {
    return loadingStates.some(state => state === true);
  }, [loadingStates]);
};
