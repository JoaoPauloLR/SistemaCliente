import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, UserPlus, Users, Trash2, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import InputMask from 'react-input-mask';

const API_URL = "";

const ClienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = !!id;

  // 1. ATUALIZADO: Adicionado 'uf' ao estado
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cep: "",
    endereco: "",
    bairro: "",
    cidade: "",
    uf: "", // <-- ADICIONADO
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchCliente = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/clientes/${id}`);
          if (!response.ok) {
            throw new Error('Cliente não encontrado');
          }
          const data = await response.json();
          // 2. ATUALIZADO: Carrega o 'uf' no modo de edição
          setFormData({
            nome: data.nome,
            telefone: data.telefone || "",
            cep: data.cep || "",
            endereco: data.endereco || "",
            bairro: data.bairro || "",
            cidade: data.cidade,
            uf: data.uf || "", // <-- ADICIONADO
          });
        } catch (error) {
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do cliente.",
            variant: "destructive",
          });
          navigate("/clientes");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCliente();
    }
  }, [isEditing, id, navigate, toast]);

  // 3. ATUALIZADO: handleInputChange para forçar 'UF' para maiúsculas
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let finalValue = value;
    if (name === "uf") {
      finalValue = value.toUpperCase(); // Força para maiúsculas
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };
  
  // 4. ATUALIZADO: handleCepBlur para incluir 'uf'
  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cep.length !== 8) {
      return; 
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Por favor, verifique o CEP digitado.",
          variant: "destructive",
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        endereco: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf, // <-- ADICIONADO
      }));

    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Não foi possível consultar o CEP. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 5. ATUALIZADO: handleSubmit para validar 'uf' e enviar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Adicionada validação para 'uf'
    if (!formData.nome || !formData.cidade || !formData.telefone || !formData.uf) {
      toast({
        title: "Erro de validação",
        description: "Preencha todos os campos obrigatórios (Nome, Telefone, Cidade e UF).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validação de 2 caracteres para UF (caso maxLength falhe)
    if (formData.uf.length !== 2) {
      toast({
        title: "Erro de validação",
        description: "O campo UF deve ter exatamente 2 caracteres.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const url = isEditing ? `${API_URL}/api/clientes/${id}` : `${API_URL}/api/clientes`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // formData agora inclui 'uf'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao salvar cliente');
      }
      
      toast({
        title: isEditing ? "Cliente atualizado!" : "Cliente cadastrado!",
        description: `${formData.nome} foi salvo com sucesso.`,
      });

      navigate("/clientes");

    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm(`Tem certeza de que deseja excluir o cliente "${formData.nome}"?`)) {
        return;
    }
    setIsLoading(true);
    try {
        const response = await fetch(`${API_URL}/api/clientes/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Falha ao excluir o cliente.');
        }
        toast({
            title: "Sucesso!",
            description: `O cliente "${formData.nome}" foi excluído.`,
        });
        navigate("/clientes");
    } catch (error) {
        toast({
            title: "Erro",
            description: error instanceof Error ? error.message : "Não foi possível excluir o cliente.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };


  if (isLoading && isEditing) {
    return <div className="text-center py-10">A carregar dados do cliente...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/clientes")}
            className="gap-2 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-dark flex items-center gap-3">
              {isEditing ? <Users className="h-8 w-8 text-corporate-blue" /> : <UserPlus className="h-8 w-8 text-corporate-blue" />}
              {isEditing ? `Editar Cliente` : "Cadastrar Novo Cliente"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? "Atualize as informações do cliente" : "Preencha os dados para cadastrar um novo cliente"}
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-9 w-9 flex-shrink-0 mt-1"
                aria-label="Abrir ajuda do formulário de cliente"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-corporate-blue" />
                  Ajuda: Formulário de Cliente
                </DialogTitle>
              </DialogHeader>
              {/* 6. ATUALIZADO: Texto de ajuda para incluir 'UF' */}
              <div className="text-sm text-muted-foreground space-y-4 mt-4">
                <p>Use este formulário para cadastrar um novo cliente ou editar as informações de um cliente existente. Campos com * são obrigatórios.</p>
                <div>
                  <h4 className="font-semibold text-neutral-dark">Dicas de Preenchimento:</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Nome, Telefone, Cidade e UF:</strong> São campos essenciais para o cadastro.</li>
                    <li><strong>CEP:</strong> Ao digitar um CEP válido e sair do campo, o sistema buscará automaticamente o endereço, bairro, cidade e UF.</li>
                    <li><strong>UF:</strong> O campo de UF aceita apenas 2 caracteres (ex: PR, SP, SC).</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-dark">Botões de Ação:</h4>
                   <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Cadastrar/Atualizar Cliente:</strong> Salva as informações no sistema.</li>
                    <li><strong>Cancelar:</strong> Descarta todas as alterações e volta para a tela de gerenciamento de clientes.</li>
                    <li><strong>Excluir Cliente:</strong> Este botão só aparece no modo de edição. Ele remove permanentemente o cliente do sistema (apenas se não houver OS vinculada).</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Dados do Cliente</CardTitle>
          <CardDescription>
            Campos marcados com * são obrigatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <InputMask
                  mask="(99) 99999-9999"
                  value={formData.telefone}
                  onChange={handleInputChange}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      id="telefone"
                      name="telefone"
                      type="tel"
                      placeholder="(XX) XXXXX-XXXX"
                      required
                    />
                  )}
                </InputMask>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <InputMask
                  mask="99999-999"
                  value={formData.cep}
                  onChange={handleInputChange}
                  onBlur={handleCepBlur}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      id="cep"
                      name="cep"
                      type="text"
                      placeholder="Digite o CEP para buscar"
                    />
                  )}
                </InputMask>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  type="text"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Rua, Avenida, número"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  name="bairro"
                  type="text"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  placeholder="Nome do bairro"
                />
              </div>

              {/* 7. ATUALIZADO: Layout para Cidade e UF */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    name="cidade"
                    type="text"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    placeholder="Nome da cidade"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uf">UF *</Label>
                  <Input
                    id="uf"
                    name="uf"
                    type="text"
                    value={formData.uf}
                    onChange={handleInputChange}
                    placeholder="Ex: PR"
                    required
                    maxLength={2} // Limita a 2 caracteres
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-between items-center pt-6">
                <div className="flex gap-4">
                    <Button type="submit" variant="corporate" size="lg" className="gap-2" disabled={isLoading}>
                        <Save className="h-4 w-4" />
                        {isLoading ? 'A guardar...' : (isEditing ? "Atualizar Cliente" : "Cadastrar Cliente")}
                    </Button>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="lg"
                        onClick={() => navigate("/clientes")}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                </div>
                
                {isEditing && (
                    <Button 
                        type="button" 
                        variant="destructive" 
                        size="lg"
                        onClick={handleDelete}
                        className="gap-2"
                        disabled={isLoading}
                    >
                        <Trash2 className="h-4 w-4" />
                        Excluir Cliente
                    </Button>
                )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClienteForm;