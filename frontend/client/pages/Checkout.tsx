import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Package,
  IndianRupee,
} from "lucide-react";
import { CreateOrderRequest, OrderAddress, Product } from "@shared/api";

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: {
    name: string;
    value: string;
    sku: string;
  };
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Get cart items from location state or localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [shippingAddress, setShippingAddress] = useState<OrderAddress>({
    name: user?.firstName + " " + user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    street: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    landmark: "",
  });

  const [billingAddress, setBillingAddress] = useState<OrderAddress | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "online" | "upi" | "card" | "netbanking" | "wallet"
  >("cod");
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [customerNotes, setCustomerNotes] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  // Load cart items
  useEffect(() => {
    const items =
      location.state?.cartItems ||
      JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);

    if (items.length === 0) {
      navigate("/cart");
    }
  }, [location.state, navigate]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const tax = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.product.price * item.quantity * (item.product.gstRate || 18)) / 100,
    0,
  );
  const shippingCost = subtotal > 50000 ? 0 : 199; // Free shipping above 50k
  const couponDiscount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0;
  const total = subtotal + tax + shippingCost - couponDiscount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddressChange = (field: keyof OrderAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    if (useSameAddress) {
      setBillingAddress((prev) =>
        prev
          ? { ...prev, [field]: value }
          : { ...shippingAddress, [field]: value },
      );
    }
  };

  const handleBillingAddressChange = (
    field: keyof OrderAddress,
    value: string,
  ) => {
    if (!billingAddress) return;
    setBillingAddress((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleUseSameAddress = (checked: boolean) => {
    setUseSameAddress(checked);
    if (checked) {
      setBillingAddress(shippingAddress);
    } else {
      setBillingAddress({
        name: "",
        phone: "",
        email: "",
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        landmark: "",
      });
    }
  };

  const applyCoupon = () => {
    // Mock coupon validation - in real app, this would call an API
    if (couponCode.toLowerCase() === "welcome10") {
      setAppliedCoupon({
        code: couponCode,
        discount: 10,
        discountType: "percentage",
      });
      toast({
        title: "Coupon Applied!",
        description: "10% discount applied to your order.",
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code.",
        variant: "destructive",
      });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handlePlaceOrder = async () => {
    if (!agreeToTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const orderData: CreateOrderRequest = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          variant: item.variant,
        })),
        shippingAddress,
        billingAddress: useSameAddress ? undefined : billingAddress!,
        paymentMethod,
        appliedCoupon,
        notes: {
          customer: customerNotes,
        },
      };

      const response = await apiService.createOrder(orderData);

      if (response.success) {
        // Clear cart
        localStorage.removeItem("cartItems");

        toast({
          title: "Order Placed Successfully!",
          description: `Order #${response.data.orderNumber} has been created.`,
        });

        // Navigate to order confirmation
        navigate(`/order/${response.data.id}`, {
          state: { order: response.data },
        });
      }
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description:
          error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some products to get started
              </p>
              <Button asChild>
                <a href="/">Continue Shopping</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/cart")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={shippingAddress.name}
                      onChange={(e) =>
                        handleAddressChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        handleAddressChange("phone", e.target.value)
                      }
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) =>
                      handleAddressChange("email", e.target.value)
                    }
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={shippingAddress.street}
                    onChange={(e) =>
                      handleAddressChange("street", e.target.value)
                    }
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        handleAddressChange("state", e.target.value)
                      }
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={shippingAddress.pincode}
                      onChange={(e) =>
                        handleAddressChange("pincode", e.target.value)
                      }
                      placeholder="Pincode"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="landmark">Landmark (Optional)</Label>
                  <Input
                    id="landmark"
                    value={shippingAddress.landmark}
                    onChange={(e) =>
                      handleAddressChange("landmark", e.target.value)
                    }
                    placeholder="Nearby landmark"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="same-address"
                    checked={useSameAddress}
                    onCheckedChange={handleUseSameAddress}
                  />
                  <Label htmlFor="same-address">Same as shipping address</Label>
                </div>

                {!useSameAddress && billingAddress && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billing-name">Full Name *</Label>
                        <Input
                          id="billing-name"
                          value={billingAddress.name}
                          onChange={(e) =>
                            handleBillingAddressChange("name", e.target.value)
                          }
                          placeholder="Enter billing name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-phone">Phone Number *</Label>
                        <Input
                          id="billing-phone"
                          value={billingAddress.phone}
                          onChange={(e) =>
                            handleBillingAddressChange("phone", e.target.value)
                          }
                          placeholder="Enter billing phone"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="billing-email">Email</Label>
                      <Input
                        id="billing-email"
                        type="email"
                        value={billingAddress.email}
                        onChange={(e) =>
                          handleBillingAddressChange("email", e.target.value)
                        }
                        placeholder="Enter billing email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="billing-street">Street Address *</Label>
                      <Input
                        id="billing-street"
                        value={billingAddress.street}
                        onChange={(e) =>
                          handleBillingAddressChange("street", e.target.value)
                        }
                        placeholder="Enter billing street address"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="billing-city">City *</Label>
                        <Input
                          id="billing-city"
                          value={billingAddress.city}
                          onChange={(e) =>
                            handleBillingAddressChange("city", e.target.value)
                          }
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-state">State *</Label>
                        <Input
                          id="billing-state"
                          value={billingAddress.state}
                          onChange={(e) =>
                            handleBillingAddressChange("state", e.target.value)
                          }
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-pincode">Pincode *</Label>
                        <Input
                          id="billing-pincode"
                          value={billingAddress.pincode}
                          onChange={(e) =>
                            handleBillingAddressChange(
                              "pincode",
                              e.target.value,
                            )
                          }
                          placeholder="Pincode"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={paymentMethod}
                  onValueChange={(value: any) => setPaymentMethod(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                    <SelectItem value="wallet">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Any special instructions for delivery..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={
                          item.product.images[0] || "/placeholder-product.jpg"
                        }
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} ×{" "}
                          {formatPrice(item.product.price)}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground">
                            {item.variant.name}: {item.variant.value}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon Code */}
                <div className="space-y-2">
                  <Label>Coupon Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeCoupon}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={applyCoupon}>
                        Apply
                      </Button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Coupon applied: {appliedCoupon.code}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Terms and Place Order */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) =>
                        setAgreeToTerms(checked as boolean)
                      }
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms & Conditions
                      </a>
                    </Label>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isLoading || !agreeToTerms}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading
                      ? "Placing Order..."
                      : `Place Order - ${formatPrice(total)}`}
                  </Button>

                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Secure checkout powered by CommerceForge</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
