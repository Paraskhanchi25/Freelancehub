import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import ProjectCarousel from "../../components/ProjectCarousel/ProjectCarousel";
import RecommendedProfessionals from "../../components/RecommendedProfessionals/RecommendedProfessionals";
import MotivationalQuotes from "../../components/MotivationalQuotes/MotivationalQuotes";
import Trusted from "../../components/Trusted/Trusted";
import Freelancers from "../../components/Freelancers/Freelancers";
import CreativeSection from "../../components/CreativeSection/CreativeSection";
import WhyWork from "../../components/WhyWork/WhyWork";
import Sponsored from "../../components/Sponsored/Sponsored";
import Footer from "../../components/Footer/Footer";

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