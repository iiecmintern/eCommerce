import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Heart,
  ShoppingCart,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  Package,
} from "lucide-react";

export default function CategoryPage() {
  const { category } = useParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popularity");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    "home-&-kitchen": {
      title: "Home & Kitchen",
      description: "Everything for your home",
      banner:
        "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
    },
    "sports-&-outdoors": {
      title: "Sports & Outdoors",
      description: "Fitness and outdoor activities",
      banner:
        "https://images.pexels.com/photos/4056530/pexels-photo-4056530.jpeg",
    },
    "health-&-beauty": {
      title: "Health & Beauty",
      description: "Personal care and wellness",
      banner:
        "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg",
    },
    books: {
      title: "Books",
      description: "Knowledge and entertainment",
      banner:
        "https://images.pexels.com/photos/33156848/pexels-photo-33156848.jpeg",
    },
  };

  // Load products for the category
  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setIsLoading(true);

        // Convert URL parameter to proper category name
        const categoryParam = category || "electronics";
        let categoryName = categoryParam
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        // Handle special cases for category mapping
        const categoryMapping: { [key: string]: string } = {
          "home & kitchen": "Home & Kitchen",
          "sports & outdoors": "Sports & Outdoors",
          "health & beauty": "Health & Beauty",
          "toys & games": "Toys & Games",
          "food & beverage": "Food & Beverage",
          "art & crafts": "Art & Crafts",
          "business & industrial": "Business & Industrial",
        };

        const lowerCategory = categoryName.toLowerCase();
        if (categoryMapping[lowerCategory]) {
          categoryName = categoryMapping[lowerCategory];
        }

        // Get current category info
        const currentCategoryInfo =
          categoryData[categoryParam] || categoryData.electronics;

        // Set category info
        setCategoryInfo(currentCategoryInfo);

        // Fetch products for this category
        const response = await fetch(
          `http://localhost:5000/api/products?category=${encodeURIComponent(categoryName)}&limit=20`,
        );
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data || []);
        } else {
          console.error("Failed to fetch products for category:", categoryName);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error loading category products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryProducts();
  }, [category]); // Removed currentCategory from dependencies

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
        "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: product.isFeatured ? "Featured" : "New",
      inStock: product.stockQuantity > 0,
      freeDelivery: true,
      features: product.specifications
        ?.slice(0, 3)
        .map((spec: any) => `${spec.name}: ${spec.value}`) || [
        "High Quality",
        "Fast Delivery",
        "Best Price",
      ],
    };
  };

  const filters = [
    {
      title: "Price Range",
      options: [
        "Under ₹10,000",
        "₹10,000 - ₹25,000",
        "₹25,000 - ₹50,000",
        "₹50,000 - ₹1,00,000",
        "Above ₹1,00,000",
      ],
    },
    {
      title: "Brand",
      options: ["Samsung", "Apple", "Sony", "Dell", "Canon", "OnePlus"],
    },
    {
      title: "Customer Rating",
      options: ["4★ & above", "3★ & above", "2★ & above", "1★ & above"],
    },
    {
      title: "Availability",
      options: ["In Stock", "Free Delivery", "Cash on Delivery", "Discounted"],
    },
  ];

  return (
    <Layout>
      {/* Category Banner */}
      <div className="relative h-64 bg-gradient-to-r from-primary/20 to-accent/20">
        <img
          src={
            categoryInfo?.banner ||
            "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg"
          }
          alt={categoryInfo?.title || "Category"}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              {categoryInfo?.title || "Category"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {categoryInfo?.description || "Browse our products"}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Category Controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {categoryInfo?.title || "Category"} Products
            </h2>
            <p className="text-muted-foreground">
              Showing {products.length} results
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
                title="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Sort Dropdown */}
            <select
              className="px-3 py-2 border rounded-lg text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort products"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest First</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" title="Filter options">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {filters.map((filter, index) => (
                    <div key={index}>
                      <h4 className="font-medium mb-3">{filter.title}</h4>
                      <div className="space-y-2">
                        {filter.options.map((option, i) => (
                          <label
                            key={i}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <input type="checkbox" className="rounded" />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-6" variant="outline">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              // Loading skeleton
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {Array.from({ length: 6 }).map((_, index) => (
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
                ))}
              </div>
            ) : products.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {products.map((product) => {
                  const formattedProduct = formatProductForDisplay(product);
                  return (
                    <Card
                      key={formattedProduct.id}
                      className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${viewMode === "list" ? "overflow-hidden" : ""}`}
                    >
                      {viewMode === "grid" ? (
                        <>
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
                              title="Add to wishlist"
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

                            <div className="flex items-center space-x-2 mb-4 text-xs">
                              {formattedProduct.freeDelivery && (
                                <Badge
                                  variant="outline"
                                  className="text-green-600"
                                >
                                  Free Delivery
                                </Badge>
                              )}
                              {formattedProduct.inStock ? (
                                <Badge
                                  variant="outline"
                                  className="text-green-600"
                                >
                                  In Stock
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-red-600"
                                >
                                  Out of Stock
                                </Badge>
                              )}
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                className="flex-1"
                                size="sm"
                                disabled={!formattedProduct.inStock}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </>
                      ) : (
                        <div className="flex p-4">
                          <div className="relative w-48 h-36 flex-shrink-0">
                            <img
                              src={formattedProduct.image}
                              alt={formattedProduct.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Badge
                              className="absolute top-2 left-2"
                              variant="secondary"
                            >
                              {formattedProduct.badge}
                            </Badge>
                          </div>

                          <div className="flex-1 ml-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                                {formattedProduct.name}
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Add to wishlist"
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < Math.floor(formattedProduct.rating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({formattedProduct.reviews} reviews)
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-baseline space-x-2">
                                <span className="text-xl font-bold">
                                  {formattedProduct.price}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {formattedProduct.originalPrice}
                                </span>
                                <span className="text-sm text-green-600 font-medium">
                                  {formattedProduct.discount}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs">
                                {formattedProduct.freeDelivery && (
                                  <Badge
                                    variant="outline"
                                    className="text-green-600"
                                  >
                                    Free Delivery
                                  </Badge>
                                )}
                                {formattedProduct.inStock ? (
                                  <Badge
                                    variant="outline"
                                    className="text-green-600"
                                  >
                                    In Stock
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-red-600"
                                  >
                                    Out of Stock
                                  </Badge>
                                )}
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={!formattedProduct.inStock}
                                >
                                  <ShoppingCart className="h-3 w-3 mr-1" />
                                  Add to Cart
                                </Button>
                                <Button
                                  size="sm"
                                  disabled={!formattedProduct.inStock}
                                >
                                  Buy Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Package className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No products found in this category
                  </h3>
                  <p className="text-sm">
                    Try browsing other categories or check back later for new
                    products!
                  </p>
                </div>
              </div>
            )}

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" className="px-8">
                Load More Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
