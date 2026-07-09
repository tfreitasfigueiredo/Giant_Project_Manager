"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ProjectPhaseStatus, ProjectStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/server/prisma";

export type UpdateProjectMainDataState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export type ProjectPhaseActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const projectStatuses = ["PLANNED", "ON_TRACK", "ATTENTION", "CRITICAL", "PAUSED", "COMPLETED", "CANCELLED"] as const;
const projectPhaseStatuses = ["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "DONE", "CANCELLED"] as const;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const updateProjectMainDataSchema = z.object({
  projectId: z.string().min(1, "Projeto inválido."),
  name: z.string().trim().min(3, "Informe um nome com pelo menos 3 caracteres.").max(160, "Use até 160 caracteres."),
  executiveSummary: z.string().trim().max(1200, "Use até 1200 caracteres.").optional(),
  status: z.enum(projectStatuses, { error: "Selecione um status válido." }),
  targetGoLive: z.string().trim().optional(),
  progress: z.coerce.number().int("Use um número inteiro.").min(0, "O progresso mínimo é 0%.").max(100, "O progresso máximo é 100%."),
  companyId: z.string().uuid("Selecione uma empresa válida."),
  unitId: z.string().optional(),
  ownerId: z.string().optional(),
  sponsorId: z.string().optional(),
});

const projectPhaseBaseSchema = z.object({
  projectId: z.string().min(1, "Projeto inválido."),
  name: z.string().trim().min(3, "Informe um nome com pelo menos 3 caracteres.").max(140, "Use até 140 caracteres."),
  description: z.string().trim().max(800, "Use até 800 caracteres.").optional(),
  status: z.enum(projectPhaseStatuses, { error: "Selecione um status válido." }),
  orderIndex: z.coerce.number().int("Use um número inteiro.").min(0, "A ordem deve ser maior ou igual a 0."),
  startDate: z.string().trim().optional(),
  dueDate: z.string().trim().optional(),
  completedAt: z.string().trim().optional(),
  progress: z.coerce.number().int("Use um número inteiro.").min(0, "O progresso mínimo é 0%.").max(100, "O progresso máximo é 100%."),
});

const createProjectPhaseSchema = projectPhaseBaseSchema;
const updateProjectPhaseSchema = projectPhaseBaseSchema.extend({
  phaseId: z.string().uuid("Fase inválida."),
});

function normalizeOptionalUuid(value: string | undefined): string | null {
  if (!value || value === "none") return null;
  return value;
}

function parseTargetGoLive(value: string | undefined): Date | null {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Data de go live inválida.");
  }

  return date;
}

function getProjectLookupFilters(projectId: string): Array<{ slug: string } | { id: string }> {
  return uuidPattern.test(projectId) ? [{ slug: projectId }, { id: projectId }] : [{ slug: projectId }];
}

function parseProjectPhaseDate(value: string | undefined, fieldLabel: string): Date | null {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldLabel} inválida.`);
  }

  return date;
}

function parseProjectPhaseDates(data: { startDate?: string; dueDate?: string; completedAt?: string }) {
  const startDate = parseProjectPhaseDate(data.startDate, "Data de início planejada");
  const dueDate = parseProjectPhaseDate(data.dueDate, "Data de fim planejada");
  const completedAt = parseProjectPhaseDate(data.completedAt, "Data de conclusão real");
  const fieldErrors: Record<string, string[]> = {};

  if (startDate && dueDate && dueDate < startDate) {
    fieldErrors.dueDate = ["A data de fim planejada não pode ser anterior ao início planejado."];
  }

  if (startDate && completedAt && completedAt < startDate) {
    fieldErrors.completedAt = ["A conclusão real não pode ser anterior ao início planejado."];
  }

  return {
    dates: { startDate, dueDate, completedAt },
    fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : null,
  };
}

async function findProjectForPhaseAction(projectId: string) {
  return prisma.project.findFirst({
    where: { OR: getProjectLookupFilters(projectId) },
    select: { id: true, tenantId: true, slug: true },
  });
}

function revalidateProjectPhasePaths(projectSlug: string) {
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectSlug}`);
  revalidatePath(`/projects/${projectSlug}/status-report`);
}

export async function updateProjectMainData(
  _previousState: UpdateProjectMainDataState,
  formData: FormData,
): Promise<UpdateProjectMainDataState> {
  const payload = Object.fromEntries(formData.entries());
  const parsed = updateProjectMainDataSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os campos destacados antes de salvar.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const unitId = normalizeOptionalUuid(parsed.data.unitId);
  const ownerId = normalizeOptionalUuid(parsed.data.ownerId);
  const sponsorId = normalizeOptionalUuid(parsed.data.sponsorId);

  let targetGoLive: Date | null;
  try {
    targetGoLive = parseTargetGoLive(parsed.data.targetGoLive);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Data de go live inválida.",
      fieldErrors: { targetGoLive: ["Informe uma data válida."] },
    };
  }

  try {
    const projectLookupFilters = uuidPattern.test(parsed.data.projectId)
      ? [{ slug: parsed.data.projectId }, { id: parsed.data.projectId }]
      : [{ slug: parsed.data.projectId }];

    const project = await prisma.project.findFirst({
      where: { OR: projectLookupFilters },
      select: { id: true, tenantId: true, slug: true },
    });

    if (!project) {
      return { status: "error", message: "Projeto não encontrado para edição." };
    }

    const [company, unit, owner, sponsor] = await Promise.all([
      prisma.company.findFirst({ where: { id: parsed.data.companyId, tenantId: project.tenantId }, select: { id: true } }),
      unitId
        ? prisma.unit.findFirst({ where: { id: unitId, tenantId: project.tenantId, companyId: parsed.data.companyId }, select: { id: true } })
        : Promise.resolve(null),
      ownerId ? prisma.appUser.findFirst({ where: { id: ownerId, tenantId: project.tenantId }, select: { id: true } }) : Promise.resolve(null),
      sponsorId ? prisma.appUser.findFirst({ where: { id: sponsorId, tenantId: project.tenantId }, select: { id: true } }) : Promise.resolve(null),
    ]);

    if (!company) {
      return { status: "error", message: "Empresa inválida para este projeto.", fieldErrors: { companyId: ["Selecione uma empresa válida."] } };
    }

    if (unitId && !unit) {
      return { status: "error", message: "Unidade inválida para a empresa selecionada.", fieldErrors: { unitId: ["Selecione uma unidade válida."] } };
    }

    if (ownerId && !owner) {
      return { status: "error", message: "Gerente responsável inválido.", fieldErrors: { ownerId: ["Selecione um gerente válido."] } };
    }

    if (sponsorId && !sponsor) {
      return { status: "error", message: "Sponsor inválido.", fieldErrors: { sponsorId: ["Selecione um sponsor válido."] } };
    }

    await prisma.project.update({
      where: { id: project.id },
      data: {
        name: parsed.data.name,
        executiveSummary: parsed.data.executiveSummary || null,
        status: parsed.data.status as ProjectStatus,
        targetGoLive,
        progress: parsed.data.progress,
        companyId: parsed.data.companyId,
        unitId,
        ownerId,
        sponsorId,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath(`/projects/${project.slug}/status-report`);

    return { status: "success", message: "Dados principais do projeto salvos com sucesso." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Não foi possível salvar os dados principais do projeto.",
    };
  }
}

export async function createProjectPhase(
  _previousState: ProjectPhaseActionState,
  formData: FormData,
): Promise<ProjectPhaseActionState> {
  const payload = Object.fromEntries(formData.entries());
  const parsed = createProjectPhaseSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os campos da fase antes de salvar.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let dates: ReturnType<typeof parseProjectPhaseDates>["dates"];
  try {
    const parsedDates = parseProjectPhaseDates(parsed.data);
    if (parsedDates.fieldErrors) {
      return {
        status: "error",
        message: "Revise as datas informadas antes de salvar.",
        fieldErrors: parsedDates.fieldErrors,
      };
    }
    dates = parsedDates.dates;
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Datas inválidas.",
    };
  }

  try {
    const project = await findProjectForPhaseAction(parsed.data.projectId);

    if (!project) {
      return { status: "error", message: "Projeto não encontrado para criar fase." };
    }

    const orderConflict = await prisma.projectPhase.findFirst({
      where: { projectId: project.id, orderIndex: parsed.data.orderIndex },
      select: { id: true },
    });

    if (orderConflict) {
      return {
        status: "error",
        message: "Já existe uma fase com esta ordem neste projeto.",
        fieldErrors: { orderIndex: ["Informe uma ordem ainda não utilizada."] },
      };
    }

    await prisma.projectPhase.create({
      data: {
        tenantId: project.tenantId,
        projectId: project.id,
        name: parsed.data.name,
        description: parsed.data.description || null,
        status: parsed.data.status as ProjectPhaseStatus,
        orderIndex: parsed.data.orderIndex,
        startDate: dates.startDate,
        dueDate: dates.dueDate,
        completedAt: dates.completedAt,
        progress: parsed.data.progress,
      },
    });

    revalidateProjectPhasePaths(project.slug);

    return { status: "success", message: "Fase criada com sucesso." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Não foi possível criar a fase.",
    };
  }
}

export async function updateProjectPhase(
  _previousState: ProjectPhaseActionState,
  formData: FormData,
): Promise<ProjectPhaseActionState> {
  const payload = Object.fromEntries(formData.entries());
  const parsed = updateProjectPhaseSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os campos da fase antes de salvar.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let dates: ReturnType<typeof parseProjectPhaseDates>["dates"];
  try {
    const parsedDates = parseProjectPhaseDates(parsed.data);
    if (parsedDates.fieldErrors) {
      return {
        status: "error",
        message: "Revise as datas informadas antes de salvar.",
        fieldErrors: parsedDates.fieldErrors,
      };
    }
    dates = parsedDates.dates;
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Datas inválidas.",
    };
  }

  try {
    const project = await findProjectForPhaseAction(parsed.data.projectId);

    if (!project) {
      return { status: "error", message: "Projeto não encontrado para editar fase." };
    }

    const phase = await prisma.projectPhase.findFirst({
      where: { id: parsed.data.phaseId, projectId: project.id },
      select: { id: true },
    });

    if (!phase) {
      return { status: "error", message: "Fase não encontrada neste projeto." };
    }

    const orderConflict = await prisma.projectPhase.findFirst({
      where: {
        projectId: project.id,
        orderIndex: parsed.data.orderIndex,
        NOT: { id: parsed.data.phaseId },
      },
      select: { id: true },
    });

    if (orderConflict) {
      return {
        status: "error",
        message: "Já existe outra fase com esta ordem neste projeto.",
        fieldErrors: { orderIndex: ["Informe uma ordem ainda não utilizada."] },
      };
    }

    await prisma.projectPhase.update({
      where: { id: parsed.data.phaseId },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        status: parsed.data.status as ProjectPhaseStatus,
        orderIndex: parsed.data.orderIndex,
        startDate: dates.startDate,
        dueDate: dates.dueDate,
        completedAt: dates.completedAt,
        progress: parsed.data.progress,
      },
    });

    revalidateProjectPhasePaths(project.slug);

    return { status: "success", message: "Fase atualizada com sucesso." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Não foi possível atualizar a fase.",
    };
  }
}
