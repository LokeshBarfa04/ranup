import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
// import SeedsSection from "@/components/SeedsSection";
import AboutSection from "@/components/AboutSection";
import WhyUsSection from "@/components/WhyUsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ProductsSection from "@/components/ProductSection";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductsSection />
      {/* <SeedsSection /> */}

      <AboutSection />
      <WhyUsSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
