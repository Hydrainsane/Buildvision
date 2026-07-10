import { useCallback, useEffect, useState } from "react";
import { getIncidents } from "@/services/incidentService";

/**
 * Fetches the full incident list from GET /incidents.
 * Exposes loading / error / refetch so any page can reuse it.
 */
export function useIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncidents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return { incidents, isLoading, error, refetch: fetchIncidents };
}
