import { Clock } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getProject } from "@/data/mock-data";

export default async function TimePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = getProject(projectId);
  const usage = Math.min(100, Math.round((project.actualHours / project.plannedHours) * 100));

  return (
    <PageContainer title="Tempo planejado x realizado" description={`${project.name} · controle executivo de consumo de horas.`} showPageHeader={false}>
      <div>
        <p className="mb-1 text-sm font-semibold text-slate-500">{project.name}</p>
        <h2 className="text-lg font-bold text-slate-950">Consumo de horas</h2>
        <p className="text-sm text-slate-500">Controle executivo de planejado, realizado e variação.</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Resumo de consumo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Planejado</p>
              <p className="text-3xl font-semibold">{project.plannedHours}h</p>
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Realizado</p>
              <p className="text-3xl font-semibold">{project.actualHours}h</p>
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Uso</p>
              <p className="text-3xl font-semibold">{usage}%</p>
            </div>
          </div>
          <Progress value={usage} />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
