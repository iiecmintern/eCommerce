import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Store,
  Users,
  Repeat,
  Calendar,
  Globe,
  Palette,
  CreditCard,
  Truck,
  Rocket,
  Zap,
  Crown,
  Package,
  Smartphone,
  BarChart3,
  Shield,
  Settings,
  Play,
  Star
} from "lucide-react";

export default function GetStarted() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: "",
    storeName: "",
    category: "",
    template: "",
    domain: "",
    currency: "USD",
    country: "US"
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const businessTypes = [
    {
      id: "single-vendor",
      title: "Single Store",
      description: "Traditional e-commerce for individual businesses",
      icon: <Store className="h-8 w-8" />,
      popular: true,
      features: ["Full customization", "Direct payments", "Integrated analytics"]
    },
    {
      id: "marketplace",
      title: "Marketplace",
      description: "Multi-vendor platform like Amazon or Etsy",
      icon: <Users className="h-8 w-8" />,
      popular: false,
      features: ["Vendor management", "Commission tracking", "Multi-store checkout"]
    },
    {
      id: "subscription",
      title: "Subscription",
      description: "Recurring billing and membership sites",
      icon: <Repeat className="h-8 w-8" />,
      popular: false,
      features: ["Recurring payments", "Member management", "Content protection"]
    },
    {
      id: "services",
      title: "Services & Bookings",
      description: "Appointment-based businesses",
      icon: <Calendar className="h-8 w-8" />,
      popular: false,
      features: ["Calendar booking", "Service packages", "Staff management"]
    }
  ];

  const templates = [
    {
      id: "modern-minimal",
      name: "Modern Minimal",
      category: "Fashion",
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
      popular: true
    },
    {
      id: "tech-store",
      name: "Tech Store",
      category: "Electronics",
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
      popular: false
    },
    {
      id: "marketplace-pro",
      name: "Marketplace Pro",
      category: "Multi-vendor",
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
      popular: false
    },
    {
      id: "creative-studio",
      name: "Creative Studio",
      category: "Art & Design",
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
      popular: false
    }
  ];

  const categories = [
    "Fashion & Apparel", "Electronics", "Home & Garden", "Health & Beauty",
    "Sports & Outdoors", "Books & Media", "Toys & Games", "Food & Beverage",
    "Art & Crafts", "Automotive", "Business & Industrial", "Other"
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <Badge variant="outline" className="mb-4">Get Started</Badge>
          <h1 className="text-4xl font-bold mb-4">
            Launch Your
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> E-commerce Empire</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Build and launch your store in minutes with our guided setup wizard
          </p>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              <span>Business Type</span>
              <span>Store Details</span>
              <span>Design</span>
              <span>Configuration</span>
              <span>Launch</span>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {/* Step 1: Business Type */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Choose Your Business Model</h2>
                  <p className="text-muted-foreground">
                    Select the type of e-commerce business you want to build
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {businessTypes.map((type) => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        formData.businessType === type.id ? 'border-primary shadow-lg' : ''
                      }`}
                      onClick={() => handleInputChange('businessType', type.id)}
                    >
                      <CardContent className="p-6 text-center">
                        {type.popular && (
                          <Badge className="mb-4" variant="secondary">Most Popular</Badge>
                        )}
                        <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
                          {type.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-2">{type.title}</h3>
                        <p className="text-muted-foreground mb-4">{type.description}</p>
                        <ul className="space-y-1 text-sm">
                          {type.features.map((feature, index) => (
                            <li key={index} className="flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Store Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Store Details</h2>
                  <p className="text-muted-foreground">
                    Tell us about your store and what you'll be selling
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      placeholder="Enter your store name"
                      value={formData.storeName}
                      onChange={(e) => handleInputChange('storeName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Primary Category</Label>
                    <select
                      className="w-full p-3 border rounded-lg"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <select
                        className="w-full p-3 border rounded-lg"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        className="w-full p-3 border rounded-lg"
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Design Template */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Choose Your Design</h2>
                  <p className="text-muted-foreground">
                    Select a professional template for your store
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        formData.template === template.id ? 'border-primary shadow-lg' : ''
                      }`}
                      onClick={() => handleInputChange('template', template.id)}
                    >
                      <div className="relative">
                        <img
                          src={template.image}
                          alt={template.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {template.popular && (
                          <Badge className="absolute top-2 left-2" variant="secondary">
                            Popular
                          </Badge>
                        )}
                        <div className="absolute top-2 right-2">
                          <Button variant="ghost" size="sm" className="bg-white/80">
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.category}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button variant="outline">
                    <Palette className="h-4 w-4 mr-2" />
                    Browse All Templates
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Configuration */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Configure Your Store</h2>
                  <p className="text-muted-foreground">
                    Set up essential features and integrations
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: <Globe className="h-6 w-6" />, title: "Domain Setup", desc: "Connect your custom domain", status: "pending" },
                    { icon: <CreditCard className="h-6 w-6" />, title: "Payment Gateway", desc: "Stripe, PayPal integration", status: "pending" },
                    { icon: <Truck className="h-6 w-6" />, title: "Shipping Options", desc: "Configure shipping rates", status: "pending" },
                    { icon: <Shield className="h-6 w-6" />, title: "SSL Certificate", desc: "Secure your store", status: "auto" },
                    { icon: <Smartphone className="h-6 w-6" />, title: "Mobile App", desc: "Auto-generate mobile app", status: "auto" },
                    { icon: <BarChart3 className="h-6 w-6" />, title: "Analytics", desc: "Google Analytics setup", status: "auto" }
                  ].map((feature, index) => (
                    <Card key={index} className="text-center">
                      <CardContent className="p-6">
                        <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                          {feature.icon}
                        </div>
                        <h3 className="font-medium mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{feature.desc}</p>
                        {feature.status === 'auto' ? (
                          <Badge variant="secondary">Auto-configured</Badge>
                        ) : (
                          <Button size="sm" variant="outline">Configure</Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Custom Domain (Optional)</Label>
                    <Input
                      id="domain"
                      placeholder="yourstore.com"
                      value={formData.domain}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      You can also use our free subdomain: {formData.storeName?.toLowerCase().replace(/\s+/g, '-') || 'yourstore'}.commerceforge.app
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Launch */}
            {currentStep === 5 && (
              <div className="space-y-6 text-center">
                <div className="inline-flex p-6 rounded-full bg-gradient-to-r from-primary to-accent text-white mb-6">
                  <Rocket className="h-12 w-12" />
                </div>

                <h2 className="text-3xl font-bold mb-4">🎉 You're Ready to Launch!</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Your store is configured and ready to start selling
                </p>

                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Launch Checklist</h3>
                    <div className="space-y-3 text-left">
                      {[
                        "Store design and branding configured",
                        "Payment gateway connected",
                        "Shipping options set up",
                        "SSL certificate installed",
                        "Mobile app generated",
                        "Analytics tracking enabled"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Package className="h-8 w-8 mx-auto mb-4 text-primary" />
                      <h4 className="font-medium mb-2">Add Products</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start adding your products with AI-assisted descriptions
                      </p>
                      <Button size="sm" variant="outline">Add Products</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Settings className="h-8 w-8 mx-auto mb-4 text-primary" />
                      <h4 className="font-medium mb-2">Customize Design</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Fine-tune your store's appearance and branding
                      </p>
                      <Button size="sm" variant="outline">Customize</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Zap className="h-8 w-8 mx-auto mb-4 text-primary" />
                      <h4 className="font-medium mb-2">Marketing Tools</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Set up email campaigns and social media integration
                      </p>
                      <Button size="sm" variant="outline">Setup Marketing</Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 max-w-2xl mx-auto">
                  <h4 className="font-semibold mb-2">🎁 Launch Bonus</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get 3 months free when you launch within the next 24 hours!
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">$297 value included</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !formData.businessType) ||
                (currentStep === 2 && (!formData.storeName || !formData.category)) ||
                (currentStep === 3 && !formData.template)
              }
              className="bg-gradient-to-r from-primary to-accent"
            >
              Next Step
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button className="bg-gradient-to-r from-primary to-accent">
              <Rocket className="h-4 w-4 mr-2" />
              Launch My Store
            </Button>
          )}
        </div>

        {/* Support */}
        <Card className="text-center bg-muted/30">
          <CardContent className="p-6">
            <h4 className="font-medium mb-2">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Our team is here to help you every step of the way
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm">Live Chat</Button>
              <Button variant="outline" size="sm">Schedule Call</Button>
              <Button variant="outline" size="sm">Help Center</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
