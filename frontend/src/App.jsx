import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";;
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

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


const App = () => {
  const { authUser, checkAuth, isCheckingAuth, isAdmin } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (<div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>);
  }

  const admin = authUser && isAdmin;
  const user = authUser && !isAdmin;

  usePageTracking();

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* bg rgba(80,190,182,.15) */}
      <div class="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(80,190,182,.15),rgba(255,255,255,0))]"></div>
      <div class="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(80,190,182,.15),rgba(255,255,255,0))]"></div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto">
        <Navbar />
        <Routes>

          <Route
            path="/"
            element={
              !authUser ? <Navigate to="/login" /> :
                admin ? <Navigate to="/admin" /> :
                  user ? <Navigate to="/user" /> :
                    <Navigate to="/login" />
            } />

          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

          <Route path="/admin" element={admin ? <AdminHome /> : <Navigate to="/" />} />
          <Route path="/admin/stocks" element={admin ? <AdminStocks /> : <Navigate to="/" />} />
          <Route path="/admin/stocks/:stockId" element={admin ? <AdminStockView /> : <Navigate to="/" />} />
          <Route path="/admin/analytics" element={admin ? <AdminAnalytics /> : <Navigate to="/" />} />
          <Route path="/admin/developments" element={admin ? <AdminDevelopments /> : <Navigate to="/" />} />
          <Route path="/admin/developments/:devId" element={admin ? <AdminDevelopmentView /> : <Navigate to="/" />} />
          <Route path="/admin/settings" element={admin ? <AdminSettings /> : <Navigate to="/"> </Navigate>} />
          <Route path="/admin/trades" element={admin ? <AdminTrades /> : <Navigate to="/"> </Navigate>} />
          <Route path="/admin/users" element={admin ? <AdminUsers /> : <Navigate to="/"> </Navigate>} />
          <Route path="/admin/display" element={admin ? <AdminDisplay /> : <Navigate to="/"> </Navigate>} />


          <Route path="/user" element={user ? <UserHome /> : <Navigate to="/" />} />
          <Route path="/user/portfolio" element={user ? <UserPortfolio /> : <Navigate to="/" />} />
          <Route path="/user/trade" element={user ? <UserTrade /> : <Navigate to="/" />} />
          <Route path="/user/developments" element={user ? <UserDevelopments /> : <Navigate to="/" />} />
          <Route path="/user/developments/:devId" element={user ? <UserDevelopmentView /> : <Navigate to="/" />} />
          <Route path="/user/history" element={user ? <UserHistory /> : <Navigate to="/" />} />
          <Route path="/user/help" element={user ? <UserHelp /> : <Navigate to="/" />} />

        </Routes>
      </div>
      <Toaster />
    </div >
  );
};

export default App;