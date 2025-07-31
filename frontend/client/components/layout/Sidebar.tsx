import { useState, useEffect } from "react";
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
  Package,
  Heart,
  Car,
  Gamepad2,
  Palette,
  Utensils,
  Baby,
  Flower2,
  Dumbbell,
  Camera,
  Music,
  Monitor,
  Watch,
  Headphones,
  Laptop,
  Tablet,
  Tv,
  Printer,
  Keyboard,
  Mouse,
  Speaker,
  Lamp,
  Bed,
  Table,
  Clock,
  Gift,
  Tag,
  ShoppingCart,
  Square,
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
  const [dynamicCategories, setDynamicCategories] = useState<
    Array<{
      name: string;
      count: number;
      icon: React.ReactNode;
    }>
  >([]);

  // Load dynamic categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Fetch categories from API
        const categoriesResponse = await fetch(
          "http://localhost:5000/api/products/categories",
        );

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          const categoryNames = categoriesData.data || [];

          // Fetch products to get category counts
          const productsResponse = await fetch(
            "http://localhost:5000/api/products",
          );

          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            const products = productsData.data || [];

            // Count products by category
            const categoryCounts: { [key: string]: number } = {};
            products.forEach((product: any) => {
              if (product.category && product.status === "active") {
                categoryCounts[product.category] =
                  (categoryCounts[product.category] || 0) + 1;
              }
            });

            // Create category items with icons
            const categories = categoryNames.map((categoryName: string) => ({
              name: categoryName,
              count: categoryCounts[categoryName] || 0,
              icon: getCategoryIcon(categoryName),
            }));

            // Sort by count (most popular first)
            categories.sort((a, b) => b.count - a.count);

            setDynamicCategories(categories);
          } else {
            console.error("Failed to fetch products for category counts");
          }
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        // Fallback to empty categories
        setDynamicCategories([]);
      }
    };

    loadCategories();
  }, []);

  // Function to get appropriate icon for each category
  const getCategoryIcon = (category: string): React.ReactNode => {
    const categoryLower = category.toLowerCase();

    if (categoryLower.includes("electronics") || categoryLower.includes("tech"))
      return <Monitor className="h-4 w-4" />;
    if (categoryLower.includes("fashion") || categoryLower.includes("clothing"))
      return <Crown className="h-4 w-4" />;
    if (categoryLower.includes("home") || categoryLower.includes("kitchen"))
      return <Building className="h-4 w-4" />;
    if (categoryLower.includes("book")) return <BookOpen className="h-4 w-4" />;
    if (categoryLower.includes("sport") || categoryLower.includes("fitness"))
      return <Dumbbell className="h-4 w-4" />;
    if (categoryLower.includes("beauty") || categoryLower.includes("health"))
      return <Heart className="h-4 w-4" />;
    if (categoryLower.includes("toy") || categoryLower.includes("game"))
      return <Gamepad2 className="h-4 w-4" />;
    if (categoryLower.includes("food") || categoryLower.includes("beverage"))
      return <Utensils className="h-4 w-4" />;
    if (categoryLower.includes("art") || categoryLower.includes("craft"))
      return <Palette className="h-4 w-4" />;
    if (categoryLower.includes("automotive") || categoryLower.includes("car"))
      return <Car className="h-4 w-4" />;
    if (categoryLower.includes("baby") || categoryLower.includes("kids"))
      return <Baby className="h-4 w-4" />;
    if (categoryLower.includes("garden") || categoryLower.includes("plant"))
      return <Flower2 className="h-4 w-4" />;
    if (categoryLower.includes("camera") || categoryLower.includes("photo"))
      return <Camera className="h-4 w-4" />;
    if (categoryLower.includes("music") || categoryLower.includes("audio"))
      return <Music className="h-4 w-4" />;
    if (categoryLower.includes("watch") || categoryLower.includes("jewelry"))
      return <Watch className="h-4 w-4" />;
    if (
      categoryLower.includes("headphone") ||
      categoryLower.includes("earphone")
    )
      return <Headphones className="h-4 w-4" />;
    if (categoryLower.includes("laptop") || categoryLower.includes("computer"))
      return <Laptop className="h-4 w-4" />;
    if (categoryLower.includes("tablet") || categoryLower.includes("ipad"))
      return <Tablet className="h-4 w-4" />;
    if (categoryLower.includes("tv") || categoryLower.includes("television"))
      return <Tv className="h-4 w-4" />;
    if (categoryLower.includes("printer") || categoryLower.includes("scanner"))
      return <Printer className="h-4 w-4" />;
    if (categoryLower.includes("keyboard") || categoryLower.includes("mouse"))
      return <Keyboard className="h-4 w-4" />;
    if (categoryLower.includes("speaker") || categoryLower.includes("sound"))
      return <Speaker className="h-4 w-4" />;
    if (categoryLower.includes("lamp") || categoryLower.includes("light"))
      return <Lamp className="h-4 w-4" />;
    if (categoryLower.includes("sofa") || categoryLower.includes("couch"))
      return <Square className="h-4 w-4" />;
    if (categoryLower.includes("bed") || categoryLower.includes("mattress"))
      return <Bed className="h-4 w-4" />;
    if (categoryLower.includes("chair") || categoryLower.includes("stool"))
      return <Square className="h-4 w-4" />;
    if (categoryLower.includes("table") || categoryLower.includes("desk"))
      return <Table className="h-4 w-4" />;
    if (categoryLower.includes("mirror") || categoryLower.includes("glass"))
      return <Square className="h-4 w-4" />;
    if (categoryLower.includes("clock") || categoryLower.includes("time"))
      return <Clock className="h-4 w-4" />;
    if (categoryLower.includes("gift") || categoryLower.includes("present"))
      return <Gift className="h-4 w-4" />;

    // Default icon for unknown categories
    return <Package className="h-4 w-4" />;
  };

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
        // Dynamic categories from vendor products
        ...dynamicCategories.map((category) => ({
          href: `/category/${category.name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`,
          label: `${category.name} (${category.count})`,
          icon: category.icon,
        })),
        // Show message if no categories found
        ...(dynamicCategories.length === 0
          ? [
              {
                href: "/vendor/products",
                label: "No products yet",
                icon: <Package className="h-4 w-4" />,
              },
            ]
          : []),
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
                          <AvatarImage src="" alt={user.firstName || "User"} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {user.firstName?.charAt(0) || ""}
                            {user.lastName?.charAt(0) || ""}
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
                            {user.firstName || "User"} {user.lastName || ""}
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
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/profile">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage
                            src={
                              user.profilePicture
                                ? `http://localhost:5000${user.profilePicture}`
                                : ""
                            }
                            alt={user.firstName || "User"}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {user.firstName?.charAt(0) || ""}
                            {user.lastName?.charAt(0) || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">
                            {user.firstName || "User"} {user.lastName || ""}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getRoleLabel()}
                          </div>
                        </div>
                      </Link>
                    </Button>
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
