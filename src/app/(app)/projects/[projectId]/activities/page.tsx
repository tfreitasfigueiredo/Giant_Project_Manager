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
    <PageContainer title="Atividades" description="Status, responsável, prazo, progresso e prioridade." showPageHeader={false}>
      <ProjectActivitiesManagement data={data} />
    </PageContainer>
  );
}
