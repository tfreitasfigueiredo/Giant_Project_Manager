export type ProjectStatus = "on-track" | "attention" | "critical";
export type ActivityStatus = "done" | "in-progress" | "blocked" | "planned";
export type Priority = "Alta" | "Media" | "Baixa";
export type RiskSeverity = "Alto" | "Medio" | "Baixo";

export type Project = {
  id: string;
  name: string;
  client: string;
  unit: string;
  sponsor: string;
  owner: string;
  status: ProjectStatus;
  phase: string;
  goLive: string;
  progress: number;
  plannedHours: number;
  actualHours: number;
  executiveSummary: string;
  nextSteps: string[];
  decisionsPending: number;
  executiveIssues: number;
  highRisks: number;
  completedActivities: number;
  totalActivities: number;
};

export type Activity = {
  id: string;
  projectId: string;
  title: string;
  phase: string;
  owner: string;
  dueDate: string;
  status: ActivityStatus;
  progress: number;
  priority: Priority;
};

export type Risk = {
  id: string;
  projectId: string;
  title: string;
  severity: RiskSeverity;
  owner: string;
  goLiveImpact: string;
  mitigation: string;
};

export type Issue = {
  id: string;
  projectId: string;
  title: string;
  source: string;
  owner: string;
  dueDate: string;
  impact: string;
  nextAction: string;
  critical: boolean;
};

export const projects: Project[] = [
  {
    id: "boge-implantacao-operacional",
    name: "BOGE - Implantacao Operacional",
    client: "BOGE",
    unit: "Operacoes",
    sponsor: "Diretoria Operacional",
    owner: "Mariana Costa",
    status: "attention",
    phase: "Validacao operacional",
    goLive: "18 jul 2026",
    progress: 68,
    plannedHours: 420,
    actualHours: 392,
    executiveSummary:
      "Implantacao avancando com boa adesao operacional, mas dependente de validacao de cadastros e decisao sobre rotina de corte ate o fim da semana.",
    nextSteps: ["Fechar plano de corte", "Validar cadastros criticos", "Treinar lideres de turno"],
    decisionsPending: 2,
    executiveIssues: 3,
    highRisks: 1,
    completedActivities: 24,
    totalActivities: 35,
  },
  {
    id: "torre-controle-demandas",
    name: "Torre de Controle - Gestao de Demandas",
    client: "Grupo Mirassol",
    unit: "Control Tower",
    sponsor: "Diretoria de Tecnologia",
    owner: "Rafael Nunes",
    status: "on-track",
    phase: "Piloto assistido",
    goLive: "29 jul 2026",
    progress: 82,
    plannedHours: 360,
    actualHours: 338,
    executiveSummary:
      "Piloto com indicadores estaveis e backlog priorizado. Proximo marco e consolidar modelo de governanca e publicar agenda de ritos.",
    nextSteps: ["Publicar rotina semanal", "Concluir painel de backlog", "Homologar SLA por tipo de demanda"],
    decisionsPending: 1,
    executiveIssues: 1,
    highRisks: 0,
    completedActivities: 31,
    totalActivities: 38,
  },
  {
    id: "consulta-volumetria",
    name: "Consulta Volumetria",
    client: "Comercial",
    unit: "Planejamento",
    sponsor: "Diretoria Comercial",
    owner: "Bianca Reis",
    status: "critical",
    phase: "Integracao de dados",
    goLive: "12 jul 2026",
    progress: 46,
    plannedHours: 280,
    actualHours: 318,
    executiveSummary:
      "Projeto em risco por atraso na origem de dados e divergencias de regra de negocio. Requer decisao executiva para escopo minimo do primeiro go live.",
    nextSteps: ["Definir escopo minimo", "Reprocessar base historica", "Alinhar regra de consolidacao"],
    decisionsPending: 3,
    executiveIssues: 4,
    highRisks: 2,
    completedActivities: 13,
    totalActivities: 28,
  },
];

export const activities: Activity[] = [
  { id: "a1", projectId: "boge-implantacao-operacional", title: "Mapear rotina atual do patio", phase: "Diagnostico", owner: "Camila", dueDate: "03 jul", status: "done", progress: 100, priority: "Alta" },
  { id: "a2", projectId: "boge-implantacao-operacional", title: "Validar cadastros de transportadoras", phase: "Validacao", owner: "Mariana", dueDate: "06 jul", status: "in-progress", progress: 62, priority: "Alta" },
  { id: "a3", projectId: "boge-implantacao-operacional", title: "Preparar roteiro de treinamento", phase: "Treinamento", owner: "Diego", dueDate: "10 jul", status: "planned", progress: 20, priority: "Media" },
  { id: "a4", projectId: "boge-implantacao-operacional", title: "Homologar plano de corte", phase: "Go live", owner: "Sponsor", dueDate: "11 jul", status: "blocked", progress: 35, priority: "Alta" },
  { id: "a5", projectId: "torre-controle-demandas", title: "Configurar fila unica de demandas", phase: "Piloto", owner: "Rafael", dueDate: "04 jul", status: "done", progress: 100, priority: "Alta" },
  { id: "a6", projectId: "torre-controle-demandas", title: "Definir SLA executivo", phase: "Governanca", owner: "Patricia", dueDate: "09 jul", status: "in-progress", progress: 74, priority: "Media" },
  { id: "a7", projectId: "torre-controle-demandas", title: "Publicar dashboard de backlog", phase: "Indicadores", owner: "Rafael", dueDate: "15 jul", status: "in-progress", progress: 58, priority: "Alta" },
  { id: "a8", projectId: "consulta-volumetria", title: "Revisar fonte de pedidos historicos", phase: "Dados", owner: "Bianca", dueDate: "05 jul", status: "blocked", progress: 40, priority: "Alta" },
  { id: "a9", projectId: "consulta-volumetria", title: "Validar regra de volumetria por cliente", phase: "Regra", owner: "Comercial", dueDate: "08 jul", status: "in-progress", progress: 52, priority: "Alta" },
  { id: "a10", projectId: "consulta-volumetria", title: "Criar visao de consulta executiva", phase: "Produto", owner: "Bianca", dueDate: "11 jul", status: "planned", progress: 25, priority: "Media" },
];

export const risks: Risk[] = [
  { id: "r1", projectId: "boge-implantacao-operacional", title: "Cadastros incompletos no corte", severity: "Alto", owner: "Mariana", goLiveImpact: "Pode atrasar virada operacional", mitigation: "Criar sala diaria de saneamento com Operacoes e TI." },
  { id: "r2", projectId: "torre-controle-demandas", title: "Aderencia baixa aos ritos", severity: "Medio", owner: "Rafael", goLiveImpact: "Pode reduzir confiabilidade dos indicadores", mitigation: "Publicar agenda executiva e reforcar responsaveis por backlog." },
  { id: "r3", projectId: "consulta-volumetria", title: "Fonte historica instavel", severity: "Alto", owner: "Bianca", goLiveImpact: "Ameaca o go live de 12 jul", mitigation: "Congelar escopo minimo e validar amostra manual." },
  { id: "r4", projectId: "consulta-volumetria", title: "Divergencia de regra comercial", severity: "Alto", owner: "Comercial", goLiveImpact: "Pode gerar numero executivo incorreto", mitigation: "Decisao em comite sobre regra padrao para primeira versao." },
];

export const issues: Issue[] = [
  { id: "i1", projectId: "boge-implantacao-operacional", title: "Aprovacao do plano de corte", source: "Comite de go live", owner: "Sponsor", dueDate: "05 jul", impact: "Define data de virada", nextAction: "Validar janela operacional", critical: true },
  { id: "i2", projectId: "boge-implantacao-operacional", title: "Lista final de usuarios-chave", source: "Operacoes", owner: "Camila", dueDate: "07 jul", impact: "Afeta treinamento", nextAction: "Confirmar lideres por turno", critical: false },
  { id: "i3", projectId: "torre-controle-demandas", title: "Politica de priorizacao executiva", source: "PMO", owner: "Patricia", dueDate: "09 jul", impact: "Afeta SLA e fila unica", nextAction: "Aprovar matriz RICE simplificada", critical: false },
  { id: "i4", projectId: "consulta-volumetria", title: "Decisao de escopo minimo", source: "Diretoria Comercial", owner: "Sponsor", dueDate: "04 jul", impact: "Sem decisao, go live fica critico", nextAction: "Escolher regra de consolidacao", critical: true },
  { id: "i5", projectId: "consulta-volumetria", title: "Arquivo historico divergente", source: "Dados", owner: "Bianca", dueDate: "06 jul", impact: "Volumetria final pode variar", nextAction: "Reprocessar base com amostra validada", critical: true },
];

export const statusReport = {
  title: "Status Report Executivo",
  period: "Semana 27/2026",
  executiveNarrative:
    "Carteira com dois projetos sob controle e um projeto critico exigindo decisao executiva. Prioridade da semana: proteger go lives de julho e reduzir pendencias de escopo.",
  highlights: ["82% de avanco no piloto da Torre de Controle", "Consulta Volumetria requer decisao de escopo", "BOGE entra em validacao operacional final"],
  nextSteps: ["Comite executivo de escopo", "Plano de go live BOGE", "Publicacao da rotina de Torre de Controle"],
};

export const templates = [
  { title: "Implantacao Operacional", description: "Fases para rollout, treinamento, corte e estabilizacao." },
  { title: "Cockpit de Demandas", description: "Modelo de governanca para fila unica, SLA e backlog executivo." },
  { title: "Produto de Dados", description: "Checklist para fontes, regras, homologacao e consulta executiva." },
];

export function getProject(projectId: string) {
  return projects.find((project) => project.id === projectId) ?? projects[0];
}

export function getProjectActivities(projectId: string) {
  return activities.filter((activity) => activity.projectId === projectId);
}

export function getProjectRisks(projectId: string) {
  return risks.filter((risk) => risk.projectId === projectId);
}

export function getProjectIssues(projectId: string) {
  return issues.filter((issue) => issue.projectId === projectId);
}

export function getPortfolioStats() {
  return {
    activeProjects: projects.length,
    attentionProjects: projects.filter((project) => project.status === "attention").length,
    criticalProjects: projects.filter((project) => project.status === "critical").length,
    executiveIssues: issues.filter((issue) => issue.critical).length,
    decisionsPending: projects.reduce((total, project) => total + project.decisionsPending, 0),
    upcomingGoLives: projects.filter((project) => project.goLive.includes("jul")).length,
  };
}
