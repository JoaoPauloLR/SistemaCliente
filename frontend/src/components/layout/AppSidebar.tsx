import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
// 1. ADICIONADO: Componentes do Dialog e ícones para o modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  User,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Painel Principal",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
  },
  {
    title: "Ordens de Serviço",
    url: "/ordens-servico",
    icon: FileText,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const handleLogout = () => {
    localStorage.removeItem("osys-user");
    window.location.href = "/";
  };

  const user = JSON.parse(localStorage.getItem("osys-user") || '{"name": "Usuário", "login": "N/A"}');

  return (
    <Sidebar className="border-r border-border bg-white">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold text-corporate-blue">OSys</h2>
              <p className="text-xs text-muted-foreground">Sistema de OS</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <div className="p-2 space-y-2">
          {!collapsed && (
            // 2. MODIFICADO: Adicionado 'flex items-center justify-between' para alinhar o botão de ajuda
            <div className="flex items-center justify-between px-2 py-1">
              <div>
                <p className="text-sm font-medium text-neutral-dark">{user.name}</p>
                <p className="text-xs text-muted-foreground">Logado como: {user.login}</p>
              </div>

              {/* 3. ADICIONADO: Botão e Modal de Ajuda da Barra Lateral */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    aria-label="Ajuda sobre a navegação e usuário"
                  >
                    <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-corporate-blue" />
                      Ajuda: Navegação e Usuário
                    </DialogTitle>
                  </DialogHeader>
                  <div className="text-sm text-muted-foreground space-y-4 mt-4">
                    <p>Esta barra lateral contém os principais atalhos do sistema e as informações do seu usuário.</p>
                    <div>
                      <h4 className="font-semibold text-neutral-dark">Acesso Rápido:</h4>
                      <ul className="list-none mt-2 space-y-2">
                        <li className="flex items-start gap-3"><LayoutDashboard className="h-4 w-4 mt-0.5 flex-shrink-0" /> <div><strong>Painel Principal:</strong> Volta para a tela inicial com as métricas.</div></li>
                        <li className="flex items-start gap-3"><Users className="h-4 w-4 mt-0.5 flex-shrink-0" /> <div><strong>Clientes:</strong> Acessa a tela de gerenciamento de clientes.</div></li>
                        <li className="flex items-start gap-3"><FileText className="h-4 w-4 mt-0.5 flex-shrink-0" /> <div><strong>Ordens de Serviço:</strong> Acessa a tela de gerenciamento de OS.</div></li>
                        <li className="flex items-start gap-3"><BarChart3 className="h-4 w-4 mt-0.5 flex-shrink-0" /> <div><strong>Relatórios:</strong> Abre a página para gerar relatórios financeiros.</div></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-dark">Área do Usuário:</h4>
                      <ul className="list-none mt-2 space-y-2">
                        <li className="flex items-start gap-3"><User className="h-4 w-4 mt-0.5 flex-shrink-0" /> <div><strong>Usuário Logado:</strong> Mostra o nome do funcionário que está usando o sistema.</div></li>
                        <li className="flex items-start gap-3"><LogOut className="h-4 w-4 mt-0.5 flex-shrink-0" /> <div><strong>Sair:</strong> Encerra sua sessão e retorna para a tela de login.</div></li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-error-red hover:text-error-red hover:bg-error-red/10"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}