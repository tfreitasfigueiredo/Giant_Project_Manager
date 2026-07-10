import { AlertTriangle, ShieldCheck, Siren } from "lucide-react";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { RiskCard } from "@/components/risks/RiskCard";
import { Card, CardContent } from "@/components/ui/card";
import { getProjectRisks } from "@/lib/server/projects";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RisksPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const data = await getProjectRisks(projectId);

  if (!data) {
    notFound();
  }

  const highRisks = data.risks.filter((risk) => risk.severity === "Alto").length;
  const mediumRisks = data.risks.filter((risk) => risk.severity === "Médio").length;
  const lowRisks = data.risks.filter((risk) => risk.severity === "Baixo").length;
  const summaryCards = [
    {
      title: "Riscos altos",
      value: highRisks,
      legend: "Impacto executivo imediato",
      icon: Siren,
      className: "bg-red-50 text-red-700 ring-red-100",
    },
    {
      title: "Riscos médios",
      value: mediumRisks,
      legend: "Acompanhamento semanal",
      icon: AlertTriangle,
      className: "bg-orange-50 text-orange-700 ring-orange-100",
    },
    {
      title: "Baixo impacto",
      value: lowRisks,
      legend: "Monitoramento preventivo",
      icon: ShieldCheck,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
  ];

  return (
    <PageContainer title="Riscos" description={`${data.project.name} · severidade, impacto no go live, responsável e mitigação.`} showPageHeader={false}>
      <div>
        <p className="mb-1 text-sm font-semibold text-slate-500">{data.project.name}</p>
        <h2 className="text-lg font-bold text-slate-950">Mapa de riscos</h2>
        <p className="text-sm text-slate-500">Severidade, impacto no go live, responsável e mitigação.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
          <h3 className="text-lg font-bold text-slate-950">Priorização executiva</h3>
          <p className="text-sm text-slate-500">Riscos por severidade, dono e plano de mitigação.</p>
        </div>
        <div className="grid gap-4">
          {data.risks.map((risk) => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
