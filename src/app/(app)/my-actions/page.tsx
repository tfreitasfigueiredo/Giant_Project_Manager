import { PageContainer } from "@/components/layout/PageContainer";
import { IssueCard } from "@/components/issues/IssueCard";
import { issues } from "@/data/mock-data";

export default function MyActionsPage() {
  return <PageContainer title="Minhas Ações" description="Pendências e decisões que precisam de encaminhamento executivo."><div className="grid gap-4">{issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)}</div></PageContainer>;
}
