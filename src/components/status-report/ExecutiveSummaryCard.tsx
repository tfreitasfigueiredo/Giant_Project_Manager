import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExecutiveSummaryCard({ title, summary }: { title: string; summary: string }) {
  return <Card className="border-slate-200"><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">{title}</CardTitle></CardHeader><CardContent><p className="text-base leading-7 text-slate-700">{summary}</p></CardContent></Card>;
}
