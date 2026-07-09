"use client";

import { useActionState, useCallback, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Pencil, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createProjectActivity,
  type ProjectActivityActionState,
  updateProjectActivity,
} from "@/app/(app)/projects/[projectId]/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Activity, ProjectActivityPhaseOption, ProjectActivityUserOption } from "@/types/project-activities";

const initialState: ProjectActivityActionState = { status: "idle" };

const statusOptions = [
  { value: "PLANNED", label: "Planejada" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "BLOCKED", label: "Bloqueada" },
  { value: "DONE", label: "Concluída" },
  { value: "CANCELLED", label: "Cancelada" },
];

const priorityOptions = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
  { value: "CRITICAL", label: "Crítica" },
];

type ProjectActivityEditorProps = {
  mode: "create" | "edit";
  projectId: string;
  activity?: Activity;
  options: {
    phases: ProjectActivityPhaseOption[];
    users: ProjectActivityUserOption[];
  };
};

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="bg-slate-950 text-white hover:bg-slate-800">
      <Save data-icon="inline-start" />
      {pending ? "Salvando..." : mode === "create" ? "Criar atividade" : "Salvar atividade"}
    </Button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;

  return <p className="text-xs font-medium text-red-600">{errors[0]}</p>;
}

export function ProjectActivityEditor({ mode, projectId, activity, options }: ProjectActivityEditorProps) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const isCreate = mode === "create";
  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen && isCreate) {
      setFormKey((current) => current + 1);
    }

    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {isCreate ? (
        <Button
          type="button"
          onClick={() => handleOpenChange(true)}
          className="bg-slate-950 text-white shadow-[0_10px_25px_rgba(15,23,42,0.18)] hover:bg-slate-800"
        >
          <Plus data-icon="inline-start" />
          Nova atividade
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
          Editar atividade
        </Button>
      )}
      <ProjectActivityEditorContent
        key={isCreate ? formKey : activity?.id}
        mode={mode}
        projectId={projectId}
        activity={activity}
        options={options}
        closeModal={closeModal}
      />
    </Dialog>
  );
}

function ProjectActivityEditorContent({
  mode,
  projectId,
  activity,
  options,
  closeModal,
}: ProjectActivityEditorProps & { closeModal: () => void }) {
  const router = useRouter();
  const action = mode === "create" ? createProjectActivity : updateProjectActivity;
  const [state, formAction] = useActionState(action, initialState);
  const isCreate = mode === "create";
  const defaultPhaseId = activity?.phaseId || options.phases[0]?.id || "";
  const [selectedPhaseId, setSelectedPhaseId] = useState(defaultPhaseId);
  const nextOrderByPhase = useMemo(
    () => new Map(options.phases.map((phase) => [phase.id, phase.nextOrderIndex])),
    [options.phases],
  );
  const [orderIndex, setOrderIndex] = useState(
    String(activity?.orderIndex ?? nextOrderByPhase.get(defaultPhaseId) ?? 0),
  );

  useEffect(() => {
    if (state.status !== "success") return;

    router.refresh();
    const timer = window.setTimeout(closeModal, 900);

    return () => window.clearTimeout(timer);
  }, [closeModal, router, state.status]);

  function handlePhaseChange(value: string) {
    setSelectedPhaseId(value);

    if (isCreate) {
      setOrderIndex(String(nextOrderByPhase.get(value) ?? 0));
    }
  }

  return (
      <DialogContent className="flex max-h-[92vh] flex-col overflow-hidden border-slate-200 bg-white p-0 shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 bg-white p-5 pr-14 sm:p-6 sm:pr-16">
          <DialogTitle className="text-xl font-bold text-slate-950">
            {isCreate ? "Nova atividade do projeto" : "Editar atividade do projeto"}
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-slate-600">
            Atualize apenas os dados operacionais da atividade. Progresso de fase e projeto continuam sem consolidação automática.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            <input type="hidden" name="projectId" value={projectId} />
            {!isCreate ? <input type="hidden" name="activityId" value={activity?.id ?? ""} /> : null}

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
              <Label htmlFor={`activity-title-${activity?.id ?? "new"}`}>Título</Label>
              <Input
                id={`activity-title-${activity?.id ?? "new"}`}
                name="title"
                defaultValue={activity?.title ?? ""}
                className="h-10 bg-white"
                required
              />
              <FieldError errors={state.fieldErrors?.title} />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor={`activity-description-${activity?.id ?? "new"}`}>Descrição</Label>
              <Textarea
                id={`activity-description-${activity?.id ?? "new"}`}
                name="description"
                defaultValue={activity?.description ?? ""}
                className="min-h-24 bg-white leading-6"
                maxLength={1000}
              />
              <FieldError errors={state.fieldErrors?.description} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Fase</Label>
              <Select name="phaseId" value={selectedPhaseId} onValueChange={handlePhaseChange}>
                <SelectTrigger className="h-10 w-full bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {options.phases.map((phase) => (
                    <SelectItem key={phase.id} value={phase.id}>
                      {phase.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state.fieldErrors?.phaseId} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Responsável</Label>
              <Select name="ownerId" defaultValue={activity?.ownerId ?? options.users[0]?.id}>
                <SelectTrigger className="h-10 w-full bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
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
              <Label>Status</Label>
              <Select name="status" defaultValue={activity?.statusCode ?? "PLANNED"}>
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
              <Label>Prioridade</Label>
              <Select name="priority" defaultValue={activity?.priorityCode ?? "MEDIUM"}>
                <SelectTrigger className="h-10 w-full bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state.fieldErrors?.priority} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`activity-due-${activity?.id ?? "new"}`}>Prazo</Label>
              <Input
                id={`activity-due-${activity?.id ?? "new"}`}
                name="dueDate"
                type="date"
                defaultValue={activity?.dueDateInput ?? ""}
                className="h-10 bg-white"
                required
              />
              <FieldError errors={state.fieldErrors?.dueDate} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`activity-progress-${activity?.id ?? "new"}`}>Progresso</Label>
              <Input
                id={`activity-progress-${activity?.id ?? "new"}`}
                name="progress"
                type="number"
                min={0}
                max={100}
                defaultValue={activity?.progress ?? 0}
                className="h-10 bg-white"
              />
              <FieldError errors={state.fieldErrors?.progress} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`activity-order-${activity?.id ?? "new"}`}>Ordem</Label>
              <Input
                id={`activity-order-${activity?.id ?? "new"}`}
                name="orderIndex"
                type="number"
                min={0}
                value={orderIndex}
                onChange={(event) => setOrderIndex(event.target.value)}
                className="h-10 bg-white"
              />
              <FieldError errors={state.fieldErrors?.orderIndex} />
            </div>
          </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-slate-100 bg-white p-5 sm:p-6">
            <SubmitButton mode={mode} />
          </DialogFooter>
        </form>
      </DialogContent>
  );
}
