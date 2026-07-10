"use client";

import type { ReactNode } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DialogFormContentProps = {
  children: ReactNode;
  className?: string;
};

type DialogFormHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

type DialogFormBodyProps = {
  children: ReactNode;
  className?: string;
};

type DialogFormFooterProps = {
  children: ReactNode;
  className?: string;
};

export function DialogFormContent({ children, className }: DialogFormContentProps) {
  return (
    <DialogContent
      className={cn(
        "flex max-h-[92vh] flex-col overflow-hidden border-slate-200 bg-white p-0 shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:max-w-3xl",
        className,
      )}
    >
      {children}
    </DialogContent>
  );
}

export function DialogFormHeader({ title, description, className }: DialogFormHeaderProps) {
  return (
    <DialogHeader className={cn("shrink-0 border-b border-slate-100 bg-white p-5 pr-14 sm:p-6 sm:pr-16", className)}>
      <DialogTitle className="text-xl font-bold text-slate-950">{title}</DialogTitle>
      {description ? <DialogDescription className="text-sm leading-6 text-slate-600">{description}</DialogDescription> : null}
    </DialogHeader>
  );
}

export function DialogFormBody({ children, className }: DialogFormBodyProps) {
  return <div className={cn("flex-1 overflow-y-auto p-5 sm:p-6", className)}>{children}</div>;
}

export function DialogFormFooter({ children, className }: DialogFormFooterProps) {
  return (
    <DialogFooter className={cn("mx-0 mb-0 shrink-0 rounded-none border-t border-slate-100 bg-white p-5 sm:p-6", className)}>
      {children}
    </DialogFooter>
  );
}
