"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, Home, LayoutTemplate, ListChecks, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Cockpit", icon: Home },
  { href: "/projects", label: "Projetos", icon: FolderKanban },
  { href: "/my-actions", label: "Acoes", icon: ListChecks },
  { href: "/templates", label: "Modelos", icon: LayoutTemplate },
  { href: "/admin/users", label: "Admin", icon: UserRound },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className={cn("flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium text-slate-500", active && "bg-slate-950 text-white")}>
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
