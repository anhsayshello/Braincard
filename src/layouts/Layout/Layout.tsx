import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="container flex flex-col h-screen">
        <main>
          <SidebarTrigger />
        </main>
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
