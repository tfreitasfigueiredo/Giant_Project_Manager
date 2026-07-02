import { AlertTriangle, CheckCircle2, CircleAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/data/mock-data";

export function ProjectHealthCard({ project }: { project: Project }) {
  const health = project.status === "critical" ? "Critico" : project.status === "attention" ? "Atencao" : "Saudavel";
  const Icon = project.status === "critical" ? CircleAlert : project.status === "attention" ? AlertTriangle : CheckCircle2;

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Saude geral</CardTitle></CardHeader>
      <CardContent className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-md bg-slate-950 text-white"><Icon className="size-5" /></div>
        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-slate-950">{health}</span>
          <span className="text-sm text-slate-500">{project.highRisks} riscos altos · {project.executiveIssues} pendencias</span>
        </div>
      </CardContent>
    </Card>
  );
}
