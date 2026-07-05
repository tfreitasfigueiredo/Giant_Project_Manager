import { CalendarClock, ClipboardList, Flame, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Issue } from "@/data/mock-data";
import { cn } from "@/lib/utils";

export function IssueCard({ issue }: { issue: Issue }) {
  const criticalStyles = issue.critical
    ? {
        icon: "bg-red-50 text-red-700 ring-red-100",
        badge: "border-red-200 bg-red-50 text-red-700",
        rail: "bg-red-500",
        label: "Crítica",
      }
    : {
        icon: "bg-blue-50 text-blue-700 ring-blue-100",
        badge: "border-blue-200 bg-blue-50 text-blue-700",
        rail: "bg-blue-500",
        label: "Aberta",
      };

  return (
    <Card className="relative overflow-hidden border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
      <div className={cn("absolute inset-y-0 left-0 w-1", criticalStyles.rail)} />
      <CardHeader className="gap-4 pb-4 pl-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full ring-8", criticalStyles.icon)}>
              <ClipboardList className="size-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-bold leading-6 text-slate-950">{issue.title}</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Origem: {issue.source}</p>
            </div>
          </div>
          <Badge variant="outline" className={cn("h-6 rounded-full px-3 font-semibold", criticalStyles.badge)}>
            {criticalStyles.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 pl-6 text-sm text-slate-600 md:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
            <UserRound className="size-4 text-slate-500" />
            Responsável
          </div>
          <p>{issue.owner}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
            <CalendarClock className="size-4 text-slate-500" />
            Prazo
          </div>
          <p>{issue.dueDate}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
            <Flame className="size-4 text-slate-500" />
            Impacto
          </div>
          <p className="leading-6">{issue.impact}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <p className="mb-2 font-semibold text-slate-950">Próxima ação</p>
          <p className="leading-6">{issue.nextAction}</p>
        </div>
      </CardContent>
    </Card>
  );
}
