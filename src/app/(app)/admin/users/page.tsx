import { ShieldCheck, UserRound, UsersRound } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const rows = [
  { name: "Mariana Costa", role: "Gerente de Projeto", status: "Ativo" },
  { name: "Rafael Nunes", role: "PMO", status: "Ativo" },
  { name: "Bianca Reis", role: "Produto de Dados", status: "Convidado" },
];

const activeUsers = rows.filter((row) => row.status === "Ativo").length;
const invitedUsers = rows.filter((row) => row.status === "Convidado").length;

export default function AdminPage() {
  return (
    <PageContainer title="Administração / Usuários" description="Gestão visual inicial de usuários e papéis.">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
          <CardContent className="flex min-h-28 items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-8 ring-blue-100">
              <UsersRound className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Usuários</p>
              <p className="mt-1 text-3xl font-bold text-slate-950">{rows.length}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Base inicial mockada</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
          <CardContent className="flex min-h-28 items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-8 ring-emerald-100">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Ativos</p>
              <p className="mt-1 text-3xl font-bold text-slate-950">{activeUsers}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Com acesso operacional</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
          <CardContent className="flex min-h-28 items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-full bg-orange-50 text-orange-700 ring-8 ring-orange-100">
              <UserRound className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Convites</p>
              <p className="mt-1 text-3xl font-bold text-slate-950">{invitedUsers}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Aguardando ativação</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
        <CardHeader className="border-b border-slate-100 bg-slate-50/70">
          <CardTitle className="text-base font-bold text-slate-950">Cadastro mockado</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-semibold text-slate-950">{row.name}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={row.status === "Ativo" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-orange-200 bg-orange-50 text-orange-700"}>
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
