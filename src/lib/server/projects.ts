import "server-only";

import type { Activity, ActivityPriority, ActivityStatus, ProjectActivitiesManagementData } from "@/types/project-activities";
import type {
  Issue,
  Project,
  ProjectStatus,
  Risk,
  RiskSeverity,
} from "@/data/mock-data";
import { prisma } from "./prisma";

export type ProjectPhaseSummary = {
  id: string;
  name: string;
  description: string;
  status: string;
  statusCode: string;
  progress: number;
  orderIndex: number;
  startDate: string;
  dueDate: string;
  completedAt: string;
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
export type ProjectActivitySummary = {
  completed: number;
  inProgress: number;
  blocked: number;
  planned: number;
  total: number;
};

export type ProjectStatusReportData = {
  project: Project;
  title: string;
  period: string;
  version: number;
  publishedAt: string;
  executiveNarrative: string;
  highlights: string[];
  attentionPoints: string[];
  nextSteps: string[];
  risks: Risk[];
  issues: Issue[];
  activitySummary: ProjectActivitySummary;
  snapshot: ProjectStatusSnapshotSummary | null;
  sanitizedHtml: string | null;
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
  CANCELLED: "cancelled",
};

const priorityMap: Record<string, ActivityPriority> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  CRITICAL: "Crítica",
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

function mapPriority(priority: string): ActivityPriority {
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

function mapActivityToVisual(
  activity: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    completedAt: Date | null;
    progress: number;
    orderIndex: number;
    phaseId: string | null;
    ownerId: string | null;
    phase?: { name: string } | null;
    owner?: { name: string } | null;
  },
  projectSlug: string,
): Activity {
  return {
    id: activity.id,
    projectId: projectSlug,
    title: activity.title,
    description: activity.description ?? "",
    phase: activity.phase?.name ?? "Sem fase",
    phaseId: activity.phaseId ?? "",
    owner: activity.owner?.name ?? "Sem responsável",
    ownerId: activity.ownerId ?? "",
    dueDate: formatShortDate(activity.dueDate),
    dueDateInput: formatDateInput(activity.dueDate),
    completedAt: formatDateInput(activity.completedAt),
    status: mapActivityStatus(activity.status),
    statusCode: activity.status as Activity["statusCode"],
    progress: activity.progress,
    priority: mapPriority(activity.priority),
    priorityCode: activity.priority as Activity["priorityCode"],
    orderIndex: activity.orderIndex,
  };
}

function sanitizeStatusReportHtml(html: string | null): string | null {
  if (!html) return null;

  const allowedTags = new Set(["section", "h1", "h2", "h3", "p", "ul", "ol", "li", "strong", "em", "b", "i", "br"]);

  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?([a-zA-Z0-9-]+)(?:\s[^>]*)?>/g, (tag, tagName: string) => {
      const normalizedTag = tagName.toLowerCase();
      if (!allowedTags.has(normalizedTag)) return "";

      const safeTag = normalizedTag === "h1" ? "h2" : normalizedTag;
      return tag.startsWith("</") ? `</${safeTag}>` : `<${safeTag}>`;
    });
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
      description: phase.description ?? "",
      status: mapPhaseStatus(phase.status),
      statusCode: phase.status,
      progress: phase.progress,
      orderIndex: phase.orderIndex,
      startDate: formatDateInput(phase.startDate),
      dueDate: formatDateInput(phase.dueDate),
      completedAt: formatDateInput(phase.completedAt),
    })),
    activities: project.activities.map((activity) => mapActivityToVisual(activity, project.slug)),
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

export async function getProjectActivitiesManagement(projectId: string): Promise<ProjectActivitiesManagementData | null> {
  const project = await prisma.project.findFirst({
    where: { OR: getProjectLookupFilters(projectId) },
    select: {
      id: true,
      tenantId: true,
      name: true,
      slug: true,
      tenant: {
        select: {
          users: {
            where: { status: "ACTIVE" },
            orderBy: { name: "asc" },
            select: { id: true, name: true },
          },
        },
      },
      phases: {
        orderBy: { orderIndex: "asc" },
        select: { id: true, name: true, orderIndex: true },
      },
      activities: {
        orderBy: [{ orderIndex: "asc" }, { dueDate: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          completedAt: true,
          progress: true,
          orderIndex: true,
          phaseId: true,
          ownerId: true,
          phase: { select: { name: true, orderIndex: true } },
          owner: { select: { name: true } },
        },
      },
    },
  });

  if (!project) return null;

  const sortedActivities = [...project.activities].sort((left, right) => {
    const phaseDiff = (left.phase?.orderIndex ?? Number.MAX_SAFE_INTEGER) - (right.phase?.orderIndex ?? Number.MAX_SAFE_INTEGER);
    if (phaseDiff !== 0) return phaseDiff;

    const orderDiff = left.orderIndex - right.orderIndex;
    if (orderDiff !== 0) return orderDiff;

    return (left.dueDate?.getTime() ?? 0) - (right.dueDate?.getTime() ?? 0);
  });

  const nextOrderByPhase = new Map(project.phases.map((phase) => [phase.id, 0]));
  for (const activity of project.activities) {
    if (!activity.phaseId) continue;
    const currentNextOrder = nextOrderByPhase.get(activity.phaseId) ?? 0;
    nextOrderByPhase.set(activity.phaseId, Math.max(currentNextOrder, activity.orderIndex + 1));
  }

  return {
    project: {
      id: project.slug,
      name: project.name,
    },
    activities: sortedActivities.map((activity) => mapActivityToVisual(activity, project.slug)),
    options: {
      phases: project.phases.map((phase) => ({
        id: phase.id,
        name: phase.name,
        orderIndex: phase.orderIndex,
        nextOrderIndex: nextOrderByPhase.get(phase.id) ?? 0,
      })),
      users: project.tenant.users,
    },
  };
}

export async function getProjectStatusReport(projectId: string): Promise<ProjectStatusReportData | null> {
  const project = await prisma.project.findFirst({
    where: { OR: getProjectLookupFilters(projectId) },
    include: {
      company: { select: { name: true } },
      unit: { select: { name: true } },
      sponsor: { select: { name: true } },
      owner: { select: { name: true } },
      activities: {
        orderBy: [{ orderIndex: "asc" }, { dueDate: "asc" }, { createdAt: "asc" }],
        select: { title: true, status: true, progress: true },
      },
      risks: {
        orderBy: [{ severity: "desc" }, { createdAt: "asc" }],
        include: { owner: { select: { name: true } } },
      },
      issues: {
        orderBy: [{ isCritical: "desc" }, { dueDate: "asc" }, { createdAt: "asc" }],
        include: { owner: { select: { name: true } } },
      },
      decisions: { select: { status: true } },
      nextSteps: { orderBy: { orderIndex: "asc" }, select: { title: true } },
      statusSnapshots: { orderBy: { snapshotAt: "desc" }, take: 1 },
      statusReports: {
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 1,
        select: {
          title: true,
          periodStart: true,
          periodEnd: true,
          version: true,
          htmlContent: true,
          publishedAt: true,
          createdAt: true,
        },
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
  const inProgressActivities = project.activities.filter((activity) => activity.status === "IN_PROGRESS").length;
  const blockedActivities = project.activities.filter((activity) => activity.status === "BLOCKED").length;
  const plannedActivities = project.activities.filter((activity) => activity.status === "PLANNED").length;
  const latestSnapshot = project.statusSnapshots[0] ?? null;
  const latestReport = project.statusReports[0] ?? null;
  const nextSteps = project.nextSteps.map((step) => step.title);
  const risks = project.risks.map((risk) => mapRiskToVisual(risk, project.slug));
  const issues = project.issues.map((issue) => mapIssueToVisual(issue, project.slug));
  const displayRisks = risks.slice(0, 4);
  const displayIssues = issues.slice(0, 4);
  const completedTitles = project.activities
    .filter((activity) => activity.status === "DONE")
    .map((activity) => activity.title)
    .slice(0, 3);
  const attentionPoints = [
    ...risks.filter((risk) => risk.severity === "Alto").map((risk) => risk.title),
    ...issues.filter((issue) => issue.critical).map((issue) => issue.title),
  ].slice(0, 4);

  const baseProject = {
    id: project.slug,
    name: project.name,
    client: getClientLabel(project),
    unit: getUnitLabel(project),
    sponsor: project.sponsor?.name ?? "Sponsor",
    owner: project.owner?.name ?? "PMO",
    status: mapProjectStatus(latestSnapshot?.status ?? project.status),
    phase: latestSnapshot?.phaseName ?? project.phaseName ?? "Planejamento",
    goLive: formatDate(latestSnapshot?.goLiveDate ?? project.targetGoLive),
    progress: latestSnapshot?.progress ?? project.progress,
    plannedHours: Number(project.plannedHours),
    actualHours: Number(project.actualHours),
    executiveSummary: latestSnapshot?.summary ?? project.executiveSummary ?? "Resumo executivo em atualização.",
    nextSteps,
    decisionsPending: latestSnapshot?.decisionsPendingCount ?? project.decisions.filter((decision) => decision.status === "PENDING").length,
    executiveIssues: latestSnapshot?.criticalIssuesCount ?? openExecutiveIssues,
    highRisks: latestSnapshot?.highRisksCount ?? activeHighRisks,
    completedActivities,
    totalActivities: project.activities.length,
  } satisfies Project;

  return {
    project: baseProject,
    title: latestReport?.title ?? "Status Report Executivo",
    period: latestReport ? `${formatDate(latestReport.periodStart)} - ${formatDate(latestReport.periodEnd)}` : "Sem período publicado",
    version: latestReport?.version ?? 1,
    publishedAt: formatDate(latestReport?.publishedAt ?? latestReport?.createdAt ?? null),
    executiveNarrative: baseProject.executiveSummary,
    highlights: completedTitles.length > 0 ? completedTitles : [`${baseProject.progress}% de avanço consolidado no projeto.`],
    attentionPoints: attentionPoints.length > 0 ? attentionPoints : ["Sem ponto crítico registrado no último status."],
    nextSteps,
    risks: displayRisks,
    issues: displayIssues,
    activitySummary: {
      completed: completedActivities,
      inProgress: inProgressActivities,
      blocked: blockedActivities,
      planned: plannedActivities,
      total: project.activities.length,
    },
    snapshot: latestSnapshot
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
    sanitizedHtml: sanitizeStatusReportHtml(latestReport?.htmlContent ?? null),
  };
}
export type ProjectEditorOption = {
  id: string;
  name: string;
};

export type ProjectMainDataEditorData = {
  project: {
    id: string;
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
    companies: ProjectEditorOption[];
    units: ProjectEditorOption[];
    users: ProjectEditorOption[];
  };
};

function formatDateInput(date: Date | null): string {
  if (!date) return "";

  return date.toISOString().slice(0, 10);
}

export async function getProjectMainDataEditor(projectId: string): Promise<ProjectMainDataEditorData | null> {
  const project = await prisma.project.findFirst({
    where: { OR: getProjectLookupFilters(projectId) },
    select: {
      id: true,
      tenantId: true,
      slug: true,
      name: true,
      executiveSummary: true,
      status: true,
      targetGoLive: true,
      progress: true,
      companyId: true,
      unitId: true,
      ownerId: true,
      sponsorId: true,
    },
  });

  if (!project) return null;

  const [companies, units, users] = await Promise.all([
    prisma.company.findMany({
      where: { tenantId: project.tenantId, status: "ACTIVE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.unit.findMany({
      where: { tenantId: project.tenantId, status: "ACTIVE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.appUser.findMany({
      where: { tenantId: project.tenantId, status: "ACTIVE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return {
    project: {
      id: project.id,
      slug: project.slug,
      name: project.name,
      executiveSummary: project.executiveSummary ?? "",
      status: project.status,
      targetGoLive: formatDateInput(project.targetGoLive),
      progress: project.progress,
      companyId: project.companyId,
      unitId: project.unitId,
      ownerId: project.ownerId,
      sponsorId: project.sponsorId,
    },
    options: {
      companies,
      units,
      users,
    },
  };
}


