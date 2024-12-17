import Header from "@/components/header";
import LogoGenerator from "@/components/logo-generator/generator";
import Footer from "@/components/footer";

export default function LogoGeneratorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="container min-h-screen mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          <span className="cute-underline">AI Logo Generator</span>
        </h1>
        <p className="text-xl text-center text-muted-foreground dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Describe your brand and let our AI create a unique logo for you in seconds. It's that simple!
        </p>
        <LogoGenerator />
      </div>
      <Footer />
    </main>
  );
}
