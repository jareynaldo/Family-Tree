import { Inter } from "next/font/google";
import "./globals.css";

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
      <body>
        <AuthProvider>
          <FamilyProvider>
            {children}
          </FamilyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
