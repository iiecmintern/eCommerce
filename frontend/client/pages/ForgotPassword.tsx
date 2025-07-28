import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowRight, 
  ArrowLeft,
  Mail, 
  CheckCircle,
  AlertCircle,
  Zap,
  Store,
  Shield,
  Clock
} from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsEmailSent(true);
  };

  return (
    <Layout hideSidebar={true}>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
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
          </div>

          {!isEmailSent ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                <p className="text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-9 ${error ? 'border-red-500' : ''}`}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {error}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Sending Reset Link..."
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <Link 
                    to="/login" 
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back to Sign In
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-green-100 text-green-600 mb-6">
                  <CheckCircle className="h-8 w-8" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
                <p className="text-muted-foreground mb-6">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Link expires in 15 minutes</span>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={() => {
                        setIsEmailSent(false);
                        setEmail("");
                      }}
                      variant="outline" 
                      className="w-full"
                    >
                      Try Different Email
                    </Button>
                    
                    <Button 
                      onClick={handleSubmit}
                      variant="ghost" 
                      className="w-full text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Resend Email"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <Card className="mt-6 bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-medium mb-1">Security Notice</h4>
                  <p className="text-muted-foreground">
                    For your security, password reset links can only be used once and expire after 15 minutes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
