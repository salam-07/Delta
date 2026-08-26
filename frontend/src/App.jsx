import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

import { Toaster } from "react-hot-toast";
import { LoadingPanel } from "./components/ui/Feedback";

import AdminHome from "./pages/admin/AdminHome";
import AdminStocks from "./pages/admin/AdminStocks";
import AdminStockView from "./pages/admin/AdminStockView";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminDevelopments from "./pages/admin/AdminDevelopments";
import AdminDevelopmentView from "./pages/admin/AdminDevelopmentView";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminTrades from "./pages/admin/AdminTrades";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDisplay from "./pages/admin/AdminDisplay";

import UserHome from "./pages/user/UserHome";
import UserPortfolio from "./pages/user/UserPortfolio";
import UserTrade from "./pages/user/UserTrade";
import UserDevelopments from "./pages/user/UserDevelopments";
import UserHistory from "./pages/user/UserHistory";
import UserDevelopmentView from "./pages/user/UserDevelopmentView";
import UserHelp from "./pages/user/UserHelp";
import usePageTracking from "./lib/usePageTracking";

/**
 * Notifications carry the product's own surface: flat ink panel, phosphor rule,
 * Commit Mono. Bottom-right so a burst of price updates never covers the status
 * bar or the control a participant is aiming at.
 */
const TOAST_OPTIONS = {
    style: {
        background: "#0A130D",
        color: "#A8E6BF",
        border: "1px solid rgba(49, 217, 106, 0.32)",
        borderRadius: 0,
        boxShadow: "0 12px 34px -10px rgba(0, 0, 0, 0.95)",
        fontFamily: '"Commit Mono", ui-monospace, SFMono-Regular, monospace',
        fontSize: "12px",
        fontVariantNumeric: "tabular-nums",
        padding: "10px 14px",
        maxWidth: "26rem",
    },
    success: { iconTheme: { primary: "#31D96A", secondary: "#050A07" } },
    error: { iconTheme: { primary: "#FF4136", secondary: "#050A07" } },
};

const App = () => {

  usePageTracking();

  const { authUser, checkAuth, isCheckingAuth, isAdmin } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="delta-app flex h-screen items-center justify-center">
        <LoadingPanel label="Authenticating" />
      </div>
    );
  }

  const admin = authUser && isAdmin;
  const user = authUser && !isAdmin;

  // If not authenticated, show landing page
  if (!authUser) {
    return (
      <div className="relative h-screen w-full bg-black overflow-hidden">
        <div className="relative z-10 h-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Toaster position="bottom-right" toastOptions={TOAST_OPTIONS} />
      </div>
    );
  }

  return (
    <div className="delta-app flex h-screen w-full flex-col overflow-hidden">
      <Navbar />

      <div className="min-h-0 flex-1">
        <Routes>

          <Route
            path="/"
            element={
              admin ? <Navigate to="/admin" /> :
                user ? <Navigate to="/user" /> :
                  <Navigate to="/login" />
            } />

          <Route path="/signup" element={<Navigate to="/" />} />
          <Route path="/login" element={<Navigate to="/" />} />

          <Route path="/admin" element={admin ? <AdminHome /> : <Navigate to="/" />} />
          <Route path="/admin/stocks" element={admin ? <AdminStocks /> : <Navigate to="/" />} />
          <Route path="/admin/stocks/:stockId" element={admin ? <AdminStockView /> : <Navigate to="/" />} />
          <Route path="/admin/analytics" element={admin ? <AdminAnalytics /> : <Navigate to="/" />} />
          <Route path="/admin/developments" element={admin ? <AdminDevelopments /> : <Navigate to="/" />} />
          <Route path="/admin/developments/:devId" element={admin ? <AdminDevelopmentView /> : <Navigate to="/" />} />
          <Route path="/admin/settings" element={admin ? <AdminSettings /> : <Navigate to="/" />} />
          <Route path="/admin/trades" element={admin ? <AdminTrades /> : <Navigate to="/" />} />
          <Route path="/admin/users" element={admin ? <AdminUsers /> : <Navigate to="/" />} />
          <Route path="/admin/display" element={admin ? <AdminDisplay /> : <Navigate to="/" />} />


          <Route path="/user" element={user ? <UserHome /> : <Navigate to="/" />} />
          <Route path="/user/portfolio" element={user ? <UserPortfolio /> : <Navigate to="/" />} />
          <Route path="/user/trade" element={user ? <UserTrade /> : <Navigate to="/" />} />
          <Route path="/user/developments" element={user ? <UserDevelopments /> : <Navigate to="/" />} />
          <Route path="/user/developments/:devId" element={user ? <UserDevelopmentView /> : <Navigate to="/" />} />
          <Route path="/user/history" element={user ? <UserHistory /> : <Navigate to="/" />} />
          <Route path="/user/help" element={user ? <UserHelp /> : <Navigate to="/" />} />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </div>

      <Toaster position="bottom-right" toastOptions={TOAST_OPTIONS} />
    </div>
  );
};

export default App;
