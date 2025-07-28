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
  Share,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Check,
  MapPin,
  Clock
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("256GB");

  // Mock product data
  const product = {
    id: 1,
    name: "Samsung Galaxy S24 Ultra",
    price: "₹1,24,999",
    originalPrice: "₹1,49,999",
    discount: "17% off",
    rating: 4.5,
    reviews: 2847,
    images: [
      "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg"
    ],
    badge: "Best Seller",
    inStock: true,
    description: "Experience the pinnacle of smartphone innovation with the Samsung Galaxy S24 Ultra. Featuring an advanced camera system, powerful performance, and stunning display.",
    features: [
      "6.8-inch Dynamic AMOLED 2X Display",
      "200MP + 50MP + 12MP + 10MP Camera System",
      "Snapdragon 8 Gen 3 Processor",
      "5000mAh Battery with 45W Fast Charging",
      "S Pen Included",
      "IP68 Water Resistance"
    ],
    specifications: {
      "Display": "6.8-inch Dynamic AMOLED 2X, 3120 x 1440 pixels",
      "Processor": "Snapdragon 8 Gen 3",
      "RAM": "12GB",
      "Storage": "256GB/512GB/1TB",
      "Camera": "200MP Main, 50MP Telephoto, 12MP Ultra-wide, 10MP Front",
      "Battery": "5000mAh",
      "OS": "Android 14 with One UI 6.1"
    },
    variants: ["256GB", "512GB", "1TB"],
    colors: ["Titanium Black", "Titanium Gray", "Titanium Violet", "Titanium Yellow"],
    seller: "Samsung Official Store",
    warranty: "1 Year Manufacturer Warranty",
    deliveryInfo: {
      freeDelivery: true,
      estimatedDays: "2-3",
      codAvailable: true
    }
  };

  const reviews = [
    {
      id: 1,
      user: "Rahul S.",
      rating: 5,
      date: "2 days ago",
      comment: "Excellent phone! Camera quality is outstanding and performance is smooth.",
      verified: true
    },
    {
      id: 2,
      user: "Priya M.",
      rating: 4,
      date: "1 week ago", 
      comment: "Good build quality and features. Battery life could be better.",
      verified: true
    },
    {
      id: 3,
      user: "Amit K.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Best smartphone I've used! The S Pen is really useful.",
      verified: true
    }
  ];

  const relatedProducts = [
    {
      id: 2,
      name: "Samsung Galaxy S24+",
      price: "₹99,999",
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      rating: 4.4
    },
    {
      id: 3,
      name: "Samsung Galaxy Buds2 Pro",
      price: "₹17,999",
      image: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      rating: 4.6
    }
  ];

  return (
    <Layout>
      <div className="container py-6">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary">{product.badge}</Badge>
              </div>
              <div className="absolute top-4 right-4 space-y-2">
                <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-2 font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-primary">{product.price}</span>
                <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                <Badge variant="destructive">{product.discount}</Badge>
              </div>
              <p className="text-sm text-green-600">You save ₹25,000</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Storage</h3>
                <div className="flex space-x-2">
                  {product.variants.map((variant) => (
                    <Button
                      key={variant}
                      variant={selectedVariant === variant ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <Button key={color} variant="outline" size="sm">
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-green-600 font-medium">In Stock</span>
              </div>

              <div className="flex space-x-3">
                <Button className="flex-1" size="lg">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Free Delivery</p>
                      <p className="text-sm text-muted-foreground">Estimated delivery in {product.deliveryInfo.estimatedDays} days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Easy Returns</p>
                      <p className="text-sm text-muted-foreground">7-day return policy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">{product.warranty}</p>
                      <p className="text-sm text-muted-foreground">Official warranty included</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Product Description</h2>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                
                <h3 className="font-semibold mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Specifications</h2>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{review.user}</span>
                          {review.verified && (
                            <Badge variant="outline" className="text-green-600">Verified</Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Sold by</h3>
                <p className="font-medium">{product.seller}</p>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm">4.8 seller rating</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Products */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">You might also like</h3>
                <div className="space-y-4">
                  {relatedProducts.map((relatedProduct) => (
                    <div key={relatedProduct.id} className="flex space-x-3">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{relatedProduct.name}</h4>
                        <p className="text-sm font-bold">{relatedProduct.price}</p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="ml-1 text-xs">{relatedProduct.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
