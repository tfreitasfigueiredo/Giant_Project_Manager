import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const rows = [
  {
    "name": "Mariana Costa",
    "role": "Gerente de Projeto",
    "status": "Ativo"
  },
  {
    "name": "Rafael Nunes",
    "role": "PMO",
    "status": "Ativo"
  },
  {
    "name": "Bianca Reis",
    "role": "Produto de Dados",
    "status": "Convidado"
  }
];

export default function AdminPage() {
  return (
    <PageContainer title="Usuarios" description="Gestao visual inicial de usuarios e papeis.">
      <Card className="border-slate-200">
        <CardHeader><CardTitle>Cadastro mockado</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Perfil</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{rows.map((row) => <TableRow key={row.name}><TableCell className="font-medium">{row.name}</TableCell><TableCell>{row.role}</TableCell><TableCell>{row.status}</TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
