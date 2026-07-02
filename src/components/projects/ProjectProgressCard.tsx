import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@/data/mock-data";

export function ProjectProgressCard({ project }: { project: Project }) {
  const variance = project.actualHours - project.plannedHours;
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Avanço consolidado</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-end justify-between"><span className="text-3xl font-semibold text-slate-950">{project.progress}%</span><span className="text-sm text-slate-500">{project.completedActivities}/{project.totalActivities} atividades</span></div>
        <Progress value={project.progress} />
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md bg-slate-50 p-3"><p className="text-slate-500">Planejado</p><p className="font-semibold text-slate-950">{project.plannedHours}h</p></div>
          <div className="rounded-md bg-slate-50 p-3"><p className="text-slate-500">Realizado</p><p className="font-semibold text-slate-950">{project.actualHours}h ({variance > 0 ? "+" : ""}{variance}h)</p></div>
        </div>
      </CardContent>
    </Card>
  );
}
