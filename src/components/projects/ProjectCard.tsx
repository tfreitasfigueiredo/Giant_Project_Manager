import Link from "next/link";
import { CalendarDays, Flag, Gauge } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

const statusDot = {
  "on-track": "bg-emerald-500",
  attention: "bg-orange-500",
  critical: "bg-red-500",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="block">
      <Card className="h-full overflow-hidden border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
        <CardHeader className="gap-4 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <span className={cn("size-2 rounded-full", statusDot[project.status])} />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{project.client}</span>
              </div>
              <CardTitle className="line-clamp-2 text-base font-bold leading-6 text-slate-950">{project.name}</CardTitle>
              <p className="mt-1 text-sm text-slate-500">{project.unit}</p>
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-[88px_1fr] items-center gap-4">
            <div className="relative flex size-20 items-center justify-center rounded-full bg-slate-50">
              <svg viewBox="0 0 80 80" className="absolute inset-0 size-20 -rotate-90">
                <circle cx="40" cy="40" r="33" fill="none" stroke="rgb(226 232 240)" strokeWidth="8" />
                <circle cx="40" cy="40" r="33" fill="none" stroke="rgb(15 23 42)" strokeLinecap="round" strokeWidth="8" strokeDasharray={207} strokeDashoffset={207 - (207 * project.progress) / 100} />
              </svg>
              <span className="relative text-lg font-bold text-slate-950">{project.progress}%</span>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-slate-500">Fase atual</p>
                <p className="text-sm font-semibold text-slate-950">{project.phase}</p>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">
              <CalendarDays className="mb-2 size-4 text-slate-500" />
              <p className="text-xs text-slate-500">Go live</p>
              <p className="font-semibold text-slate-950">{project.goLive}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <Gauge className="mb-2 size-4 text-slate-500" />
              <p className="text-xs text-slate-500">Atividades</p>
              <p className="font-semibold text-slate-950">{project.completedActivities}/{project.totalActivities}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
            <Flag className="size-4" />
            {project.highRisks} riscos altos - {project.executiveIssues} pendencias
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
