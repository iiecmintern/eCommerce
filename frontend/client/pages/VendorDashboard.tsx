import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
  RefreshCw,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Shield,
  Bell,
  Zap,
  Target,
  TrendingDown,
} from "lucide-react";

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // State for real-time data
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [storeStats, setStoreStats] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalOrders: 0,
    averageRating: 0,
    monthlyGrowth: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    returningCustomers: 0,
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load products from localStorage
    const savedProducts = localStorage.getItem("vendor_products");
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      setProducts(parsedProducts);

      // Calculate stats from products
      const totalProducts = parsedProducts.length;
      const activeProducts = parsedProducts.filter(
        (p: any) => p.isActive,
      ).length;
      const featuredProducts = parsedProducts.filter(
        (p: any) => p.isFeatured,
      ).length;
      const lowStockProducts = parsedProducts.filter(
        (p: any) => p.stockQuantity < 10,
      ).length;

      setStoreStats((prev) => ({
        ...prev,
        totalProducts,
        activeProducts,
        featuredProducts,
        lowStockProducts,
      }));
    }

    // TODO: Replace with real API calls
    // Load orders from API
    // const orders = await fetchOrders();
    // setOrders(orders);

    // Load reviews from API
    // const reviews = await fetchReviews();
    // setReviews(reviews);

    // Calculate stats from real data
    // const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    // const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    // setStoreStats((prev) => ({
    //   ...prev,
    //   totalRevenue,
    //   totalOrders: orders.length,
    //   averageRating: averageRating || 0,
    //   monthlyGrowth: calculateMonthlyGrowth(),
    //   conversionRate: calculateConversionRate(),
    //   averageOrderValue: totalRevenue / orders.length || 0,
    //   returningCustomers: calculateReturningCustomers(),
    // }));
  };

  const handleSyncOrders = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "Orders synced successfully!",
        description: "All orders have been updated from the marketplace.",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to sync orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const data = {
      products,
      orders,
      reviews,
      stats: storeStats,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendor-dashboard-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data exported successfully!",
      description: "Your dashboard data has been downloaded.",
    });
  };
  const stats = [
    {
      title: "Total Revenue",
      value:
        storeStats.totalRevenue > 0
          ? `₹${storeStats.totalRevenue.toLocaleString()}`
          : "₹0",
      change:
        storeStats.monthlyGrowth > 0 ? `+${storeStats.monthlyGrowth}%` : "0%",
      icon: <DollarSign className="h-5 w-5" />,
      trend: storeStats.monthlyGrowth > 0 ? "up" : "down",
    },
    {
      title: "Products Listed",
      value: storeStats.totalProducts.toString(),
      change:
        storeStats.totalProducts > 0
          ? `+${Math.floor(storeStats.totalProducts * 0.1)}`
          : "0",
      icon: <Package className="h-5 w-5" />,
      trend: "up",
    },
    {
      title: "Orders Today",
      value: storeStats.totalOrders.toString(),
      change:
        storeStats.totalOrders > 0
          ? `+${Math.floor(storeStats.totalOrders * 0.3)}`
          : "0",
      icon: <ShoppingCart className="h-5 w-5" />,
      trend: "up",
    },
    {
      title: "Store Rating",
      value:
        storeStats.averageRating > 0
          ? storeStats.averageRating.toFixed(1)
          : "0.0",
      change: storeStats.averageRating > 0 ? "+0.2" : "0.0",
      icon: <Star className="h-5 w-5" />,
      trend: "up",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-2024-001",
      customer: "John Smith",
      product: "Wireless Headphones",
      amount: "$89.99",
      status: "processing",
      date: "2 hours ago",
    },
    {
      id: "#ORD-2024-002",
      customer: "Sarah Johnson",
      product: "Bluetooth Speaker",
      amount: "$129.99",
      status: "shipped",
      date: "5 hours ago",
    },
    {
      id: "#ORD-2024-003",
      customer: "Mike Wilson",
      product: "USB Cable Set",
      amount: "$24.99",
      status: "delivered",
      date: "1 day ago",
    },
  ];

  const topProducts = [
    {
      id: 1,
      name: "Wireless Charging Pad",
      sales: 145,
      revenue: "$2,899",
      stock: 23,
      rating: 4.9,
      image:
        "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
    },
    {
      id: 2,
      name: "Bluetooth Earbuds",
      sales: 132,
      revenue: "$3,168",
      stock: 45,
      rating: 4.7,
      image:
        "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
    },
    {
      id: 3,
      name: "Phone Stand Holder",
      sales: 98,
      revenue: "$1,470",
      stock: 12,
      rating: 4.6,
      image:
        "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
    },
  ];

  const recentReviews = [
    {
      id: 1,
      customer: "Alice Brown",
      product: "Wireless Charging Pad",
      rating: 5,
      comment: "Excellent product! Fast charging and sleek design.",
      date: "3 hours ago",
    },
    {
      id: 2,
      customer: "David Lee",
      product: "Bluetooth Earbuds",
      rating: 4,
      comment: "Good sound quality, battery life could be better.",
      date: "1 day ago",
    },
    {
      id: 3,
      customer: "Emma Wilson",
      product: "Phone Stand Holder",
      rating: 5,
      comment: "Perfect for video calls and watching videos!",
      date: "2 days ago",
    },
  ];

  const analytics = {
    visitorsThisMonth: 12847,
    conversionRate: 3.2,
    averageOrderValue: 67.84,
    returningCustomers: 28,
  };

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName || "Vendor"}! Manage your store and
              track performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Store
            </Button>
            <Button onClick={() => navigate("/vendor/products")}>
              <Plus className="h-4 w-4 mr-2" />
              Manage Products
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
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
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
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length > 0 ? (
                      orders.slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div>
                            <h4 className="font-medium">{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {order.customer}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.product}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{order.amount}</p>
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "default"
                                  : order.status === "shipped"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h4 className="font-medium mb-2">No orders yet</h4>
                        <p className="text-sm text-muted-foreground">
                          Orders will appear here when customers make purchases
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Your Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => navigate("/vendor/products")}
                      >
                        <img
                          src={
                            product.images?.[0] ||
                            "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg"
                          }
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>₹{product.price}</span>
                            <span>Stock: {product.stockQuantity}</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              {product.isFeatured ? "Featured" : "Regular"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{product.status}</p>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h4 className="font-medium mb-2">No products yet</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start by adding your first product
                        </p>
                        <Button onClick={() => navigate("/vendor/products")}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </div>
                    )}
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
                    <div className="text-2xl font-bold">
                      {storeStats.totalProducts}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Products
                    </div>
                    <Progress
                      value={Math.min(storeStats.totalProducts * 10, 100)}
                      className="mt-2"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {storeStats.conversionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Conversion Rate
                    </div>
                    <Progress
                      value={storeStats.conversionRate * 10}
                      className="mt-2"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      ${storeStats.averageOrderValue.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Order Value
                    </div>
                    <Progress
                      value={Math.min(storeStats.averageOrderValue * 2, 100)}
                      className="mt-2"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {storeStats.returningCustomers}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Returning Customers
                    </div>
                    <Progress
                      value={storeStats.returningCustomers}
                      className="mt-2"
                    />
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
                <Button onClick={() => navigate("/vendor/products")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Products
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
                      <h3 className="text-xl font-bold mb-2">
                        Optimize Your Product Listings
                      </h3>
                      <p className="text-white/90 mb-4">
                        Use our AI-powered tools to create compelling product
                        descriptions and optimize for search
                      </p>
                      <Button variant="secondary">
                        <Camera className="h-4 w-4 mr-2" />
                        AI Photo Enhancement
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium">
                      {storeStats.totalProducts} Products
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Total listed
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-medium">
                      {storeStats.activeProducts || 0} Active
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Currently selling
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <h4 className="font-medium">
                      {storeStats.featuredProducts || 0} Featured
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Highlighted products
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <h4 className="font-medium">
                      {storeStats.lowStockProducts || 0} Low Stock
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Need restocking
                    </p>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSyncOrders}
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                    />
                    {isLoading ? "Syncing..." : "Sync Orders"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 border rounded-lg text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-medium">8 Pending</h4>
                    <p className="text-sm text-muted-foreground">
                      Awaiting processing
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <h4 className="font-medium">15 Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Being prepared
                    </p>
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
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {order.customer?.charAt(0) || "C"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {order.customer}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.product}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.date}
                          </p>
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "shipped"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="font-medium mb-2">No orders yet</h4>
                      <p className="text-sm text-muted-foreground">
                        Orders will appear here when customers make purchases
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Sales Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Sales Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm text-green-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-700">
                          ₹
                          {storeStats.totalRevenue > 0
                            ? storeStats.totalRevenue.toLocaleString()
                            : "0"}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm text-blue-600">
                          Average Order Value
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          ₹
                          {storeStats.averageOrderValue > 0
                            ? storeStats.averageOrderValue.toFixed(2)
                            : "0.00"}
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div>
                        <p className="text-sm text-purple-600">
                          Conversion Rate
                        </p>
                        <p className="text-2xl font-bold text-purple-700">
                          {storeStats.conversionRate > 0
                            ? storeStats.conversionRate
                            : 0}
                          %
                        </p>
                      </div>
                      <Zap className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Product Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Active Products
                      </span>
                      <span className="font-medium">
                        {storeStats.activeProducts || 0}
                      </span>
                    </div>
                    <Progress
                      value={storeStats.activeProducts || 0}
                      className="h-2"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Featured Products
                      </span>
                      <span className="font-medium">
                        {storeStats.featuredProducts || 0}
                      </span>
                    </div>
                    <Progress
                      value={storeStats.featuredProducts || 0}
                      className="h-2"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Low Stock Items
                      </span>
                      <span className="font-medium">
                        {storeStats.lowStockProducts || 0}
                      </span>
                    </div>
                    <Progress
                      value={storeStats.lowStockProducts || 0}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={() => navigate("/vendor/products")}
                  >
                    <Plus className="h-6 w-6" />
                    <span>Add New Product</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={handleSyncOrders}
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={`h-6 w-6 ${isLoading ? "animate-spin" : ""}`}
                    />
                    <span>{isLoading ? "Syncing..." : "Sync Orders"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={handleExportData}
                  >
                    <Download className="h-6 w-6" />
                    <span>Export Data</span>
                  </Button>
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
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b pb-4 last:border-b-0 hover:bg-muted/50 p-4 rounded-lg transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Avatar>
                              <AvatarFallback>
                                {review.customer?.charAt(0) || "C"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">
                                  {review.customer}
                                </h4>
                                {review.verified && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    <Shield className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {review.product}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {review.date}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="font-medium mb-2">No reviews yet</h4>
                      <p className="text-sm text-muted-foreground">
                        Customer reviews will appear here once products are
                        purchased
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Store Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Store Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg" />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {user?.firstName || "Vendor"}'s Store
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Electronics & Gadgets
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified Seller
                        </Badge>
                        <Badge variant="outline">
                          <Star className="h-3 w-3 mr-1" />
                          {storeStats.averageRating.toFixed(1)} Rating
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">
                        {storeStats.totalProducts}
                      </p>
                      <p className="text-sm text-muted-foreground">Products</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">
                        {storeStats.totalOrders}
                      </p>
                      <p className="text-sm text-muted-foreground">Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly Revenue</span>
                    <span className="font-medium">
                      ₹
                      {storeStats.totalRevenue > 0
                        ? storeStats.totalRevenue.toLocaleString()
                        : "0"}
                    </span>
                  </div>
                  <Progress
                    value={
                      storeStats.totalRevenue > 0
                        ? Math.min(storeStats.totalRevenue / 100, 100)
                        : 0
                    }
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-medium">
                      {storeStats.conversionRate > 0
                        ? storeStats.conversionRate
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      storeStats.conversionRate > 0
                        ? storeStats.conversionRate * 10
                        : 0
                    }
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-medium">
                      {storeStats.averageRating > 0
                        ? storeStats.averageRating.toFixed(1)
                        : "0.0"}
                      /5
                    </span>
                  </div>
                  <Progress
                    value={
                      storeStats.averageRating > 0
                        ? storeStats.averageRating * 20
                        : 0
                    }
                    className="h-2"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Store Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Store Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-16 flex-col space-y-2">
                    <Bell className="h-5 w-5" />
                    <span className="text-xs">Notifications</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-2">
                    <Globe className="h-5 w-5" />
                    <span className="text-xs">Store URL</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">Payment</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-2">
                    <Shield className="h-5 w-5" />
                    <span className="text-xs">Security</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
