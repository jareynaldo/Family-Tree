import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';

import { AuthProvider } from '@/context/AuthContext';
import { FamilyProvider } from '@/context/FamilyContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Easy Tree - Family Tree Management",
  description: "Create and manage your family tree with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-50 min-h-screen`}>
        <AuthProvider>
          <FamilyProvider>
            <Navbar />
            {children}
          </FamilyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
