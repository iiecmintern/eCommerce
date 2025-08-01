import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

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

interface VariantSelectorProps {
  variants: Variant[];
  variantTypes: string[];
  variantOptions: Record<string, string[]>;
  selectedVariant: string | null;
  onVariantChange: (combination: string) => void;
  className?: string;
}

export function VariantSelector({
  variants,
  variantTypes,
  variantOptions,
  selectedVariant,
  onVariantChange,
  className,
}: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [availableCombinations, setAvailableCombinations] = useState<
    Set<string>
  >(new Set());

  // Initialize available combinations
  useEffect(() => {
    const combinations = new Set(variants.map((v) => v.combination));
    setAvailableCombinations(combinations);
  }, [variants]);

  // Initialize selected options from selected variant
  useEffect(() => {
    if (selectedVariant) {
      const variant = variants.find((v) => v.combination === selectedVariant);
      if (variant) {
        const options: Record<string, string> = {};
        variant.options.forEach((option) => {
          options[option.type] = option.value;
        });
        setSelectedOptions(options);
      }
    }
  }, [selectedVariant, variants]);

  // Get available options for a specific type based on current selection
  const getAvailableOptions = (type: string) => {
    return (
      variantOptions[type]?.filter((option) => {
        // Create a test combination with this option
        const testOptions = { ...selectedOptions, [type]: option };

        // Check if this combination exists in available variants
        const testCombination = Object.values(testOptions).join("-");
        return availableCombinations.has(testCombination);
      }) || []
    );
  };

  // Handle option selection
  const handleOptionSelect = (type: string, value: string) => {
    const newSelectedOptions = { ...selectedOptions, [type]: value };
    setSelectedOptions(newSelectedOptions);

    // Find the matching variant combination
    const combination = Object.values(newSelectedOptions).join("-");
    if (availableCombinations.has(combination)) {
      onVariantChange(combination);
    }
  };

  // Get current variant data
  const currentVariant = variants.find(
    (v) => v.combination === selectedVariant,
  );

  // Render option based on type
  const renderOption = (type: string, value: string) => {
    const isSelected = selectedOptions[type] === value;
    const isAvailable = getAvailableOptions(type).includes(value);
    const variant = variants.find((v) =>
      v.options.some((opt) => opt.type === type && opt.value === value),
    );
    const optionData = variant?.options.find(
      (opt) => opt.type === type && opt.value === value,
    );

    switch (type) {
      case "color":
        return (
          <Button
            key={value}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={cn(
              "relative w-12 h-12 rounded-full border-2 transition-all",
              isSelected && "ring-2 ring-primary ring-offset-2",
              !isAvailable && "opacity-50 cursor-not-allowed",
            )}
            style={{
              backgroundColor: optionData?.hexCode || "#ccc",
              borderColor: isSelected
                ? "hsl(var(--primary))"
                : "hsl(var(--border))",
            }}
            onClick={() => isAvailable && handleOptionSelect(type, value)}
            disabled={!isAvailable}
          >
            {isSelected && (
              <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
            )}
            {!isAvailable && (
              <X className="h-4 w-4 text-gray-400 absolute inset-0 m-auto" />
            )}
            <span className="sr-only">{value}</span>
          </Button>
        );

      case "size":
        return (
          <Button
            key={value}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={cn(
              "min-w-[60px] h-10",
              !isAvailable && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => isAvailable && handleOptionSelect(type, value)}
            disabled={!isAvailable}
          >
            {value}
            {!isAvailable && <X className="h-3 w-3 ml-1" />}
          </Button>
        );

      case "storage":
      case "ram":
        return (
          <Button
            key={value}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={cn(
              "min-w-[80px] h-10",
              !isAvailable && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => isAvailable && handleOptionSelect(type, value)}
            disabled={!isAvailable}
          >
            {value}
            {!isAvailable && <X className="h-3 w-3 ml-1" />}
          </Button>
        );

      case "material":
      case "style":
      default:
        return (
          <Button
            key={value}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-10",
              !isAvailable && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => isAvailable && handleOptionSelect(type, value)}
            disabled={!isAvailable}
          >
            {value}
            {!isAvailable && <X className="h-3 w-3 ml-1" />}
          </Button>
        );
    }
  };

  // Render variant type section
  const renderVariantType = (type: string) => {
    const options = variantOptions[type];
    if (!options || options.length === 0) return null;

    const typeName = type.charAt(0).toUpperCase() + type.slice(1);
    const availableOptions = getAvailableOptions(type);

    return (
      <div key={type} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{typeName}</h3>
          {selectedOptions[type] && (
            <Badge variant="secondary" className="text-xs">
              {selectedOptions[type]}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((value) => renderOption(type, value))}
        </div>
        {availableOptions.length === 0 && selectedOptions[type] && (
          <p className="text-xs text-muted-foreground">
            No {type} options available with current selection
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {variantTypes.map(renderVariantType)}

      {currentVariant && (
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Selected Variant:</span>
            <Badge variant="outline">{currentVariant.combination}</Badge>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Stock: {currentVariant.stockQuantity} units
            {currentVariant.stockQuantity <= 0 && (
              <span className="text-red-500 ml-2">(Out of Stock)</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
