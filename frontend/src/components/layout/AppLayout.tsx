import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const AppLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("osys-user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-neutral-light">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 items-center gap-4 border-b border-border bg-white px-6 shadow-sm">
            <SidebarTrigger className="h-8 w-8" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
          <footer className="border-t border-border bg-white px-6 py-4">
            <p className="text-sm text-muted-foreground text-center">
              © 2025 CoreInfo - Sistema OSys
            </p>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;