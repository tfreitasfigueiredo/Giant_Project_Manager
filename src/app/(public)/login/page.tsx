import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-slate-950 p-4 text-white lg:grid-cols-[0.9fr_1.1fr] lg:p-0">
      <section className="flex flex-col justify-between rounded-xl bg-white p-6 text-slate-950 lg:rounded-none lg:p-10">
        <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-md bg-slate-950 text-sm font-bold text-white">GP</div><span className="font-semibold">Giant Projects</span></div>
        <div className="mt-16 flex max-w-xl flex-col gap-4 lg:mt-0"><h1 className="text-4xl font-semibold tracking-normal lg:text-5xl">Gestao executiva de projetos sem planilhas paralelas.</h1><p className="text-base leading-7 text-slate-600">Cockpit executivo, riscos, pendencias, tempo e status report em uma unica experiencia responsiva.</p></div>
        <p className="mt-10 text-sm text-slate-500">Acesso demonstrativo. Autenticacao real sera conectada futuramente.</p>
      </section>
      <section className="flex items-center justify-center px-0 py-10 lg:px-10"><Card className="w-full max-w-md border-white/10 bg-white text-slate-950"><CardHeader><CardTitle>Acessar cockpit</CardTitle></CardHeader><CardContent className="flex flex-col gap-4"><div className="flex flex-col gap-2"><Label htmlFor="email">E-mail</Label><Input id="email" placeholder="voce@empresa.com" /></div><div className="flex flex-col gap-2"><Label htmlFor="password">Senha</Label><Input id="password" type="password" placeholder="Senha demonstrativa" /></div><Button asChild className="w-full"><Link href="/dashboard">Entrar <ArrowRight data-icon="inline-end" /></Link></Button><Link href="/forgot-password" className="text-center text-sm text-slate-500 hover:text-slate-950">Esqueci minha senha</Link></CardContent></Card></section>
    </main>
  );
}
