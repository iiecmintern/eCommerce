import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  Package,
  DollarSign,
  Hash,
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
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  sku: string;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  isActive: boolean;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
}

interface VariantManagerProps {
  productId: string;
  variants: Variant[];
  variantTypes: string[];
  onVariantsUpdate: (variants: Variant[]) => void;
}

const VARIANT_TYPES = [
  { value: "color", label: "Color" },
  { value: "size", label: "Size" },
  { value: "material", label: "Material" },
  { value: "storage", label: "Storage" },
  { value: "ram", label: "RAM" },
  { value: "style", label: "Style" },
  { value: "other", label: "Other" },
];

export function VariantManager({
  productId,
  variants,
  variantTypes,
  onVariantsUpdate,
}: VariantManagerProps) {
  const { toast } = useToast();
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [newVariant, setNewVariant] = useState<Partial<Variant>>({
    options: [],
    price: 0,
    stockQuantity: 0,
    lowStockThreshold: 5,
    isActive: true,
    images: [],
  });

  // Add new variant option
  const addVariantOption = () => {
    setNewVariant((prev) => ({
      ...prev,
      options: [
        ...(prev.options || []),
        { type: "color", name: "", value: "" },
      ],
    }));
  };

  // Update variant option
  const updateVariantOption = (
    index: number,
    field: keyof VariantOption,
    value: string,
  ) => {
    setNewVariant((prev) => ({
      ...prev,
      options: prev.options?.map((option, i) =>
        i === index ? { ...option, [field]: value } : option,
      ),
    }));
  };

  // Remove variant option
  const removeVariantOption = (index: number) => {
    setNewVariant((prev) => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index),
    }));
  };

  // Add variant image
  const addVariantImage = () => {
    setNewVariant((prev) => ({
      ...prev,
      images: [...(prev.images || []), { url: "", alt: "", isPrimary: false }],
    }));
  };

  // Update variant image
  const updateVariantImage = (
    index: number,
    field: keyof Variant["images"][0],
    value: string | boolean,
  ) => {
    setNewVariant((prev) => ({
      ...prev,
      images: prev.images?.map((image, i) =>
        i === index ? { ...image, [field]: value } : image,
      ),
    }));
  };

  // Remove variant image
  const removeVariantImage = (index: number) => {
    setNewVariant((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  // Save new variant
  const saveNewVariant = async () => {
    try {
      if (!newVariant.options || newVariant.options.length === 0) {
        toast({
          title: "Error",
          description: "At least one variant option is required",
          variant: "destructive",
        });
        return;
      }

      // Generate combination
      const combination = newVariant.options.map((opt) => opt.value).join("-");

      const response = await apiService.request(
        `/products/${productId}/variants`,
        {
          method: "POST",
          body: JSON.stringify({
            ...newVariant,
            combination,
          }),
        },
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Variant added successfully",
        });
        setIsAddingVariant(false);
        setNewVariant({
          options: [],
          price: 0,
          stockQuantity: 0,
          lowStockThreshold: 5,
          isActive: true,
          images: [],
        });
        onVariantsUpdate(response.data.variants);
      }
    } catch (error) {
      console.error("Error adding variant:", error);
      toast({
        title: "Error",
        description: "Failed to add variant",
        variant: "destructive",
      });
    }
  };

  // Update existing variant
  const updateVariant = async (
    combination: string,
    updates: Partial<Variant>,
  ) => {
    try {
      const response = await apiService.request(
        `/products/${productId}/variants/${combination}`,
        {
          method: "PUT",
          body: JSON.stringify(updates),
        },
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Variant updated successfully",
        });
        setEditingVariant(null);
        onVariantsUpdate(response.data.variants);
      }
    } catch (error) {
      console.error("Error updating variant:", error);
      toast({
        title: "Error",
        description: "Failed to update variant",
        variant: "destructive",
      });
    }
  };

  // Delete variant
  const deleteVariant = async (combination: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;

    try {
      const response = await apiService.request(
        `/products/${productId}/variants/${combination}`,
        {
          method: "DELETE",
        },
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Variant deleted successfully",
        });
        onVariantsUpdate(response.data.variants);
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast({
        title: "Error",
        description: "Failed to delete variant",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Product Variants</h3>
        <Button
          onClick={() => setIsAddingVariant(true)}
          disabled={isAddingVariant}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {/* Add New Variant Form */}
      {isAddingVariant && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Add New Variant
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingVariant(false);
                  setNewVariant({
                    options: [],
                    price: 0,
                    stockQuantity: 0,
                    lowStockThreshold: 5,
                    isActive: true,
                    images: [],
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Variant Options */}
            <div className="space-y-4">
              <Label>Variant Options</Label>
              {newVariant.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Select
                    value={option.type}
                    onValueChange={(value) =>
                      updateVariantOption(index, "type", value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VARIANT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Name (e.g., Color)"
                    value={option.name}
                    onChange={(e) =>
                      updateVariantOption(index, "name", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value (e.g., Red)"
                    value={option.value}
                    onChange={(e) =>
                      updateVariantOption(index, "value", e.target.value)
                    }
                    className="flex-1"
                  />
                  {option.type === "color" && (
                    <Input
                      type="color"
                      value={option.hexCode || "#000000"}
                      onChange={(e) =>
                        updateVariantOption(index, "hexCode", e.target.value)
                      }
                      className="w-16"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariantOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addVariantOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={newVariant.price}
                  onChange={(e) =>
                    setNewVariant((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Compare Price (₹)</Label>
                <Input
                  type="number"
                  value={newVariant.compareAtPrice || ""}
                  onChange={(e) =>
                    setNewVariant((prev) => ({
                      ...prev,
                      compareAtPrice: parseFloat(e.target.value) || undefined,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Cost Price (₹)</Label>
                <Input
                  type="number"
                  value={newVariant.costPrice || ""}
                  onChange={(e) =>
                    setNewVariant((prev) => ({
                      ...prev,
                      costPrice: parseFloat(e.target.value) || undefined,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={newVariant.stockQuantity}
                  onChange={(e) =>
                    setNewVariant((prev) => ({
                      ...prev,
                      stockQuantity: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Low Stock Threshold</Label>
                <Input
                  type="number"
                  value={newVariant.lowStockThreshold}
                  onChange={(e) =>
                    setNewVariant((prev) => ({
                      ...prev,
                      lowStockThreshold: parseInt(e.target.value) || 5,
                    }))
                  }
                  placeholder="5"
                />
              </div>
            </div>

            {/* SKU */}
            <div>
              <Label>SKU</Label>
              <Input
                value={newVariant.sku || ""}
                onChange={(e) =>
                  setNewVariant((prev) => ({ ...prev, sku: e.target.value }))
                }
                placeholder="Product-SKU-001"
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <Label>Variant Images</Label>
              {newVariant.images?.map((image, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Image URL"
                    value={image.url}
                    onChange={(e) =>
                      updateVariantImage(index, "url", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="Alt text"
                    value={image.alt}
                    onChange={(e) =>
                      updateVariantImage(index, "alt", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    variant={image.isPrimary ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateVariantImage(index, "isPrimary", !image.isPrimary)
                    }
                  >
                    Primary
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariantImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addVariantImage}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddingVariant(false)}
              >
                Cancel
              </Button>
              <Button onClick={saveNewVariant}>
                <Save className="h-4 w-4 mr-2" />
                Save Variant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Variants */}
      <div className="space-y-4">
        {variants.map((variant) => (
          <Card key={variant.combination}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={variant.isActive ? "default" : "secondary"}>
                      {variant.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="font-medium">{variant.combination}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>₹{variant.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span>{variant.stockQuantity} in stock</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Hash className="h-4 w-4 text-gray-600" />
                      <span>{variant.sku}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ImageIcon className="h-4 w-4 text-purple-600" />
                      <span>{variant.images.length} images</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setEditingVariant(
                        editingVariant === variant.combination
                          ? null
                          : variant.combination,
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteVariant(variant.combination)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Edit Form */}
              {editingVariant === variant.combination && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Price (₹)</Label>
                      <Input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(variant.combination, {
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Stock Quantity</Label>
                      <Input
                        type="number"
                        value={variant.stockQuantity}
                        onChange={(e) =>
                          updateVariant(variant.combination, {
                            stockQuantity: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>SKU</Label>
                      <Input
                        value={variant.sku}
                        onChange={(e) =>
                          updateVariant(variant.combination, {
                            sku: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingVariant(null)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => setEditingVariant(null)}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {variants.length === 0 && (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No variants added yet</p>
          <p className="text-sm text-gray-400">
            Add variants to offer different options for your product
          </p>
        </div>
      )}
    </div>
  );
}
