export type ProjectStatus = "on-track" | "attention" | "critical";
export type ActivityStatus = "done" | "in-progress" | "blocked" | "planned";
export type Priority = "Alta" | "Média" | "Baixa";
export type RiskSeverity = "Alto" | "Médio" | "Baixo";

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
    name: "BOGE - Implantação Operacional",
    client: "BOGE",
    unit: "Operações",
    sponsor: "Diretoria Operacional",
    owner: "Mariana Costa",
    status: "attention",
    phase: "Validação operacional",
    goLive: "18 jul 2026",
    progress: 68,
    plannedHours: 420,
    actualHours: 392,
    executiveSummary:
      "Implantação avançando com boa adesão operacional, mas dependente de validação de cadastros e decisão sobre rotina de corte até o fim da semana.",
    nextSteps: ["Fechar plano de corte", "Validar cadastros críticos", "Treinar líderes de turno"],
    decisionsPending: 2,
    executiveIssues: 3,
    highRisks: 1,
    completedActivities: 24,
    totalActivities: 35,
  },
  {
    id: "torre-controle-demandas",
    name: "Torre de Controle - Gestão de Demandas",
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
      "Piloto com indicadores estáveis e backlog priorizado. Próximo marco é consolidar modelo de governança e publicar agenda de ritos.",
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
    phase: "Integração de dados",
    goLive: "12 jul 2026",
    progress: 46,
    plannedHours: 280,
    actualHours: 318,
    executiveSummary:
      "Projeto em risco por atraso na origem de dados e divergências de regra de negócio. Requer decisão executiva para escopo mínimo do primeiro go live.",
    nextSteps: ["Definir escopo mínimo", "Reprocessar base histórica", "Alinhar regra de consolidação"],
    decisionsPending: 3,
    executiveIssues: 4,
    highRisks: 2,
    completedActivities: 13,
    totalActivities: 28,
  },
];

export const activities: Activity[] = [
  { id: "a1", projectId: "boge-implantacao-operacional", title: "Mapear rotina atual do pátio", phase: "Diagnóstico", owner: "Camila", dueDate: "03 jul", status: "done", progress: 100, priority: "Alta" },
  { id: "a2", projectId: "boge-implantacao-operacional", title: "Validar cadastros de transportadoras", phase: "Validação", owner: "Mariana", dueDate: "06 jul", status: "in-progress", progress: 62, priority: "Alta" },
  { id: "a3", projectId: "boge-implantacao-operacional", title: "Preparar roteiro de treinamento", phase: "Treinamento", owner: "Diego", dueDate: "10 jul", status: "planned", progress: 20, priority: "Média" },
  { id: "a4", projectId: "boge-implantacao-operacional", title: "Homologar plano de corte", phase: "Go live", owner: "Sponsor", dueDate: "11 jul", status: "blocked", progress: 35, priority: "Alta" },
  { id: "a5", projectId: "torre-controle-demandas", title: "Configurar fila única de demandas", phase: "Piloto", owner: "Rafael", dueDate: "04 jul", status: "done", progress: 100, priority: "Alta" },
  { id: "a6", projectId: "torre-controle-demandas", title: "Definir SLA executivo", phase: "Governança", owner: "Patricia", dueDate: "09 jul", status: "in-progress", progress: 74, priority: "Média" },
  { id: "a7", projectId: "torre-controle-demandas", title: "Publicar dashboard de backlog", phase: "Indicadores", owner: "Rafael", dueDate: "15 jul", status: "in-progress", progress: 58, priority: "Alta" },
  { id: "a8", projectId: "consulta-volumetria", title: "Revisar fonte de pedidos históricos", phase: "Dados", owner: "Bianca", dueDate: "05 jul", status: "blocked", progress: 40, priority: "Alta" },
  { id: "a9", projectId: "consulta-volumetria", title: "Validar regra de volumetria por cliente", phase: "Regra", owner: "Comercial", dueDate: "08 jul", status: "in-progress", progress: 52, priority: "Alta" },
  { id: "a10", projectId: "consulta-volumetria", title: "Criar visão de consulta executiva", phase: "Produto", owner: "Bianca", dueDate: "11 jul", status: "planned", progress: 25, priority: "Média" },
];

export const risks: Risk[] = [
  { id: "r1", projectId: "boge-implantacao-operacional", title: "Cadastros incompletos no corte", severity: "Alto", owner: "Mariana", goLiveImpact: "Pode atrasar virada operacional", mitigation: "Criar sala diária de saneamento com Operações e TI." },
  { id: "r2", projectId: "torre-controle-demandas", title: "Aderência baixa aos ritos", severity: "Médio", owner: "Rafael", goLiveImpact: "Pode reduzir confiabilidade dos indicadores", mitigation: "Publicar agenda executiva e reforçar responsáveis por backlog." },
  { id: "r3", projectId: "consulta-volumetria", title: "Fonte histórica instavel", severity: "Alto", owner: "Bianca", goLiveImpact: "Ameaça o go live de 12 jul", mitigation: "Congelar escopo mínimo e validar amostra manual." },
  { id: "r4", projectId: "consulta-volumetria", title: "Divergência de regra comercial", severity: "Alto", owner: "Comercial", goLiveImpact: "Pode gerar número executivo incorreto", mitigation: "Decisão em comitê sobre regra padrão para primeira versão." },
];

export const issues: Issue[] = [
  { id: "i1", projectId: "boge-implantacao-operacional", title: "Aprovação do plano de corte", source: "Comitê de go live", owner: "Sponsor", dueDate: "05 jul", impact: "Define data de virada", nextAction: "Validar janela operacional", critical: true },
  { id: "i2", projectId: "boge-implantacao-operacional", title: "Lista final de usuários-chave", source: "Operações", owner: "Camila", dueDate: "07 jul", impact: "Afeta treinamento", nextAction: "Confirmar líderes por turno", critical: false },
  { id: "i3", projectId: "torre-controle-demandas", title: "Política de priorização executiva", source: "PMO", owner: "Patricia", dueDate: "09 jul", impact: "Afeta SLA e fila única", nextAction: "Aprovar matriz RICE simplificada", critical: false },
  { id: "i4", projectId: "consulta-volumetria", title: "Decisão de escopo mínimo", source: "Diretoria Comercial", owner: "Sponsor", dueDate: "04 jul", impact: "Sem decisão, go live fica crítico", nextAction: "Escolher regra de consolidação", critical: true },
  { id: "i5", projectId: "consulta-volumetria", title: "Arquivo histórico divergente", source: "Dados", owner: "Bianca", dueDate: "06 jul", impact: "Volumetria final pode variar", nextAction: "Reprocessar base com amostra validada", critical: true },
];

export const statusReport = {
  title: "Status Report Executivo",
  period: "Semana 27/2026",
  executiveNarrative:
    "Carteira com dois projetos sob controle e um projeto crítico exigindo decisão executiva. Prioridade da semana: proteger go lives de julho e reduzir pendências de escopo.",
  highlights: ["82% de avanço no piloto da Torre de Controle", "Consulta Volumetria requer decisão de escopo", "BOGE entra em validação operacional final"],
  nextSteps: ["Comitê executivo de escopo", "Plano de go live BOGE", "Publicação da rotina de Torre de Controle"],
};

export const templates = [
  { title: "Implantação Operacional", description: "Fases para rollout, treinamento, corte e estabilização." },
  { title: "Cockpit de Demandas", description: "Modelo de governança para fila única, SLA e backlog executivo." },
  { title: "Produto de Dados", description: "Checklist para fontes, regras, homologação e consulta executiva." },
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

export function getPortfólioStats() {
  return {
    activeProjects: projects.length,
    attentionProjects: projects.filter((project) => project.status === "attention").length,
    criticalProjects: projects.filter((project) => project.status === "critical").length,
    executiveIssues: issues.filter((issue) => issue.critical).length,
    decisionsPending: projects.reduce((total, project) => total + project.decisionsPending, 0),
    upcomingGoLives: projects.filter((project) => project.goLive.includes("jul")).length,
  };
}

