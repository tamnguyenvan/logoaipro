import Header from "@/components/header";
import Hero from "@/components/landing/hero"
import Steps from "@/components/steps"
import Features from "@/components/features"
import WhyChooseUs from "@/components/landing/why-choose-us"
import FAQs from "@/components/faqs"
import Pricing from "@/components/pricing"
import CTA from "@/components/landing/cta"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <Hero />
      <Steps />
      <Features />
      <WhyChooseUs />
      <FAQs />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
