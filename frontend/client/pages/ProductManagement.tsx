import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  Grid,
  List,
  CheckCircle,
  Clock,
  Star,
  Package,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stockQuantity: number;
  status: "draft" | "published" | "archived";
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
}

const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Books",
  "Sports & Outdoors",
  "Health & Beauty",
  "Toys & Games",
  "Food & Beverage",
  "Art & Crafts",
  "Automotive",
  "Business & Industrial",
  "Other",
];

export default function ProductManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    sku: "",
    stockQuantity: 0,
    status: "draft",
    images: [],
    isActive: true,
    isFeatured: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load products from localStorage on component mount
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("vendor_products");
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
    // Default products if none exist
    return [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        description:
          "High-quality wireless headphones with noise cancellation and long battery life.",
        price: 2499,
        category: "Electronics",
        sku: "WH-BT-001",
        stockQuantity: 45,
        status: "published",
        images: [
          "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
        ],
        isActive: true,
        isFeatured: true,
      },
      {
        id: "2",
        name: "Smart Fitness Watch",
        description:
          "Advanced fitness tracking watch with heart rate monitoring and GPS.",
        price: 8999,
        category: "Electronics",
        sku: "SFW-001",
        stockQuantity: 23,
        status: "published",
        images: [
          "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
        ],
        isActive: true,
        isFeatured: false,
      },
    ];
  });

  // Save products to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem("vendor_products", JSON.stringify(products));
    // Dispatch custom event to notify sidebar about product updates
    window.dispatchEvent(new CustomEvent("productUpdated"));
  }, [products]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = "Product name is required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.sku?.trim()) newErrors.sku = "SKU is required";
    if (formData.stockQuantity === undefined || formData.stockQuantity < 0) {
      newErrors.stockQuantity = "Valid stock quantity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isEditing && editingId) {
        // Update existing product
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingId ? ({ ...formData, id: p.id } as Product) : p,
          ),
        );
        toast({
          title: "Product updated successfully!",
          description: "Your product has been updated and is now live.",
        });
      } else {
        // Create new product
        const newProduct: Product = {
          ...formData,
          id: Date.now().toString(),
        } as Product;

        setProducts((prev) => [...prev, newProduct]);
        toast({
          title: "Product created successfully!",
          description: "Your new product has been added to your store.",
        });
      }

      // Reset form and state
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      sku: "",
      stockQuantity: 0,
      status: "draft",
      images: [],
      isActive: true,
      isFeatured: false,
    });
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
    setErrors({});
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
  };

  // Image handling functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === files.length) {
              setFormData((prev) => ({
                ...prev,
                images: [...(prev.images || []), ...newImages],
              }));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  const addSampleImage = () => {
    const sampleImages = [
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
      "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
      "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
    ];
    const randomImage =
      sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), randomImage],
    }));
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({
        title: "Product deleted",
        description: "The product has been removed from your store.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || product.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4" />;
      case "draft":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/vendor")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Product Management</h1>
              <p className="text-muted-foreground">
                Add, edit, and manage your products
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {showForm ? (
          // Add/Edit Product Form
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Edit className="h-5 w-5" />
                    <span>Edit Product: {formData.name}</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Add New Product</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter product name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Product description"
                        rows={4}
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.00"
                        className={errors.price ? "border-red-500" : ""}
                      />
                      {errors.price && (
                        <p className="text-sm text-red-500">{errors.price}</p>
                      )}
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <Label>Product Images</Label>
                      <div className="space-y-4">
                        {/* Image Upload Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Images
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addSampleImage}
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Add Sample Image
                          </Button>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />

                        {/* Display Images */}
                        {formData.images && formData.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger
                          className={errors.category ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-500">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        placeholder="Stock Keeping Unit"
                        className={errors.sku ? "border-red-500" : ""}
                      />
                      {errors.sku && (
                        <p className="text-sm text-red-500">{errors.sku}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                      <Input
                        id="stockQuantity"
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stockQuantity: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="Available stock"
                        className={errors.stockQuantity ? "border-red-500" : ""}
                      />
                      {errors.stockQuantity && (
                        <p className="text-sm text-red-500">
                          {errors.stockQuantity}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            isActive: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="isActive">Active Product</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            isFeatured: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="isFeatured">Featured Product</Label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        {isEditing ? "Updating..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isEditing ? "Update Product" : "Save Product"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          // Product List View
          <div className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search products by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
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
              </CardContent>
            </Card>

            {/* Products Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusColor(product.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(product.status)}
                            <span className="capitalize">{product.status}</span>
                          </div>
                        </Badge>
                      </div>
                      {product.isFeatured && (
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">
                            ₹{product.price.toLocaleString()}
                          </span>
                          <div className="text-sm text-muted-foreground">
                            {product.stockQuantity} in stock
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>SKU: {product.sku}</span>
                          <span>{product.category}</span>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">Product</th>
                          <th className="text-left p-4 font-medium">SKU</th>
                          <th className="text-left p-4 font-medium">
                            Category
                          </th>
                          <th className="text-left p-4 font-medium">Price</th>
                          <th className="text-left p-4 font-medium">Stock</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="border-b">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm">{product.sku}</td>
                            <td className="p-4 text-sm">{product.category}</td>
                            <td className="p-4">
                              <span className="font-medium">
                                ₹{product.price.toLocaleString()}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`text-sm ${product.stockQuantity > 10 ? "text-green-600" : product.stockQuantity > 0 ? "text-yellow-600" : "text-red-600"}`}
                              >
                                {product.stockQuantity} units
                              </span>
                            </td>
                            <td className="p-4">
                              <Badge className={getStatusColor(product.status)}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(product.status)}
                                  <span className="capitalize">
                                    {product.status}
                                  </span>
                                </div>
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(product.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {filteredProducts.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ||
                    selectedCategory !== "all" ||
                    selectedStatus !== "all"
                      ? "Try adjusting your search or filters"
                      : "Get started by adding your first product"}
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
