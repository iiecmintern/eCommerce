import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Eye,
  Edit,
  Plus,
  Star,
  MessageSquare,
  Truck,
  BarChart3,
  Users,
  Camera,
  FileText,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from "lucide-react";

export default function VendorDashboard() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$34,892",
      change: "+15.3%",
      icon: <DollarSign className="h-5 w-5" />,
      trend: "up"
    },
    {
      title: "Products Listed",
      value: "247",
      change: "+12",
      icon: <Package className="h-5 w-5" />,
      trend: "up"
    },
    {
      title: "Orders Today",
      value: "18",
      change: "+5",
      icon: <ShoppingCart className="h-5 w-5" />,
      trend: "up"
    },
    {
      title: "Store Rating",
      value: "4.8",
      change: "+0.2",
      icon: <Star className="h-5 w-5" />,
      trend: "up"
    }
  ];

  const recentOrders = [
    {
      id: "#ORD-2024-001",
      customer: "John Smith",
      product: "Wireless Headphones",
      amount: "$89.99",
      status: "processing",
      date: "2 hours ago"
    },
    {
      id: "#ORD-2024-002", 
      customer: "Sarah Johnson",
      product: "Bluetooth Speaker",
      amount: "$129.99",
      status: "shipped",
      date: "5 hours ago"
    },
    {
      id: "#ORD-2024-003",
      customer: "Mike Wilson",
      product: "USB Cable Set",
      amount: "$24.99",
      status: "delivered",
      date: "1 day ago"
    }
  ];

  const topProducts = [
    {
      id: 1,
      name: "Wireless Charging Pad",
      sales: 145,
      revenue: "$2,899",
      stock: 23,
      rating: 4.9,
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg"
    },
    {
      id: 2,
      name: "Bluetooth Earbuds",
      sales: 132,
      revenue: "$3,168",
      stock: 45,
      rating: 4.7,
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg"
    },
    {
      id: 3,
      name: "Phone Stand Holder",
      sales: 98,
      revenue: "$1,470",
      stock: 12,
      rating: 4.6,
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg"
    }
  ];

  const recentReviews = [
    {
      id: 1,
      customer: "Alice Brown",
      product: "Wireless Charging Pad",
      rating: 5,
      comment: "Excellent product! Fast charging and sleek design.",
      date: "3 hours ago"
    },
    {
      id: 2,
      customer: "David Lee",
      product: "Bluetooth Earbuds", 
      rating: 4,
      comment: "Good sound quality, battery life could be better.",
      date: "1 day ago"
    },
    {
      id: 3,
      customer: "Emma Wilson",
      product: "Phone Stand Holder",
      rating: 5,
      comment: "Perfect for video calls and watching videos!",
      date: "2 days ago"
    }
  ];

  const analytics = {
    visitorsThisMonth: 12847,
    conversionRate: 3.2,
    averageOrderValue: 67.84,
    returningCustomers: 28
  };

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Manage your store and track performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Store
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Recent Orders
                    </div>
                    <Button variant="outline" size="sm">View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{order.id}</h4>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.product}</p>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{order.amount}</p>
                          <Badge variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'shipped' ? 'secondary' :
                            'outline'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Top Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{product.sales} sales</span>
                            <span>Stock: {product.stock}</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              {product.rating}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{product.revenue}</p>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Store Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Store Performance This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.visitorsThisMonth.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Store Visitors</div>
                    <Progress value={75} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
                    <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    <Progress value={32} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">${analytics.averageOrderValue}</div>
                    <div className="text-sm text-muted-foreground">Avg Order Value</div>
                    <Progress value={68} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.returningCustomers}%</div>
                    <div className="text-sm text-muted-foreground">Returning Customers</div>
                    <Progress value={28} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Product Management</h3>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="relative rounded-lg overflow-hidden mb-6">
                  <img 
                    src="https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg" 
                    alt="Mobile payment and e-commerce setup"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-2">Optimize Your Product Listings</h3>
                      <p className="text-white/90 mb-4">Use our AI-powered tools to create compelling product descriptions and optimize for search</p>
                      <Button variant="secondary">
                        <Camera className="h-4 w-4 mr-2" />
                        AI Photo Enhancement
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium">247 Products</h4>
                    <p className="text-sm text-muted-foreground">Total listed</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <h4 className="font-medium">12 Low Stock</h4>
                    <p className="text-sm text-muted-foreground">Need restocking</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-medium">235 Active</h4>
                    <p className="text-sm text-muted-foreground">Currently selling</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Order Management
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Orders
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 border rounded-lg text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-medium">8 Pending</h4>
                    <p className="text-sm text-muted-foreground">Awaiting processing</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <h4 className="font-medium">15 Processing</h4>
                    <p className="text-sm text-muted-foreground">Being prepared</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Truck className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <h4 className="font-medium">23 Shipped</h4>
                    <p className="text-sm text-muted-foreground">In transit</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-medium">156 Delivered</h4>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{order.customer.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{order.id}</h4>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.product}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.amount}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                        <Badge variant="outline">{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Customer Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarFallback>{review.customer.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{review.customer}</h4>
                            <p className="text-sm text-muted-foreground">{review.product}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
