"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Gauge, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  quickUpdateProjectActivity,
  type ProjectActivityActionState,
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
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Activity, ActivityStatusCode } from "@/types/project-activities";

type ProjectActivityQuickUpdateProps = {
  projectId: string;
  activity: Activity;
};

const initialState: ProjectActivityActionState = { status: "idle" };

const statusOptions: Array<{ value: ActivityStatusCode; label: string }> = [
  { value: "PLANNED", label: "Planejada" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "BLOCKED", label: "Bloqueada" },
  { value: "DONE", label: "Concluída" },
  { value: "CANCELLED", label: "Cancelada" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="bg-slate-950 text-white hover:bg-slate-800">
      <Save data-icon="inline-start" />
      {pending ? "Salvando..." : "Salvar atualização"}
    </Button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;

  return <p className="text-xs font-medium text-red-600">{errors[0]}</p>;
}

export function ProjectActivityQuickUpdate({ projectId, activity }: ProjectActivityQuickUpdateProps) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setFormKey((current) => current + 1);
    }

    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleOpenChange(true)}
        className="border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
      >
        <Gauge data-icon="inline-start" />
        Atualizar
      </Button>

      <ProjectActivityQuickUpdateContent
        key={formKey}
        projectId={projectId}
        activity={activity}
        closeModal={closeModal}
      />
    </Dialog>
  );
}

function ProjectActivityQuickUpdateContent({
  projectId,
  activity,
  closeModal,
}: ProjectActivityQuickUpdateProps & { closeModal: () => void }) {
  const router = useRouter();
  const [state, formAction] = useActionState(quickUpdateProjectActivity, initialState);
  const [status, setStatus] = useState<ActivityStatusCode>(activity.statusCode);
  const [progress, setProgress] = useState(String(activity.progress));
  const progressNumber = Number(progress);
  const safeProgress = Number.isFinite(progressNumber) ? Math.min(Math.max(progressNumber, 0), 100) : 0;

  function handleStatusChange(nextStatus: ActivityStatusCode) {
    const wasDone = status === "DONE";
    setStatus(nextStatus);

    if (nextStatus === "DONE") {
      setProgress("100");
      return;
    }

    if (wasDone && progress === "100") {
      setProgress("90");
    }
  }

  useEffect(() => {
    if (state.status !== "success") return;

    router.refresh();
    const timer = window.setTimeout(closeModal, 850);

    return () => window.clearTimeout(timer);
  }, [closeModal, router, state.status]);

  return (
    <DialogContent className="border-slate-200 bg-white p-0 shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:max-w-md">
      <DialogHeader className="border-b border-slate-100 bg-slate-50/80 p-5">
        <DialogTitle className="text-lg font-bold text-slate-950">Atualização rápida</DialogTitle>
        <DialogDescription className="text-sm leading-6 text-slate-600">
          Ajuste status e progresso da atividade sem abrir o editor completo.
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} className="flex flex-col gap-5 p-5">
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="activityId" value={activity.id} />

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Atividade</p>
          <p className="mt-1 text-sm font-bold text-slate-950">{activity.title}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">{activity.phase}</p>
        </div>

        {state.message ? (
          <div
            className={
              state.status === "success"
                ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            }
          >
            {state.message}
          </div>
        ) : null}

        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <Select name="status" value={status} onValueChange={(value) => handleStatusChange(value as ActivityStatusCode)}>
              <SelectTrigger className="h-10 w-full bg-white">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={state.fieldErrors?.status} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor={`quick-progress-${activity.id}`}>Progresso</Label>
              <span className="text-sm font-bold text-slate-950">{safeProgress}%</span>
            </div>
            <Input
              id={`quick-progress-${activity.id}`}
              name="progress"
              type="number"
              min={0}
              max={100}
              value={progress}
              onChange={(event) => setProgress(event.target.value)}
              className="h-10 bg-white"
            />
            <Progress value={safeProgress} />
            <FieldError errors={state.fieldErrors?.progress} />
          </div>
        </div>

        <DialogFooter className="-mx-5 -mb-5 border-t border-slate-100 bg-slate-50/80 p-5">
          <SubmitButton />
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
