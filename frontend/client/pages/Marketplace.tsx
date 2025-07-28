import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Store,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  MapPin,
  Package,
  ShoppingCart,
  Eye,
  Heart,
  CheckCircle,
  Clock,
  Globe,
  Shield,
  Zap,
  BarChart3,
  UserPlus,
  Crown,
  Award,
  MessageSquare
} from "lucide-react";

export default function Marketplace() {
  const marketplaceStats = [
    {
      title: "Active Vendors",
      value: "12,847",
      change: "+847 this month",
      icon: <Store className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Total Products",
      value: "847,392",
      change: "+23,847 this week",
      icon: <Package className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Monthly GMV",
      value: "$2.8M",
      change: "+34% growth",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-purple-600"
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5",
      change: "Based on 50k+ reviews",
      icon: <Star className="h-5 w-5" />,
      color: "text-yellow-600"
    }
  ];

  const featuredVendors = [
    {
      id: 1,
      name: "TechGadgets Pro",
      category: "Electronics",
      rating: 4.9,
      reviews: 2847,
      products: 156,
      sales: "$34,892",
      location: "San Francisco, CA",
      verified: true,
      image: "https://images.pexels.com/photos/33141836/pexels-photo-33141836.jpeg",
      badge: "Top Seller"
    },
    {
      id: 2,
      name: "Fashion Forward",
      category: "Fashion & Apparel",
      rating: 4.7,
      reviews: 1928,
      products: 284,
      sales: "$28,473",
      location: "New York, NY",
      verified: true,
      image: "https://images.pexels.com/photos/33141836/pexels-photo-33141836.jpeg",
      badge: "Rising Star"
    },
    {
      id: 3,
      name: "Home & Garden Plus",
      category: "Home & Garden",
      rating: 4.8,
      reviews: 1647,
      products: 198,
      sales: "$31,847",
      location: "Austin, TX",
      verified: true,
      image: "https://images.pexels.com/photos/33141836/pexels-photo-33141836.jpeg",
      badge: "Best Quality"
    }
  ];

  const marketplaceTypes = [
    {
      title: "B2C Marketplace",
      description: "Consumer-focused platforms like Amazon or eBay",
      features: ["Product catalogs", "Customer reviews", "Wishlist & favorites", "Mobile shopping apps"],
      examples: ["Amazon", "eBay", "Walmart"],
      icon: <ShoppingCart className="h-6 w-6" />
    },
    {
      title: "B2B Marketplace",
      description: "Business-to-business trading platforms",
      features: ["Bulk ordering", "Custom pricing", "Quote management", "Business verification"],
      examples: ["Alibaba", "Thomasnet", "Global Sources"],
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Service Marketplace",
      description: "Service-based platforms and bookings",
      features: ["Service listings", "Appointment booking", "Skill verification", "Portfolio showcase"],
      examples: ["Upwork", "Fiverr", "TaskRabbit"],
      icon: <Store className="h-6 w-6" />
    },
    {
      title: "Creative Marketplace",
      description: "Platforms for artists and creators",
      features: ["Digital downloads", "Print-on-demand", "Licensing", "Creative portfolios"],
      examples: ["Etsy", "Creative Market", "Envato"],
      icon: <Award className="h-6 w-6" />
    }
  ];

  const vendorJourney = [
    {
      step: 1,
      title: "Vendor Registration",
      description: "Simple onboarding with document verification",
      duration: "5 minutes",
      features: ["Identity verification", "Business documentation", "Category selection"]
    },
    {
      step: 2,
      title: "Store Setup",
      description: "Customize vendor storefront and branding",
      duration: "15 minutes",
      features: ["Store customization", "Brand assets upload", "Payment setup"]
    },
    {
      step: 3,
      title: "Product Listing",
      description: "Add products with AI-assisted optimization",
      duration: "30 minutes",
      features: ["Bulk product upload", "AI content generation", "SEO optimization"]
    },
    {
      step: 4,
      title: "Go Live",
      description: "Launch and start selling immediately",
      duration: "Instant",
      features: ["Real-time analytics", "Order management", "Customer support"]
    }
  ];

  return (
    <Layout>
      <div className="space-y-12 p-6">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">Marketplace Solutions</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Build the Next
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Global Marketplace</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Create Amazon-scale marketplaces with our comprehensive multi-vendor platform.
            Complete vendor management, automated commissions, and global reach capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              <UserPlus className="h-5 w-5 mr-2" />
              Become a Vendor
            </Button>
            <Button size="lg" variant="outline">
              <Eye className="h-5 w-5 mr-2" />
              Explore Marketplace
            </Button>
          </div>
        </div>

        {/* Marketplace Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {marketplaceStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Marketplace Hero Image */}
        <Card className="overflow-hidden max-w-6xl mx-auto">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/33141836/pexels-photo-33141836.jpeg"
              alt="Global marketplace with vendors and customers"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-12">
              <div className="text-white max-w-2xl">
                <h3 className="text-3xl font-bold mb-4">Powered by Global Commerce</h3>
                <p className="text-xl text-white/90 mb-6">
                  Connect vendors and customers worldwide with our intelligent marketplace platform.
                  Advanced analytics, automated operations, and seamless user experiences.
                </p>
                <div className="flex space-x-4">
                  <Button variant="secondary">View Live Demo</Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    Start Your Marketplace
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Featured Vendors */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Featured Vendors</h2>
            <p className="text-lg text-muted-foreground">
              Discover top-performing sellers across all categories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredVendors.map((vendor) => (
              <Card key={vendor.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 left-4" variant="secondary">
                    {vendor.badge}
                  </Badge>
                  {vendor.verified && (
                    <div className="absolute top-4 right-4 p-1 rounded-full bg-green-500">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{vendor.name}</h3>
                      <p className="text-sm text-muted-foreground">{vendor.category}</p>
                      <div className="flex items-center mt-2">
                        <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">{vendor.location}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                        <span className="font-medium">{vendor.rating}</span>
                        <span className="text-muted-foreground ml-1">({vendor.reviews})</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Products:</span>
                      <div className="font-medium">{vendor.products}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">Monthly Sales:</span>
                      <div className="font-bold text-green-600">{vendor.sales}</div>
                    </div>
                    <Button size="sm">Visit Store</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Marketplace Types */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Marketplace Types We Support</h2>
            <p className="text-lg text-muted-foreground">
              From B2C retail to creative platforms, build any type of marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {marketplaceTypes.map((type, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
                      {type.icon}
                    </div>
                    {type.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{type.description}</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {type.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Examples:</h4>
                    <div className="flex flex-wrap gap-1">
                      {type.examples.map((example, i) => (
                        <Badge key={i} variant="outline">{example}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Vendor Journey */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Vendor Onboarding Journey</h2>
            <p className="text-lg text-muted-foreground">
              Get vendors up and running in under an hour
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {vendorJourney.map((step, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-lg mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  <Badge variant="secondary">{step.duration}</Badge>

                  <div className="mt-4">
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {step.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                {index < vendorJourney.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-muted-foreground/30"></div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Platform Benefits */}
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <Crown className="h-6 w-6 mx-auto mb-2" />
                Why Choose Our Marketplace Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Globe className="h-6 w-6" />,
                    title: "Global Reach",
                    description: "Multi-currency, multi-language support with localized experiences for 180+ countries"
                  },
                  {
                    icon: <Shield className="h-6 w-6" />,
                    title: "Enterprise Security",
                    description: "Bank-level security, fraud protection, and compliance with global regulations"
                  },
                  {
                    icon: <Zap className="h-6 w-6" />,
                    title: "AI-Powered",
                    description: "Smart recommendations, automated moderation, and intelligent pricing optimization"
                  },
                  {
                    icon: <BarChart3 className="h-6 w-6" />,
                    title: "Advanced Analytics",
                    description: "Real-time dashboards, vendor performance tracking, and business intelligence"
                  },
                  {
                    icon: <Users className="h-6 w-6" />,
                    title: "Vendor Management",
                    description: "Complete vendor lifecycle management with automated onboarding and support"
                  },
                  {
                    icon: <DollarSign className="h-6 w-6" />,
                    title: "Flexible Commissions",
                    description: "Customizable commission structures with automated payouts and reporting"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Metrics */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Marketplace Success Metrics</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { metric: "Average Revenue Growth", value: "+247%", description: "First year marketplace growth" },
              { metric: "Vendor Retention Rate", value: "94%", description: "Vendors stay and grow with us" },
              { metric: "Time to First Sale", value: "< 24hrs", description: "From vendor signup to first sale" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.metric}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary to-accent text-white max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Launch Your Marketplace Today</h3>
            <p className="text-xl text-white/90 mb-8">
              Join the global commerce revolution. Create your marketplace in minutes, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Store className="h-5 w-5 mr-2" />
                Start Your Marketplace
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <MessageSquare className="h-5 w-5 mr-2" />
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
