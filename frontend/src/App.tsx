import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import ClienteForm from "./pages/ClienteForm";
import ClienteDetalhes from "./pages/ClienteDetalhes";
import OrdensServico from "./pages/OrdensServico";
import OSForm from "./pages/OSForm";
import OSDetalhes from "./pages/OSDetalhes";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/clientes/novo" element={<ClienteForm />} />
                <Route path="/clientes/:id" element={<ClienteDetalhes />} />
                <Route path="/clientes/:id/editar" element={<ClienteForm />} />
                <Route path="/ordens-servico" element={<OrdensServico />} />
                <Route path="/ordens-servico/nova" element={<OSForm />} />
                <Route path="/ordens-servico/:id" element={<OSDetalhes />} />
                <Route path="/ordens-servico/:id/editar" element={<OSForm />} />
                <Route path="/relatorios" element={<Relatorios />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
