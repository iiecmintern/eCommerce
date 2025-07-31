import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import {
  BarChart3,
  Users,
  Store,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Ban,
  Shield,
  Globe,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Star,
  Package,
  CreditCard,
  FileText,
  Settings,
  Loader2,
  RefreshCw,
  Plus,
} from "lucide-react";

// Types for admin dashboard data
interface AdminStats {
  totalRevenue: number;
  activeStores: number;
  totalUsers: number;
  platformUptime: number;
  revenueChange: number;
  storesChange: number;
  usersChange: number;
  uptimeChange: number;
}

interface Store {
  id: string;
  name: string;
  owner: string;
  category: string;
  revenue: number;
  status: "active" | "pending" | "suspended" | "inactive";
  createdAt: string;
  avatar?: string;
}

interface Activity {
  id: string;
  action: string;
  store: string;
  time: string;
  type:
    | "approval"
    | "support"
    | "security"
    | "registration"
    | "payment"
    | "system";
}

interface SystemService {
  service: string;
  status: "healthy" | "warning" | "error";
  uptime: number;
  lastCheck: string;
}

interface AnalyticsData {
  monthlyRevenue: number;
  apiCalls: number;
  revenueTarget: number;
  apiCapacity: number;
}

interface AdminDashboardData {
  stats: AdminStats;
  recentStores: Store[];
  recentActivities: Activity[];
  systemHealth: SystemService[];
  analytics: AnalyticsData;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch admin dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel for better performance
      const [
        statsResponse,
        storesResponse,
        activitiesResponse,
        systemResponse,
        analyticsResponse,
      ] = await Promise.allSettled([
        apiService.request<AdminStats>("/admin/stats"),
        apiService.request<Store[]>("/admin/stores/recent"),
        apiService.request<Activity[]>("/admin/activities"),
        apiService.request<SystemService[]>("/admin/system/health"),
        apiService.request<AnalyticsData>("/admin/analytics"),
      ]);

      // Process stats data
      let stats: AdminStats;
      if (statsResponse.status === "fulfilled" && statsResponse.value.success) {
        stats = statsResponse.value.data;
      } else {
        console.warn("Could not fetch stats:", statsResponse);
        // Show 0 when no data available
        stats = {
          totalRevenue: 0,
          activeStores: 0,
          totalUsers: 0,
          platformUptime: 0,
          revenueChange: 0,
          storesChange: 0,
          usersChange: 0,
          uptimeChange: 0,
        };
      }

      // Process stores data
      let recentStores: Store[];
      if (
        storesResponse.status === "fulfilled" &&
        storesResponse.value.success
      ) {
        recentStores = storesResponse.value.data;
      } else {
        console.warn("Could not fetch recent stores:", storesResponse);
        // Show empty array when no data available
        recentStores = [];
      }

      // Process activities data
      let recentActivities: Activity[];
      if (
        activitiesResponse.status === "fulfilled" &&
        activitiesResponse.value.success
      ) {
        recentActivities = activitiesResponse.value.data;
      } else {
        console.warn("Could not fetch recent activities:", activitiesResponse);
        // Show empty array when no data available
        recentActivities = [];
      }

      // Process system health data
      let systemHealth: SystemService[];
      if (
        systemResponse.status === "fulfilled" &&
        systemResponse.value.success
      ) {
        systemHealth = systemResponse.value.data;
      } else {
        console.warn("Could not fetch system health:", systemResponse);
        // Show empty array when no data available
        systemHealth = [];
      }

      // Process analytics data
      let analytics: AnalyticsData;
      if (
        analyticsResponse.status === "fulfilled" &&
        analyticsResponse.value.success
      ) {
        analytics = analyticsResponse.value.data;
      } else {
        console.warn("Could not fetch analytics:", analyticsResponse);
        // Show 0 when no data available
        analytics = {
          monthlyRevenue: 0,
          apiCalls: 0,
          revenueTarget: 0,
          apiCapacity: 0,
        };
      }

      setData({
        stats,
        recentStores,
        recentActivities,
        systemHealth,
        analytics,
      });
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard data",
      );
      toast({
        title: "Error",
        description: "Failed to load admin dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchDashboardData();
      toast({
        title: "Success",
        description: "Dashboard data refreshed successfully",
      });
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      toast({
        title: "Error",
        description: "Failed to refresh dashboard data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Export report
  const handleExportReport = async () => {
    try {
      const response = await apiService.request("/admin/reports/export", {
        method: "POST",
        body: JSON.stringify({
          type: "dashboard",
          format: "pdf",
        }),
      });

      if (response.success) {
        // Create download link
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `admin-dashboard-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        toast({
          title: "Success",
          description: "Dashboard report exported successfully",
        });
      }
    } catch (error) {
      console.error("Error exporting report:", error);
      toast({
        title: "Error",
        description: "Failed to export dashboard report",
        variant: "destructive",
      });
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading admin dashboard...</p>
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
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Error loading dashboard
            </h3>
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
            <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No data available</h3>
            <p className="text-muted-foreground">
              Dashboard data is not available at the moment
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `₹${amount.toLocaleString()}`;
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60),
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      if (diffInMinutes < 1440)
        return `${Math.floor(diffInMinutes / 60)} hours ago`;
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Unknown time";
    }
  };

  // Format stats for display
  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(data.stats.totalRevenue),
      change: `${data.stats.revenueChange > 0 ? "+" : ""}${data.stats.revenueChange}%`,
      icon: <DollarSign className="h-5 w-5" />,
      trend: data.stats.revenueChange >= 0 ? "up" : "down",
    },
    {
      title: "Active Stores",
      value: data.stats.activeStores.toLocaleString(),
      change: `${data.stats.storesChange > 0 ? "+" : ""}${data.stats.storesChange}%`,
      icon: <Store className="h-5 w-5" />,
      trend: data.stats.storesChange >= 0 ? "up" : "down",
    },
    {
      title: "Total Users",
      value: data.stats.totalUsers.toLocaleString(),
      change: `${data.stats.usersChange > 0 ? "+" : ""}${data.stats.usersChange}%`,
      icon: <Users className="h-5 w-5" />,
      trend: data.stats.usersChange >= 0 ? "up" : "down",
    },
    {
      title: "Platform Uptime",
      value: `${data.stats.platformUptime}%`,
      change: `${data.stats.uptimeChange > 0 ? "+" : ""}${data.stats.uptimeChange}%`,
      icon: <BarChart3 className="h-5 w-5" />,
      trend: data.stats.uptimeChange >= 0 ? "up" : "down",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your global e-commerce platform
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
            <Button variant="outline" onClick={handleExportReport}>
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Platform Settings
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
                    <p
                      className={`text-sm flex items-center ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
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
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Stores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="h-5 w-5 mr-2" />
                    Recent Stores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recentStores.length === 0 ? (
                    <div className="text-center py-8">
                      <Store className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        No recent stores found
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.recentStores.map((store) => (
                        <div
                          key={store.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              {store.avatar ? (
                                <AvatarImage
                                  src={store.avatar}
                                  alt={store.name}
                                />
                              ) : (
                                <AvatarFallback>
                                  {store.name?.charAt(0) || "S"}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{store.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {store.owner} • {store.category}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatTimeAgo(store.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(store.revenue)}
                            </p>
                            <Badge
                              variant={
                                store.status === "active"
                                  ? "default"
                                  : store.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {store.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recentActivities.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        No recent activities found
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-4 p-3 border rounded-lg"
                        >
                          <div
                            className={`p-2 rounded-full ${
                              activity.type === "approval"
                                ? "bg-green-100 text-green-600"
                                : activity.type === "support"
                                  ? "bg-blue-100 text-blue-600"
                                  : activity.type === "security"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {activity.type === "approval" ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : activity.type === "support" ? (
                              <Users className="h-4 w-4" />
                            ) : activity.type === "security" ? (
                              <Shield className="h-4 w-4" />
                            ) : (
                              <Store className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.store}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimeAgo(activity.time)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.systemHealth.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {data.systemHealth.map((service, index) => (
                      <div
                        key={index}
                        className="text-center p-4 border rounded-lg"
                      >
                        <div
                          className={`inline-flex p-2 rounded-full mb-2 ${
                            service.status === "healthy"
                              ? "bg-green-100 text-green-600"
                              : service.status === "warning"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600"
                          }`}
                        >
                          {service.status === "healthy" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                        </div>
                        <h4 className="font-medium text-sm">
                          {service.service}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {service.uptime}%
                        </p>
                        <Badge
                          variant={
                            service.status === "healthy"
                              ? "default"
                              : service.status === "warning"
                                ? "secondary"
                                : "destructive"
                          }
                          className="mt-1"
                        >
                          {service.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No System Data
                    </h3>
                    <p className="text-muted-foreground">
                      System health information is not available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Monthly Recurring Revenue</span>
                      <span className="font-bold">
                        {formatCurrency(data.analytics.monthlyRevenue)}
                      </span>
                    </div>
                    <Progress
                      value={
                        (data.analytics.monthlyRevenue /
                          data.analytics.revenueTarget) *
                        100
                      }
                      className="h-2"
                    />
                    <div className="text-sm text-muted-foreground">
                      {Math.round(
                        (data.analytics.monthlyRevenue /
                          data.analytics.revenueTarget) *
                          100,
                      )}
                      % of annual target achieved
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>API Calls Today</span>
                      <span className="font-bold">
                        {(data.analytics.apiCalls / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <Progress
                      value={
                        (data.analytics.apiCalls / data.analytics.apiCapacity) *
                        100
                      }
                      className="h-2"
                    />
                    <div className="text-sm text-muted-foreground">
                      {Math.round(
                        (data.analytics.apiCalls / data.analytics.apiCapacity) *
                          100,
                      )}
                      % of daily capacity used
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Image showcase */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/936135/pexels-photo-936135.jpeg"
                    alt="Analytics dashboard showing business data and charts"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-2">
                        Real-time Business Intelligence
                      </h3>
                      <p className="text-white/90">
                        Track performance across all metrics with our advanced
                        analytics suite
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Global Reach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <img
                      src="https://images.pexels.com/photos/7412020/pexels-photo-7412020.jpeg"
                      alt="World map showing global business presence"
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                    <div className="text-2xl font-bold">180+</div>
                    <div className="text-sm text-muted-foreground">
                      Countries Served
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    Mobile Traffic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold">67%</div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Mobile Users
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">SSL Certificate</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">DDoS Protection</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">WAF Active</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stores Tab */}
          <TabsContent value="stores" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Store Management</h2>
                <p className="text-muted-foreground">
                  Manage all stores on the platform
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Store
                </Button>
              </div>
            </div>

            {/* Store Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Stores
                      </p>
                      <p className="text-2xl font-bold">
                        {data.stats.activeStores}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <Store className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Active Stores
                      </p>
                      <p className="text-2xl font-bold">
                        {
                          data.recentStores.filter((s) => s.status === "active")
                            .length
                        }
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pending Approval
                      </p>
                      <p className="text-2xl font-bold">
                        {
                          data.recentStores.filter(
                            (s) => s.status === "pending",
                          ).length
                        }
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Suspended</p>
                      <p className="text-2xl font-bold">
                        {
                          data.recentStores.filter(
                            (s) => s.status === "suspended",
                          ).length
                        }
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
                      <Ban className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stores List */}
            <Card>
              <CardHeader>
                <CardTitle>All Stores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentStores.length > 0 ? (
                    data.recentStores.map((store) => (
                      <div
                        key={store.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            {store.avatar ? (
                              <AvatarImage
                                src={store.avatar}
                                alt={store.name}
                              />
                            ) : (
                              <AvatarFallback>
                                {store.name?.charAt(0) || "S"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{store.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {store.owner} • {store.category}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatTimeAgo(store.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(store.revenue)}
                          </p>
                          <Badge
                            variant={
                              store.status === "active"
                                ? "default"
                                : store.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {store.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          {store.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          {store.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                            >
                              <Ban className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No Stores Found
                      </h3>
                      <p className="text-muted-foreground">
                        No stores have been registered yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-muted-foreground">
                  Manage all users on the platform
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold">
                        {data.stats.totalUsers}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Customers</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Vendors</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                      <Store className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Admins</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                      <Shield className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentStores.length > 0 ? (
                    data.recentStores.map((store) => (
                      <div
                        key={store.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {store.owner?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{store.owner}</h4>
                            <p className="text-sm text-muted-foreground">
                              Store: {store.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatTimeAgo(store.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">vendor</Badge>
                          <Badge
                            variant={
                              store.status === "active"
                                ? "default"
                                : "destructive"
                            }
                            className="ml-2"
                          >
                            {store.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          {store.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                            >
                              <Ban className="h-3 w-3" />
                            </Button>
                          )}
                          {store.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No Users Found
                      </h3>
                      <p className="text-muted-foreground">
                        No users have been registered yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Platform Settings
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Configure platform-wide settings and preferences
                  </p>
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Settings
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
