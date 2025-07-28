import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Minus, 
  Plus, 
  Trash2, 
  Heart,
  ShoppingBag,
  ArrowRight,
  Truck,
  Shield,
  Tag,
  MapPin
} from "lucide-react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra",
      price: 124999,
      originalPrice: 149999,
      quantity: 1,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      variant: "256GB, Titanium Black",
      inStock: true,
      seller: "Samsung Official Store"
    },
    {
      id: 2,
      name: "Apple MacBook Air M2",
      price: 99900,
      originalPrice: 119900,
      quantity: 1,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      variant: "13-inch, 8GB RAM, 256GB SSD",
      inStock: true,
      seller: "Apple Store"
    },
    {
      id: 3,
      name: "Sony WH-1000XM5 Headphones",
      price: 24990,
      originalPrice: 29990,
      quantity: 2,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      variant: "Black",
      inStock: true,
      seller: "Sony Official"
    }
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const deliveryFee = subtotal > 50000 ? 0 : 199;
  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-12">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some products to get started
              </p>
              <Button asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.variant}</p>
                          <p className="text-sm text-muted-foreground">Sold by: {item.seller}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold">{formatPrice(item.price)}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <Badge variant="outline" className="text-green-600">
                          <Truck className="h-3 w-3 mr-1" />
                          Free Delivery
                        </Badge>
                        <Badge variant="outline" className="text-blue-600">
                          <Shield className="h-3 w-3 mr-1" />
                          7-day Returns
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Continue Shopping */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Want to add more items?</h3>
                    <p className="text-sm text-muted-foreground">Continue shopping to add more products</p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Apply Coupon</h3>
                <div className="flex gap-2">
                  <Input placeholder="Enter coupon code" />
                  <Button variant="outline">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-green-600">
                    <span>You Save</span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}</span>
                  </div>
                  
                  {deliveryFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add {formatPrice(50000 - subtotal)} more for free delivery
                    </p>
                  )}
                  
                  <hr />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                
                <Button className="w-full mt-6" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Delivery Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">Deliver to Mumbai 400001</p>
                      <Button variant="link" className="p-0 h-auto text-xs">
                        Change location
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-green-600" />
                    <div className="text-sm">
                      <p className="font-medium text-green-600">Estimated delivery</p>
                      <p className="text-muted-foreground">2-3 business days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-center">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div className="text-sm">
                    <p className="font-medium">Secure Checkout</p>
                    <p className="text-muted-foreground">Your payment information is protected</p>
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
