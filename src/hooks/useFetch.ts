import { useState, useEffect, useRef, useCallback } from 'react';

interface FetchOptions {
  suspense?: boolean;
  prefetch?: boolean;
  cacheTime?: number;
  staleTime?: number;
  retries?: number;
  retryDelay?: number;
  enabled?: boolean;
}

const defaultOptions: FetchOptions = {
  suspense: false,
  prefetch: false,
  cacheTime: 5 * 60 * 1000, // 5 minutes
  staleTime: 60 * 1000, // 1 minute
  retries: 1,
  retryDelay: 1000,
  enabled: true
};

// In-memory cache for faster data access
const cache: Map<string, { data: any; timestamp: number }> = new Map();

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: FetchOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Create a stable cache key for this fetch function
  const cacheKey = useRef(fetchFn.toString()).current;
  
  // Track retries
  const retryCount = useRef(0);
  
  // Function to perform the fetch with retry logic
  const fetchWithRetry = useCallback(async (signal: AbortSignal) => {
    try {
      const result = await fetchFn();
      // Cache the result
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (err) {
      // Retry logic
      if (retryCount.current < (mergedOptions.retries || 0)) {
        retryCount.current++;
        await new Promise(resolve => setTimeout(resolve, mergedOptions.retryDelay));
        return fetchWithRetry(signal);
      }
      throw err;
    }
  }, [fetchFn, cacheKey, mergedOptions.retries, mergedOptions.retryDelay]);

  useEffect(() => {
    // Reset retry count when fetch function changes
    retryCount.current = 0;
    
    // Check if data is in cache and not stale
    const cachedData = cache.get(cacheKey);
    const isCacheValid = cachedData && 
      (Date.now() - cachedData.timestamp < (mergedOptions.staleTime || 0));
    
    if (isCacheValid) {
      setData(cachedData.data);
      setLoading(false);
      setError(null);
      return;
    }
    
    // If prefetch is false and suspense is true, return early and don't fetch
    if (mergedOptions.suspense && !mergedOptions.prefetch) {
      return;
    }
    
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      
      try {
        const result = await fetchWithRetry(signal);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted && !signal.aborted) {
          console.error("Error fetching data:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Clean up function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [fetchFn, cacheKey, mergedOptions.staleTime, mergedOptions.suspense, mergedOptions.prefetch, fetchWithRetry]);

  // Clean up expired cache entries
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      cache.forEach((value, key) => {
        if (now - value.timestamp > (mergedOptions.cacheTime || 0)) {
          cache.delete(key);
        }
      });
    };
    
    // Clean up on mount and every 5 minutes
    cleanup();
    const interval = setInterval(cleanup, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [mergedOptions.cacheTime]);

  return { data, loading, error };
}

export function useFetchWithParams<T, P>(
  fetchFn: (params: P) => Promise<T>, 
  params: P,
  options: FetchOptions = {}
) {
  // Create a wrapper function that includes the params
  const wrappedFetchFn = useCallback(() => {
    return fetchFn(params);
  }, [fetchFn, params]);
  
  // Use the basic useFetch with our wrapped function
  return useFetch<T>(wrappedFetchFn, options);
}
