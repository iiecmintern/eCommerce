import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { apiService } from "@/services/api";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  vendor: string;
  store: string;
  inStock: boolean;
  maxQuantity?: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  totalDiscount: number;
  total: number;
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (itemId: string) => boolean;
  getItemQuantity: (itemId: string) => number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => Promise<void>;
  couponCode: string | null;
  couponDiscount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from API when user is authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        // Clear cart when user logs out
        setItems([]);
        setCouponCode(null);
        setCouponDiscount(0);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiService.request("/cart");
        if (response.success) {
          setItems(response.data.items || []);
          setCouponCode(response.data.appliedCoupon?.code || null);
          setCouponDiscount(response.data.appliedCoupon?.discount || 0);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        // Fallback to localStorage for offline support
        try {
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
              setItems(parsedCart);
            }
          }
        } catch (localError) {
          console.error("Error loading from localStorage:", localError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage as backup (for offline support)
  useEffect(() => {
    if (!user) return; // Don't save to localStorage if user is not authenticated

    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items, user]);

  // Save coupon to localStorage whenever it changes
  useEffect(() => {
    try {
      if (couponCode) {
        localStorage.setItem(
          "cartCoupon",
          JSON.stringify({
            code: couponCode,
            discount: couponDiscount,
          }),
        );
      } else {
        localStorage.removeItem("cartCoupon");
      }
    } catch (error) {
      console.error("Error saving coupon to localStorage:", error);
    }
  }, [couponCode, couponDiscount]);

  // Calculate cart totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const totalDiscount =
    items.reduce((sum, item) => {
      const itemDiscount = (item.originalPrice || item.price) - item.price;
      return sum + itemDiscount * item.quantity;
    }, 0) + couponDiscount;

  const total = subtotal - couponDiscount;

  // Add item to cart
  const addToCart = async (newItem: Omit<CartItem, "quantity">) => {
    if (!user) {
      // Fallback to localStorage for unauthenticated users
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === newItem.id);

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + 1,
            existingItem.maxQuantity || 999,
          );

          return prevItems.map((item) =>
            item.id === newItem.id ? { ...item, quantity: newQuantity } : item,
          );
        } else {
          return [...prevItems, { ...newItem, quantity: 1 }];
        }
      });
      return;
    }

    try {
      const response = await apiService.request("/cart/items", {
        method: "POST",
        body: JSON.stringify({
          productId: newItem.id,
          quantity: 1,
          variant: null,
        }),
      });

      if (response.success) {
        setItems(response.data.items || []);
        setCouponCode(response.data.appliedCoupon?.code || null);
        setCouponDiscount(response.data.appliedCoupon?.discount || 0);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      // Fallback to localStorage
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === newItem.id);

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + 1,
            existingItem.maxQuantity || 999,
          );

          return prevItems.map((item) =>
            item.id === newItem.id ? { ...item, quantity: newQuantity } : item,
          );
        } else {
          return [...prevItems, { ...newItem, quantity: 1 }];
        }
      });
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    if (!user) {
      // Fallback to localStorage for unauthenticated users
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      return;
    }

    try {
      const response = await apiService.request(`/cart/items/${itemId}`, {
        method: "DELETE",
      });

      if (response.success) {
        setItems(response.data.items || []);
        setCouponCode(response.data.appliedCoupon?.code || null);
        setCouponDiscount(response.data.appliedCoupon?.discount || 0);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      // Fallback to localStorage
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) {
      // Fallback to localStorage for unauthenticated users
      if (quantity <= 0) {
        removeFromCart(itemId);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            const maxQty = item.maxQuantity || 999;
            const newQuantity = Math.min(quantity, maxQty);
            return { ...item, quantity: newQuantity };
          }
          return item;
        }),
      );
      return;
    }

    try {
      const response = await apiService.request(`/cart/items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({
          quantity,
        }),
      });

      if (response.success) {
        setItems(response.data.items || []);
        setCouponCode(response.data.appliedCoupon?.code || null);
        setCouponDiscount(response.data.appliedCoupon?.discount || 0);
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      // Fallback to localStorage
      if (quantity <= 0) {
        removeFromCart(itemId);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            const maxQty = item.maxQuantity || 999;
            const newQuantity = Math.min(quantity, maxQty);
            return { ...item, quantity: newQuantity };
          }
          return item;
        }),
      );
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user) {
      // Fallback to localStorage for unauthenticated users
      setItems([]);
      setCouponCode(null);
      setCouponDiscount(0);
      return;
    }

    try {
      const response = await apiService.request("/cart", {
        method: "DELETE",
      });

      if (response.success) {
        setItems([]);
        setCouponCode(null);
        setCouponDiscount(0);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      // Fallback to localStorage
      setItems([]);
      setCouponCode(null);
      setCouponDiscount(0);
    }
  };

  // Check if item is in cart
  const isInCart = (itemId: string) => {
    return items.some((item) => item.id === itemId);
  };

  // Get item quantity in cart
  const getItemQuantity = (itemId: string) => {
    const item = items.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  // Apply coupon code
  const applyCoupon = async (
    code: string,
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      // Fallback to mock validation for unauthenticated users
      try {
        const mockCoupons = {
          SAVE10: { discount: 10, type: "percentage" },
          SAVE20: { discount: 20, type: "percentage" },
          FLAT50: { discount: 50, type: "fixed" },
          WELCOME: { discount: 15, type: "percentage" },
        };

        const coupon = mockCoupons[code as keyof typeof mockCoupons];

        if (!coupon) {
          return { success: false, message: "Invalid coupon code" };
        }

        const discountAmount =
          coupon.type === "percentage"
            ? (subtotal * coupon.discount) / 100
            : Math.min(coupon.discount, subtotal);

        setCouponCode(code);
        setCouponDiscount(discountAmount);

        return {
          success: true,
          message: `Coupon applied! ${coupon.discount}${coupon.type === "percentage" ? "%" : "₹"} off`,
        };
      } catch (error) {
        console.error("Error applying coupon:", error);
        return { success: false, message: "Error applying coupon" };
      }
    }

    try {
      const response = await apiService.request("/cart/coupon", {
        method: "POST",
        body: JSON.stringify({ code }),
      });

      if (response.success) {
        setItems(response.data.items || []);
        setCouponCode(response.data.appliedCoupon?.code || null);
        setCouponDiscount(response.data.appliedCoupon?.discount || 0);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      return { success: false, message: "Error applying coupon" };
    }
  };

  // Remove coupon
  const removeCoupon = async () => {
    if (!user) {
      // Fallback to localStorage for unauthenticated users
      setCouponCode(null);
      setCouponDiscount(0);
      return;
    }

    try {
      const response = await apiService.request("/cart/coupon", {
        method: "DELETE",
      });

      if (response.success) {
        setItems(response.data.items || []);
        setCouponCode(null);
        setCouponDiscount(0);
      }
    } catch (error) {
      console.error("Error removing coupon:", error);
      // Fallback to localStorage
      setCouponCode(null);
      setCouponDiscount(0);
    }
  };

  const value: CartContextType = {
    items,
    totalItems,
    subtotal,
    totalDiscount,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    applyCoupon,
    removeCoupon,
    couponCode,
    couponDiscount,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
