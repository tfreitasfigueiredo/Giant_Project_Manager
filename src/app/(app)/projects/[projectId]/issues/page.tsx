import { IssueCard } from "@/components/issues/IssueCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { getProject, getProjectIssues } from "@/data/mock-data";

export default async function IssuesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = getProject(projectId);
  const issues = getProjectIssues(project.id);
  return <PageContainer title="Pendências" description={`${project.name} · origem, responsável, prazo, impacto e próxima ação.`}><div className="grid gap-4">{issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)}</div></PageContainer>;
}
