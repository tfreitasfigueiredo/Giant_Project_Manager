import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectDashboard } from "@/components/projects/ProjectDashboard";

export default function DashboardPage() {
  return (
    <PageContainer
      title="Portfolio Giant Projects"
      description="Cockpit premium com KPIs executivos, projetos ativos, saude, riscos, pendencias e atividades recentes."
    >
      <ProjectDashboard />
    </PageContainer>
  );
}
