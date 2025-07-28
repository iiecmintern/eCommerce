import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  FileText,
  Shield,
  BarChart3,
  Settings,
  Truck,
  CheckCircle,
  ArrowRight,
  Globe,
  CreditCard,
  Package,
  UserCheck,
  Workflow,
  Calculator,
  Clock,
  Handshake,
  Star,
  TrendingUp
} from "lucide-react";

export default function B2BCommerce() {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multi-User Accounts",
      description: "Role-based access control with approval workflows for team purchases",
      benefits: ["Account hierarchies", "User permissions", "Purchase approval chains"]
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Custom Pricing",
      description: "Tiered pricing, volume discounts, and contract-based pricing models",
      benefits: ["Volume discounts", "Customer-specific pricing", "Contract pricing"]
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Bulk Ordering",
      description: "Streamlined bulk order management with quick reorder functionality",
      benefits: ["CSV import", "Quick reorder", "Saved shopping lists"]
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Quote Management",
      description: "Professional quote generation and approval workflows",
      benefits: ["Custom quotes", "Quote approval", "Convert to orders"]
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Payment Terms",
      description: "Flexible payment options including credit terms and invoicing",
      benefits: ["Net payment terms", "Credit limits", "Invoice management"]
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and business intelligence for B2B insights",
      benefits: ["Purchase analytics", "Customer insights", "ROI tracking"]
    }
  ];

  const useCases = [
    {
      title: "Manufacturing",
      description: "Streamline procurement with suppliers and distributors",
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      features: ["Raw material ordering", "Supplier management", "Inventory tracking"]
    },
    {
      title: "Wholesale Distribution",
      description: "Manage relationships with retailers and resellers",
      image: "https://images.pexels.com/photos/33175230/pexels-photo-33175230.jpeg",
      features: ["Volume pricing", "Territory management", "Sales rep portals"]
    },
    {
      title: "Professional Services",
      description: "Sell services and products to business clients",
      image: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
      features: ["Service packages", "Recurring billing", "Client portals"]
    }
  ];

  const stats = [
    { label: "B2B Transactions", value: "€2.3T", description: "Global B2B e-commerce market size" },
    { label: "Growth Rate", value: "18.7%", description: "Annual B2B e-commerce growth" },
    { label: "Cost Reduction", value: "15-20%", description: "Average procurement cost savings" },
    { label: "Order Processing", value: "85%", description: "Faster order processing time" }
  ];

  const pricingPlans = [
    {
      name: "Starter B2B",
      price: "₹9,999",
      period: "/month",
      description: "Perfect for small B2B businesses",
      features: [
        "Up to 100 business customers",
        "Basic pricing tiers",
        "Order management",
        "Customer portal",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional B2B",
      price: "₹24,999",
      period: "/month",
      description: "For growing B2B operations",
      features: [
        "Unlimited business customers",
        "Advanced pricing rules",
        "Quote management",
        "Approval workflows",
        "Custom integrations",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Enterprise B2B",
      price: "Custom",
      period: "",
      description: "For large-scale B2B operations",
      features: [
        "Everything in Professional",
        "Custom development",
        "Dedicated account manager",
        "Advanced analytics",
        "Multi-tenant architecture",
        "24/7 support"
      ],
      popular: false
    }
  ];

  return (
    <Layout>
      <div className="space-y-12 p-6">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">B2B Commerce Solution</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Power Your
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> B2B Sales</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Complete B2B e-commerce platform with custom pricing, bulk ordering, and enterprise-grade features 
            designed for business-to-business transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              <Building2 className="h-5 w-5 mr-2" />
              Start B2B Platform
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hero Image */}
        <Card className="overflow-hidden max-w-6xl mx-auto">
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg" 
              alt="B2B Commerce Dashboard"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-12">
              <div className="text-white max-w-2xl">
                <h3 className="text-3xl font-bold mb-4">Built for Business Relationships</h3>
                <p className="text-xl text-white/90 mb-6">
                  Transform your B2B operations with intelligent pricing, streamlined workflows, 
                  and powerful analytics designed for complex business transactions.
                </p>
                <Button variant="secondary">Explore Platform</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Complete B2B Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to manage complex B2B relationships and transactions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-xs">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Industry Solutions</h2>
            <p className="text-lg text-muted-foreground">
              Tailored B2B solutions for different industries and business models
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={useCase.image} 
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg">{useCase.title}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">B2B Workflow</h2>
            <p className="text-lg text-muted-foreground">
              Streamlined process from customer onboarding to order fulfillment
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <UserCheck className="h-8 w-8" />, title: "Customer Onboarding", desc: "Verify business credentials and set up accounts" },
              { icon: <Calculator className="h-8 w-8" />, title: "Custom Pricing", desc: "Apply customer-specific pricing and contracts" },
              { icon: <ShoppingCart className="h-8 w-8" />, title: "Bulk Ordering", desc: "Process large orders with approval workflows" },
              { icon: <Truck className="h-8 w-8" />, title: "Order Fulfillment", desc: "Manage complex logistics and delivery schedules" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">B2B Pricing Plans</h2>
            <p className="text-lg text-muted-foreground">
              Choose the right plan for your B2B business size and requirements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-accent">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-muted-foreground">{plan.description}</p>
                  <div className="pt-4">
                    <div className="text-3xl font-bold">
                      {plan.price}
                      <span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-accent' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.name === 'Enterprise B2B' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration */}
        <Card className="max-w-6xl mx-auto">
          <CardContent className="p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Enterprise Integrations</h3>
                <p className="text-muted-foreground mb-6">
                  Seamlessly integrate with your existing business systems including ERP, CRM, 
                  and accounting software for unified operations.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    "SAP Integration",
                    "Salesforce CRM",
                    "QuickBooks",
                    "Oracle ERP",
                    "Microsoft Dynamics",
                    "Custom APIs"
                  ].map((integration, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{integration}</span>
                    </div>
                  ))}
                </div>
                <Button>
                  View All Integrations
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg" 
                  alt="Enterprise integrations"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary to-accent text-white max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your B2B Sales?</h3>
            <p className="text-xl text-white/90 mb-8">
              Join leading B2B companies using our platform to streamline operations and grow revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Building2 className="h-5 w-5 mr-2" />
                Start B2B Platform
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Handshake className="h-5 w-5 mr-2" />
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
