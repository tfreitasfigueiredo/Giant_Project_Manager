import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Activity } from "@/data/mock-data";
import { ActivityStatusBadge } from "./ActivityStatusBadge";

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="gap-3 pb-3">
        <div className="flex items-start justify-between gap-3"><CardTitle className="text-base">{activity.title}</CardTitle><ActivityStatusBadge status={activity.status} /></div>
        <p className="text-sm text-slate-500">{activity.phase} · {activity.owner} · prazo {activity.dueDate}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm"><span className="text-slate-500">Prioridade {activity.priority}</span><span className="font-semibold">{activity.progress}%</span></div>
        <Progress value={activity.progress} />
      </CardContent>
    </Card>
  );
}
