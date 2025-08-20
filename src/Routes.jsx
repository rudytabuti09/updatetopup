import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import GameSelectionHub from './pages/game-selection-hub';
import MobileGamingExperience from './pages/mobile-gaming-experience';
import HomepageGamingCommerceHub from './pages/homepage-gaming-commerce-hub';
import PersonalGamingDashboard from './pages/personal-gaming-dashboard';
import GamingCommunityPortal from './pages/gaming-community-portal';
import StreamlinedCheckoutFlow from './pages/streamlined-checkout-flow';
import SupabaseExample from './pages/SupabaseExample';
import VipResellerTest from './components/VipResellerTest';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Components
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import GameManagement from './pages/admin/GameManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import Reports from './pages/admin/Reports';
import VipResellerManagement from './pages/admin/VipResellerManagement';
import Settings from './pages/admin/Settings';
import AdminTest from './pages/AdminTest';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<GameSelectionHub />} />
          <Route path="/game-selection-hub" element={<GameSelectionHub />} />
          <Route path="/mobile-gaming-experience" element={<MobileGamingExperience />} />
          <Route path="/homepage-gaming-commerce-hub" element={<HomepageGamingCommerceHub />} />
          <Route path="/personal-gaming-dashboard" element={
            <ProtectedRoute>
              <PersonalGamingDashboard />
            </ProtectedRoute>
          } />
          <Route path="/gaming-community-portal" element={<GamingCommunityPortal />} />
          <Route path="/streamlined-checkout-flow" element={
            <ProtectedRoute>
              <StreamlinedCheckoutFlow />
            </ProtectedRoute>
          } />
          <Route path="/supabase-example" element={<SupabaseExample />} />
          <Route path="/vip-reseller-test" element={<VipResellerTest />} />
          
          {/* Dashboard Route (Protected) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Admin Routes (Protected - Admin Only) */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin={true}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/games" element={
            <ProtectedRoute requireAdmin={true}>
              <GameManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/services" element={
            <ProtectedRoute requireAdmin={true}>
              <ServiceManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute requireAdmin={true}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/admin/vip-reseller/*" element={
            <ProtectedRoute requireAdmin={true}>
              <VipResellerManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requireAdmin={true}>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Admin Test Route (Protected) */}
          <Route path="/admin-test" element={
            <ProtectedRoute>
              <AdminTest />
            </ProtectedRoute>
          } />

          {/* Authentication Routes (Guest Only) */}
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={
            <ProtectedRoute requireAuth={false}>
              <Signup />
            </ProtectedRoute>
          } />
          <Route path="/forgot-password" element={
            <ProtectedRoute requireAuth={false}>
              <ForgotPassword />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
