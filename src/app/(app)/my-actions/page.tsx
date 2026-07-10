import { AlertTriangle, CalendarClock, CheckCircle2, ClipboardList } from "lucide-react";

import { IssueCard } from "@/components/issues/IssueCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { issues } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const openIssues = issues.length;
const criticalIssues = issues.filter((issue) => issue.critical).length;
const dueSoonIssues = issues.filter((issue) => Number.parseInt(issue.dueDate, 10) <= 12).length;
const owners = new Set(issues.map((issue) => issue.owner)).size;

const summaryCards = [
  {
    title: "Ações críticas",
    value: criticalIssues,
    legend: "Exigem decisão ou desbloqueio",
    icon: AlertTriangle,
    className: "bg-red-50 text-red-700 ring-red-100",
  },
  {
    title: "Abertas",
    value: openIssues,
    legend: "Pendências executivas ativas",
    icon: ClipboardList,
    className: "bg-blue-50 text-blue-700 ring-blue-100",
  },
  {
    title: "Vencem em 7 dias",
    value: dueSoonIssues,
    legend: "Agenda imediata da semana",
    icon: CalendarClock,
    className: "bg-orange-50 text-orange-700 ring-orange-100",
  },
  {
    title: "Responsáveis",
    value: owners,
    legend: "Pontos focais envolvidos",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
];

export default function MyActionsPage() {
  return (
    <PageContainer title="Minhas Ações" description="Pendências e decisões que precisam de encaminhamento executivo." showPageHeader={false}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <CardContent className="flex min-h-28 items-center gap-4 p-5">
                <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full ring-8", item.className)}>
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
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
          <h3 className="text-lg font-bold text-slate-950">Fila de execução</h3>
          <p className="text-sm text-slate-500">Acompanhe impacto, prazo e próxima ação por pendência.</p>
        </div>
        <div className="grid gap-4">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
