import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the Prisma seed.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const date = (value: string) => new Date(value + "T12:00:00.000Z");

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: "ambiente-pessoal" },
    update: { name: "Ambiente Pessoal", status: "ACTIVE" },
    create: { name: "Ambiente Pessoal", slug: "ambiente-pessoal", status: "ACTIVE" },
  });

  const company = await prisma.company.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: "Giant Manager" } },
    update: { legalName: "Giant Manager", status: "ACTIVE" },
    create: { tenantId: tenant.id, name: "Giant Manager", legalName: "Giant Manager", status: "ACTIVE" },
  });

  const unit = await prisma.unit.upsert({
    where: { tenantId_companyId_name: { tenantId: tenant.id, companyId: company.id, name: "Matriz" } },
    update: { status: "ACTIVE" },
    create: { tenantId: tenant.id, companyId: company.id, name: "Matriz", status: "ACTIVE" },
  });

  const roleSeeds = [
    ["ADMIN", "Administrador"],
    ["KEY_USER", "Key user"],
    ["PARTICIPANT", "Participante"],
    ["CLIENT", "Cliente"],
  ] as const;

  const roles = Object.fromEntries(
    await Promise.all(
      roleSeeds.map(async ([code, name]) => {
        const role = await prisma.role.upsert({
          where: { tenantId_code: { tenantId: tenant.id, code } },
          update: { name, status: "ACTIVE" },
          create: { tenantId: tenant.id, code, name, status: "ACTIVE" },
        });
        return [code, role];
      }),
    ),
  );

  const userSeeds = [
    { name: "Tiago Figueiredo", email: "tiago.figueiredo@giantmanager.local", jobTitle: "ADMIN", role: "ADMIN" },
    { name: "Mariana Costa", email: "mariana.costa@giantmanager.local", jobTitle: "Gerente de Projeto", role: "KEY_USER" },
    { name: "Rafael Nunes", email: "rafael.nunes@giantmanager.local", jobTitle: "PMO", role: "KEY_USER" },
    { name: "Camila Reis", email: "camila.reis@giantmanager.local", jobTitle: "Participante", role: "PARTICIPANT" },
    { name: "Sponsor", email: "sponsor@cliente.local", jobTitle: "Cliente / Executivo", role: "CLIENT" },
  ] as const;

  const users = Object.fromEntries(
    await Promise.all(
      userSeeds.map(async (seed) => {
        const user = await prisma.appUser.upsert({
          where: { tenantId_email: { tenantId: tenant.id, email: seed.email } },
          update: {
            name: seed.name,
            jobTitle: seed.jobTitle,
            companyId: company.id,
            unitId: unit.id,
            status: "ACTIVE",
          },
          create: {
            tenantId: tenant.id,
            companyId: company.id,
            unitId: unit.id,
            name: seed.name,
            email: seed.email,
            jobTitle: seed.jobTitle,
            status: "ACTIVE",
          },
        });
        return [seed.name, user];
      }),
    ),
  );

  await prisma.userAccess.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.userAccess.createMany({
    data: userSeeds.map((seed) => ({
      tenantId: tenant.id,
      userId: users[seed.name].id,
      roleId: roles[seed.role].id,
      companyId: company.id,
      unitId: unit.id,
      status: "ACTIVE",
    })),
  });

  const projectSeeds = [
    {
      name: "BOGE - Implantação Operacional",
      slug: "boge-implantacao-operacional",
      type: "IMPLEMENTATION",
      status: "ATTENTION",
      phaseName: "Validação operacional",
      progress: 68,
      plannedHours: "420.00",
      actualHours: "392.00",
      targetGoLive: date("2026-07-18"),
      owner: "Mariana Costa",
      sponsor: "Sponsor",
      summary:
        "Implantação avançando com boa adesão operacional, mas dependente de validação de cadastros e decisão sobre rotina de corte até o fim da semana.",
      phases: [
        ["Diagnóstico", "DONE", 1, 100],
        ["Validação operacional", "IN_PROGRESS", 2, 68],
        ["Treinamento", "NOT_STARTED", 3, 20],
        ["Go live", "BLOCKED", 4, 35],
      ],
      activities: [
        ["Mapear rotina atual do pátio", "DONE", "HIGH", "Camila Reis", "2026-07-03", 100, "Diagnóstico"],
        ["Validar cadastros de transportadoras", "IN_PROGRESS", "HIGH", "Mariana Costa", "2026-07-06", 62, "Validação operacional"],
        ["Preparar roteiro de treinamento", "PLANNED", "MEDIUM", "Camila Reis", "2026-07-10", 20, "Treinamento"],
        ["Homologar plano de corte", "BLOCKED", "HIGH", "Sponsor", "2026-07-11", 35, "Go live"],
      ],
      risks: [
        ["Cadastros incompletos no corte", "HIGH", "HIGH", "HIGH", "MITIGATING", "Pode atrasar virada operacional", "Criar sala diária de saneamento com Operações e TI.", "Mariana Costa"],
      ],
      issues: [
        ["Aprovação do plano de corte", "EXECUTIVE", "WAITING_DECISION", "CRITICAL", "Define data de virada", "Validar janela operacional", "Sponsor", true],
        ["Lista final de usuários-chave", "OPERATIONS", "OPEN", "HIGH", "Afeta treinamento", "Confirmar líderes por turno", "Camila Reis", false],
      ],
      decisions: [["Aprovar janela final de corte", "PENDING", "Sponsor", "2026-07-05"]],
      nextSteps: ["Fechar plano de corte", "Validar cadastros críticos", "Treinar líderes de turno"],
    },
    {
      name: "Torre de Controle - Gestão de Demandas",
      slug: "torre-controle-demandas",
      type: "CONTROL_TOWER",
      status: "ON_TRACK",
      phaseName: "Piloto assistido",
      progress: 82,
      plannedHours: "360.00",
      actualHours: "338.00",
      targetGoLive: date("2026-07-29"),
      owner: "Rafael Nunes",
      sponsor: "Tiago Figueiredo",
      summary:
        "Piloto com indicadores estáveis e backlog priorizado. Próximo marco é consolidar modelo de governança e publicar agenda de ritos.",
      phases: [
        ["Discovery", "DONE", 1, 100],
        ["Piloto assistido", "IN_PROGRESS", 2, 82],
        ["Governança", "IN_PROGRESS", 3, 74],
        ["Escala", "NOT_STARTED", 4, 10],
      ],
      activities: [
        ["Configurar fila única de demandas", "DONE", "HIGH", "Rafael Nunes", "2026-07-04", 100, "Piloto assistido"],
        ["Definir SLA executivo", "IN_PROGRESS", "MEDIUM", "Rafael Nunes", "2026-07-09", 74, "Governança"],
        ["Publicar dashboard de backlog", "IN_PROGRESS", "HIGH", "Rafael Nunes", "2026-07-15", 58, "Escala"],
      ],
      risks: [
        ["Aderência baixa aos ritos", "MEDIUM", "MEDIUM", "MEDIUM", "OPEN", "Pode reduzir confiabilidade dos indicadores", "Publicar agenda executiva e reforçar responsáveis por backlog.", "Rafael Nunes"],
      ],
      issues: [
        ["Política de priorização executiva", "PMO", "OPEN", "MEDIUM", "Afeta SLA e fila única", "Aprovar matriz RICE simplificada", "Rafael Nunes", false],
      ],
      decisions: [["Definir SLA por tipo de demanda", "PENDING", "Tiago Figueiredo", "2026-07-09"]],
      nextSteps: ["Publicar rotina semanal", "Concluir painel de backlog", "Homologar SLA por tipo de demanda"],
    },
    {
      name: "Consulta Volumetria",
      slug: "consulta-volumetria",
      type: "DATA_PRODUCT",
      status: "CRITICAL",
      phaseName: "Integração de dados",
      progress: 46,
      plannedHours: "280.00",
      actualHours: "318.00",
      targetGoLive: date("2026-07-12"),
      owner: "Rafael Nunes",
      sponsor: "Sponsor",
      summary:
        "Projeto em risco por atraso na origem de dados e divergências de regra de negócio. Requer decisão executiva para escopo mínimo do primeiro go live.",
      phases: [
        ["Dados", "BLOCKED", 1, 40],
        ["Regra", "IN_PROGRESS", 2, 52],
        ["Produto", "NOT_STARTED", 3, 25],
        ["Go live", "NOT_STARTED", 4, 0],
      ],
      activities: [
        ["Revisar fonte de pedidos históricos", "BLOCKED", "HIGH", "Rafael Nunes", "2026-07-05", 40, "Dados"],
        ["Validar regra de volumetria por cliente", "IN_PROGRESS", "HIGH", "Sponsor", "2026-07-08", 52, "Regra"],
        ["Criar visão de consulta executiva", "PLANNED", "MEDIUM", "Rafael Nunes", "2026-07-11", 25, "Produto"],
      ],
      risks: [
        ["Fonte histórica instável", "HIGH", "CRITICAL", "CRITICAL", "OPEN", "Ameaça o go live de 12 jul", "Congelar escopo mínimo e validar amostra manual.", "Rafael Nunes"],
        ["Divergência de regra comercial", "HIGH", "HIGH", "HIGH", "OPEN", "Pode gerar número executivo incorreto", "Decisão em comitê sobre regra padrão para primeira versão.", "Sponsor"],
      ],
      issues: [
        ["Decisão de escopo mínimo", "EXECUTIVE", "WAITING_DECISION", "CRITICAL", "Sem decisão, go live fica crítico", "Escolher regra de consolidação", "Sponsor", true],
        ["Arquivo histórico divergente", "TECHNOLOGY", "OPEN", "HIGH", "Volumetria final pode variar", "Reprocessar base com amostra validada", "Rafael Nunes", true],
      ],
      decisions: [["Escolher regra de consolidação da volumetria", "PENDING", "Sponsor", "2026-07-04"]],
      nextSteps: ["Definir escopo mínimo", "Reprocessar base histórica", "Alinhar regra de consolidação"],
    },
  ] as const;

  for (const seed of projectSeeds) {
    const project = await prisma.project.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: seed.slug } },
      update: {
        companyId: company.id,
        unitId: unit.id,
        sponsorId: users[seed.sponsor].id,
        ownerId: users[seed.owner].id,
        name: seed.name,
        type: seed.type,
        status: seed.status,
        phaseName: seed.phaseName,
        targetGoLive: seed.targetGoLive,
        progress: seed.progress,
        plannedHours: seed.plannedHours,
        actualHours: seed.actualHours,
        executiveSummary: seed.summary,
        visibility: "EXECUTIVE",
      },
      create: {
        tenantId: tenant.id,
        companyId: company.id,
        unitId: unit.id,
        sponsorId: users[seed.sponsor].id,
        ownerId: users[seed.owner].id,
        name: seed.name,
        slug: seed.slug,
        type: seed.type,
        status: seed.status,
        phaseName: seed.phaseName,
        targetGoLive: seed.targetGoLive,
        progress: seed.progress,
        plannedHours: seed.plannedHours,
        actualHours: seed.actualHours,
        executiveSummary: seed.summary,
        visibility: "EXECUTIVE",
      },
    });

    await prisma.statusReport.deleteMany({ where: { projectId: project.id } });
    await prisma.statusSnapshot.deleteMany({ where: { projectId: project.id } });
    await prisma.timeEntry.deleteMany({ where: { projectId: project.id } });
    await prisma.projectActivity.deleteMany({ where: { projectId: project.id } });
    await prisma.projectPhase.deleteMany({ where: { projectId: project.id } });
    await prisma.risk.deleteMany({ where: { projectId: project.id } });
    await prisma.issue.deleteMany({ where: { projectId: project.id } });
    await prisma.decision.deleteMany({ where: { projectId: project.id } });
    await prisma.nextStep.deleteMany({ where: { projectId: project.id } });
    await prisma.projectMember.deleteMany({ where: { projectId: project.id } });

    await prisma.projectMember.createMany({
      data: [
        { tenantId: tenant.id, projectId: project.id, userId: users[seed.owner].id, roleId: roles.KEY_USER.id, profile: "PROJECT_MANAGER" },
        { tenantId: tenant.id, projectId: project.id, userId: users[seed.sponsor].id, roleId: roles.CLIENT.id, profile: "EXECUTIVE" },
        { tenantId: tenant.id, projectId: project.id, userId: users["Camila Reis"].id, roleId: roles.PARTICIPANT.id, profile: "PARTICIPANT" },
      ],
    });

    const phaseByName = new Map<string, { id: string }>();
    for (const [name, status, orderIndex, progress] of seed.phases) {
      const phase = await prisma.projectPhase.create({
        data: {
          tenantId: tenant.id,
          projectId: project.id,
          name,
          status,
          orderIndex,
          progress,
        },
      });
      phaseByName.set(name, phase);
    }

    for (const [title, status, priority, ownerName, dueDate, progress, phaseName] of seed.activities) {
      const activity = await prisma.projectActivity.create({
        data: {
          tenantId: tenant.id,
          projectId: project.id,
          phaseId: phaseByName.get(phaseName)?.id,
          ownerId: users[ownerName].id,
          title,
          status,
          priority,
          dueDate: date(dueDate),
          progress,
        },
      });
      await prisma.timeEntry.create({
        data: {
          tenantId: tenant.id,
          projectId: project.id,
          activityId: activity.id,
          userId: users[ownerName].id,
          entryDate: date("2026-07-03"),
          hours: "4.00",
          notes: "Carga inicial relacionada a " + title + ".",
          billable: false,
        },
      });
    }

    for (const [title, probability, impact, severity, status, goLiveImpact, mitigation, ownerName] of seed.risks) {
      await prisma.risk.create({
        data: {
          tenantId: tenant.id,
          projectId: project.id,
          ownerId: users[ownerName].id,
          title,
          probability,
          impact,
          severity,
          status,
          goLiveImpact,
          mitigation,
          visibility: "EXECUTIVE",
        },
      });
    }

    for (const [title, origin, status, priority, impact, nextAction, ownerName, isCritical] of seed.issues) {
      await prisma.issue.create({
        data: {
          tenantId: tenant.id,
          projectId: project.id,
          ownerId: users[ownerName].id,
          title,
          origin,
          status,
          priority,
          impact,
          nextAction,
          isCritical,
          visibility: "EXECUTIVE",
        },
      });
    }

    for (const [title, status, ownerName, dueDate] of seed.decisions) {
      await prisma.decision.create({
        data: {
          tenantId: tenant.id,
          projectId: project.id,
          ownerId: users[ownerName].id,
          title,
          context: "Decisão executiva criada pelo seed inicial da V0.2.",
          status,
          dueDate: date(dueDate),
          visibility: "EXECUTIVE",
        },
      });
    }

    for (const [index, title] of seed.nextSteps.entries()) {
      await prisma.nextStep.create({
        data: {
          tenantId: tenant.id,
          projectId: project.id,
          ownerId: users[seed.owner].id,
          title,
          status: index === 0 ? "IN_PROGRESS" : "OPEN",
          priority: index === 0 ? "HIGH" : "MEDIUM",
          orderIndex: index + 1,
        },
      });
    }

    const highRisksCount = seed.risks.filter((risk) => risk[3] === "HIGH" || risk[3] === "CRITICAL").length;
    const criticalIssuesCount = seed.issues.filter((issue) => issue[7]).length;
    const decisionsPendingCount = seed.decisions.filter((decision) => decision[1] === "PENDING").length;

    const snapshot = await prisma.statusSnapshot.create({
      data: {
        tenantId: tenant.id,
        projectId: project.id,
        status: seed.status,
        progress: seed.progress,
        healthLabel: seed.status === "ON_TRACK" ? "Saudável" : seed.status === "ATTENTION" ? "Atenção" : "Crítico",
        phaseName: seed.phaseName,
        goLiveDate: seed.targetGoLive,
        highRisksCount,
        criticalIssuesCount,
        decisionsPendingCount,
        summary: seed.summary,
        snapshotAt: date("2026-07-03"),
      },
    });

    await prisma.statusReport.create({
      data: {
        tenantId: tenant.id,
        projectId: project.id,
        snapshotId: snapshot.id,
        createdById: users[seed.owner].id,
        title: "Status Report - " + seed.name,
        periodStart: date("2026-07-01"),
        periodEnd: date("2026-07-07"),
        version: 1,
        visibility: "EXECUTIVE",
        publishedAt: date("2026-07-03"),
        htmlContent:
          "<section><h1>" +
          seed.name +
          "</h1><p>" +
          seed.summary +
          "</p><ul>" +
          seed.nextSteps.map((step) => "<li>" + step + "</li>").join("") +
          "</ul></section>",
      },
    });

    await prisma.comment.create({
      data: {
        tenantId: tenant.id,
        authorId: users[seed.owner].id,
        entityType: "PROJECT",
        entityId: project.id,
        body: "Comentário inicial criado pelo seed V0.2.",
        visibility: "INTERNAL",
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      actorId: users["Tiago Figueiredo"].id,
      entityType: "TENANT",
      entityId: tenant.id,
      action: "SEED_V0_2",
      summary: "Seed inicial da fundação Prisma V0.2 executado.",
      metadata: { projects: projectSeeds.length },
    },
  });
}

main()
  .then(async () => {
    console.log("Seed V0.2 concluído com sucesso.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });


