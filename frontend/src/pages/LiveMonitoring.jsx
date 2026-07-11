import { useMemo } from "react";
import {
  Gauge,
  HardHat,
  Loader2,
  Play,
  ShieldHalf,
  Square,
  Sparkles,
  Users,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";

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

    if (!incidents.length)
      return null;

    return [...incidents].sort(
      (a,b)=>
        new Date(b.timestamp ?? b.created_at ?? 0)
        -
        new Date(a.timestamp ?? a.created_at ?? 0)
    )[0];

  },[incidents]);



  const workers =
    toNumber(status?.workers) ?? 0;


  const helmet =
    status?.helmet_compliance ?? 0;


  const vest =
    status?.vest_compliance ?? 0;


  const mask =
    status?.mask_compliance ?? 0;


  const score =
    toNumber(status?.safety_score) ?? 0;


  const risk =
    status?.risk_level ?? "LOW";



  const detections =
    status?.detections ?? {};



  const recommendation =
    status?.recommendation ??
    "Start monitoring to generate AI safety analysis.";



  return (

<div className="space-y-6">


<PageHeader

title="Live Monitoring"

description="Real-time PPE detection powered by YOLO AI."

actions={

<div className="flex gap-2">


<Button

onClick={start}

disabled={isMonitoring || isToggling}

variant="success"

>

{
isToggling ?

<Loader2 className="h-4 w-4 animate-spin"/>

:

<Play className="h-4 w-4"/>

}

Start Monitoring

</Button>



<Button

onClick={stop}

disabled={!isMonitoring || isToggling}

variant="destructive"

>

<Square className="h-4 w-4"/>

Stop

</Button>


</div>

}

/>



{
actionError &&

<div className="rounded-lg bg-red-50 p-3 text-red-700">

{actionError.message}

</div>

}





<CameraPanel

isMonitoring={isMonitoring}

feedUrl={getLiveFeedUrl()}

/>





<div className="grid gap-4 md:grid-cols-4">


<StatCard

label="Workers"

value={workers}

icon={Users}

tone="navy"

/>



<StatCard

label="Safety Score"

value={score}

suffix="%"

icon={Gauge}

tone="brand"

/>



<StatCard

label="Monitoring"

value={isMonitoring ? "ACTIVE":"OFF"}

icon={Activity}

tone={isMonitoring ? "low":"high"}

/>



<StatCard

label="Risk"

value={risk}

icon={risk==="LOW"?CheckCircle:AlertTriangle}

tone={
risk==="HIGH"
?"high"
:
risk==="MEDIUM"
?"medium"
:
"low"
}

/>


</div>







<Card>


<CardHeader>

<CardTitle>
PPE Compliance
</CardTitle>

</CardHeader>


<CardContent className="space-y-5">


<ComplianceBar

label="Helmet"

icon={HardHat}

value={helmet}

/>



<ComplianceBar

label="Safety Vest"

icon={ShieldHalf}

value={vest}

/>



<ComplianceBar

label="Mask"

icon={Users}

value={mask}

/>



</CardContent>

</Card>







<Card>


<CardHeader>

<CardTitle>
Live Detection Summary
</CardTitle>

</CardHeader>


<CardContent>


<div className="grid grid-cols-2 md:grid-cols-3 gap-4">


<div className="rounded-lg bg-navy-50 p-4">

<p className="text-xs text-navy-400">
Helmets
</p>

<p className="text-2xl font-bold">

{detections.helmets ?? 0}

</p>

</div>




<div className="rounded-lg bg-navy-50 p-4">

<p className="text-xs text-navy-400">
Missing Helmets
</p>

<p className="text-2xl font-bold">

{detections.missing_helmets ?? 0}

</p>

</div>




<div className="rounded-lg bg-navy-50 p-4">

<p className="text-xs text-navy-400">
Workers
</p>

<p className="text-2xl font-bold">

{workers}

</p>

</div>


</div>


</CardContent>


</Card>







<Card>


<CardHeader>


<CardTitle className="flex gap-2 items-center">

<Sparkles className="h-4 w-4"/>

AI Safety Summary

</CardTitle>


</CardHeader>



<CardContent>


<div className="rounded-lg bg-brand-50 p-5 text-brand-900">


{recommendation}


</div>


</CardContent>


</Card>



</div>

  );

}