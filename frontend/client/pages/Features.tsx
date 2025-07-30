import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import {
  Store,
  Palette,
  ShoppingCart,
  Users,
  Brain,
  Smartphone,
  CreditCard,
  Truck,
  FileText,
  Globe,
  BarChart3,
  Shield,
  Settings,
  Zap,
  Crown,
  CheckCircle,
  Star,
  TrendingUp,
  Package,
  MessageSquare,
  Eye,
  Play,
} from "lucide-react";

export default function Features() {
  const navigate = useNavigate();

  const featureCategories = [
    {
      id: "business-models",
      title: "Business Models",
      icon: <Store className="h-6 w-6" />,
      description: "Support for every type of commerce business",
      features: [
        {
          name: "Single Vendor Stores",
          description: "Traditional e-commerce for individual businesses",
          benefits: [
            "Quick setup",
            "Full customization",
            "Direct customer relationships",
          ],
        },
        {
          name: "Multi-Vendor Marketplaces",
          description: "Amazon-style platforms with multiple sellers",
          benefits: [
            "Commission management",
            "Vendor onboarding",
            "Centralized operations",
          ],
        },
        {
          name: "Subscription Services",
          description: "Recurring billing and subscription management",
          benefits: [
            "Flexible billing cycles",
            "Dunning management",
            "Customer retention tools",
          ],
        },
        {
          name: "Service Bookings",
          description: "Appointment-based business management",
          benefits: [
            "Calendar integration",
            "Time slot management",
            "Service packages",
          ],
        },
      ],
    },
    {
      id: "storefront",
      title: "Storefront Builder",
      icon: <Palette className="h-6 w-6" />,
      description: "Drag-and-drop design system with professional templates",
      features: [
        {
          name: "Visual Page Builder",
          description: "Drag-and-drop interface for creating stunning pages",
          benefits: [
            "No coding required",
            "Real-time preview",
            "Mobile-responsive",
          ],
        },
        {
          name: "Professional Templates",
          description: "Industry-specific designs for every business type",
          benefits: [
            "Over 100 templates",
            "Customizable layouts",
            "Brand consistency",
          ],
        },
        {
          name: "Mobile-First Design",
          description: "Optimized for mobile shopping experiences",
          benefits: [
            "Touch-friendly interface",
            "Fast loading",
            "App-like experience",
          ],
        },
      ],
    },
    {
      id: "ai-tools",
      title: "AI-Powered Tools",
      icon: <Brain className="h-6 w-6" />,
      description: "Artificial intelligence to automate and optimize",
      features: [
        {
          name: "Content Generation",
          description: "AI-powered product descriptions and SEO content",
          benefits: [
            "Auto-generated copy",
            "SEO optimization",
            "Multi-language support",
          ],
        },
        {
          name: "Smart Recommendations",
          description: "Personalized product suggestions for customers",
          benefits: [
            "Increased sales",
            "Better user experience",
            "Dynamic pricing",
          ],
        },
        {
          name: "Fraud Detection",
          description: "Advanced security with AI-powered fraud prevention",
          benefits: [
            "Real-time monitoring",
            "Risk assessment",
            "Automated blocking",
          ],
        },
      ],
    },
  ];

  const keyMetrics = [
    {
      label: "Average Setup Time",
      value: "15 minutes",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      label: "Performance Improvement",
      value: "3.2x faster",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      label: "Conversion Rate Boost",
      value: "+34%",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      label: "Customer Satisfaction",
      value: "98%",
      icon: <Star className="h-4 w-4" />,
    },
  ];

  const integrations = [
    "Stripe",
    "PayPal",
    "Square",
    "Shopify",
    "WooCommerce",
    "Salesforce",
    "HubSpot",
    "Mailchimp",
    "Google Analytics",
    "Facebook Pixel",
    "Zapier",
    "AWS",
  ];

  return (
    <Layout>
      <div className="space-y-12 p-6">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">
            Platform Features
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to Build
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}
              Modern Commerce
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            From AI-powered storefronts to global payment processing, we've
            built every feature you need to compete with industry giants and
            scale globally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {keyMetrics.map((metric, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                  {metric.icon}
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-muted-foreground">
                  {metric.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Hero Image */}
        <Card className="overflow-hidden">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/936135/pexels-photo-936135.jpeg"
              alt="E-commerce dashboard and analytics"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-12">
              <div className="text-white max-w-2xl">
                <h3 className="text-3xl font-bold mb-4">
                  Built for Modern Commerce
                </h3>
                <p className="text-xl text-white/90 mb-6">
                  Our platform combines cutting-edge technology with intuitive
                  design to deliver exceptional commerce experiences.
                </p>
                <div className="flex space-x-4">
                  <Button variant="secondary">Explore Features</Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Feature Categories */}
        <Tabs defaultValue="business-models" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="business-models">Business Models</TabsTrigger>
            <TabsTrigger value="storefront">Storefront</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          </TabsList>

          {featureCategories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
                  {category.icon}
                </div>
                <h2 className="text-3xl font-bold mb-4">{category.title}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {category.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {category.features.map((feature, index) => (
                  <Card key={index} className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        {feature.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* All Features Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Complete Feature Set</h2>
            <p className="text-lg text-muted-foreground">
              Every tool you need to build, manage, and scale your commerce
              business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <ShoppingCart className="h-6 w-6" />,
                title: "Product Management",
                desc: "Variants, inventory, bundles, and AI categorization",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Vendor Tools",
                desc: "Complete vendor onboarding and management system",
              },
              {
                icon: <CreditCard className="h-6 w-6" />,
                title: "Payments",
                desc: "Multi-currency, BNPL, wallets, and smart couponing",
              },
              {
                icon: <Truck className="h-6 w-6" />,
                title: "Fulfillment",
                desc: "Dynamic shipping, courier APIs, and tracking",
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: "Order Management",
                desc: "Complete order lifecycle and refund automation",
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: "Customer Loyalty",
                desc: "Reviews, referrals, and gamification tools",
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: "Globalization",
                desc: "Multi-language, multi-currency, regional rules",
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Analytics",
                desc: "Advanced reporting and business intelligence",
              },
              {
                icon: <Smartphone className="h-6 w-6" />,
                title: "Mobile Apps",
                desc: "Auto-generated PWA and native applications",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Security",
                desc: "GDPR compliance, 2FA, and content moderation",
              },
              {
                icon: <Crown className="h-6 w-6" />,
                title: "White Label",
                desc: "Multi-tenant SaaS with custom branding",
              },
              {
                icon: <Settings className="h-6 w-6" />,
                title: "Integrations",
                desc: "1000+ apps and custom API connections",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              <Settings className="h-6 w-6 mx-auto mb-2" />
              1000+ Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-8">
              Connect with all your favorite tools and services
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {integrations.map((integration, index) => (
                <Badge key={index} variant="secondary" className="px-4 py-2">
                  {integration}
                </Badge>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline">View All Integrations</Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses who have chosen CommerceForge to
              power their success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/get-started")}
              >
                Start Free Trial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
