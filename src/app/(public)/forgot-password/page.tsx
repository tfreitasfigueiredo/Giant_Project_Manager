import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-slate-200"><CardHeader className="gap-2"><CardTitle>Recuperar acesso</CardTitle><p className="text-sm text-slate-500">Fluxo visual demonstrativo, sem envio real de e-mail.</p></CardHeader><CardContent className="flex flex-col gap-4"><div className="flex flex-col gap-2"><Label htmlFor="email">E-mail corporativo</Label><Input id="email" placeholder="voce@empresa.com" /></div><Button>Enviar instruções</Button><Button asChild variant="outline"><Link href="/login">Voltar para login</Link></Button></CardContent></Card>
    </main>
  );
}
