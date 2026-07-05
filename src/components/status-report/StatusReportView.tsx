import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProjectStatusReportData } from "@/lib/server/projects";
import { ExecutiveSummaryCard } from "./ExecutiveSummaryCard";
import { MobileStatusStory } from "./MobileStatusStory";

export function StatusReportView({ report }: { report: ProjectStatusReportData }) {
  return (
    <div className="flex flex-col gap-5">
      <MobileStatusStory projects={[report.project]} />

      <div className="hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm lg:block">
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-500">
              {report.period} · v{report.version} · publicado em {report.publishedAt}
            </p>
            <h2 className="text-3xl font-semibold text-slate-950">{report.title}</h2>
            <p className="text-sm text-slate-500">{report.project.name}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Giant Projects</div>
            <ProjectStatusBadge status={report.project.status} />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ExecutiveSummaryCard title="Resumo executivo" summary={report.executiveNarrative} />
          <Card className="border-slate-200 shadow-none">
            <CardHeader>
              <CardTitle>Indicadores executivos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm text-slate-600">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-slate-500">Avanço</p>
                <p className="text-2xl font-semibold text-slate-950">{report.project.progress}%</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-slate-500">Fase atual</p>
                <p className="font-semibold text-slate-950">{report.project.phase}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-slate-500">Go live</p>
                <p className="font-semibold text-slate-950">{report.project.goLive}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-slate-500">Atividades</p>
                <p className="font-semibold text-slate-950">
                  {report.activitySummary.completed}/{report.activitySummary.total} concluídas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="border-slate-200 shadow-none">
            <CardHeader>
              <CardTitle>Principais avanços</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {report.highlights.map((highlight) => (
                <div key={highlight} className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
                  {highlight}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-none">
            <CardHeader>
              <CardTitle>Pontos de atenção</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {report.attentionPoints.map((point) => (
                <div key={point} className="rounded-md bg-orange-50 p-3 text-sm text-orange-800">
                  {point}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-none">
            <CardHeader>
              <CardTitle>Próximos passos</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {report.nextSteps.map((step) => (
                <div key={step} className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                  {step}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="border-slate-200 shadow-none">
            <CardHeader>
              <CardTitle>Riscos</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {report.risks.map((risk) => (
                <div key={risk.id} className="rounded-md border border-slate-200 p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-950">{risk.title}</p>
                    <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">{risk.severity}</span>
                  </div>
                  <p className="mt-2 text-slate-600">{risk.goLiveImpact}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-none">
            <CardHeader>
              <CardTitle>Pendências</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {report.issues.map((issue) => (
                <div key={issue.id} className="rounded-md border border-slate-200 p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-950">{issue.title}</p>
                    <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">
                      {issue.critical ? "Crítica" : "Aberta"}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-600">{issue.nextAction}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {report.sanitizedHtml ? (
          <Card className="mt-6 border-slate-200 shadow-none">
            <CardHeader>
              <CardTitle>Report salvo</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="space-y-3 text-sm leading-6 text-slate-700 [&_h1]:text-xl [&_h1]:font-semibold [&_li]:ml-5 [&_li]:list-disc"
                dangerouslySetInnerHTML={{ __html: report.sanitizedHtml }}
              />
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}