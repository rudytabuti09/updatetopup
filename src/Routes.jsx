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
        <Route path="/personal-gaming-dashboard" element={<PersonalGamingDashboard />} />
        <Route path="/gaming-community-portal" element={<GamingCommunityPortal />} />
        <Route path="/streamlined-checkout-flow" element={<StreamlinedCheckoutFlow />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
