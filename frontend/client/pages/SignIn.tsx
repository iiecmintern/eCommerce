import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Zap,
  Shield,
  Users,
  Store,
  BarChart3,
  Globe,
} from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast({
          title: "Login successful!",
          description: result.message,
        });

        // Redirect based on user role (handled by AuthContext)
        // The AuthContext will automatically redirect based on the user's role
      } else {
        toast({
          title: "Login failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const quickAccessAccounts = [
    {
      role: "Admin",
      email: "admin@demo.com",
      description: "Full platform management access",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      role: "Vendor",
      email: "vendor@demo.com",
      description: "Store management and analytics",
      icon: <Store className="h-5 w-5" />,
    },
    {
      role: "Customer",
      email: "customer@demo.com",
      description: "Shopping and order management",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const handleDemoLogin = async (email: string) => {
    setFormData((prev) => ({ ...prev, email, password: "Demo123!" }));

    // Auto-submit after setting the demo credentials
    setTimeout(async () => {
      setIsLoading(true);

      try {
        const result = await login(email, "Demo123!");

        if (result.success) {
          toast({
            title: "Demo login successful!",
            description: result.message,
          });
        } else {
          toast({
            title: "Demo login failed",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Demo login failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background flex items-center justify-center p-6">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Welcome Back */}
          <div className="space-y-8">
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-8">
                <div className="relative">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent flex items-center justify-center">
                    <Zap className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  CommerceForge
                </span>
              </Link>

              <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Sign in to continue building your e-commerce empire.
              </p>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: <Store className="h-6 w-6" />,
                  label: "Active Stores",
                  value: "12,847",
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  label: "Happy Customers",
                  value: "284K+",
                },
                {
                  icon: <BarChart3 className="h-6 w-6" />,
                  label: "Revenue Generated",
                  value: "$2.8B+",
                },
                {
                  icon: <Globe className="h-6 w-6" />,
                  label: "Countries",
                  value: "180+",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg bg-muted/30"
                >
                  <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                "AI-powered product optimization",
                "Global payment processing",
                "Real-time analytics dashboard",
                "Multi-vendor marketplace support",
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="space-y-6">
            <Card className="w-full">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  Sign In to Your Account
                </CardTitle>
                <p className="text-muted-foreground">
                  Enter your credentials to access your dashboard
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Social Sign In */}
                <div className="space-y-4">
                  <Button variant="outline" className="w-full" type="button">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-9 ${errors.email ? "border-red-500" : ""}`}
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`pl-9 pr-9 ${errors.password ? "border-red-500" : ""}`}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        handleInputChange("rememberMe", checked as boolean)
                      }
                    />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Remember me for 30 days
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Signing in..."
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-primary hover:underline font-medium"
                    >
                      Create one here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Demo Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Demo Access</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Try different user roles with one click
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickAccessAccounts.map((account, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-4"
                    onClick={() => handleDemoLogin(account.email)}
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {account.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{account.role}</span>
                          <Badge variant="secondary" className="text-xs">
                            Demo
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {account.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {account.email}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
