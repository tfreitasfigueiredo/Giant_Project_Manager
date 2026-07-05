import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { getProjectsForList } from "@/lib/server/projects";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjectsForList();

  return (
    <PageContainer title="Projetos" description="Filtre, acompanhe e acesse a visao executiva de cada iniciativa.">
      <ProjectsList projects={projects} />
    </PageContainer>
  );
}
