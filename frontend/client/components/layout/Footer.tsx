import { Link } from "react-router-dom";
import { 
  Store, 
  Zap, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail,
  Globe,
  Shield,
  Headphones
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent flex items-center justify-center">
                  <Zap className="h-2 w-2 text-white" />
                </div>
              </div>
              <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CommerceForge
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The world's most advanced e-commerce platform builder. Create global marketplaces, 
              AI-powered stores, and scalable commerce solutions in minutes.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors">Live Demo</Link></li>
              <li><Link to="/templates" className="text-muted-foreground hover:text-foreground transition-colors">Templates</Link></li>
              <li><Link to="/integrations" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</Link></li>
              <li><Link to="/api" className="text-muted-foreground hover:text-foreground transition-colors">API</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">Marketplace</Link></li>
              <li><Link to="/b2b" className="text-muted-foreground hover:text-foreground transition-colors">B2B Commerce</Link></li>
              <li><Link to="/subscriptions" className="text-muted-foreground hover:text-foreground transition-colors">Subscriptions</Link></li>
              <li><Link to="/mobile-app" className="text-muted-foreground hover:text-foreground transition-colors">Mobile Apps</Link></li>
              <li><Link to="/white-label" className="text-muted-foreground hover:text-foreground transition-colors">White Label</Link></li>
              <li><Link to="/enterprise" className="text-muted-foreground hover:text-foreground transition-colors">Enterprise</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/community" className="text-muted-foreground hover:text-foreground transition-colors">Community</Link></li>
              <li><Link to="/status" className="text-muted-foreground hover:text-foreground transition-colors">Status</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/security" className="text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>GDPR Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <Headphones className="h-4 w-4" />
              <span>24/7 Support</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground mt-4 sm:mt-0">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <span>© 2024 CommerceForge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
