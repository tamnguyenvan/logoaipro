import Header from "@/components/header";
import LogoGenerator from "@/components/logo-generator";
import Footer from "@/components/footer";
import Steps from "@/components/steps";
import Features from "@/components/features";
import FAQ from "@/components/faq";

export default function LogoGeneratorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <LogoGenerator />
      <Steps />
      <Features />
      <FAQ />
      <Footer />
    </main>
  );
}
