import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { ActivityCard } from "@/components/activities/ActivityCard";
import { IssueCard } from "@/components/issues/IssueCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectHealthCard } from "@/components/projects/ProjectHealthCard";
import { ProjectProgressCard } from "@/components/projects/ProjectProgressCard";
import { ProjectMainDataEditor } from "@/components/projects/ProjectMainDataEditor";
import { ProjectPhaseEditor } from "@/components/projects/ProjectPhaseEditor";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { RiskCard } from "@/components/risks/RiskCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getProjectDetail, getProjectMainDataEditor } from "@/lib/server/projects";

export const dynamic = "force-dynamic";

const projectSections = [
  { key: "activities", label: "Atividades" },
  { key: "risks", label: "Riscos" },
  { key: "issues", label: "Pendências" },
  { key: "time", label: "Tempo" },
  { key: "status-report", label: "Status report" },
];

function getNextPhaseOrder(phases: { orderIndex: number }[]) {
  if (!phases.length) return 1;

  return Math.max(...phases.map((phase) => phase.orderIndex)) + 1;
}

function formatPhaseDate(value: string) {
  if (!value) return "Sem data";

  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(`${value}T00:00:00.000Z`),
  );
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const [project, editorData] = await Promise.all([
    getProjectDetail(projectId),
    getProjectMainDataEditor(projectId),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <PageContainer
      title={project.name}
      description={project.executiveSummary}
      action={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <ProjectStatusBadge status={project.status} />
          {editorData ? <ProjectMainDataEditor project={editorData.project} options={editorData.options} /> : null}
        </div>
      }
    >
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
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Fases</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Blocos executivos do projeto, com ordem, datas, status e avanço.</p>
            </div>
            <ProjectPhaseEditor mode="create" projectId={project.id} nextOrderIndex={getNextPhaseOrder(project.phases)} />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {project.phases.map((phase) => (
              <div key={phase.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                        #{phase.orderIndex}
                      </span>
                      <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">{phase.status}</span>
                    </div>
                    <p className="mt-2 font-semibold text-slate-950">{phase.name}</p>
                    {phase.description ? <p className="mt-1 text-sm leading-6 text-slate-600">{phase.description}</p> : null}
                  </div>
                  <ProjectPhaseEditor mode="edit" projectId={project.id} phase={phase} />
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={phase.progress} />
                  <span className="w-10 text-right text-sm font-semibold text-slate-700">{phase.progress}%</span>
                </div>
                <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
                  <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
                    <p className="font-medium text-slate-700">Início planejado</p>
                    <p>{formatPhaseDate(phase.startDate)}</p>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
                    <p className="font-medium text-slate-700">Fim planejado</p>
                    <p>{formatPhaseDate(phase.dueDate)}</p>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
                    <p className="font-medium text-slate-700">Conclusão real</p>
                    <p>{formatPhaseDate(phase.completedAt)}</p>
                  </div>
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
