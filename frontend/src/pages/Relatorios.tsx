import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Removido TableFooter, pois não será mais usado
import { 
  BarChart3, 
  Calendar, 
  Download, 
  FileText, 
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Loader2,
  HelpCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const API_URL = "https://api-sistemacliente.onrender.com";

interface RelatorioSinteticoData {
    gastosPecas: number;
    ganhosServicos: number;
    totalDescontos: number;
    clientesAtendidos: number;
    osAbertas: number;
    osFechadas: number;
}

interface RelatorioAnaliticoData {
    CodigoOS: number;
    valorPecas: number;
    valorServico: number;
    desconto: number;
    receitaLiquida: number;
}

const PrintHeader = () => (
  <div className="flex justify-between items-center border-b pb-4 mb-6">
    <img src="/logo2.png" alt="Logo da Empresa" className="h-24" />
    <div className="text-right">
      <h2 className="font-bold text-lg">Core Info Informática Ltda</h2>
      <p className="text-sm">CNPJ: 14.416.825/0001-04</p>
      <p className="text-sm">R. Ten. Hinon Silva, 59 - Centro</p>
      <p className="text-sm">Ponta Grossa, PR - (42) 99917-0840</p>
    </div>
  </div>
);


const Relatorios = () => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dadosSintetico, setDadosSintetico] = useState<RelatorioSinteticoData | null>(null);
  const [dadosAnalitico, setDadosAnalitico] = useState<RelatorioAnaliticoData[]>([]);
  const { toast } = useToast();

  const [metricas, setMetricas] = useState({
    gastosPecas: true,
    ganhosServicos: true,
    totalDescontos: true,
    clientesAtendidos: true,
    osAbertas: true,
    osFechadas: true,
  });

  const handleMetricaChange = (metrica: keyof typeof metricas) => {
    setMetricas(prev => ({ ...prev, [metrica]: !prev[metrica] }));
  };

  const gerarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      toast({ title: "Período inválido", description: "Por favor, selecione as datas de início e fim.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    try {
        const responseSintetico = await fetch(`${API_URL}/api/relatorio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataInicio, dataFim }),
        });
        if (!responseSintetico.ok) throw new Error('Falha ao gerar o relatório sintético.');
        const dataSintetico = await responseSintetico.json();
        setDadosSintetico(dataSintetico);

        const responseAnalitico = await fetch(`${API_URL}/api/relatorio/detalhado`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataInicio, dataFim }),
        });
        if (!responseAnalitico.ok) throw new Error('Falha ao gerar o relatório detalhado.');
        const dataAnalitico = await responseAnalitico.json();
        setDadosAnalitico(dataAnalitico);
        
        setShowReport(true);
    } catch (error) {
        toast({ title: "Erro", description: "Não foi possível gerar o relatório.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
  
  const formatLocalDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('pt-BR');
  }

  const metricasInfo = [
    { key: "gastosPecas", label: "Receita com peças", icon: DollarSign, color: "text-success-green", isCurrency: true },
    { key: "ganhosServicos", label: "Receita com serviços", icon: TrendingUp, color: "text-success-green", isCurrency: true },
    { key: "totalDescontos", label: "Total de descontos", icon: DollarSign, color: "text-warning-yellow", isCurrency: true },
    { key: "clientesAtendidos", label: "Total de clientes atendidos", icon: Users, color: "text-corporate-blue", isCurrency: false },
    { key: "osAbertas", label: "Total de OS abertas", icon: Clock, color: "text-warning-yellow", isCurrency: false },
    { key: "osFechadas", label: "Total de OS fechadas", icon: FileText, color: "text-success-green", isCurrency: false },
  ];

  const ganhosServicos = dadosSintetico?.ganhosServicos || 0;
  const valorPecas = dadosSintetico?.gastosPecas || 0;
  const descontos = dadosSintetico?.totalDescontos || 0;
  const receitaBruta = ganhosServicos + valorPecas;
  const receitaLiquida = receitaBruta - descontos;

  const calcularTotais = () => {
    return dadosAnalitico.reduce((acc, os) => {
        acc.pecas += os.valorPecas;
        acc.servicos += os.valorServico;
        acc.descontos += os.desconto;
        acc.liquido += os.receitaLiquida;
        return acc;
    }, { pecas: 0, servicos: 0, descontos: 0, liquido: 0 });
  };
  const totais = showReport ? calcularTotais() : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="no-print">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-neutral-dark flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-corporate-blue" />
                  Relatório Financeiro
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gere relatórios detalhados de desempenho e faturamento
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-9 w-9 flex-shrink-0 mt-1"
                    aria-label="Abrir ajuda da página de relatórios"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-corporate-blue" />
                      Ajuda: Relatório Financeiro
                    </DialogTitle>
                  </DialogHeader>
                  <div className="text-sm text-muted-foreground space-y-4 mt-4">
                    <p>Esta página permite gerar relatórios financeiros e operacionais com base num período de tempo que você define.</p>
                    <div>
                      <h4 className="font-semibold text-neutral-dark">Como Gerar um Relatório:</h4>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Período da Consulta:</strong> Selecione uma data de início e uma data de fim para definir o intervalo do seu relatório.</li>
                        <li><strong>Dados a Incluir:</strong> Marque ou desmarque as métricas que você deseja visualizar nos cards do "Relatório Sintético".</li>
                        <li>Clique em <strong>"Gerar Relatório"</strong> para processar os dados e ver os resultados.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-dark">Entendendo os Resultados:</h4>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Relatório Sintético:</strong> Apresenta os totais do período em cards fáceis de ler.</li>
                        <li><strong>Resumo Financeiro:</strong> Mostra o cálculo da Receita Bruta, Descontos e a Receita Líquida final.</li>
                        <li><strong>Gerar Relatório Completo (PDF):</strong> Ao clicar neste botão, o sistema prepara uma versão para impressão/PDF que inclui um **Relatório Analítico**, com uma tabela detalhada de cada OS fechada no período.</li>
                        <li><strong>Nova Consulta:</strong> Limpa os resultados e permite que você selecione um novo período.</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
          </div>
        </div>

        {!showReport ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Calendar className="h-5 w-5" /> Período da Consulta</CardTitle>
                <CardDescription>Selecione o período para o qual deseja gerar o relatório</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataInicio">Data de Início</Label>
                    <Input id="dataInicio" name="dataInicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataFim">Data de Fim</Label>
                    <Input id="dataFim" name="dataFim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="h-11" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Dados a Incluir (Relatório Sintético)</CardTitle>
                <CardDescription>Selecione as métricas que deseja incluir nos cards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metricasInfo.map((metrica) => (
                    <div key={metrica.key} className="flex items-center space-x-3">
                      <Checkbox id={metrica.key} checked={metricas[metrica.key as keyof typeof metricas]} onCheckedChange={() => handleMetricaChange(metrica.key as keyof typeof metricas)} />
                      <div className="flex items-center gap-2">
                        <metrica.icon className={`h-4 w-4 ${metrica.color}`} />
                        <label htmlFor={metrica.key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">{metrica.label}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="lg:col-span-2 flex justify-center">
              <Button variant="corporate" size="lg" onClick={gerarRelatorio} disabled={isLoading} className="gap-2 px-8">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <BarChart3 className="h-5 w-5" />}
                {isLoading ? 'A gerar...' : 'Gerar Relatório'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Relatório Sintético: {formatLocalDate(dataInicio)} a {formatLocalDate(dataFim)}</CardTitle>
                    <CardDescription>Relatório gerado em {new Date().toLocaleString('pt-BR')}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowReport(false)}>Nova Consulta</Button>
                    <Button variant="success" className="gap-2" onClick={() => window.print()}>
                      <Download className="h-4 w-4" />
                      Gerar Relatório Completo (PDF)
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dadosSintetico && metricasInfo.map((metrica) => {
                if (!metricas[metrica.key as keyof typeof metricas]) return null;
                const valor = dadosSintetico[metrica.key as keyof typeof dadosSintetico];
                return (
                  <Card key={metrica.key} className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{metrica.label}</p>
                          <p className="text-2xl font-bold text-neutral-dark mt-1">{metrica.isCurrency ? formatCurrency(valor) : valor}</p>
                        </div>
                        <metrica.icon className={`h-8 w-8 ${metrica.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Card className="border-0 shadow-md">
              <CardHeader><CardTitle>Resumo Financeiro</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-muted-foreground">Receita Bruta (Peças + Serviços):</span><span className="font-semibold">{formatCurrency(receitaBruta)}</span></div>
                  <div className="flex justify-between items-center"><span className="text-muted-foreground">Descontos Concedidos:</span><span className="font-semibold text-warning-yellow">- {formatCurrency(descontos)}</span></div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold"><span>Receita Líquida:</span><span className="text-success-green">{formatCurrency(receitaLiquida)}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="print-only">
        {showReport && totais && (
            <div>
                <PrintHeader />
                <div className="text-center">
                    <h1 className="text-xl font-bold">Relatório Analítico Financeiro</h1>
                    <p className="text-sm">Período: {formatLocalDate(dataInicio)} a {formatLocalDate(dataFim)}</p>
                </div>
                <Table className="mt-4 print-table">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left">Nº OS</TableHead>
                            <TableHead className="text-right">Receita Peças</TableHead>
                            <TableHead className="text-right">Receita Serviços</TableHead>
                            <TableHead className="text-right">Descontos</TableHead>
                            <TableHead className="text-right">Receita Líquida</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dadosAnalitico.map((os) => (
                            <TableRow key={os.CodigoOS}>
                                <TableCell className="text-left font-medium">#{os.CodigoOS}</TableCell>
                                <TableCell className="text-right">{formatCurrency(os.valorPecas)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(os.valorServico)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(os.desconto)}</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(os.receitaLiquida)}</TableCell>
                            </TableRow>
                        ))}
                        {/* 1. ALTERADO: A linha de totais foi movida para dentro do TableBody */}
                        <TableRow className="bg-gray-100 font-bold border-t-2 border-black">
                            <TableCell className="text-left">TOTAIS</TableCell>
                            <TableCell className="text-right">{formatCurrency(totais.pecas)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(totais.servicos)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(totais.descontos)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(totais.liquido)}</TableCell>
                        </TableRow>
                    </TableBody>
                    {/* O TableFooter foi removido */}
                </Table>
            </div>
        )}
      </div>

      <style type="text/css">{`
        .print-only {
          display: none;
        }
        @media print {
          body, html { 
            height: auto; 
            width: auto; 
            background: #fff;
          }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          thead { display: table-header-group; }

          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10pt;
          }
          .print-table th, .print-table td {
            border: 1px solid #ccc;
            padding: 4px 6px;
            text-align: right;
          }
          .print-table th, .print-table .text-left {
            text-align: left;
          }
          .print-table thead th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .print-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          
          /* Estiliza a última linha do tbody (que agora é a de totais) */
          .print-table tbody tr:last-child {
            background-color: #e8e8e8;
            font-weight: bold;
          }
          
          @page {
            size: A4 landscape;
            margin: 15mm;
          }
        }
      `}</style>
    </div>
  );
};

export default Relatorios;