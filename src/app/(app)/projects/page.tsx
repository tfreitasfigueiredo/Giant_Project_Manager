import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectsList } from "@/components/projects/ProjectsList";

export default function ProjectsPage() {
  return <PageContainer title="Projetos" description="Filtre, acompanhe e acesse a visao executiva de cada iniciativa."><ProjectsList /></PageContainer>;
}
