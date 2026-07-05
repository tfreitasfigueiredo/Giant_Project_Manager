import "server-only";

import type {
  Activity,
  ActivityStatus,
  Issue,
  Priority,
  Project,
  ProjectStatus,
  Risk,
  RiskSeverity,
} from "@/data/mock-data";
import { prisma } from "./prisma";

export type ProjectPhaseSummary = {
  id: string;
  name: string;
  status: string;
  progress: number;
  orderIndex: number;
};

export type ProjectStatusSnapshotSummary = {
  status: ProjectStatus;
  progress: number;
  healthLabel: string;
  phaseName: string;
  goLiveDate: string;
  highRisksCount: number;
  criticalIssuesCount: number;
  decisionsPendingCount: number;
  summary: string;
  snapshotAt: string;
};

export type ProjectStatusReportSummary = {
  title: string;
  period: string;
  version: number;
};

export type ProjectDetail = Project & {
  phases: ProjectPhaseSummary[];
  activities: Activity[];
  risks: Risk[];
  issues: Issue[];
  statusSnapshot: ProjectStatusSnapshotSummary | null;
  statusReport: ProjectStatusReportSummary | null;
};

export type ProjectRisksData = {
  project: Pick<Project, "id" | "name">;
  risks: Risk[];
};

export type ProjectIssuesData = {
  project: Pick<Project, "id" | "name">;
  issues: Issue[];
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

const riskSeverityMap: Record<string, RiskSeverity> = {
  LOW: "Baixo",
  MEDIUM: "Médio",
  HIGH: "Alto",
  CRITICAL: "Alto",
};

const issueOriginMap: Record<string, string> = {
  CLIENT: "Cliente",
  INTERNAL: "Interna",
  PMO: "PMO",
  OPERATIONS: "Operações",
  TECHNOLOGY: "Tecnologia",
  COMMERCIAL: "Comercial",
  EXECUTIVE: "Executiva",
};

const phaseStatusMap: Record<string, string> = {
  NOT_STARTED: "Não iniciada",
  IN_PROGRESS: "Em andamento",
  BLOCKED: "Bloqueada",
  DONE: "Concluída",
  CANCELLED: "Cancelada",
};

const projectAliases: Record<string, string> = {
  boge: "boge-implantacao-operacional",
  "torre-de-controle": "torre-controle-demandas",
  "consulta-volumetria": "consulta-volumetria",
};

const monthLabels = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function mapProjectStatus(status: string): ProjectStatus {
  return statusMap[status] ?? "attention";
}

function mapActivityStatus(status: string): ActivityStatus {
  return activityStatusMap[status] ?? "planned";
}

function mapPriority(priority: string): Priority {
  return priorityMap[priority] ?? "Média";
}

function mapRiskSeverity(severity: string): RiskSeverity {
  return riskSeverityMap[severity] ?? "Médio";
}

function mapPhaseStatus(status: string): string {
  return phaseStatusMap[status] ?? "Planejada";
}

function mapIssueOrigin(origin: string): string {
  return issueOriginMap[origin] ?? "Interna";
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

function resolveProjectLookup(projectId: string): string {
  return projectAliases[projectId] ?? projectId;
}

function getProjectLookupFilters(projectId: string): Array<{ slug: string } | { id: string }> {
  const resolvedProjectId = resolveProjectLookup(projectId);
  const filters: Array<{ slug: string } | { id: string }> = [{ slug: resolvedProjectId }];

  if (uuidPattern.test(projectId)) {
    filters.push({ id: projectId });
  }

  return filters;
}

function mapRiskToVisual(
  risk: {
    id: string;
    title: string;
    severity: string;
    owner: { name: string } | null;
    goLiveImpact: string | null;
    mitigation: string | null;
  },
  projectId: string,
): Risk {
  return {
    id: risk.id,
    projectId,
    title: risk.title,
    severity: mapRiskSeverity(risk.severity),
    owner: risk.owner?.name ?? "PMO",
    goLiveImpact: risk.goLiveImpact ?? "Sem impacto no go live registrado.",
    mitigation: risk.mitigation ?? "Plano de mitigação em definição.",
  };
}

function mapIssueToVisual(
  issue: {
    id: string;
    title: string;
    origin: string;
    owner: { name: string } | null;
    dueDate: Date | null;
    impact: string | null;
    nextAction: string | null;
    isCritical: boolean;
    priority: string;
  },
  projectId: string,
): Issue {
  return {
    id: issue.id,
    projectId,
    title: issue.title,
    source: mapIssueOrigin(issue.origin),
    owner: issue.owner?.name ?? "PMO",
    dueDate: formatShortDate(issue.dueDate),
    impact: issue.impact ?? "Impacto em avaliação.",
    nextAction: issue.nextAction ?? "Próxima ação em definição.",
    critical: issue.isCritical || issue.priority === "CRITICAL",
  };
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
      executiveSummary: project.executiveSummary ?? "Resumo executivo em atualização.",
      nextSteps: project.nextSteps.map((step) => step.title),
      decisionsPending: project.decisions.filter((decision) => decision.status === "PENDING").length,
      executiveIssues: openExecutiveIssues,
      highRisks: activeHighRisks,
      completedActivities,
      totalActivities: project.activities.length,
    } satisfies Project;
  });
}

export async function getProjectDetail(projectId: string): Promise<ProjectDetail | null> {
  const resolvedProjectId = resolveProjectLookup(projectId);
  const filters: Array<{ slug: string } | { id: string }> = [{ slug: resolvedProjectId }];

  if (uuidPattern.test(projectId)) {
    filters.push({ id: projectId });
  }

  const project = await prisma.project.findFirst({
    where: { OR: filters },
    include: {
      company: { select: { name: true } },
      unit: { select: { name: true } },
      sponsor: { select: { name: true } },
      owner: { select: { name: true } },
      phases: { orderBy: { orderIndex: "asc" } },
      activities: {
        orderBy: [{ orderIndex: "asc" }, { dueDate: "asc" }, { createdAt: "asc" }],
        include: {
          phase: { select: { name: true } },
          owner: { select: { name: true } },
        },
      },
      risks: {
        orderBy: { createdAt: "asc" },
        include: { owner: { select: { name: true } } },
      },
      issues: {
        orderBy: { createdAt: "asc" },
        include: { owner: { select: { name: true } } },
      },
      decisions: { select: { status: true } },
      nextSteps: { orderBy: { orderIndex: "asc" }, select: { title: true } },
      statusSnapshots: { orderBy: { snapshotAt: "desc" }, take: 1 },
      statusReports: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { title: true, periodStart: true, periodEnd: true, version: true },
      },
    },
  });

  if (!project) return null;

  const completedActivities = project.activities.filter((activity) => activity.status === "DONE").length;
  const activeHighRisks = project.risks.filter(
    (risk) => risk.status !== "CLOSED" && (risk.severity === "HIGH" || risk.severity === "CRITICAL"),
  ).length;
  const openExecutiveIssues = project.issues.filter(
    (issue) => issue.status !== "RESOLVED" && issue.status !== "CANCELLED" && (issue.isCritical || issue.priority === "CRITICAL"),
  ).length;

  const baseProject = {
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

  const latestSnapshot = project.statusSnapshots[0] ?? null;
  const latestReport = project.statusReports[0] ?? null;

  return {
    ...baseProject,
    phases: project.phases.map((phase) => ({
      id: phase.id,
      name: phase.name,
      status: mapPhaseStatus(phase.status),
      progress: phase.progress,
      orderIndex: phase.orderIndex,
    })),
    activities: project.activities.map((activity) => ({
      id: activity.id,
      projectId: project.slug,
      title: activity.title,
      phase: activity.phase?.name ?? project.phaseName ?? "Sem fase",
      owner: activity.owner?.name ?? "PMO",
      dueDate: formatShortDate(activity.dueDate),
      status: mapActivityStatus(activity.status),
      progress: activity.progress,
      priority: mapPriority(activity.priority),
    })),
    risks: project.risks.map((risk) => ({
      id: risk.id,
      projectId: project.slug,
      title: risk.title,
      severity: mapRiskSeverity(risk.severity),
      owner: risk.owner?.name ?? "PMO",
      goLiveImpact: risk.goLiveImpact ?? "Sem impacto no go live registrado.",
      mitigation: risk.mitigation ?? "Plano de mitigação em definição.",
    })),
    issues: project.issues.map((issue) => ({
      id: issue.id,
      projectId: project.slug,
      title: issue.title,
      source: mapIssueOrigin(issue.origin),
      owner: issue.owner?.name ?? "PMO",
      dueDate: formatShortDate(issue.dueDate),
      impact: issue.impact ?? "Impacto em avaliação.",
      nextAction: issue.nextAction ?? "Próxima ação em definição.",
      critical: issue.isCritical || issue.priority === "CRITICAL",
    })),
    statusSnapshot: latestSnapshot
      ? {
          status: mapProjectStatus(latestSnapshot.status),
          progress: latestSnapshot.progress,
          healthLabel: latestSnapshot.healthLabel ?? "Saúde em acompanhamento",
          phaseName: latestSnapshot.phaseName ?? project.phaseName ?? "Planejamento",
          goLiveDate: formatDate(latestSnapshot.goLiveDate),
          highRisksCount: latestSnapshot.highRisksCount,
          criticalIssuesCount: latestSnapshot.criticalIssuesCount,
          decisionsPendingCount: latestSnapshot.decisionsPendingCount,
          summary: latestSnapshot.summary ?? baseProject.executiveSummary,
          snapshotAt: formatDate(latestSnapshot.snapshotAt),
        }
      : null,
    statusReport: latestReport
      ? {
          title: latestReport.title,
          period: `${formatDate(latestReport.periodStart)} - ${formatDate(latestReport.periodEnd)}`,
          version: latestReport.version,
        }
      : null,
  };
}
export async function getProjectRisks(projectId: string): Promise<ProjectRisksData | null> {
  const project = await prisma.project.findFirst({
    where: { OR: getProjectLookupFilters(projectId) },
    select: {
      name: true,
      slug: true,
      risks: {
        orderBy: [{ severity: "desc" }, { createdAt: "asc" }],
        include: { owner: { select: { name: true } } },
      },
    },
  });

  if (!project) return null;

  return {
    project: { id: project.slug, name: project.name },
    risks: project.risks.map((risk) => mapRiskToVisual(risk, project.slug)),
  };
}

export async function getProjectIssues(projectId: string): Promise<ProjectIssuesData | null> {
  const project = await prisma.project.findFirst({
    where: { OR: getProjectLookupFilters(projectId) },
    select: {
      name: true,
      slug: true,
      issues: {
        orderBy: [{ isCritical: "desc" }, { dueDate: "asc" }, { createdAt: "asc" }],
        include: { owner: { select: { name: true } } },
      },
    },
  });

  if (!project) return null;

  return {
    project: { id: project.slug, name: project.name },
    issues: project.issues.map((issue) => mapIssueToVisual(issue, project.slug)),
  };
}