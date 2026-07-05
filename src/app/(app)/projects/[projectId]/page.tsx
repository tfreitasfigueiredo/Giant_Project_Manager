import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { ActivityCard } from "@/components/activities/ActivityCard";
import { IssueCard } from "@/components/issues/IssueCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectHealthCard } from "@/components/projects/ProjectHealthCard";
import { ProjectProgressCard } from "@/components/projects/ProjectProgressCard";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { RiskCard } from "@/components/risks/RiskCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getProjectDetail } from "@/lib/server/projects";

export const dynamic = "force-dynamic";

const projectSections = [
  { key: "activities", label: "Atividades" },
  { key: "risks", label: "Riscos" },
  { key: "issues", label: "Pendências" },
  { key: "time", label: "Tempo" },
  { key: "status-report", label: "Status report" },
];

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProjectDetail(projectId);

  if (!project) {
    notFound();
  }

  return (
    <PageContainer title={project.name} description={project.executiveSummary} action={<ProjectStatusBadge status={project.status} />}>
      <div className="grid gap-4 xl:grid-cols-3">
        <ProjectHealthCard project={project} />
        <ProjectProgressCard project={project} />
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Marco executivo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div>
              <p className="text-sm text-slate-500">Fase atual</p>
              <p className="text-xl font-semibold text-slate-950">{project.phase}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Go live</p>
              <p className="text-xl font-semibold text-slate-950">{project.goLive}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Sponsor</p>
              <p className="font-medium text-slate-950">{project.sponsor}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Próximos passos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {project.nextSteps.map((step) => (
              <div key={step} className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                {step}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Alertas executivos</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-700">Riscos altos</p>
              <p className="text-2xl font-semibold text-red-800">{project.highRisks}</p>
            </div>
            <div className="rounded-md bg-orange-50 p-3">
              <p className="text-sm text-orange-700">Pendências críticas</p>
              <p className="text-2xl font-semibold text-orange-800">{project.executiveIssues}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Fases</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {project.phases.map((phase) => (
              <div key={phase.id} className="flex flex-col gap-2 rounded-md bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-950">{phase.name}</span>
                  <span className="text-slate-500">{phase.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={phase.progress} />
                  <span className="w-10 text-right text-sm font-semibold text-slate-700">{phase.progress}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Status executivo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {project.statusSnapshot ? (
              <>
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-950">{project.statusSnapshot.healthLabel}</p>
                  <p className="mt-1 text-sm text-slate-600">{project.statusSnapshot.summary}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Snapshot</p>
                    <p className="font-semibold text-slate-950">{project.statusSnapshot.snapshotAt}</p>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Fase</p>
                    <p className="font-semibold text-slate-950">{project.statusSnapshot.phaseName}</p>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Go live</p>
                    <p className="font-semibold text-slate-950">{project.statusSnapshot.goLiveDate}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">Status snapshot ainda não registrado.</p>
            )}
            {project.statusReport ? (
              <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-600">
                <p className="font-medium text-slate-950">{project.statusReport.title}</p>
                <p>
                  {project.statusReport.period} · versão {project.statusReport.version}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {projectSections.map((item) => (
          <Button key={item.key} asChild variant="outline">
            <Link href={`/projects/${project.id}/${item.key}`}>
              {item.label} <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Atividades</h2>
          <p className="text-sm text-slate-500">Plano executivo por fase com responsáveis, prazo e avanço.</p>
        </div>
        <div className="grid gap-3 xl:grid-cols-2">
          {project.activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Riscos</h2>
          <p className="text-sm text-slate-500">Riscos vinculados ao projeto e impacto no go live.</p>
        </div>
        <div className="grid gap-3">
          {project.risks.map((risk) => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Pendências</h2>
          <p className="text-sm text-slate-500">Pendências abertas com origem, responsável, impacto e próxima ação.</p>
        </div>
        <div className="grid gap-3">
          {project.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}