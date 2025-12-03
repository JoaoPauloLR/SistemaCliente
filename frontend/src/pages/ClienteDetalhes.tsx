import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Edit, 
  Users, 
  MapPin, 
  Phone,
  Trash2,
  FileText,
  Clock,
  DollarSign,
  HelpCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const API_URL = "";

// 1. ATUALIZADO: Interface para incluir 'uf'
interface ClienteDetalhesType {
  CodigoCliente: number;
  nome: string;
  telefone: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string; // <-- ADICIONADO
}

interface OrdemServico {
  CodigoOS: number;
  DataDeEntrada: string;
  DataDeSaida?: string | null;
  Aparelho: string;
  Status?: string;
}

const formatLocalDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (!dateString.includes('T')) {
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  }
  return date.toLocaleDateString('pt-BR');
}

const ClienteDetalhes = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [cliente, setCliente] = useState<ClienteDetalhesType | null>(null);
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetalhesCliente = async () => {
      try {
        setIsLoading(true);
        const clienteResponse = await fetch(`${API_URL}/api/clientes/${id}`);
        if (!clienteResponse.ok) throw new Error('Cliente não encontrado');
        const clienteData = await clienteResponse.json();
        setCliente(clienteData);

        const osResponse = await fetch(`${API_URL}/api/os/cliente/${id}`);
        if (!osResponse.ok) throw new Error('Falha ao buscar OS do cliente');
        const osData = await osResponse.json();
        setOrdensServico(osData);

      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetalhesCliente();
  }, [id]);
  
  const handleDelete = async () => {
    if (!cliente) return;
    if (!window.confirm(`Tem certeza de que deseja excluir o cliente "${cliente.nome}"?`)) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/clientes/${cliente.CodigoCliente}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.message || 'Falha ao excluir o cliente.'); }
      toast({ title: "Sucesso!", description: `O cliente "${cliente.nome}" foi excluído.` });
      navigate("/clientes");
    } catch (error) {
      toast({ title: "Erro", description: error instanceof Error ? error.message : "Não foi possível excluir o cliente.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Carregando detalhes do cliente...</div>;
  }
  if (!cliente) {
    return <div className="text-center py-10">Cliente não encontrado.</div>;
  }

  const osAbertas = ordensServico.filter(os => os.Status === 'Aberto' || os.Status === 'Aguardando Aprovação');
  const osAguardandoPagamento = ordensServico.filter(os => os.Status === 'Aguardando Pagamento');
  const osFechadas = ordensServico.filter(os => os.Status === 'Fechado');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/clientes")} className="gap-2 flex-shrink-0">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-dark flex items-center gap-3">
              <Users className="h-8 w-8 text-corporate-blue" />
              Detalhes de: {cliente.nome}
            </h1>
            <p className="text-muted-foreground mt-1">Informações completas do cliente e histórico de serviços</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-9 w-9 flex-shrink-0 mt-1"
                aria-label="Abrir ajuda da página de detalhes do cliente"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-corporate-blue" />
                  Ajuda: Detalhes do Cliente
                </DialogTitle>
              </DialogHeader>
              <div className="text-sm text-muted-foreground space-y-4 mt-4">
                <p>Esta tela exibe todas as informações de um cliente específico, assim como o histórico completo de suas Ordens de Serviço (OS) no sistema.</p>
                <div>
                  <h4 className="font-semibold text-neutral-dark">Seções da Página:</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Informações do Cliente:</strong> Mostra os dados de contato e endereço do cliente.</li>
                    <li><strong>Ordens de Serviço Abertas:</strong> Lista todas as OS que ainda estão em andamento (status "Aberto" ou "Aguardando Aprovação").</li>
                    <li><strong>Aguardando Pagamento:</strong> Lista as OS que já foram concluídas mas aguardam o pagamento do cliente.</li>
                    <li><strong>Histórico de Serviços:</strong> Lista todas as OS que já foram pagas e finalizadas (status "Fechado").</li>
                    <li><strong>Botões de Ação:</strong> Permitem editar o cadastro do cliente ou excluí-lo do sistema (se não houver OS vinculada).</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex gap-2 flex-shrink-0">
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
                <Trash2 className="h-4 w-4" /> Excluir
            </Button>
            <Button variant="corporate" onClick={() => navigate(`/clientes/${id}/editar`)} className="gap-2">
                <Edit className="h-4 w-4" /> Editar
            </Button>
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-corporate-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="font-medium">{cliente.nome}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-corporate-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{cliente.telefone}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-corporate-blue mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço Completo</p>
                  {/* 2. ATUALIZADO: JSX para mostrar a cidade e UF */}
                  <p className="font-medium">
                    {cliente.endereco}<br />
                    {cliente.bairro}, {cliente.cidade} - {cliente.uf}<br/>
                    {cliente.cep && `CEP: ${cliente.cep}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Clock className="h-5 w-5 text-warning-yellow"/> Ordens de Serviço Abertas ({osAbertas.length})</CardTitle>
        </CardHeader>
        <CardContent>
           <Table>
             <TableHeader><TableRow><TableHead>Nº da OS</TableHead><TableHead>Data de Entrada</TableHead><TableHead>Aparelho</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {osAbertas.length > 0 ? osAbertas.map((os) => (
                   <TableRow key={os.CodigoOS}>
                      <TableCell className="font-medium">#{os.CodigoOS}</TableCell>
                      <TableCell>{formatLocalDate(os.DataDeEntrada)}</TableCell>
                      <TableCell>{os.Aparelho}</TableCell>
                      <TableCell><Badge variant={os.Status === 'Aberto' ? 'warning' : 'secondary'}>{os.Status}</Badge></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => navigate(`/ordens-servico/${os.CodigoOS}`)}>Ver OS</Button></TableCell>
                   </TableRow>
                )) : (<TableRow><TableCell colSpan={5} className="text-center py-4">Nenhuma OS em aberto.</TableCell></TableRow>)}
              </TableBody>
           </Table>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><DollarSign className="h-5 w-5 text-corporate-blue"/> Aguardando Pagamento ({osAguardandoPagamento.length})</CardTitle>
        </CardHeader>
        <CardContent>
           <Table>
             <TableHeader><TableRow><TableHead>Nº da OS</TableHead><TableHead>Data de Saída</TableHead><TableHead>Aparelho</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {osAguardandoPagamento.length > 0 ? osAguardandoPagamento.map((os) => (
                   <TableRow key={os.CodigoOS}>
                      <TableCell className="font-medium">#{os.CodigoOS}</TableCell>
                      <TableCell>{formatLocalDate(os.DataDeSaida)}</TableCell>
                      <TableCell>{os.Aparelho}</TableCell>
                      <TableCell><Badge className="bg-corporate-blue text-white hover:bg-corporate-blue/90">{os.Status}</Badge></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => navigate(`/ordens-servico/${os.CodigoOS}`)}>Ver OS</Button></TableCell>
                   </TableRow>
                )) : (<TableRow><TableCell colSpan={5} className="text-center py-4">Nenhuma OS aguardando pagamento.</TableCell></TableRow>)}
              </TableBody>
           </Table>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5 text-success-green"/> Histórico de Serviços ({osFechadas.length})</CardTitle>
        </CardHeader>
        <CardContent>
           <Table>
             <TableHeader><TableRow><TableHead>Nº da OS</TableHead><TableHead>Data de Entrada</TableHead><TableHead>Data de Saída</TableHead><TableHead>Aparelho</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {osFechadas.length > 0 ? osFechadas.map((os) => (
                   <TableRow key={os.CodigoOS}>
                      <TableCell className="font-medium">#{os.CodigoOS}</TableCell>
                      <TableCell>{formatLocalDate(os.DataDeEntrada)}</TableCell>
                      <TableCell>{formatLocalDate(os.DataDeSaida)}</TableCell>
                      <TableCell>{os.Aparelho}</TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => navigate(`/ordens-servico/${os.CodigoOS}`)}>Ver OS</Button></TableCell>
                   </TableRow>
                )) : (<TableRow><TableCell colSpan={5} className="text-center py-4">Nenhum serviço finalizado no histórico.</TableCell></TableRow>)}
              </TableBody>
           </Table>
        </CardContent>
      </Card>

    </div>
  );
};

export default ClienteDetalhes;