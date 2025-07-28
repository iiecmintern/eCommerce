import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Phone,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Store
} from "lucide-react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    
    // Handle successful signup
    console.log("Sign up successful:", formData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const passwordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "" };
    if (password.length < 6) return { strength: 25, text: "Weak" };
    if (password.length < 8) return { strength: 50, text: "Fair" };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 75, text: "Good" };
    return { strength: 100, text: "Strong" };
  };

  const strength = passwordStrength(formData.password);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background flex items-center justify-center p-6">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
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

              <h1 className="text-4xl font-bold mb-4">
                Start Your E-commerce Journey
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of businesses building successful online stores with CommerceForge.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "Launch in Minutes",
                  description: "Get your store online with our guided setup wizard"
                },
                {
                  icon: <Globe className="h-6 w-6" />,
                  title: "Global Reach",
                  description: "Sell worldwide with multi-currency and multi-language support"
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Enterprise Security",
                  description: "Bank-level security with SSL, fraud protection, and compliance"
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <p className="text-muted-foreground">
                Get started with your free trial today
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Social Sign Up */}
              <div className="space-y-4">
                <Button variant="outline" className="w-full" type="button">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        className={`pl-9 ${errors.firstName ? 'border-red-500' : ''}`}
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Smith"
                      className={errors.lastName ? 'border-red-500' : ''}
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className={`pl-9 ${errors.email ? 'border-red-500' : ''}`}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        className="pl-9"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        placeholder="Acme Corp"
                        className="pl-9"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`pl-9 pr-9 ${errors.password ? 'border-red-500' : ''}`}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Password strength</span>
                        <span className={`${
                          strength.strength < 50 ? 'text-red-500' :
                          strength.strength < 75 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {strength.text}
                        </span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            strength.strength < 50 ? 'bg-red-500' :
                            strength.strength < 75 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${strength.strength}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={`pl-9 pr-9 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                      className={errors.agreeToTerms ? 'border-red-500' : ''}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm leading-5">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.agreeToTerms}
                    </p>
                  )}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToMarketing"
                      checked={formData.agreeToMarketing}
                      onCheckedChange={(checked) => handleInputChange('agreeToMarketing', checked as boolean)}
                    />
                    <Label htmlFor="agreeToMarketing" className="text-sm leading-5">
                      I'd like to receive product updates and marketing communications
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
