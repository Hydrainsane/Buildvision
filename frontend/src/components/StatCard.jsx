import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const TONES = {
  brand: "bg-brand-50 text-brand-600",
  high: "bg-risk-high-soft text-risk-high",
  medium: "bg-risk-medium-soft text-amber-700",
  low: "bg-risk-low-soft text-risk-low",
  navy: "bg-navy-100 text-navy-700",
};

export default function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  tone = "brand",
  isLoading,
  helperText,
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-white p-5 shadow-card transition-shadow hover:shadow-panel">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
            {label}
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <p className="font-display text-3xl font-bold text-navy-900">
              {value}
              {suffix ? (
                <span className="ml-1 text-lg font-semibold text-navy-400">{suffix}</span>
              ) : null}
            </p>
          )}
          {helperText ? (
            <p className="text-xs text-navy-400">{helperText}</p>
          ) : null}
        </div>
        {Icon ? (
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", TONES[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      <div
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.06] transition-transform duration-500 group-hover:scale-125",
          tone === "high" && "bg-risk-high",
          tone === "medium" && "bg-risk-medium",
          tone === "low" && "bg-risk-low",
          (tone === "brand" || tone === "navy") && "bg-brand-500"
        )}
      />
    </div>
  );
}
