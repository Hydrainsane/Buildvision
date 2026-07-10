import { AlertTriangle, Gauge, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import ErrorState from "@/components/ErrorState";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { stats, isLoading, error, refetch } = useDashboardStats();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="A live summary of safety performance across your monitored sites."
        actions={
          <Button asChild size="sm">
            <Link to="/live-monitoring">Go to Live Monitoring</Link>
          </Button>
        }
      />

      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            label="Total Incidents"
            value={stats.totalIncidents}
            icon={ShieldAlert}
            tone="navy"
            isLoading={isLoading}
            helperText="All recorded detections"
          />
          <StatCard
            label="High Risk"
            value={stats.highRisk}
            icon={ShieldX}
            tone="high"
            isLoading={isLoading}
            helperText="Require immediate action"
          />
          <StatCard
            label="Medium Risk"
            value={stats.mediumRisk}
            icon={AlertTriangle}
            tone="medium"
            isLoading={isLoading}
            helperText="Monitor closely"
          />
          <StatCard
            label="Low Risk"
            value={stats.lowRisk}
            icon={ShieldCheck}
            tone="low"
            isLoading={isLoading}
            helperText="Within safe limits"
          />
          <StatCard
            label="Avg. Safety Score"
            value={stats.avgSafetyScore !== null ? stats.avgSafetyScore.toFixed(0) : "—"}
            suffix={stats.avgSafetyScore !== null ? "/ 100" : ""}
            icon={Gauge}
            tone="brand"
            isLoading={isLoading}
            helperText="Across all incidents"
          />
        </div>
      )}

      {!isLoading && !error && stats.totalIncidents === 0 ? (
        <div className="rounded-xl border border-dashed border-navy-200 bg-navy-50/50 p-6 text-center text-sm text-navy-500">
          No incidents recorded yet. Start a live monitoring session to begin
          collecting safety data.
        </div>
      ) : null}
    </div>
  );
}
