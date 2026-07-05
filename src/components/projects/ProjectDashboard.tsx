import {
  AlertTriangle,
  BriefcaseBusiness,
  Clock3,
  ClipboardList,
  FolderKanban,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { ActivityCard } from "@/components/activities/ActivityCard";
import { ActivityStatusBadge } from "@/components/activities/ActivityStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DashboardData } from "@/lib/server/dashboard";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

const kpis = [
  {
    key: "activeProjects",
    title: "Total de Projetos",
    legend: "Carteira ativa",
    icon: FolderKanban,
    tone: "blue",
  },
  {
    key: "portfolioHealth",
    title: "Saúde do Portfólio",
    legend: "Visão consolidada",
    icon: ShieldCheck,
    tone: "emerald",
  },
  {
    key: "onTimePerformance",
    title: "Performance no Prazo",
    legend: "Avanço médio",
    icon: Clock3,
    tone: "emerald",
  },
  {
    key: "executiveIssues",
    title: "Pendências Executivas",
    legend: "Aguardando ação",
    icon: ClipboardList,
    tone: "orange",
  },
  {
    key: "criticalProjects",
    title: "Projetos em Risco",
    legend: "Requer atenção",
    icon: AlertTriangle,
    tone: "red",
  },
] as const;

const toneClass = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  orange: "bg-orange-50 text-orange-700 ring-orange-100",
  red: "bg-red-50 text-red-700 ring-red-100",
  slate: "bg-slate-50 text-slate-700 ring-slate-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
};

const barClass = {
  emerald: "bg-emerald-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  slate: "bg-slate-400",
  amber: "bg-amber-500",
};

function ExecutiveKpiCard({ item, value }: { item: (typeof kpis)[number]; value: string | number }) {
  const Icon = item.icon;
  return (
    <Card className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
      <CardContent className="flex min-h-32 items-center gap-4 p-5">
        <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-full ring-8", toneClass[item.tone])}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{item.title}</p>
          <p className="mt-1 truncate text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">{item.legend}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryBlock({
  title,
  rows,
}: {
  title: string;
  rows: ReadonlyArray<{ label: string; value: number; tone: keyof typeof barClass; percent?: number }>;
}) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-950">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", barClass[row.tone])} />
                <span className="text-sm text-slate-600">{row.label}</span>
              </div>
              {typeof row.percent === "number" ? (
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full", barClass[row.tone])} style={{ width: `${row.percent}%` }} />
                </div>
              ) : null}
            </div>
            <span className="flex min-w-8 items-center justify-center rounded-full bg-slate-100 px-2 py-1 text-sm font-bold text-slate-700">{row.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ProjectDashboard({ data }: { data: DashboardData }) {
  return (
    <div className="flex flex-col gap-7">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((item) => (
          <ExecutiveKpiCard key={item.key} item={item} value={data.kpiValues[item.key]} />
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Projetos Ativos</h3>
            <p className="text-sm text-slate-500">Avanço, fase atual, go live e alertas por iniciativa.</p>
          </div>
          <BriefcaseBusiness className="hidden size-5 text-slate-400 sm:block" />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {data.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <SummaryBlock title="Saúde dos Projetos" rows={data.portfolioHealthRows} />
        <SummaryBlock title="Riscos" rows={data.riskRows} />
        <SummaryBlock title="Pendências" rows={data.issueRows} />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Atividades Recentes</h3>
            <p className="text-sm text-slate-500">Movimentos recentes da carteira.</p>
          </div>
          <TrendingUp className="hidden size-5 text-slate-400 sm:block" />
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)] lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Atividade</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="max-w-64 font-semibold text-slate-950">{activity.projectName}</TableCell>
                  <TableCell>{activity.title}</TableCell>
                  <TableCell>{activity.owner}</TableCell>
                  <TableCell>{activity.dueDate}</TableCell>
                  <TableCell><ActivityStatusBadge status={activity.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-3 lg:hidden">
          {data.recentActivities.slice(0, 4).map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </div>
  );
}