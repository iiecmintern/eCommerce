import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Marketplace from "./pages/Marketplace";
import Demo from "./pages/Demo";
import GetStarted from "./pages/GetStarted";
import PlaceholderPage from "./pages/PlaceholderPage";
import AdminDashboard from "./pages/AdminDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import EcommerceHome from "./pages/EcommerceHome";
import SearchResults from "./pages/SearchResults";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import B2BCommerce from "./pages/B2BCommerce";
import Subscriptions from "./pages/Subscriptions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="commerceforge-ui-theme">
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EcommerceHome />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/products" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* Platform builder pages */}
          <Route path="/platform" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/get-started" element={<GetStarted />} />

          {/* Dashboard routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="/customer" element={<CustomerDashboard />} />

          {/* Additional product pages */}
          <Route path="/templates" element={
            <PlaceholderPage
              title="Store Templates"
              description="Professional templates for every industry and business model"
              features={["Industry-specific designs", "Mobile-optimized layouts", "One-click customization"]}
            />
          } />

          <Route path="/integrations" element={
            <PlaceholderPage
              title="Integrations"
              description="Connect with 1000+ apps and services to power your commerce business"
              features={["Payment gateways", "Shipping providers", "Marketing tools", "Analytics platforms"]}
            />
          } />

          <Route path="/api" element={
            <PlaceholderPage
              title="Developer API"
              description="Powerful APIs and webhooks for custom integrations and headless commerce"
              features={["REST & GraphQL APIs", "Webhooks", "SDK libraries", "Developer documentation"]}
            />
          } />

          {/* Solution pages */}
          <Route path="/b2b" element={<B2BCommerce />} />
          <Route path="/subscriptions" element={<Subscriptions />} />

          <Route path="/mobile-app" element={
            <PlaceholderPage
              title="Mobile Apps"
              description="Native iOS and Android apps generated automatically from your store"
              features={["Auto-generated apps", "Push notifications", "Offline browsing", "App store publishing"]}
            />
          } />

          <Route path="/white-label" element={
            <PlaceholderPage
              title="White Label Platform"
              description="Launch your own branded e-commerce platform and resell to customers"
              features={["Custom branding", "Multi-tenant architecture", "Billing management", "Partner dashboard"]}
            />
          } />

          <Route path="/enterprise" element={
            <PlaceholderPage
              title="Enterprise Solutions"
              description="Large-scale commerce solutions with dedicated support and custom features"
              features={["Dedicated infrastructure", "Custom integrations", "24/7 support", "SLA guarantees"]}
            />
          } />

          {/* Support pages */}
          <Route path="/docs" element={
            <PlaceholderPage
              title="Documentation"
              description="Comprehensive guides, tutorials, and API documentation"
              features={["Getting started guides", "API reference", "Video tutorials", "Community forum"]}
            />
          } />

          <Route path="/help" element={
            <PlaceholderPage
              title="Help Center"
              description="Get the support you need to succeed with CommerceForge"
              features={["Knowledge base", "Video tutorials", "Community support", "Ticket system"]}
            />
          } />

          <Route path="/contact" element={
            <PlaceholderPage
              title="Contact Sales"
              description="Speak with our experts to find the perfect solution for your business"
              features={["Free consultation", "Custom demos", "Implementation support", "Migration assistance"]}
            />
          } />

          {/* Auth pages */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Legal pages */}
          <Route path="/privacy" element={
            <PlaceholderPage
              title="Privacy Policy"
              description="How we protect and handle your data"
              comingSoon={false}
            />
          } />

          <Route path="/terms" element={
            <PlaceholderPage
              title="Terms of Service"
              description="Terms and conditions for using CommerceForge"
              comingSoon={false}
            />
          } />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
