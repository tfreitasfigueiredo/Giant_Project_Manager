"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  FileText,
  FolderKanban,
  Home,
  LayoutTemplate,
  ListChecks,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Visao Geral", icon: Home },
  { href: "/projects", label: "Projetos", icon: FolderKanban },
  { href: "/projects/boge-implantacao-operacional/risks", label: "Riscos", icon: AlertTriangle },
  { href: "/projects/boge-implantacao-operacional/issues", label: "Pendencias", icon: ListChecks },
  { href: "/my-actions", label: "Minhas acoes", icon: BarChart3 },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/companies", label: "Empresas", icon: Building2 },
  { href: "/admin/units", label: "Unidades", icon: ShieldCheck },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#061733_0%,#071f44_54%,#041225_100%)] px-4 py-5 text-white shadow-[18px_0_50px_rgba(15,23,42,0.16)] lg:flex">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_30%_0%,rgba(59,130,246,0.35),transparent_60%)]" />
      <Link href="/dashboard" className="relative flex items-center gap-3 rounded-xl px-3 py-2">
        <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-300 to-blue-600 text-sm font-black text-white shadow-lg shadow-blue-950/30">GP</div>
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-none tracking-normal">GIANT</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">Projects</span>
        </div>
      </Link>

      <nav className="relative mt-8 flex flex-col gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white",
                active && "bg-white/15 text-white shadow-[inset_3px_0_0_rgba(96,165,250,0.95)]",
              )}
            >
              <Icon className="size-4 text-slate-300 transition group-hover:text-white" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative mt-auto flex flex-col gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/8 p-4 shadow-lg shadow-slate-950/20">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="size-4 text-sky-200" />
            Carteira Julho
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-300">Foco em go lives, decisoes executivas e reducao de pendencias criticas.</p>
        </div>
        <Link href="/admin/users" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white">
          <Settings className="size-4" />
          Configuracoes
        </Link>
      </div>
    </aside>
  );
}
