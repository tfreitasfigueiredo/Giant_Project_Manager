import { AlertTriangle, CalendarClock, ClipboardList, UserRoundCheck } from "lucide-react";
import { notFound } from "next/navigation";

import { IssueCard } from "@/components/issues/IssueCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { getProjectIssues } from "@/lib/server/projects";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function IssuesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const data = await getProjectIssues(projectId);

  if (!data) {
    notFound();
  }

  const criticalIssues = data.issues.filter((issue) => issue.critical).length;
  const openIssues = data.issues.length;
  const owners = new Set(data.issues.map((issue) => issue.owner)).size;
  const dueSoonIssues = data.issues.filter((issue) => Number.parseInt(issue.dueDate, 10) <= 12).length;
  const summaryCards = [
    {
      title: "Críticas abertas",
      value: criticalIssues,
      legend: "Exigem encaminhamento",
      icon: AlertTriangle,
      className: "bg-red-50 text-red-700 ring-red-100",
    },
    {
      title: "Pendências",
      value: openIssues,
      legend: "Itens ativos do projeto",
      icon: ClipboardList,
      className: "bg-blue-50 text-blue-700 ring-blue-100",
    },
    {
      title: "Vencem em 7 dias",
      value: dueSoonIssues,
      legend: "Foco operacional imediato",
      icon: CalendarClock,
      className: "bg-orange-50 text-orange-700 ring-orange-100",
    },
    {
      title: "Responsáveis",
      value: owners,
      legend: "Pontos focais acionados",
      icon: UserRoundCheck,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
  ];

  return (
    <PageContainer title="Pendências" description={`${data.project.name} · origem, responsável, prazo, impacto e próxima ação.`}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <CardContent className="flex min-h-28 items-center gap-4 p-5">
                <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full ring-8", item.className)}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.title}</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{item.legend}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Fila de pendências</h3>
          <p className="text-sm text-slate-500">Priorização por criticidade, prazo, impacto e próxima ação.</p>
        </div>
        <div className="grid gap-4">
          {data.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
