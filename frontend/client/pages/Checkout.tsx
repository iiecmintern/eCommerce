import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: "card" | "upi" | "cod";
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
  upiId?: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, subtotal, totalDiscount, total, clearCart } = useCart();
  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "card",
  });

  const [selectedPaymentType, setSelectedPaymentType] = useState<
    "card" | "upi" | "cod"
  >("card");

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentTypeChange = (type: "card" | "upi" | "cod") => {
    setSelectedPaymentType(type);
    setPaymentMethod({ type });
  };

  const handlePaymentChange = (field: keyof PaymentMethod, value: string) => {
    setPaymentMethod((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ];

    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        toast({
          title: "Missing Information",
          description: `Please fill in your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          variant: "destructive",
        });
        return false;
      }
    }

    if (selectedPaymentType === "card") {
      if (
        !paymentMethod.cardNumber ||
        !paymentMethod.cardHolder ||
        !paymentMethod.expiry ||
        !paymentMethod.cvv
      ) {
        toast({
          title: "Payment Information Required",
          description: "Please fill in all card details",
          variant: "destructive",
        });
        return false;
      }
    }

    if (selectedPaymentType === "upi" && !paymentMethod.upiId) {
      toast({
        title: "UPI ID Required",
        description: "Please enter your UPI ID",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      // TODO: Implement actual order placement API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast({
        title: "Order Placed Successfully!",
        description:
          "Your order has been confirmed. You will receive an email confirmation shortly.",
      });

      clearCart();
      navigate("/order-confirmation");
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Please add items to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/cart")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Cart</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingAddress.firstName}
                      onChange={(e) =>
                        handleAddressChange("firstName", e.target.value)
                      }
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingAddress.lastName}
                      onChange={(e) =>
                        handleAddressChange("lastName", e.target.value)
                      }
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) =>
                        handleAddressChange("email", e.target.value)
                      }
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        handleAddressChange("phone", e.target.value)
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      handleAddressChange("address", e.target.value)
                    }
                    placeholder="123 Main Street, Apartment 4B"
                    rows={3}
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
                      placeholder="Mumbai"
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
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        handleAddressChange("zipCode", e.target.value)
                      }
                      placeholder="400001"
                    />
                  </div>
                </div>
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={
                      selectedPaymentType === "card" ? "default" : "outline"
                    }
                    onClick={() => handlePaymentTypeChange("card")}
                    className="flex flex-col items-center space-y-2 p-4"
                  >
                    <CreditCard className="h-6 w-6" />
                    <span className="text-sm">Credit Card</span>
                  </Button>
                  <Button
                    variant={
                      selectedPaymentType === "upi" ? "default" : "outline"
                    }
                    onClick={() => handlePaymentTypeChange("upi")}
                    className="flex flex-col items-center space-y-2 p-4"
                  >
                    <Lock className="h-6 w-6" />
                    <span className="text-sm">UPI</span>
                  </Button>
                  <Button
                    variant={
                      selectedPaymentType === "cod" ? "default" : "outline"
                    }
                    onClick={() => handlePaymentTypeChange("cod")}
                    className="flex flex-col items-center space-y-2 p-4"
                  >
                    <Truck className="h-6 w-6" />
                    <span className="text-sm">Cash on Delivery</span>
                  </Button>
                </div>

                {selectedPaymentType === "card" && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        value={paymentMethod.cardNumber || ""}
                        onChange={(e) =>
                          handlePaymentChange("cardNumber", e.target.value)
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardHolder">Cardholder Name *</Label>
                      <Input
                        id="cardHolder"
                        value={paymentMethod.cardHolder || ""}
                        onChange={(e) =>
                          handlePaymentChange("cardHolder", e.target.value)
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date *</Label>
                        <Input
                          id="expiry"
                          value={paymentMethod.expiry || ""}
                          onChange={(e) =>
                            handlePaymentChange("expiry", e.target.value)
                          }
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          value={paymentMethod.cvv || ""}
                          onChange={(e) =>
                            handlePaymentChange("cvv", e.target.value)
                          }
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentType === "upi" && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <Label htmlFor="upiId">UPI ID *</Label>
                      <Input
                        id="upiId"
                        value={paymentMethod.upiId || ""}
                        onChange={(e) =>
                          handlePaymentChange("upiId", e.target.value)
                        }
                        placeholder="john@upi"
                      />
                    </div>
                  </div>
                )}

                {selectedPaymentType === "cod" && (
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>Pay when you receive your order</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{totalDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="text-xs text-muted-foreground text-center">
                  <Lock className="h-3 w-3 inline mr-1" />
                  Your payment information is secure and encrypted
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
