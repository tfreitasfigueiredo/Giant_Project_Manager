"use client";

import { useMemo, useState } from "react";
import { Ban, CalendarClock, CheckCircle2, ListChecks, PlayCircle } from "lucide-react";

import { ActivityCard } from "@/components/activities/ActivityCard";
import { ActivityTable } from "@/components/activities/ActivityTable";
import { ProjectActivityEditor } from "@/components/activities/ProjectActivityEditor";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Activity, ProjectActivitiesManagementData } from "@/types/project-activities";

type FilterState = {
  phaseId: string;
  status: string;
  priority: string;
  ownerId: string;
};

const allValue = "all";

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isOverdue(activity: Activity) {
  if (!activity.dueDateInput || activity.status === "done" || activity.status === "cancelled") return false;

  const today = getLocalDateKey();
  return activity.dueDateInput < today;
}

export function ProjectActivitiesManagement({ data }: { data: ProjectActivitiesManagementData }) {
  const [filters, setFilters] = useState<FilterState>({
    phaseId: allValue,
    status: allValue,
    priority: allValue,
    ownerId: allValue,
  });

  const filteredActivities = useMemo(
    () =>
      data.activities.filter((activity) => {
        if (filters.phaseId !== allValue && activity.phaseId !== filters.phaseId) return false;
        if (filters.status !== allValue && activity.statusCode !== filters.status) return false;
        if (filters.priority !== allValue && activity.priorityCode !== filters.priority) return false;
        if (filters.ownerId !== allValue && activity.ownerId !== filters.ownerId) return false;
        return true;
      }),
    [data.activities, filters],
  );

  const summaryCards = [
    {
      title: "Total de atividades",
      value: data.activities.length,
      legend: "Itens operacionais do projeto",
      icon: ListChecks,
      className: "bg-blue-50 text-blue-700 ring-blue-100",
    },
    {
      title: "Em andamento",
      value: data.activities.filter((activity) => activity.status === "in-progress").length,
      legend: "Execução ativa",
      icon: PlayCircle,
      className: "bg-sky-50 text-sky-700 ring-sky-100",
    },
    {
      title: "Bloqueadas",
      value: data.activities.filter((activity) => activity.status === "blocked").length,
      legend: "Precisam de destrave",
      icon: Ban,
      className: "bg-red-50 text-red-700 ring-red-100",
    },
    {
      title: "Vencidas",
      value: data.activities.filter(isOverdue).length,
      legend: "Prazo anterior a hoje",
      icon: CalendarClock,
      className: "bg-orange-50 text-orange-700 ring-orange-100",
    },
    {
      title: "Concluídas",
      value: data.activities.filter((activity) => activity.status === "done").length,
      legend: "Entregas fechadas",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
  ];

  const activityEditorOptions = data.options;

  function updateFilter(key: keyof FilterState, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Plano operacional</h2>
          <p className="text-sm text-slate-500">Atividades por fase, responsável, prazo, prioridade e progresso.</p>
        </div>
        <ProjectActivityEditor mode="create" projectId={data.project.id} options={activityEditorOptions} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <CardContent className="flex min-h-28 items-center gap-4 p-5">
                <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full ring-8", item.className)}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.title}</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{item.legend}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
          <Select value={filters.phaseId} onValueChange={(value) => updateFilter("phaseId", value)}>
            <SelectTrigger className="h-10 bg-white">
              <SelectValue placeholder="Fase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={allValue}>Todas as fases</SelectItem>
              {data.options.phases.map((phase) => (
                <SelectItem key={phase.id} value={phase.id}>
                  {phase.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
            <SelectTrigger className="h-10 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={allValue}>Todos os status</SelectItem>
              <SelectItem value="PLANNED">Planejada</SelectItem>
              <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
              <SelectItem value="BLOCKED">Bloqueada</SelectItem>
              <SelectItem value="DONE">Concluída</SelectItem>
              <SelectItem value="CANCELLED">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.priority} onValueChange={(value) => updateFilter("priority", value)}>
            <SelectTrigger className="h-10 bg-white">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={allValue}>Todas as prioridades</SelectItem>
              <SelectItem value="CRITICAL">Crítica</SelectItem>
              <SelectItem value="HIGH">Alta</SelectItem>
              <SelectItem value="MEDIUM">Média</SelectItem>
              <SelectItem value="LOW">Baixa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.ownerId} onValueChange={(value) => updateFilter("ownerId", value)}>
            <SelectTrigger className="h-10 bg-white">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={allValue}>Todos os responsáveis</SelectItem>
              {data.options.users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:hidden">
        {filteredActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            action={<ProjectActivityEditor mode="edit" projectId={data.project.id} activity={activity} options={activityEditorOptions} />}
          />
        ))}
      </div>

      <ActivityTable
        activities={filteredActivities}
        renderAction={(activity) => (
          <ProjectActivityEditor mode="edit" projectId={data.project.id} activity={activity} options={activityEditorOptions} />
        )}
      />

      {!filteredActivities.length ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-medium text-slate-500">
          Nenhuma atividade encontrada para os filtros selecionados.
        </div>
      ) : null}
    </div>
  );
}
