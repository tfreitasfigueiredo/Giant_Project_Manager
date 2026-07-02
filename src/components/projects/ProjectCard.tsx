import Link from "next/link";
import { CalendarDays, CircleGauge, ListChecks } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@/data/mock-data";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="block">
      <Card className="h-full border-slate-200 transition hover:border-slate-300 hover:shadow-md">
        <CardHeader className="gap-3 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <CardTitle className="line-clamp-2 text-base text-slate-950">{project.name}</CardTitle>
              <p className="text-sm text-slate-500">{project.client} · {project.unit}</p>
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="line-clamp-3 text-sm leading-6 text-slate-600">{project.executiveSummary}</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Avanco</span>
              <span className="font-semibold text-slate-950">{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
            <div className="flex flex-col gap-1 rounded-md bg-slate-50 p-2"><CalendarDays className="size-4 text-slate-500" /><span>{project.goLive}</span></div>
            <div className="flex flex-col gap-1 rounded-md bg-slate-50 p-2"><CircleGauge className="size-4 text-slate-500" /><span>{project.phase}</span></div>
            <div className="flex flex-col gap-1 rounded-md bg-slate-50 p-2"><ListChecks className="size-4 text-slate-500" /><span>{project.completedActivities}/{project.totalActivities}</span></div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
