"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const labels: Record<string, string> = {
  dashboard: "Cockpit executivo",
  projects: "Projetos",
  "my-actions": "Minhas acoes",
  templates: "Templates",
  admin: "Administracao",
};

export function AppHeader() {
  const pathname = usePathname();
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:ml-72 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-slate-950 p-0 text-white">
            <SheetTitle className="sr-only">Menu principal</SheetTitle>
            <div className="flex h-full flex-col gap-6 p-5">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-md bg-white text-sm font-bold text-slate-950">GP</div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Giant Projects</span>
                  <span className="text-xs text-slate-400">Executive cockpit</span>
                </div>
              </Link>
              <div className="grid gap-2 text-sm">
                {[
                  ["/dashboard", "Cockpit"],
                  ["/projects", "Projetos"],
                  ["/my-actions", "Minhas acoes"],
                  ["/templates", "Templates"],
                  ["/admin/users", "Usuarios"],
                  ["/admin/companies", "Empresas"],
                  ["/admin/units", "Unidades"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="rounded-md px-3 py-2 text-slate-200 hover:bg-white/10">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
          <span>Giant Manager</span>
          <ChevronRight className="size-4" />
          <span className="truncate font-medium text-slate-950">{labels[firstSegment] ?? "Projetos"}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" aria-label="Buscar"><Search /></Button>
        <Button variant="outline" size="icon" aria-label="Notificacoes"><Bell /></Button>
      </div>
    </header>
  );
}
