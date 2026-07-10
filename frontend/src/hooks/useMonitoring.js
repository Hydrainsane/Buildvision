import { useCallback, useEffect, useRef, useState } from "react";
import {
  getMonitoringStatus,
  startMonitoring,
  stopMonitoring,
} from "@/services/monitoringService";

const POLL_INTERVAL_MS = 3000;

/**
 * Drives the Live Monitoring page: starts/stops the detection pipeline
 * and polls /monitoring/status for live worker counts, compliance
 * percentages, safety score, risk level, and the latest AI recommendation.
 *
 * If the backend doesn't expose /monitoring/* yet, `statusError` is set
 * and the page shows a clear "service unavailable" state rather than
 * fabricated numbers — nothing here is mocked.
 */
export function useMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const pollRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    setIsStatusLoading(true);
    try {
      const data = await getMonitoringStatus();
      setStatus(data);
      setStatusError(null);
      if (typeof data?.is_active === "boolean") {
        setIsMonitoring(data.is_active);
      } else if (typeof data?.active === "boolean") {
        setIsMonitoring(data.active);
      }
    } catch (err) {
      setStatusError(err);
    } finally {
      setIsStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchStatus]);

  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (isMonitoring) {
      pollRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isMonitoring, fetchStatus]);

  const handleStart = useCallback(async () => {
    setIsToggling(true);
    setActionError(null);
    try {
      await startMonitoring();
      setIsMonitoring(true);
      await fetchStatus();
    } catch (err) {
      setActionError(err);
    } finally {
      setIsToggling(false);
    }
  }, [fetchStatus]);

  const handleStop = useCallback(async () => {
    setIsToggling(true);
    setActionError(null);
    try {
      await stopMonitoring();
      setIsMonitoring(false);
      await fetchStatus();
    } catch (err) {
      setActionError(err);
    } finally {
      setIsToggling(false);
    }
  }, [fetchStatus]);

  return {
    isMonitoring,
    isToggling,
    status,
    statusError,
    actionError,
    isStatusLoading,
    start: handleStart,
    stop: handleStop,
    refetchStatus: fetchStatus,
  };
}
