import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHealth } from "@/services/incidentService";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;
    getHealth()
      .then(() => mounted && setBackendStatus("online"))
      .catch(() => mounted && setBackendStatus("offline"));
    return () => {
      mounted = false;
    };
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("buildvision_session");
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-md p-2 text-navy-500 hover:bg-navy-100 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div
          className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-navy-500 sm:flex"
          title={`API base: ${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}`}
        >
          {backendStatus === "online" ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-risk-low" />
              Backend connected
            </>
          ) : backendStatus === "offline" ? (
            <>
              <WifiOff className="h-3.5 w-3.5 text-risk-high" />
              Backend unreachable
            </>
          ) : (
            <>
              <Wifi className="h-3.5 w-3.5 animate-pulse text-navy-300" />
              Checking backend…
            </>
          )}
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </header>
  );
}
