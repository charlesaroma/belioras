/* Root Application */
import { BrowserRouter, Routes } from "react-router-dom";

import AppProviders from "./AppProviders";
import ScrollToTop from "./components/layout/ScrollToTop";
import DraftDock from "./components/ui/DraftDock";
import LiquidPress from "./components/ui/LiquidPress";
import authRoutes from "./routes/AuthRoutes";
import dashboardRoutes from "./routes/DashboardRoutes";
import storefrontRoutes from "./routes/StorefrontRoutes";

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <ScrollToTop />
        {/* Draft dock renders app-wide */}
        <DraftDock />
        {/* The liquid press on icon buttons, for touch as well as mouse. */}
        <LiquidPress />
        <Routes>
          {authRoutes()}
          {dashboardRoutes()}
          {storefrontRoutes()}
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
