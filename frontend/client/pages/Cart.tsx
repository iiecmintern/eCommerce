import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  CreditCard,
  Truck,
  Tag,
  X,
  Loader2,
} from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    items,
    totalItems,
    subtotal,
    totalDiscount,
    total,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    couponCode,
    couponDiscount,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast({
        title: "Coupon code required",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const result = await applyCoupon(couponInput.trim().toUpperCase());
      toast({
        title: result.success ? "Coupon Applied!" : "Invalid Coupon",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

      if (result.success) {
        setCouponInput("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your cart",
    });
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      // TODO: Implement actual checkout flow
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Redirecting to Checkout",
        description: "You will be redirected to the checkout page",
      });

      // Navigate to checkout page
      navigate("/checkout");
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "Failed to proceed to checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate("/")} className="w-full">
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/search")}
                className="w-full"
              >
                Browse Products
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleClearCart}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          console.error("Error loading product image:", e);
                          e.currentTarget.src =
                            "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg";
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Sold by {item.vendor} • {item.store}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="font-semibold">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.originalPrice &&
                          item.originalPrice > item.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={!item.inStock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <div className="font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                      {item.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ₹
                          {(
                            item.originalPrice * item.quantity
                          ).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Stock Status */}
                  {!item.inStock && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ This item is currently out of stock
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Coupon Code</label>
                  {couponCode ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">
                          {couponCode}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleApplyCoupon()
                        }
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        size="sm"
                      >
                        {isApplyingCoupon ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{totalDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || items.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>

                {/* Additional Info */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center">
                    <Truck className="h-3 w-3 mr-1" />
                    Free shipping on orders above ₹999
                  </div>
                  <div>Secure checkout with SSL encryption</div>
                  <div>30-day return policy</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
