import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/data/mock-data";

const statusMap: Record<ProjectStatus, { label: string; className: string; dot: string }> = {
  "on-track": { label: "No prazo", className: "border-emerald-200 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  attention: { label: "Atenção", className: "border-orange-200 bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  critical: { label: "Crítico", className: "border-red-200 bg-red-50 text-red-700", dot: "bg-red-500" },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const item = statusMap[status];
  return (
    <Badge variant="outline" className={`gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${item.className}`}>
      <span className={`size-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </Badge>
  );
}
