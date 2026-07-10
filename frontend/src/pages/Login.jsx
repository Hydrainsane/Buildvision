import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HardHat, LogIn, ScanEye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    // No authentication is required by the backend — this simply
    // marks a local session flag and proceeds to the dashboard.
    sessionStorage.setItem("buildvision_session", "active");
    setTimeout(() => {
      navigate("/dashboard");
    }, 350);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-panel lg:grid-cols-2">
        {/* Brand panel */}
        <div className="hidden flex-col justify-between bg-navy-900 p-10 text-white lg:flex">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 shadow-glow">
              <HardHat className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold">BuildVision</p>
              <p className="text-xs text-navy-400">Site Safety Intelligence</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold leading-tight text-balance">
              Real-time PPE compliance, powered by AI.
            </h2>
            <ul className="space-y-3 text-sm text-navy-300">
              <li className="flex items-center gap-3">
                <ScanEye className="h-4 w-4 text-brand-400" />
                YOLO detection on every live camera frame
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-brand-400" />
                Gemini-generated safety reports & recommendations
              </li>
            </ul>
          </div>

          <p className="text-xs text-navy-500">
            Connected to your FastAPI backend at 127.0.0.1:8000
          </p>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
              <HardHat className="h-5 w-5" />
            </div>
            <p className="font-display text-lg font-bold text-navy-900">BuildVision</p>
          </div>

          <h1 className="font-display text-2xl font-bold text-navy-900">Welcome back</h1>
          <p className="mt-1 text-sm text-navy-500">
            Sign in to monitor your active construction sites.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-navy-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="site.manager@buildvision.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-navy-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              <LogIn className="h-4 w-4" />
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>

            <p className="text-center text-xs text-navy-400">
              No account verification required for this build — enter any
              details to continue.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
