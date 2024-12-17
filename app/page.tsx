import Header from "@/components/header"
import Hero from "@/components/home/hero"
import Steps from "@/components/home/steps"
import Features from "@/components/home/features"
import WhyChooseUs from "@/components/home/why-choose-us"
import FAQs from "@/components/home/faqs"
import Pricing from "@/components/pricing"
import CTA from "@/components/home/cta"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
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
  )
}

