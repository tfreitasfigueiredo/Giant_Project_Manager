"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Project } from "@/data/mock-data";
import { ProjectCard } from "./ProjectCard";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

export function ProjectsList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const [client, setClient] = useState("all");
  const clients = Array.from(new Set(projects.map((project) => project.client)));
  const filtered = useMemo(() => projects.filter((project) => (status === "all" || project.status === status) && (client === "all" || project.client === client)), [client, projects, status]);
  const activeFilterCount = [status, client].filter((value) => value !== "all").length;
  const hasActiveFilters = activeFilterCount > 0;

  function clearFilters() {
    setStatus("all");
    setClient("all");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200">
              <SlidersHorizontal className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">Filtros</p>
              <p className="text-xs font-medium text-slate-500">Refine a carteira por status e cliente.</p>
            </div>
            <Badge variant="secondary" className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
              {activeFilterCount} {activeFilterCount === 1 ? "ativo" : "ativos"}
            </Badge>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <span className="text-sm font-semibold text-slate-600">
              {filtered.length} {filtered.length === 1 ? "projeto encontrado" : "projetos encontrados"}
            </span>
            {hasActiveFilters ? (
              <Button type="button" variant="outline" size="sm" onClick={clearFilters} className="border-slate-200 bg-white text-slate-700 hover:bg-slate-100">
                Limpar filtros
              </Button>
            ) : null}
            <Button asChild>
              <Link href="/projects/new">
                <Plus data-icon="inline-start" />
                Novo Projeto
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-full bg-white md:w-48"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="on-track">No prazo</SelectItem>
              <SelectItem value="attention">Atenção</SelectItem>
              <SelectItem value="critical">Crítico</SelectItem>
            </SelectContent>
          </Select>
          <Select value={client} onValueChange={setClient}>
            <SelectTrigger className="h-10 w-full bg-white md:w-56"><SelectValue placeholder="Cliente" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos os clientes</SelectItem>{clients.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 lg:hidden">{filtered.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white lg:block">
        <Table>
          <TableHeader><TableRow><TableHead>Projeto</TableHead><TableHead>Cliente</TableHead><TableHead>Status</TableHead><TableHead>Fase</TableHead><TableHead>Go live</TableHead><TableHead className="text-right">Avanço</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((project) => (
              <TableRow
                key={project.id}
                role="link"
                tabIndex={0}
                className="cursor-pointer transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
                onClick={() => router.push(`/projects/${project.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") router.push(`/projects/${project.id}`);
                }}
              >
                <TableCell className="font-medium text-slate-950">{project.name}</TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell><ProjectStatusBadge status={project.status} /></TableCell>
                <TableCell>{project.phase}</TableCell>
                <TableCell>{project.goLive}</TableCell>
                <TableCell className="text-right font-semibold">{project.progress}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
