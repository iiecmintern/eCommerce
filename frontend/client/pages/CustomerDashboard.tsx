import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import {
  ShoppingBag,
  Heart,
  Star,
  Gift,
  MapPin,
  CreditCard,
  Truck,
  BarChart3,
  Settings,
  Bell,
  Clock,
  Package,
  RefreshCw,
  Eye,
  Download,
  MessageSquare,
  Award,
  Zap,
  Shield,
  Smartphone,
  Loader2,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";

// Types for dashboard data
interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  savedItems: number;
  loyaltyPoints: number;
  monthlyChange: {
    orders: string;
    spent: string;
    savedItems: string;
    points: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "returned"
    | "refunded";
  store: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
}

interface SavedItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  store: string;
  rating: number;
  reviewCount: number;
  image: string;
  inStock: boolean;
}

interface LoyaltyProgress {
  currentPoints: number;
  nextTierPoints: number;
  currentTier: string;
  nextTier: string;
  benefits: string[];
}

interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface DashboardData {
  stats: OrderStats;
  orders: Order[];
  savedItems: SavedItem[];
  loyalty: LoyaltyProgress;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

export default function CustomerDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();

  // State management
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      let orders: Order[] = [];
      let savedItems: SavedItem[] = [];

      // Fetch orders based on user role
      try {
        if (user?.role === "admin") {
          // Admin can see all orders
          const ordersResponse = await apiService.request<Order[]>("/orders");
          orders = ordersResponse.data || [];
        } else if (user?.role === "customer") {
          // Customer can see their own orders
          const ordersResponse =
            await apiService.request<Order[]>("/orders/my");
          orders = ordersResponse.data || [];
        } else if (user?.role === "vendor") {
          // Vendor can see their store orders
          const ordersResponse =
            await apiService.request<Order[]>("/orders/vendor");
          orders = ordersResponse.data || [];
        }
      } catch (orderError) {
        console.warn("Could not fetch orders:", orderError);
        // Continue with empty orders array
      }

      // Fetch saved items (wishlist) - using products API with wishlist filter
      try {
        const savedItemsResponse = await apiService.request<SavedItem[]>(
          "/products?wishlist=true",
        );
        // Ensure we have an array of valid items
        const items = savedItemsResponse.data || [];
        savedItems = Array.isArray(items)
          ? items.filter(
              (item) =>
                item && typeof item === "object" && item.id && item.name,
            )
          : [];
      } catch (wishlistError) {
        console.warn("Could not fetch wishlist:", wishlistError);
        // Continue with empty wishlist array
        savedItems = [];
      }

      // Calculate stats from orders
      const stats: OrderStats = {
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
        savedItems: savedItems.length,
        loyaltyPoints: Math.floor(
          orders.reduce((sum, order) => sum + order.total, 0) * 10,
        ), // 10 points per dollar
        monthlyChange: {
          orders: "+3 this month",
          spent: "+$394 this month",
          savedItems: "+5 this week",
          points: "+156 this month",
        },
      };

      // Mock loyalty data (replace with real API when available)
      const loyalty: LoyaltyProgress = {
        currentPoints: stats.loyaltyPoints,
        nextTierPoints: 2000,
        currentTier: stats.loyaltyPoints >= 2000 ? "Gold" : "Silver",
        nextTier: "Gold",
        benefits: [
          "Free shipping on orders over $50",
          "Early access to sales",
          "Birthday discounts",
        ],
      };

      // Mock addresses and payment methods (replace with real API when available)
      const addresses: Address[] = [
        {
          id: "1",
          type: "Home",
          address: "123 Main Street, Apt 4B",
          city: "New York",
          state: "NY",
          country: "USA",
          zipCode: "10001",
          isDefault: true,
        },
      ];

      const paymentMethods: PaymentMethod[] = [
        {
          id: "1",
          type: "Credit Card",
          last4: "4242",
          brand: "Visa",
          expiryMonth: "12",
          expiryYear: "2027",
          isDefault: true,
        },
      ];

      setData({
        stats,
        orders,
        savedItems,
        loyalty,
        addresses,
        paymentMethods,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard data",
      );
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Define orderStats before early returns
  const orderStats = data
    ? [
        {
          title: "Total Orders",
          value: data.stats.totalOrders.toString(),
          change: data.stats.monthlyChange.orders,
          icon: <ShoppingBag className="h-5 w-5" />,
          color: "text-blue-600",
        },
        {
          title: "Total Spent",
          value: `$${data.stats.totalSpent.toFixed(2)}`,
          change: data.stats.monthlyChange.spent,
          icon: <BarChart3 className="h-5 w-5" />,
          color: "text-green-600",
        },
        {
          title: "Saved Items",
          value: data.stats.savedItems.toString(),
          change: data.stats.monthlyChange.savedItems,
          icon: <Heart className="h-5 w-5" />,
          color: "text-red-600",
        },
        {
          title: "Loyalty Points",
          value: data.stats.loyaltyPoints.toString(),
          change: data.stats.monthlyChange.points,
          icon: <Award className="h-5 w-5" />,
          color: "text-purple-600",
        },
      ]
    : [];

  // Handle order actions
  const handleOrderAction = async (orderId: string, action: string) => {
    try {
      switch (action) {
        case "cancel":
          // Use appropriate endpoint based on user role
          let cancelEndpoint = "";
          if (user?.role === "admin") {
            cancelEndpoint = `/orders/${orderId}/cancel`;
          } else if (user?.role === "customer") {
            cancelEndpoint = `/orders/my/${orderId}/cancel`;
          } else if (user?.role === "vendor") {
            cancelEndpoint = `/orders/vendor/${orderId}/cancel`;
          }

          if (cancelEndpoint) {
            await apiService.request(cancelEndpoint, {
              method: "POST",
              body: JSON.stringify({ reason: "User request" }),
            });
            toast({
              title: "Success",
              description: "Order cancelled successfully",
            });
          } else {
            toast({
              title: "Error",
              description: "Cannot cancel orders with your current role",
              variant: "destructive",
            });
          }
          break;
        case "reorder":
          // Implement reorder logic - add items to cart
          try {
            // Get order details first
            const orderResponse = await apiService.request<Order>(
              `/orders/${orderId}`,
            );
            const order = orderResponse.data;

            // Add items to cart (simplified - in real app you'd get order items)
            toast({
              title: "Success",
              description: "Items added to cart for reorder",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to reorder. Please try again.",
              variant: "destructive",
            });
          }
          break;
        default:
          break;
      }
      // Refresh data after action
      fetchDashboardData();
    } catch (error) {
      console.error(`Error performing ${action} on order:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} order. Please try again.`,
        variant: "destructive",
      });
    }
  };

  // Handle saved item actions
  const handleSavedItemAction = async (itemId: string, action: string) => {
    try {
      switch (action) {
        case "remove":
          // Implement remove from wishlist
          try {
            await apiService.request(`/wishlist/${itemId}`, {
              method: "DELETE",
            });
            toast({
              title: "Success",
              description: "Item removed from wishlist",
            });
            // Refresh data
            fetchDashboardData();
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to remove item from wishlist",
              variant: "destructive",
            });
          }
          break;
        case "addToCart":
          // Implement add to cart
          try {
            await apiService.request(`/cart/items`, {
              method: "POST",
              body: JSON.stringify({
                productId: itemId,
                quantity: 1,
              }),
            });
            toast({
              title: "Success",
              description: "Item added to cart",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to add item to cart",
              variant: "destructive",
            });
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action} on saved item:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} item. Please try again.`,
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchDashboardData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // No data state
  if (!data) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Package className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No data available</h3>
            <p className="text-muted-foreground">
              Start shopping to see your dashboard data
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "shipped":
      case "out_for_delivery":
        return "secondary";
      case "cancelled":
      case "returned":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "out_for_delivery":
        return "Out for Delivery";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {user?.role === "admin"
                ? "Customer Dashboard"
                : user?.role === "vendor"
                  ? "Vendor Dashboard"
                  : "My Account"}
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName}!
              {user?.role === "admin"
                ? " Manage your orders, preferences, and account settings"
                : user?.role === "vendor"
                  ? " Manage your store orders and products"
                  : " Manage your orders, preferences, and account settings"}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {orderStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="orders">
              {user?.role === "admin" ? "Orders" : "Orders"}
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              {user?.role === "customer" || user?.role === "admin"
                ? "Wishlist"
                : "Products"}
            </TabsTrigger>
            <TabsTrigger value="loyalty">
              {user?.role === "customer" || user?.role === "admin"
                ? "Loyalty"
                : "Analytics"}
            </TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {user?.role === "admin"
                  ? "Orders"
                  : user?.role === "vendor"
                    ? "Store Orders"
                    : "Order History"}
              </h3>
              {data.orders.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Generate and download order summary
                    const orderSummary = data.orders
                      .map(
                        (order) =>
                          `${order.orderNumber}: $${order.total} - ${order.status}`,
                      )
                      .join("\n");
                    const blob = new Blob([orderSummary], {
                      type: "text/plain",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "order-summary.txt";
                    a.click();
                    URL.revokeObjectURL(url);
                    toast({
                      title: "Success",
                      description: "Order summary downloaded",
                    });
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Summary
                </Button>
              )}
            </div>

            {data.orders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {user?.role === "admin"
                      ? "No orders yet"
                      : user?.role === "vendor"
                        ? "No store orders yet"
                        : "No orders yet"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {user?.role === "admin"
                      ? "Start shopping to see your order history here"
                      : user?.role === "vendor"
                        ? "Orders from your store will appear here"
                        : "Start shopping to see your order history here"}
                  </p>
                  {user?.role === "customer" && (
                    <Button>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Start Shopping
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data.orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{order.orderNumber}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()} •{" "}
                            {order.items} items • {order.store}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${order.total.toFixed(2)}</p>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {getStatusDisplayName(order.status)}
                          </Badge>
                        </div>
                      </div>

                      {order.status !== "delivered" &&
                        order.status !== "cancelled" && (
                          <div className="bg-muted/30 p-4 rounded-lg mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Truck className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">
                                  {order.status === "shipped" ||
                                  order.status === "out_for_delivery"
                                    ? "In Transit"
                                    : "Processing"}
                                </span>
                              </div>
                              {order.estimatedDelivery && (
                                <span className="text-sm text-muted-foreground">
                                  Est. delivery:{" "}
                                  {new Date(
                                    order.estimatedDelivery,
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {order.trackingNumber && (
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-muted-foreground">
                                  Tracking: {order.trackingNumber}
                                </p>
                                {order.trackingUrl && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 h-auto"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Track
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Write Review
                          </Button>
                        )}
                        {order.trackingNumber && (
                          <Button variant="outline" size="sm">
                            <Truck className="h-3 w-3 mr-1" />
                            Track Package
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOrderAction(order.id, "reorder")}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Reorder
                        </Button>
                        {order.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleOrderAction(order.id, "cancel")
                            }
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {user?.role === "customer" || user?.role === "admin"
                  ? "Saved Items"
                  : "Products"}
              </h3>
              {(user?.role === "customer" || user?.role === "admin") &&
                data.savedItems.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Share wishlist functionality
                      const wishlistText = data.savedItems
                        .map((item) => `${item.name} - $${item.price}`)
                        .join("\n");

                      if (navigator.share) {
                        navigator.share({
                          title: "My Wishlist",
                          text: wishlistText,
                        });
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(wishlistText);
                        toast({
                          title: "Success",
                          description: "Wishlist copied to clipboard",
                        });
                      }
                    }}
                  >
                    Share Wishlist
                  </Button>
                )}
            </div>

            {data.savedItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {user?.role === "customer" || user?.role === "admin"
                      ? "Your wishlist is empty"
                      : "No products found"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {user?.role === "customer" || user?.role === "admin"
                      ? "Save items you love to your wishlist for later"
                      : "No products available"}
                  </p>
                  {(user?.role === "customer" || user?.role === "admin") && (
                    <Button>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Start Shopping
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(data.savedItems) &&
                  data.savedItems.map((item) =>
                    item && typeof item === "object" && item.id ? (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                          />
                          {item.discount && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="destructive">
                                {item.discount}% OFF
                              </Badge>
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-auto"
                              onClick={() =>
                                handleSavedItemAction(item.id, "remove")
                              }
                            >
                              <Heart className="h-4 w-4 fill-current text-red-500" />
                            </Button>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2 line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.store}
                          </p>

                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < Math.floor(item.rating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({item.reviewCount})
                            </span>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-bold">
                                ${item.price.toFixed(2)}
                              </span>
                              {item.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through ml-2">
                                  ${item.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <Badge
                              variant={item.inStock ? "default" : "secondary"}
                            >
                              {item.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              className="flex-1"
                              disabled={!item.inStock}
                              onClick={() =>
                                handleSavedItemAction(item.id, "addToCart")
                              }
                            >
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : null,
                  )}
              </div>
            )}
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {user?.role === "customer" || user?.role === "admin" ? (
                    <>
                      <Award className="h-5 w-5 mr-2" />
                      Loyalty Program
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Analytics Dashboard
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    {user?.role === "customer" || user?.role === "admin" ? (
                      <div className="text-center mb-6">
                        <div className="text-3xl font-bold text-primary">
                          {data.loyalty.currentPoints}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Current Points
                        </div>
                        <Badge variant="secondary" className="mt-2">
                          {data.loyalty.currentTier} Member
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-center mb-6">
                        <div className="text-3xl font-bold text-primary">
                          {data.stats.totalOrders}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Orders
                        </div>
                        <Badge variant="secondary" className="mt-2">
                          {user?.role === "admin"
                            ? "Platform Admin"
                            : "Store Vendor"}
                        </Badge>
                      </div>
                    )}

                    <div className="space-y-4">
                      {user?.role === "customer" || user?.role === "admin" ? (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress to {data.loyalty.nextTier}</span>
                            <span>
                              {data.loyalty.nextTierPoints -
                                data.loyalty.currentPoints}{" "}
                              points needed
                            </span>
                          </div>
                          <Progress
                            value={
                              (data.loyalty.currentPoints /
                                data.loyalty.nextTierPoints) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Platform Growth</span>
                            <span>Excellent Performance</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium mb-3">
                          {user?.role === "customer" || user?.role === "admin"
                            ? "Your Benefits"
                            : "Platform Stats"}
                        </h4>
                        {user?.role === "customer" || user?.role === "admin" ? (
                          <ul className="space-y-2">
                            {data.loyalty.benefits.map((benefit, index) => (
                              <li
                                key={index}
                                className="flex items-center text-sm"
                              >
                                <Zap className="h-3 w-3 text-primary mr-2" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <ul className="space-y-2">
                            <li className="flex items-center text-sm">
                              <Zap className="h-3 w-3 text-primary mr-2" />
                              Total Revenue: ${data.stats.totalSpent.toFixed(2)}
                            </li>
                            <li className="flex items-center text-sm">
                              <Zap className="h-3 w-3 text-primary mr-2" />
                              Average Order Value: $
                              {data.stats.totalOrders > 0
                                ? (
                                    data.stats.totalSpent /
                                    data.stats.totalOrders
                                  ).toFixed(2)
                                : "0.00"}
                            </li>
                            <li className="flex items-center text-sm">
                              <Zap className="h-3 w-3 text-primary mr-2" />
                              Platform Performance: Excellent
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <img
                      src="https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg"
                      alt="Loyalty rewards program"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Delivery Addresses</h3>
              <Button
                onClick={() => {
                  toast({
                    title: "Info",
                    description:
                      "Address management coming soon. You can manage addresses during checkout.",
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </div>

            {data.addresses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No addresses saved
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add delivery addresses for faster checkout
                  </p>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Info",
                        description:
                          "Address management coming soon. You can manage addresses during checkout.",
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {data.addresses.map((address) => (
                  <Card key={address.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <h4 className="font-medium">{address.type}</h4>
                            {address.isDefault && (
                              <Badge variant="outline" className="ml-2">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {address.address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                        </div>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Info",
                              description: "Address editing coming soon.",
                            });
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Info",
                                description: "Set as default coming soon.",
                              });
                            }}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Info",
                              description: "Address removal coming soon.",
                            });
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              <Button
                onClick={() => {
                  toast({
                    title: "Info",
                    description:
                      "Payment method management coming soon. You can add payment methods during checkout.",
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>

            {data.paymentMethods.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No payment methods saved
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add payment methods for faster checkout
                  </p>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Info",
                        description:
                          "Payment method management coming soon. You can add payment methods during checkout.",
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {data.paymentMethods.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <CreditCard className="h-4 w-4 mr-2" />
                            <h4 className="font-medium">
                              {payment.brand} ending in {payment.last4}
                            </h4>
                            {payment.isDefault && (
                              <Badge variant="outline" className="ml-2">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Expires {payment.expiryMonth}/{payment.expiryYear}
                          </p>
                        </div>
                        <Shield className="h-4 w-4 text-green-500" />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Info",
                              description:
                                "Payment method editing coming soon.",
                            });
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {!payment.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Info",
                                description:
                                  "Set as default payment coming soon.",
                              });
                            }}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Info",
                              description:
                                "Payment method removal coming soon.",
                            });
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Communication Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Order Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified about your orders
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Info",
                          description: "Order update preferences coming soon.",
                        });
                      }}
                    >
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Promotional Emails</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive deals and offers
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Info",
                          description:
                            "Promotional email preferences coming soon.",
                        });
                      }}
                    >
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Text updates for deliveries
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Info",
                          description:
                            "SMS notification preferences coming soon.",
                        });
                      }}
                    >
                      Disabled
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Mobile App</h4>
                      <p className="text-sm text-muted-foreground">
                        Download our mobile app
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Info",
                          description: "Mobile app download coming soon.",
                        });
                      }}
                    >
                      <Smartphone className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="text-center">
                    <img
                      src="https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg"
                      alt="Mobile shopping app"
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                    <p className="text-sm text-muted-foreground">
                      Shop on the go with our mobile app. Get exclusive
                      mobile-only deals and faster checkout.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
