import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Activity } from "@/types/project-activities";
import { ActivityStatusBadge } from "./ActivityStatusBadge";

type ActivityCardData = Pick<Activity, "id" | "title" | "phase" | "owner" | "dueDate" | "status" | "progress" | "priority"> &
  Partial<Pick<Activity, "description" | "orderIndex">>;

export function ActivityCard({ activity, action }: { activity: ActivityCardData; action?: ReactNode }) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
      <CardHeader className="gap-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {typeof activity.orderIndex === "number" ? (
                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                  #{activity.orderIndex}
                </span>
              ) : null}
              <ActivityStatusBadge status={activity.status} />
            </div>
            <CardTitle className="text-base leading-6">{activity.title}</CardTitle>
          </div>
          {action}
        </div>
        {activity.description ? <p className="text-sm leading-6 text-slate-600">{activity.description}</p> : null}
        <p className="text-sm text-slate-500">
          {activity.phase} · {activity.owner} · prazo {activity.dueDate}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Prioridade {activity.priority}</span>
          <span className="font-semibold">{activity.progress}%</span>
        </div>
        <Progress value={activity.progress} />
      </CardContent>
    </Card>
  );
}
