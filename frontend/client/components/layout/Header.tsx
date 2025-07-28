import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  User, 
  Store, 
  Zap,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent flex items-center justify-center">
              <Zap className="h-2 w-2 text-white" />
            </div>
          </div>
          <div className="hidden font-bold sm:inline-block">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CommerceForge
            </span>
          </div>
        </Link>

        {/* Navigation - Removed per user request */}

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Globe className="h-4 w-4 mr-2" />
            Global
          </Button>
          
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
            <span className="sr-only">Account</span>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>

          <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" asChild>
            <Link to="/get-started">Get Started</Link>
          </Button>

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
