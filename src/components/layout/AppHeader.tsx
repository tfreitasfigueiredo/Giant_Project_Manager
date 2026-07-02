"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Download, Filter, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const labels: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Visao Geral Executiva",
    subtitle: "Performance da carteira, projetos em risco e pendencias criticas",
  },
  projects: {
    title: "Projetos",
    subtitle: "Acompanhamento executivo por iniciativa, cliente e fase",
  },
  "my-actions": {
    title: "Minhas acoes",
    subtitle: "Decisoes e pendencias que precisam de direcionamento",
  },
  templates: {
    title: "Templates",
    subtitle: "Modelos de governanca para acelerar novos projetos",
  },
  admin: {
    title: "Administracao",
    subtitle: "Cadastros mockados de usuarios, empresas e unidades",
  },
};

const menuItems = [
  ["/dashboard", "Visao Geral"],
  ["/projects", "Projetos"],
  ["/projects/boge-implantacao-operacional/risks", "Riscos"],
  ["/projects/boge-implantacao-operacional/issues", "Pendencias"],
  ["/my-actions", "Minhas acoes"],
  ["/templates", "Templates"],
  ["/admin/users", "Usuarios"],
];

export function AppHeader() {
  const pathname = usePathname();
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  const current = labels[firstSegment] ?? labels.projects;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/92 px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl sm:px-6 lg:ml-72 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 rounded-xl border-slate-200 lg:hidden" aria-label="Abrir menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 border-white/10 bg-[linear-gradient(180deg,#061733_0%,#071f44_54%,#041225_100%)] p-0 text-white">
              <SheetTitle className="sr-only">Menu principal</SheetTitle>
              <div className="flex h-full flex-col gap-6 p-5">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-300 to-blue-600 text-sm font-black text-white">GP</div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold leading-none">GIANT</span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">Projects</span>
                  </div>
                </Link>
                <div className="grid gap-2 text-sm">
                  {menuItems.map(([href, label]) => (
                    <Link key={href} href={href} className="rounded-xl px-3 py-2 text-slate-200 hover:bg-white/10">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-normal text-slate-950 md:text-[28px]">{current.title}</h1>
            <p className="mt-1 hidden text-sm text-slate-500 sm:block">{current.subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
          <Button variant="outline" className="h-10 justify-center rounded-xl border-slate-200 bg-white px-3 text-xs font-semibold shadow-sm sm:text-sm">
            <CalendarDays data-icon="inline-start" />
            Jul 2026
          </Button>
          <Button variant="outline" className="h-10 justify-center rounded-xl border-slate-200 bg-white px-3 text-xs font-semibold shadow-sm sm:text-sm">
            <Filter data-icon="inline-start" />
            Filtros
          </Button>
          <Button className="h-10 justify-center rounded-xl bg-slate-950 px-3 text-xs font-semibold text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800 sm:text-sm">
            <Download data-icon="inline-start" />
            Exportar
          </Button>
        </div>
      </div>
    </header>
  );
}
