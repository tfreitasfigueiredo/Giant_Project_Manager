import { activities, issues, projects, risks } from "@/data/mock-data";

export const portfolioHealthRows = [
  { label: "No prazo", value: projects.filter((project) => project.status === "on-track").length, tone: "emerald", percent: 68 },
  { label: "Atencao", value: projects.filter((project) => project.status === "attention").length, tone: "orange", percent: 44 },
  { label: "Critico", value: projects.filter((project) => project.status === "critical").length, tone: "red", percent: 28 },
  { label: "Planejado", value: 1, tone: "slate", percent: 18 },
] as const;

export const riskRows = [
  { label: "Alto", value: risks.filter((risk) => risk.severity === "Alto").length, tone: "red" },
  { label: "Medio", value: risks.filter((risk) => risk.severity === "Medio").length, tone: "orange" },
  { label: "Baixo", value: 1, tone: "emerald" },
] as const;

export const issueRows = [
  { label: "Criticas abertas", value: issues.filter((issue) => issue.critical).length, tone: "red" },
  { label: "Altas abertas", value: 2, tone: "orange" },
  { label: "Medias abertas", value: 3, tone: "amber" },
  { label: "Baixas abertas", value: 1, tone: "emerald" },
] as const;

export const recentActivities = activities.slice(0, 6).map((activity) => {
  const project = projects.find((item) => item.id === activity.projectId);
  return {
    ...activity,
    projectName: project?.name ?? "Projeto",
  };
});
