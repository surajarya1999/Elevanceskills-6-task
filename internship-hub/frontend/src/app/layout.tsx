import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/ui/ReduxProvider";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = { title: "InternshipHub", description: "Find internships" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <ReduxProvider>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
