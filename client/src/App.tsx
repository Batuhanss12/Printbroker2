import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import LoadingPage from "@/components/LoadingPage";
import { NotificationSystem } from "@/components/NotificationSystem";
import Landing from "./pages/Landing";
import LandingNew from "./pages/LandingNew";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import CustomerDashboard from "@/pages/CustomerDashboard";
import QuoteFormNew from "@/pages/QuoteFormNew";
import QuoteDetail from "@/pages/QuoteDetail";
import PrinterDashboard from "@/pages/PrinterDashboard";
import Firmalar from "@/pages/Firmalar";
import AdminDashboard from "@/pages/AdminDashboard";
import Payment from "./pages/Payment";
import CustomerRegister from "./pages/CustomerRegister";
import PrinterRegister from "./pages/PrinterRegister";
import ProductCategories from "./pages/ProductCategories";
import ProductCategoriesNew from "./pages/ProductCategoriesNew";
import References from "./pages/References";
import ReferencesNew from "./pages/ReferencesNew";
import DesignQuote from "./pages/DesignQuote";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import KVKK from "@/pages/KVKK";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Career from "./pages/Career";
import CookiePolicy from "./pages/CookiePolicy";
import DistanceSalesContract from "./pages/DistanceSalesContract";
import SecureShopping from "./pages/SecureShopping";
import Shipping from "./pages/Shipping";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";
import UserGuide from "./pages/UserGuide";
import NotFound from "@/pages/not-found";

function AppRouter() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingPage message="Hesap bilgileriniz kontrol ediliyor..." />;
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={LandingNew} />
          <Route path="/products" component={ProductCategoriesNew} />
          <Route path="/blog" component={Blog} />
          <Route path="/firmalar" component={Firmalar} />
          <Route path="/old" component={Landing} />
          <Route path="/old-products" component={ProductCategories} />
          <Route path="/references" component={ReferencesNew} />
          <Route path="/customer-register" component={CustomerRegister} />
          <Route path="/printer-register" component={PrinterRegister} />
          <Route path="/payment" component={Payment} />

          {/* Authentication-protected panel routes redirect to login */}
          <Route path="/customer-dashboard" component={() => {
            window.location.href = '/api/login?returnTo=/customer-dashboard';
            return <div>Redirecting to login...</div>;
          }} />
          <Route path="/printer-dashboard" component={() => {
            window.location.href = '/api/login?returnTo=/printer-dashboard';
            return <div>Redirecting to login...</div>;
          }} />
          <Route path="/admin-dashboard" component={() => {
            window.location.href = '/api/login?returnTo=/admin-dashboard';
            return <div>Redirecting to login...</div>;
          }} />
        </>
      ) : (
        <>
          <Route path="/" component={LandingNew} />
          <Route path="/products" component={ProductCategoriesNew} />
          <Route path="/blog" component={Blog} />
          <Route path="/firmalar" component={Firmalar} />
          <Route path="/dashboard" component={() => {
            // Universal dashboard route that redirects based on role
            const userRole = (user as any)?.role || 'customer';

            if (userRole === 'admin') {
              window.location.href = '/admin-dashboard';
              return null;
            }
            if (userRole === 'printer') {
              window.location.href = '/printer-dashboard';
              return null;
            }
            // Default to customer dashboard
            window.location.href = '/customer-dashboard';
            return null;
          }} />

          {/* Authenticated dashboard routes */}
          <Route path="/customer-dashboard" component={CustomerDashboard} />
          <Route path="/printer-dashboard" component={PrinterDashboard} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
          
          {/* Quote routes */}
          <Route path="/quote/:id" component={QuoteDetail} />
          <Route path="/quote-detail/:id" component={QuoteDetail} />

          <Route path="/quote/:type" component={() => {
            const userRole = (user as any)?.role;
            if (userRole !== 'customer') {
              window.location.href = '/';
              return null;
            }
            return <QuoteFormNew />;
          }} />

          <Route path="/payment" component={Payment} />
        </>
      )}
      <Route path="/design-quote" component={DesignQuote} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/kvkk" component={KVKK} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/career" component={Career} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/distance-sales-contract" component={DistanceSalesContract} />
      <Route path="/secure-shopping" component={SecureShopping} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/contact" component={Contact} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/user-guide" component={UserGuide} />
      <Route path="/kvkk" component={KVKK} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Enhanced global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);

  // Log additional details for debugging
  if (event.reason instanceof Error) {
    console.error('Error stack:', event.reason.stack);
    console.error('Error message:', event.reason.message);
  }

  // Prevent the default browser behavior
  event.preventDefault();
});

// Global error boundary for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  event.preventDefault();
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <AppRouter />
          <NotificationSystem />
          <Toaster />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;