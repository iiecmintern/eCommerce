import { Button } from "@/components/ui/button";
import { Menu, Search, Bell, User, Globe, ChevronRight } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

interface TopBarProps {
  onToggleSidebar: () => void;
  onToggleCollapse?: () => void;
  sidebarCollapsed?: boolean;
}

export function TopBar({ onToggleSidebar, onToggleCollapse, sidebarCollapsed }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 supports-[backdrop-filter]:bg-background/60">
      {/* Left side - Menu toggle */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Expand sidebar button when collapsed */}
        {sidebarCollapsed && onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="hidden lg:inline-flex"
            title="Expand sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}

        {/* Breadcrumb could go here */}
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="hidden lg:inline-flex">
          <Globe className="h-4 w-4 mr-2" />
          Global
        </Button>
        
        <Button variant="ghost" size="sm">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent"></span>
          <span className="sr-only">Notifications</span>
        </Button>

        <Button variant="ghost" size="sm">
          <User className="h-4 w-4" />
          <span className="sr-only">Account</span>
        </Button>

        <ModeToggle />
      </div>
    </header>
  );
}
