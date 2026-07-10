import { useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import IncidentTable from "@/components/IncidentTable";
import IncidentDetailsDialog from "@/components/IncidentDetailsDialog";
import ErrorState from "@/components/ErrorState";
import { useIncidents } from "@/hooks/useIncidents";
import { normalizeRisk } from "@/lib/utils";

export default function IncidentHistory() {
  const { incidents, isLoading, error, refetch } = useIncidents();
  const [query, setQuery] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return incidents;
    const q = query.trim().toLowerCase();
    return incidents.filter((incident) => {
      const risk = normalizeRisk(incident.risk_level ?? incident.risk ?? incident.riskLevel);
      const haystack = [
        incident.timestamp,
        incident.created_at,
        incident.location,
        risk,
        incident.risk_level,
        incident.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [incidents, query]);

  function handleViewReport(incident) {
    setSelectedIncident(incident);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident History"
        description="Every PPE compliance detection recorded by the AI pipeline."
        actions={
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
        <Input
          placeholder="Search by date, location, or risk…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <IncidentTable incidents={filtered} onViewReport={handleViewReport} />
      )}

      <IncidentDetailsDialog
        incident={selectedIncident}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
