import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectHealthCard } from "@/components/projects/ProjectHealthCard";
import { ProjectProgressCard } from "@/components/projects/ProjectProgressCard";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProject, getProjectIssues, getProjectRisks } from "@/data/mock-data";

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = getProject(projectId);
  const risks = getProjectRisks(project.id);
  const issues = getProjectIssues(project.id);
  return (
    <PageContainer title={project.name} description={project.executiveSummary} action={<ProjectStatusBadge status={project.status} />}>
      <div className="grid gap-4 xl:grid-cols-3"><ProjectHealthCard project={project} /><ProjectProgressCard project={project} /><Card className="border-slate-200"><CardHeader><CardTitle className="text-sm text-slate-500">Marco executivo</CardTitle></CardHeader><CardContent className="flex flex-col gap-3"><div><p className="text-sm text-slate-500">Fase atual</p><p className="text-xl font-semibold text-slate-950">{project.phase}</p></div><div><p className="text-sm text-slate-500">Go live</p><p className="text-xl font-semibold text-slate-950">{project.goLive}</p></div><div><p className="text-sm text-slate-500">Sponsor</p><p className="font-medium text-slate-950">{project.sponsor}</p></div></CardContent></Card></div>
      <div className="grid gap-4 lg:grid-cols-2"><Card className="border-slate-200"><CardHeader><CardTitle>Proximos passos</CardTitle></CardHeader><CardContent className="flex flex-col gap-3">{project.nextSteps.map((step) => <div key={step} className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">{step}</div>)}</CardContent></Card><Card className="border-slate-200"><CardHeader><CardTitle>Alertas executivos</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><div className="rounded-md bg-red-50 p-3"><p className="text-sm text-red-700">Riscos altos</p><p className="text-2xl font-semibold text-red-800">{risks.filter((risk) => risk.severity === "Alto").length}</p></div><div className="rounded-md bg-orange-50 p-3"><p className="text-sm text-orange-700">Pendências críticas</p><p className="text-2xl font-semibold text-orange-800">{issues.filter((issue) => issue.critical).length}</p></div></CardContent></Card></div>
      <div className="grid gap-3 md:grid-cols-5">{["activities", "risks", "issues", "time", "status-report"].map((item) => <Button key={item} asChild variant="outline"><Link href={`/projects/${project.id}/${item}`}>{item.replace("status-report", "status report")} <ArrowRight data-icon="inline-end" /></Link></Button>)}</div>
    </PageContainer>
  );
}
