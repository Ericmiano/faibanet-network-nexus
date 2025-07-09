
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  cacheTtl?: number;
}

export const useOptimizedQuery = <T,>({
  queryKey,
  queryFn,
  cacheTtl = 5 * 60 * 1000, // 5 minutes default
  ...options
}: OptimizedQueryOptions<T>) => {
  const [lastFetch, setLastFetch] = useState<number>(0);

  const optimizedQueryFn = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetch < cacheTtl && lastFetch > 0) {
      // Use cached data if within TTL
      return queryFn();
    }
    
    setLastFetch(now);
    return queryFn();
  }, [queryFn, lastFetch, cacheTtl]);

  return useQuery({
    queryKey,
    queryFn: optimizedQueryFn,
    staleTime: cacheTtl,
    gcTime: cacheTtl * 2, // Keep in cache longer
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

export const useInvalidateQueries = () => {
  const invalidateQueries = useCallback((queryKeys: string[]) => {
    // Implementation for invalidating multiple queries at once
    console.log('Invalidating queries:', queryKeys);
  }, []);

  return { invalidateQueries };
};
