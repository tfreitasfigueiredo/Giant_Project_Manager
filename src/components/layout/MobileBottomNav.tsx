"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, FolderKanban, Home, ListChecks, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Visao Geral", icon: Home },
  { href: "/projects", label: "Projetos", icon: FolderKanban },
  { href: "/projects/boge-implantacao-operacional/risks", label: "Riscos", icon: AlertTriangle },
  { href: "/projects/boge-implantacao-operacional/issues", label: "Pendencias", icon: ListChecks },
  { href: "/templates", label: "Mais", icon: MoreHorizontal },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/96 px-2 py-2 shadow-[0_-16px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold text-slate-500 transition",
                active && "bg-slate-950 text-white shadow-lg shadow-slate-950/20",
              )}
            >
              <Icon className="size-4" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
