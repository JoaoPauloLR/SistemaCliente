import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings, Shield, HelpCircle } from "lucide-react"; // 1. Ícone de ajuda importado

// 2. Componentes do Modal (Dialog) importados
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define a URL base da sua API para facilitar a manutenção
const API_URL = "";

const Login = () => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, senha }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("osys-user", JSON.stringify({ 
            login: login, 
            name: data.userName, 
            id: data.userId
        }));
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao Sistema OSys!",
        });
        navigate("/dashboard");
      } else {
        throw new Error(data.message || "Erro de autenticação");
      }
    } catch (error) {
      toast({
        title: "Erro de autenticação",
        description: error instanceof Error ? error.message : "Usuário ou senha inválidos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4 relative">
      
      {/* --- 3. BOTÃO E MODAL DE AJUDA ADICIONADOS --- */}
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="fixed top-4 right-4 z-50 rounded-full"
            aria-label="Abrir ajuda"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-corporate-blue" />
              Ajuda: Tela de Login
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-4 mt-4">
            <p>Esta é a tela de acesso ao sistema OSys. Para entrar, você precisa das credenciais de funcionário cadastradas.</p>
            
            <div>
              <h4 className="font-semibold text-neutral-dark">Campos:</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Usuário:</strong> Digite o seu nome de login.</li>
                <li><strong>Senha:</strong> Digite a sua senha pessoal.</li>
              </ul>
            </div>

            <p>Após preencher os dois campos, clique no botão <strong>"Entrar"</strong> para acessar o Painel Principal do sistema.</p>
            <p>Caso tenha problemas de acesso, entre em contato com o administrador.</p>
          </div>
        </DialogContent>
      </Dialog>
      {/* --- FIM DO MODAL DE AJUDA --- */}


      <div className="w-full max-w-md animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-primary p-3 rounded-xl shadow-lg">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-corporate-blue">OSys</h1>
          </div>
          <p className="text-muted-foreground">Sistema de Gerenciamento de Ordens de Serviço</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-neutral-dark flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Acesso ao Sistema
            </CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o OSys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login" className="text-neutral-dark font-medium">
                  Usuário
                </Label>
                <Input
                  id="login"
                  name="login"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha" className="text-neutral-dark font-medium">
                  Senha
                </Label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <Button 
                type="submit" 
                variant="corporate" 
                size="lg" 
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          © 2025 CoreInfo - Sistema OSys
        </footer>
      </div>
    </div>
  );
};

export default Login;