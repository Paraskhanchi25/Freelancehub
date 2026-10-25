import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import "./services/storageCleanup";

// Static / Info Pages
import Home from "./pages/static/Home/Home";
import AboutUs from "./pages/static/AboutUs/AboutUs";
import HelpCenter from "./pages/static/HelpCenter/HelpCenter";
import HourlyCalculator from "./pages/static/HourlyCalculator/HourlyCalculator";

// Jobs Pages
import FindWork from "./pages/jobs/FindWork/FindWork";
import PostJob from "./pages/jobs/PostJob/PostJob";
import JobDetails from "./pages/jobs/JobDetails/JobDetails";
import EditJob from "./pages/jobs/EditJob/EditJob";

// Talent Pages
import FindTalent from "./pages/talent/FindTalent/FindTalent";
import Profile from "./pages/talent/Profile/Profile";

// Auth Pages
import Login from "./pages/auth/Login/Login";
import Signup from "./pages/auth/Signup/Signup";
import CompleteProfile from "./pages/auth/CompleteProfile/CompleteProfile";

// AI Blueprint & Architecture Studio
import AIBlueprintStudio from "./pages/ai/AIBlueprintStudio/AIBlueprintStudio";

// Dashboard Pages
import ClientDashboard from "./pages/dashboard/ClientDashboard/ClientDashboard";
import FreelancerDashboard from "./pages/dashboard/FreelancerDashboard/FreelancerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/find-work" element={<FindWork />} />
          <Route path="/find-talent" element={<FindTalent />} />
          <Route path="/job-details/:id" element={<JobDetails />} />
          <Route path="/blueprint" element={<AIBlueprintStudio />} />
          <Route path="/ai-architect" element={<AIBlueprintStudio />} />
          <Route path="/ai-blueprint" element={<AIBlueprintStudio />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/calculator" element={<HourlyCalculator />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Onboarding & Profile Editing */}
          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            }
          />

          {/* Protected Client Routes */}
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute requiredRole="client">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute requiredRole="client">
                <EditJob />
              </ProtectedRoute>
            }
          />

          {/* Protected Freelancer Routes */}
          <Route
            path="/freelancer-dashboard"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;