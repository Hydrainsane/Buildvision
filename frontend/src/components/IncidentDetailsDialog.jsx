import { HardHat, ShieldHalf, Siren, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RiskBadge from "@/components/RiskBadge";
import ComplianceBar from "@/components/ComplianceBar";
import { formatTimestamp, toNumber } from "@/lib/utils";

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-navy-50/60 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">{label}</p>
      <p className="font-display text-lg font-bold text-navy-900">{value}</p>
    </div>
  );
}

export default function IncidentDetailsDialog({ incident, open, onOpenChange }) {
  if (!incident) return null;

  const workers = toNumber(incident.workers ?? incident.worker_count ?? incident.workers_detected);
  const score = toNumber(incident.safety_score ?? incident.score ?? incident.safetyScore);
  const risk = incident.risk_level ?? incident.risk ?? incident.riskLevel;
  const reportText =
    incident.ai_report ??
    incident.report ??
    incident.gemini_report ??
    incident.analysis ??
    incident.description ??
    null;
  const recommendation =
    incident.recommendation ?? incident.ai_recommendation ?? incident.suggested_action ?? null;
  const violations = Array.isArray(incident.violations) ? incident.violations : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Incident Report</DialogTitle>
          <DialogDescription>
            {formatTimestamp(incident.timestamp ?? incident.created_at ?? incident.time)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <RiskBadge level={risk} />
          {incident.location ? (
            <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-medium text-navy-600">
              {incident.location}
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Workers" value={workers ?? "—"} />
          <Metric label="Safety Score" value={score !== null ? score.toFixed(0) : "—"} />
          <Metric
            label="Helmet"
            value={
              incident.helmet_compliance ?? incident.helmet_percent ?? incident.helmetCompliance
                ? `${Math.round(toNumber(incident.helmet_compliance ?? incident.helmet_percent ?? incident.helmetCompliance))}%`
                : "—"
            }
          />
          <Metric
            label="Vest"
            value={
              incident.vest_compliance ?? incident.vest_percent ?? incident.vestCompliance
                ? `${Math.round(toNumber(incident.vest_compliance ?? incident.vest_percent ?? incident.vestCompliance))}%`
                : "—"
            }
          />
        </div>

        <div className="space-y-3 rounded-lg border border-border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
            PPE Compliance Breakdown
          </p>
          <ComplianceBar
            label="Helmet Compliance"
            icon={HardHat}
            value={incident.helmet_compliance ?? incident.helmet_percent ?? incident.helmetCompliance}
          />
          <ComplianceBar
            label="Vest Compliance"
            icon={ShieldHalf}
            value={incident.vest_compliance ?? incident.vest_percent ?? incident.vestCompliance}
          />
          <ComplianceBar
            label="Mask Compliance"
            icon={Users}
            value={incident.mask_compliance ?? incident.mask_percent ?? incident.maskCompliance}
          />
        </div>

        {violations && violations.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Detected Violations
            </p>
            <ul className="space-y-1.5">
              {violations.map((v, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-risk-high-soft/50 px-3 py-2 text-sm text-navy-700"
                >
                  <Siren className="mt-0.5 h-3.5 w-3.5 shrink-0 text-risk-high" />
                  {typeof v === "string" ? v : JSON.stringify(v)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {reportText ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Gemini AI Analysis
            </p>
            <div className="whitespace-pre-wrap rounded-lg bg-navy-50/70 p-4 text-sm leading-relaxed text-navy-700">
              {reportText}
            </div>
          </div>
        ) : null}

        {recommendation ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Recommendation
            </p>
            <div className="rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm leading-relaxed text-brand-800">
              {recommendation}
            </div>
          </div>
        ) : null}

        {!reportText && !recommendation && (!violations || violations.length === 0) ? (
          <p className="text-sm text-navy-400">
            No additional AI report details were included with this incident record.
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
