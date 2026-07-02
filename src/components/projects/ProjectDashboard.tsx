import { Activity, AlertTriangle, CalendarClock, CheckCircle2, ClipboardList, GanttChartSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPortfolioStats, projects } from "@/data/mock-data";
import { ProjectCard } from "./ProjectCard";

const statItems = [
  { key: "activeProjects", label: "Projetos ativos", icon: GanttChartSquare },
  { key: "attentionProjects", label: "Em atencao", icon: AlertTriangle },
  { key: "criticalProjects", label: "Criticos", icon: Activity },
  { key: "executiveIssues", label: "Pendencias executivas", icon: ClipboardList },
  { key: "decisionsPending", label: "Decisoes pendentes", icon: CheckCircle2 },
  { key: "upcomingGoLives", label: "Go lives proximos", icon: CalendarClock },
] as const;

export function ProjectDashboard() {
  const stats = getPortfolioStats();
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.key} className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-slate-500">{item.label}</CardTitle><Icon className="size-4 text-slate-500" /></CardHeader>
              <CardContent><p className="text-3xl font-semibold text-slate-950">{stats[item.key]}</p></CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
    </div>
  );
}
