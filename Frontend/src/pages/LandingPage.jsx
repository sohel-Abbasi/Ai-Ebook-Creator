import React from "react";
import Navbar from "../components/layout/Navbar.jsx";
import Hero from "../components/landing/Hero.jsx";
import Features from "../components/landing/Features.jsx";
import Testimonials from "../components/landing/Testimonials.jsx";
import Footer from "../components/landing/Footer.jsx";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;
