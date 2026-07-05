import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { RiskCard } from "@/components/risks/RiskCard";
import { getProjectRisks } from "@/lib/server/projects";

export const dynamic = "force-dynamic";

export default async function RisksPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const data = await getProjectRisks(projectId);

  if (!data) {
    notFound();
  }

  return (
    <PageContainer title="Riscos" description={`${data.project.name} · severidade, impacto no go live, responsável e mitigação.`}>
      <div className="grid gap-4">
        {data.risks.map((risk) => (
          <RiskCard key={risk.id} risk={risk} />
        ))}
      </div>
    </PageContainer>
  );
}