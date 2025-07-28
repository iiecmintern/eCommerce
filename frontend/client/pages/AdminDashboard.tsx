import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Settings
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$2,847,392",
      change: "+12.3%",
      icon: <DollarSign className="h-5 w-5" />,
      trend: "up"
    },
    {
      title: "Active Stores",
      value: "12,847",
      change: "+5.7%", 
      icon: <Store className="h-5 w-5" />,
      trend: "up"
    },
    {
      title: "Total Users",
      value: "284,392",
      change: "+8.1%",
      icon: <Users className="h-5 w-5" />,
      trend: "up"
    },
    {
      title: "Platform Uptime",
      value: "99.97%",
      change: "+0.1%",
      icon: <BarChart3 className="h-5 w-5" />,
      trend: "up"
    }
  ];

  const recentStores = [
    {
      id: 1,
      name: "TechGadgets Pro",
      owner: "John Smith",
      category: "Electronics",
      revenue: "$24,392",
      status: "active",
      created: "2 days ago"
    },
    {
      id: 2,
      name: "Fashion Forward",
      owner: "Sarah Johnson",
      category: "Fashion",
      revenue: "$18,847",
      status: "pending",
      created: "5 days ago"
    },
    {
      id: 3,
      name: "Home & Garden Plus",
      owner: "Mike Wilson",
      category: "Home & Garden",
      revenue: "$31,294",
      status: "active",
      created: "1 week ago"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New store approved",
      store: "TechGadgets Pro",
      time: "2 minutes ago",
      type: "approval"
    },
    {
      id: 2,
      action: "Payment dispute resolved",
      store: "Fashion Forward",
      time: "15 minutes ago",
      type: "support"
    },
    {
      id: 3,
      action: "Security alert cleared",
      store: "Home & Garden Plus", 
      time: "1 hour ago",
      type: "security"
    },
    {
      id: 4,
      action: "New vendor registration",
      store: "Books & More",
      time: "3 hours ago",
      type: "registration"
    }
  ];

  const systemHealth = [
    { service: "API Gateway", status: "healthy", uptime: "99.98%" },
    { service: "Database", status: "healthy", uptime: "99.97%" },
    { service: "Payment Processing", status: "warning", uptime: "99.85%" },
    { service: "CDN", status: "healthy", uptime: "99.99%" },
    { service: "Search Engine", status: "healthy", uptime: "99.96%" }
  ];

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your global e-commerce platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
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
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm flex items-center ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
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
                  <div className="space-y-4">
                    {recentStores.map((store) => (
                      <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{store.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{store.name}</h4>
                            <p className="text-sm text-muted-foreground">{store.owner} • {store.category}</p>
                            <p className="text-sm text-muted-foreground">{store.created}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{store.revenue}</p>
                          <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                            {store.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'approval' ? 'bg-green-100 text-green-600' :
                          activity.type === 'support' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'security' ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.type === 'approval' ? <CheckCircle className="h-4 w-4" /> :
                           activity.type === 'support' ? <Users className="h-4 w-4" /> :
                           activity.type === 'security' ? <Shield className="h-4 w-4" /> :
                           <Store className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.store}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {systemHealth.map((service, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <div className={`inline-flex p-2 rounded-full mb-2 ${
                        service.status === 'healthy' ? 'bg-green-100 text-green-600' :
                        service.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {service.status === 'healthy' ? <CheckCircle className="h-4 w-4" /> :
                         <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <h4 className="font-medium text-sm">{service.service}</h4>
                      <p className="text-xs text-muted-foreground">{service.uptime}</p>
                      <Badge variant={service.status === 'healthy' ? 'default' : 'destructive'} className="mt-1">
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
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
                      <span className="font-bold">$847,392</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      85% of annual target achieved
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
                      <span className="font-bold">2.4M</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      78% of daily capacity used
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
                      <h3 className="text-xl font-bold mb-2">Real-time Business Intelligence</h3>
                      <p className="text-white/90">Track performance across all metrics with our advanced analytics suite</p>
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
                    <div className="text-sm text-muted-foreground">Countries Served</div>
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
                    <div className="text-sm text-muted-foreground mb-4">Mobile Users</div>
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
        </Tabs>
      </div>
    </Layout>
  );
}
