import { Save } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewProjectPage() {
  return (
    <PageContainer title="Novo Projeto" description="Formulario mockado para estruturar a futura criacao de projetos.">
      <Card className="border-slate-200"><CardHeader><CardTitle>Dados executivos</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div className="flex flex-col gap-2"><Label>Nome do projeto</Label><Input placeholder="Ex.: Implantacao Operacional" /></div><div className="flex flex-col gap-2"><Label>Cliente</Label><Input placeholder="Cliente ou area" /></div><div className="flex flex-col gap-2"><Label>Responsavel</Label><Input placeholder="Gerente do projeto" /></div><div className="flex flex-col gap-2"><Label>Status inicial</Label><Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="on-track">No prazo</SelectItem><SelectItem value="attention">Atencao</SelectItem><SelectItem value="critical">Critico</SelectItem></SelectContent></Select></div><div className="flex flex-col gap-2 md:col-span-2"><Label>Resumo executivo</Label><Textarea placeholder="Contexto, objetivo, criterio de sucesso e riscos iniciais" /></div><div className="md:col-span-2"><Button><Save data-icon="inline-start" />Salvar rascunho</Button></div></CardContent></Card>
    </PageContainer>
  );
}
