import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  ShoppingBag,
  Download,
  Share2,
  ArrowRight,
} from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pricing: {
    subtotal: number;
    discount: number;
    total: number;
    currency: string;
  };
  payment: {
    method: string;
    status: string;
    amount: number;
  };
  createdAt: string;
}

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        toast({
          title: "Order Not Found",
          description: "No order ID provided",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      try {
        const response = await apiService.request(`/orders/${orderId}`);
        if (response.success) {
          setOrder(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: "Failed to fetch order details",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate, toast]);

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleViewOrders = () => {
    navigate("/customer");
  };

  const handleDownloadInvoice = () => {
    // Simple invoice generation
    const invoiceContent = `
Order Invoice
============

Order Number: ${order?.orderNumber}
Date: ${order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
Status: ${order?.status}

Customer Details:
${order?.shippingAddress.firstName} ${order?.shippingAddress.lastName}
${order?.shippingAddress.email}
${order?.shippingAddress.phone}
${order?.shippingAddress.address}
${order?.shippingAddress.city}, ${order?.shippingAddress.state} ${order?.shippingAddress.zipCode}

Items:
${order?.items.map((item) => `${item.name} x${item.quantity} - ₹${item.total}`).join("\n")}

Subtotal: ₹${order?.pricing.subtotal}
Discount: ₹${order?.pricing.discount}
Total: ₹${order?.pricing.total}

Payment Method: ${order?.payment.method}
Payment Status: ${order?.payment.status}
    `;

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order?.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Invoice Downloaded",
      description: "Your invoice has been downloaded successfully",
    });
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Order Confirmation",
        text: `I just placed an order on CommerceForge! Order #${order?.orderNumber}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Order #${order?.orderNumber} - ${window.location.href}`,
      );
      toast({
        title: "Order Link Copied",
        description: "Order link has been copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Button onClick={() => navigate("/")}>Continue Shopping</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Order Number</span>
                    <span className="font-mono">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Order Date</span>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Status</span>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Payment Method</span>
                    <span className="capitalize">{order.payment.method}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Payment Status</span>
                    <Badge
                      variant={
                        order.payment.status === "paid"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {order.payment.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg";
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{item.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.pricing.subtotal.toLocaleString()}</span>
                  </div>
                  {order.pricing.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{order.pricing.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{order.pricing.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.email}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.phone}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.address}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.country}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button onClick={handleContinueShopping} className="w-full">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleViewOrders}
                    className="w-full"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    View My Orders
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadInvoice}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShareOrder}
                    className="w-full"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Order
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Order Updates</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      You'll receive email updates about your order status.
                    </p>
                    <p className="text-muted-foreground">
                      Track your order in your account dashboard.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Need Help?</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      If you have any questions about your order, please contact
                      our support team.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Contact Support
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
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
