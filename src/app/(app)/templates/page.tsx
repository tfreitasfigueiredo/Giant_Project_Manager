import { ArrowRight, ClipboardCheck, FileText, FolderKanban, Layers3 } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { templates } from "@/data/mock-data";

const templateIcons = [FolderKanban, ClipboardCheck, Layers3];

export default function TemplatesPage() {
  return (
    <PageContainer title="Templates" description="Modelos executivos para iniciar projetos com governança padronizada." showPageHeader={false}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:col-span-2">
          <CardContent className="flex min-h-32 flex-col justify-center gap-2 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-8 ring-blue-100">
                <FileText className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Biblioteca executiva</p>
                <p className="text-3xl font-bold tracking-tight text-slate-950">{templates.length}</p>
              </div>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Estruturas iniciais para padronizar fases, ritos e entregáveis sem criar processo pesado.
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-slate-950 text-white shadow-[0_12px_35px_rgba(15,23,42,0.12)]">
          <CardContent className="flex min-h-32 flex-col justify-between p-5 sm:p-6">
            <Badge variant="outline" className="w-fit border-white/20 bg-white/10 text-white">
              V0.4.2
            </Badge>
            <p className="text-sm leading-6 text-slate-200">Templates mockados preservados para a primeira camada operacional.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {templates.map((template, index) => {
          const Icon = templateIcons[index] ?? FileText;
          return (
            <Card key={template.title} className="group border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <CardHeader className="gap-4 pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-slate-950 text-white ring-8 ring-slate-100">
                    <Icon className="size-5" />
                  </div>
                  <ArrowRight className="mt-3 size-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500" />
                </div>
                <CardTitle className="text-base font-bold text-slate-950">{template.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600">{template.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
