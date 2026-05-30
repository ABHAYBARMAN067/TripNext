import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NavBar from "../components/ui/NavBar";
import SessionProviderWrapper from "../components/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TripNest - Find Your Perfect Stay",
  description: "Airbnb-inspired travel listing platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <Suspense fallback={null}>
            <NavBar />
          </Suspense>
          {children}
        </SessionProviderWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}