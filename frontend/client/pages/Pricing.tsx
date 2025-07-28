import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  X,
  Star,
  Zap,
  Crown,
  Calculator,
  Users,
  Store,
  Globe,
  Shield,
  Headphones,
  TrendingUp,
  DollarSign,
  Package
} from "lucide-react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState({
    monthlyOrders: 100,
    averageOrderValue: 50,
    numberOfProducts: 50
  });

  const plans = [
    {
      name: "Starter",
      description: "Perfect for new businesses and side projects",
      icon: <Zap className="h-6 w-6" />,
      price: { monthly: 29, annual: 299 },
      features: [
        "Up to 1,000 products",
        "Unlimited bandwidth",
        "Basic analytics",
        "Standard templates",
        "Email support",
        "Mobile responsive",
        "SSL certificate",
        "Payment gateway integration"
      ],
      limits: {
        products: "1,000",
        storage: "10GB",
        support: "Email"
      },
      popular: false
    },
    {
      name: "Professional",
      description: "Best for growing businesses and established stores",
      icon: <Star className="h-6 w-6" />,
      price: { monthly: 79, annual: 799 },
      features: [
        "Up to 10,000 products",
        "Advanced analytics",
        "Premium templates",
        "Multi-currency support",
        "Priority support",
        "SEO optimization",
        "Abandoned cart recovery",
        "Inventory management",
        "Multi-language support",
        "Custom domain"
      ],
      limits: {
        products: "10,000",
        storage: "100GB",
        support: "Priority"
      },
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large businesses with advanced needs",
      icon: <Crown className="h-6 w-6" />,
      price: { monthly: 299, annual: 2999 },
      features: [
        "Unlimited products",
        "Custom integrations",
        "Dedicated account manager",
        "White-label options",
        "Advanced security",
        "API access",
        "Custom reporting",
        "24/7 phone support",
        "Multi-store management",
        "Advanced automation",
        "Custom development"
      ],
      limits: {
        products: "Unlimited",
        storage: "Unlimited",
        support: "24/7 Dedicated"
      },
      popular: false
    }
  ];

  const additionalServices = [
    {
      name: "Migration Service",
      description: "Professional migration from your existing platform",
      price: "From $299",
      icon: <Package className="h-5 w-5" />
    },
    {
      name: "Custom Development",
      description: "Tailored features and integrations for your business",
      price: "From $199/hr",
      icon: <Store className="h-5 w-5" />
    },
    {
      name: "Dedicated Support",
      description: "Priority support with dedicated account manager",
      price: "$499/month",
      icon: <Headphones className="h-5 w-5" />
    }
  ];

  const calculateEstimatedRevenue = () => {
    const monthlyRevenue = calculatorInputs.monthlyOrders * calculatorInputs.averageOrderValue;
    const annualRevenue = monthlyRevenue * 12;
    return { monthly: monthlyRevenue, annual: annualRevenue };
  };

  const revenue = calculateEstimatedRevenue();

  return (
    <Layout>
      <div className="space-y-12 p-6">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">Pricing Plans</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the perfect plan for your business. Start free, scale as you grow.
            No hidden fees, no surprises.
          </p>

          {/* Annual Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm ${isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>
              Annual
              <Badge variant="secondary" className="ml-2">Save 15%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-accent">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-muted-foreground">{plan.description}</p>

                <div className="pt-4">
                  <div className="text-4xl font-bold">
                    ${isAnnual ? Math.round(plan.price.annual / 12) : plan.price.monthly}
                    <span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-green-600">
                      Billed annually (${plan.price.annual}/year)
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Products:</span>
                      <span className="font-medium">{plan.limits.products}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Storage:</span>
                      <span className="font-medium">{plan.limits.storage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Support:</span>
                      <span className="font-medium">{plan.limits.support}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-accent' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ROI Calculator */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-center justify-center">
              <Calculator className="h-6 w-6 mr-2" />
              ROI Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Estimate Your Revenue Potential</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Monthly Orders</label>
                    <input
                      type="number"
                      value={calculatorInputs.monthlyOrders}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, monthlyOrders: parseInt(e.target.value) || 0})}
                      className="w-full mt-1 p-3 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Average Order Value ($)</label>
                    <input
                      type="number"
                      value={calculatorInputs.averageOrderValue}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, averageOrderValue: parseInt(e.target.value) || 0})}
                      className="w-full mt-1 p-3 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Number of Products</label>
                    <input
                      type="number"
                      value={calculatorInputs.numberOfProducts}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, numberOfProducts: parseInt(e.target.value) || 0})}
                      className="w-full mt-1 p-3 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Revenue Projection</h3>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${revenue.monthly.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground">Annual Revenue</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${revenue.annual.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="text-sm text-muted-foreground">Recommended Plan</div>
                    <div className="text-lg font-bold">
                      {calculatorInputs.numberOfProducts > 1000 ? 'Professional' :
                       calculatorInputs.numberOfProducts > 10000 ? 'Enterprise' : 'Starter'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Comparison */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Detailed Feature Comparison</h2>
            <p className="text-lg text-muted-foreground">
              See exactly what's included in each plan
            </p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Features</th>
                      <th className="text-center p-4 font-medium">Starter</th>
                      <th className="text-center p-4 font-medium">Professional</th>
                      <th className="text-center p-4 font-medium">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Products", starter: "1,000", pro: "10,000", enterprise: "Unlimited" },
                      { feature: "Storage", starter: "10GB", pro: "100GB", enterprise: "Unlimited" },
                      { feature: "Analytics", starter: <Check className="h-4 w-4 text-green-500" />, pro: <Check className="h-4 w-4 text-green-500" />, enterprise: <Check className="h-4 w-4 text-green-500" /> },
                      { feature: "Multi-currency", starter: <X className="h-4 w-4 text-red-500" />, pro: <Check className="h-4 w-4 text-green-500" />, enterprise: <Check className="h-4 w-4 text-green-500" /> },
                      { feature: "API Access", starter: <X className="h-4 w-4 text-red-500" />, pro: <X className="h-4 w-4 text-red-500" />, enterprise: <Check className="h-4 w-4 text-green-500" /> },
                      { feature: "White-label", starter: <X className="h-4 w-4 text-red-500" />, pro: <X className="h-4 w-4 text-red-500" />, enterprise: <Check className="h-4 w-4 text-green-500" /> }
                    ].map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center">{row.starter}</td>
                        <td className="p-4 text-center">{row.pro}</td>
                        <td className="p-4 text-center">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Services */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Additional Services</h2>
            <p className="text-lg text-muted-foreground">
              Professional services to accelerate your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                    {service.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <div className="font-bold text-lg">{service.price}</div>
                  <Button variant="outline" className="mt-4">Learn More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all plans come with a 14-day free trial. No credit card required to start."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 30-day money-back guarantee for all new subscriptions."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h4 className="font-medium mb-2">{faq.q}</h4>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary to-accent text-white max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of businesses growing with CommerceForge. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Headphones className="h-5 w-5 mr-2" />
                Talk to Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
