import {
  AlertTriangle,
  Gauge,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Activity,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import ErrorState from "@/components/ErrorState";

import { useDashboardStats } from "@/hooks/useDashboardStats";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export default function Dashboard() {


const {
 stats,
 isLoading,
 error,
 refetch
}=useDashboardStats();



return (

<div className="space-y-6">



<PageHeader

title="Dashboard"

description="AI-powered overview of construction site safety."

actions={

<Button asChild>

<Link to="/live-monitoring">

Start Live Monitoring

<ArrowRight className="ml-2 h-4 w-4"/>

</Link>

</Button>

}

/>





{
error ?

<ErrorState

message={error.message}

onRetry={refetch}

/>

:

<>



{/* MAIN STATS */}

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">


<StatCard

label="Total Incidents"

value={stats.totalIncidents}

icon={ShieldAlert}

tone="navy"

isLoading={isLoading}

helperText="All detected events"

/>



<StatCard

label="High Risk"

value={stats.highRisk}

icon={ShieldX}

tone="high"

isLoading={isLoading}

helperText="Immediate action"

/>



<StatCard

label="Medium Risk"

value={stats.mediumRisk}

icon={AlertTriangle}

tone="medium"

isLoading={isLoading}

helperText="Needs attention"

/>



<StatCard

label="Low Risk"

value={stats.lowRisk}

icon={ShieldCheck}

tone="low"

isLoading={isLoading}

helperText="Safe conditions"

/>



<StatCard

label="Safety Score"

value={
stats.avgSafetyScore !== null
?
stats.avgSafetyScore.toFixed(0)
:
"—"
}

suffix={
stats.avgSafetyScore !== null
?
"/100"
:
""
}

icon={Gauge}

tone="brand"

isLoading={isLoading}

helperText="Overall site safety"

/>


</div>






{/* AI SUMMARY */}

<Card>


<CardHeader>

<CardTitle className="flex items-center gap-2">

<Sparkles className="h-5 w-5 text-brand-500"/>

AI Safety Summary

</CardTitle>

</CardHeader>


<CardContent>


<div className="rounded-xl bg-brand-50 p-5 text-sm text-brand-900">


{
stats.highRisk > 0

?

<>
<strong>
Attention required:
</strong>

{" "}
{stats.highRisk} high-risk incidents detected.
Review PPE compliance and take corrective action.
</>


:

<>
<strong>
Site status:
</strong>

{" "}
No critical safety violations detected.
Continue monitoring for real-time protection.
</>

}


</div>


</CardContent>


</Card>







{/* QUICK STATUS */}

<div className="grid gap-4 md:grid-cols-2">



<Card>

<CardHeader>

<CardTitle className="flex items-center gap-2">

<Activity className="h-5 w-5"/>

Monitoring Status

</CardTitle>

</CardHeader>


<CardContent>


<p className="text-sm text-navy-600">

YOLO detection engine and FastAPI backend are ready.

</p>


<Button asChild className="mt-4">

<Link to="/live-monitoring">

Open Monitor

</Link>

</Button>


</CardContent>


</Card>





<Card>

<CardHeader>

<CardTitle>

Risk Overview

</CardTitle>

</CardHeader>


<CardContent className="space-y-3">


<div className="flex justify-between">

<span>
High Risk
</span>

<span className="font-bold text-red-600">

{stats.highRisk}

</span>

</div>



<div className="flex justify-between">

<span>
Medium Risk
</span>

<span className="font-bold text-yellow-600">

{stats.mediumRisk}

</span>

</div>



<div className="flex justify-between">

<span>
Low Risk
</span>

<span className="font-bold text-green-600">

{stats.lowRisk}

</span>

</div>


</CardContent>


</Card>



</div>



</>

}





{
!isLoading &&
!error &&
stats.totalIncidents===0 &&

<div className="rounded-xl border border-dashed border-navy-200 bg-navy-50/50 p-6 text-center text-sm text-navy-500">


No incidents recorded yet.

Start monitoring to generate AI safety intelligence.


</div>

}


</div>

);

}