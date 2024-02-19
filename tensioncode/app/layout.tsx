import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ICON from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";
import BG from "@/assets/bg.jpg";

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
      <body className={cn`font-san overflow-clip bg-slate-900/60`}>
        <Image
          src={BG}
          layout="fill"
          objectFit="cover"
          objectPosition="bottom"
          alt="Background"
          className="fixed inset-0 z-[-1] blur-[10px] filter"
        />
        <Image
          src="/logo.svg"
          alt="TensionCode Logo"
          className="fixed left-4 top-4 z-10 size-24"
          width={128}
          height={128}
          priority
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
