import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectDashboard } from "@/components/projects/ProjectDashboard";
import { ExecutiveSummaryCard } from "@/components/status-report/ExecutiveSummaryCard";
import { statusReport } from "@/data/mock-data";

export default function DashboardPage() {
  return <PageContainer title="Cockpit executivo" description="Visao consolidada da carteira, com foco em go lives, decisoes e pendencias executivas."><ExecutiveSummaryCard title="Leitura da semana" summary={statusReport.executiveNarrative} /><ProjectDashboard /></PageContainer>;
}
