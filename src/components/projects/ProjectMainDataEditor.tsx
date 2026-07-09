"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Pencil, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import { updateProjectMainData, type UpdateProjectMainDataState } from "@/app/(app)/projects/[projectId]/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState: UpdateProjectMainDataState = { status: "idle" };

const statusOptions = [
  { value: "PLANNED", label: "Planejado" },
  { value: "ON_TRACK", label: "No prazo" },
  { value: "ATTENTION", label: "Atenção" },
  { value: "CRITICAL", label: "Crítico" },
  { value: "PAUSED", label: "Pausado" },
  { value: "COMPLETED", label: "Concluído" },
  { value: "CANCELLED", label: "Cancelado" },
];

type Option = {
  id: string;
  name: string;
};

type ProjectMainDataEditorProps = {
  project: {
    slug: string;
    name: string;
    executiveSummary: string;
    status: string;
    targetGoLive: string;
    progress: number;
    companyId: string;
    unitId: string | null;
    ownerId: string | null;
    sponsorId: string | null;
  };
  options: {
    companies: Option[];
    units: Option[];
    users: Option[];
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="bg-slate-950 text-white hover:bg-slate-800">
      <Save data-icon="inline-start" />
      {pending ? "Salvando..." : "Salvar alterações"}
    </Button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;

  return <p className="text-xs font-medium text-red-600">{errors[0]}</p>;
}

export function ProjectMainDataEditor({ project, options }: ProjectMainDataEditorProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateProjectMainData, initialState);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-slate-950 text-white shadow-[0_10px_25px_rgba(15,23,42,0.18)] hover:bg-slate-800">
          <Pencil data-icon="inline-start" />
          Editar projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[92vh] flex-col overflow-hidden border-slate-200 bg-white p-0 shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 bg-white p-5 pr-14 sm:p-6 sm:pr-16">
          <DialogTitle className="text-xl font-bold text-slate-950">Editar dados principais</DialogTitle>
          <DialogDescription className="text-sm leading-6 text-slate-600">
            Atualize apenas os campos executivos do projeto. Fases, atividades, riscos e pendências continuam fora desta etapa.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            <input type="hidden" name="projectId" value={project.slug} />

            {state.message ? (
              <div
                className={
                  state.status === "success"
                    ? "mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                    : "mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                }
              >
                {state.message}
              </div>
            ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="name">Nome do projeto</Label>
              <Input id="name" name="name" defaultValue={project.name} className="h-10 bg-white" required />
              <FieldError errors={state.fieldErrors?.name} />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="executiveSummary">Resumo executivo</Label>
              <Textarea
                id="executiveSummary"
                name="executiveSummary"
                defaultValue={project.executiveSummary}
                className="min-h-28 bg-white leading-6"
                maxLength={1200}
              />
              <FieldError errors={state.fieldErrors?.executiveSummary} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={project.status}>
                <SelectTrigger className="h-10 w-full bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state.fieldErrors?.status} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="progress">Progresso percentual</Label>
              <Input id="progress" name="progress" type="number" min={0} max={100} defaultValue={project.progress} className="h-10 bg-white" />
              <FieldError errors={state.fieldErrors?.progress} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="targetGoLive">Go live / data alvo</Label>
              <Input id="targetGoLive" name="targetGoLive" type="date" defaultValue={project.targetGoLive} className="h-10 bg-white" />
              <FieldError errors={state.fieldErrors?.targetGoLive} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Empresa / cliente</Label>
              <Select name="companyId" defaultValue={project.companyId}>
                <SelectTrigger className="h-10 w-full bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {options.companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state.fieldErrors?.companyId} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Unidade</Label>
              <Select name="unitId" defaultValue={project.unitId ?? "none"}>
                <SelectTrigger className="h-10 w-full bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem unidade</SelectItem>
                  {options.units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state.fieldErrors?.unitId} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Gerente responsável</Label>
              <Select name="ownerId" defaultValue={project.ownerId ?? "none"}>
                <SelectTrigger className="h-10 w-full bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem responsável</SelectItem>
                  {options.users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state.fieldErrors?.ownerId} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Sponsor</Label>
              <Select name="sponsorId" defaultValue={project.sponsorId ?? "none"}>
                <SelectTrigger className="h-10 w-full bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem sponsor</SelectItem>
                  {options.users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state.fieldErrors?.sponsorId} />
            </div>
          </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-slate-100 bg-white p-5 sm:p-6">
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
