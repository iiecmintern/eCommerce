import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  Settings,
  ShoppingCart,
  Star,
  Heart,
  Share,
  Package,
  CreditCard,
  Truck,
  BarChart3,
  Users,
  Store,
  Zap
} from "lucide-react";

export default function Demo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState("storefront");
  const [deviceView, setDeviceView] = useState("desktop");

  const demoSections = [
    {
      id: "storefront",
      title: "Storefront Builder",
      description: "Drag-and-drop store builder with real-time preview",
      icon: <Store className="h-5 w-5" />,
      duration: "3:45"
    },
    {
      id: "admin",
      title: "Admin Dashboard",
      description: "Complete business management interface",
      icon: <BarChart3 className="h-5 w-5" />,
      duration: "4:20"
    },
    {
      id: "ai-tools",
      title: "AI Features",
      description: "Smart automation and optimization tools",
      icon: <Zap className="h-5 w-5" />,
      duration: "2:30"
    },
    {
      id: "mobile",
      title: "Mobile Experience",
      description: "Native mobile app and responsive design",
      icon: <Smartphone className="h-5 w-5" />,
      duration: "3:15"
    }
  ];

  const mockProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: "$79.99",
      originalPrice: "$99.99",
      rating: 4.8,
      reviews: 2847,
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: "$149.99",
      originalPrice: "$199.99",
      rating: 4.6,
      reviews: 1523,
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
      badge: "25% OFF"
    },
    {
      id: 3,
      name: "Portable Phone Charger",
      price: "$24.99",
      originalPrice: "$34.99",
      rating: 4.9,
      reviews: 982,
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
      badge: "New"
    }
  ];

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">Interactive Demo</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Experience CommerceForge
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Live</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Test drive our platform with interactive demos. See how easy it is to build
            professional e-commerce experiences without any coding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              <Play className="h-5 w-5 mr-2" />
              Start Interactive Tour
            </Button>
            <Button size="lg" variant="outline">
              <Eye className="h-5 w-5 mr-2" />
              View Live Stores
            </Button>
          </div>
        </div>

        {/* Demo Selection */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Choose Your Demo Experience</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {demoSections.map((section) => (
              <Card
                key={section.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedDemo === section.id ? 'border-primary shadow-lg' : ''
                }`}
                onClick={() => setSelectedDemo(section.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                    {section.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{section.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                  <Badge variant="secondary">{section.duration}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Demo Interface */}
        <Card className="max-w-7xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Live Demo - {demoSections.find(s => s.id === selectedDemo)?.title}
              </CardTitle>

              {/* Device Selector */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={deviceView === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDeviceView('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={deviceView === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDeviceView('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={deviceView === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDeviceView('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Demo Controls */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Interactive Demo • Click anywhere to explore
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className={`bg-muted/30 rounded-lg overflow-hidden ${
              deviceView === 'mobile' ? 'max-w-sm mx-auto' :
              deviceView === 'tablet' ? 'max-w-2xl mx-auto' :
              'w-full'
            }`}>
              {/* Demo Content Based on Selection */}
              {selectedDemo === 'storefront' && (
                <div className="bg-white min-h-[600px]">
                  {/* Mock E-commerce Store */}
                  <div className="border-b p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded"></div>
                        <span className="font-bold">Demo Store</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ShoppingCart className="h-4 w-4" />
                          <Badge variant="secondary" className="ml-1">3</Badge>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Hero Section */}
                  <div className="relative h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-4">Summer Sale</h2>
                      <p className="text-lg mb-6">Up to 50% off on electronics</p>
                      <Button className="bg-gradient-to-r from-primary to-accent">
                        Shop Now
                      </Button>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-6">Featured Products</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {mockProducts.map((product) => (
                        <Card key={product.id} className="group hover:shadow-lg transition-all cursor-pointer">
                          <div className="relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <Badge className="absolute top-2 left-2" variant="secondary">
                              {product.badge}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2 line-clamp-2">{product.name}</h4>
                            <div className="flex items-center mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground ml-2">({product.reviews})</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold">{product.price}</span>
                                <span className="text-sm text-muted-foreground line-through ml-2">
                                  {product.originalPrice}
                                </span>
                              </div>
                              <Button size="sm">Add to Cart</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedDemo === 'admin' && (
                <div className="bg-white min-h-[600px] p-6">
                  {/* Mock Admin Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Total Orders", value: "2,847", icon: <Package className="h-4 w-4" /> },
                      { label: "Revenue", value: "$34,892", icon: <CreditCard className="h-4 w-4" /> },
                      { label: "Customers", value: "1,284", icon: <Users className="h-4 w-4" /> },
                      { label: "Products", value: "156", icon: <Store className="h-4 w-4" /> }
                    ].map((stat, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{stat.label}</p>
                              <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                              {stat.icon}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            { id: "#001", customer: "John Smith", amount: "$89.99", status: "Shipped" },
                            { id: "#002", customer: "Sarah Johnson", amount: "$149.99", status: "Processing" },
                            { id: "#003", customer: "Mike Wilson", amount: "$24.99", status: "Delivered" }
                          ].map((order, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <h4 className="font-medium">{order.id}</h4>
                                <p className="text-sm text-muted-foreground">{order.customer}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{order.amount}</p>
                                <Badge variant="outline">{order.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Sales Analytics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded flex items-center justify-center">
                            <BarChart3 className="h-8 w-8 text-primary" />
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">+23%</p>
                            <p className="text-sm text-muted-foreground">vs last month</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {selectedDemo === 'ai-tools' && (
                <div className="bg-white min-h-[600px] p-6">
                  <div className="text-center mb-8">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-2xl font-bold mb-4">AI-Powered Features</h3>
                    <p className="text-muted-foreground">Experience intelligent automation in action</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Smart Product Descriptions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 bg-muted/30 rounded">
                            <p className="text-sm font-medium">Input: "Wireless headphones"</p>
                          </div>
                          <div className="p-3 border rounded">
                            <p className="text-sm">
                              ✨ <strong>AI Generated:</strong> "Experience premium wireless audio with our
                              noise-canceling Bluetooth headphones. Featuring 30-hour battery life,
                              superior sound quality, and comfortable over-ear design perfect for
                              music lovers and professionals alike."
                            </p>
                          </div>
                          <Button size="sm" className="w-full">Generate New Description</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Dynamic Pricing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <p className="text-sm text-green-800">
                              <strong>Recommendation:</strong> Increase price by 8% due to high demand
                            </p>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Current Price:</span>
                            <span className="font-medium">$79.99</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Suggested Price:</span>
                            <span className="font-medium text-green-600">$86.39</span>
                          </div>
                          <Button size="sm" className="w-full">Apply Suggestion</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Demo Stats */}
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { label: "Demo Views", value: "50,000+", icon: <Eye className="h-5 w-5" /> },
            { label: "User Interactions", value: "2.3M+", icon: <Settings className="h-5 w-5" /> },
            { label: "Completion Rate", value: "89%", icon: <BarChart3 className="h-5 w-5" /> },
            { label: "User Rating", value: "4.9/5", icon: <Star className="h-5 w-5" /> }
          ].map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary to-accent text-white max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Build Your Own?</h3>
            <p className="text-xl text-white/90 mb-8">
              Start creating your e-commerce empire with our powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Schedule Personal Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
