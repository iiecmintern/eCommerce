import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "customer" | "vendor" | "admin";
  isEmailVerified: boolean;
  company?: string;
  phone?: string;
  lastLogin?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    userData: RegisterData,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

interface RegisterData {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  password: string;
  role: "customer" | "vendor";
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API base URL
  const API_BASE_URL = "http://localhost:5000/api";

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Ensure user object has required properties
          if (
            parsedUser &&
            parsedUser.id &&
            parsedUser.email &&
            parsedUser.role
          ) {
            setToken(storedToken);
            setUser(parsedUser);
          } else {
            // Invalid user data, clear it
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
        // Clear corrupted data
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setError("Failed to load user data. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user and token to localStorage
  const saveAuthData = (userData: User, authToken: string) => {
    try {
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setToken(authToken);
      setError(null);
    } catch (error) {
      console.error("Error saving auth data:", error);
      setError("Failed to save authentication data.");
    }
  };

  // Clear auth data
  const clearAuthData = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
      setError(null);
    } catch (error) {
      console.error("Error clearing auth data:", error);
      // Force clear state even if localStorage fails
      setUser(null);
      setToken(null);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        saveAuthData(data.data.user, data.data.token);
        return { success: true, message: data.message };
      } else {
        setError(data.message || "Login failed");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Network error. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        saveAuthData(data.data.user, data.data.token);
        return { success: true, message: data.message };
      } else {
        setError(data.message || "Registration failed");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Network error. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    try {
      clearAuthData();
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if there's an error
      setUser(null);
      setToken(null);
    }
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user data.");
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
