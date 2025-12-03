import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { PlusCircle, Search, Eye, Edit, FileText, Calendar, Trash2, ChevronDown, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const API_URL = "https://api-sistemacliente.onrender.com";
const ITEMS_PER_PAGE = 10;

interface OrdemServico {
  CodigoOS: number;
  NomeCliente: string;
  Aparelho: string;
  DataDeEntrada: string;
  DataDeSaida?: string | null;
  Status?: string;
  total: number;
}

const OrdensServico = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrdensServico = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/os`);
        if (!response.ok) { throw new Error("Falha ao buscar Ordens de Serviço"); }
        const data = await response.json();
        setOrdensServico(data);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrdensServico();
  }, []);
  
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  const handleDelete = async (osId: number) => {
    if (!window.confirm(`Tem certeza de que deseja excluir a OS Nº ${osId}? Esta ação não pode ser desfeita.`)) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/os/${osId}`, { method: 'DELETE' });
      if (!response.ok) { throw new Error('Falha ao excluir a Ordem de Serviço.'); }
      setOrdensServico(prevOrdens => prevOrdens.filter(os => os.CodigoOS !== osId));
      toast({ title: "Sucesso!", description: `A Ordem de Serviço Nº ${osId} foi excluída.` });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível excluir a Ordem de Serviço.", variant: "destructive" });
    }
  };
  
  const handleStatusChange = async (osId: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/api/os/${osId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) { throw new Error('Falha ao atualizar o status.'); }

      setOrdensServico(prevOrdens =>
        prevOrdens.map(os => 
          os.CodigoOS === osId 
            ? { ...os, Status: newStatus, DataDeSaida: (newStatus === 'Fechado' || newStatus === 'Aguardando Pagamento') ? new Date().toISOString() : os.DataDeSaida } 
            : os
        )
      );

      toast({ title: "Sucesso!", description: `O status da OS Nº ${osId} foi atualizado.` });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível atualizar o status da Ordem de Serviço.", variant: "destructive" });
    }
  };

  const getStatus = (os: OrdemServico): { text: string; className: string } => {
    const textoParaExibir = os.Status ?? (os.DataDeSaida ? 'Fechado' : 'Aberto');
    const statusParaLogica = textoParaExibir.toLowerCase();
    switch (statusParaLogica) {
        case 'aberto':
            return { text: "Aberto", className: "bg-warning-yellow text-yellow-900 hover:bg-warning-yellow/90" };
        case 'aguardando aprovação':
            return { text: "Aguardando Aprovação", className: "bg-gray-300 text-gray-800 hover:bg-gray-300/90" };
        case 'aguardando pagamento':
            return { text: "Aguardando Pagamento", className: "bg-corporate-blue text-white hover:bg-corporate-blue/90"};
        case 'fechado':
            return { text: "Fechado", className: "bg-success-green text-white hover:bg-success-green/90" };
        default:
            return { text: textoParaExibir, className: "" };
    }
  };

  const filteredOS = ordensServico.filter((os) => {
    const matchesSearch =
      os.NomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.Aparelho.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.CodigoOS.toString().includes(searchTerm);

    const statusAtual = os.Status?.toLowerCase() ?? (os.DataDeSaida ? 'fechado' : 'aberto');

    const statusMatchesFilter = () => {
      if (statusFilter === "todas") return true;
      if (statusFilter === "em aberto" && statusAtual === "aberto") return true;
      if (statusFilter === "fechadas" && statusAtual === "fechado") return true;
      if (statusFilter === "em aprovação" && statusAtual === "aguardando aprovação") return true;
      if (statusFilter === "aguardando pagamento" && statusAtual === "aguardando pagamento") return true;
      return false;
    };

    return matchesSearch && statusMatchesFilter();
  });
  
  const totalPages = Math.ceil(filteredOS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOS = filteredOS.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-dark flex items-center gap-3">
                <FileText className="h-8 w-8 text-corporate-blue" />
                Gerenciamento de Ordens de Serviço
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie todas as ordens de serviço do sistema
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-9 w-9 flex-shrink-0 mt-1"
                  aria-label="Abrir ajuda da página de Ordens de Serviço"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-corporate-blue" />
                    Ajuda: Gerenciamento de OS
                  </DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground space-y-4 mt-4">
                  <p>Esta página centraliza todas as Ordens de Serviço (OS) do seu sistema, permitindo um controle completo do fluxo de trabalho.</p>
                  
                  <div>
                    <h4 className="font-semibold text-neutral-dark">Filtros e Busca:</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Busca:</strong> Procure uma OS específica digitando o Nº da OS, o nome do cliente ou o nome do aparelho.</li>
                      <li><strong>Filtro de Status:</strong> Selecione um status para visualizar apenas as OS que se encaixam naquela categoria (ex: ver apenas as que estão "Aguardando Pagamento").</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-neutral-dark">Ações na Tabela:</h4>
                     <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Menu de Ações Rápidas (▼):</strong> Permite alterar o status de uma OS diretamente da lista, agilizando o fluxo de trabalho. As opções mudam de acordo com o status atual.</li>
                      <li><strong>Ver Detalhes:</strong> Abre a página com todas as informações da OS, incluindo valores e descrições de serviço, além de uma versão para impressão.</li>
                      <li><strong>Editar:</strong> Leva você ao formulário para alterar qualquer informação da OS.</li>
                      <li><strong>Excluir:</strong> Remove permanentemente a OS do sistema.</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
        </div>
        <Button variant="corporate" size="lg" onClick={() => navigate("/ordens-servico/nova")} className="gap-2 flex-shrink-0">
          <PlusCircle className="h-5 w-5" /> Criar Nova OS
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Buscar Ordens de Serviço</CardTitle>
          <CardDescription>Busque por nº da OS, nome do cliente ou aparelho e filtre por status.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-4 flex-wrap" onSubmit={(e) => e.preventDefault()}>
            <Input
              placeholder="Digite o termo de busca..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="h-11 flex-1"
            />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-11 border rounded-md px-3 text-sm"
            >
              <option value="todas">Todas</option>
              <option value="em aberto">Em aberto</option>
              <option value="em aprovação">Aguardando Aprovação</option>
              <option value="aguardando pagamento">Aguardando Pagamento</option>
              <option value="fechadas">Fechadas</option>
            </select>
            <Button variant="corporate" size="lg" className="gap-2">
              <Search className="h-4 w-4" /> Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Resultados ({filteredOS.length} ordens de serviço)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº da OS</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Aparelho</TableHead>
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead className="text-right w-[180px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell></TableRow>
                ) : paginatedOS.length > 0 ? (
                  paginatedOS.map((os) => {
                    const statusInfo = getStatus(os);
                    const statusAtual = (os.Status ?? (os.DataDeSaida ? 'Fechado' : 'Aberto')).toLowerCase();
                    
                    return (
                      <TableRow key={os.CodigoOS} className="hover:bg-neutral-light/50">
                        <TableCell className="font-medium">#{os.CodigoOS}</TableCell>
                        <TableCell>{os.NomeCliente}</TableCell>
                        <TableCell>{os.Aparelho}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(os.DataDeEntrada).toLocaleDateString("pt-BR", {timeZone: 'UTC'})}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusInfo.className}>{statusInfo.text}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(os.total)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1">
                            {statusAtual !== 'fechado' && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ChevronDown className="h-4 w-4" />
                                            <span className="sr-only">Abrir menu de ações</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {statusAtual === 'aguardando aprovação' && (
                                            <DropdownMenuItem onClick={() => handleStatusChange(os.CodigoOS, 'Aberto')}>Aprovar OS</DropdownMenuItem>
                                        )}
                                        {(statusAtual === 'aberto' || statusAtual === 'aguardando aprovação') && (
                                            <DropdownMenuItem onClick={() => handleStatusChange(os.CodigoOS, 'Aguardando Pagamento')}>Aguardar Pagamento</DropdownMenuItem>
                                        )}
                                        {(statusAtual === 'aberto' || statusAtual === 'aguardando aprovação') && (
                                            <DropdownMenuItem onClick={() => handleStatusChange(os.CodigoOS, 'Fechado')}>Fechar OS (Pago)</DropdownMenuItem>
                                        )}
                                        {statusAtual === 'aguardando pagamento' && (
                                            <DropdownMenuItem onClick={() => handleStatusChange(os.CodigoOS, 'Fechado')}>Confirmar Pagamento</DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            {/* VERSÃO CORRIGIDA DOS BOTÕES DE AÇÃO */}
                            <Button variant="outline" size="sm" onClick={() => navigate(`/ordens-servico/${os.CodigoOS}`)} className="group flex items-center justify-center p-2 h-9 w-9 hover:w-32 transition-all duration-300">
                              <Eye className="h-4 w-4" />
                              <span className="max-w-0 group-hover:max-w-full overflow-hidden transition-all duration-300 whitespace-nowrap group-hover:ml-2">Ver Detalhes</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/ordens-servico/${os.CodigoOS}/editar`)} className="group flex items-center justify-center p-2 h-9 w-9 hover:w-24 transition-all duration-300">
                              <Edit className="h-4 w-4" />
                               <span className="max-w-0 group-hover:max-w-full overflow-hidden transition-all duration-300 whitespace-nowrap group-hover:ml-2">Editar</span>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(os.CodigoOS)} className="group flex items-center justify-center p-2 h-9 w-9 hover:w-24 transition-all duration-300">
                              <Trash2 className="h-4 w-4" />
                               <span className="max-w-0 group-hover:max-w-full overflow-hidden transition-all duration-300 whitespace-nowrap group-hover:ml-2">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhuma ordem de serviço encontrada.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page); }} isActive={currentPage === page}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdensServico;