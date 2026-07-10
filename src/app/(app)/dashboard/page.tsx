import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectDashboard } from "@/components/projects/ProjectDashboard";
import { getDashboardData } from "@/lib/server/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  return (
    <PageContainer
      title="Portfólio Giant Projects"
      description="Cockpit premium com KPIs executivos, projetos ativos, saúde, riscos, pendências e atividades recentes."
      showPageHeader={false}
    >
      <ProjectDashboard data={dashboardData} />
    </PageContainer>
  );
}
