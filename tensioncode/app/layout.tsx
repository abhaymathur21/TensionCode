import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ICON from "@/assets/logo.svg";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TensionCode",
  description: "CodeGen Experience",
  icons: {
    icon: ICON.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn`font-san overflow-clip bg-slate-900`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
