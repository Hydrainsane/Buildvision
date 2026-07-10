import { FileSearch } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import RiskBadge from "@/components/RiskBadge";
import EmptyState from "@/components/EmptyState";
import { formatPercent, formatTimestamp, toNumber } from "@/lib/utils";

export default function IncidentTable({ incidents, onViewReport }) {
  if (!incidents.length) {
    return (
      <EmptyState
        icon={FileSearch}
        title="No incidents match your search"
        message="Try a different keyword, or clear the search to see every recorded incident."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Workers</TableHead>
            <TableHead>Helmet %</TableHead>
            <TableHead>Vest %</TableHead>
            <TableHead>Mask %</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead className="text-right">Report</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => {
            const id = incident.id ?? incident.incident_id ?? incident.timestamp;
            const workers = toNumber(incident.workers ?? incident.worker_count ?? incident.workers_detected);
            const score = toNumber(incident.safety_score ?? incident.score ?? incident.safetyScore);
            return (
              <TableRow key={id}>
                <TableCell className="whitespace-nowrap font-medium text-navy-700">
                  {formatTimestamp(incident.timestamp ?? incident.created_at ?? incident.time)}
                </TableCell>
                <TableCell>{workers ?? "—"}</TableCell>
                <TableCell>{formatPercent(incident.helmet_compliance ?? incident.helmet_percent ?? incident.helmetCompliance)}</TableCell>
                <TableCell>{formatPercent(incident.vest_compliance ?? incident.vest_percent ?? incident.vestCompliance)}</TableCell>
                <TableCell>{formatPercent(incident.mask_compliance ?? incident.mask_percent ?? incident.maskCompliance)}</TableCell>
                <TableCell className="font-display font-semibold text-navy-900">
                  {score !== null ? score.toFixed(0) : "—"}
                </TableCell>
                <TableCell>
                  <RiskBadge level={incident.risk_level ?? incident.risk ?? incident.riskLevel} />
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={() => onViewReport(incident)}>
                    View Report
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
