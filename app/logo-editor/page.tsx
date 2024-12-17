import { Suspense } from "react";
import Header from "@/components/header";
import LogoEditor from "@/components/logo-editor";
import Footer from "@/components/footer";

export default function LogoEditorPage() {

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container min-h-screen mx-auto py-12 px-4">
        <Suspense fallback={<div>Loading...</div>}>
          <LogoEditor />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}