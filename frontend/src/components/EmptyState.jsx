import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  message,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-navy-200 bg-navy-50/50 px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy-400 shadow-card">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="font-display font-semibold text-navy-800">{title}</p>
        {message ? <p className="max-w-md text-sm text-navy-500">{message}</p> : null}
      </div>
    </div>
  );
}
