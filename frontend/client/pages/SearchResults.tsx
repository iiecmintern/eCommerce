import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  ArrowUpDown
} from "lucide-react";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');

  // Mock search results - in real app, this would come from API
  const searchResults = [
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra Smartphone",
      price: "₹1,24,999",
      originalPrice: "₹1,49,999",
      discount: "17% off",
      rating: 4.5,
      reviews: 2847,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Best Seller",
      description: "Latest flagship smartphone with advanced AI features and stunning camera quality.",
      features: ["256GB Storage", "12GB RAM", "200MP Camera", "5000mAh Battery"],
      inStock: true,
      freeDelivery: true
    },
    {
      id: 2,
      name: "Apple iPhone 15 Pro Max",
      price: "₹1,59,900",
      originalPrice: "₹1,79,900",
      discount: "11% off",
      rating: 4.8,
      reviews: 1523,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Premium",
      description: "Revolutionary titanium design with A17 Pro chip and advanced camera system.",
      features: ["512GB Storage", "8GB RAM", "48MP Camera", "USB-C"],
      inStock: true,
      freeDelivery: true
    },
    {
      id: 3,
      name: "OnePlus 12 5G Smartphone",
      price: "₹64,999",
      originalPrice: "₹74,999",
      discount: "13% off",
      rating: 4.4,
      reviews: 982,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Great Value",
      description: "Flagship performance with OxygenOS and premium build quality.",
      features: ["256GB Storage", "12GB RAM", "50MP Camera", "100W Charging"],
      inStock: true,
      freeDelivery: true
    },
    {
      id: 4,
      name: "Xiaomi 14 Ultra Photography Phone",
      price: "₹99,999",
      originalPrice: "₹1,09,999",
      discount: "9% off",
      rating: 4.6,
      reviews: 756,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Camera Pro",
      description: "Professional photography capabilities with Leica optics.",
      features: ["512GB Storage", "16GB RAM", "50MP Leica Camera", "90W Charging"],
      inStock: false,
      freeDelivery: true
    }
  ];

  const filters = [
    {
      title: "Price Range",
      options: ["Under ₹25,000", "₹25,000 - ₹50,000", "₹50,000 - ₹1,00,000", "Above ₹1,00,000"]
    },
    {
      title: "Brand",
      options: ["Samsung", "Apple", "OnePlus", "Xiaomi", "Google", "Sony"]
    },
    {
      title: "Customer Rating",
      options: ["4★ & above", "3★ & above", "2★ & above", "1★ & above"]
    },
    {
      title: "Features",
      options: ["Free Delivery", "Cash on Delivery", "In Stock", "Discounted"]
    }
  ];

  return (
    <Layout>
      <div className="container py-6">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for products..."
                className="pl-10"
                defaultValue={query}
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Search Results</h1>
              <p className="text-muted-foreground">
                Showing {searchResults.length} results for "{query}"
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex rounded-lg border">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Sort Dropdown */}
              <select 
                className="px-3 py-2 border rounded-lg text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {filters.map((filter, index) => (
                    <div key={index}>
                      <h4 className="font-medium mb-3">{filter.title}</h4>
                      <div className="space-y-2">
                        {filter.options.map((option, i) => (
                          <label key={i} className="flex items-center space-x-2 text-sm">
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

          {/* Search Results */}
          <div className="lg:col-span-3">
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {searchResults.map((product) => (
                <Card key={product.id} className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'overflow-hidden' : ''}`}>
                  {viewMode === 'grid' ? (
                    <>
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

                        <div className="flex items-center space-x-2 mb-4 text-xs">
                          {product.freeDelivery && (
                            <Badge variant="outline" className="text-green-600">Free Delivery</Badge>
                          )}
                          {product.inStock ? (
                            <Badge variant="outline" className="text-green-600">In Stock</Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600">Out of Stock</Badge>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Button className="flex-1" size="sm" disabled={!product.inStock}>
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
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <Badge className="absolute top-2 left-2" variant="secondary">
                          {product.badge}
                        </Badge>
                      </div>
                      
                      <div className="flex-1 ml-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground ml-2">({product.reviews} reviews)</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-xl font-bold">{product.price}</span>
                            <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                            <span className="text-sm text-green-600 font-medium">{product.discount}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs">
                            {product.freeDelivery && (
                              <Badge variant="outline" className="text-green-600">Free Delivery</Badge>
                            )}
                            {product.inStock ? (
                              <Badge variant="outline" className="text-green-600">In Stock</Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-600">Out of Stock</Badge>
                            )}
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" disabled={!product.inStock}>
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add to Cart
                            </Button>
                            <Button size="sm" disabled={!product.inStock}>
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

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
