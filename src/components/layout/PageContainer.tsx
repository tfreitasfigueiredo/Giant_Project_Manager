import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageContainer({ title, description, action, children, className }: PageContainerProps) {
  return (
    <section className={cn("flex w-full flex-col gap-6 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-3xl flex-col gap-2">
          <h2 className="text-xl font-bold tracking-normal text-slate-950 md:text-2xl">{title}</h2>
          {description ? <p className="text-sm leading-6 text-slate-600 md:text-base">{description}</p> : null}
        </div>
        {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
