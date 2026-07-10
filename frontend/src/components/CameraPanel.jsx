import { useState } from "react";
import { CameraOff, Radio, ScanEye } from "lucide-react";
import { cn } from "@/lib/utils";

const CORNER_CLASSES =
  "absolute h-6 w-6 border-brand-400/80 transition-opacity duration-300";

function Corner({ className }) {
  return <span className={cn(CORNER_CLASSES, className)} />;
}

export default function CameraPanel({ isMonitoring, feedUrl }) {
  const [feedFailed, setFeedFailed] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-navy-950 shadow-panel">
      {/* Viewfinder corner brackets — signature AI-detection framing */}
      <Corner className={cn("left-3 top-3 border-l-2 border-t-2 rounded-tl-md", !isMonitoring && "opacity-30")} />
      <Corner className={cn("right-3 top-3 border-r-2 border-t-2 rounded-tr-md", !isMonitoring && "opacity-30")} />
      <Corner className={cn("left-3 bottom-3 border-l-2 border-b-2 rounded-bl-md", !isMonitoring && "opacity-30")} />
      <Corner className={cn("right-3 bottom-3 border-r-2 border-b-2 rounded-br-md", !isMonitoring && "opacity-30")} />

      {isMonitoring && !feedFailed ? (
        <>
          <img
            src={feedUrl}
            alt="Live construction site camera feed"
            className="h-full w-full object-cover"
            onError={() => setFeedFailed(true)}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-brand-400/10 to-transparent">
            <div className="h-px w-full animate-scan bg-brand-400/70 shadow-[0_0_8px_2px_rgba(47,111,237,0.6)]" />
          </div>
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-navy-950/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            LIVE
          </div>
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-navy-400">
          {isMonitoring && feedFailed ? (
            <>
              <CameraOff className="h-10 w-10" />
              <div className="text-center">
                <p className="font-display font-medium text-navy-200">Camera feed unavailable</p>
                <p className="max-w-xs text-xs text-navy-500">
                  Monitoring is active, but the stream at /monitoring/feed couldn't be reached.
                </p>
              </div>
            </>
          ) : (
            <>
              <ScanEye className="h-10 w-10" />
              <div className="text-center">
                <p className="font-display font-medium text-navy-200">Camera feed idle</p>
                <p className="max-w-xs text-xs text-navy-500">
                  Start monitoring to begin real-time PPE detection.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-navy-950/70 px-2.5 py-1 text-[11px] font-medium text-navy-300 backdrop-blur">
        <Radio className="h-3 w-3" />
        YOLO detection {isMonitoring ? "active" : "standby"}
      </div>
    </div>
  );
}
