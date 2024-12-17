import Header from '@/components/header';
import About from '@/components/about';
import Footer from '@/components/footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <About />
      <Footer />
    </main>
  );
}