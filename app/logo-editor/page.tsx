import { Suspense } from "react";
import Header from "@/components/header";
import LogoEditor from "@/components/logo-editor";
import Footer from "@/components/footer";

export default function LogoEditorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
      <LogoEditor />
      </Suspense>
      <Footer />
    </main>
  );
}
