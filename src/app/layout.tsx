import { Inter } from "next/font/google";
import ProviderWrapper from "@/app/ProviderWrapper";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gestion de categorías - INDITEX",
  description: "Gestion de categorías",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Toaster />
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
