import { Link } from "react-router-dom";
import { HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy-950 px-4 text-center text-white">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 shadow-glow">
        <HardHat className="h-7 w-7" />
      </div>
      <h1 className="font-display text-4xl font-bold">404</h1>
      <p className="max-w-sm text-navy-400">
        This page isn't part of the BuildVision site map.
      </p>
      <Button asChild>
        <Link to="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
