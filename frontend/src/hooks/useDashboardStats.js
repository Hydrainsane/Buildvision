import { useMemo } from "react";
import { useIncidents } from "./useIncidents";
import { normalizeRisk, toNumber } from "@/lib/utils";

/**
 * Derives dashboard summary metrics directly from GET /incidents.
 * No numbers here are invented — every figure is computed from the
 * records the backend returns. If a dedicated GET /dashboard/stats
 * endpoint is added later, this hook can be swapped to call it
 * directly without changing the Dashboard page's contract
 * ({ stats, isLoading, error, refetch }).
 */
export function useDashboardStats() {
  const { incidents, isLoading, error, refetch } = useIncidents();

  const stats = useMemo(() => {
    const total = incidents.length;
    let high = 0;
    let medium = 0;
    let low = 0;
    let scoreSum = 0;
    let scoreCount = 0;

    for (const incident of incidents) {
      const risk = normalizeRisk(
        incident.risk_level ?? incident.risk ?? incident.riskLevel
      );
      if (risk === "high") high += 1;
      else if (risk === "medium") medium += 1;
      else if (risk === "low") low += 1;

      const score = toNumber(
        incident.safety_score ?? incident.score ?? incident.safetyScore
      );
      if (score !== null) {
        scoreSum += score;
        scoreCount += 1;
      }
    }

    const avgSafetyScore = scoreCount > 0 ? scoreSum / scoreCount : null;

    return {
      totalIncidents: total,
      highRisk: high,
      mediumRisk: medium,
      lowRisk: low,
      avgSafetyScore,
    };
  }, [incidents]);

  return { stats, isLoading, error, refetch };
}
