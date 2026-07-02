import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const rows = [
  {
    "name": "BOGE",
    "role": "Cliente",
    "status": "Ativo"
  },
  {
    "name": "Grupo Mirassol",
    "role": "Holding",
    "status": "Ativo"
  },
  {
    "name": "Comercial",
    "role": "Area interna",
    "status": "Ativo"
  }
];

export default function AdminPage() {
  return (
    <PageContainer title="Empresas" description="Empresas e clientes disponiveis para a carteira.">
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
