import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
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
  TrendingUp,
  Package,
} from "lucide-react";

export default function EcommerceHome() {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Load products and categories from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setIsCategoriesLoading(true);

        // Load products
        const productsResponse = await fetch(
          "http://localhost:5000/api/products",
        );
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          const products = productsData.data || [];
          const featured = products
            .filter((p: any) => p.isFeatured)
            .slice(0, 4);
          const displayProducts =
            featured.length > 0 ? featured : products.slice(0, 4);
          setFeaturedProducts(displayProducts);
        }

        // Load categories
        const categoriesResponse = await fetch(
          "http://localhost:5000/api/products/categories",
        );
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          const categoryNames = categoriesData.data || [];
          setCategories(categoryNames);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setFeaturedProducts([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
        setIsCategoriesLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to get category icon and styling
  const getCategoryInfo = (categoryName: string) => {
    const categoryMap: { [key: string]: { icon: JSX.Element; color: string } } =
      {
        Electronics: {
          icon: <Laptop className="h-6 w-6" />,
          color: "bg-blue-100 text-blue-700",
        },
        Fashion: {
          icon: <Shirt className="h-6 w-6" />,
          color: "bg-pink-100 text-pink-700",
        },
        "Home & Kitchen": {
          icon: <Home className="h-6 w-6" />,
          color: "bg-green-100 text-green-700",
        },
        Books: {
          icon: <Book className="h-6 w-6" />,
          color: "bg-orange-100 text-orange-700",
        },
        "Sports & Outdoors": {
          icon: <Camera className="h-6 w-6" />,
          color: "bg-indigo-100 text-indigo-700",
        },
        "Health & Beauty": {
          icon: <Heart className="h-6 w-6" />,
          color: "bg-red-100 text-red-700",
        },
        "Toys & Games": {
          icon: <Gamepad2 className="h-6 w-6" />,
          color: "bg-purple-100 text-purple-700",
        },
        "Food & Beverage": {
          icon: <Gift className="h-6 w-6" />,
          color: "bg-yellow-100 text-yellow-700",
        },
        "Art & Crafts": {
          icon: <Package className="h-6 w-6" />,
          color: "bg-teal-100 text-teal-700",
        },
        Automotive: {
          icon: <Car className="h-6 w-6" />,
          color: "bg-gray-100 text-gray-700",
        },
        "Business & Industrial": {
          icon: <TrendingUp className="h-6 w-6" />,
          color: "bg-slate-100 text-slate-700",
        },
        Other: {
          icon: <Package className="h-6 w-6" />,
          color: "bg-neutral-100 text-neutral-700",
        },
      };

    return (
      categoryMap[categoryName] || {
        icon: <Package className="h-6 w-6" />,
        color: "bg-gray-100 text-gray-700",
      }
    );
  };

  const deals = [
    {
      id: 1,
      title: "Electronics Mega Sale",
      subtitle: "Up to 70% off on Smartphones & Laptops",
      image:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      cta: "Shop Now",
    },
    {
      id: 2,
      title: "Fashion Fest",
      subtitle: "Min 50% off on Clothing & Accessories",
      image:
        "https://images.pexels.com/photos/33175230/pexels-photo-33175230.jpeg",
      cta: "Explore",
    },
    {
      id: 3,
      title: "Home Essentials",
      subtitle: "Kitchen & Home Appliances",
      image:
        "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
      cta: "Discover",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Helper function to format product data for display
  const formatProductForDisplay = (product: any) => {
    const originalPrice = product.price * 1.2; // 20% markup for original price
    const discount = Math.round(
      ((originalPrice - product.price) / originalPrice) * 100,
    );

    return {
      id: product._id || product.id,
      name: product.name,
      price: `₹${product.price?.toLocaleString() || 0}`,
      originalPrice: `₹${Math.round(originalPrice).toLocaleString()}`,
      discount: `${discount}% off`,
      rating: product.averageRating || 4.0,
      reviews: product.reviewCount || Math.floor(Math.random() * 1000) + 100,
      image:
        product.images?.[0]?.url ||
        product.images?.[0] ||
        "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
      badge: product.isFeatured ? "Featured" : "New",
      features: product.specifications
        ?.slice(0, 3)
        .map((spec: any) => `${spec.name}: ${spec.value}`) || [
        "High Quality",
        "Fast Delivery",
        "Best Price",
      ],
    };
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
            <p className="text-white/90">
              Millions of products, incredible prices, fast delivery
            </p>
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
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                className="px-8"
              >
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
          {categories.length > 0 && (
            <Link
              to="/categories"
              className="text-primary hover:underline flex items-center"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {isCategoriesLoading ? (
            // Loading skeleton for categories
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-gray-200 mb-3 w-14 h-14"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : categories.length > 0 ? (
            categories.map((categoryName, index) => {
              const categoryInfo = getCategoryInfo(categoryName);
              return (
                <Link
                  key={index}
                  to={`/category/${categoryName.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`inline-flex p-4 rounded-full ${categoryInfo.color} mb-3 group-hover:scale-110 transition-transform`}
                      >
                        {categoryInfo.icon}
                      </div>
                      <h3 className="font-medium text-sm">{categoryName}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <div className="text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No categories available
                </h3>
                <p className="text-sm">
                  Categories will appear here when products are added
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deals Banner */}
      <div className="container py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card
              key={deal.id}
              className="overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
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
          <Link
            to="/products"
            className="text-primary hover:underline flex items-center"
          >
            View All Products
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                    <div className="w-20 h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => {
              const formattedProduct = formatProductForDisplay(product);
              return (
                <Link
                  key={formattedProduct.id}
                  to={`/product/${formattedProduct.id}`}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="relative">
                      <img
                        src={formattedProduct.image}
                        alt={formattedProduct.name}
                        className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge
                        className="absolute top-2 left-2"
                        variant="secondary"
                      >
                        {formattedProduct.badge}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {formattedProduct.discount}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {formattedProduct.name}
                      </h3>

                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < Math.floor(formattedProduct.rating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({formattedProduct.reviews})
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-lg font-bold">
                            {formattedProduct.price}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formattedProduct.originalPrice}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {formattedProduct.features.map((feature, i) => (
                            <li key={i} className="flex items-center">
                              <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          className="flex-1"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const cartItem = {
                              id: product._id || product.id,
                              name: product.name,
                              price: product.price,
                              originalPrice: product.originalPrice,
                              image:
                                product.images?.[0] ||
                                "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
                              vendor: product.vendor || "Unknown Vendor",
                              store: product.store || "Unknown Store",
                              inStock: product.inStock !== false,
                              maxQuantity: 10,
                            };
                            addToCart(cartItem);
                            toast({
                              title: "Added to Cart!",
                              description: `${product.name} has been added to your cart`,
                            });
                          }}
                        >
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
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Package className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No products available
                </h3>
                <p className="text-sm">Check back later for new products!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-muted/30">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                icon: <Truck className="h-8 w-8" />,
                title: "Free Delivery",
                desc: "On orders above ₹499",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Secure Payment",
                desc: "100% secure transactions",
              },
              {
                icon: <RotateCcw className="h-8 w-8" />,
                title: "Easy Returns",
                desc: "7-day return policy",
              },
              {
                icon: <Phone className="h-8 w-8" />,
                title: "24/7 Support",
                desc: "Dedicated customer service",
              },
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
            {
              title: "Today's Deals",
              icon: <Percent className="h-5 w-5" />,
              link: "/deals",
            },
            {
              title: "Lightning Deals",
              icon: <Zap className="h-5 w-5" />,
              link: "/lightning-deals",
            },
            {
              title: "Trending",
              icon: <TrendingUp className="h-5 w-5" />,
              link: "/trending",
            },
            {
              title: "Gift Cards",
              icon: <Gift className="h-5 w-5" />,
              link: "/gift-cards",
            },
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
