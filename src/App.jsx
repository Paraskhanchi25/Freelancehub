import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import FindWork from "./pages/FindWork/FindWork";
import FindTalent from "./pages/FindTalent/FindTalent";
import JobDetails from "./pages/JobDetails/JobDetails";
import Profile from "./pages/Profile/Profile";
import PostJob from "./pages/PostJob/PostJob";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ClientDashboard from "./pages/ClientDashboard/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard/FreelancerDashboard";
import AboutUs from "./pages/AboutUs/AboutUs";
import HelpCenter from "./pages/HelpCenter/HelpCenter";
import HourlyCalculator from "./pages/HourlyCalculator/HourlyCalculator";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/find-work" element={<FindWork />} />

        <Route path="/find-talent" element={<FindTalent />} />

        <Route path="/job-details/:id" element={<JobDetails />} />

        <Route path="/profile/:id" element={<Profile />} />

        <Route path="/post-job" element={<PostJob />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/client-dashboard" element={<ClientDashboard />} />

        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />

        <Route path="/about" element={<AboutUs />} />

        <Route path="/help" element={<HelpCenter />} />

        <Route path="/calculator" element={<HourlyCalculator />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;