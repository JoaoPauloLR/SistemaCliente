import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// 1. ADICIONADO: Ícones e componentes de Dialog
import { 
  PlusCircle, 
  Search, 
  Eye, 
  Edit, 
  FileText,
  Users,
  Trash2,
  HelpCircle 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const API_URL = "";
const ITEMS_PER_PAGE = 10;

interface Cliente {
  CodigoCliente: number;
  nome: string;
  telefone: string;
  cidade: string;
}

const Clientes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/clientes`);
        if (!response.ok) {
          throw new Error('Falha ao buscar clientes');
        }
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientes();
  }, []);
  
  const handleDelete = async (clienteId: number, clienteNome: string) => {
    if (!window.confirm(`Tem certeza de que deseja excluir o cliente "${clienteNome}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/clientes/${clienteId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao excluir o cliente.');
      }

      setClientes(prevClientes => prevClientes.filter(c => c.CodigoCliente !== clienteId));

      toast({
        title: "Sucesso!",
        description: `O cliente "${clienteNome}" foi excluído.`,
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível excluir o cliente.",
        variant: "destructive",
      });
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClientes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedClientes = filteredClientes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-dark flex items-center gap-3">
              <Users className="h-8 w-8 text-corporate-blue" />
              Gerenciamento de Clientes
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os clientes cadastrados no sistema
            </p>
          </div>
          
          {/* 2. ADICIONADO: Botão e Modal de Ajuda da Página */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-9 w-9 flex-shrink-0 mt-1"
                aria-label="Abrir ajuda da página de clientes"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-corporate-blue" />
                  Ajuda: Gerenciamento de Clientes
                </DialogTitle>
              </DialogHeader>
              <div className="text-sm text-muted-foreground space-y-4 mt-4">
                <p>Esta página é onde você pode visualizar, buscar, adicionar, editar e excluir todos os clientes do sistema.</p>
                
                <div>
                  <h4 className="font-semibold text-neutral-dark">Funcionalidades Principais:</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Buscar Clientes:</strong> Use o campo de busca para filtrar a lista de clientes por nome em tempo real.</li>
                    <li><strong>Cadastrar Novo Cliente:</strong> Clique neste botão no canto superior direito para ir ao formulário de cadastro de um novo cliente.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-dark">Ações na Tabela:</h4>
                   <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Ver Detalhes:</strong> Abre uma página com todas as informações do cliente e seu histórico de Ordens de Serviço.</li>
                    <li><strong>Editar:</strong> Leva você ao formulário de cadastro com os dados do cliente já preenchidos para edição.</li>
                    <li><strong>Nova OS:</strong> Um atalho útil para criar uma nova Ordem de Serviço já com este cliente selecionado.</li>
                    <li><strong>Excluir:</strong> Remove o cliente do sistema. Uma confirmação será solicitada. Clientes com OS no histórico não podem ser excluídos.</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>

        </div>
        <Button 
          variant="corporate" 
          size="lg"
          onClick={() => navigate("/clientes/novo")}
          className="gap-2 flex-shrink-0"
        >
          <PlusCircle className="h-5 w-5" />
          Cadastrar Novo Cliente
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Buscar Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11"
              />
            </div>
            <Button variant="corporate" size="lg" className="gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">
            Resultados ({filteredClientes.length} clientes)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">Carregando...</TableCell>
                  </TableRow>
                ) : paginatedClientes.length > 0 ? (
                  paginatedClientes.map((cliente) => (
                    <TableRow key={cliente.CodigoCliente} className="hover:bg-neutral-light/50">
                      <TableCell className="font-medium">{cliente.nome}</TableCell>
                      <TableCell>{cliente.telefone}</TableCell>
                      <TableCell>{cliente.cidade}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/clientes/${cliente.CodigoCliente}`)}
                            className="gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Ver Detalhes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/clientes/${cliente.CodigoCliente}/editar`)}
                            className="gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Editar
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => navigate(`/ordens-servico/nova?cliente=${cliente.CodigoCliente}`)}
                            className="gap-1"
                          >
                            <FileText className="h-3 w-3" />
                            Nova OS
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(cliente.CodigoCliente, cliente.nome)}
                            className="gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
            {totalPages > 1 && (
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <PaginationItem key={page}>
                                <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page); }} isActive={currentPage === page}>
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Clientes;