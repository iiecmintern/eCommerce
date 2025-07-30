import { apiService } from "./api";
import { API_ENDPOINTS } from "@shared/api";
import { useState, useEffect } from "react";

export interface Plan {
  _id: string;
  name: string;
  description: string;
  type: "starter" | "professional" | "enterprise";
  pricing: {
    monthly: number;
    annual: number;
    currency: string;
  };
  features: {
    products: string;
    storage: string;
    analytics: boolean;
    multiCurrency: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    customIntegrations: boolean;
    prioritySupport: boolean;
    dedicatedSupport: boolean;
  };
  limits: {
    maxProducts: number;
    maxStorageGB: number;
    maxApiCalls: number;
    maxUsers: number;
  };
  isActive: boolean;
  isPopular: boolean;
  trialDays: number;
  sortOrder: number;
  formattedPricing?: {
    monthly: {
      amount: number;
      currency: string;
      formatted: string;
    };
    annual: {
      amount: number;
      currency: string;
      formatted: string;
      monthlyEquivalent: number;
    };
  };
  annualSavings?: {
    amount: number;
    percentage: number;
  };
}

export interface Subscription {
  _id: string;
  user: string;
  plan: Plan;
  status:
    | "active"
    | "cancelled"
    | "past_due"
    | "trialing"
    | "incomplete"
    | "incomplete_expired";
  billingCycle: "monthly" | "annual";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart?: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string;
  endedAt?: string;
  amount: number;
  currency: string;
  statusDisplay?: string;
  nextBillingDate?: string;
  trialDaysRemaining?: number;
  isInTrial?: boolean;
  isActive?: boolean;
}

export interface CreateSubscriptionRequest {
  planId: string;
  billingCycle: "monthly" | "annual";
}

export interface UpdateSubscriptionRequest {
  planId: string;
  billingCycle: "monthly" | "annual";
}

export interface CancelSubscriptionRequest {
  cancelAtPeriodEnd?: boolean;
}

// Plans API
export const plansApi = {
  // Get all active plans
  getPlans: async (): Promise<{
    success: boolean;
    data: { plans: Plan[] };
  }> => {
    const response = await apiService.request(API_ENDPOINTS.GET_PLANS);
    return response;
  },

  // Get plan by ID
  getPlanById: async (
    id: string,
  ): Promise<{ success: boolean; data: { plan: Plan } }> => {
    const response = await apiService.request(
      `${API_ENDPOINTS.GET_PLAN}/${id}`,
    );
    return response;
  },

  // Get plan by type
  getPlanByType: async (
    type: string,
  ): Promise<{ success: boolean; data: { plan: Plan } }> => {
    const response = await apiService.request(
      `${API_ENDPOINTS.GET_PLANS_BY_TYPE}/${type}`,
    );
    return response;
  },

  // Get plan comparison
  comparePlans: async (): Promise<{
    success: boolean;
    data: { comparison: any[] };
  }> => {
    const response = await apiService.request(API_ENDPOINTS.COMPARE_PLANS);
    return response;
  },
};

// Subscriptions API
export const subscriptionsApi = {
  // Get user's subscription
  getMySubscription: async (): Promise<{
    success: boolean;
    data: { subscription: Subscription };
  }> => {
    const response = await apiService.request(
      API_ENDPOINTS.GET_MY_SUBSCRIPTION,
    );
    return response;
  },

  // Create subscription (start trial)
  createSubscription: async (
    data: CreateSubscriptionRequest,
  ): Promise<{ success: boolean; data: { subscription: Subscription } }> => {
    const response = await apiService.request(
      API_ENDPOINTS.CREATE_SUBSCRIPTION,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    return response;
  },

  // Update subscription (upgrade/downgrade)
  updateSubscription: async (
    id: string,
    data: UpdateSubscriptionRequest,
  ): Promise<{ success: boolean; data: { subscription: Subscription } }> => {
    const response = await apiService.request(
      `${API_ENDPOINTS.UPDATE_SUBSCRIPTION}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
    return response;
  },

  // Cancel subscription
  cancelSubscription: async (
    id: string,
    data: CancelSubscriptionRequest = {},
  ): Promise<{ success: boolean; data: { subscription: Subscription } }> => {
    const response = await apiService.request(
      `${API_ENDPOINTS.CANCEL_SUBSCRIPTION}/${id}/cancel`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    return response;
  },

  // Reactivate subscription
  reactivateSubscription: async (
    id: string,
  ): Promise<{ success: boolean; data: { subscription: Subscription } }> => {
    const response = await apiService.request(
      `${API_ENDPOINTS.REACTIVATE_SUBSCRIPTION}/${id}/reactivate`,
      {
        method: "POST",
      },
    );
    return response;
  },
};

// Custom hook for plans
export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await plansApi.getPlans();
      setPlans(response.data.plans);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return { plans, loading, error, refetch: fetchPlans };
};

// Custom hook for user subscription
export const useMySubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subscriptionsApi.getMySubscription();
      setSubscription(response.data.subscription);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setSubscription(null);
      } else {
        setError(err.response?.data?.message || "Failed to fetch subscription");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return { subscription, loading, error, refetch: fetchSubscription };
};
