import { useState } from "react";
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
  SlidersHorizontal
} from "lucide-react";

export default function CategoryPage() {
  const { category } = useParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');

  // Category data mapping
  const categoryData: Record<string, any> = {
    electronics: {
      title: "Electronics",
      description: "Latest smartphones, laptops, and gadgets",
      banner: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg"
    },
    fashion: {
      title: "Fashion",
      description: "Trendy clothing and accessories",
      banner: "https://images.pexels.com/photos/33175230/pexels-photo-33175230.jpeg"
    },
    home: {
      title: "Home & Kitchen",
      description: "Everything for your home",
      banner: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg"
    },
    books: {
      title: "Books",
      description: "Knowledge and entertainment",
      banner: "https://images.pexels.com/photos/33156848/pexels-photo-33156848.jpeg"
    }
  };

  const currentCategory = categoryData[category || 'electronics'] || categoryData.electronics;

  // Mock products for category
  const products = [
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
      inStock: true,
      freeDelivery: true
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
      inStock: true,
      freeDelivery: true
    },
    {
      id: 3,
      name: "Sony WH-1000XM5",
      price: "₹24,990",
      originalPrice: "₹29,990",
      discount: "17% off",
      rating: 4.6,
      reviews: 982,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Amazon Choice",
      inStock: true,
      freeDelivery: true
    },
    {
      id: 4,
      name: "Dell XPS 13 Laptop",
      price: "₹89,990",
      originalPrice: "₹99,990",
      discount: "10% off",
      rating: 4.4,
      reviews: 756,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Premium",
      inStock: true,
      freeDelivery: true
    },
    {
      id: 5,
      name: "iPad Pro 12.9-inch",
      price: "₹1,12,900",
      originalPrice: "₹1,29,900",
      discount: "13% off",
      rating: 4.7,
      reviews: 1245,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "New",
      inStock: true,
      freeDelivery: true
    },
    {
      id: 6,
      name: "Canon EOS R5 Camera",
      price: "₹3,49,999",
      originalPrice: "₹3,89,999",
      discount: "10% off",
      rating: 4.9,
      reviews: 432,
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      badge: "Professional",
      inStock: false,
      freeDelivery: true
    }
  ];

  const filters = [
    {
      title: "Price Range",
      options: ["Under ₹10,000", "₹10,000 - ₹25,000", "₹25,000 - ₹50,000", "₹50,000 - ₹1,00,000", "Above ₹1,00,000"]
    },
    {
      title: "Brand",
      options: ["Samsung", "Apple", "Sony", "Dell", "Canon", "OnePlus"]
    },
    {
      title: "Customer Rating",
      options: ["4★ & above", "3★ & above", "2★ & above", "1★ & above"]
    },
    {
      title: "Availability",
      options: ["In Stock", "Free Delivery", "Cash on Delivery", "Discounted"]
    }
  ];

  return (
    <Layout>
      {/* Category Banner */}
      <div className="relative h-64 bg-gradient-to-r from-primary/20 to-accent/20">
        <img 
          src={currentCategory.banner} 
          alt={currentCategory.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">{currentCategory.title}</h1>
            <p className="text-lg text-muted-foreground">{currentCategory.description}</p>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Category Controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{currentCategory.title} Products</h2>
            <p className="text-muted-foreground">
              Showing {products.length} results
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

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {products.map((product) => (
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
                        
                        <div className="flex items-center mb-3">
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
