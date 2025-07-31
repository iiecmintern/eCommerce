import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Star,
  Heart,
  ShoppingCart,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  Package,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function CategoryPage() {
  const { category } = useParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popularity");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);

  // Category data mapping
  const categoryData: Record<string, any> = {
    electronics: {
      title: "Electronics",
      description: "Latest smartphones, laptops, and gadgets",
      banner:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
    },
    fashion: {
      title: "Fashion",
      description: "Trendy clothing and accessories",
      banner:
        "https://images.pexels.com/photos/33175230/pexels-photo-33175230.jpeg",
    },
    "home-and-kitchen": {
      title: "Home & Kitchen",
      description: "Everything for your home",
      banner:
        "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
    },
    "sports-and-outdoors": {
      title: "Sports & Outdoors",
      description: "Fitness equipment and outdoor gear",
      banner:
        "https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg",
    },
    "health-and-beauty": {
      title: "Health & Beauty",
      description: "Health and beauty products",
      banner:
        "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg",
    },
    books: {
      title: "Books",
      description: "Best-selling books and literature",
      banner:
        "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg",
    },
    beauty: {
      title: "Beauty & Personal Care",
      description: "Cosmetics and personal care products",
      banner:
        "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg",
    },
  };

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra",
      price: "₹1,24,999",
      originalPrice: "₹1,49,999",
      discount: "17% off",
      rating: 4.5,
      reviews: 2847,
      image:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Best Seller",
      inStock: true,
      freeDelivery: true,
    },
    {
      id: 2,
      name: "Apple iPhone 15 Pro Max",
      price: "₹1,59,900",
      originalPrice: "₹1,79,900",
      discount: "11% off",
      rating: 4.8,
      reviews: 1523,
      image:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Premium",
      inStock: true,
      freeDelivery: true,
    },
    {
      id: 3,
      name: "OnePlus 12 5G",
      price: "₹69,999",
      originalPrice: "₹79,999",
      discount: "13% off",
      rating: 4.6,
      reviews: 892,
      image:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "New Launch",
      inStock: true,
      freeDelivery: true,
    },
    {
      id: 4,
      name: "MacBook Pro M3",
      price: "₹1,99,900",
      originalPrice: "₹2,19,900",
      discount: "9% off",
      rating: 4.9,
      reviews: 567,
      image:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Premium",
      inStock: true,
      freeDelivery: true,
    },
    {
      id: 5,
      name: "Dell XPS 13",
      price: "₹1,49,999",
      originalPrice: "₹1,69,999",
      discount: "12% off",
      rating: 4.4,
      reviews: 234,
      image:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Popular",
      inStock: false,
      freeDelivery: true,
    },
    {
      id: 6,
      name: "Sony WH-1000XM5",
      price: "₹29,999",
      originalPrice: "₹34,999",
      discount: "14% off",
      rating: 4.7,
      reviews: 1234,
      image:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Best Seller",
      inStock: true,
      freeDelivery: true,
    },
  ];

  // Load category data and products
  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Set category info
        const currentCategory = category || "electronics";
        const info = categoryData[currentCategory];

        if (!info) {
          throw new Error(`Category "${currentCategory}" not found`);
        }

        setCategoryInfo(info);

        // Fetch real products for this category
        try {
          const response = await fetch(
            `http://localhost:5000/api/products?category=${encodeURIComponent(info.title)}`,
          );

          if (response.ok) {
            const data = await response.json();
            const categoryProducts = data.data || [];

            // Transform products to match the expected format
            const formattedProducts = categoryProducts.map((product: any) => ({
              id: product.id || product._id,
              name: product.name,
              price: `₹${product.finalPrice || product.price}`,
              originalPrice: product.compareAtPrice
                ? `₹${product.compareAtPrice}`
                : undefined,
              discount: product.discountPercentage
                ? `${product.discountPercentage}% off`
                : undefined,
              rating: product.averageRating || 0,
              reviews: product.totalReviews || 0,
              image:
                product.images?.[0]?.url ||
                "https://via.placeholder.com/400x400?text=No+Image",
              badge: product.isFeatured
                ? "Featured"
                : product.isBestSeller
                  ? "Best Seller"
                  : undefined,
              inStock: product.inStock || product.stockStatus === "in_stock",
              freeDelivery: true, // Default to true for now
            }));

            setProducts(formattedProducts);
          } else {
            console.warn("Failed to fetch category products, using mock data");
            setProducts(mockProducts);
          }
        } catch (apiError) {
          console.warn("API error, using mock data:", apiError);
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error("Error loading category data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load category data",
        );
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [category]);

  // Retry loading data
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Trigger useEffect by updating a dependency
    setProducts([]);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading category...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle no category info
  if (!categoryInfo) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
            <p className="text-muted-foreground">
              The requested category could not be found.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Category Header */}
        <div className="relative h-64 rounded-lg overflow-hidden">
          <img
            src={categoryInfo.banner}
            alt={categoryInfo.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Error loading banner image:", e);
              // Fallback to a default image or placeholder
              e.currentTarget.src =
                "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg";
            }}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-2">{categoryInfo.title}</h1>
              <p className="text-lg">{categoryInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground">
              No products available in this category at the moment.
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {products.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      console.error("Error loading product image:", e);
                      // Fallback to a default image
                      e.currentTarget.src =
                        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg";
                    }}
                  />
                  {product.badge && (
                    <Badge
                      className="absolute top-2 left-2"
                      variant="secondary"
                    >
                      {product.badge}
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold">{product.price}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {product.discount}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button className="flex-1 mr-2" disabled={!product.inStock}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                  {product.freeDelivery && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Free Delivery
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
