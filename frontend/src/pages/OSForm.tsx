import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// 1. ADICIONADO: Ícones e componentes de Dialog
import { ArrowLeft, Save, FileText, Calculator, UserPlus, Trash2, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const API_URL = "https://api-sistemacliente.onrender.com";

const getUserId = () => {
  const user = localStorage.getItem("osys-user");
  if (user) {
    return JSON.parse(user).id;
  }
  return null;
};

interface Cliente {
  CodigoCliente: number;
  nome: string;
}

interface FormData {
    cod_C: string;
    cod_F: number;
    aparelho_nome: string;
    marca: string;
    modelo: string;
    serie: string;
    defeito: string;
    aparelho_codigo: number;
    descServico: string;
    descPecas: string;
    valorPecas: string;
    valorServico: string;
    desconto: string;
    dataEntrada: string;
    dataSaida: string;
    observacao: string;
    status: string;
}

const OSForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const isEditing = !!id;
  const clientePreSelecionado = searchParams.get('cliente');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    cod_C: clientePreSelecionado || "",
    cod_F: getUserId() || 0,
    aparelho_nome: "",
    marca: "",
    modelo: "",
    serie: "",
    defeito: "",
    aparelho_codigo: isEditing ? 0 : Date.now(),
    descServico: "",
    descPecas: "",
    valorPecas: "",
    valorServico: "",
    desconto: "",
    dataEntrada: new Date().toISOString().split('T')[0],
    dataSaida: "",
    observacao: "",
    status: "Aberto",
  });
  
  const [clientesEncontrados, setClientesEncontrados] = useState<Cliente[]>([]);
  const [clienteSearchTerm, setClienteSearchTerm] = useState("");
  const [isClientePopoverOpen, setIsClientePopoverOpen] = useState(false);

  const nomeClienteSelecionado = clientesEncontrados.find(
      c => String(c.CodigoCliente) === formData.cod_C
  )?.nome || "Selecione um cliente";

  useEffect(() => {
    if (!clienteSearchTerm.trim()) {
        setClientesEncontrados(prev => prev.filter(c => c.CodigoCliente === Number(formData.cod_C)));
        return;
    }
    const handler = setTimeout(async () => {
        try {
            const response = await fetch(`${API_URL}/api/clientes/search?q=${clienteSearchTerm}`);
            if (!response.ok) throw new Error("Falha ao buscar clientes");
            const data = await response.json();
            setClientesEncontrados(data);
        } catch (error) {
            console.error(error);
        }
    }, 300);
    return () => clearTimeout(handler);
  }, [clienteSearchTerm, formData.cod_C]);

  useEffect(() => {
    const fetchInitialCliente = async (clienteId: string) => {
        if (!clienteId || Number.isNaN(parseInt(clienteId, 10))) return;
        try {
            const response = await fetch(`${API_URL}/api/clientes/${clienteId}`);
            if (response.ok) {
                const data = await response.json();
                setClientesEncontrados([data]);
            }
        } catch (error) {
            console.error("Erro ao buscar cliente inicial", error);
        }
    };
    if (formData.cod_C && clientesEncontrados.length === 0) {
        fetchInitialCliente(formData.cod_C);
    }
  }, [formData.cod_C, clientesEncontrados.length]);

  useEffect(() => {
    if (isEditing) {
      const fetchOSData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/os/${id}`);
            if (!response.ok) throw new Error("OS não encontrada");
            const data = await response.json();
            
            const formatDateForInput = (dateString: string | null | undefined) => {
                if (!dateString) return "";
                return new Date(dateString).toISOString().split('T')[0];
            }

            setFormData({
                cod_C: String(data.CodigoCliente),
                cod_F: data.CodigoFuncionario,
                aparelho_nome: data.Aparelho,
                marca: data.marca,
                modelo: data.modelo,
                serie: data.serie,
                defeito: data.defeito,
                aparelho_codigo: data.codigo,
                descServico: data.DescricaoServico,
                descPecas: data.DescricaoPecas,
                valorPecas: String(data.valorPecas),
                valorServico: String(data.valorServico),
                desconto: String(data.desconto || 0),
                dataEntrada: formatDateForInput(data.DataDeEntrada),
                dataSaida: formatDateForInput(data.DataDeSaida),
                observacao: data.observacao,
                status: data.Status || "Aberto",
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível carregar os dados da OS.",
                variant: "destructive",
            });
            navigate("/ordens-servico");
        } finally {
            setIsLoading(false);
        }
      };
      fetchOSData();
    }
  }, [isEditing, id, navigate, toast]);

  // *** FUNÇÃO CORRIGIDA ***
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Cria uma cópia atualizada dos dados
    const updatedFormData = { ...formData, [name]: value };

    // ** LÓGICA DE VALIDAÇÃO DO DESCONTO REINSERIDA AQUI **
    if (['valorPecas', 'valorServico', 'desconto'].includes(name)) {
      const pecas = parseFloat(updatedFormData.valorPecas) || 0;
      const servico = parseFloat(updatedFormData.valorServico) || 0;
      const desconto = parseFloat(updatedFormData.desconto) || 0;
      const maxDesconto = pecas + servico;

      if (desconto > maxDesconto) {
        // Redefine o valor do desconto para o máximo permitido
        updatedFormData.desconto = String(maxDesconto);
        toast({
          title: "Aviso de Ajuste",
          description: `O desconto máximo é de R$ ${maxDesconto.toFixed(2)}. O valor foi ajustado.`,
          variant: "default",
        });
      }
    }
    // Atualiza o estado com os dados validados
    setFormData(updatedFormData);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calcularTotal = () => {
    const pecas = parseFloat(formData.valorPecas) || 0;
    const servico = parseFloat(formData.valorServico) || 0;
    const desconto = parseFloat(formData.desconto) || 0;
    return pecas + servico - desconto;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.cod_C || !formData.aparelho_nome || !formData.defeito) {
      toast({ title: "Erro de validação", description: "Cliente, Nome do Aparelho e Defeito são obrigatórios.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (calcularTotal() < 0) {
        toast({ title: "Valor Inválido", description: "O valor total da OS não pode ser negativo. Por favor, verifique o desconto.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
      const url = isEditing ? `${API_URL}/api/os/${id}` : `${API_URL}/api/os`;
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha ao salvar Ordem de Serviço');
      toast({ title: isEditing ? "OS atualizada!" : "OS criada!", description: `A ordem de serviço foi salva com sucesso.` });
      navigate("/ordens-servico");
    } catch (error) {
       toast({ title: "Erro ao salvar", description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsLoading(true);
    if (!window.confirm(`Tem certeza de que deseja excluir a OS Nº ${id}? Esta ação não pode ser desfeita.`)) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/os/${id}`, { method: 'DELETE' });
      if (!response.ok) { throw new Error('Falha ao excluir a Ordem de Serviço.'); }
      toast({ title: "Sucesso!", description: `A Ordem de Serviço Nº ${id} foi excluída.` });
      navigate("/ordens-servico");
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível excluir a Ordem de Serviço.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && isEditing) {
    return <div className="text-center py-10">A carregar dados da OS...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/ordens-servico")} className="gap-2 flex-shrink-0">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-neutral-dark flex items-center gap-3">
                <FileText className="h-8 w-8 text-corporate-blue" />
                {isEditing ? `Editar OS Nº ${id}` : "Nova Ordem de Serviço"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEditing ? "Atualize as informações da ordem de serviço" : "Preencha os dados para criar uma nova ordem de serviço"}
              </p>
            </div>
            {/* 2. ADICIONADO: Botão e Modal de Ajuda */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-9 w-9 flex-shrink-0 mt-1"
                  aria-label="Abrir ajuda do formulário de OS"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-corporate-blue" />
                    Ajuda: Formulário de Ordem de Serviço
                  </DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground space-y-4 mt-4">
                  <p>Este formulário é usado para criar uma nova Ordem de Serviço (OS) ou para editar uma já existente. Campos com * são obrigatórios.</p>
                  
                  <div>
                    <h4 className="font-semibold text-neutral-dark">Secções do Formulário:</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Cliente e Aparelho:</strong> Selecione o cliente e preencha as informações do aparelho. Pode digitar para procurar por um cliente.</li>
                      <li><strong>Serviço e Valores:</strong> Descreva o serviço técnico e as peças utilizadas, e defina os valores. O total é calculado automaticamente.</li>
                      <li><strong>Status e Datas:</strong> Defina o estado atual da OS. A data de saída é habilitada para os status "Fechado" e "Aguardando Pagamento".</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-neutral-dark">Botões de Ação:</h4>
                     <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Criar/Atualizar OS:</strong> Salva todas as informações da OS no sistema.</li>
                      <li><strong>Cancelar:</strong> Descarta as alterações e retorna para a tela de gerenciamento de OS.</li>
                      <li><strong>Excluir OS:</strong> Este botão só aparece no modo de edição e remove permanentemente a OS.</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Cliente e Aparelho</CardTitle>
            <CardDescription>Selecione o cliente e informe os dados do aparelho</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                  <Label htmlFor="cod_C">Cliente *</Label>
                  <div className="flex gap-2">
                      <Popover open={isClientePopoverOpen} onOpenChange={setIsClientePopoverOpen}>
                          <PopoverTrigger asChild>
                              <Button variant="outline" role="combobox" aria-expanded={isClientePopoverOpen} className="w-full justify-between font-normal">
                                  {nomeClienteSelecionado}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                              <Command>
                                  <CommandInput placeholder="Digite para buscar um cliente..." value={clienteSearchTerm} onValueChange={setClienteSearchTerm} />
                                  <CommandList>
                                      <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                                      <CommandGroup>
                                          {clientesEncontrados.map((cliente) => (
                                              <CommandItem key={cliente.CodigoCliente} value={cliente.nome} onSelect={() => {
                                                  handleSelectChange('cod_C', String(cliente.CodigoCliente));
                                                  setClienteSearchTerm("");
                                                  setIsClientePopoverOpen(false);
                                              }}>
                                                  {cliente.nome}
                                              </CommandItem>
                                          ))}
                                      </CommandGroup>
                                  </CommandList>
                              </Command>
                          </PopoverContent>
                      </Popover>
                      <Button type="button" variant="outline" onClick={() => navigate("/clientes/novo")} className="gap-2">
                          <UserPlus className="h-4 w-4" /> Novo
                      </Button>
                  </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aparelho_nome">Nome do Aparelho *</Label>
                <Input id="aparelho_nome" name="aparelho_nome" value={formData.aparelho_nome} onChange={handleInputChange} placeholder="Ex: Smartphone Samsung" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <Input id="marca" name="marca" value={formData.marca} onChange={handleInputChange} placeholder="Ex: Samsung" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input id="modelo" name="modelo" value={formData.modelo} onChange={handleInputChange} placeholder="Ex: Galaxy S21" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serie">Nº de Série</Label>
                <Input id="serie" name="serie" value={formData.serie} onChange={handleInputChange} placeholder="Ex: SM123456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defeito">Defeito Relatado *</Label>
                <Textarea id="defeito" name="defeito" value={formData.defeito} onChange={handleInputChange} placeholder="Descreva o problema relatado pelo cliente" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Serviço e Valores</CardTitle>
            <CardDescription>Descreva o serviço prestado e informe os valores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="descServico">Descrição do Serviço Prestado</Label>
                <Textarea id="descServico" name="descServico" value={formData.descServico} onChange={handleInputChange} placeholder="Descreva detalhadamente o serviço realizado" rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descPecas">Peças Utilizadas</Label>
                <Textarea id="descPecas" name="descPecas" value={formData.descPecas} onChange={handleInputChange} placeholder="Liste as peças utilizadas no reparo" rows={3} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="valorPecas">Valor das Peças (R$)</Label>
                  <Input id="valorPecas" name="valorPecas" type="number" step="0.01" min="0" value={formData.valorPecas} onChange={handleInputChange} placeholder="0,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorServico">Valor do Serviço (R$)</Label>
                  <Input id="valorServico" name="valorServico" type="number" step="0.01" min="0" value={formData.valorServico} onChange={handleInputChange} placeholder="0,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desconto">Desconto (R$)</Label>
                  <Input id="desconto" name="desconto" type="number" step="0.01" min="0" value={formData.desconto} onChange={handleInputChange} placeholder="0,00" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-neutral-light/30 rounded-lg">
                <Calculator className="h-5 w-5 text-corporate-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Total da OS</p>
                  <p className="text-xl font-bold text-corporate-blue">R$ {calcularTotal().toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Status e Datas</CardTitle>
            <CardDescription>Informações complementares sobre a ordem de serviço</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status da OS *</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Aberto">Aberto</SelectItem>
                        <SelectItem value="Aguardando Aprovação">Aguardando Aprovação</SelectItem>
                        <SelectItem value="Aguardando Pagamento">Aguardando Pagamento</SelectItem>
                        <SelectItem value="Fechado">Fechado</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataEntrada">Data de Entrada</Label>
                <Input id="dataEntrada" name="dataEntrada" type="date" value={formData.dataEntrada} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataSaida">Data de Saída</Label>
                <Input id="dataSaida" name="dataSaida" type="date" value={formData.dataSaida} onChange={handleInputChange} disabled={formData.status !== 'Fechado' && formData.status !== 'Aguardando Pagamento'} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacao">Observações</Label>
              <Textarea id="observacao" name="observacao" value={formData.observacao} onChange={handleInputChange} placeholder="Observações gerais sobre a ordem de serviço" rows={3} />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <div className="flex gap-4">
                <Button type="submit" variant="corporate" size="lg" className="gap-2" disabled={isLoading}>
                    <Save className="h-4 w-4" />
                    {isLoading ? 'A guardar...' : (isEditing ? "Atualizar OS" : "Criar Ordem de Serviço")}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => navigate("/ordens-servico")} disabled={isLoading}>
                    Cancelar
                </Button>
            </div>
            {isEditing && (
                <Button type="button" variant="destructive" size="lg" onClick={handleDelete} className="gap-2" disabled={isLoading}>
                    <Trash2 className="h-4 w-4" /> Excluir OS
                </Button>
            )}
        </div>
      </form>
    </div>
  );
};

export default OSForm;