import { useState, useCallback } from "react";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useFetch<T = any>() {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const run = useCallback(async (input: RequestInfo, init?: RequestInit) => {
    setState({ data: null, loading: true, error: null });
    try {
      const res = await fetch(input, init);          //  fetch
      if (!res.ok) {
        const text = await res.text();
        setState({ data: null, loading: false, error: `HTTP ${res.status}: ${text}` });
        return { ok: false, status: res.status, text };
      }
      const json = (await res.json()) as T;
      setState({ data: json, loading: false, error: null });
      return { ok: true, data: json };
    } catch (err: any) {
      setState({ data: null, loading: false, error: err.message ?? String(err) });
      return { ok: false, error: err.message ?? String(err) };
    }
  }, []);

  return { ...state, run };
}

export default useFetch;
