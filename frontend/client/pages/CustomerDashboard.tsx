import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Smartphone
} from "lucide-react";

export default function CustomerDashboard() {
  const orderStats = [
    {
      title: "Total Orders",
      value: "47",
      change: "+3 this month",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Total Spent",
      value: "$2,847",
      change: "+$394 this month", 
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Saved Items",
      value: "23",
      change: "+5 this week",
      icon: <Heart className="h-5 w-5" />,
      color: "text-red-600"
    },
    {
      title: "Loyalty Points",
      value: "1,284",
      change: "+156 this month",
      icon: <Award className="h-5 w-5" />,
      color: "text-purple-600"
    }
  ];

  const recentOrders = [
    {
      id: "#ORD-2024-0847",
      date: "Dec 15, 2024",
      items: 3,
      total: "$189.97",
      status: "delivered",
      store: "TechGadgets Pro",
      estimatedDelivery: null,
      trackingNumber: "TG847392847"
    },
    {
      id: "#ORD-2024-0846",
      date: "Dec 12, 2024", 
      items: 1,
      total: "$79.99",
      status: "shipped",
      store: "Fashion Forward",
      estimatedDelivery: "Dec 18, 2024",
      trackingNumber: "FF394728394"
    },
    {
      id: "#ORD-2024-0845",
      date: "Dec 10, 2024",
      items: 2,
      total: "$149.98",
      status: "processing",
      store: "Home & Garden Plus",
      estimatedDelivery: "Dec 20, 2024",
      trackingNumber: null
    }
  ];

  const savedItems = [
    {
      id: 1,
      name: "Wireless Noise-Canceling Headphones",
      price: "$299.99",
      originalPrice: "$399.99",
      discount: "25%",
      store: "Audio Paradise",
      rating: 4.8,
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
      inStock: true
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: "$199.99", 
      originalPrice: "$249.99",
      discount: "20%",
      store: "Fitness World",
      rating: 4.6,
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
      inStock: true
    },
    {
      id: 3,
      name: "Premium Coffee Maker",
      price: "$149.99",
      originalPrice: "$199.99", 
      discount: "25%",
      store: "Kitchen Essentials",
      rating: 4.9,
      image: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
      inStock: false
    }
  ];

  const loyaltyProgress = {
    currentPoints: 1284,
    nextTierPoints: 2000,
    currentTier: "Silver",
    nextTier: "Gold",
    benefits: [
      "Free shipping on orders over $50",
      "Early access to sales",
      "Birthday discounts"
    ]
  };

  const recentActivity = [
    {
      type: "order",
      title: "Order delivered",
      description: "Your order #ORD-2024-0847 has been delivered",
      time: "2 hours ago",
      icon: <Package className="h-4 w-4" />
    },
    {
      type: "review",
      title: "Review reminder",
      description: "Share your experience with Wireless Charging Pad",
      time: "1 day ago",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      type: "promotion",
      title: "New promotion available",
      description: "25% off electronics - limited time offer",
      time: "3 days ago",
      icon: <Gift className="h-4 w-4" />
    }
  ];

  const addresses = [
    {
      id: 1,
      type: "Home",
      address: "123 Main Street, Apt 4B",
      city: "New York, NY 10001",
      isDefault: true
    },
    {
      id: 2,
      type: "Work", 
      address: "456 Business Ave, Suite 200",
      city: "New York, NY 10002",
      isDefault: false
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "Credit Card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: "12",
      expiryYear: "2027",
      isDefault: true
    },
    {
      id: 2,
      type: "Credit Card",
      last4: "8888", 
      brand: "Mastercard",
      expiryMonth: "03",
      expiryYear: "2026",
      isDefault: false
    }
  ];

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground">Manage your orders, preferences, and account settings</p>
          </div>
          <div className="flex items-center space-x-4">
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

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Order History</h3>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{order.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {order.date} • {order.items} items • {order.store}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.total}</p>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'shipped' ? 'secondary' :
                          'outline'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                    </div>

                    {order.status !== 'delivered' && (
                      <div className="bg-muted/30 p-4 rounded-lg mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {order.status === 'shipped' ? 'In Transit' : 'Processing'}
                            </span>
                          </div>
                          {order.estimatedDelivery && (
                            <span className="text-sm text-muted-foreground">
                              Est. delivery: {order.estimatedDelivery}
                            </span>
                          )}
                        </div>
                        {order.trackingNumber && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
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
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reorder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Saved Items</h3>
              <Button variant="outline">Share Wishlist</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive">{item.discount} OFF</Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <Heart className="h-4 w-4 fill-current text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 line-clamp-2">{item.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{item.store}</p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(item.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">({item.rating})</span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold">{item.price}</span>
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {item.originalPrice}
                        </span>
                      </div>
                      <Badge variant={item.inStock ? 'default' : 'secondary'}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" disabled={!item.inStock}>
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Loyalty Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-primary">{loyaltyProgress.currentPoints}</div>
                      <div className="text-sm text-muted-foreground">Current Points</div>
                      <Badge variant="secondary" className="mt-2">
                        {loyaltyProgress.currentTier} Member
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress to {loyaltyProgress.nextTier}</span>
                          <span>{loyaltyProgress.nextTierPoints - loyaltyProgress.currentPoints} points needed</span>
                        </div>
                        <Progress 
                          value={(loyaltyProgress.currentPoints / loyaltyProgress.nextTierPoints) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Your Benefits</h4>
                        <ul className="space-y-2">
                          {loyaltyProgress.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <Zap className="h-3 w-3 text-primary mr-2" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
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
              <Button>
                <MapPin className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <Card key={address.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium">{address.type}</h4>
                          {address.isDefault && (
                            <Badge variant="outline" className="ml-2">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{address.address}</p>
                        <p className="text-sm text-muted-foreground">{address.city}</p>
                      </div>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      {!address.isDefault && (
                        <Button variant="outline" size="sm">Set as Default</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {paymentMethods.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <CreditCard className="h-4 w-4 mr-2" />
                          <h4 className="font-medium">{payment.brand} ending in {payment.last4}</h4>
                          {payment.isDefault && (
                            <Badge variant="outline" className="ml-2">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Expires {payment.expiryMonth}/{payment.expiryYear}
                        </p>
                      </div>
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      {!payment.isDefault && (
                        <Button variant="outline" size="sm">Set as Default</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                      <p className="text-sm text-muted-foreground">Get notified about your orders</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Promotional Emails</h4>
                      <p className="text-sm text-muted-foreground">Receive deals and offers</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">Text updates for deliveries</p>
                    </div>
                    <Button variant="outline" size="sm">Disabled</Button>
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
                      <p className="text-sm text-muted-foreground">Download our mobile app</p>
                    </div>
                    <Button size="sm">
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
                      Shop on the go with our mobile app. Get exclusive mobile-only deals and faster checkout.
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
