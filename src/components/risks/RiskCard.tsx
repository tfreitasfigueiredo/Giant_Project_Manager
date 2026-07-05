import { AlertTriangle, ShieldAlert, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Risk } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const severityStyles = {
  Alto: {
    icon: "bg-red-50 text-red-700 ring-red-100",
    badge: "border-red-200 bg-red-50 text-red-700",
    rail: "bg-red-500",
  },
  Médio: {
    icon: "bg-orange-50 text-orange-700 ring-orange-100",
    badge: "border-orange-200 bg-orange-50 text-orange-700",
    rail: "bg-orange-500",
  },
  Baixo: {
    icon: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rail: "bg-emerald-500",
  },
};

export function RiskCard({ risk }: { risk: Risk }) {
  const styles = severityStyles[risk.severity];

  return (
    <Card className="relative overflow-hidden border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
      <div className={cn("absolute inset-y-0 left-0 w-1", styles.rail)} />
      <CardHeader className="gap-4 pb-4 pl-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full ring-8", styles.icon)}>
              <AlertTriangle className="size-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-bold leading-6 text-slate-950">{risk.title}</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Risco monitorado para proteção do go live.</p>
            </div>
          </div>
          <Badge variant="outline" className={cn("h-6 rounded-full px-3 font-semibold", styles.badge)}>
            {risk.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 pl-6 text-sm text-slate-600 md:grid-cols-[1.1fr_0.8fr_1.2fr]">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
            <ShieldAlert className="size-4 text-slate-500" />
            Impacto no go live
          </div>
          <p className="leading-6">{risk.goLiveImpact}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
            <UserRound className="size-4 text-slate-500" />
            Responsável
          </div>
          <p className="leading-6">{risk.owner}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <p className="mb-2 font-semibold text-slate-950">Mitigação</p>
          <p className="leading-6">{risk.mitigation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
