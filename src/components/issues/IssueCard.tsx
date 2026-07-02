import { ClipboardList } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Issue } from "@/data/mock-data";

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="gap-3 pb-3">
        <div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><div className="flex size-10 items-center justify-center rounded-md bg-slate-100 text-slate-700"><ClipboardList className="size-5" /></div><div className="flex flex-col gap-1"><CardTitle className="text-base">{issue.title}</CardTitle><p className="text-sm text-slate-500">Origem: {issue.source}</p></div></div><Badge variant="outline" className={issue.critical ? "border-red-200 bg-red-50 text-red-700" : "border-slate-200 bg-slate-50 text-slate-700"}>{issue.critical ? "Crítica" : "Aberta"}</Badge></div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-slate-600 md:grid-cols-4"><div><p className="font-medium text-slate-950">Responsável</p><p>{issue.owner}</p></div><div><p className="font-medium text-slate-950">Prazo</p><p>{issue.dueDate}</p></div><div><p className="font-medium text-slate-950">Impacto</p><p>{issue.impact}</p></div><div><p className="font-medium text-slate-950">Próxima ação</p><p>{issue.nextAction}</p></div></CardContent>
    </Card>
  );
}

