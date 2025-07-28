import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Repeat, 
  CreditCard, 
  Calendar, 
  BarChart3,
  Users,
  Shield,
  Settings,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Clock,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Gift,
  Zap,
  Crown,
  Star,
  Mail,
  Bell,
  Calculator
} from "lucide-react";

export default function Subscriptions() {
  const features = [
    {
      icon: <Repeat className="h-6 w-6" />,
      title: "Flexible Billing Cycles",
      description: "Support for any billing frequency from daily to annual subscriptions",
      benefits: ["Custom intervals", "Proration handling", "Multiple cycles per product"]
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Payment Management",
      description: "Automated payment processing with smart retry logic and dunning",
      benefits: ["Failed payment recovery", "Payment method updates", "Automatic retries"]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Customer Lifecycle",
      description: "Complete customer journey from trial to cancellation management",
      benefits: ["Free trials", "Upgrade/downgrade", "Cancellation flows"]
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Revenue Analytics",
      description: "Comprehensive subscription metrics and revenue recognition",
      benefits: ["MRR/ARR tracking", "Churn analysis", "Revenue forecasting"]
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Plan Management",
      description: "Dynamic pricing plans with add-ons and usage-based billing",
      benefits: ["Tiered pricing", "Usage metering", "Add-on management"]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Compliance & Security",
      description: "PCI DSS compliant with advanced security and tax handling",
      benefits: ["Tax automation", "Data protection", "Compliance reports"]
    }
  ];

  const subscriptionTypes = [
    {
      title: "SaaS Software",
      description: "Monthly or annual software subscriptions with usage tracking",
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      features: ["Usage metering", "Seat-based pricing", "API access tiers"]
    },
    {
      title: "Content & Media",
      description: "Streaming services, news, and digital content subscriptions",
      image: "https://images.pexels.com/photos/33175230/pexels-photo-33175230.jpeg",
      features: ["Content access levels", "Download limits", "Offline viewing"]
    },
    {
      title: "Physical Products",
      description: "Box subscriptions, consumables, and product deliveries",
      image: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
      features: ["Shipping management", "Inventory tracking", "Pause/skip options"]
    },
    {
      title: "Services & Support",
      description: "Professional services, support plans, and consulting",
      image: "https://images.pexels.com/photos/33156848/pexels-photo-33156848.jpeg",
      features: ["Service hours tracking", "Priority support", "Custom SLAs"]
    }
  ];

  const metrics = [
    { label: "Revenue Growth", value: "+127%", description: "Average MRR growth for customers" },
    { label: "Churn Reduction", value: "45%", description: "Lower churn with smart dunning" },
    { label: "Payment Success", value: "99.2%", description: "Payment processing success rate" },
    { label: "Setup Time", value: "< 24hrs", description: "Time to launch subscriptions" }
  ];

  const pricingPlans = [
    {
      name: "Subscription Starter",
      price: "₹4,999",
      period: "/month",
      description: "Perfect for small subscription businesses",
      features: [
        "Up to 1,000 subscribers",
        "Basic billing cycles",
        "Payment processing",
        "Customer portal",
        "Email notifications",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: "Subscription Pro",
      price: "₹14,999",
      period: "/month",
      description: "For growing subscription businesses",
      features: [
        "Up to 10,000 subscribers",
        "Advanced billing options",
        "Dunning management",
        "Usage-based billing",
        "Advanced analytics",
        "API access",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Subscription Enterprise",
      price: "Custom",
      period: "",
      description: "For large-scale subscription operations",
      features: [
        "Unlimited subscribers",
        "Custom billing logic",
        "Revenue recognition",
        "Advanced integrations",
        "Dedicated success manager",
        "Custom SLAs",
        "24/7 support"
      ],
      popular: false
    }
  ];

  const billingSteps = [
    {
      step: 1,
      title: "Setup Plans",
      description: "Create flexible pricing plans with trials and add-ons",
      icon: <Settings className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Customer Signup",
      description: "Seamless signup with payment method collection",
      icon: <Users className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Automated Billing",
      description: "Automatic recurring charges with smart retry logic",
      icon: <Repeat className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Revenue Analytics",
      description: "Track MRR, churn, and subscription performance",
      icon: <BarChart3 className="h-6 w-6" />
    }
  ];

  return (
    <Layout>
      <div className="space-y-12 p-6">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">Subscription Commerce</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Build Recurring
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Revenue Streams</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Complete subscription management platform with flexible billing, automated dunning, 
            and comprehensive analytics to grow your recurring revenue business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              <Repeat className="h-5 w-5 mr-2" />
              Start Subscription Business
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary mb-1">{metric.value}</div>
                <div className="font-medium mb-1">{metric.label}</div>
                <div className="text-xs text-muted-foreground">{metric.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hero Image */}
        <Card className="overflow-hidden max-w-6xl mx-auto">
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg" 
              alt="Subscription Analytics Dashboard"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-12">
              <div className="text-white max-w-2xl">
                <h3 className="text-3xl font-bold mb-4">Smart Subscription Management</h3>
                <p className="text-xl text-white/90 mb-6">
                  From simple recurring billing to complex usage-based pricing, our platform 
                  handles every aspect of subscription commerce with intelligence and precision.
                </p>
                <Button variant="secondary">Explore Features</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Complete Subscription Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to launch, manage, and grow your subscription business
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

        {/* Subscription Types */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Subscription Business Models</h2>
            <p className="text-lg text-muted-foreground">
              Support for every type of subscription business across industries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionTypes.map((type, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-32">
                  <img 
                    src={type.image} 
                    alt={type.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 text-white">
                    <h3 className="font-bold text-sm">{type.title}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                  <ul className="space-y-1">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-xs">
                        <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing Process */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Automated Billing Process</h2>
            <p className="text-lg text-muted-foreground">
              Streamlined workflow from customer signup to revenue recognition
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {billingSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-lg mb-4">
                      {step.step}
                    </div>
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
                      {step.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                
                {index < billingSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-muted-foreground/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Features */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Advanced Subscription Features</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Revenue Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Automatic revenue recognition with ASC 606 compliance and detailed reporting.
                </p>
                <ul className="space-y-2">
                  {[
                    "Deferred revenue tracking",
                    "Monthly/annual recognition",
                    "Compliance reporting",
                    "Revenue forecasting"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Smart Dunning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Intelligent failed payment recovery with customizable retry logic and communication.
                </p>
                <ul className="space-y-2">
                  {[
                    "Automatic retry schedules",
                    "Customer communication",
                    "Payment method updates",
                    "Churn prevention"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Usage-Based Billing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Meter usage and bill customers based on actual consumption with flexible pricing tiers.
                </p>
                <ul className="space-y-2">
                  {[
                    "API usage metering",
                    "Tiered pricing models",
                    "Real-time tracking",
                    "Overage charges"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  Promotions & Discounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Flexible promotion system with coupons, trials, and customer-specific discounts.
                </p>
                <ul className="space-y-2">
                  {[
                    "Free trial periods",
                    "Percentage/fixed discounts",
                    "Limited-time offers",
                    "Customer-specific pricing"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Subscription Pricing Plans</h2>
            <p className="text-lg text-muted-foreground">
              Choose the right plan for your subscription business size and complexity
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
                    {plan.name === 'Subscription Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Customer Success */}
        <Card className="max-w-6xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Customer Success Story</h3>
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg italic text-muted-foreground mb-4">
                "CommerceForge's subscription platform helped us increase our MRR by 180% in just 8 months. 
                The smart dunning alone reduced our churn by 35%."
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">Head of Growth, TechFlow SaaS</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary to-accent text-white max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Launch Your Subscription Business?</h3>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of companies building recurring revenue with our subscription platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Repeat className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
