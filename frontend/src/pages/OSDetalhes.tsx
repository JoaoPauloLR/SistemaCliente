import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  Users, 
  Smartphone,
  Calendar,
  Wrench,
  DollarSign,
  Package,
  MessageSquare,
  Printer,
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

const API_URL = "https://api-sistemacliente.onrender.com";

interface OSDetalhesType {
    CodigoOS: number;
    NomeCliente: string;
    Aparelho: string;
    marca: string;
    modelo: string;
    serie: string;
    defeito: string;
    DescricaoServico: string;
    DescricaoPecas: string;
    valorPecas: number;
    valorServico: number;
    desconto: number;
    total: number;
    DataDeEntrada: string;
    DataDeSaida?: string | null;
    observacao: string;
    Status?: string;
}

// 1. ADICIONADO: Componente reutilizável para o cabeçalho de impressão
const PrintHeader = () => (
  <div className="flex justify-between items-center border-b pb-4 mb-6">
    {/* A imagem deve estar na pasta /public do seu projeto */}
    <img src="/logo2.png" alt="Logo da Empresa" className="h-28" />
    <div className="text-right">
      <h2 className="font-bold text-lg">Core Info Informática Ltda</h2>
      <p className="text-sm">CNPJ: 14.416.825/0001-04</p>
      <p className="text-sm">R. Ten. Hinon Silva, 59 - Centro</p>
      <p className="text-sm">Ponta Grossa, PR - (42) 99917-0840</p>
    </div>
  </div>
);

const formatLocalDate = (dateString: string | null | undefined) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (!dateString.includes('T')) {
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  }
  return date.toLocaleDateString('pt-BR');
}

const OSDetalhes = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [ordemServico, setOrdemServico] = useState<OSDetalhesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOSDetalhes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/os/${id}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar detalhes da OS');
        }
        const data = await response.json();
        setOrdemServico(data);
      } catch (error) {
        console.error("Erro:", error);
        navigate("/ordens-servico");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOSDetalhes();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (!window.confirm(`Tem certeza de que deseja excluir a OS Nº ${id}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/os/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir a Ordem de Serviço.');
      }
      
      toast({
        title: "Sucesso!",
        description: `A Ordem de Serviço Nº ${id} foi excluída.`,
      });
      
      navigate("/ordens-servico");

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a Ordem de Serviço.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando detalhes da OS...</div>;
  }

  if (!ordemServico) {
    return <div className="text-center py-10">Ordem de Serviço não encontrada.</div>;
  }
  
  const getStatus = (os: OSDetalhesType): { text: string; variant: "default" | "warning" | "secondary"; className?: string } => {
    const textoParaExibir = os.Status ?? (os.DataDeSaida ? 'Finalizada' : 'Em aberto');
    const statusParaLogica = textoParaExibir.toLowerCase();

    switch (statusParaLogica) {
        case 'aberto':
        case 'em aberto':
            return { text: "Em aberto", variant: "warning" };
        case 'aguardando aprovação':
            return { text: "Aguardando Aprovação", variant: "secondary" };
        case 'aguardando pagamento':
            return { text: "Aguardando Pagamento", variant: "default", className: "bg-corporate-blue text-white hover:bg-corporate-blue/90" };
        case 'fechado':
        case 'finalizada':
            return { text: "Finalizada", variant: "default" };
        default:
            return { text: textoParaExibir, variant: "default" };
    }
  };

  const status = getStatus(ordemServico);

  return (
    <>
      <div className="print-only">
        {/* 2. ADICIONADO: Uso do componente de cabeçalho */}
        <div className="p-8">
            <div className="space-y-6">
                <div className="space-y-4">
                    <h1 className="text-xl font-bold">Ordem de Serviço Nº {ordemServico.CodigoOS} - Comprovante de Entrada</h1>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div><span className="font-semibold">Cliente:</span> {ordemServico.NomeCliente}</div>
                    <div><span className="font-semibold">Data de Entrada:</span> {formatLocalDate(ordemServico.DataDeEntrada)}</div>
                    <div><span className="font-semibold">Aparelho:</span> {ordemServico.Aparelho}</div>
                    <div className="text-base"><span className="font-semibold">Valor Total:</span> R$ {Number(ordemServico.total).toFixed(2).replace('.', ',')}</div>
                    </div>
                    <div>
                    <p className="font-semibold text-sm">Defeito Relatado:</p>
                    <p className="text-sm border p-2 rounded-md mt-1">{ordemServico.defeito}</p>
                    </div>
                    <div className="mt-4 text-[10px] text-red-600 space-y-1">
                    <p className="font-bold">AVISOS IMPORTANTES:</p>
                    <div className="mt-4 text-[10px] text-gray-800 space-y-1">
                    <p>• Orçamentos aprovados pelo cliente têm o prazo de 10 dias para retirada. Após esse período estarão sujeitos a alteração de valores.</p>
                    <p>• Aparelhos prontos não retirados no prazo de 90 dias serão vendidos pelo valor do serviço executado.</p>
                    <p>• Após aberto, o aparelho pode vir a não ligar.</p>
                    </div>
                    </div>
                    <div className="pt-8 text-center">
                    <div className="border-t border-black w-72 mx-auto"></div>
                    <p className="text-sm mt-1">Assinatura do Cliente</p>
                    </div>
                </div>
                <hr className="border-dashed border-gray-400 my-6" />
                <PrintHeader />
                <div className="space-y-4">
                    <h2 className="text-lg font-bold">Comprovante do Cliente</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div><span className="font-semibold">OS Nº:</span> {ordemServico.CodigoOS}</div>
                    <div><span className="font-semibold">Cliente:</span> {ordemServico.NomeCliente}</div>
                    <div><span className="font-semibold">Aparelho:</span> {ordemServico.Aparelho}</div>
                    <div className="text-base"><span className="font-semibold">Valor Total:</span> R$ {Number(ordemServico.total).toFixed(2).replace('.', ',')}</div>
                    </div>
                    <div>
                    <p className="font-semibold text-sm">Defeito Relatado:</p>
                    <p className="text-sm">{ordemServico.defeito}</p>
                    </div>
                    <div className="mt-4 text-[10px] text-gray-800 space-y-1">
                                          <div className="mt-4 text-[10px] text-red-600 space-y-1">
                    <p className="font-bold">AVISOS IMPORTANTES:</p></div>
                        <p>• Orçamentos aprovados pelo cliente têm o prazo de 10 dias para retirada. Após esse período estarão sujeitos a alteração de valores.</p>
                        <p>• Aparelhos só serão retirados mediante a apresentação desse canhoto.</p>
                        <p>• Aparelhos prontos não retirados no período de 90 dias serão vendidos pelo valor do serviço executado.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6 animate-fade-in no-print">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/ordens-servico")}
              className="gap-2 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-neutral-dark flex items-center gap-3">
                <FileText className="h-8 w-8 text-corporate-blue" />
                Detalhes da OS Nº {ordemServico.CodigoOS}
              </h1>
              <p className="text-muted-foreground mt-1">
                Informações completas da ordem de serviço
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-9 w-9 flex-shrink-0 mt-1"
                  aria-label="Abrir ajuda da página de detalhes da OS"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-corporate-blue" />
                    Ajuda: Detalhes da Ordem de Serviço
                  </DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground space-y-4 mt-4">
                  <p>Esta tela exibe todas as informações detalhadas de uma Ordem de Serviço específica.</p>
                  
                  <div>
                    <h4 className="font-semibold text-neutral-dark">Secções da Página:</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Status Atual:</strong> Mostra o status atual da OS e as datas de entrada e finalização.</li>
                      <li><strong>Dados do Cliente:</strong> Exibe o nome do cliente associado a esta OS.</li>
                      <li><strong>Informações do Aparelho:</strong> Detalha o equipamento, marca, modelo e o defeito relatado pelo cliente.</li>
                      <li><strong>Detalhes do Serviço:</strong> Descreve o serviço técnico realizado e as peças que foram utilizadas.</li>
                      <li><strong>Valores:</strong> Apresenta um resumo financeiro da OS, incluindo valores de peças, serviço, descontos e o total.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-neutral-dark">Botões de Ação:</h4>
                     <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Voltar:</strong> Retorna para a lista de todas as Ordens de Serviço.</li>
                      <li><strong>Imprimir:</strong> Gera uma versão simplificada e otimizada para impressão, servindo como comprovativo para o cliente.</li>
                      <li><strong>Excluir OS:</strong> Remove permanentemente esta Ordem de Serviço do sistema.</li>
                      <li><strong>Editar OS:</strong> Abre o formulário de OS com todos os dados preenchidos para que você possa fazer alterações.</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Excluir OS
            </Button>
            <Button
              variant="corporate"
              onClick={() => navigate(`/ordens-servico/${id}/editar`)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar OS
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Status Atual</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  <p>OS criada em {formatLocalDate(ordemServico.DataDeEntrada)}</p>
                  {ordemServico.DataDeSaida && (
                    <p>OS finalizada em {formatLocalDate(ordemServico.DataDeSaida)}</p>
                  )}
                </div>
              </div>
              <Badge variant={status.variant} className={`text-sm px-3 py-1 ${status.className || ''}`}>
                {status.text}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-corporate-blue" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground">Nome Completo</p>
              <p className="font-medium">{ordemServico.NomeCliente}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-corporate-blue" />
              Informações do Aparelho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div><p className="text-sm text-muted-foreground">Nome do Aparelho</p><p className="font-medium">{ordemServico.Aparelho}</p></div>
                <div><p className="text-sm text-muted-foreground">Marca</p><p className="font-medium">{ordemServico.marca}</p></div>
                <div><p className="text-sm text-muted-foreground">Modelo</p><p className="font-medium">{ordemServico.modelo}</p></div>
              </div>
              <div className="space-y-3">
                <div><p className="text-sm text-muted-foreground">Número de Série</p><p className="font-medium">{ordemServico.serie}</p></div>
                <div><p className="text-sm text-muted-foreground">Defeito Relatado</p><p className="font-medium">{ordemServico.defeito}</p></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Wrench className="h-5 w-5 text-corporate-blue" /> Detalhes do Serviço</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div><p className="text-sm text-muted-foreground mb-2">Descrição do Serviço Prestado</p><p className="font-medium">{ordemServico.DescricaoServico}</p></div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2"><Package className="h-4 w-4" /> Peças Utilizadas</p>
              <div className="bg-neutral-light/30 p-3 rounded-lg"><pre className="text-sm whitespace-pre-wrap font-medium">{ordemServico.DescricaoPecas}</pre></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><DollarSign className="h-5 w-5 text-corporate-blue" /> Valores</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-light/30 p-4 rounded-lg"><p className="text-sm text-muted-foreground">Valor das Peças</p><p className="text-xl font-bold">R$ {Number(ordemServico.valorPecas).toFixed(2).replace('.', ',')}</p></div>
              <div className="bg-neutral-light/30 p-4 rounded-lg"><p className="text-sm text-muted-foreground">Valor do Serviço</p><p className="text-xl font-bold">R$ {Number(ordemServico.valorServico).toFixed(2).replace('.', ',')}</p></div>
              <div className="bg-neutral-light/30 p-4 rounded-lg"><p className="text-sm text-muted-foreground">Desconto</p><p className="text-xl font-bold text-error-red">- R$ {Number(ordemServico.desconto).toFixed(2).replace('.', ',')}</p></div>
            </div>
            <Separator />
            <div className="bg-corporate-blue/10 p-4 rounded-lg"><p className="text-sm text-muted-foreground">Total da OS</p><p className="text-3xl font-bold text-corporate-blue">R$ {Number(ordemServico.total).toFixed(2).replace('.', ',')}</p></div>
          </CardContent>
        </Card>
      </div>

      <style type="text/css">
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            .print-only {
              display: block !important;
            }
          }
          .print-only {
            display: none;
          }
        `}
      </style>
    </>
  );
};

export default OSDetalhes;