import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/data/mock-data";

const statusMap: Record<ProjectStatus, { label: string; className: string }> = {
  "on-track": { label: "No prazo", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  attention: { label: "Atencao", className: "border-orange-200 bg-orange-50 text-orange-700" },
  critical: { label: "Critico", className: "border-red-200 bg-red-50 text-red-700" },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const item = statusMap[status];
  return <Badge variant="outline" className={item.className}>{item.label}</Badge>;
}
