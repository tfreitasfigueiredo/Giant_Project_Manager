import "server-only";

import type { Activity, ActivityStatus, Priority, Project, ProjectStatus } from "@/data/mock-data";
import { prisma } from "./prisma";

export type DashboardSummaryTone = "emerald" | "orange" | "red" | "slate" | "amber";

export type DashboardSummaryRow = {
  label: string;
  value: number;
  tone: DashboardSummaryTone;
  percent?: number;
};

export type DashboardRecentActivity = Activity & {
  projectName: string;
};

export type DashboardData = {
  kpiValues: {
    activeProjects: number;
    portfolioHealth: string;
    onTimePerformance: string;
    executiveIssues: number;
    criticalProjects: number;
    upcomingGoLives: number;
    highRisks: number;
  };
  projects: Project[];
  portfolioHealthRows: DashboardSummaryRow[];
  riskRows: DashboardSummaryRow[];
  issueRows: DashboardSummaryRow[];
  recentActivities: DashboardRecentActivity[];
};

const statusMap: Record<string, ProjectStatus> = {
  ON_TRACK: "on-track",
  ATTENTION: "attention",
  CRITICAL: "critical",
};

const activityStatusMap: Record<string, ActivityStatus> = {
  DONE: "done",
  IN_PROGRESS: "in-progress",
  BLOCKED: "blocked",
  PLANNED: "planned",
  CANCELLED: "blocked",
};

const priorityMap: Record<string, Priority> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  CRITICAL: "Alta",
};

const monthLabels = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const activeProjectStatuses = ["PLANNED", "ON_TRACK", "ATTENTION", "CRITICAL", "PAUSED"];
const openIssueStatuses = ["OPEN", "IN_PROGRESS", "WAITING_DECISION"];
const openRiskStatuses = ["OPEN", "MITIGATING", "ACCEPTED"];

function mapProjectStatus(status: string): ProjectStatus {
  return statusMap[status] ?? "attention";
}

function mapActivityStatus(status: string): ActivityStatus {
  return activityStatusMap[status] ?? "planned";
}

function mapPriority(priority: string): Priority {
  return priorityMap[priority] ?? "Média";
}

function formatDate(date: Date | null): string {
  if (!date) return "Sem data";

  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${monthLabels[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function formatShortDate(date: Date | null): string {
  if (!date) return "Sem prazo";

  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${monthLabels[date.getUTCMonth()]}`;
}

function getClientLabel(project: { name: string; type: string; company: { name: string } }): string {
  if (project.name.startsWith("BOGE")) return "BOGE";
  if (project.type === "CONTROL_TOWER") return "Grupo Mirassol";
  if (project.type === "DATA_PRODUCT") return "Comercial";

  return project.company.name;
}

function getUnitLabel(project: { type: string; unit: { name: string } | null }): string {
  if (project.type === "IMPLEMENTATION") return "Operações";
  if (project.type === "CONTROL_TOWER") return "Control Tower";
  if (project.type === "DATA_PRODUCT") return "Planejamento";

  return project.unit?.name ?? "Matriz";
}

function percent(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

function portfolioHealthLabel(criticalProjects: number, attentionProjects: number): string {
  if (criticalProjects > 0) return "Crítica";
  if (attentionProjects > 0) return "Atenção";
  return "Boa";
}

export async function getDashboardData(): Promise<DashboardData> {
  const allProjects = await prisma.project.findMany({
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

  const projects = allProjects.filter((project) => activeProjectStatuses.includes(project.status));

  const recentActivities = await prisma.projectActivity.findMany({
    orderBy: [{ updatedAt: "desc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    take: 6,
    include: {
      project: { select: { name: true, slug: true } },
      phase: { select: { name: true } },
      owner: { select: { name: true } },
    },
  });

  const dashboardProjects = projects.map((project) => {
    const completedActivities = project.activities.filter((activity) => activity.status === "DONE").length;
    const activeHighRisks = project.risks.filter(
      (risk) => openRiskStatuses.includes(risk.status) && (risk.severity === "HIGH" || risk.severity === "CRITICAL"),
    ).length;
    const openExecutiveIssues = project.issues.filter(
      (issue) => openIssueStatuses.includes(issue.status) && (issue.isCritical || issue.priority === "CRITICAL"),
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
      executiveSummary: project.executiveSummary ?? "Resumo executivo em atualização.",
      nextSteps: project.nextSteps.map((step) => step.title),
      decisionsPending: project.decisions.filter((decision) => decision.status === "PENDING").length,
      executiveIssues: openExecutiveIssues,
      highRisks: activeHighRisks,
      completedActivities,
      totalActivities: project.activities.length,
    } satisfies Project;
  });

  const activeProjects = dashboardProjects.length;
  const attentionProjects = projects.filter((project) => project.status === "ATTENTION").length;
  const criticalProjects = projects.filter((project) => project.status === "CRITICAL").length;
  const onTrackProjects = projects.filter((project) => project.status === "ON_TRACK").length;
  const plannedProjects = projects.filter((project) => project.status === "PLANNED").length;
  const executiveIssues = projects.reduce((total, project) => {
    return total + project.issues.filter((issue) => openIssueStatuses.includes(issue.status) && (issue.isCritical || issue.priority === "CRITICAL")).length;
  }, 0);
  const highRisks = projects.reduce((total, project) => {
    return total + project.risks.filter((risk) => openRiskStatuses.includes(risk.status) && (risk.severity === "HIGH" || risk.severity === "CRITICAL")).length;
  }, 0);
  const averageProgress = activeProjects === 0 ? 0 : Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / activeProjects);
  const now = new Date();
  const nextThirtyDays = new Date(now);
  nextThirtyDays.setUTCDate(now.getUTCDate() + 30);
  const upcomingGoLives = projects.filter((project) => project.targetGoLive && project.targetGoLive >= now && project.targetGoLive <= nextThirtyDays).length;

  return {
    kpiValues: {
      activeProjects,
      portfolioHealth: portfolioHealthLabel(criticalProjects, attentionProjects),
      onTimePerformance: `${averageProgress}%`,
      executiveIssues,
      criticalProjects,
      upcomingGoLives,
      highRisks,
    },
    projects: dashboardProjects,
    portfolioHealthRows: [
      { label: "No prazo", value: onTrackProjects, tone: "emerald", percent: percent(onTrackProjects, activeProjects) },
      { label: "Atenção", value: attentionProjects, tone: "orange", percent: percent(attentionProjects, activeProjects) },
      { label: "Crítico", value: criticalProjects, tone: "red", percent: percent(criticalProjects, activeProjects) },
      { label: "Planejado", value: plannedProjects, tone: "slate", percent: percent(plannedProjects, activeProjects) },
    ],
    riskRows: [
      { label: "Alto", value: highRisks, tone: "red" },
      { label: "Médio", value: projects.reduce((total, project) => total + project.risks.filter((risk) => openRiskStatuses.includes(risk.status) && risk.severity === "MEDIUM").length, 0), tone: "orange" },
      { label: "Baixo", value: projects.reduce((total, project) => total + project.risks.filter((risk) => openRiskStatuses.includes(risk.status) && risk.severity === "LOW").length, 0), tone: "emerald" },
    ],
    issueRows: [
      { label: "Críticas abertas", value: executiveIssues, tone: "red" },
      { label: "Altas abertas", value: projects.reduce((total, project) => total + project.issues.filter((issue) => openIssueStatuses.includes(issue.status) && issue.priority === "HIGH").length, 0), tone: "orange" },
      { label: "Médias abertas", value: projects.reduce((total, project) => total + project.issues.filter((issue) => openIssueStatuses.includes(issue.status) && issue.priority === "MEDIUM").length, 0), tone: "amber" },
      { label: "Baixas abertas", value: projects.reduce((total, project) => total + project.issues.filter((issue) => openIssueStatuses.includes(issue.status) && issue.priority === "LOW").length, 0), tone: "emerald" },
    ],
    recentActivities: recentActivities.map((activity) => ({
      id: activity.id,
      projectId: activity.project.slug,
      projectName: activity.project.name,
      title: activity.title,
      phase: activity.phase?.name ?? "Sem fase",
      owner: activity.owner?.name ?? "PMO",
      dueDate: formatShortDate(activity.dueDate),
      status: mapActivityStatus(activity.status),
      progress: activity.progress,
      priority: mapPriority(activity.priority),
    })),
  };
}