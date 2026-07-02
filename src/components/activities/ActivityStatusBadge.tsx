import { Badge } from "@/components/ui/badge";
import type { ActivityStatus } from "@/data/mock-data";

const map: Record<ActivityStatus, { label: string; className: string }> = {
  done: { label: "Concluida", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  "in-progress": { label: "Em andamento", className: "border-blue-200 bg-blue-50 text-blue-700" },
  blocked: { label: "Bloqueada", className: "border-red-200 bg-red-50 text-red-700" },
  planned: { label: "Planejada", className: "border-slate-200 bg-slate-50 text-slate-700" },
};

export function ActivityStatusBadge({ status }: { status: ActivityStatus }) {
  const item = map[status];
  return <Badge variant="outline" className={item.className}>{item.label}</Badge>;
}
