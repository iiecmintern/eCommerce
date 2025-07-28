import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Heart, 
  ShoppingCart, 
  ArrowRight, 
  Truck,
  Shield,
  RotateCcw,
  Phone,
  Laptop,
  Shirt,
  Home,
  Book,
  Car,
  Gamepad2,
  Watch,
  Camera,
  Headphones,
  Gift,
  Percent,
  Zap,
  TrendingUp
} from "lucide-react";

export default function EcommerceHome() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Electronics", icon: <Laptop className="h-6 w-6" />, link: "/category/electronics", color: "bg-blue-100 text-blue-700" },
    { name: "Fashion", icon: <Shirt className="h-6 w-6" />, link: "/category/fashion", color: "bg-pink-100 text-pink-700" },
    { name: "Home & Kitchen", icon: <Home className="h-6 w-6" />, link: "/category/home", color: "bg-green-100 text-green-700" },
    { name: "Books", icon: <Book className="h-6 w-6" />, link: "/category/books", color: "bg-orange-100 text-orange-700" },
    { name: "Automotive", icon: <Car className="h-6 w-6" />, link: "/category/automotive", color: "bg-red-100 text-red-700" },
    { name: "Gaming", icon: <Gamepad2 className="h-6 w-6" />, link: "/category/gaming", color: "bg-purple-100 text-purple-700" },
    { name: "Watches", icon: <Watch className="h-6 w-6" />, link: "/category/watches", color: "bg-yellow-100 text-yellow-700" },
    { name: "Sports", icon: <Camera className="h-6 w-6" />, link: "/category/sports", color: "bg-indigo-100 text-indigo-700" }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra",
      price: "₹1,24,999",
      originalPrice: "₹1,49,999",
      discount: "17% off",
      rating: 4.5,
      reviews: 2847,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Best Seller",
      features: ["256GB Storage", "12GB RAM", "200MP Camera"]
    },
    {
      id: 2,
      name: "Apple MacBook Air M2",
      price: "₹99,900",
      originalPrice: "₹1,19,900",
      discount: "17% off",
      rating: 4.8,
      reviews: 1523,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Limited Deal",
      features: ["13.6-inch Display", "8GB RAM", "256GB SSD"]
    },
    {
      id: 3,
      name: "Sony WH-1000XM5 Headphones",
      price: "₹24,990",
      originalPrice: "₹29,990",
      discount: "17% off",
      rating: 4.6,
      reviews: 982,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Amazon Choice",
      features: ["Noise Cancelling", "30Hr Battery", "Premium Sound"]
    },
    {
      id: 4,
      name: "Nike Air Max 270",
      price: "₹8,995",
      originalPrice: "₹12,995",
      discount: "31% off",
      rating: 4.3,
      reviews: 756,
      image: "https://images.pexels.com/photos/33175230/pexels-photo-33175230.jpeg",
      badge: "Fashion",
      features: ["Running Shoes", "Max Air Unit", "Breathable Mesh"]
    }
  ];

  const deals = [
    {
      id: 1,
      title: "Electronics Mega Sale",
      subtitle: "Up to 70% off on Smartphones & Laptops",
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      cta: "Shop Now"
    },
    {
      id: 2,
      title: "Fashion Fest",
      subtitle: "Min 50% off on Clothing & Accessories",
      image: "https://images.pexels.com/photos/33175230/pexels-photo-33175230.jpeg",
      cta: "Explore"
    },
    {
      id: 3,
      title: "Home Essentials",
      subtitle: "Kitchen & Home Appliances",
      image: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
      cta: "Discover"
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <Layout>
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white">
        <div className="container py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Find Everything You Need
            </h1>
            <p className="text-white/90">Millions of products, incredible prices, fast delivery</p>
          </div>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for products, brands and more..."
                  className="pl-12 py-3 text-lg border-0 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" variant="secondary" className="px-8">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Top Categories */}
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link to="/categories" className="text-primary hover:underline flex items-center">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <Link key={index} to={category.link}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-full ${category.color} mb-3 group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Deals Banner */}
      <div className="container py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">{deal.title}</h3>
                  <p className="text-white/90 mb-3">{deal.subtitle}</p>
                  <Button variant="secondary" size="sm">
                    {deal.cta}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Best Sellers</h2>
          <Link to="/products" className="text-primary hover:underline flex items-center">
            View All Products
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 left-2" variant="secondary">
                  {product.badge}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                  {product.discount}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">({product.reviews})</span>
                </div>

                <div className="mb-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-bold">{product.price}</span>
                    <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm">
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-muted/30">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Truck className="h-8 w-8" />, title: "Free Delivery", desc: "On orders above ₹499" },
              { icon: <Shield className="h-8 w-8" />, title: "Secure Payment", desc: "100% secure transactions" },
              { icon: <RotateCcw className="h-8 w-8" />, title: "Easy Returns", desc: "7-day return policy" },
              { icon: <Phone className="h-8 w-8" />, title: "24/7 Support", desc: "Dedicated customer service" }
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="container py-8">
        <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Today's Deals", icon: <Percent className="h-5 w-5" />, link: "/deals" },
            { title: "Lightning Deals", icon: <Zap className="h-5 w-5" />, link: "/lightning-deals" },
            { title: "Trending", icon: <TrendingUp className="h-5 w-5" />, link: "/trending" },
            { title: "Gift Cards", icon: <Gift className="h-5 w-5" />, link: "/gift-cards" }
          ].map((item, index) => (
            <Link key={index} to={item.link}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-full bg-accent/10 text-accent mb-3 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-medium">{item.title}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
