import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import SessionProviderWrapper from '../components/SessionProviderWrapper';
import NavBar from '../components/ui/NavBar';

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
          <NavBar />
          {children}
        </SessionProviderWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}