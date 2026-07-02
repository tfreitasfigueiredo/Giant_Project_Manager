import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Risk } from "@/data/mock-data";

export function RiskCard({ risk }: { risk: Risk }) {
  const high = risk.severity === "Alto";
  return (
    <Card className="border-slate-200">
      <CardHeader className="gap-3 pb-3">
        <div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><div className="flex size-10 items-center justify-center rounded-md bg-orange-50 text-orange-700"><AlertTriangle className="size-5" /></div><CardTitle className="text-base">{risk.title}</CardTitle></div><Badge variant="outline" className={high ? "border-red-200 bg-red-50 text-red-700" : "border-orange-200 bg-orange-50 text-orange-700"}>{risk.severity}</Badge></div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-slate-600 md:grid-cols-3"><div><p className="font-medium text-slate-950">Impacto no go live</p><p>{risk.goLiveImpact}</p></div><div><p className="font-medium text-slate-950">Responsavel</p><p>{risk.owner}</p></div><div><p className="font-medium text-slate-950">Mitigacao</p><p>{risk.mitigation}</p></div></CardContent>
    </Card>
  );
}
