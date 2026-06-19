import { Suspense } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import TopLoader from "@/components/public/TopLoader";
import InitialLoader from "@/components/public/InitialLoader";
import { Toaster } from "sonner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <InitialLoader />

      <Suspense>
        <TopLoader />
      </Suspense>

      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <Toaster position="top-right" richColors />
    </>
  );
}
