import Header from "@/components/header";
import Pricing from "@/components/pricing";
import Footer from "@/components/footer";

export default function LogoGeneratorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <Pricing />
      <Footer />
    </main>
  );
}
