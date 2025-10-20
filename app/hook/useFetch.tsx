"use client";

import { useState, useEffect, useCallback } from "react";

interface UseFetchOptions<T> {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: T;
  headers?: Record<string, string>;
  manual?: boolean; // if true, it won't fetch automatically
}

interface UseFetchResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: (override?: Partial<UseFetchOptions<any>>) => Promise<void>;
}

export function useFetch<T = any>(
  url: string | null,
  options?: UseFetchOptions<any>
): UseFetchResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (override?: Partial<UseFetchOptions<any>>) => {
      if (!url) {
        setError("No URL provided");
        return;
      }

      const method = override?.method || options?.method || "GET";
      const body = override?.body || options?.body;
      const headers = {
        "Content-Type": "application/json",
        ...options?.headers,
        ...override?.headers,
      };

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, {
          method,
          headers,
          body: method !== "GET" ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  useEffect(() => {
    if (!options?.manual && url) {
      fetchData();
    }
  }, [url, options?.manual, fetchData]);

  return { data, error, loading, refetch: fetchData };
}
