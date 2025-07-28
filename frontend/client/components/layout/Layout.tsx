import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  hideSidebar?: boolean;
}

export function Layout({ children, hideFooter = false, hideSidebar = false }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (hideSidebar) {
    // Auth pages layout without sidebar
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
        {!hideFooter && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      <div className={cn(
        "transition-all duration-200 ease-in-out",
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        <main className="flex-1">
          {children}
        </main>

        {!hideFooter && <Footer />}
      </div>
    </div>
  );
}
