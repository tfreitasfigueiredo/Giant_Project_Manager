export type ActivityStatus = "done" | "in-progress" | "blocked" | "planned" | "cancelled";
export type ActivityStatusCode = "PLANNED" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED";
export type ActivityPriority = "Crítica" | "Alta" | "Média" | "Baixa";
export type ActivityPriorityCode = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Activity = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  phase: string;
  phaseId: string;
  owner: string;
  ownerId: string;
  dueDate: string;
  dueDateInput: string;
  completedAt: string;
  status: ActivityStatus;
  statusCode: ActivityStatusCode;
  progress: number;
  priority: ActivityPriority;
  priorityCode: ActivityPriorityCode;
  orderIndex: number;
};

export type ProjectActivityPhaseOption = {
  id: string;
  name: string;
  orderIndex: number;
  nextOrderIndex: number;
};

export type ProjectActivityUserOption = {
  id: string;
  name: string;
};

export type ProjectActivitiesManagementData = {
  project: {
    id: string;
    name: string;
  };
  activities: Activity[];
  options: {
    phases: ProjectActivityPhaseOption[];
    users: ProjectActivityUserOption[];
  };
};
