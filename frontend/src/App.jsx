import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import LiveMonitoring from "@/pages/LiveMonitoring";
import IncidentHistory from "@/pages/IncidentHistory";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/layouts/DashboardLayout";
import RequireSession from "@/components/RequireSession";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        element={
          <RequireSession>
            <DashboardLayout />
          </RequireSession>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live-monitoring" element={<LiveMonitoring />} />
        <Route path="/incidents" element={<IncidentHistory />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
