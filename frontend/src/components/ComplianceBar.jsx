import { Progress } from "@/components/ui/progress";
import { formatPercent, toNumber } from "@/lib/utils";

function toneForValue(value) {
  if (value === null) return "bg-navy-300";
  if (value >= 80) return "bg-risk-low";
  if (value >= 50) return "bg-risk-medium";
  return "bg-risk-high";
}

export default function ComplianceBar({ label, value, icon: Icon }) {
  const n = toNumber(value);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium text-navy-600">
          {Icon ? <Icon className="h-3.5 w-3.5 text-navy-400" /> : null}
          {label}
        </span>
        <span className="font-display font-semibold text-navy-900">
          {formatPercent(n)}
        </span>
      </div>
      <Progress value={n ?? 0} indicatorClassName={toneForValue(n)} />
    </div>
  );
}
