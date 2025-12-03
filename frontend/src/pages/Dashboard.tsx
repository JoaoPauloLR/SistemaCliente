import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  FileText, 
  BarChart3, 
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  ChevronDown,
  HandCoins,
  HelpCircle // Ícone de ajuda
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Componentes do Modal (Dialog)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const API_URL = "https://api-sistemacliente.onrender.com";

interface DashboardStats {
  osAbertas: number;
  osAguardandoPagamento: number;
  osFinalizadas: {
    mesAtual: number;
    mesAnterior: number;
    media3Meses: number;
    media6Meses: number;
    media12Meses: number;
  };
  faturamento: {
    mesAtual: number;
    mesAnterior: number;
    media3Meses: number;
    media6Meses: number;
    media12Meses: number;
  };
}

type ViewType = 'mesAtual' | 'mesAnterior' | 'media3Meses' | 'media6Meses' | 'media12Meses';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [osView, setOsView] = useState<ViewType>('mesAtual');
  const [faturamentoView, setFaturamentoView] = useState<ViewType>('mesAtual');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard/stats`);
        if (!response.ok) {
          throw new Error("Falha ao buscar estatísticas do dashboard");
        }
        const data: DashboardStats = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        setStats(null);
      }
    };
    fetchStats();
  }, []);

  const currencyBRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  const getOsFinalizadasDisplay = () => {
    if (!stats) return { value: "...", description: "Carregando..." };
    const formatNumber = (num: number) => num.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    switch (osView) {
      case 'mesAnterior': return { value: stats.osFinalizadas.mesAnterior, description: "Mês anterior" };
      case 'media3Meses': return { value: formatNumber(stats.osFinalizadas.media3Meses), description: "Média (3 meses)" };
      case 'media6Meses': return { value: formatNumber(stats.osFinalizadas.media6Meses), description: "Média (6 meses)" };
      case 'media12Meses': return { value: formatNumber(stats.osFinalizadas.media12Meses), description: "Média (último ano)" };
      default: return { value: stats.osFinalizadas.mesAtual, description: "Este mês" };
    }
  };
  
  const getFaturamentoDisplay = () => {
    if (!stats) return { value: "R$ ...", description: "Carregando..." };
    switch (faturamentoView) {
      case 'mesAnterior': return { value: currencyBRL.format(stats.faturamento.mesAnterior), description: "Mês anterior" };
      case 'media3Meses': return { value: currencyBRL.format(stats.faturamento.media3Meses), description: "Média (3 meses)" };
      case 'media6Meses': return { value: currencyBRL.format(stats.faturamento.media6Meses), description: "Média (6 meses)" };
      case 'media12Meses': return { value: currencyBRL.format(stats.faturamento.media12Meses), description: "Média (último ano)" };
      default: return { value: currencyBRL.format(stats.faturamento.mesAtual), description: "Este mês" };
    }
  };

  const quickAccessCards = [
    { title: "Gerenciar Clientes", description: "Cadastre, consulte e edite clientes", icon: Users, action: () => navigate("/clientes"), color: "corporate" },
    { title: "Gerenciar Ordens de Serviço", description: "Crie e acompanhe as ordens de serviço", icon: FileText, action: () => navigate("/ordens-servico"), color: "success" },
    { title: "Relatórios Financeiros", description: "Gere relatórios de desempenho e faturamento", icon: BarChart3, action: () => navigate("/relatorios"), color: "warning" },
  ] as const;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* --- MODAL DE AJUDA --- */}
      <Dialog>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-corporate-blue" />
              Ajuda: Painel Principal
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-4 mt-4">
            <p>Esta tela é o seu painel de controle. Ela mostra as métricas mais importantes do seu negócio em tempo real.</p>
            
            <div>
              <h4 className="font-semibold text-neutral-dark">Cards de Métricas</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>OS Abertas:</strong> Mostra o número total de ordens de serviço que estão com o status "Aberto" ou "Aguardando Aprovação". Representa o trabalho que ainda precisa ser feito.</li>
                <li><strong>OS Não Pagas:</strong> Mostra o total de ordens que já foram finalizadas mas aguardam o pagamento do cliente (status "Aguardando Pagamento").</li>
                <li><strong>OS Finalizadas:</strong> Exibe o total de ordens de serviço que foram pagas (status "Fechado") no período selecionado (mês atual, mês anterior, médias).</li>
                <li><strong>Faturamento:</strong> Exibe o valor total recebido das ordens de serviço que foram pagas (status "Fechado") no período selecionado.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-dark">Acesso Rápido</h4>
              <p className="mt-2">Esta seção fornece atalhos para as três principais áreas do sistema: Gerenciar Clientes, Gerenciar Ordens de Serviço e Relatórios Financeiros.</p>
            </div>
          </div>
        </DialogContent>
        {/* --- FIM DO MODAL DE AJUDA --- */}

        {/* --- CABEÇALHO DA PÁGINA --- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-dark">Painel Principal</h1>
            <p className="text-muted-foreground mt-1">
              Bem-vindo ao Sistema de Gerenciamento de Ordens de Serviço
            </p>
          </div>
          
          {/* BOTÕES DO CABEÇALHO AGRUPADOS */}
          <div className="flex items-center gap-2">
            <Button variant="corporate" size="lg" onClick={() => navigate("/ordens-servico/nova")} className="gap-2">
              <PlusCircle className="h-5 w-5" /> Nova OS
            </Button>
            
            {/* BOTÃO QUE ABRE O MODAL DE AJUDA */}
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                aria-label="Abrir ajuda"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
          </div>
        </div>
      </Dialog> {/* Fim do componente Dialog que envolve o cabeçalho */}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card de OS Abertas */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">OS Abertas</p>
                <p className="text-2xl font-bold text-neutral-dark">{stats?.osAbertas ?? "..."}</p>
                <p className="text-xs text-muted-foreground mt-1">Aguardando atendimento</p>
              </div>
              <Clock className="h-8 w-8 text-warning-yellow" />
            </div>
          </CardContent>
        </Card>
        
        {/* Card de Aguardando Pagamento */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
           <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">OS Não Pagas</p>
                <p className="text-2xl font-bold text-neutral-dark">{stats?.osAguardandoPagamento ?? "..."}</p>
                <p className="text-xs text-muted-foreground mt-1">Aguardando Pagamento</p>
              </div>
              <HandCoins className="h-8 w-8 text-corporate-blue" />
            </div>
          </CardContent>
        </Card>
        
        {/* Card de OS Finalizadas */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">OS Finalizadas</p>
                <p className="text-2xl font-bold text-neutral-dark">{getOsFinalizadasDisplay().value}</p>
                <p className="text-xs text-muted-foreground mt-1">{getOsFinalizadasDisplay().description}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success-green" />
            </div>
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setOsView('mesAtual')}>Este Mês</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOsView('mesAnterior')}>Mês Anterior</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOsView('media3Meses')}>Média (3 meses)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOsView('media6Meses')}>Média (6 meses)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOsView('media12Meses')}>Média (último ano)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Card de Faturamento */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
           <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Faturamento</p>
                <p className="text-2xl font-bold text-neutral-dark">{getFaturamentoDisplay().value}</p>
                <p className="text-xs text-muted-foreground mt-1">{getFaturamentoDisplay().description}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success-green" />
            </div>
             <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFaturamentoView('mesAtual')}>Este Mês</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFaturamentoView('mesAnterior')}>Mês Anterior</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFaturamentoView('media3Meses')}>Média (3 meses)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFaturamentoView('media6Meses')}>Média (6 meses)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFaturamentoView('media12Meses')}>Média (último ano)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Section */}
      <div>
        <h2 className="text-2xl font-semibold text-neutral-dark mb-6">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickAccessCards.map((card, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group" onClick={card.action}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-full w-fit">
                  <card.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-neutral-dark group-hover:text-corporate-blue transition-colors">{card.title}</CardTitle>
                <CardDescription className="text-base">{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant={card.color} size="lg" className="w-full" onClick={(e) => { e.stopPropagation(); card.action(); }}>
                  Acessar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;