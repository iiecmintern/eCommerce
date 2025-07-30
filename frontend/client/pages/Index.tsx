import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import {
  ArrowRight,
  Store,
  Zap,
  Globe,
  Smartphone,
  Brain,
  Shield,
  BarChart3,
  Users,
  Rocket,
  CheckCircle,
  Star,
  Play,
  TrendingUp,
  Palette,
  ShoppingCart,
  Settings,
  Headphones,
  Crown,
  Sparkles,
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: <Store className="h-6 w-6" />,
      title: "Business Models",
      description:
        "Single seller, multi-vendor, subscriptions, services, local delivery, bookings",
      category: "Foundation",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Storefront Builder",
      description:
        "Drag-and-drop design with mobile-first templates and multilingual support",
      category: "Design",
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Product Management",
      description: "Variants, inventory, bundles, and AI-based categorization",
      category: "Catalog",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Vendor Tools",
      description:
        "Complete vendor onboarding, product management, and commission tracking",
      category: "Marketplace",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Tools",
      description:
        "Copy generation, SEO optimization, smart recommendations, and fraud detection",
      category: "Intelligence",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Apps",
      description:
        "Auto-generate PWA and native apps with branded vendor experiences",
      category: "Mobile",
    },
  ];

  const useCases = [
    {
      title: "Entrepreneurs",
      description: "Launch D2C or B2B stores with zero technical knowledge",
      icon: <Rocket className="h-8 w-8" />,
    },
    {
      title: "Marketplace Operators",
      description: "Build multi-vendor platforms like Amazon or Etsy",
      icon: <Store className="h-8 w-8" />,
    },
    {
      title: "Service Providers",
      description: "Create appointment-based and booking platforms",
      icon: <Settings className="h-8 w-8" />,
    },
    {
      title: "SaaS Founders",
      description: "White-label e-commerce platforms for your customers",
      icon: <Crown className="h-8 w-8" />,
    },
  ];

  const stats = [
    { label: "Active Stores", value: "50,000+" },
    { label: "Countries Supported", value: "180+" },
    { label: "Transaction Volume", value: "$2.1B+" },
    { label: "AI Optimizations", value: "10M+" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background"></div>
        <div className="container relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Global E-Commerce Platform 2025+
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Build{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI-Powered
              </span>{" "}
              Commerce Platforms
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The world's most advanced e-commerce builder. Create scalable
              marketplaces, subscription services, and global commerce platforms
              with drag-and-drop simplicity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                asChild
              >
                <Link to="/get-started">
                  Start Building Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link to="/demo">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Core Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Scale Commerce
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From AI-powered storefronts to global payment processing, we've
              built every feature you need to compete with the giants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/80 backdrop-blur"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 text-primary group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <Badge variant="secondary" className="text-xs mb-2">
                        {feature.category}
                      </Badge>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Built For Everyone
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perfect for Every Business Model
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className="text-center group hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 text-primary mb-6 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                    {useCase.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 bg-gradient-to-r from-primary/10 to-accent/10"
              >
                <Brain className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built-in AI That Actually Works
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                From generating product descriptions to optimizing checkout
                flows, our AI handles the complex stuff so you can focus on
                growing your business.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Smart product categorization and SEO optimization",
                  "Fraud detection and automated risk management",
                  "Dynamic pricing and inventory recommendations",
                  "Personalized customer experiences at scale",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Button
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                asChild
              >
                <Link to="/ai-features">
                  Explore AI Features
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="relative p-8 rounded-2xl bg-background/80 backdrop-blur border">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 rounded-full bg-success"></div>
                    <span className="text-sm">
                      AI optimizing checkout flow...
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ✨ Conversion rate improved by 34%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Scale */}
      <section className="py-20">
        <div className="container text-center">
          <Badge variant="outline" className="mb-4">
            Global Ready
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Scale Globally from Day One
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Multi-currency, multi-language, multi-region. Our platform handles
            the complexity of global commerce so you don't have to.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">180+ Countries</h3>
              <p className="text-muted-foreground">
                Localized experiences everywhere
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="font-semibold mb-2">99.9% Uptime</h3>
              <p className="text-muted-foreground">
                Enterprise-grade reliability
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-success" />
              <h3 className="font-semibold mb-2">SOC 2 Compliant</h3>
              <p className="text-muted-foreground">Bank-level security</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Commerce Empire?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who've chosen CommerceForge to power
            their success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/get-started">
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>

            
          </div>
        </div>
      </section>
    </Layout>
  );
}
