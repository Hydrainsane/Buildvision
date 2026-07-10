import { useEffect, useState } from "react";
import { CheckCircle2, RefreshCw, Server, XCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/services/api";
import { getHealth } from "@/services/incidentService";

export default function Settings() {
  const [status, setStatus] = useState("checking");
  const [detail, setDetail] = useState(null);

  async function checkBackend() {
    setStatus("checking");
    try {
      const data = await getHealth();
      setDetail(data);
      setStatus("online");
    } catch (err) {
      setDetail(err);
      setStatus("offline");
    }
  }

  useEffect(() => {
    checkBackend();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Connection and platform information for this BuildVision instance."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-4 w-4 text-brand-500" />
            Backend Connection
          </CardTitle>
          <CardDescription>
            The frontend reads live data exclusively from this FastAPI server.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col justify-between gap-3 rounded-lg border border-border bg-navy-50/50 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                API Base URL
              </p>
              <p className="font-mono text-sm text-navy-800">{API_BASE_URL}</p>
            </div>
            <div className="flex items-center gap-2">
              {status === "online" ? (
                <span className="flex items-center gap-1.5 rounded-full bg-risk-low-soft px-3 py-1 text-xs font-semibold text-risk-low">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Connected
                </span>
              ) : status === "offline" ? (
                <span className="flex items-center gap-1.5 rounded-full bg-risk-high-soft px-3 py-1 text-xs font-semibold text-risk-high">
                  <XCircle className="h-3.5 w-3.5" />
                  Unreachable
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-full bg-navy-100 px-3 py-1 text-xs font-semibold text-navy-500">
                  Checking…
                </span>
              )}
              <Button size="sm" variant="outline" onClick={checkBackend}>
                <RefreshCw className="h-3.5 w-3.5" />
                Re-check
              </Button>
            </div>
          </div>

          {status === "offline" && detail?.message ? (
            <p className="text-sm text-risk-high">{detail.message}</p>
          ) : null}

          {status === "online" && detail ? (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy-400">
                Root Response (GET /)
              </p>
              <pre className="scrollbar-thin overflow-x-auto rounded-lg bg-navy-900 p-3 text-xs text-navy-100">
                {JSON.stringify(detail, null, 2)}
              </pre>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About BuildVision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-navy-600">
          <p>
            BuildVision monitors construction sites in real time using YOLO
            object detection to identify workers and PPE, and Gemini AI to
            generate safety reports and recommendations. Detections are
            persisted to SQLite and served through this FastAPI backend.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
