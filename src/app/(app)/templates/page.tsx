import { FileText } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { templates } from "@/data/mock-data";

export default function TemplatesPage() {
  return <PageContainer title="Templates" description="Modelos executivos para iniciar projetos com governanca padronizada."><div className="grid gap-4 md:grid-cols-3">{templates.map((template) => <Card key={template.title} className="border-slate-200"><CardHeader className="gap-3"><div className="flex size-10 items-center justify-center rounded-md bg-slate-950 text-white"><FileText className="size-5" /></div><CardTitle>{template.title}</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-slate-600">{template.description}</p></CardContent></Card>)}</div></PageContainer>;
}
