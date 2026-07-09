"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Pencil, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createProjectPhase,
  type ProjectPhaseActionState,
  updateProjectPhase,
} from "@/app/(app)/projects/[projectId]/actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogFormBody, DialogFormContent, DialogFormFooter, DialogFormHeader } from "@/components/ui/dialog-form-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectPhaseSummary } from "@/lib/server/projects";

const initialState: ProjectPhaseActionState = { status: "idle" };

const phaseStatusOptions = [
  { value: "NOT_STARTED", label: "Não iniciada" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "BLOCKED", label: "Bloqueada" },
  { value: "DONE", label: "Concluída" },
  { value: "CANCELLED", label: "Cancelada" },
];

type ProjectPhaseEditorProps = {
  mode: "create" | "edit";
  projectId: string;
  phase?: ProjectPhaseSummary;
  nextOrderIndex?: number;
};

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="bg-slate-950 text-white hover:bg-slate-800">
      <Save data-icon="inline-start" />
      {pending ? "Salvando..." : mode === "create" ? "Criar fase" : "Salvar fase"}
    </Button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;

  return <p className="text-xs font-medium text-red-600">{errors[0]}</p>;
}

export function ProjectPhaseEditor({ mode, projectId, phase, nextOrderIndex = 1 }: ProjectPhaseEditorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const action = mode === "create" ? createProjectPhase : updateProjectPhase;
  const [state, formAction] = useActionState(action, initialState);
  const isCreate = mode === "create";

  useEffect(() => {
    if (state.status !== "success") return;

    router.refresh();
    const timer = window.setTimeout(() => setOpen(false), 900);

    return () => window.clearTimeout(timer);
  }, [router, state.status]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isCreate ? (
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-slate-950 text-white shadow-[0_10px_25px_rgba(15,23,42,0.18)] hover:bg-slate-800"
        >
          <Plus data-icon="inline-start" />
          Nova fase
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
        >
          <Pencil data-icon="inline-start" />
          Editar fase
        </Button>
      )}
      <DialogFormContent>
        <DialogFormHeader
          title={isCreate ? "Nova fase do projeto" : "Editar fase do projeto"}
          description="Atualize apenas os dados da fase. Atividades, riscos, pendências e regras de consolidação continuam fora desta etapa."
        />

        <form action={formAction} className="flex min-h-0 flex-1 flex-col">
          <DialogFormBody>
            <input type="hidden" name="projectId" value={projectId} />
            {!isCreate ? <input type="hidden" name="phaseId" value={phase?.id ?? ""} /> : null}

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
              <Label htmlFor={`phase-name-${phase?.id ?? "new"}`}>Nome da fase</Label>
              <Input
                id={`phase-name-${phase?.id ?? "new"}`}
                name="name"
                defaultValue={phase?.name ?? ""}
                className="h-10 bg-white"
                required
              />
              <FieldError errors={state.fieldErrors?.name} />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor={`phase-description-${phase?.id ?? "new"}`}>Descrição</Label>
              <Textarea
                id={`phase-description-${phase?.id ?? "new"}`}
                name="description"
                defaultValue={phase?.description ?? ""}
                className="min-h-24 bg-white leading-6"
                maxLength={800}
              />
              <FieldError errors={state.fieldErrors?.description} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={phase?.statusCode ?? "NOT_STARTED"}>
                <SelectTrigger className="h-10 w-full bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {phaseStatusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state.fieldErrors?.status} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`phase-order-${phase?.id ?? "new"}`}>Ordem</Label>
              <Input
                id={`phase-order-${phase?.id ?? "new"}`}
                name="orderIndex"
                type="number"
                min={0}
                defaultValue={phase?.orderIndex ?? nextOrderIndex}
                className="h-10 bg-white"
              />
              <FieldError errors={state.fieldErrors?.orderIndex} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`phase-progress-${phase?.id ?? "new"}`}>Progresso</Label>
              <Input
                id={`phase-progress-${phase?.id ?? "new"}`}
                name="progress"
                type="number"
                min={0}
                max={100}
                defaultValue={phase?.progress ?? 0}
                className="h-10 bg-white"
              />
              <FieldError errors={state.fieldErrors?.progress} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`phase-start-${phase?.id ?? "new"}`}>Início planejado</Label>
              <Input
                id={`phase-start-${phase?.id ?? "new"}`}
                name="startDate"
                type="date"
                defaultValue={phase?.startDate ?? ""}
                className="h-10 bg-white"
              />
              <FieldError errors={state.fieldErrors?.startDate} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`phase-due-${phase?.id ?? "new"}`}>Fim planejado</Label>
              <Input
                id={`phase-due-${phase?.id ?? "new"}`}
                name="dueDate"
                type="date"
                defaultValue={phase?.dueDate ?? ""}
                className="h-10 bg-white"
              />
              <FieldError errors={state.fieldErrors?.dueDate} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`phase-completed-${phase?.id ?? "new"}`}>Conclusão real</Label>
              <Input
                id={`phase-completed-${phase?.id ?? "new"}`}
                name="completedAt"
                type="date"
                defaultValue={phase?.completedAt ?? ""}
                className="h-10 bg-white"
              />
              <FieldError errors={state.fieldErrors?.completedAt} />
            </div>
          </div>
          </DialogFormBody>

          <DialogFormFooter>
            <SubmitButton mode={mode} />
          </DialogFormFooter>
        </form>
      </DialogFormContent>
    </Dialog>
  );
}
