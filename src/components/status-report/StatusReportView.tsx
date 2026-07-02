import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { projects, statusReport } from "@/data/mock-data";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { MobileStatusStory } from "./MobileStatusStory";

export function StatusReportView() {
  return (
    <div className="flex flex-col gap-5">
      <MobileStatusStory projects={projects} />
      <div className="hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm lg:block">
        <div className="flex items-start justify-between gap-6"><div className="flex flex-col gap-2"><p className="text-sm font-medium text-slate-500">{statusReport.period}</p><h2 className="text-3xl font-semibold text-slate-950">{statusReport.title}</h2></div><div className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Giant Projects</div></div>
        <Separator className="my-6" />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"><Card className="border-slate-200 shadow-none"><CardHeader><CardTitle>Resumo executivo</CardTitle></CardHeader><CardContent><p className="text-lg leading-8 text-slate-700">{statusReport.executiveNarrative}</p></CardContent></Card><Card className="border-slate-200 shadow-none"><CardHeader><CardTitle>Proximos passos</CardTitle></CardHeader><CardContent className="flex flex-col gap-3">{statusReport.nextSteps.map((step) => <div key={step} className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">{step}</div>)}</CardContent></Card></div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">{projects.map((project) => <Card key={project.id} className="border-slate-200 shadow-none"><CardHeader className="gap-3"><div className="flex items-center justify-between gap-3"><CardTitle className="text-base">{project.name}</CardTitle><ProjectStatusBadge status={project.status} /></div></CardHeader><CardContent className="flex flex-col gap-3 text-sm text-slate-600"><p>{project.executiveSummary}</p><div className="grid grid-cols-3 gap-2 text-center"><div className="rounded-md bg-slate-50 p-2"><p className="font-semibold text-slate-950">{project.progress}%</p><p>avanço</p></div><div className="rounded-md bg-slate-50 p-2"><p className="font-semibold text-slate-950">{project.highRisks}</p><p>riscos</p></div><div className="rounded-md bg-slate-50 p-2"><p className="font-semibold text-slate-950">{project.goLive}</p><p>go live</p></div></div></CardContent></Card>)}</div>
      </div>
    </div>
  );
}

