import { notFound } from "next/navigation";

import { ProjectActivitiesManagement } from "@/components/activities/ProjectActivitiesManagement";
import { PageContainer } from "@/components/layout/PageContainer";
import { getProjectActivitiesManagement } from "@/lib/server/projects";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const data = await getProjectActivitiesManagement(projectId);

  if (!data) {
    notFound();
  }

  return (
    <PageContainer title="Atividades" description={`${data.project.name} · status, responsável, prazo, progresso e prioridade.`}>
      <ProjectActivitiesManagement data={data} />
    </PageContainer>
  );
}
