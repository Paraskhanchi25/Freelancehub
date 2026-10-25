import Navbar from "../../../components/common/Navbar/Navbar";
import Hero from "../../../components/common/Hero/Hero";
import HowItWorks from "../../../components/common/HowItWorks/HowItWorks";
import ProjectCarousel from "../../../components/common/ProjectCarousel/ProjectCarousel";
import RecommendedProfessionals from "../../../components/talent/RecommendedProfessionals/RecommendedProfessionals";
import MotivationalQuotes from "../../../components/common/MotivationalQuotes/MotivationalQuotes";
import Trusted from "../../../components/common/Trusted/Trusted";
import Freelancers from "../../../components/talent/Freelancers/Freelancers";
import CreativeSection from "../../../components/common/CreativeSection/CreativeSection";
import WhyWork from "../../../components/common/WhyWork/WhyWork";
import Sponsored from "../../../components/common/Sponsored/Sponsored";
import Footer from "../../../components/common/Footer/Footer";

import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <HowItWorks />

      <ProjectCarousel />

      <RecommendedProfessionals />

      <MotivationalQuotes />

      <Trusted />

      <Freelancers />

      <CreativeSection />

      <WhyWork />

      <Sponsored />

      <Footer />
    </>
  );
}

export default Home;