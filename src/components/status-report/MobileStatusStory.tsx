import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/data/mock-data";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";

export function MobileStatusStory({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4 lg:hidden">
      {projects.map((project) => (
        <Card key={project.id} className="min-h-80 border-slate-200">
          <CardHeader className="gap-3"><div className="flex items-center justify-between gap-3"><Badge variant="secondary">Story executivo</Badge><ProjectStatusBadge status={project.status} /></div><CardTitle className="text-xl">{project.name}</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4"><p className="text-sm leading-6 text-slate-600">{project.executiveSummary}</p><div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-md bg-slate-50 p-3"><p className="text-slate-500">Avanço</p><p className="text-2xl font-semibold">{project.progress}%</p></div><div className="rounded-md bg-slate-50 p-3"><p className="text-slate-500">Go live</p><p className="text-lg font-semibold">{project.goLive}</p></div></div><div className="flex flex-col gap-2">{project.nextSteps.map((step) => <div key={step} className="rounded-md border border-slate-200 p-3 text-sm">{step}</div>)}</div></CardContent>
        </Card>
      ))}
    </div>
  );
}
