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
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';

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
