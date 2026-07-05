import "server-only";

import type { Project, ProjectStatus } from "@/data/mock-data";
import { prisma } from "./prisma";

const statusMap: Record<string, ProjectStatus> = {
  ON_TRACK: "on-track",
  ATTENTION: "attention",
  CRITICAL: "critical",
};

const monthLabels = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function mapProjectStatus(status: string): ProjectStatus {
  return statusMap[status] ?? "attention";
}

function formatDate(date: Date | null): string {
  if (!date) return "Sem data";

  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${monthLabels[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function getClientLabel(project: { name: string; type: string; company: { name: string } }): string {
  if (project.name.startsWith("BOGE")) return "BOGE";
  if (project.type === "CONTROL_TOWER") return "Grupo Mirassol";
  if (project.type === "DATA_PRODUCT") return "Comercial";

  return project.company.name;
}

function getUnitLabel(project: { type: string; unit: { name: string } | null }): string {
  if (project.type === "IMPLEMENTATION") return "Opera\u00e7\u00f5es";
  if (project.type === "CONTROL_TOWER") return "Control Tower";
  if (project.type === "DATA_PRODUCT") return "Planejamento";

  return project.unit?.name ?? "Matriz";
}

export async function getProjectsForList(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      company: { select: { name: true } },
      unit: { select: { name: true } },
      sponsor: { select: { name: true } },
      owner: { select: { name: true } },
      activities: { select: { status: true } },
      risks: { select: { severity: true, status: true } },
      issues: { select: { isCritical: true, priority: true, status: true } },
      decisions: { select: { status: true } },
      nextSteps: { orderBy: { orderIndex: "asc" }, select: { title: true } },
    },
  });

  return projects.map((project) => {
    const completedActivities = project.activities.filter((activity) => activity.status === "DONE").length;
    const activeHighRisks = project.risks.filter(
      (risk) => risk.status !== "CLOSED" && (risk.severity === "HIGH" || risk.severity === "CRITICAL"),
    ).length;
    const openExecutiveIssues = project.issues.filter(
      (issue) => issue.status !== "RESOLVED" && issue.status !== "CANCELLED" && (issue.isCritical || issue.priority === "CRITICAL"),
    ).length;

    return {
      id: project.slug,
      name: project.name,
      client: getClientLabel(project),
      unit: getUnitLabel(project),
      sponsor: project.sponsor?.name ?? "Sponsor",
      owner: project.owner?.name ?? "PMO",
      status: mapProjectStatus(project.status),
      phase: project.phaseName ?? "Planejamento",
      goLive: formatDate(project.targetGoLive),
      progress: project.progress,
      plannedHours: Number(project.plannedHours),
      actualHours: Number(project.actualHours),
      executiveSummary: project.executiveSummary ?? "Resumo executivo em atualiza\u00e7\u00e3o.",
      nextSteps: project.nextSteps.map((step) => step.title),
      decisionsPending: project.decisions.filter((decision) => decision.status === "PENDING").length,
      executiveIssues: openExecutiveIssues,
      highRisks: activeHighRisks,
      completedActivities,
      totalActivities: project.activities.length,
    } satisfies Project;
  });
}
