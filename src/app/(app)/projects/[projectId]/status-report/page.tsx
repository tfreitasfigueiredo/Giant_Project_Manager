import { PageContainer } from "@/components/layout/PageContainer";
import { StatusReportView } from "@/components/status-report/StatusReportView";
import { getProject } from "@/data/mock-data";

export default async function StatusReportPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = getProject(projectId);
  return <PageContainer title="Status report" description={`${project.name} · versão web responsiva do report executivo.`}><StatusReportView /></PageContainer>;
}
