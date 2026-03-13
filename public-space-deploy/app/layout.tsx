import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/ui/ReduxProvider";

export const metadata: Metadata = {
  title: "Public Space",
  description: "Share photos & videos with the community",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
