import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elohimtech - Premium Gadgets Store",
  description: "Shop premium laptops and accessories with real-time availability tracking. Order directly via WhatsApp.",
  keywords: ["laptops", "gadgets", "electronics", "Nigeria", "tech store", "accessories"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

