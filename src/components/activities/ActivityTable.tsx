import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Activity } from "@/data/mock-data";
import { ActivityStatusBadge } from "./ActivityStatusBadge";

export function ActivityTable({ activities }: { activities: Activity[] }) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white lg:block">
      <Table>
        <TableHeader><TableRow><TableHead>Atividade</TableHead><TableHead>Status</TableHead><TableHead>Responsável</TableHead><TableHead>Prazo</TableHead><TableHead>Prioridade</TableHead><TableHead className="w-40">Progresso</TableHead></TableRow></TableHeader>
        <TableBody>{activities.map((activity) => <TableRow key={activity.id}><TableCell className="font-medium">{activity.title}<span className="block text-xs text-slate-500">{activity.phase}</span></TableCell><TableCell><ActivityStatusBadge status={activity.status} /></TableCell><TableCell>{activity.owner}</TableCell><TableCell>{activity.dueDate}</TableCell><TableCell>{activity.priority}</TableCell><TableCell><div className="flex items-center gap-2"><Progress value={activity.progress} /><span className="text-xs font-semibold">{activity.progress}%</span></div></TableCell></TableRow>)}</TableBody>
      </Table>
    </div>
  );
}
