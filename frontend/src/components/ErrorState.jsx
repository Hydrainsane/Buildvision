import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shown whenever a request to the FastAPI backend fails. Never swap
 * this for fabricated data — always surface the real failure and let
 * the person retry once the backend is reachable.
 */
export default function ErrorState({
  title = "Couldn't reach BuildVision backend",
  message,
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-risk-high/30 bg-risk-high-soft/40 px-6 py-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-risk-high-soft text-risk-high">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="font-display font-semibold text-navy-900">{title}</p>
        {message ? (
          <p className="max-w-md text-sm text-navy-500">{message}</p>
        ) : null}
      </div>
      {onRetry ? (
        <Button size="sm" variant="outline" onClick={onRetry} className="mt-1">
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
