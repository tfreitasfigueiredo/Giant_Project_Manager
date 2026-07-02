import { PageContainer } from "@/components/layout/PageContainer";
import { RiskCard } from "@/components/risks/RiskCard";
import { getProject, getProjectRisks } from "@/data/mock-data";

export default async function RisksPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = getProject(projectId);
  const risks = getProjectRisks(project.id);
  return <PageContainer title="Riscos" description={`${project.name} · severidade, impacto no go live, responsável e mitigação.`}><div className="grid gap-4">{risks.map((risk) => <RiskCard key={risk.id} risk={risk} />)}</div></PageContainer>;
}
