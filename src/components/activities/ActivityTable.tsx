import type { ReactNode } from "react";

import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Activity } from "@/types/project-activities";
import { ActivityStatusBadge } from "./ActivityStatusBadge";

export function ActivityTable({
  activities,
  renderAction,
}: {
  activities: Activity[];
  renderAction?: (activity: Activity) => ReactNode;
}) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] lg:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Atividade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead className="w-40">Progresso</TableHead>
            {renderAction ? <TableHead className="w-32 text-right">Ação</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">
                {activity.title}
                <span className="block text-xs text-slate-500">
                  #{activity.orderIndex} · {activity.phase}
                </span>
              </TableCell>
              <TableCell>
                <ActivityStatusBadge status={activity.status} />
              </TableCell>
              <TableCell>{activity.owner}</TableCell>
              <TableCell>{activity.dueDate}</TableCell>
              <TableCell>{activity.priority}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={activity.progress} />
                  <span className="text-xs font-semibold">{activity.progress}%</span>
                </div>
              </TableCell>
              {renderAction ? <TableCell className="text-right">{renderAction(activity)}</TableCell> : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
