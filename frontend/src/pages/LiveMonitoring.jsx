import { useMemo } from "react";
import { Gauge, HardHat, Loader2, Play, ShieldHalf, Square, Sparkles, Users } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CameraPanel from "@/components/CameraPanel";
import ComplianceBar from "@/components/ComplianceBar";
import RiskBadge from "@/components/RiskBadge";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonitoring } from "@/hooks/useMonitoring";
import { useIncidents } from "@/hooks/useIncidents";
import { getLiveFeedUrl } from "@/services/monitoringService";
import { toNumber } from "@/lib/utils";

export default function LiveMonitoring() {
  const {
    isMonitoring,
    isToggling,
    status,
    statusError,
    actionError,
    start,
    stop,
  } = useMonitoring();
  const { incidents } = useIncidents();

  const latestIncident = useMemo(() => {
    if (!incidents.length) return null;
    return [...incidents].sort((a, b) => {
      const ta = new Date(a.timestamp ?? a.created_at ?? a.time ?? 0).getTime();
      const tb = new Date(b.timestamp ?? b.created_at ?? b.time ?? 0).getTime();
      return tb - ta;
    })[0];
  }, [incidents]);

  const workers = toNumber(status?.workers ?? status?.worker_count);
  const helmet = status?.helmet_compliance ?? status?.helmet_percent;
  const vest = status?.vest_compliance ?? status?.vest_percent;
  const mask = status?.mask_compliance ?? status?.mask_percent;
  const score = toNumber(status?.safety_score ?? status?.score);
  const risk = status?.risk_level ?? status?.risk;

  const recommendation =
    status?.recommendation ??
    status?.ai_recommendation ??
    (!statusError
      ? null
      : latestIncident?.recommendation ??
        latestIncident?.ai_recommendation ??
        latestIncident?.ai_report ??
        latestIncident?.report ??
        null);

  const hasLiveStats = Boolean(status) && !statusError;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Monitoring"
        description="Real-time PPE detection powered by YOLO, analyzed by Gemini AI."
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={start}
              disabled={isMonitoring || isToggling}
              variant="success"
            >
              {isToggling && !isMonitoring ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Start Monitoring
            </Button>
            <Button
              onClick={stop}
              disabled={!isMonitoring || isToggling}
              variant="destructive"
            >
              {isToggling && isMonitoring ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              Stop Monitoring
            </Button>
          </div>
        }
      />

      {actionError ? (
        <div className="rounded-lg border border-risk-high/30 bg-risk-high-soft/50 px-4 py-3 text-sm text-risk-high">
          {actionError.message}
        </div>
      ) : null}

      <CameraPanel isMonitoring={isMonitoring} feedUrl={getLiveFeedUrl()} />

      {statusError ? (
        <div className="rounded-lg border border-dashed border-navy-200 bg-navy-50/60 px-4 py-3 text-sm text-navy-500">
          Live compliance readouts are unavailable right now
          {statusError.message ? `: ${statusError.message}` : "."} Showing the
          most recent recorded incident below where available.
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Workers"
          value={hasLiveStats ? workers ?? "—" : latestIncident ? (toNumber(latestIncident.workers ?? latestIncident.worker_count) ?? "—") : "—"}
          icon={Users}
          tone="navy"
        />
        <StatCard
          label="Safety Score"
          value={
            hasLiveStats
              ? score !== null
                ? score.toFixed(0)
                : "—"
              : latestIncident
              ? (toNumber(latestIncident.safety_score ?? latestIncident.score)?.toFixed(0) ?? "—")
              : "—"
          }
          icon={Gauge}
          tone="brand"
        />
        <div className="col-span-2 flex flex-col justify-center gap-2 rounded-xl border border-border bg-white p-5 shadow-card lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
            Risk Level
          </p>
          <RiskBadge
            level={hasLiveStats ? risk : latestIncident?.risk_level ?? latestIncident?.risk}
            className="w-fit text-sm px-3 py-1"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PPE Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ComplianceBar
            label="Helmet Compliance"
            icon={HardHat}
            value={hasLiveStats ? helmet : latestIncident?.helmet_compliance ?? latestIncident?.helmet_percent}
          />
          <ComplianceBar
            label="Vest Compliance"
            icon={ShieldHalf}
            value={hasLiveStats ? vest : latestIncident?.vest_compliance ?? latestIncident?.vest_percent}
          />
          <ComplianceBar
            label="Mask Compliance"
            icon={Users}
            value={hasLiveStats ? mask : latestIncident?.mask_compliance ?? latestIncident?.mask_percent}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-500" />
            Latest AI Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendation ? (
            <p className="whitespace-pre-wrap rounded-lg bg-brand-50 p-4 text-sm leading-relaxed text-brand-800">
              {recommendation}
            </p>
          ) : (
            <p className="rounded-lg border border-dashed border-navy-200 bg-navy-50/50 p-4 text-sm text-navy-500">
              No AI recommendation available yet. Start a monitoring session to
              generate real-time guidance from Gemini.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
