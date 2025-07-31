import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Star,
  Heart,
  ShoppingCart,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  AlertCircle,
  RefreshCw,
  Package,
} from "lucide-react";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Mock search results - in real app, this would come from API
  const mockSearchResults = [
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra Smartphone",
      price: "₹1,24,999",
      originalPrice: "₹1,49,999",
      discount: "17% off",
      rating: 4.5,
      reviews: 2847,
      image:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Best Seller",
      description:
        "Latest flagship smartphone with advanced AI features and stunning camera quality.",
      features: [
        "256GB Storage",
        "12GB RAM",
        "200MP Camera",
        "5000mAh Battery",
      ],
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
      description:
        "Revolutionary titanium design with A17 Pro chip and advanced camera system.",
      features: ["512GB Storage", "8GB RAM", "48MP Camera", "USB-C"],
      inStock: true,
      freeDelivery: true,
    },
    {
      id: 3,
      name: "OnePlus 12 5G Smartphone",
      price: "₹69,999",
      originalPrice: "₹79,999",
      discount: "13% off",
      rating: 4.6,
      reviews: 892,
      image:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "New Launch",
      description:
        "Flagship killer with Hasselblad camera and blazing fast performance.",
      features: ["256GB Storage", "16GB RAM", "50MP Camera", "100W Charging"],
      inStock: true,
      freeDelivery: true,
    },
    {
      id: 4,
      name: "MacBook Pro M3 Max",
      price: "₹3,49,900",
      originalPrice: "₹3,99,900",
      discount: "13% off",
      rating: 4.9,
      reviews: 567,
      image:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Premium",
      description:
        "Most powerful MacBook Pro with M3 Max chip for professionals.",
      features: ["1TB SSD", "32GB RAM", "14-inch Display", "22-hour Battery"],
      inStock: true,
      freeDelivery: true,
    },
    {
      id: 5,
      name: "Sony WH-1000XM5 Wireless Headphones",
      price: "₹29,999",
      originalPrice: "₹34,999",
      discount: "14% off",
      rating: 4.7,
      reviews: 1234,
      image:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Best Seller",
      description:
        "Industry-leading noise cancellation with exceptional sound quality.",
      features: [
        "30-hour Battery",
        "Quick Charge",
        "Touch Controls",
        "Multi-device",
      ],
      inStock: true,
      freeDelivery: true,
    },
    {
      id: 6,
      name: "Dell XPS 13 Plus Laptop",
      price: "₹1,49,999",
      originalPrice: "₹1,69,999",
      discount: "12% off",
      rating: 4.4,
      reviews: 234,
      image:
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Popular",
      description:
        "Ultra-slim premium laptop with stunning InfinityEdge display.",
      features: ["512GB SSD", "16GB RAM", "13.4-inch 4K Display", "Intel i7"],
      inStock: false,
      freeDelivery: true,
    },
  ];

  // Load search results
  useEffect(() => {
    const performSearch = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!query.trim()) {
          setSearchResults([]);
          return;
        }

        // Simulate search filtering
        const filteredResults = mockSearchResults.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()),
        );

        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Error performing search:", error);
        setError(
          error instanceof Error ? error.message : "Failed to perform search",
        );
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  // Retry search
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Trigger useEffect by updating a dependency
    setSearchResults([]);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">
              Searching for "{query}"...
            </p>
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

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Search Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-lg text-muted-foreground mb-6">
            {query ? `Results for "${query}"` : "Enter a search term"}
          </p>

          {/* Search Input */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                defaultValue={query}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(target.value.trim())}`;
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {query && (
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
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
        )}

        {/* No Results */}
        {query && searchResults.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any products matching "{query}"
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Try checking your spelling or using different keywords</p>
              <p>Use more general terms or browse our categories</p>
            </div>
          </div>
        )}

        {/* Search Results Grid */}
        {searchResults.length > 0 && (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {searchResults.map((product) => (
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
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
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

        {/* Load More */}
        {searchResults.length > 0 && (
          <div className="text-center pt-8">
            <Button variant="outline" className="px-8">
              Load More Results
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
