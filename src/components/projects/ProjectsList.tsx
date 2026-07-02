"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { projects } from "@/data/mock-data";
import { ProjectCard } from "./ProjectCard";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

export function ProjectsList() {
  const [status, setStatus] = useState("all");
  const [client, setClient] = useState("all");
  const clients = Array.from(new Set(projects.map((project) => project.client)));
  const filtered = useMemo(() => projects.filter((project) => (status === "all" || project.status === status) && (client === "all" || project.client === client)), [client, status]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os status</SelectItem><SelectItem value="on-track">No prazo</SelectItem><SelectItem value="attention">Atencao</SelectItem><SelectItem value="critical">Critico</SelectItem></SelectContent></Select>
          <Select value={client} onValueChange={setClient}><SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Cliente" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os clientes</SelectItem>{clients.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
        </div>
        <Button asChild><Link href="/projects/new"><Plus data-icon="inline-start" />Novo Projeto</Link></Button>
      </div>
      <div className="grid gap-4 lg:hidden">{filtered.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white lg:block">
        <Table>
          <TableHeader><TableRow><TableHead>Projeto</TableHead><TableHead>Cliente</TableHead><TableHead>Status</TableHead><TableHead>Fase</TableHead><TableHead>Go live</TableHead><TableHead className="text-right">Avanco</TableHead></TableRow></TableHeader>
          <TableBody>{filtered.map((project) => <TableRow key={project.id}><TableCell className="font-medium"><Link href={`/projects/${project.id}`}>{project.name}</Link></TableCell><TableCell>{project.client}</TableCell><TableCell><ProjectStatusBadge status={project.status} /></TableCell><TableCell>{project.phase}</TableCell><TableCell>{project.goLive}</TableCell><TableCell className="text-right font-semibold">{project.progress}%</TableCell></TableRow>)}</TableBody>
        </Table>
      </div>
    </div>
  );
}
