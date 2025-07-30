import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Store,
  Zap,
  Menu,
  X,
  Home,
  Star,
  DollarSign,
  ShoppingBag,
  Play,
  FileText,
  HelpCircle,
  Phone,
  Settings,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building,
  Users,
  Smartphone,
  Crown,
  Globe,
  Shield,
  BookOpen,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Shop",
    "Platform",
    "Solutions",
    "Account",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const menuSections = [
    {
      title: "Shop",
      items: [
        { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
        {
          href: "/category/electronics",
          label: "Electronics",
          icon: <Star className="h-4 w-4" />,
        },
        {
          href: "/category/fashion",
          label: "Fashion",
          icon: <Crown className="h-4 w-4" />,
        },
        {
          href: "/category/home",
          label: "Home & Kitchen",
          icon: <Building className="h-4 w-4" />,
        },
        {
          href: "/category/books",
          label: "Books",
          icon: <BookOpen className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Platform",
      items: [
        {
          href: "/platform",
          label: "Platform Builder",
          icon: <Settings className="h-4 w-4" />,
        },
        {
          href: "/features",
          label: "Features",
          icon: <Star className="h-4 w-4" />,
        },
        {
          href: "/pricing",
          label: "Pricing",
          icon: <DollarSign className="h-4 w-4" />,
        },
        {
          href: "/demo",
          label: "Live Demo",
          icon: <Play className="h-4 w-4" />,
        },
        {
          href: "/marketplace",
          label: "Marketplace",
          icon: <ShoppingBag className="h-4 w-4" />,
        },
      ],
    },
    ...(user && (user.role === "admin" || user.role === "vendor")
      ? [
          {
            title: "Solutions",
            items: [
              {
                href: "/b2b",
                label: "B2B Commerce",
                icon: <Building className="h-4 w-4" />,
              },
              {
                href: "/subscriptions",
                label: "Subscriptions",
                icon: <Users className="h-4 w-4" />,
              },
              {
                href: "/mobile-app",
                label: "Mobile Apps",
                icon: <Smartphone className="h-4 w-4" />,
              },
              {
                href: "/white-label",
                label: "White Label",
                icon: <Crown className="h-4 w-4" />,
              },
              {
                href: "/enterprise",
                label: "Enterprise",
                icon: <Shield className="h-4 w-4" />,
              },
            ],
          },
        ]
      : []),
    {
      title: "Account",
      items: user
        ? user.role === "admin"
          ? [
              {
                href: "/admin",
                label: "Admin Dashboard",
                icon: <Shield className="h-4 w-4" />,
              },
              {
                href: "/vendor",
                label: "Vendor Dashboard",
                icon: <Store className="h-4 w-4" />,
              },
              {
                href: "/customer",
                label: "Customer Dashboard",
                icon: <User className="h-4 w-4" />,
              },
            ]
          : user.role === "vendor"
            ? [
                {
                  href: "/vendor",
                  label: "Vendor Dashboard",
                  icon: <Store className="h-4 w-4" />,
                },
                {
                  href: "/customer",
                  label: "Customer Dashboard",
                  icon: <User className="h-4 w-4" />,
                },
              ]
            : [
                {
                  href: "/customer",
                  label: "Customer Dashboard",
                  icon: <User className="h-4 w-4" />,
                },
              ]
        : [
            {
              href: "/login",
              label: "Sign In",
              icon: <User className="h-4 w-4" />,
            },
          ],
    },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "vendor":
        return "/vendor";
      case "customer":
        return "/customer";
      default:
        return "/";
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "vendor":
        return <Store className="h-4 w-4" />;
      case "customer":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case "admin":
        return "Admin";
      case "vendor":
        return "Vendor";
      case "customer":
        return "Customer";
      default:
        return "User";
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full transform border-r bg-background transition-all duration-200 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link
              to="/"
              className={cn(
                "flex items-center",
                isCollapsed ? "justify-center" : "space-x-2",
              )}
            >
              <div className="relative">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent flex items-center justify-center">
                  <Zap className="h-2 w-2 text-white" />
                </div>
              </div>
              {!isCollapsed && (
                <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  CommerceForge
                </span>
              )}
            </Link>

            <div className="flex items-center space-x-2">
              {!isCollapsed ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(true)}
                  className="hidden lg:inline-flex"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(false)}
                  className="hidden lg:inline-flex"
                  title="Expand sidebar"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {isCollapsed ? (
              // Collapsed navigation - only icons
              <div className="space-y-2">
                {menuSections.map((section) => (
                  <div key={section.title} className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-center rounded-lg p-3 text-sm transition-colors",
                          isActivePath(item.href)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                        title={item.label}
                      >
                        {item.icon}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              // Expanded navigation - with labels
              <div className="space-y-6">
                {menuSections.map((section) => (
                  <div key={section.title}>
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground mb-3 hover:text-foreground transition-colors"
                    >
                      {section.title}
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 transition-transform",
                          expandedSections.includes(section.title)
                            ? "rotate-180"
                            : "",
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "space-y-1 overflow-hidden transition-all duration-200",
                        expandedSections.includes(section.title)
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0",
                      )}
                    >
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            isActivePath(item.href)
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            {isCollapsed ? (
              <div className="space-y-3 flex flex-col items-center">
                <ModeToggle />
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        className="w-10 h-10 p-0 rounded-full"
                        title="User"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={user.firstName} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            {getRoleIcon()}
                            <span className="text-xs text-muted-foreground">
                              {getRoleLabel()}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    size="sm"
                    className="w-10 h-10 p-0"
                    asChild
                    title="Get Started"
                  >
                    <Link to="/get-started">+</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ModeToggle />
                </div>
                {user ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src="" alt={user.firstName} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {user.firstName.charAt(0)}
                              {user.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getRoleLabel()}
                            </div>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56"
                        align="end"
                        forceMount
                      >
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.email}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              {getRoleIcon()}
                              <span className="text-xs text-muted-foreground">
                                {getRoleLabel()}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuLabel>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      asChild
                    >
                      <Link to="/get-started">Get Started</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
