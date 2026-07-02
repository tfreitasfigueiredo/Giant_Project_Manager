import { ActivityCard } from "@/components/activities/ActivityCard";
import { ActivityTable } from "@/components/activities/ActivityTable";
import { PageContainer } from "@/components/layout/PageContainer";
import { getProject, getProjectActivities } from "@/data/mock-data";

export default async function ActivitiesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = getProject(projectId);
  const activities = getProjectActivities(project.id);
  return <PageContainer title="Atividades" description={`${project.name} · status, responsavel, prazo, progresso e prioridade.`}><div className="grid gap-4 lg:hidden">{activities.map((activity) => <ActivityCard key={activity.id} activity={activity} />)}</div><ActivityTable activities={activities} /></PageContainer>;
}
