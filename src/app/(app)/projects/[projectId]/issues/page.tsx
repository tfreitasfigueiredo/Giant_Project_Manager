import { notFound } from "next/navigation";

import { IssueCard } from "@/components/issues/IssueCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { getProjectIssues } from "@/lib/server/projects";

export const dynamic = "force-dynamic";

export default async function IssuesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const data = await getProjectIssues(projectId);

  if (!data) {
    notFound();
  }

  return (
    <PageContainer title="Pendências" description={`${data.project.name} · origem, responsável, prazo, impacto e próxima ação.`}>
      <div className="grid gap-4">
        {data.issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </PageContainer>
  );
}