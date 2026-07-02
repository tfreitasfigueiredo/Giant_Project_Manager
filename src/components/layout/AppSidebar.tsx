"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, FolderKanban, Home, LayoutTemplate, ListChecks, ShieldCheck, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Cockpit", icon: Home },
  { href: "/projects", label: "Projetos", icon: FolderKanban },
  { href: "/my-actions", label: "Minhas acoes", icon: ListChecks },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/companies", label: "Empresas", icon: Building2 },
  { href: "/admin/units", label: "Unidades", icon: ShieldCheck },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-slate-200 bg-slate-950 px-4 py-5 text-white lg:flex">
      <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2">
        <div className="flex size-10 items-center justify-center rounded-md bg-white text-sm font-bold text-slate-950">GP</div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-normal">Giant Projects</span>
          <span className="text-xs text-slate-400">Executive cockpit</span>
        </div>
      </Link>
      <nav className="mt-8 flex flex-col gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white",
                active && "bg-white text-slate-950 hover:bg-white hover:text-slate-950",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-medium">Carteira Julho</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">Foco em go lives, decisoes executivas e reducao de pendencias criticas.</p>
      </div>
    </aside>
  );
}
