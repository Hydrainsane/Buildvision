import { NavLink } from "react-router-dom";
import { HardHat, LayoutDashboard, ListVideo, Settings, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/live-monitoring", label: "Live Monitoring", icon: ListVideo },
  { to: "/incidents", label: "Incidents", icon: ShieldCheck },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-navy-950/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-navy-900 text-navy-200 transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white shadow-glow">
              <HardHat className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-sm font-bold text-white">BuildVision</p>
              <p className="text-[11px] text-navy-400">Site Safety AI</p>
            </div>
          </div>
          <button
            className="rounded-md p-1 text-navy-400 hover:bg-navy-800 lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-navy-300 hover:bg-navy-800 hover:text-white"
                )
              }
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-navy-800 px-5 py-4">
          <p className="text-[11px] leading-relaxed text-navy-500">
            YOLO detection + Gemini AI
            <br />
            connected to FastAPI backend
          </p>
        </div>
      </aside>
    </>
  );
}
