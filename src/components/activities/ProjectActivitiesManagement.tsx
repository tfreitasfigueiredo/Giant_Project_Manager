"use client";

import { useMemo, useState } from "react";
import { Ban, CalendarClock, CheckCircle2, ListChecks, PlayCircle, SlidersHorizontal } from "lucide-react";

import { ActivityCard } from "@/components/activities/ActivityCard";
import { ActivityTable } from "@/components/activities/ActivityTable";
import { ProjectActivityEditor } from "@/components/activities/ProjectActivityEditor";
import { ProjectActivityQuickUpdate } from "@/components/activities/ProjectActivityQuickUpdate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const activeFilterCount = Object.values(filters).filter((value) => value !== allValue).length;
  const hasActiveFilters = activeFilterCount > 0;

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

  function clearFilters() {
    setFilters({
      phaseId: allValue,
      status: allValue,
      priority: allValue,
      ownerId: allValue,
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold text-slate-500">{data.project.name}</p>
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
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200">
                <SlidersHorizontal className="size-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950">Filtros</p>
                <p className="text-xs font-medium text-slate-500">Refine a visão operacional sem sair da página.</p>
              </div>
              <Badge variant="secondary" className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                {activeFilterCount} {activeFilterCount === 1 ? "ativo" : "ativos"}
              </Badge>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <span className="text-sm font-semibold text-slate-600">
                {filteredActivities.length} {filteredActivities.length === 1 ? "atividade encontrada" : "atividades encontradas"}
              </span>
              {hasActiveFilters ? (
                <Button type="button" variant="outline" size="sm" onClick={clearFilters} className="border-slate-200 bg-white text-slate-700 hover:bg-slate-100">
                  Limpar filtros
                </Button>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap">
            <Select value={filters.phaseId} onValueChange={(value) => updateFilter("phaseId", value)}>
              <SelectTrigger className="h-10 w-full bg-white xl:w-56">
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
              <SelectTrigger className="h-10 w-full bg-white xl:w-48">
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
              <SelectTrigger className="h-10 w-full bg-white xl:w-48">
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
              <SelectTrigger className="h-10 w-full bg-white xl:w-64">
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
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:hidden">
        {filteredActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            action={
              <div className="flex flex-col gap-2 sm:flex-row">
                <ProjectActivityQuickUpdate projectId={data.project.id} activity={activity} />
                <ProjectActivityEditor mode="edit" projectId={data.project.id} activity={activity} options={activityEditorOptions} />
              </div>
            }
          />
        ))}
      </div>

      <ActivityTable
        activities={filteredActivities}
        renderAction={(activity) => (
          <div className="flex justify-end gap-2">
            <ProjectActivityQuickUpdate projectId={data.project.id} activity={activity} />
            <ProjectActivityEditor mode="edit" projectId={data.project.id} activity={activity} options={activityEditorOptions} />
          </div>
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
