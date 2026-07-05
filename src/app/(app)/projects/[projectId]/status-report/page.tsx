import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { StatusReportView } from "@/components/status-report/StatusReportView";
import { getProjectStatusReport } from "@/lib/server/projects";

export const dynamic = "force-dynamic";

export default async function StatusReportPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const report = await getProjectStatusReport(projectId);

  if (!report) {
    notFound();
  }

  return (
    <PageContainer title="Status report" description={`${report.project.name} · versão web responsiva do report executivo.`}>
      <StatusReportView report={report} />
    </PageContainer>
  );
}