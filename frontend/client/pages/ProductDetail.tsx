import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { VariantSelector } from "@/components/VariantSelector";
import { apiService } from "@/services/api";
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
  Clock,
  Loader2,
} from "lucide-react";

interface VariantOption {
  type: string;
  name: string;
  value: string;
  hexCode?: string;
  measurements?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
}

interface Variant {
  combination: string;
  options: VariantOption[];
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  isActive: boolean;
  images?: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
}

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  hasVariants: boolean;
  variantTypes: string[];
  variantOptions: Record<string, string[]>;
  variants: Variant[];
  vendor: {
    firstName: string;
    lastName: string;
    company?: string;
  };
  store: {
    name: string;
  };
  averageRating: number;
  totalReviews: number;
  stockQuantity: number;
  inStock: boolean;
  specifications: Array<{
    name: string;
    value: string;
  }>;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await apiService.request(`/products/${id}/variants`);

        if (response.success) {
          const productData = response.data.product;
          const variants = response.data.variants;

          // Set default variant if available
          const defaultVariant =
            variants.find((v) => v.isActive)?.combination || null;

          setProduct({
            ...productData,
            variants,
            id: productData.id,
          });
          setSelectedVariant(defaultVariant);
        } else {
          setError("Failed to load product");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Get current variant data
  const currentVariant = product?.variants.find(
    (v) => v.combination === selectedVariant,
  );
  const currentPrice = currentVariant?.price || product?.price || 0;
  const currentComparePrice =
    currentVariant?.compareAtPrice || product?.compareAtPrice;
  const currentStock =
    currentVariant?.stockQuantity || product?.stockQuantity || 0;
  const currentImages = currentVariant?.images || product?.images || [];
  const isInStock = currentStock > 0;

  // Calculate discount percentage
  const discountPercentage =
    currentComparePrice && currentComparePrice > currentPrice
      ? Math.round(
          ((currentComparePrice - currentPrice) / currentComparePrice) * 100,
        )
      : 0;

  // Handle variant change
  const handleVariantChange = (combination: string) => {
    setSelectedVariant(combination);
    setSelectedImage(0); // Reset to first image when variant changes
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product || !isInStock) return;

    const cartItem = {
      id: `${product.id}-${selectedVariant || "default"}`,
      name: product.name,
      price: currentPrice,
      originalPrice: currentComparePrice || currentPrice,
      image: currentImages[0]?.url || product.images[0]?.url || "",
      vendor:
        product.vendor.company ||
        `${product.vendor.firstName} ${product.vendor.lastName}`,
      store: product.store.name,
      inStock: isInStock,
      maxQuantity: currentStock,
      variant: selectedVariant,
      variantCombination: currentVariant?.combination,
    };

    addToCart(cartItem);
    toast({
      title: "Added to Cart!",
      description: `${product.name}${selectedVariant ? ` (${selectedVariant})` : ""} has been added to your cart`,
    });
  };

  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Product Not Found
            </h1>
            <p className="text-muted-foreground mt-2">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Button onClick={() => navigate("/")} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={
                  currentImages[selectedImage]?.url ||
                  product.images[selectedImage]?.url
                }
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive">{discountPercentage}% off</Badge>
                </div>
              )}
              <div className="absolute top-4 right-4 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/80 hover:bg-white"
                >
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto">
              {(currentImages.length > 0 ? currentImages : product.images).map(
                (image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ),
              )}
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
                      className={`h-4 w-4 ${i < Math.floor(product.averageRating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 font-medium">
                    {product.averageRating}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  ({product.totalReviews} reviews)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-primary">
                  ₹{currentPrice.toLocaleString()}
                </span>
                {currentComparePrice && currentComparePrice > currentPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{currentComparePrice.toLocaleString()}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="destructive">{discountPercentage}% off</Badge>
                )}
              </div>
              {discountPercentage > 0 && (
                <p className="text-sm text-green-600">
                  You save ₹
                  {((currentComparePrice || 0) - currentPrice).toLocaleString()}
                </p>
              )}
            </div>

            {/* Variant Selector */}
            {product.hasVariants && (
              <VariantSelector
                variants={product.variants}
                variantTypes={product.variantTypes}
                variantOptions={product.variantOptions}
                selectedVariant={selectedVariant}
                onVariantChange={handleVariantChange}
              />
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= currentStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span
                  className={`font-medium ${isInStock ? "text-green-600" : "text-red-600"}`}
                >
                  {isInStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="flex space-x-3">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isInCart(`${product.id}-${selectedVariant || "default"}`)
                    ? `In Cart (${getItemQuantity(`${product.id}-${selectedVariant || "default"}`)})`
                    : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={!isInStock}
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-2 border-b"
                    >
                      <span className="font-medium">{spec.name}</span>
                      <span className="text-muted-foreground">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Free Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Estimated delivery in 2-3 days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <RotateCcw className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Easy Returns</p>
                      <p className="text-sm text-muted-foreground">
                        7-day return policy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Secure Payment</p>
                      <p className="text-sm text-muted-foreground">
                        100% secure checkout
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Reviews coming soon...</p>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Related products coming soon...
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
