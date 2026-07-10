import { AlertTriangle, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { normalizeRisk } from "@/lib/utils";

const CONFIG = {
  high: { label: "High", variant: "high", Icon: ShieldAlert },
  medium: { label: "Medium", variant: "medium", Icon: AlertTriangle },
  low: { label: "Low", variant: "low", Icon: ShieldCheck },
  unknown: { label: "Unknown", variant: "neutral", Icon: ShieldQuestion },
};

export default function RiskBadge({ level, className }) {
  const key = normalizeRisk(level);
  const { label, variant, Icon } = CONFIG[key];
  return (
    <Badge variant={variant} className={className}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
