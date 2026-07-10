import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Spinner({ className, size = 20, label }) {
  return (
    <div className="flex items-center justify-center gap-2 text-navy-400">
      <Loader2 className={cn("animate-spin", className)} size={size} />
      {label ? <span className="text-sm">{label}</span> : null}
    </div>
  );
}
